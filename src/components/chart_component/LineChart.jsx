import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";

const LineChart = ({ observations, dataStreamId, dataType }) => {
  const unitMap = {
    5: "lux",
    6: "%",
  };

  const [startDate, setStartDate] = useState(moment().subtract(3, "days"));
  const [endDate, setEndDate] = useState(moment());

  const unit = unitMap[dataStreamId] || "";

  const getChartData = () => {
    const filteredObservations = observations.filter((obs) =>
      moment(obs.resultTime).isBetween(startDate, endDate),
    );

    const labels = filteredObservations.map((obs) =>
      moment(obs.resultTime).format("DD/MM/YYYY HH:mm:ss"),
    );
    const data = filteredObservations.map((obs) => obs.result[0]);

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

  const options = {
    scales: {
      y: {
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  const chartData = getChartData();

  return (
    <>
      <section className="flex gap-5">
        <div>
          <label className="text-base">Ngày bắt đầu: </label>
          <input
            type="date"
            value={startDate.format("YYYY-MM-DD")}
            onChange={(e) => setStartDate(moment(e.target.value))}
            className="border px-2 py-1"
          />
        </div>
        <div>
          <label className="text-base">Ngày kết thúc: </label>
          <input
            type="date"
            value={endDate.format("YYYY-MM-DD")}
            onChange={(e) => setEndDate(moment(e.target.value))}
            className="border px-2 py-1"
          />
        </div>
      </section>

      {chartData.datasets[0].data.length > 0 ? (
        <Line data={chartData} options={options} height={100} />
      ) : (
        <p className="text-center text-red-500">Không có dữ liệu</p>
      )}
    </>
  );
};

export default LineChart;
