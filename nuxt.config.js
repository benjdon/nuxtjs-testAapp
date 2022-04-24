export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'testAapp',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'view-design/dist/styles/iview.css',
    '@/assets/css/variables.scss',
    '@/assets/css/style.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/view-ui'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  axios: {
    baseURL: "https://t.beyondbytes.dev"
  },
  auth: {
    strategies: {
        local: {
            scheme: 'refresh',
            token: {
                property: 'access',
            },
            refreshToken: {
                property: 'refresh',
                data: 'refresh'
            },
            user: {
                property: false,
            },
            endpoints: {
                login: { url: '/auth/jwt/create', method: 'post' },
                user: { url: '/auth/users/me', method: 'get' },
                refresh: { url: '/auth/jwt/refresh', method: 'post' }
            }
        },
    }
  }
}
