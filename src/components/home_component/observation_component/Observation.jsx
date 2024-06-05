import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Observation = () => {
  const { token } = useAuth();
  const { datastreamId } = useParams();
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchObservations = async () => {
    try {
      const response = await axios.get(
        `/api/get/datastreams(${datastreamId})/observations`,
        {
          headers: {
            token: token,
          },
        },
      );

      if (Array.isArray(response.data)) {
        setObservations(response.data);
      } else {
        setObservations([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu quan sát:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (datastreamId && token) {
      fetchObservations();
    } else {
      setLoading(false);
    }
  }, [datastreamId, token]);

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center">Lỗi: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold">{datastreamId}</h3>
      <div className="my-2 border-b-2 border-gray-200"></div>
      {observations.length === 0 ? (
        <div className="text-center">Không có dữ liệu!</div>
      ) : (
        <div>
          {observations.map((observation) => (
            <div key={observation.id} className="my-2 rounded-md border p-4">
              <p>
                <strong>ID:</strong> {observation.id}
              </p>
              <p>
                <strong>Kết quả:</strong> {observation.result.join(", ")}
              </p>
              <p>
                <strong>Thời gian đo được:</strong> {observation.resultTime}
              </p>
              {observation.validTime && (
                <p>
                  <strong>Thời gian sử dụng:</strong> {observation.validTime}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Observation;
