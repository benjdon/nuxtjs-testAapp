<template>
    <div id="login-container">
        <v-card height="500" width="850" class="d-flex align-center mx-auto rounded-0">
            <div style="width: 100%">
                <v-card flat class="ma-auto" width="500">
                <v-card-title class="d-block text-center">
                    <h1 class="grey--text text--darken-3 mt-5">Welcome to TestApp</h1>
                </v-card-title>
                <v-card-text class="text-center mt-10">
                    <NuxtLink to="/people" class="mr-5">
                        <v-btn elevation="1" small class="brand-color">View List of People</v-btn>
                    </NuxtLink>
                </v-card-text>
                </v-card>
            </div>
        </v-card>
    </div>
</template>

<script>
    export default {
        layout: "default",
        middleware: ["auth"],
        data: () => ({
        }),
        methods: {
        },
    }                                   
</script>
