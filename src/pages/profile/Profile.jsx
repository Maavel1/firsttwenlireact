import React, { useEffect, useState } from "react";
import { getAuth, signOut, getRedirectResult } from "firebase/auth";
import DefaultAvatar from "../../assets/defualt-avatar.png";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          setUser({
            name: result.user.displayName || "User",
            email: result.user.email,
            picture: result.user.photoURL,
          });
        }
      } catch (error) {
        console.error("Error getting redirect result:", error);
      } finally {
        setLoading(false);
      }
    };

    handleRedirectResult();

    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
        picture: currentUser.photoURL,
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        setUser(null);
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
          <img
            src={user.picture ? user.picture : DefaultAvatar}
            alt={user.name}
          />
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Please log in to see your profile.</p>
      )}
    </div>
  );
};

export default Profile;
