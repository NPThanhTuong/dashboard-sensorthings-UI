import React, { useState, useEffect } from "react";
import { Alert, Spin } from "antd";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import HeaderThingDetail from "@/components/home_component/datastream_component/HeaderThingDetail";
import Observation from "@/components/home_component/observation_component/Observation";
import LineChart from "@/components/chart_component/LineChart";
import DataStreamControl from "../../components/home_component/datastream_component/DataStreamControl";
import { fetchDataStreams } from "../../apis/DataStreamAPI";
import { fetchThingData } from "../../apis/ThingAPI";
import {
  fetchLatestObservation,
  fetchObservations,
} from "@/apis/ObservationAPI";
import AddTask from "../../components/home_component/task_component/AddTask";

const ThingDetailPage = () => {
  const { token, intervalTimes } = useAuth();
  const { thingId } = useParams();

  const [selectedDataStream, setSelectedDataStream] = useState(null);
  const [dataStreams, setDataStreams] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingData, setIsAddingData] = useState(false);
  const [activeView, setActiveView] = useState("chart");
  const [latestObservations, setLatestObservations] = useState({});
  const [observations, setObservations] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [thingName, setThingName] = useState(null);

  const fetchData = async () => {
    try {
      const [streams, thingData] = await Promise.all([
        fetchDataStreams(thingId, token),
        fetchThingData(thingId, token),
      ]);

      if (streams.length > 0 && !selectedDataStream) {
        setSelectedDataStream(streams[0].id);
      }
      setDataStreams(streams);
      setThingName(thingData?.name || "Không có dữ liệu tên");

      const latestObservationsPromises = streams.map((dataStream) =>
        fetchLatestObservation(dataStream.id, token),
      );
      const latestObservationsResults = await Promise.all(
        latestObservationsPromises,
      );
      const latestObservations = latestObservationsResults.reduce(
        (acc, observation, index) => {
          if (observation?.result?.[0]) {
            acc[streams[index].id] = observation;
          }
          return acc;
        },
        {},
      );

      const observationsPromises = streams.map((dataStream) =>
        fetchObservations(dataStream.id, token),
      );
      const observationsResults = await Promise.all(observationsPromises);
      const observations = observationsResults.reduce(
        (acc, response, index) => {
          acc[streams[index].id] = response.slice(-20);
          return acc;
        },
        {},
      );

      setLatestObservations(latestObservations);
      setObservations(observations);
      setDataLoaded(true);
    } catch (error) {
      setError(error);
    } finally {
      if (isLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (thingId && token) {
      fetchData();
    }
  }, [thingId, token]);

  useEffect(() => {
    if (thingId && token && dataLoaded) {
      const intervalTime = intervalTimes[thingId] || 5;
      const interval = setInterval(fetchData, intervalTime * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [thingId, token, intervalTimes, dataLoaded]);

  const handleDataStreamChange = (selected) => {
    setSelectedDataStream(selected);
  };

  const toggleView = (view) => {
    setActiveView(view);
  };

  const toggleAddingData = () => {
    setIsAddingData(!isAddingData);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="loading-text text-4xl font-bold text-gray-500">
          <Spin size="large" />
        </div>
      </div>
    );
  }

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

  return (
    <>
      <section className="px-4">
        {dataLoaded && <HeaderThingDetail thingName={thingName} />}
      </section>

      <section className="my-4">
        {dataLoaded && (
          <>
            <Observation
              dataStreams={dataStreams}
              latestObservations={latestObservations}
              intervalTimes={intervalTimes}
            />
            <AddTask />
            <LineChart dataStreams={dataStreams} observations={observations} />
          </>
        )}
      </section>
      {dataLoaded && (
        <DataStreamControl
          dataStreams={dataStreams}
          selectedDataStream={selectedDataStream}
          handleDataStreamChange={handleDataStreamChange}
          activeView={activeView}
          toggleView={toggleView}
          toggleAddingData={toggleAddingData}
          isAddingData={isAddingData}
        />
      )}
    </>
  );
};

export default ThingDetailPage;
