import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Pagination, Skeleton } from "antd";
import HeaderThing from "../../components/home_component/thing_component/HeaderThing";
import { IoSettings } from "react-icons/io5";

const ListThingPage = () => {
  const { token } = useAuth();
  const [things, setThings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page
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
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThings();

    const interval = setInterval(() => {
      fetchThings();
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  // Get indices of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Get the current items to be displayed on the page
  const currentThings = things.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
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
    return <div className="text-center">Error: {error.message}</div>;
  }

  return (
    <>
      <HeaderThing />
      <div className="mt-4 flex flex-col justify-center">
        <div className="flex h-[600px] w-full max-w-screen-2xl flex-col rounded-lg border bg-white p-6 shadow-lg">
          <div className="flex-grow">
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
                        <IoSettings className="text-2xl text-orange-500" />
                      </div>
                      {thing?.description && (
                        <div className="mt-2 line-clamp-2 text-base text-gray-600">
                          {thing.description || ""}
                        </div>
                      )}
                    </div>
                    <div className="">
                      <button
                        className="rounded-full bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600"
                        onClick={() => navigate(`/chi-tiet-thing/${thing.id}`)}
                      >
                        Quan sát
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="my-2 w-full border-b-2 border-gray-200"></div>
          {/* Pagination */}
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

export default ListThingPage;
