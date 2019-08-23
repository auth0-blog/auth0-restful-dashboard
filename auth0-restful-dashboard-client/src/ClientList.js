import React from 'react';
import './ClientList.css';

function ClientList(props) {
  const stateTransitionManager = props.stateTransitionManager;
  const clients = props.clients.map( client =>
      <li key={client.id} 
      className='clientItem'
      onClick={()=>stateTransitionManager.handleStateTransition(client.links[0])}>
        <b>{client.name}</b><br/>
        <i>{client.description}</i>
      </li>
    );

  return (
    <div>
      <h2>Your applications</h2>
      <ul className='clientList'>
        {clients}
      </ul>
    </div>
  );
}

export default ClientList;