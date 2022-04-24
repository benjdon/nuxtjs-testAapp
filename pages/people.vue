<template>
    <v-card width="80%" class="mx-auto rounded-0 pa-10">
        <DataTable ref="dataTable"
            title="People"
            :headers="headers"
            :fetch-url="fetchUrl"
            :has-new-item="hasNewItem"
            :edited-item="editedItem"
            :has-delete-icon="hasDeleteIcon"
            :rows-per-page-item="rowsPerPageItem"
            back-path="/"
            @open-dialog="dialogEvt"
            @update-items="updateEditedItem"
            @show-errors="showErrors"
        />

        <template>
            <v-row justify="center">
                <v-dialog v-model="dialog" persistent max-width="600px">
                    <v-card>
                        <v-form ref="form" lazy-validation @submit="save" onSubmit="return false;">
                            <v-card-title class="py-5 px-8">
                                <h3 class="headline">{{ formTitle }}</h3>
                                <v-spacer></v-spacer>
                            </v-card-title>
                            <v-progress-linear :indeterminate="progressLoading" :active="progressLoading" color="cyan"></v-progress-linear>
                
                            <v-divider class="mb-7"></v-divider>

                            <v-card-text class="px-8 py-0">
                                <v-text-field v-model="editedItem.first_name" label="First Name" :rules="inputRules" outlined dense></v-text-field>
                                <v-text-field v-model="editedItem.last_name" label="Last Name" :rules="inputRules" outlined dense></v-text-field>
                                <v-text-field v-model="editedItem.street" label="Street" :rules="inputRules" outlined dense></v-text-field>
                                <v-text-field v-model="editedItem.city" label="City" :rules="inputRules" outlined dense></v-text-field>
                                <v-text-field v-model="editedItem.zipcode" label="Zipcode" :rules="inputRules" outlined dense></v-text-field>

                                <ErrorMsg :show-error-msg="showErrorMsg" :error-msg="errorMsg"/>
                            </v-card-text>

                            <DialogActions :is-saving="isSaving" @clicked-close="close" @clicked-save="save"/>
                        </v-form>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>
    </v-card>
</template>

<script>
    import DataTable from "../components/DataTable";
    import ErrorMsg from "../components/ErrorsAlert"
    import DialogActions from "../components/DialogActions";

    export default {
        name: "people",
        layout: "default",
        components: {DialogActions, DataTable, ErrorMsg },
        middleware: ["auth"],
        data: () => ({
            dialog: false,
            headers: [
                { text: "ID", value: "id" },
                { text: "First Name", value: "first_name" },
                { text: "Last Name", value: "last_name" },
                { text: "Street", value: "street" },
                { text: "City", value: "city" },
                { text: "Zipcode", value: "zipcode" },
                { text: "Actions", value: "actions", sortable: false },
            ],
            fetchUrl: "https://t.beyondbytes.dev/api/people/",
            hasNewItem: true,
            hasDeleteIcon: true,
            editedItem: {},
            editedIndex: -1,
            inputRules: [
                v => !!v || "Item is required",
            ],
            errorMsg: "",
            showErrorMsg: false,
            isSaving: false,
            progressLoading: false,
            rowsPerPageItem: [50, 100, 200]
        }),
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? "New" : "Edit"
            }
        },
        methods: {
            showErrors(params) {
                const errors = params;
                let strError = "";

                for (var key in errors) {
                    if (errors.hasOwnProperty(key)) {
                        strError += errors[key] + "<br/>";
                    }
                }

                this.errorMsg = strError;
                this.showErrorMsg = true;
                this.isSaving = false;
            },
            dialogEvt(params) {
                this.dialog = params.state;
                this.editedIndex = params.index;
                this.isSaving = false;
                this.showErrorMsg = false;
                this.progressLoading = true;
            },
            updateEditedItem(params) {
                this.editedIndex = params.index;
                this.editedItem = params.items;
                this.progressLoading = false;
                if(this.$refs.form) {
                    this.$refs.form.resetValidation();
                }
            },
            close() {
                this.$refs.dataTable.close();
                this.showErrorMsg = false;
            },
            save() {
                if (this.$refs.form.validate()) {
                    this.isSaving = true;
                    this.$refs.dataTable.save();
                    this.showErrorMsg = false;
                }
            }
        }
    }
</script>