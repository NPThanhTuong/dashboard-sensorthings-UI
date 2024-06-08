import { useState, useEffect } from "react";
import { Alert, Spin } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import hitech_ctu from "@public/images/hitech-ctu.jpg";
import "./data-stream-page.css";
import DataStreamHeader from "@/components/home_component/datastream_component/DataStreamHeader";
import DataStreamDisplay from "@/components/home_component/datastream_component/DataStreamDisplay";
import LightControlCard from "@/components/home_component/task_component/LightControlCard";
import WaterControlCard from "@/components/home_component/task_component/WaterControlCard";

const DataStreamPage = () => {
  const { token } = useAuth();
  const { thingId } = useParams();

  const [thingData, setThingData] = useState(null);
  const [dataStreams, setDataStreams] = useState([]);
  const [sensorData, setSensorData] = useState(null);
  const [selectedDataStream, setSelectedDataStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchThingData = async () => {
    try {
      const response = await axios.get(`/api/get/things(${thingId})`, {
        headers: { token },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        setThingData(response.data[0]);
      } else {
        setThingData(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu thing:", error);
      setError(error);
      setLoading(false);
    }
  };

  const fetchDataStreams = async () => {
    try {
      const response = await axios.get(
        `/api/get/things(${thingId})/datastreams`,
        {
          headers: { token },
        },
      );
      if (Array.isArray(response.data)) {
        setDataStreams(response.data);
      } else {
        setDataStreams([]);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu data stream:", error);
      setError(error);
    }
  };

  const fetchSensorData = async (sensorId) => {
    try {
      const response = await axios.get(`/api/get/sensors(${sensorId})`, {
        headers: { token },
      });
      setSensorData(response.data[0]);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu sensor:", error);
      setError(error);
    }
  };

  useEffect(() => {
    if (selectedDataStream) {
      fetchSensorData(selectedDataStream.sensorId);
    }
  }, [selectedDataStream]);

  useEffect(() => {
    if (thingId && token) {
      fetchThingData();
      fetchDataStreams();
    } else {
      setLoading(false);
    }
  }, [thingId, token]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" style={{ color: "#ff8e3c" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <Alert
          message="Lỗi"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const handleDataStreamChange = (value) => {
    const selectedStream = dataStreams.find((stream) => stream.id === value);
    setSelectedDataStream(selectedStream);
  };

  return (
    <>
      <DataStreamHeader
        dataStreams={dataStreams}
        handleDataStreamChange={handleDataStreamChange}
      />

      <section className="mt-4 flex h-auto w-full justify-between gap-4 rounded-xl bg-white p-5 text-center">
        <div className="h-full w-full rounded-xl">
          <LightControlCard thingId={thingId} actuatorId={2} />
        </div>
        <div className="h-full w-full rounded-xl">
          <WaterControlCard thingId={thingId} actuatorId={2} />
        </div>
        <div className="h-full w-full rounded-xl">3</div>
        <div className="h-full w-full rounded-xl">4</div>
      </section>

      <section className="my-4 grid h-auto w-full grid-cols-5 gap-4 rounded-xl bg-white p-5 text-center md:grid-cols-5">
        <div
          className="relative col-span-3 overflow-hidden rounded-xl md:col-span-3"
          style={{ backgroundColor: "#eff0f3" }}
        >
          <img
            src={hitech_ctu}
            alt="Tòa công nghệ cao CTU"
            className="h-full w-full object-cover"
          />
          {thingData && (
            <div className="thing-data-overlay">
              <div className="thing-data-content">
                <h3 className="mb-16 text-2xl font-bold text-white">
                  {thingData.name}
                </h3>
                <div className="mb-2">
                  <span className="font-semibold text-white">Mô tả:</span>
                  <p className="ml-2 text-white">{thingData.description}</p>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-white">
                    Người sở hữu:
                  </span>
                  <p className="ml-2 text-white">
                    {thingData.properties?.owner}
                  </p>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-white">Địa chỉ:</span>
                  <p className="ml-2 text-white">
                    {thingData.properties?.address},{" "}
                    {thingData.properties?.ward},{" "}
                    {thingData.properties?.district},{" "}
                    {thingData.properties?.province}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-2 h-full w-full rounded-xl">
          <DataStreamDisplay
            selectedDataStream={selectedDataStream}
            sensorData={sensorData}
          />
        </div>
      </section>
    </>
  );
};

export default DataStreamPage;
