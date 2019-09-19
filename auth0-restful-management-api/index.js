const express = require('express');
const bodyParser = require('body-parser');
const Auth0Manager = require('./Auth0Manager');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

require('dotenv').config();
const apiPrefix = '/api';

const app = express();

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.CLIENT_DOMAIN}/.well-known/jwks.json`
    }),  
    audience: process.env.API_IDENTIFIER,
    issuer: `https://${process.env.CLIENT_DOMAIN}/`,
    algorithms: ['RS256']
  });

app.use(checkJwt);

app.use(bodyParser.json());

app.get(apiPrefix, async (req, res) => {
    const clientsState = await getClients();

    res.send(clientsState);
});

app.get(`${apiPrefix}/clients/:clientId`, async (req, res) => {
    const clientState = await getClient(req.params.clientId);

    res.send(clientState);
});

app.put(`${apiPrefix}/clients/:clientId`, async (req, res) => {
    const updatedData = req.body;

    await updateClient(req.params.clientId, updatedData);

    res.sendStatus(200);
});

app.listen(3001, () => {
    console.log('listening on port 3001');
});

async function getClients() {
    await Auth0Manager.init();

    const clients = await Auth0Manager.getClients();
    const clientList = clients.map(client => ({
        id: client.client_id,
        name: client.name,
        description: client.description || "",
        links: [{
            uri: `${apiPrefix}/clients/${client.client_id}`,
            rel: "client"
        }]
    }));

    return { resourceType: "client-list", clients: clientList };
}

async function getClient(clientId) {
    await Auth0Manager.init();

    const client = await Auth0Manager.getClient(clientId);

    return {
        resourceType: "client",
        id: client.client_id,
        name: client.name,
        description: client.description || "",
        links: [{
            uri: `${apiPrefix}/clients/${client.client_id}`,
            rel: "self"
        },
        {
            uri: `${apiPrefix}/clients/${client.client_id}`,
            rel: "self",
            type: "PUT"
        }]
    };
}

async function updateClient(clientId, updatedData) {
    await Auth0Manager.init();
    await Auth0Manager.updateClient(updatedData, clientId);
}