import { Routes, Route } from "react-router-dom";

import DefaultLayout from "@/layout/DefaultLayout";
import PublicLayout from "@/layout/PublicLayout";

import HomePage from "@/pages/home_page/HomePage";
import LoginPage from "@/pages/login_page/LoginPage";
import RegisterPage from "@/pages/register_page/RegisterPage";

import ProtectedRoute from "@/routes/ProtectedRoute";

//import infor User
import ChangePasswordPage from "@/pages/change_password_page/ChangePasswordPage";
import UserInforPage from "@/pages/user_infor_page/UserInforPage";

import ThingPage from "@/pages/thing_page/ThingPage";
import ThingDetailPage from "@/pages/thing_detail_page/ThingDetailPage";
import SettingThingPage from "@/pages/setting_thing_page/SettingThingPage";

// đang test
import AddActuator from "../components/home_component/actuator_component/AddActuator";
import ActuatorDetail from "../components/home_component/actuator_component/ActuatorDetail";

import NotFoundPage from "@/pages/not_found_page/NotFoundPage";

const UserRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/dang-nhap" element={<LoginPage />} />
      <Route path="/dang-ky" element={<RegisterPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<DefaultLayout />}>
        <Route path="/thay-doi-mat-khau" element={<ChangePasswordPage />} />
        <Route path="/thong-tin-nguoi-dung" element={<UserInforPage />} />

        {/* Start Route Home */}

        <Route
          path="/"
          element={
            <HomePage>
              <ThingPage />
            </HomePage>
          }
        />

        <Route
          path="/chi-tiet-doi-tuong/:thingId"
          element={
            <HomePage>
              <ThingDetailPage />
            </HomePage>
          }
        />

        <Route
          path="/cai-dat-doi-tuong/:thingId"
          element={
            <HomePage>
              <SettingThingPage />
            </HomePage>
          }
        />

        {/* End Route Home */}

        {/* Start Actuator đang test*/}
        <Route path="/them-actuator" element={<AddActuator />} />
        <Route path="/chi-tiet-actuator" element={<ActuatorDetail />} />
        {/* End Actuator */}
      </Route>
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default UserRoutes;
