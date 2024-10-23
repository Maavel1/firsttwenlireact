import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import NavBar from "./UI/NavBar/NavBar";
import Contact from "./pages/contact/contact";
import Order from "./pages/order/order";
import Service from "./pages/sevice/service";
import Home from "./pages/Home/Home";
import Authorization from "./pages/Authorization/Authorization";
import Profile from "./pages/profile/Profile";
import "./App.scss";
import CreateService from "./pages/CreateService";

function App() {
  return (
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
          <Route path="/profile" element={<Profile />} />{" "}
          {/* Добавьте маршрут для профиля */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
