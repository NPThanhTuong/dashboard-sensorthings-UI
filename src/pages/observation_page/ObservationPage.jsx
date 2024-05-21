// import component data
import Light from "../../components/control_component/Light";
import SoilHumidity from "../../components/control_component/SoilHumidity";
import Temperature from "../../components/control_component/Temperature";

// import component chart
import ChartLight from "../../components/chart_component/ChartLight";
import ChartSoilHumidity from "../../components/chart_component/ChartSoilHumidity";

const ObservationPage = () => {
  return (
    <>
      <section className="flex w-full gap-3">
        {/* <div className="relative h-[260px] w-full overflow-hidden rounded">
          <img
            src="../../../public/images/vuon-sau-rieng.png"
            alt="background khu vuon"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-white bg-opacity-70 p-4">
            <div className="text-3xl font-bold">Tên vườn</div>
            <div className="text-3xl font-bold">thời gian, nhiệt độ</div>
          </div>
        </div> */}
        <div className="w-full rounded bg-white p-2">
          <div className="flex w-full gap-3">
            <SoilHumidity />
            <Light />
          </div>
          <div className="my-2 border-4 border-white"></div>
          <div className="flex w-full gap-3">
            <Temperature />
            <Temperature />
          </div>
        </div>
      </section>
      <section className="mt-4 flex gap-4">
        <div className="w-full rounded bg-white">
          <ChartSoilHumidity />
        </div>
        <div className="w-full rounded bg-white">
          <ChartLight />
        </div>
      </section>
    </>
  );
};

export default ObservationPage;
