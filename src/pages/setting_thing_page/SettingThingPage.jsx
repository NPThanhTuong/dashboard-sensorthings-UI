import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Pagination, Skeleton, Modal, Table, Alert, Spin } from "antd";
import AddDataStream from "@/components/home_component/datastream_component/AddDataStream";
import HeaderSettingThing from "@/components/home_component/thing_component/HeaderSettingThing";
import TaskingCapabilityForm from "@/components/home_component/taskingcapability_component/TaskingCapabilityForm";
import FetchTaskData from "@/components/home_component/actuator_component/FetchTaskData";

const SettingThingPage = () => {
  const { token, intervalTimes, setIntervalTime } = useAuth();
  const { thingId } = useParams();
  const [dataStreams, setDataStreams] = useState([]);
  const [sensors, setSensors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDataStreamModalOpen, setIsDataStreamModalOpen] = useState(false);
  const [isTaskingCapabilityModalOpen, setIsTaskingCapabilityModalOpen] =
    useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const itemsPerPage = 10;

  const fetchDataStreams = async () => {
    try {
      const response = await axios.get(
        `/api/get/things(${thingId})/datastreams?top=all`,
        {
          headers: { token: token },
        },
      );

      if (Array.isArray(response.data)) {
        setDataStreams(response.data);
        await fetchSensors(response.data);
      } else {
        setDataStreams([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu luồng dữ liệu:", error);
      setError(error);
      setLoading(false);
    }
  };

  const fetchSensors = async (dataStreams) => {
    try {
      const sensorPromises = dataStreams?.map(async (dataStream) => {
        const response = await axios.get(
          `/api/get/datastreams(${dataStream.id})/sensors`,
          {
            headers: { token: token },
          },
        );
        return { [dataStream.id]: response.data[0] };
      });
      const sensorsArray = await Promise.all(sensorPromises);
      const sensorsMap = Object.assign({}, ...sensorsArray);
      setSensors(sensorsMap);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu cảm biến:", error);
      setError(error);
    }
  };

  useEffect(() => {
    if (thingId && token) {
      fetchDataStreams();
    } else {
      setLoading(false);
    }
  }, [thingId, token]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDataStreams = dataStreams.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const showTaskingCapabilityModal = () => {
    setIsTaskingCapabilityModalOpen(true);
  };

  const showDataStreamModal = () => {
    setIsDataStreamModalOpen(true);
  };

  const showTaskModal = () => {
    setIsTaskModalOpen(true);
  };

  const handleDataStreamModalOk = () => {
    setIsDataStreamModalOpen(false);
  };

  const handleTaskingCapabilityModalOk = () => {
    setIsTaskingCapabilityModalOpen(false);
  };

  const handleCancel = () => {
    setIsDataStreamModalOpen(false);
    setIsTaskModalOpen(false);
    setIsTaskingCapabilityModalOpen(false);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => indexOfFirstItem + index + 1,
    },
    {
      title: "Data Stream",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sensor",
      dataIndex: "sensor",
      key: "sensor",
      render: (_, record) => sensors[record.id]?.name || <Spin />,
    },
  ];

  return (
    <>
      <HeaderSettingThing
        thingId={thingId}
        intervalTimes={intervalTimes}
        setIntervalTime={setIntervalTime}
        showModal={showDataStreamModal}
        showTaskModal={showTaskModal}
        showTaskingCapabilityModal={showTaskingCapabilityModal}
      />
      <section className="my-4 flex justify-between gap-4">
        <div className="w-full rounded-xl bg-white p-4 shadow-md">
          {loading ? (
            <Skeleton active />
          ) : error ? (
            <Alert message={`Lỗi: ${error.message}`} type="error" showIcon />
          ) : dataStreams.length === 0 ? (
            <Alert message="Chưa có dữ liệu!" type="info" showIcon />
          ) : (
            <div className="flex h-full flex-col">
              <div className="flex-grow overflow-auto">
                <Table
                  dataSource={currentDataStreams?.map((dataStream) => ({
                    ...dataStream,
                    key: dataStream.id,
                  }))}
                  columns={columns}
                  pagination={false}
                  rowKey="id"
                />
              </div>
              <div className="mt-4 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={itemsPerPage}
                  total={dataStreams.length}
                  onChange={paginate}
                />
              </div>
            </div>
          )}
        </div>
        <div className="w-full rounded-xl bg-white p-4 shadow-md">
          <FetchTaskData thingId={thingId} />
        </div>
      </section>
      <Modal
        title="Thêm data stream"
        open={isDataStreamModalOpen}
        onOk={handleDataStreamModalOk}
        onCancel={handleCancel}
        footer={null}
      >
        <AddDataStream />
      </Modal>

      <Modal
        title="Thêm tasking capability"
        open={isTaskingCapabilityModalOpen}
        onOk={handleTaskingCapabilityModalOk}
        onCancel={handleCancel}
        footer={null}
      >
        <TaskingCapabilityForm />
      </Modal>
    </>
  );
};

export default SettingThingPage;
