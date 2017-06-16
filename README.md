# Shopify Node App

This example app uses node, express, webpack, react, redux, and Shopify/polaris

## Features
- [x] React app with polaris
- [x] Hot reloading
- [x] Example data flow with Redux and Polaris components
- [x] Shopify Auth
- [ ] Get api data from shopify and pass to react
- [ ] Server side rendering of react components

## Commands
- `yarn run start` run the server
- `yarn run dev` run it in dev mode with hotreloading
- `yarn run clean` clean the compiled assets directory

## Getting this to work locally
- clone :)
- Create a forward or ngrok tunnel pointing at your localhost:3000
  - Note the tunnel url (we'll refer to it as HOST)
- Create an empty `.env` file
- Create a new app on partners dashboard
- Set the app url to `HOST/`
- Set the whitelisted URL to `HOST/auth/shopify/callback`
- Go to extensions and enable embedded app
- In your `env` file
  - Add the api key from partners dash as `SHOPIFY_APP_KEY`
  - Add the api secret from partners dash as `SHOPIFY_APP_SECRET`
  - Add the hostname from your tunnel service as `SHOPIFY_APP_HOST`
- run `yarn run install && yarn run start`
- open a browser to your `HOST/install`
- click the install button
- 🚀 🎉
