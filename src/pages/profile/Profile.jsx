import React, { useEffect, useState } from "react";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
} from "firebase/auth";
import DefaultAvatar from "../../assets/defualt-avatar.png";
import Loader from "../../UI/Loader/loader";

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
      }
    };

    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "User",
          email: currentUser.email,
          picture: currentUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Отписка от слушателя при размонтировании компонента
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
    return <Loader />;
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
