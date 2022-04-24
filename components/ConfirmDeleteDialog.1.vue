<template>
    <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
            <v-card-title class="headline pt-8">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions  class="pa-5">
                <v-spacer></v-spacer>
                <v-btn color="blue-grey" class="ma-2 white--text" @click="dialogClose">Cancel</v-btn>
                <v-btn v-bind:disabled="isDeleting" color="info" class="ml-2 px-7 white--text" @click="dialogOk">Yes</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: [ 'dialogDelete', 'isDeleting' ],
        methods: {
            dialogClose() {
                this.$emit('clicked-close');
            },
            dialogOk() {
                this.$emit('clicked-ok');
            }
        }
    }
</script>