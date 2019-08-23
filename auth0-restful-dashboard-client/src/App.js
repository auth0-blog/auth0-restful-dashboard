import React from 'react';
import './App.css';
import ResourceRenderer from './ResourceRenderer';
import { useAuth0 } from "./react-auth0-wrapper";

function App() {
  const { loading, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div className="App">
      {!isAuthenticated && loginWithRedirect({})}

      {isAuthenticated && <ResourceRenderer/>}     
    </div>
  );
}

export default App;
