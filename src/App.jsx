import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import NavBar from "./UI/NavBar/NavBar";
import Contact from "./pages/contact/contact";
import Order from "./pages/order/order";
import Service from "./pages/sevice/service";
import Home from "./pages/Home/Home";
import Authorization from "./pages/Authorization/Authorization";
import Profile from "./pages/profile/Profile";
import "./App.scss";

import CreateService from "./pages/CreateService";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import PhoneAuth from "./components/PhoneAuth/PhoneAuth";
import Footer from "./components/Footer/Footer";
import { UserProvider } from "./components/UserContext/UserContext";

function App() {
  return (
    <>
      <UserProvider>
        <div className="rows-container">
          <div className="content">
            <div className="container">
              <Router>
                <NavBar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/order" element={<Order />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/service" element={<Service />} />
                  <Route path="/authorization" element={<Authorization />} />
                  <Route path="/сreateService" element={<CreateService />} />
                  <Route path="/phoneAuth" element={<PhoneAuth />} />
                  <Route
                    path="/profile"
                    element={<PrivateRoute element={<Profile />} />}
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </div>
          </div>
          <Footer />
        </div>
      </UserProvider>
    </>
  );
}

export default App;
