import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Pagination } from "antd";
import nhaMay from "@public/images/nha-may.jpg";
//import SearchInput from "@/components/home_component/thing_component/SearchInput";

const ListThings = () => {
  const { token } = useAuth();
  const [things, setThings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Số lượng mục trên mỗi trang
  const navigate = useNavigate();

  const fetchThings = async () => {
    try {
      const response = await axios.get("/api/getThings", {
        headers: {
          token: token,
        },
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        setThings(response.data.data);
      } else {
        setThings([]);
        console.error(error);
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThings(); // Lấy danh sách Things ban đầu

    const interval = setInterval(() => {
      fetchThings(); // Lấy danh sách Things định kỳ
    }, 300000); // Sau 5 phút lấy dữ liệu mới

    return () => clearInterval(interval);
  }, [token]);

  // Lấy chỉ số của mục đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Lấy các mục của trang hiện tại
  const currentThings = things.slice(indexOfFirstItem, indexOfLastItem);

  // Đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center">Lỗi: {error.message}</div>;
  }

  return (
    <>
      {/* <div className="bg-gray-100">
        <SearchInput />
      </div> */}
      <div className="flex flex-col justify-center">
        <div className="flex h-dvh w-full max-w-screen-2xl flex-col rounded-lg border bg-white p-6 shadow-lg">
          <div className="flex-grow">
            {things.length === 0 ? (
              <div className="text-center">Chưa có dữ liệu!</div>
            ) : (
              <Row gutter={[16, 16]}>
                {currentThings.map((thing, index) => (
                  <Col span={8} key={thing.id}>
                    <Card
                      hoverable
                      className="custom-card"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #ddd",
                      }}
                      cover={
                        <img
                          alt={thing.name}
                          src={nhaMay}
                          className="h-52 w-full object-cover"
                        />
                      }
                      onClick={() => navigate(`/luong-du-lieu/${thing.id}`)}
                    >
                      <Card.Meta
                        title={thing.name}
                        description={
                          <div className="line-clamp-2">
                            {thing.description}
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
          <div className="my-2 w-full border-b-2 border-gray-200"></div>
          {/* Phân trang */}
          {things.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={things.length}
                onChange={paginate}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ListThings;
