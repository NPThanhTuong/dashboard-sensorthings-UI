import React, { useState, useEffect } from "react";
import { Card, Spin, Alert, Skeleton } from "antd";
import { ClockCircleOutlined, FieldNumberOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Observation = () => {
  const { token, intervalTimes } = useAuth();
  const { thingId } = useParams();

  const [dataStreams, setDataStreams] = useState([]);
  const [latestObservations, setLatestObservations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const unitMap = {
    5: "lux",
    6: "%",
  };

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
        response.data.forEach((dataStream) =>
          fetchLatestObservation(dataStream.id),
        );
      }
    } catch (error) {
      console.error("Error fetching data streams:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestObservation = async (dataStreamId) => {
    try {
      const response = await axios.get(
        `/api/get/datastreams(${dataStreamId})/observations?top=1&orderby=resultTime`,
        {
          headers: { token },
        },
      );
      if (response.data && response.data.length > 0) {
        setLatestObservations((prev) => ({
          ...prev,
          [dataStreamId]: response.data[0],
        }));
      }
    } catch (error) {
      console.error("Error fetching latest observation:", error);
      setError(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchDataStreams();
      } catch (error) {
        console.error("Error fetching data streams:", error);
        setError(error);
      }
    };

    if (thingId && token) {
      fetchData();
      const intervalTime = intervalTimes[thingId] || 5; // Default to 5 minutes if not set
      const interval = setInterval(fetchData, intervalTime * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [thingId, token, intervalTimes]);

  useEffect(() => {
    const fetchObservations = async () => {
      if (dataStreams.length === 0) return;

      try {
        await Promise.all(
          dataStreams.map((dataStream) =>
            fetchLatestObservation(dataStream.id),
          ),
        );
      } catch (error) {
        console.error("Error fetching observations:", error);
        setError(error);
      }
    };

    fetchObservations(); // Initial fetch

    const intervalTime = intervalTimes[thingId] || 5; // Default to 5 minutes if not set
    const interval = setInterval(fetchObservations, intervalTime * 60 * 1000);

    return () => clearInterval(interval);
  }, [dataStreams, thingId, intervalTimes]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <Skeleton loading={loading} active />
          </Card>
        ))}
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {dataStreams.map((dataStream) => (
        <Card
          key={dataStream.id}
          title={dataStream.name}
          style={{
            width: "100%",
            borderRadius: 8,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            transition: "transform 0.2s",
          }}
          className="hover:scale-105"
        >
          {latestObservations[dataStream.id] ? (
            <div>
              <p>
                <ClockCircleOutlined /> <strong>Thời gian:</strong>{" "}
                {latestObservations[dataStream.id].resultTime}
              </p>
              <p>
                <FieldNumberOutlined /> <strong>Kết quả:</strong>{" "}
                {latestObservations[dataStream.id].result}{" "}
                {unitMap[dataStream.id] || ""}
              </p>
            </div>
          ) : (
            <p>Không có dữ liệu</p>
          )}
        </Card>
      ))}
    </div>
  );
};

export default Observation;
