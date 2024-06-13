import { Routes, Route } from "react-router-dom";

import DefaultLayout from "@/layout/DefaultLayout";
import PublicLayout from "@/layout/PublicLayout";

import HomePage from "@/pages/home_page/HomePage";
import LoginPage from "@/pages/login_page/LoginPage";
import RegisterPage from "@/pages/register_page/RegisterPage";
import ObservationPage from "@/pages/observation_page/ObservationPage";
import MapPage from "@/pages/map_page/MapPage";

import ProtectedRoute from "@/routes/ProtectedRoute";
import StatisticalPage from "@/pages/statistical_page/StatisticalPage";
import LightChart from "@/components/chart_component/LightChart";
import SoilHumidityChart from "@/components/chart_component/SoilHumidityChart";

import ChangePasswordPage from "@/pages/change_password_page/ChangePasswordPage";
import UserInforPage from "@/pages/user_infor_page/UserInforPage";

import AddThing from "@/components/home_component/thing_component/AddThing";
import ListThingPage from "@/pages/thing_page/ListThingPage";
import AddDataStream from "@/components/home_component/datastream_component/AddDataStream";
import DataStreamPage from "@/pages/datastream_page/DataStreamPage";
import DetailDatastreamPage from "@/pages/detail_datastream_page/DetailDatastreamPage";
import NotFoundPage from "@/pages/not_found_page/NotFoundPage";

import ControlPanel from "@/components/card_component/ControlPanel";
import AddActuator from "../components/home_component/actuator_component/AddActuator";
import ActuatorDetail from "../components/home_component/actuator_component/ActuatorDetail";
import TaskingCapabilityForm from "../components/home_component/taskingcapability_component/TaskingCapabilityForm";

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

        <Route path="/them-thing" element={<AddThing />} />
        <Route path="/" element={<ListThingPage />} />
        <Route path="/chi-tiet-thing/:thingId" element={<DataStreamPage />} />
        <Route
          path="/chi-tiet-thing/:thingId/them-luong-du-lieu"
          element={<AddDataStream />}
        />
        <Route
          path="/quan-trac/:datastreamId"
          element={<DetailDatastreamPage />}
        />

        <Route path="/them-actuator" element={<AddActuator />} />
        <Route path="/chi-tiet-actuator" element={<ActuatorDetail />} />

        <Route
          path="/them-tasking-capability"
          element={<TaskingCapabilityForm />}
        />

        <Route path="/dieu-khien" element={<ControlPanel />} />
        <Route path="/giam-sat" element={<ObservationPage />} />

        {/* Thêm route cho MapPage */}
        <Route path="/ban-do-luan" element={<MapPage />} />

        {/* Route 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Route>
  </Routes>
);

export default UserRoutes;
