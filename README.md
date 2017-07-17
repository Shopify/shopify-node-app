# Shopify Node App

This example app uses node, express, webpack, react, redux, and Shopify/polaris

## Features
- [x] React app with polaris
- [x] Hot reloading
- [x] Example data flow with Redux and Polaris components
- [x] Shopify Auth
- [x] Get api data from shopify and pass to react
- [ ] Server side rendering of react components

## Commands
- `yarn run start` run the server
- `yarn run dev` run it in dev mode with hotreloading
- `yarn run clean` clean the compiled assets directory

## Getting this to work locally

### Install external dependencies
- Install and run [Redis](https://redis.io/topics/quickstart)
  - Using homebrew: `brew install redis && brew services start redis`

### Allow your app to talk to Shopify
- Create a tunnel to localhost:3000 using [forward](https://forwardhq.com/) or [ngrok](https://ngrok.com/)
  - Note the tunnel url (we’ll refer to it as HOST)

### Register your app
- Sign into [partners dashboard](https://www.shopify.ca/partners)
- Create a new app
- Set the app url to `HOST/`
- Set the whitelisted URL to `HOST/auth/shopify/callback`
- Go to extensions tab and enable “Embed in Shopify admin”

### Configure and add to a store
- Clone: `git clone git@github.com:Shopify/shopify-node-app.git`
- Rename `.env.example` to `.env` and
  - Set Add HOST from your tunnel service as `SHOPIFY_APP_HOST`
  - Add the api key from partners dash as `SHOPIFY_APP_KEY`
  - Add the api secret from partners dash as `SHOPIFY_APP_SECRET`
- Run `yarn install && yarn run start`
- Open a browser to `HOST/install`
- Enter your store’s domain and hit install
- 🚀 🎉
