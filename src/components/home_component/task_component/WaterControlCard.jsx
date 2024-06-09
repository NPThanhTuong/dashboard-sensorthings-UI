import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Switch, Skeleton } from "antd";
import { RiWaterPercentLine } from "react-icons/ri";

const WaterControlCard = ({ thingId, actuatorId }) => {
  const { token, intervalTime } = useAuth();
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [result, setResult] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/get/datastreams(6)/observations`, {
        params: {
          token,
        },
      });
      setResult(response.data);
      setDataLoading(false); // Đặt trạng thái tải dữ liệu là false sau khi lấy xong
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const toggleStatus = (checked) => {
    const taskingParameters = checked ? -1 : 0; // -1 để bật, 0 để tắt
    setStatus(checked); // Cập nhật trạng thái một cách lạc quan
    setLoading(true);

    axios
      .post(`/api/post/task`, {
        thing_id: thingId,
        taskingParameters,
        actuator_id: actuatorId,
        token,
      })
      .then((response) => {
        if (response.status !== 201) {
          setStatus(!checked); // Hoàn nguyên trạng thái nếu phản hồi không thành công
          toast.error("Không gửi được lệnh bật nước.");
        }
      })
      .catch((error) => {
        setStatus(!checked); // Hoàn nguyên trạng thái khi có lỗi
        toast.error("Lỗi: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, intervalTime * 60000);
    return () => clearInterval(interval);
  }, [intervalTime, status]);

  useEffect(() => {
    if (!initialLoad) {
      if (status) {
        toast("Thiết bị cấp nước đang hoạt động", { autoClose: 2000 });
      } else {
        toast("Thiết bị cấp nước đã được tắt", { autoClose: 2000 });
      }
    } else {
      setInitialLoad(false);
    }
  }, [status]);

  return (
    <div
      className="relative h-36 w-72 overflow-hidden rounded-lg text-white shadow-lg"
      style={{
        background: "linear-gradient(to right, #1C1CEC, #8b4513)", // Màu nền mặc định
        color: "white", // Màu chữ mặc định
      }}
    >
      <div className="absolute inset-0 -skew-y-12 transform bg-black bg-opacity-30"></div>
      <div className="relative z-10 flex h-full flex-col justify-between p-4">
        <div className="">
          {dataLoading ? (
            <Skeleton active /> // Hiển thị một khung skeleton khi đang tải
          ) : result.length > 0 ? (
            result.map((data) => (
              <div key={data.id} className="flex justify-between">
                <p>{data.resultTime}</p>
                <p className="text-base font-semibold">
                  {data.result.join(", ")} %
                </p>
              </div>
            ))
          ) : (
            <p>Không có dữ liệu</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <RiWaterPercentLine className="text-3xl text-blue-400" />
            <span className="ml-2 text-base">Độ Ẩm</span>
          </div>
          <div className="flex items-center">
            <Switch
              checked={status}
              onChange={toggleStatus}
              loading={loading}
              checkedChildren={<span style={{ color: "#fff" }}>Bật</span>}
              unCheckedChildren={<span style={{ color: "#fff" }}>Tắt</span>}
              style={{
                backgroundColor: "#ff8e3c", // Màu nền của Switch
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterControlCard;
