import { request } from "@/utils/request";

export const fetchSensors = async (token) => {
  try {
    const response = await request.get("/get/sensors?top=all", {
      headers: {
        token: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy sensors:", error);
    throw error;
  }
};
//
