import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, Col, Row, Pagination, Button } from "antd";
import nhaMay from "@public/images/nha-may.jpg";

const ListDataStream = () => {
  const { token } = useAuth();

  const navigate = useNavigate();
  const [dataStreams, setDataStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Số lượng mục trên mỗi trang

  const { thingId, thingName } = useParams();

  const fetchDataStreams = async () => {
    try {
      const response = await axios.get(
        `/api/get/things(${thingId})/datastreams`,
        {
          headers: {
            token: token,
          },
        },
      );

      if (Array.isArray(response.data)) {
        setDataStreams(response.data);
      } else {
        setDataStreams([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu data stream:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (thingId && token) {
      fetchDataStreams();
    } else {
      setLoading(false);
    }
  }, [thingId, token]);

  // Lấy chỉ số của mục đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Lấy các mục của trang hiện tại
  const currentDataStreams = dataStreams.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Đổi trang
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
        <h3 className="text-xl font-bold">{thingName}</h3>
        <Button
          type="primary"
          onClick={() =>
            navigate(`/datastreams/${thingId}/them-luong-du-lieu`, {
              state: { thingName: thingName },
            })
          }
        >
          Thêm Datastream
        </Button>
        <div className="my-2 border-b-2 border-gray-200"></div>
        <div className="flex-grow">
          {dataStreams.length === 0 ? (
            <div className="text-center">Chưa có dữ liệu!</div>
          ) : (
            <Row gutter={[16, 16]}>
              {currentDataStreams.map((dataStream, index) => (
                <Col span={8} key={dataStream.id}>
                  <Card
                    hoverable
                    className="custom-card"
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                    }}
                    cover={
                      <img
                        alt={dataStream.name}
                        src={nhaMay}
                        className="h-52 w-full object-cover"
                      />
                    }
                    onClick={() =>
                      navigate(
                        `/sensor/${dataStream.id}/${encodeURIComponent(
                          dataStream.name,
                        )}`,
                      )
                    }
                  >
                    <Card.Meta
                      title={dataStream.name}
                      description={
                        <div className="line-clamp-2">
                          {dataStream.description}
                        </div>
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
        {dataStreams.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={dataStreams.length}
              onChange={paginate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListDataStream;
