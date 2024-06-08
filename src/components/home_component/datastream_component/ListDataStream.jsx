import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Pagination, Skeleton } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStream } from "@fortawesome/free-solid-svg-icons";

const ListDataStream = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [dataStreams, setDataStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const { thingId } = useParams();

  const fetchDataStreams = async () => {
    try {
      const response = await axios.get(
        `/api/get/things(${thingId})/datastreams`,
        {
          headers: { token: token },
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDataStreams = dataStreams.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col rounded-lg border p-6 shadow-lg">
        <div className="flex-grow">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <Skeleton
                key={index}
                active
                className="flex transform flex-col justify-between rounded-lg p-6 shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)",
                }}
              />
            ))}
          </div>
        </div>
        <div className="my-1 w-full border-b-2 border-gray-200"></div>
        <div className="mt-4 flex justify-center">
          <Skeleton.Button active />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center">Lỗi: {error.message}</div>;
  }

  return (
    <div className="flex h-full w-full flex-col rounded-lg border p-6 shadow-lg">
      <div className="flex-grow">
        {dataStreams.length === 0 ? (
          <div className="text-center">Chưa có dữ liệu!</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentDataStreams.map((dataStream) => (
              <div
                key={dataStream.id}
                className="flex transform flex-col justify-between rounded-lg p-6 shadow-md transition-transform hover:translate-y-[-5px] hover:shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)",
                }}
              >
                <div className="mb-4 flex justify-center">
                  <FontAwesomeIcon
                    icon={faStream}
                    className="text-4xl text-orange-500"
                  />
                </div>
                <div className="mb-4 text-center">
                  <div className="text-xl font-semibold text-gray-800">
                    {dataStream.name}
                  </div>
                  <div className="mt-2 line-clamp-5 text-base text-gray-600">
                    {dataStream.description}
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    className="rounded-full bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600"
                    onClick={() => navigate(`/quan-trac/${dataStream.id}`)}
                  >
                    Quan sát
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="my-1 w-full border-b-2 border-gray-200"></div>
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
  );
};

export default ListDataStream;
