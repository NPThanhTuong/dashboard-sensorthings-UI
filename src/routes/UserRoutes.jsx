import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/home_page/HomePage";
import ObservationPage from "../pages/observation_page/ObservationPage";
import MapPage from "../pages/map_page/MapPage";
import LoginPage from "../pages/login_page/LoginPage";

const HomeRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/quan-sat" element={<ObservationPage />} />
    <Route path="/ban-do" element={<MapPage />} />
    <Route path="/dang-nhap" element={<LoginPage />} />
  </Routes>
);

export default HomeRoutes;
