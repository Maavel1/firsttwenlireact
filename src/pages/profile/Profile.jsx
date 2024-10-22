// src/pages/profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";

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

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        setUser(null); // Сбрасываем состояние пользователя
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

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
          <button onClick={handleLogout}>Logout</button> {/* Кнопка выхода */}
        </>
      ) : (
        <p>Please log in to see your profile.</p>
      )}
    </div>
  );
};

export default Profile;
