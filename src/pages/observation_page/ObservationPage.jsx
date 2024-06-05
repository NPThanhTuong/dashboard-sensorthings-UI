// eslint-disable-next-line no-unused-vars
import React from "react";
import Light from "@/components/control_component/Light";
import SoilHumidity from "@/components/control_component/SoilHumidity";
import Inspect from "@/components/card_component/Inspect";
import lightIcon from '@/components/card_component/icon/lux-icon.png'; // Có thể thay thế theo nhu cầu người dùng
import humidityIcon from '@/components/card_component/icon/humidity-icon.png'; // Có thể thay thế theo nhu cầu người dùng
// import component chart
import ChartLight from "@/components/chart_component/LightChartDay";
import ChartSoilHumidity from "@/components/chart_component/SoilHumidityChartDay";

const ObservationPage = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex h-dvh flex-col gap-2 overflow-y-auto overflow-x-hidden rounded-lg bg-slate-50 p-2">
        <div className="flex gap-2">
          <SoilHumidity />
          <Light />
        </div>
        <div className="flex gap-2">
          <Inspect 
            title="Ánh Sáng" 
            value="30" 
            unit="candela" 
            icon={lightIcon} 
          />
          <Inspect 
            title="Độ Ẩm Đất" 
            value="2" 
            unit="%" 
            icon={humidityIcon} 
          />
        </div>
      </div>

      <div className="flex h-dvh flex-col gap-4 rounded-lg bg-slate-50 p-2">
        <div className="w-full rounded bg-white">
          <ChartSoilHumidity />
        </div>
        <div className="w-full rounded bg-white">
          <ChartLight />
        </div>
      </div>
    </div>
  );
};

export default ObservationPage;
