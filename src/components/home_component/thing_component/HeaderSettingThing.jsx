import React from "react";
import { Button, InputNumber } from "antd";

const HeaderSettingThing = ({
  thingId,
  intervalTimes,
  setIntervalTime,
  showModal,
  showTaskingCapabilityModal,
}) => {
  return (
    <section className="flex items-center justify-between rounded-2xl bg-white px-4 py-8 shadow-md">
      <div className="flex gap-4">
        <Button type="primary" onClick={showModal} className="w-40 rounded-2xl">
          Thêm data stream
        </Button>

        <Button
          type="primary"
          onClick={showTaskingCapabilityModal}
          className="w-40 rounded-2xl"
        >
          Thêm nhiệm vụ
        </Button>
      </div>
      <div className="flex items-center">
        <span className="mr-2">Thời gian nhận dữ liệu (phút):</span>
        <InputNumber
          className="border border-primary"
          min={1}
          value={intervalTimes[thingId] || 5} // Mặc định là 5 nếu không được đặt
          onChange={(value) => setIntervalTime(thingId, value)}
        />
      </div>
    </section>
  );
};

export default HeaderSettingThing;
