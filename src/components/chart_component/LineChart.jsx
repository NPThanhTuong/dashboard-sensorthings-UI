import React, { useRef, useMemo, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { gradientColors } from "@/config/chartConfig";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
);

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";

// Tạo ánh xạ giữa các khóa đã làm sạch và các khóa gốc
const keyMap = Object.keys(gradientColors).reduce((acc, key) => {
  acc[key.replace(/\s+/g, "").toLowerCase()] = key;
  return acc;
}, {});

const LineChart = ({ dataStreams, observations }) => {
  const chartRefs = useRef([]);
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const translations = useTranslations(language);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (dataStreams && Object.keys(observations).length > 0) {
      setLoaded(true); // Nếu có dữ liệu, đặt loaded thành true
    }
  }, [dataStreams, observations]);

  // Check if all dataStreams have corresponding data in observations
  const hasAllDataStreamsData = dataStreams.every(
    (dataStream) =>
      observations[dataStream.id] && observations[dataStream.id].length > 0,
  );

  if (!hasAllDataStreamsData) {
    return null;
  }

  // Cấu hình biểu đồ với các tùy chọn tối ưu
  const chartOptions = useMemo(
    () => ({
      scales: {
        x: {
          display: false,
          ticks: {
            color: isDarkMode ? "#FFFFFF" : "#000000",
          },
        },
        y: {
          display: true,
          beginAtZero: true,
          ticks: {
            color: isDarkMode ? "#FFFFFF" : "#000000",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: isDarkMode ? "#FFFFFF" : "#000000",
          },
        },
      },
      maintainAspectRatio: false,
      responsive: true,
      elements: {
        point: { radius: 0 },
      },
    }),
    [isDarkMode],
  );

  // Hàm làm sạch và tách giá trị và đơn vị từ chuỗi
  const cleanUnit = (value) => {
    const match = value.match(/^([\d.]+)\s*\((.*)\)$/);
    if (match) {
      return { value: parseFloat(match[1]), unit: match[2] };
    }
    return { value: parseFloat(value), unit: "" };
  };

  // Hàm lấy gradient cho biểu đồ
  const getGradient = (ctx, key) => {
    const cleanedKey = key.replace(/\s+/g, "").toLowerCase();
    const gradientConfig =
      gradientColors[keyMap[cleanedKey]] || gradientColors.default;
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, gradientConfig.start);
    gradient.addColorStop(1, gradientConfig.end);
    return gradient;
  };

  // Hàm render biểu đồ đường
  const renderLineChart = (dataStream, obsData, index) => {
    const labels = obsData.map((obs) => obs.result[0].time);
    const keys = Object.keys(obsData[0].result[0]).filter(
      (key) => key !== "time",
    );

    const datasets = keys.map((key) => {
      const unit = cleanUnit(obsData[0].result[0][key]).unit;
      let gradient = null;
      if (chartRefs.current[index]) {
        const ctx = chartRefs.current[index].ctx;
        gradient = getGradient(ctx, key);
      }

      return {
        label: `${key.charAt(0).toUpperCase() + key.slice(1)} (${unit})`,
        data: obsData.map((obs) => cleanUnit(obs.result[0][key]).value),
        fill: "start",
        borderColor: gradient,
        backgroundColor: gradient,
      };
    });

    const chartData = { labels: labels.slice(-20), datasets };

    return (
      <section key={dataStream.id} className="">
        <div
          className={`result-section rounded-2xl border bg-white shadow-lg ${
            isDarkMode
              ? "dark:border-darkPrimary dark:bg-darkSecondary dark:text-white"
              : "border-white bg-white"
          }`}
        >
          <h2
            className=" my-4 text-center text-lg font-bold"
            style={{ fontFamily: "Roboto" }}
          >
            {dataStream.name}
          </h2>
          <div className="grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {datasets.map((dataset) => (
              <div key={dataset.label} className="h-52 w-64">
                <Line
                  ref={(el) => (chartRefs.current[index] = el)}
                  data={{ labels: labels.slice(-20), datasets: [dataset] }}
                  options={chartOptions}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Kiểm tra nếu không có data streams hoặc observations
  if (
    !dataStreams ||
    dataStreams.length === 0 ||
    Object.keys(observations).length === 0
  ) {
    return null;
  }

  if (!translations) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl bg-white p-6 ${
        isDarkMode
          ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white"
          : "border-white bg-white"
      }`}
    >
      <h1
        className="-mt-4 mb-4 text-center text-xl font-bold "
        style={{
          fontFamily: "Roboto",
          visibility: loaded ? "visible" : "hidden",
        }}
      >
        {translations["Biểu đồ"]}
      </h1>

      <div className={`grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2`}>
        {dataStreams.map((dataStream, index) => {
          const obsData = observations[dataStream.id] || [];

          if (obsData.length > 0) {
            return renderLineChart(dataStream, obsData, index);
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default LineChart;
