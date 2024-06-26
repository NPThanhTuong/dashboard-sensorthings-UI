import React from "react";
import { Line } from "react-chartjs-2";
import { Empty } from "antd";
import { twMerge } from "tailwind-merge";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { colorMapping } from "@/config/chartConfig";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const ObservationChartContent = ({
  handleObservation,
  observationName,
  tabItems,
  units,
}) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const translations = useTranslations(language);

  const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const lowerizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toLowerCase() + string.slice(1);
  };

  const formatKey = (key) => {
    if (!key) return "";
    return key.replace(/\s+/g, "").toLowerCase();
  };

  const formattedObservationName = formatKey(
    observationName || tabItems[0]?.label,
  );
  const gradientColors =
    colorMapping[formattedObservationName] || colorMapping.default;

  const data = {
    labels: handleObservation.map((obs) =>
      new Date(obs.result[0]["time"]).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    ),
    datasets: [
      {
        label:
          capitalizeFirstLetter(observationName || tabItems[0]?.label) +
          ` ${units[formattedObservationName] || ""}`,
        data: handleObservation.map(
          (obs) =>
            obs.result[0][
              lowerizeFirstLetter(observationName || tabItems[0]?.label)
            ],
        ),
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, gradientColors.start);
          gradient.addColorStop(0.5, gradientColors.middle);
          gradient.addColorStop(1, gradientColors.end);
          return gradient;
        },
        borderColor: gradientColors.start,
        borderWidth: 1,
      },
    ],
  };

  if (!translations) {
    return null;
  }

  const options = {
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDarkMode ? "#FFFFFF" : "#000000",
        },
      },
      title: {
        display: true,
        text: `${translations["Biểu đồ đường thể hiện dữ liệu"]} ${capitalizeFirstLetter(
          observationName || tabItems[0]?.label,
        )}`,
        font: {
          size: 15,
        },
        color: isDarkMode ? "#FFFFFF" : "#000000",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          color: isDarkMode ? "#FFFFFF" : "#000000",
        },
        ticks: {
          color: isDarkMode ? "#FFFFFF" : "#000000",
        },
      },
      y: {
        title: {
          display: true,
          text:
            capitalizeFirstLetter(observationName || tabItems[0]?.label) +
            ` ${units[formattedObservationName] || ""}`,
          color: isDarkMode ? "#FFFFFF" : "#000000",
        },
        ticks: {
          color: isDarkMode ? "#FFFFFF" : "#000000",
        },
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    elements: {
      line: {
        fill: true,
      },
    },
  };

  return (
    <div className={twMerge("mt-6 flex flex-col items-center justify-center")}>
      {handleObservation.length > 0 ? (
        <div className={`w-full`}>
          <div
            className={`min-h-[60vh] rounded-2xl p-6 ${
              isDarkMode
                ? "dark:border-darkPrimary dark:bg-darkSecondary dark:text-white"
                : "border-white bg-white"
            }`}
          >
            <Line data={data} options={options} />
          </div>
        </div>
      ) : (
        <Empty description="Không có dữ liệu" />
      )}
    </div>
  );
};

export default ObservationChartContent;
