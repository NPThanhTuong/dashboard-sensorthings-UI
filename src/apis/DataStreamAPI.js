import { request } from "@/utils/request";
// Thêm data stream
export const addDataStream = async (data, token) => {
  try {
    const response = await request.post("/post/datastreams", data, {
      headers: {
        token: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi thêm datastream:", error);
    throw error;
  }
};

// Lấy tất cả data stream thuộc Thing //
export const fetchDataStreams = async (thingId, token) => {
  try {
    const response = await request.get(
      `/get/things(${thingId})/datastreams?top=all`,
      {
        headers: { token },
      },
    );
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Lỗi lấy dữ liệu data streams:", error);
    throw error;
  }
};

// Lấy sensor thuộc data stream
export const fetchSensors = async (dataStreamId, token) => {
  try {
    const response = await request.get(
      `/get/datastreams(${dataStreamId})/sensors`,
      {
        headers: { token },
      },
    );
    return response.data[0];
  } catch (error) {
    console.error("Lỗi lấy dữ liệu cảm biến:", error);
    throw error;
  }
};
