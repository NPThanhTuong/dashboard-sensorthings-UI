import SensorInforCard from "@/components/information_component/SensorInforCard";
import { useParams } from "react-router-dom";
import DatastreamInforCard from "@/components/information_component/DatastreamInforCard";
import { Button, ConfigProvider, DatePicker, notification } from "antd";
import { WarningOutlined, FileExcelOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import ObservationChart from "@/components/chart_component/ObservationChart";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import viVN from "antd/lib/locale/vi_VN";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const { RangePicker } = DatePicker;

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.updateLocale("vi", {
  weekdaysShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  monthsShort: [
    "Th1",
    "Th2",
    "Th3",
    "Th4",
    "Th5",
    "Th6",
    "Th7",
    "Th8",
    "Th9",
    "Th10",
    "Th11",
    "Th12",
  ],
});
dayjs.locale("vi");

export default function DetailDatastreamPage() {
  const { datastreamId } = useParams();
  const [datastreamInfo, setDatastreamInfo] = useState();
  const [isErrorDatePicker, setIsErrorDatePicker] = useState(false);
  const [pickedDate, setPickedDate] = useState([]);
  const [isGetAll, setIsGetAll] = useState(true);
  const { token } = useAuth();
  const [api, contextHolder] = notification.useNotification();
  const MAX_SORT_DAY = 3;

  useEffect(() => {
    try {
      if (!token) {
        throw new Error("Token không tồn tại");
      }

      const getDatastreamInfo = async () => {
        const res = await axios.get(`/api/get/datastreams(${datastreamId})`, {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        setDatastreamInfo(res.data[0]);
      };
      getDatastreamInfo();
    } catch (error) {
      console.log("Lỗi lấy dữ liệu cảm biến");
    }
  }, [datastreamId]);

  const handleChangeDate = (date, dateString) => {
    if (!date) {
      setIsGetAll(true);
      setIsErrorDatePicker(false);
    } else {
      setIsGetAll(false);
      const [startDate, endDate] = date;
      setIsErrorDatePicker(false);

      const diffHour = Math.abs(startDate.diff(endDate, "hour"));

      if (diffHour > MAX_SORT_DAY * 24) {
        setIsErrorDatePicker(true);
        api.open({
          message: "Chọn ngày, giờ không hợp lệ!",
          description: `Vui lòng chọn ngày, giờ trong khoảng thời gian ${MAX_SORT_DAY * 24} giờ`,
          icon: <WarningOutlined style={{ color: "#faad14" }} />,
        });
      } else {
        setPickedDate([startDate, endDate]);
      }
    }
  };

  return (
    <div>
      {contextHolder}
      <h2 className="mb-3 mt-2 text-2xl font-semibold text-headline">
        Quan trắc dữ liệu
      </h2>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Xem dữ liệu quan trắc từ cảm biến và điều khiển thiết bị
        </p>
        <Button type="primary" size="large" icon={<FileExcelOutlined />}>
          {" "}
          Xuất tập dữ liệu
        </Button>
      </div>
      {/* "flex-col items-center": để căn giữa các thẻ ra giữa khi thu sidebar */}
      <div className="container mx-auto mt-14 flex-col items-center">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          {/* Thẻ hiện thông tin sensor */}
          <SensorInforCard datastreamId={datastreamId} />
          {/* Thẻ hiện thông tin luồng dữ liệu */}
          <DatastreamInforCard data={datastreamInfo} />
        </div>

        {/* Biểu đồ dữ liệu observations */}
        <ConfigProvider locale={viVN}>
          <div className="my-5 w-full rounded-md bg-secondary p-5 shadow-lg">
            <div className="flex justify-between">
              <h4 className="text-lg font-bold">Dữ liệu quan trắc</h4>
              <RangePicker
                showTime
                onChange={handleChangeDate}
                format="DD-MM-YYYY HH:mm:ss"
                status={isErrorDatePicker && "error"}
              />
            </div>
            <ObservationChart
              datastreamId={datastreamId}
              pickedDate={pickedDate}
              chartLabel={datastreamInfo?.name}
              chartBgColor="rgba(238, 173, 14, 0.5)"
              chartBorderColor="rgba(238, 173, 14, 1)"
              chartTitle="Theo thời gian"
              chartColunmYTitle={datastreamInfo?.name}
              className="mt-6"
              isGetAll={isGetAll}
              isError={isErrorDatePicker}
            />
          </div>
        </ConfigProvider>
      </div>
    </div>
  );
}
