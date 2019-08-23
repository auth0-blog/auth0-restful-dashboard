const axios = require('axios');
const ManagementClient = require('auth0').ManagementClient;

/**
 * The module to interact with the Auth0Management API
 *
 * Requirements:
 *  - Have an Auth0 account and an account name.
 *  - Have a management API: https://manage.auth0.com/dashboard/us/{DOMAIN}/apis
 *
 * How this works:
 *  1. Requests an access token using client_id and client_secret
 *  2. Uses the access token to create a new ManagementClient
 *  3. Use the ManagementClient to interact with the API:
 *     https://auth0.github.io/node-auth0/module-management.ManagementClient.html
 *
 * Example usage to get a client:
 *
 * const Auth0Manager = require('./Auth0Manager');
 * Auth0Manager
 *  .init()
 *  .then(() => Auth0Manager.getClient())
 *  .then(client => res.json(client))
 *  .catch(err => res.json({ message: 'There was an error!', ...err }));
 */

module.exports = (function () {
    let managementClient;

    return {
        init,
        getClient,
        getClients,
        updateClient
    };

    /**
     * Create a management client
     */
    function init() {
        return getToken()
            .then(data => data.access_token)
            .then(token => {
                const managementClient = new ManagementClient({
                    domain: `${process.env.CLIENT_DOMAIN}`,
                    token,
                    audience: `https://${process.env.CLIENT_DOMAIN}/api/v2/`
                });

                // set it so we can use it in our other methods
                this.managementClient = managementClient;
                return true;
            })
            .catch(err => err);
    }

    /**
     * Get an access token from the Auth0 API
     * We will use this access token to connect to the management API
     * To get a token, we need to provide client_id and client_secret
     * Both of these can be found in the APIs section of Auth0 dashboard
     */
    function getToken() {
        // get the info we need
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const url = `https://${process.env.CLIENT_DOMAIN}/oauth/token`;

        // make the call to the API via POST
        return axios
            .post(url, {
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials',
                audience: `https://${process.env.CLIENT_DOMAIN}/api/v2/`
            })
            .then(res => res.data)
            .catch(err => err);
    }

    /**
     * Make a call to the Management API to get all the data for a certain client
     * All the things that are available in the dashboard can be accessed here
     * @param string clientId
     */
    function getClient(clientId = null) {
        if (!clientId) clientId = process.env.CLIENT_ID;

        return this.managementClient
            .getClient({ client_id: clientId })
            .then(client => client)
            .catch(err => err);
    }

 /**
     * Make a call to the Management API to get all the data for a all the clients
     * All the things that are available in the dashboard can be accessed here
     * @param string clientId
     */
    function getClients() {
        return this.managementClient
            .getClients()
            .then(clients => clients)
            .catch(err => err);
    }

    /**
     * Take data and update the Auth0Client
     * This can be used to update the entire client via API instead of in the dashboard
     * Very helpful if moving settings from local to a production environment
     *
     * @param {Object} data     The data that will overwrite anything in our dashboard
     * @param {String} clientId The client that we want to update
     */
    function updateClient(data, clientId = null) {
        if (!clientId) clientId = process.env.CLIENT_ID;

        return this.managementClient
            .updateClient({ client_id: clientId }, data)
            .then(client => client)
            .catch(err => err);
    }
})();
