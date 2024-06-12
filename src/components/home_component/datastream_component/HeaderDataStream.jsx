import React, { useState, useEffect } from "react";
import { Select } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const { Option } = Select;

const HeaderDataStream = ({ onDataStreamChange }) => {
  const [dataStreams, setDataStreams] = useState([]);
  const [selectedDataStream, setSelectedDataStream] = useState(null);
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
        }
      } else {
        setDataStreams([]);
      }
    } catch (error) {
      console.error("Error fetching data streams:", error);
    }
  };

  useEffect(() => {
    fetchDataStreams();
  }, [thingId, token]);

  const handleChange = (value) => {
    const selected = dataStreams.find((stream) => stream.id === value);
    setSelectedDataStream(selected);
    onDataStreamChange(selected);
  };

  return (
    <div className="my-4 flex justify-center">
      <Select
        style={{ width: 200 }}
        value={selectedDataStream ? selectedDataStream.id : undefined}
        onChange={handleChange}
      >
        {dataStreams.map((stream) => (
          <Option key={stream.id} value={stream.id}>
            {stream.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default HeaderDataStream;
