import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ observations, dataStreamId, dataType }) => {
  const unitMap = {
    5: "lux",
    6: "%",
  };

  const unit = unitMap[dataStreamId] || "";

  const getChartData = () => {
    const labels = observations?.map((obs) =>
      new Date(obs.resultTime)?.toLocaleString(),
    );
    const data = observations?.map((obs) => obs.result[0]);
    return {
      labels,
      datasets: [
        {
          label: `${dataType} (${unit})`,
          data,
          fill: false,
          backgroundColor: "rgb(255, 165, 0,1)",
          borderColor: "rgba(255, 165, 0, 0.5)",
        },
      ],
    };
  };

  return (
    <div className="flex flex-col items-center">
      <Line data={getChartData()} />
    </div>
  );
};

export default LineChart;
