<template>
    <div class="dataTable">
        <v-toolbar flat v-if="hasNewItem" color="grey lighten-5 mb-3">
            <div class="d-flex align-center">
                <NuxtLink v-if="backPath != null" :to="backPath" class="mr-5">
                    <v-btn elevation="1" small><v-icon>mdi-chevron-double-left</v-icon></v-btn>
                </NuxtLink>
                <h2 class="title">{{ title }}
                    <v-btn fab dark small hide-details
                           class="ml-3 brand-color"
                           elevation="1"
                           @click="newItem()">
                        <v-icon dark>mdi-plus</v-icon>
                    </v-btn>
                </h2>
            </div>
            <v-spacer></v-spacer>
        </v-toolbar>

        <v-card elevation="0" outlined>
            <v-data-table
                    :headers="headers"
                    :items="dataList"
                    :loading="fetchingData"
                    loading-text="Updating data... Please wait"
                    :options.sync="options"
                    :server-items-length="totalItems"
                    :footer-props="{
                        itemsPerPageOptions: rowsPerPageItems
                    }"
            >
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon v-if="hasEditIcon == null ? true : hasEditIcon" small color="white" class="mr-2 warning pa-2 rounded-lg" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon v-if="hasDeleteIcon == null ? true : hasDeleteIcon" small color="white" class="mr-2 error pa-2 rounded-lg" @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>

            <ConfirmDeleteDialog :is-deleting="isDeleting" :dialog-delete="dialogDelete" @clicked-close="closeDelete" @clicked-ok="deleteItemConfirm"/>
        </v-card>
    </div>
</template>

<script>
    import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

    export default {
        components: {ConfirmDeleteDialog},
        props: [ "title", "itemsPerPage", "headers", "fetchUrl", "hasNewItem", "hasDeleteIcon", "hasEditIcon", "editedItem", "rowsPerPageItem", 'backPath'],
        data: () => ({
            dataList: [],
            search: "",
            dialogDelete: false,
            isDeleting: false,
            options: {},
            totalItems: 0,
            fetchingData: true,
            rowsPerPageItems: [50, 100, 200],
            editedIndex: -1,
            page: 0,
            nextAPI: "",
            prevAPI: "",
            appendedOptions: "",
            paramOptions: "",
            customOptions: {},
            defaultItem: {}
        }),
        watch: {
            options: {
                handler () {
                    this.getDataFromApi()
                },
                deep: true,
            },
        },
        methods: {
            getDataFromApi() {
                this.fetchingData = true;
                this.dataList = [];
                this.paramOptions = "";

                if(this.options.page > this.page) {
                    // next
                    if(this.nextAPI != null) {
                        const nextR = this.nextAPI.split("?");
                        const urlParamsNext = new URLSearchParams(nextR[1]);
                        this.customOptions.offset = urlParamsNext.get("offset");
                    }
                } else  {
                    // previous
                    if(this.prevAPI != null && this.options.page != this.page) {
                        const previuosR = this.prevAPI.split("?");
                        const urlParamsPrev = new URLSearchParams(previuosR[1]);
                        this.customOptions.offset = urlParamsPrev.get("offset");

                        if(this.customOptions.limit != this.options.itemsPerPage) {
                            this.customOptions.offset = 0;
                        }
                    }
                }
               
                this.customOptions.limit = this.options.itemsPerPage;
                this.paramOptions = "?limit=" + this.options.itemsPerPage + "&offset=" +  this.customOptions.offset;

                this.fetchFromServer().then(data => {
                    this.dataList = data.items;
                    this.totalItems = data.total;
                    this.fetchingData = false;
                    this.nextAPI = data.nextAPI;
                    this.prevAPI = data.previousAPI;
                    this.page = this.options.page;
                })
            },
            async fetchFromServer() {
                const data = await this.$axios.$get(this.fetchUrl + this.paramOptions);

                return new Promise((resolve, reject) => {
                    const {sortBy, sortDesc, page, itemsPerPage} = this.options;

                    let items = data.results;
                    const total = data.count;
                    const nextAPI = data.next;
                    const previousAPI = data.previous;
                    
                    if (sortBy.length === 1 && sortDesc.length === 1) {
                        items = items.sort((a, b) => {
                            const sortA = a[sortBy[0]];
                            const sortB = b[sortBy[0]];
                            if (sortDesc[0]) {
                                if (sortA < sortB) return 1;
                                if (sortA > sortB) return -1;
                                return 0
                            } else {
                                if (sortA < sortB) return -1;
                                if (sortA > sortB) return 1;
                                return 0
                            }
                        })
                    }

                    setTimeout(() => {
                        resolve({
                            items,
                            total,
                            nextAPI,
                            previousAPI
                        })
                    }, 1000)
                });
            },
            newItem() {
                if(this.$parent.$refs.form) {
                    this.$parent.$refs.form.resetValidation();
                }

                this.editedIndex = -1;
                this.$emit("open-dialog", {state: true, index: this.editedIndex});
                this.$emit("update-items", { items:  Object.assign({}, this.defaultItem), index: this.editedIndex, type: "new"});
            },
            async editItem(item) {
                this.editedIndex = this.dataList.indexOf(item);
                this.$emit("open-dialog", {state: true, index: this.editedIndex});

                const user = await this.$axios.$get(this.fetchUrl + item.id);
                this.$emit("update-items", { items: user, index: this.editedIndex, type: "edit"});
            },
            deleteItem(item) {
                this.editedIndex = this.dataList.indexOf(item);
                this.$emit("update-items", { items:  Object.assign({}, item), index: this.editedIndex, type: "delete"});
                this.dialogDelete = true;
            },
            deleteItemConfirm() {
                this.isDeleting = true;
                this.$axios.$delete(this.fetchUrl + this.editedItem.id)
                .then(() => {
                    this.isDeleting = false;
                    this.getDataFromApi();
                    this.closeDelete()
                })
                .catch(function (e) {
                    console.log(e);
                });
            },
            close() {
                this.$emit("open-dialog", {state: false, index: this.editedIndex});
                this.$parent.$nextTick(() => {
                    this.editedIndex = -1;
                    this.$emit("update-items", { items:  Object.assign({}, this.defaultItem), index: this.editedIndex, type: "close"});
                });
            },
            closeDelete() {
                this.dialogDelete = false;
                this.$parent.$nextTick(() => {
                    this.editedIndex = -1;
                    this.$emit("update-items", { items:  Object.assign({}, this.defaultItem), index: this.editedIndex, type: "close"});
                });
            },
            save() {
                const data = this.editedItem;

                if(this.editedIndex >= 0) {
                    this.$axios.$patch(this.fetchUrl + data.id, data)
                    .then((result) => {
                        this.getDataFromApi();
                        this.close();
                    })
                    .catch(({ response }) => {
                        console.log(response)
                        this.$emit("show-errors", response.data);
                    });
                } else {
                    this.$axios.$post(this.fetchUrl, data)
                    .then((result) => {
                        this.getDataFromApi();
                        this.close();
                    })
                    .catch(({ response }) => {
                        this.$emit("show-errors", response.data.errors);
                    });
                }
            },
        }
    }
</script>