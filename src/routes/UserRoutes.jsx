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

// Home Layout
import AddThing from "@/components/home_component/thing_component/AddThing";
import ListThingPage from "@/pages/thing_page/ListThingPage";
import AddDataStream from "@/components/home_component/datastream_component/AddDataStream";
import DataStreamPage from "@/pages/datastream_page/DataStreamPage";
import DetailDatastreamPage from "@/pages/detail_datastream_page/DetailDatastreamPage";
import SettingThingPage from "@/pages/setting_thing_page/SettingThingPage";
import TaskingCapabilityForm from "@/components/home_component/taskingcapability_component/TaskingCapabilityForm";

// đang test
import AddActuator from "../components/home_component/actuator_component/AddActuator";
import ActuatorDetail from "../components/home_component/actuator_component/ActuatorDetail";

import NotFoundPage from "@/pages/not_found_page/NotFoundPage";
import MapPage from "../pages/map_page/MapPage";

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
          path="/ban-do"
          element={
            <HomePage>
              <MapPage />
            </HomePage>
          }
        />
        <Route
          path="/them-thing"
          element={
            <HomePage>
              <AddThing />
            </HomePage>
          }
        />

        <Route
          path="/"
          element={
            <HomePage>
              <ListThingPage />
            </HomePage>
          }
        />

        <Route
          path="/chi-tiet-thing/:thingId"
          element={
            <HomePage>
              <DataStreamPage />
            </HomePage>
          }
        />

        <Route
          path="/cai-dat-thing/:thingId"
          element={
            <HomePage>
              <SettingThingPage />
            </HomePage>
          }
        />

        <Route
          path="/chi-tiet-thing/:thingId/them-luong-du-lieu"
          element={
            <HomePage>
              <AddDataStream />
            </HomePage>
          }
        />

        <Route
          path="/quan-trac/:datastreamId"
          element={
            <HomePage>
              <DetailDatastreamPage />
            </HomePage>
          }
        />
        {/* End Route Home */}

        {/* Start Actuator */}
        <Route path="/them-actuator" element={<AddActuator />} />
        <Route path="/chi-tiet-actuator" element={<ActuatorDetail />} />
        {/* End Actuator */}

        {/* Start TaskingCapability */}
        <Route
          path="/them-tasking-capability"
          element={<TaskingCapabilityForm />}
        />
        {/* End TaskingCapability */}
      </Route>
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default UserRoutes;
