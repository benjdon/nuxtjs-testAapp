<template>
    <v-alert type="error" v-html="errorMsg" :value="showErrorMsg" class="py-2 mt-5">
        {{ errorMsg }}
    </v-alert>
</template>

<script>
    export default {
        props: [ 'showErrorMsg', 'errorMsg' ]
    }
</script>