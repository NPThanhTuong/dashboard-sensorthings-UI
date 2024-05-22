import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";
import PublicLayout from "./layout/PublicLayout";
import LoginPage from "./pages/login_page/LoginPage";
import RegisterPage from "./pages/register_page/RegisterPage";
import HomePage from "./pages/home_page/HomePage";
import ObservationPage from "./pages/observation_page/ObservationPage";
import MapPage from "./pages/map_page/MapPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/quan-sat" element={<ObservationPage />} />
          <Route path="/ban-do" element={<MapPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
