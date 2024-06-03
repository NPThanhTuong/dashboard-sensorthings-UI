import Light from "@/components/control_component/Light";
import SoilHumidity from "@/components/control_component/SoilHumidity";

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
