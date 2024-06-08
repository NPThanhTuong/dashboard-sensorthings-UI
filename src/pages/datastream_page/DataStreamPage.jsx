import { useState, useEffect } from "react";
import { Alert } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import "./data-stream-page.css";
import DataStreamHeader from "@/components/home_component/datastream_component/DataStreamHeader";
import LightControlCard from "@/components/home_component/task_component/LightControlCard";
import WaterControlCard from "@/components/home_component/task_component/WaterControlCard";
import ListDataStream from "@/components/home_component/datastream_component/ListDataStream";
import ThingInfo from "@/components/home_component/thing_component/ThingInfo";

const DataStreamPage = () => {
  const { token } = useAuth();
  const { thingId } = useParams();

  const [dataStreams, setDataStreams] = useState([]);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (thingId && token) {
      fetchDataStreams();
    }
  }, [thingId, token]);

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

  return (
    <>
      <DataStreamHeader />

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

      <section className="my-4 grid h-[500px] w-full grid-cols-5 gap-4 rounded-xl text-center md:grid-cols-5">
        <div className="col-span-3 h-full w-full rounded-xl bg-white">
          <ListDataStream />
        </div>
        <ThingInfo thingId={thingId} />
      </section>
    </>
  );
};

export default DataStreamPage;
