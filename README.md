# Shopify Node App

The goal of this example app is to provide a starting point for Shopify app developers so that they will be able to quickly
spin up an embedded Shopify app using Node and Express.js and get started using the Polaris design system and React components.

This example app uses Node, Express, Webpack, React, Redux, and Shopify/polaris

## Features
- [x] React app using [Polaris](https://polaris.shopify.com/)
- [x] Shopify Authentication
- [x] Get API data from Shopify and pass it to React
- [x] Hot reloading with Webpack
- [x] Example data flow with Redux and Polaris React components
- [x] Example webhook set up

## Commands
- `yarn run start` run the server
- `yarn run dev` run it in development mode with hotreloading
- `yarn run prod` run it in production mode with compiled assets
- `yarn run clean` clean the compiled assets directory

## Running the project locally

### Install project dependencies
- Install Node.js version 8.1.0 or higher. We recommend using [nvm](https://github.com/creationix/nvm) to manage Node versions.
- Install the [Yarn.js](https://yarnpkg.com/en/docs/install) package manager. Yarn is an alternative to npm that is faster and more reliable.
- Install project dependencies with `yarn install`

### Allow your app to talk to Shopify
- Create a tunnel to localhost:3000 using [forward](https://forwardhq.com/) or [ngrok](https://ngrok.com/)
  - Note the tunnel url (we’ll refer to it as `HOST`)

### Register your app in the Partner Dashboard
- Sign into your [Shopify Partner Dashboard](https://partners.shopify.com/organizations)
- Click 'Apps' in the sidebar and create a new app
- Set the app url to `{{ HOST }}/`
- Set the whitelisted URL to `{{ HOST }}/shopify/auth/callback`
- Go to extensions tab and enable “Embed in Shopify admin”

### Configure and add to a store
- Rename `.env.example` to `.env` and
  - Set Add HOST from your tunnel service as `SHOPIFY_APP_HOST`
  - Add the api key from partners dash as `SHOPIFY_APP_KEY`
  - Add the api secret from partners dash as `SHOPIFY_APP_SECRET`
- Run `yarn install && yarn run start`
- Open a browser to `{{ HOST }}/install`
- Enter your store’s domain and hit install
- 🚀 🎉

## Architecture

There are three main sections that provide the foundations for this example. They are organized as follows:

### `server`
This folder provides the Express.js server as well as a few basic views.
The server provides some example endpoints that demonstrate mounting the Shopify routes for installation and authentication, hosting the React app
with an API proxy, and a basic webhook.

The code here is mostly glue code, with the bulk of the actual functionality provided by the modules in `shopify-express`.

### `shopify-express`
This example app consumes the [shopify-express](https://github.com/shopify/shopify-express-app) library to quickly connect to the Shopify API.

### `shopify-api-node`
This example app uses the Official [shopify-api-node](https://github.com/MONEI/Shopify-api-node) library to connect to the Shopify API.

### `client`
This folder contains the UI demo using Polaris React components and Redux to manage app state.
It has two subfolders called `store` and `actions` which are Redux concepts.

`store` is the thing that models the state of the app. Every Redux action sends a message to a function called a 'reducer'.
The reducer uses the information in the message to progress the state of the app.
For simplicity, we included the reducer in the same file as the store configuration.

`actions` are the functions that are fired from interactions with the UI.
