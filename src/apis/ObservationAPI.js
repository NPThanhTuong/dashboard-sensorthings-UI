import { request } from "@/utils/request";

// Lấy quan sát mới nhất cho một dòng dữ liệu
export const fetchLatestObservation = async (dataStreamId, token) => {
  try {
    const response = await request.get(
      `/get/datastreams(${dataStreamId})/observations?top=all`,
      {
        headers: { token },
      },
    );
    if (response.data && response.data.length > 0) {
      // Lọc ra các quan sát không có cấu trúc mong đợi
      const validObservations = response.data.filter(
        (obs) => obs.result && obs.result[0] && obs.result[0].time,
      );

      if (validObservations.length > 0) {
        // Sắp xếp các quan sát theo thời gian giảm dần và trả về quan sát mới nhất
        const sortedObservations = validObservations.sort(
          (a, b) => new Date(b.result[0].time) - new Date(a.result[0].time),
        );
        return sortedObservations[0];
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching latest observation:", error);
    throw error;
  }
};

// Lấy tất cả các quan sát cho một dòng dữ liệu
export const fetchObservations = async (dataStreamId, token) => {
  try {
    const response = await request.get(
      `/get/datastreams(${dataStreamId})/observations?top=all`,
      {
        headers: { token },
      },
    );

    if (response.data && response.data.length > 0) {
      // Lọc ra các quan sát không có cấu trúc mong đợi
      const validObservations = response.data.filter(
        (obs) => obs.result && obs.result[0] && obs.result[0].time,
      );

      if (validObservations.length > 0) {
        // Sắp xếp theo thời gian tăng dần
        const sortedData = validObservations.sort(
          (a, b) => new Date(a.result[0].time) - new Date(b.result[0].time),
        );
        return sortedData;
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching observations:", error);
    throw error;
  }
};

// Lấy tất cả các quan sát cho một biểu đồ
export const fetchObservationsChart = async (dataStreamId, token) => {
  try {
    const response = await request.get(
      `/get/datastreams(${dataStreamId})/observations?top=all`,
      {
        headers: { token },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching observations:", error);
    throw error;
  }
};
