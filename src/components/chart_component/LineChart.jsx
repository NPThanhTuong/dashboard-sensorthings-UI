import React, { useState, useEffect, useRef, useMemo } from "react";
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

const LineChart = ({ dataStreams, observations }) => {
  const chartRefs = useRef([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const translations = useTranslations(language);

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
    const gradientConfig = gradientColors[key] || gradientColors.default;
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
            className=" text-center text-lg font-bold"
            style={{ fontFamily: "Roboto" }}
          >
            {dataStream.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
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

  // Sử dụng useEffect để set cờ dữ liệu đã tải xong
  useEffect(() => {
    setDataLoaded(true);
  }, []);

  // Kiểm tra nếu không có data streams hoặc observations
  if (
    !dataStreams ||
    dataStreams.length === 0 ||
    Object.keys(observations).length === 0 ||
    !translations
  ) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl bg-white p-6 ${dataLoaded ? "" : "hidden"} ${
        isDarkMode
          ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white"
          : "border-white bg-white"
      }`}
    >
      <h1
        className="-mt-4 mb-4 text-center text-xl font-bold "
        style={{ fontFamily: "Roboto" }}
      >
        {translations["Biểu đồ"]}
      </h1>
      <div className={`grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 `}>
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
