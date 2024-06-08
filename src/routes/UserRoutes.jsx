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

//import infor User
import ChangePasswordPage from "@/pages/change_password_page/ChangePasswordPage";
import UserInforPage from "@/pages/user_infor_page/UserInforPage";

// Home Layout
import ListThings from "@/components/home_component/thing_component/ListThings";
import AddThing from "@/components/home_component/thing_component/AddThing";
//import ListDataStream from "@/components/home_component/datastream_component/ListDataStream";
import Sensor from "@/components/home_component/sensor_component/Sensor";
// import Observation from "@/components/home_component/observation_component/Observation";
import AddDataStream from "@/components/home_component/datastream_component/AddDataStream";
import DataStreamPage from "@/pages/datastream_page/DataStreamPage";
import DetailDatastreamPage from "@/pages/detail_datastream_page/DetailDatastreamPage";
import NotFoundPage from "@/pages/not_found_page/NotFoundPage";

// Import ControlPanel component
import ControlPanel from "@/components/card_component/ControlPanel";

// đang test
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
          path="/"
          element={
            <HomePage>
              <ListThings />
            </HomePage>
          }
        />

        <Route
          path="/luong-du-lieu/:thingId"
          element={
            <HomePage>
              <DataStreamPage />
            </HomePage>
          }
        />
        {/* 
        <Route
          path="/datastreams/:thingId"
          element={
            <HomePage>
              <ListDataStream />
            </HomePage>
          }
        /> */}

        <Route
          path="/luong-du-lieu/:thingId/them-luong-du-lieu"
          element={
            <HomePage>
              <AddDataStream />
            </HomePage>
          }
        />

        <Route
          path="/sensor/:datastreamId"
          element={
            <HomePage>
              <Sensor />
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
        {/* <Route path="/chi-tiet-actuator" element={<ActuatorDetail />} /> */}
        {/* End TaskingCapability */}

        {/* Route for Control Panel */}
        <Route path="/dieu-khien" element={<ControlPanel />} />
        <Route path="/giam-sat" element={<ObservationPage />} />
        {/* Route for Observation */}
      </Route>
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default UserRoutes;
