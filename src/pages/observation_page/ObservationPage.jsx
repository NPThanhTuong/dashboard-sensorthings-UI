// import component data
import Light from "../../components/control_component/Light";
import SoilHumidity from "../../components/control_component/SoilHumidity";
//import Temperature from "../../components/control_component/Temperature";

// import component chart
import ChartLight from "../../components/chart_component/LightChartDay";
import ChartSoilHumidity from "../../components/chart_component/SoilHumidityChartDay";

import LightTable from "../../components/table_component/LightTable";
import SoilHumidityTable from "../../components/table_component/SoilHumidityTable ";

const ObservationPage = () => {
  return (
    <div className="mx-auto px-4">
      <div className="mb-8 mt-4 flex items-center justify-between">
        <SoilHumidity />
        <Light />
      </div>

      <div className="flex min-w-full gap-4">
        <div className="w-full rounded bg-white">
          <ChartSoilHumidity />
        </div>
        <div className="w-full rounded bg-white">
          <ChartLight />
        </div>
<<<<<<< HEAD
      </section>

      <section className="mt-4 flex gap-4">
        <div className="w-full rounded bg-white">
          <SoilHumidityTable />

        </div>
        <div className="w-full rounded bg-white">
          <LightTable />

        </div>
      </section>
    </>
=======
      </div>
    </div>
>>>>>>> origin/main
  );
};

export default ObservationPage;
