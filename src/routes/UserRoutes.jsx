import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/home_page/HomePage";
import ControlPage from "../pages/control_page/ControlPage";
import ObservationPage from "../pages/observation_page/ObservationPage";
import MapPage from "../pages/map_page/MapPage";

const HomeRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/dieu-khien" element={<ControlPage />} />
    <Route path="/quan-sat" element={<ObservationPage />} />
    <Route path="/ban-do" element={<MapPage />} />
    <Route path="/dang-nhap" element={<MapPage />} />
  </Routes>
);

export default HomeRoutes;
