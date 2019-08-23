import React, { useState} from 'react';
import './Client.css';

function Client(props) {
  const stateTransitionManager = props.stateTransitionManager;
  const client = props.client;
  const [clientName, setClientName] = useState(client.name);
  const [clientDescription, setClientDescription] = useState(client.description);
  const buttons = client.links.map((link, index) => {
    let button;

    switch (true) {
      case (link.rel === "self" && (!link.type || link.type === "GET")):
        button = <button key={index} onClick={() => stateTransitionManager.handleStateTransition(link)}>Reload</button>;
        break;
      case (link.rel === "self" && (link.type === "PUT")):
        button = <button key={index} onClick={() => stateTransitionManager.handleStateTransition(link, {name: clientName, description: clientDescription})}>Save</button>;
        break;
      default:
        button = null;
    }
    return button;
  });

  return (
    <div className="formContainer">
      <div className='formRow'>
        <label htmlFor="clientName">Client name: </label>
        <input name="clientName" id="clientName" value={clientName} onChange={event => setClientName(event.target.value)}/>
      </div>
      <div className='formRow'>
        <label htmlFor="clientDescription">Client description: </label>
        <input name="clientDescription" id="clientDescription" value={clientDescription} onChange={event => setClientDescription(event.target.value)}/>
      </div>
      <div className='formRow'>
        {buttons}
      </div>
    </div>
  );
}

export default Client;