// Hàm định dạng thời gian
export const formatTime = (date) => date.toLocaleTimeString(); // toLocaleTimeString() định dạng chỉ lấy giờ

// Hàm định dạng ngày tháng năm
export const formatDate = (date) =>
  date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
