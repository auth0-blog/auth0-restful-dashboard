import React from 'react';
import './App.css';
import ResourceRenderer from './ResourceRenderer';
import { useAuth0 } from './react-auth0-wrapper';

function App() {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  if (!isAuthenticated) {
    loginWithRedirect({});
  }

  return (
    <div className="App">
      {isAuthenticated && <ResourceRenderer/>}     
    </div>
  );
}

export default App;
