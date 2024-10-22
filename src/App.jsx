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
import Registration from "./pages/registration/registration";
import Profile from "./pages/profile/Profile"; // Импортируйте ваш компонент Profile
import "./App.scss";

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
          <Route path="/registration" element={<Registration />} />
          <Route path="/profile" element={<Profile />} />{" "}
          {/* Добавьте маршрут для профиля */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
