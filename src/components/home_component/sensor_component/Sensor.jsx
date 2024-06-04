import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, Col, Row, Pagination } from "antd";
import nhaMay from "@public/images/nha-may.jpg";

const Sensor = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Số mục mỗi trang

  const { datastreamId, datastreamName } = useParams();

  const fetchSensors = async () => {
    try {
      const response = await axios.get(
        `/api/get/datastreams(${datastreamId})/sensors`,
        {
          headers: {
            token: token,
          },
        },
      );

      if (Array.isArray(response.data)) {
        setSensors(response.data);
      } else {
        setSensors([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải cảm biến:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (datastreamId && token) {
      fetchSensors();
    } else {
      setLoading(false);
    }
  }, [datastreamId, token]);

  // Tính toán chỉ số của mục đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Lấy các mục trên trang hiện tại
  const currentSensors = sensors.slice(indexOfFirstItem, indexOfLastItem);

  // Xử lý thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center">Lỗi: {error.message}</div>;
  }

  return (
    <div className="flex h-[100%] flex-col justify-center p-4">
      <div className="flex h-full w-full max-w-screen-2xl flex-col rounded-lg border bg-white p-6 shadow-lg">
        <h3 className="text-xl font-bold">{datastreamName}</h3>
        <div className="my-2 border-b-2 border-gray-200"></div>
        <div className="flex-grow">
          {sensors.length === 0 ? (
            <div className="text-center">Không có dữ liệu!</div>
          ) : (
            <Row gutter={[16, 16]}>
              {currentSensors.map((sensor) => (
                <Col span={8} key={sensor.id}>
                  <Card
                    hoverable
                    className="custom-card"
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                    }}
                    cover={
                      <img
                        alt={sensor.name}
                        src={nhaMay}
                        className="h-52 w-full object-cover"
                      />
                    }
                    onClick={() =>
                      navigate(
                        `/observation/${datastreamId}/${encodeURIComponent(sensor.name)}`,
                      )
                    }
                  >
                    <Card.Meta
                      title={sensor.name}
                      description={
                        <div className="line-clamp-2">{sensor.description}</div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
        <div className="my-1 w-full border-b-2 border-gray-200"></div>
        {/* Phân trang */}
        {sensors.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={sensors.length}
              onChange={paginate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sensor;
