import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import "./water-control-card.css";
import waterIcon from "@public/images/humidity-icon.png";

const WaterControlCard = ({ thingId, actuatorId }) => {
  const { token } = useAuth();
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const toggleStatus = () => {
    const taskingParameters = status ? 0 : -1; // -1 for on, 0 for off
    setLoading(true);
    axios
      .post(`/api/post/task`, {
        thing_id: thingId,
        taskingParameters,
        actuator_id: actuatorId,
        token,
      })
      .then((response) => {
        if (response.status === 201) {
          setStatus(!status);
        } else {
          toast.error("Không gửi được lệnh bật nước.");
        }
      })
      .catch((error) => {
        toast.error("Lỗi: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!initialLoad) {
      if (status) {
        toast("Thiết bị cấp nước hoạt động", { autoClose: 2000 });
      } else {
        toast("Thiết bị cấp nước đã được tắt", { autoClose: 2000 });
      }
    } else {
      setInitialLoad(false);
    }
  }, [status]);

  return (
    <div className={`control border border-blue-500 ${status ? "on" : "off"}`}>
      <div className="control-left">
        <img className="control-icon" src={waterIcon} alt="Water" />
        <span className="control-name">Độ Ẩm</span>
      </div>
      <div className="control-right">
        <label className="switch">
          <input
            type="checkbox"
            checked={status}
            onChange={toggleStatus}
            disabled={loading}
          />
          <span className="slider"></span>
        </label>
        <span className="control-button">{status ? "On" : "Off"}</span>
      </div>
    </div>
  );
};

export default WaterControlCard;
