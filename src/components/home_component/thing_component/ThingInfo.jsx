import { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Skeleton } from "antd";
import { useAuth } from "@/context/AuthContext";
import hitech_ctu from "@public/images/hitech-ctu.jpg";

const ThingInfo = ({ thingId }) => {
  const { token } = useAuth();
  const [thingData, setThingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchThingData = async () => {
    try {
      const response = await axios.get(`/api/get/things(${thingId})`, {
        headers: { token },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        setThingData(response.data[0]);
      } else {
        setThingData(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu thing:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (thingId && token) {
      fetchThingData();
    } else {
      setLoading(false);
    }
  }, [thingId, token]);

  if (error) {
    return (
      <div className="text-center">
        <Alert
          message="Lỗi"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div
      className="relative col-span-2 overflow-hidden rounded-xl"
      style={{ backgroundColor: "#eff0f3" }}
    >
      <img
        src={hitech_ctu}
        alt="Tòa công nghệ cao CTU"
        className="h-full w-full object-cover"
      />
      <Skeleton loading={loading} active>
        {thingData && (
          <div className="thing-data-overlay">
            <div className="thing-data-content">
              <h3 className="mb-12 text-2xl font-bold text-white">
                {thingData.name}
              </h3>
              <div className="mb-2">
                <span className="font-semibold text-white">Mô tả:</span>
                <p className="ml-2 text-white">{thingData.description}</p>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-white">Người sở hữu:</span>
                <p className="ml-2 text-white">{thingData.properties?.owner}</p>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-white">Địa chỉ:</span>
                <p className="ml-2 text-white">
                  {thingData.properties?.address}, {thingData.properties?.ward},{" "}
                  {thingData.properties?.district},{" "}
                  {thingData.properties?.province}
                </p>
              </div>
            </div>
          </div>
        )}
      </Skeleton>
    </div>
  );
};

export default ThingInfo;
