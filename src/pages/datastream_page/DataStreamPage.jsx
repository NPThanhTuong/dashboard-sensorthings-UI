import React, { useState, useEffect } from "react";
import { Alert, Card } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import AddTask from "@/components/home_component/task_component/AddTask";
import LineChart from "@/components/chart_component/LineChart";
import HeaderDataStream from "@/components/home_component/datastream_component/HeaderDataStream";

const DataStreamPage = () => {
  const { token } = useAuth();
  const { thingId } = useParams();

  const [dataStreams, setDataStreams] = useState([]);
  const [actuators, setActuators] = useState([]);
  const [observations, setObservations] = useState([]);
  const [selectedDataStream, setSelectedDataStream] = useState(null);
  const [error, setError] = useState(null);

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
        if (response.data.length > 0) {
          setSelectedDataStream(response.data[0]);
        }
      } else {
        setDataStreams([]);
      }
    } catch (error) {
      console.error("Error fetching data streams:", error);
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
      console.error("Error fetching actuators:", error);
      setError(error);
    }
  };

  const fetchObservations = async (dataStreamId) => {
    try {
      const response = await axios.get(
        `/api/get/datastreams(${dataStreamId})/observations?top=all`,
        {
          headers: { token },
        },
      );
      setObservations(response.data);
    } catch (error) {
      console.error("Error fetching observations:", error);
      setError(error);
    }
  };

  useEffect(() => {
    if (thingId && token) {
      fetchDataStreams();
      fetchActuators();
    }
  }, [thingId, token]);

  useEffect(() => {
    if (selectedDataStream) {
      fetchObservations(selectedDataStream.id);
    }
  }, [selectedDataStream]);

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
  };

  return (
    <>
      <section>
        <HeaderDataStream onDataStreamChange={handleDataStreamChange} />
      </section>
      <section className="mt-4 flex h-auto w-full justify-between gap-4 rounded-xl bg-white p-5 text-center">
        <div className="grid grid-cols-4 gap-4">
          {actuators?.map((actuator) => (
            <Card
              key={actuator.id}
              title={actuator.name}
              style={{ width: 300 }}
            >
              <AddTask actuator={actuator} />
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-xl bg-white p-5">
        {selectedDataStream && (
          <LineChart
            observations={observations}
            dataStreamId={selectedDataStream.id}
            dataType={selectedDataStream.name}
          />
        )}
      </section>
    </>
  );
};

export default DataStreamPage;
