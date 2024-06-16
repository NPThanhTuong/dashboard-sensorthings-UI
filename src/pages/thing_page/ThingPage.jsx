import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Pagination, Skeleton, Button, Layout } from "antd";
import HeaderThing from "@/components/home_component/thing_component/HeaderThing";
import { SettingOutlined } from "@ant-design/icons";
import "./thing-page.css";

const { Content } = Layout;

const ListThingPage = () => {
  const { token } = useAuth();
  const [things, setThings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;
  const navigate = useNavigate();

  // Hàm lấy danh sách các thiết bị
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
      console.error("Lỗi khi tải dữ liệu:", error);
      setError(error);
      setLoading(false);
    }
  };

  // Sử dụng useEffect để gọi hàm fetchThings khi component được tải lần đầu tiên và sau mỗi lần token thay đổi
  useEffect(() => {
    fetchThings();

    const interval = setInterval(() => {
      fetchThings();
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  // Tính toán chỉ số của item đầu và cuối trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Lọc danh sách thiết bị dựa trên giá trị tìm kiếm
  const filteredThings = things.filter((thing) =>
    thing.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Lấy danh sách thiết bị hiện tại để hiển thị trên trang
  const currentThings = filteredThings.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm chuyển đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hiển thị skeleton loading khi đang tải dữ liệu
  if (loading) {
    return (
      <Layout className="flex h-full w-full flex-col rounded-2xl border p-6 shadow-lg">
        <Content className="flex-grow">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <Skeleton
                key={index}
                active
                className="flex transform flex-col justify-between rounded-2xl p-6 shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)",
                }}
              />
            ))}
          </div>
        </Content>
        <div className="my-1 w-full border-b-2 border-gray-200"></div>
        <div className="mt-4 flex justify-center">
          <Skeleton.Button active />
        </div>
      </Layout>
    );
  }

  if (error) {
    return <div className="text-center">Lỗi: {error.message}</div>;
  }

  return (
    <>
      <HeaderThing searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="mt-4 flex flex-col justify-center">
        <Layout className="flex h-[600px] w-full max-w-screen-2xl flex-col rounded-2xl border bg-white p-6 shadow-lg">
          <Content className="flex-grow">
            {things.length === 0 ? (
              <div className="text-center">Không có dữ liệu!</div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentThings?.map((thing) => (
                  <div
                    key={thing.id}
                    className="flex transform flex-col justify-between rounded-lg p-6 shadow-md transition-transform hover:translate-y-[-5px] hover:shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)",
                    }}
                  >
                    <div className="mb-4">
                      <div className="flex justify-between text-xl font-semibold text-gray-800">
                        {thing?.name}
                      </div>
                      {thing?.description && (
                        <div className="mt-2 line-clamp-2 text-base text-gray-600">
                          {thing.description || ""}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <Button
                        className="setting-button rounded-2xl"
                        icon={<SettingOutlined />}
                        onClick={() => navigate(`/cai-dat-thing/${thing.id}`)}
                      />
                      <Button
                        type="primary"
                        onClick={() => navigate(`/chi-tiet-thing/${thing.id}`)}
                        className="rounded-2xl"
                      >
                        Quan sát
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Content>
          <div className="my-2 w-full border-b-2 border-gray-200"></div>
          {/* Pagination */}
          {things.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={filteredThings.length}
                onChange={paginate}
              />
            </div>
          )}
        </Layout>
      </div>
    </>
  );
};

export default ListThingPage;
