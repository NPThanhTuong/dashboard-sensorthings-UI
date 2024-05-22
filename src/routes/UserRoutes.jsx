import HomePage from "../pages/home_page/HomePage";
import ObservationPage from "../pages/observation_page/ObservationPage";
import MapPage from "../pages/map_page/MapPage";
import ProtectedRoute from "./ProtectedRoute";
import { Routes, Route } from "react-router-dom";

const UserRoutes = () => (
  <Routes>
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/quan-sat" element={<ObservationPage />} />
      <Route path="/ban-do" element={<MapPage />} />
    </Route>
  </Routes>
);

export default UserRoutes;
