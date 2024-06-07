import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const ActuatorDetail = () => {
  const { token } = useAuth();
  const [actuator, setActuator] = useState(null);
  const actuatorId = 8;

  useEffect(() => {
    axios
      .get(`/api/get/actuator(${actuatorId})`, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        setActuator(response.data[0]);
      })
      .catch((error) => {
        console.error("Lỗi fetch dữ liệu actuator:", error);
      });
  }, [actuatorId]);

  return (
    <div>
      <h1>Thông tin Actuator</h1>
      {actuator ? (
        <div>
          <p>
            <strong>ID:</strong> {actuator.id}
          </p>
          <p>
            <strong>Tên:</strong> {actuator.name}
          </p>
          <p>
            <strong>Mô tả:</strong> {actuator.description}
          </p>
          <p>
            <strong>Loại mã hóa:</strong> {actuator.encodingType}
          </p>
        </div>
      ) : (
        <p>Không có dữ liệu</p>
      )}
    </div>
  );
};

export default ActuatorDetail;
