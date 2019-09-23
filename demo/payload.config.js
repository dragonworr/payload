export default {
  port: 3000,
  serverUrl: "http://localhost:3000",
  cors: ['http://localhost:8080', 'http://localhost:8081'],
  adminURL: "/payload-login",
  routes: {
    api: "/api",
    admin: "/admin"
  },
  mongoURL: "mongodb://localhost/payload",
  roles: [
    "admin",
    "editor",
    "moderator",
    "user",
    "viewer"
  ],
  localization: {
    locales: [
      "en",
      "es"
    ],
    defaultLocale: "en",
    fallback: true
  },
  staticUrl: "/media",
  staticDir: "demo/media",
  imageSizes: [
    {
      name: "tablet",
      width: 640,
      height: 480,
      crop: "left top"
    },
    {
      name: "mobile",
      width: 320,
      height: 240,
      crop: "left top"
    },
    {
      name: "icon",
      width: 16,
      height: 16
    }
  ],
  email: {
    provider: "mock"
  },
  graphQL: {
    path: "/graphql",
    graphiql: true
  }
};
