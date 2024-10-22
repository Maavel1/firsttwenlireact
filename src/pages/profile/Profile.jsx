// src/pages/profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
        picture: currentUser.photoURL,
      });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <img src={user.picture} alt={user.name} />
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>Please log in to see your profile.</p>
      )}
    </div>
  );
};

export default Profile;
