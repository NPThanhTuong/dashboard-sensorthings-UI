import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import "./light-control-card.css";
import lightIcon from "@public/images/lux-icon.png";

const LightControlCard = ({ thingId, actuatorId }) => {
  const { token } = useAuth();
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true); // Thêm state initialLoad

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
          toast.error("Không gửi được lệnh bật đèn.");
        }
      })
      .catch((error) => {
        toast.error("Error: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // Kiểm tra nếu không phải lần render đầu tiên thì mới toast
    if (!initialLoad) {
      if (status) {
        toast("Đèn được bật", { autoClose: 2000 });
      } else {
        toast("Đèn đã được tắt", { autoClose: 2000 });
      }
    } else {
      // Nếu là lần render đầu tiên, set initialLoad thành false
      setInitialLoad(false);
    }
  }, [status]);

  return (
    <div
      className={`control-light border border-yellow-500 ${status ? "on" : "off"}`}
    >
      <div className="control-light-left">
        <img className="control-light-icon" src={lightIcon} alt="Light" />
        <span className="control-light-name">Ánh Sáng</span>
      </div>
      <div className="control-light-right">
        <label className="switch">
          <input
            type="checkbox"
            checked={status}
            onChange={toggleStatus}
            disabled={loading}
          />
          <span className="slider"></span>
        </label>
        <span className="control-light-button">{status ? "On" : "Off"}</span>
      </div>
    </div>
  );
};

export default LightControlCard;
