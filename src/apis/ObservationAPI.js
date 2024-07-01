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

// import { request } from "@/utils/request";
// //import dayjs from "dayjs";

// // Lấy observation thuộc data stream (Lấy kết quả mới nhất)

// export const fetchLatestObservation = async (dataStreamId, token) => {
//   try {
//     const response = await request.get(
//       `/get/datastreams(${dataStreamId})/observations?top=all`,
//       {
//         headers: { token },
//       },
//     );
//     if (response.data && response.data.length > 0) {
//       // Sort observations by time in descending order and return the latest one
//       const sortedObservations = response.data.sort(
//         (a, b) => new Date(b.result[0].time) - new Date(a.result[0].time),
//       );
//       return sortedObservations[0];
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching latest observation:", error);
//     throw error;
//   }
// };

// export const fetchObservations = async (dataStreamId, token) => {
//   try {
//     const response = await request.get(
//       `/get/datastreams(${dataStreamId})/observations?top=all`,
//       {
//         headers: { token },
//       },
//     );

//     if (response.data && response.data.length > 0) {
//       // Sort by time in ascending order
//       const sortedData = response.data.sort(
//         (a, b) => new Date(a.result[0].time) - new Date(b.result[0].time),
//       );
//       return sortedData;
//     } else {
//       return [];
//     }
//   } catch (error) {
//     console.error("Error fetching observations:", error);
//     throw error;
//   }
// };

// // Lấy tất cả observation thuộc data stream //
// export const fetchObservationsChart = async (dataStreamId, token) => {
//   try {
//     const response = await request.get(
//       `/get/datastreams(${dataStreamId})/observations?top=all`,
//       {
//         headers: { token },
//       },
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi lấy observations:", error);
//     throw error;
//   }
// };
