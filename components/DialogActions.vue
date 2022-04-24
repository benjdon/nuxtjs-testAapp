<template>
    <v-card-actions class="px-8 pt-0">
        <v-spacer></v-spacer>
        <v-btn class="ma-2 px-5 btn-cancel" @click="formClose" elevation="1">Cancel</v-btn>
        <v-btn type="submit" :loading="isSaving" class="ml-2 px-8 btn-save" elevation="1">Save</v-btn>
    </v-card-actions>
</template>

<script>
    export default {
        props: [ 'isSaving' ],
        methods: {
            formClose() {
                this.$emit('clicked-close');
            },
            formSave() {
                this.$emit('clicked-save');
            }
        }
    }
</script>