import { request } from "@/utils/request";
//import dayjs from "dayjs";

// Lấy observation thuộc data stream (Lấy kết quả mới nhất)

export const fetchLatestObservation = async (dataStreamId, token) => {
  try {
    const response = await request.get(
      `/get/datastreams(${dataStreamId})/observations?top=all`,
      {
        headers: { token },
      },
    );
    if (response.data && response.data.length > 0) {
      // Sort observations by time in descending order and return the latest one
      const sortedObservations = response.data.sort(
        (a, b) => new Date(b.result[0].time) - new Date(a.result[0].time),
      );
      return sortedObservations[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching latest observation:", error);
    throw error;
  }
};

export const fetchObservations = async (dataStreamId, token) => {
  try {
    const response = await request.get(
      `/get/datastreams(${dataStreamId})/observations?top=all`,
      {
        headers: { token },
      },
    );

    if (response.data && response.data.length > 0) {
      // Sort by time in ascending order
      const sortedData = response.data.sort(
        (a, b) => new Date(a.result[0].time) - new Date(b.result[0].time),
      );
      return sortedData;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching observations:", error);
    throw error;
  }
};

// Lấy tất cả observation thuộc data stream //
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
    console.error("Lỗi lấy observations:", error);
    throw error;
  }
};
