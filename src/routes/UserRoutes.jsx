import { Routes, Route } from "react-router-dom";

import DefaultLayout from "../layout/DefaultLayout";
import PublicLayout from "../layout/PublicLayout";

import HomePage from "../pages/home_page/HomePage";
import LoginPage from "../pages/login_page/LoginPage";
import RegisterPage from "../pages/register_page/RegisterPage";
import ObservationPage from "../pages/observation_page/ObservationPage";
import MapPage from "../pages/map_page/MapPage";

import ProtectedRoute from "../routes/ProtectedRoute";
import StatisticalPage from "../pages/statistical_page/StatisticalPage";
import LightChart from "../components/chart_component/LightChart";
import SoilHumidityChart from "../components/chart_component/SoilHumidityChart";
import ChangePasswordPage from "../pages/change_password_page/ChangePasswordPage";
import UserInforPage from "../pages/user_infor_page/UserInforPage";

// Home Layout
import ListThings from "../components/home_component/thing_component/ListThings";
import AddThing from "../components/home_component/thing_component/AddThing";
import ListDataStream from "../components/home_component/datastream_component/ListDataStream";

const UserRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/dang-nhap" element={<LoginPage />} />
      <Route path="/dang-ky" element={<RegisterPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/thay-doi-mat-khau" element={<ChangePasswordPage />} />
        <Route path="/thong-tin-nguoi-dung" element={<UserInforPage />} />
        <Route path="/quan-sat" element={<ObservationPage />} />
        <Route path="/ban-do" element={<MapPage />} />
        <Route path="/thong-ke" element={<StatisticalPage />} />

        {/* Start Route Statistical */}
        <Route
          path="/bieu-do-cuong-do-anh-sang"
          element={
            <StatisticalPage>
              <LightChart />
            </StatisticalPage>
          }
        />

        <Route
          path="/bieu-do-do-am-dat"
          element={
            <StatisticalPage>
              <SoilHumidityChart />
            </StatisticalPage>
          }
        />
        {/*End Route Statistical */}

        {/* Start Route Home */}
        <Route
          path="/them-thing"
          element={
            <HomePage>
              <AddThing />
            </HomePage>
          }
        />

        <Route
          path="/danh-sach-thing"
          element={
            <HomePage>
              <ListThings />
            </HomePage>
          }
        />

        <Route
          path="/datastreams/:thingId/:thingName"
          element={
            <HomePage>
              <ListDataStream />
            </HomePage>
          }
        />
        {/* End Route Home */}
      </Route>
    </Route>
  </Routes>
);

export default UserRoutes;
