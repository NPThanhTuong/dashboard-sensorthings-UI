// Config màu cho Line Chart
export const gradientColors = {
  temperature: {
    start: "rgba(0, 187, 0, 1)",
    end: "rgba(250, 255, 252, 0.1)",
  },
  humidity: {
    start: "rgba(0, 47, 255, 1)",
    end: "rgba(237, 240, 254, 0.1)",
  },

  light: {
    start: "rgba(255, 191, 0, 1)",
    end: "rgba(237, 240, 254, 0.1)",
  },
  soilmoisture: {
    start: "rgba(138, 41, 8, 1)",
    end: "rgba(237, 240, 254, 0.1)",
  },

  // Thêm từ khóa (key) và màu khi có trường mới
  default: {
    start: "rgba(0, 0, 0, 0.5)",
    end: "rgba(0, 0, 0, 0.1)",
  },
};

// config màu cho Observation Chart (Biểu đồ chi tiết)
export const colorMapping = {
  temperature: {
    start: "rgba(0, 187, 0, 1)",
    middle: "rgba(0, 255, 0, 0.5)",
    end: "rgba(250, 255, 252, 0.1)",
  },
  humidity: {
    start: "rgba(0, 47, 255, 1)",
    middle: "rgba(0, 0, 255, 0.5)",
    end: "rgba(237, 240, 254, 0.1)",
  },

  light: {
    start: "rgba(255, 191, 0, 1)",
    middle: "rgba(255, 255, 0, 0.5)",
    end: "rgba(237, 240, 254, 0.1)",
  },
  soilmoisture: {
    start: "rgba(138, 41, 8, 1)",
    middle: "rgba(218, 112, 76, 0.5)",
    end: "rgba(237, 240, 254, 0.1)",
  },

  default: {
    start: "rgba(0, 0, 0, 0.7)",
    middle: "rgba(77, 77, 77, 0.5)",
    end: "rgba(155, 155, 155, 0.2)",
  },
};
