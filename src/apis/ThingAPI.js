import { request } from "@/utils/request";

// Lấy danh sách thing
export const fetchThings = async (token) => {
  try {
    const response = await request.get("/getThings", {
      headers: {
        token: token,
      },
    });

    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error("Error fetching data");
      return [];
    } //
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    throw error;
  }
};

// Lấy thông tin thing (chi tiết của thing)
export const fetchThingData = async (thingId, token) => {
  try {
    const response = await request.get(`/get/things(${thingId})`, {
      headers: { token },
    });
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Lỗi lấy dữ liệu:", error);
    throw error;
  }
};

// Thêm Thing mới
export const addThing = async (data, token) => {
  try {
    const response = await request.post("/post/things", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding thing:", error);
    throw error;
  }
};
