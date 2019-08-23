This repository contains a customized Auth0 dashboard implemented as a true RESTful system composed by an API (`auth0-restful-management-api` folder) and a React client (`auth0-restful-dashboard-client` folder).

## To run this:

1. Clone the repo: `git clone https://github.com/auth0-blog/auth0-restful-dashboard.git`
2. Move to `auth0-restful-management-api` folder 
3. Add Auth0 credentials to a new `.env` file created from the `env.example` file.
4. Run `npm install` to install the dependencies.
5. Run `node index.js` to start the server application
6. Move to `auth0-restful-dashboard-client/src` folder
7. Add Auth0 credentials to a new `auth_config.json` file created from the `auth_config.json.example` file.
8. Run `npm install` to install the dependencies.
9. Run `npm start` to launch the client application.
10. Your browser should open automatically and show the application UI. If it doesn't start automatically, please open it manually and point it to http://localhost:3000

## Requirements:

- [Node.js](https://nodejs.org) installed on your machine
- An [Auth0](https://auth0.com/) account.

