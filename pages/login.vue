<template>
    <div id="login-container">
        <v-card height="500" width="850" class="d-flex align-center mx-auto rounded-0">
            <div style="width: 100%">
                <v-card flat class="px-5 ma-auto" width="400">
                <v-card-title class="d-block text-center">
                    <h2 class="grey--text text--darken-3 mt-5">Sign in to TestApp</h2>
                </v-card-title>
                <v-card-text class="text-center mt-3">
                    <v-form ref="form" lazy-validation @submit="loginUser(userInfo)" onSubmit="return false;">
                        <v-text-field v-model="userInfo.username"
                                outlined
                                dense
                                label="Username"
                                :rules="usernameRules"
                                append-icon="mdi-account-outline"></v-text-field>
                        <v-text-field v-model="userInfo.password"
                                    label="Password"
                                    :type="showPassword ? 'text' : 'password'"
                                    :append-icon="showPassword ? 'mdi-lock-open-outline' : 'mdi-lock-outline'"
                                    @click:append="showPassword = !showPassword"
                                    :rules="inputRules" outlined dense></v-text-field>
                        <v-btn type="submit" depressed rounded class="brand-color px-10 mt-3" :loading="isLoading">SIGN IN</v-btn>
                    </v-form>
                </v-card-text>
                </v-card>

                <div class="mx-15 text-center">
                <ErrorsAlert :show-error-msg="showLoginErrorMsg" :error-msg="loginErrorMsg"/>
                </div>
            </div>
            <div class="d-flex align-center justify-center rounded-0 login-side-bg">
                <div class="white--text text-center">
                <h1>Hello There</h1>
                <p>Start your journey with us!</p>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script>
    import ErrorsAlert from "../components/ErrorsAlert";

    export default {
        components: {ErrorsAlert},
        layout: "default",
        middleware: ["authenticated"],
        data: () => ({
            valid: false,
            showPassword: false,
            userInfo: {},
            loginErrorMsg: "",
            showLoginErrorMsg: false,
            inputRules: [
                v => !!v || "Password is required",
            ],
            usernameRules: [
                v => !!v || "Username is required",
            ],
            isLoading: false
        }),
        methods: {
            async loginUser(loginInfo) {
                this.isLoading = true;
                this.showLoginErrorMsg = false;

                if(this.$refs.form.validate()) {
                    try {
                        const result = await this.$auth.loginWith("local", {
                            data: loginInfo
                        })

                        this.$router.push("/");
                    } catch (e) {
                        this.isLoading = false;
                        this.showLoginErrorMsg = true;
                        this.loginErrorMsg = "No active account found with the given credentials";
                    }
                } else {
                    this.isLoading = false;
                }
            }
        },
    }                                   
</script>
