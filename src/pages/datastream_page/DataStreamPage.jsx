import React, { useState, useEffect } from "react";
import { Alert } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import AddTask from "@/components/home_component/task_component/AddTask";
import LineChart from "@/components/chart_component/LineChart";
import HeaderDataStream from "@/components/home_component/datastream_component/HeaderDataStream";
import DataTable from "@/components/table_component/DataTable";
import Observation from "@/components/home_component/observation_component/Observation";

const DataStreamPage = () => {
  const { token, intervalTimes } = useAuth();
  const { thingId } = useParams();

  const [dataStreams, setDataStreams] = useState([]);
  const [actuators, setActuators] = useState([]);
  const [observations, setObservations] = useState([]);
  const [selectedDataStream, setSelectedDataStream] = useState(null);
  const [error, setError] = useState(null);
  const [displayChart, setDisplayChart] = useState(true);

  const fetchDataStreams = async () => {
    try {
      const response = await axios.get(
        `/api/get/things(${thingId})/datastreams?top=all`,
        {
          headers: { token },
        },
      );
      if (Array.isArray(response.data)) {
        setDataStreams(response.data);
        if (response.data.length > 0 && !selectedDataStream) {
          setSelectedDataStream(response.data[0]);
        }
      } else {
        setDataStreams([]);
      }
    } catch (error) {
      console.error("Lỗi lấy data streams:", error);
      setError(error);
    }
  };

  const fetchActuators = async () => {
    try {
      const response = await axios.get(
        `/api/get/things(${thingId})/actuator?top=all`,
        {
          headers: { token },
        },
      );
      setActuators(response.data);
    } catch (error) {
      console.error("Lỗi lấy actuators:", error);
      setError(error);
    }
  };

  const fetchObservations = async (dataStreamId, isAppend = false) => {
    try {
      const response = await axios.get(
        `/api/get/datastreams(${dataStreamId})/observations?top=all`,
        {
          headers: { token },
        },
      );
      if (isAppend) {
        setObservations((prev) => [...prev, ...response.data]);
      } else {
        setObservations(response.data);
      }
    } catch (error) {
      console.error("Lỗi lấy observations:", error);
      setError(error);
    }
  };
  // const fetchObservations = async (dataStreamId) => {
  //   try {
  //     const response = await axios.get(
  //       `/api/get/datastreams(${dataStreamId})/observations?top=all`,
  //       {
  //         headers: { token },
  //       },
  //     );

  //     // Thêm dữ liệu mới vào cuối mảng observations
  //     setObservations((prev) => [...prev, ...response.data]);
  //   } catch (error) {
  //     console.error("Lỗi lấy observations:", error);
  //     setError(error);
  //   }
  // };

  useEffect(() => {
    if (thingId && token) {
      fetchDataStreams();
      fetchActuators();

      const intervalTime = intervalTimes[thingId] || 5; // Default to 5 minutes if not set
      const interval = setInterval(
        () => {
          fetchDataStreams();
          fetchActuators();
        },
        intervalTime * 60 * 1000,
      ); // Convert minutes to milliseconds

      return () => clearInterval(interval);
    }
  }, [thingId, token, intervalTimes]);

  useEffect(() => {
    if (selectedDataStream) {
      fetchObservations(selectedDataStream.id);

      const intervalTime = intervalTimes[thingId] || 5; // Default to 5 minutes if not set
      const interval = setInterval(
        () => {
          fetchObservations(selectedDataStream.id, true); // Append new data
        },
        intervalTime * 60 * 1000,
      ); // Convert minutes to milliseconds

      return () => clearInterval(interval);
    }
  }, [selectedDataStream, intervalTimes, thingId]);

  if (error) {
    return (
      <div className="text-center">
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const handleDataStreamChange = (selected) => {
    setSelectedDataStream(selected);
    setObservations([]);
    fetchObservations(selected.id);
  };

  const handleDisplayChange = (value) => {
    setDisplayChart(value === "chart");
  };

  return (
    <>
      <section>
        <Observation />
      </section>
      <section className="my-4 flex justify-start gap-4">
        {actuators?.map((actuator) => (
          <div
            key={actuator.id}
            className="h-[100px] w-[300px] rounded-lg bg-white p-2 shadow-md"
          >
            <h3 className="text-center font-semibold">{actuator.name}</h3>
            <div className="p-4">
              <AddTask actuator={actuator} />
            </div>
          </div>
        ))}
      </section>

      <section>
        <HeaderDataStream
          onDataStreamChange={handleDataStreamChange}
          onDisplayChange={handleDisplayChange}
        />
      </section>
      <section className="my-4 flex justify-between">
        <div
          className={`w-full rounded-xl bg-white p-5 ${
            displayChart ? "" : "hidden"
          }`}
        >
          {selectedDataStream && (
            <LineChart
              observations={observations}
              dataStreamId={selectedDataStream.id}
              dataType={selectedDataStream.name}
            />
          )}
        </div>
        <div
          className={`w-full rounded-xl bg-white p-5 ${
            displayChart ? "hidden" : ""
          }`}
        >
          {selectedDataStream && (
            <DataTable
              observations={observations}
              dataStreamId={selectedDataStream.id}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default DataStreamPage;
