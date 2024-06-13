import React, { useState, useEffect } from "react";
import { Select, Skeleton } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const { Option } = Select;

const HeaderDataStream = ({ onDataStreamChange, onDisplayChange }) => {
  const [dataStreams, setDataStreams] = useState([]);
  const [selectedDataStream, setSelectedDataStream] = useState(null);
  const [displayChart, setDisplayChart] = useState(true);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { thingId } = useParams();

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
          onDataStreamChange(response.data[0]);
        }
      } else {
        setDataStreams([]);
      }
    } catch (error) {
      console.error("Error fetching data streams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataStreams();
  }, [thingId, token]);

  const handleDataStreamChange = (value) => {
    const selected = dataStreams.find((stream) => stream.id === value);
    setSelectedDataStream(selected);
    onDataStreamChange(selected);
  };

  const handleDisplayChange = (value) => {
    setDisplayChart(value === "chart");
    onDisplayChange(value);
  };

  return (
    <div className="my-4 flex justify-center gap-4">
      {loading ? (
        <Skeleton.Button active size="large" />
      ) : (
        <>
          <Select
            style={{ width: 200 }}
            value={selectedDataStream ? selectedDataStream.id : undefined}
            onChange={handleDataStreamChange}
          >
            {dataStreams.map((stream) => (
              <Option key={stream.id} value={stream.id}>
                {stream.name}
              </Option>
            ))}
          </Select>
          <Select
            defaultValue="chart"
            style={{ width: 120 }}
            onChange={handleDisplayChange}
          >
            <Option value="chart">Biểu đồ</Option>
            <Option value="table">Bảng</Option>
          </Select>
        </>
      )}
    </div>
  );
};

export default HeaderDataStream;
