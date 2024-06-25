import { useState, useEffect } from "react";
import { Alert, Skeleton } from "antd";
import { useAuth } from "@/context/AuthContext";
import hitech_ctu from "@public/images/hitech-ctu.jpg";
import { fetchThingData } from "@/apis/ThingAPI";
import "@public/styles/thing-info.css";

const ThingInfo = ({ thingId }) => {
  const { token } = useAuth();
  const [thingData, setThingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getThingData = async () => {
      if (thingId && token) {
        try {
          const data = await fetchThingData(thingId, token);
          setThingData(data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    getThingData();
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

  const renderProperties = (properties) => {
    return Object.entries(properties).map(([key, value]) => (
      <div className="mb-2 " key={key}>
        <span className="property-key">{key}: </span>
        <span className="property-value">{value}</span>
      </div>
    ));
  };

  return (
    <div
      className="relative col-span-2 h-full overflow-hidden rounded-2xl"
      style={{ backgroundColor: "#eff0f3" }}
    >
      <img
        src={hitech_ctu}
        alt="Tòa công nghệ cao CTU"
        className="h-full w-full object-cover"
      />
      <Skeleton loading={loading} active>
        {thingData && (
          <>
            <span className="description-title">Mô tả đối tượng (Thing)</span>
            <div className="thing-data-overlay">
              {/* <div className="mota">
                <span>{thingData.name}</span>
              </div> */}
              <div className="thing-data-content">
                <div className="mb-2">
                  <p className="ml-2">{thingData.description}</p>
                </div>
                <div className="">
                  {thingData.properties &&
                    renderProperties(thingData.properties)}
                </div>
              </div>
            </div>
          </>
        )}
      </Skeleton>
    </div>
  );
};

export default ThingInfo;
