import SensorInforCard from "@/components/information_component/SensorInforCard";
import { useParams } from "react-router-dom";
import DatastreamInforCard from "@/components/information_component/DatastreamInforCard";
import { DatePicker } from "antd";
import { useState } from "react";
import LightChartPage from "@/components/chart_component/LightChart";
const { RangePicker } = DatePicker;

export default function DetailDatastreamPage() {
  const { datastreamId } = useParams();
  const [statusDatePicker, setStatusDatePicker] = useState();

  return (
    <div>
      <h2 className="mb-1 mt-2 text-2xl font-semibold text-headline">
        Quan trắc dữ liệu
      </h2>
      <p className="text-sm text-gray-500">
        Xem dữ liệu quan trắc từ cảm biến và điều khiển thiết bị
      </p>
      {/* "flex-col items-center": để căn giữa các thẻ ra giữa khi thu sidebar */}
      <div className="container mx-auto mt-14 flex-col items-center">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          {/* Thẻ hiện thông tin sensor */}
          <SensorInforCard datastreamId={datastreamId} />
          {/* Thẻ hiện thông tin luồng dữ liệu */}
          <DatastreamInforCard datastreamId={datastreamId} />
        </div>

        {/* Biểu đồ dữ liệu observations */}
        <div className="my-5 w-full rounded-md bg-secondary p-5 shadow-lg">
          <div className="flex justify-between">
            <h4 className="text-lg font-bold">Dữ liệu quan trắc</h4>
            <RangePicker showTime />
          </div>
          <LightChartPage />
        </div>
      </div>
    </div>
  );
}
