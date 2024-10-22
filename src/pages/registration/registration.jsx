import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Registration = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <img src={user.picture} alt={user.name} />
          <p>Email: {user.email}</p>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </button>
        </>
      ) : (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}
    </div>
  );
};

export default Registration;
