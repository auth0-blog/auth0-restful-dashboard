import React, { useState, useEffect } from 'react';
import ClientList from './ClientList';
import Client from './Client';
import { useAuth0 } from "./react-auth0-wrapper";

function handleResource(link, data, token){
  return fetch(link.uri, {
      method: link.type || "GET",
      headers: (link.type === "PUT"? new Headers({"Content-Type": "application/json", "Authorization": `Bearer ${token}`}) : new Headers({"Accept": "application/json", "Authorization": `Bearer ${token}`})),
      body: (data? JSON.stringify(data) : null)
    })
    .then(response => {
      const contentType = response.headers.get("content-type");
      let parsedResponse;

      if (contentType && contentType.indexOf("application/json") !== -1) {
        parsedResponse = response.json();
      } else {
        parsedResponse = response.text();
      }
      return parsedResponse;
    })
}

function mapResourceToComponent(resource, stateTransitionManager) {
  let currentComponent;

  switch(resource.resourceType) {
    case "client-list":
      currentComponent = <ClientList clients={resource.clients} stateTransitionManager={stateTransitionManager}/>
      break;
    case "client":
      currentComponent = <Client client={resource} stateTransitionManager={stateTransitionManager}/>
      break;
    default:
      currentComponent = null;
    }

    return currentComponent;
}

function ResourceRenderer() {
  const [currentResource, setCurrentResource] = useState({});
  const { getTokenSilently } = useAuth0();

  const stateTransitionManager = {
    handleStateTransition: (link, data) => {
      getTokenSilently()
        .then(token =>handleResource(link, data, token))
        .then(resource => {
          if (typeof resource === "object") {
            setCurrentResource(resource)};
          })
        .catch(error => console.log(error));
    }    
  };

  useEffect(()=>{
    stateTransitionManager.handleStateTransition({uri: "/api"});
  }, []);

  return (
    <div>
      {mapResourceToComponent(currentResource, stateTransitionManager)}
    </div>
  );
}

export default ResourceRenderer;