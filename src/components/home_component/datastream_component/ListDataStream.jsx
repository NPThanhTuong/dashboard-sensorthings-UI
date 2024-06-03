import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ListDataStream = () => {
  const { token } = useAuth();

  const [dataStreams, setDataStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center">Lỗi: {error.message}</div>;
  }

  return (
    <div className="flex h-[100%] flex-col justify-center p-4">
      <div className="flex h-full w-full max-w-screen-2xl flex-col rounded-lg border bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-xl font-bold">{thingName}</h3>
        <div className="border-b-2 border-gray-200"></div>
        {dataStreams.length === 0 ? (
          <div className="mt-4 text-center text-red-600">
            Chưa có luồng dữ liệu
          </div>
        ) : (
          <table className="mt-4 w-full border-separate overflow-hidden rounded-lg border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">STT</th>
                <th className="border border-gray-300 px-4 py-2">
                  Luồng dữ liệu
                </th>
                <th className="border border-gray-300 px-4 py-2">Mô tả</th>
              </tr>
            </thead>
            <tbody>
              {dataStreams.map((dataStream, index) => (
                <tr
                  key={dataStream.id}
                  className="bg-white transition duration-200 ease-in-out hover:bg-gray-100"
                >
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">
                    {dataStream.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {dataStream.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListDataStream;
