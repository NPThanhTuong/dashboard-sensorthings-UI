import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Modal, Row, Col, Spin } from "antd";
import AddDataStream from "@/components/home_component/datastream_component/AddDataStream";
import HeaderSettingThing from "@/components/home_component/thing_component/HeaderSettingThing";
import TaskingCapabilityForm from "@/components/home_component/taskingcapability_component/TaskingCapabilityForm";
import FetchTaskData from "@/components/home_component/actuator_component/FetchTaskData";
import { fetchDataStreams, fetchSensors } from "@/apis/DataStreamAPI";
import DataStreamsTable from "@/components/home_component/datastream_component/DataStreamTable";
import { useTheme } from "@/context/ThemeContext";
import { useTranslations } from "@/config/useTranslations";
import { useLanguage } from "@/context/LanguageContext";

const SettingThingPage = () => {
  const { isDarkMode } = useTheme();
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

  const { language } = useLanguage();
  const translations = useTranslations(language);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const streams = await fetchDataStreams(thingId, token);
        setDataStreams(streams);
        await fetchSensorsForDataStreams(streams);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (thingId && token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [thingId, token]);

  const fetchSensorsForDataStreams = async (dataStreams) => {
    try {
      const sensorPromises = dataStreams.map(async (dataStream) => {
        const sensor = await fetchSensors(dataStream.id, token);
        return { ...dataStream, sensor };
      });
      const dataStreamsWithSensors = await Promise.all(sensorPromises);
      const sensorsMap = dataStreamsWithSensors.reduce((acc, curr) => {
        acc[curr.id] = curr.sensor;
        return acc;
      }, {});
      setSensors(sensorsMap);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      setError(error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

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

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="loading-text text-4xl font-bold text-gray-500">
            <Spin size="large" />
          </div>
        </div>
      ) : (
        <>
          <HeaderSettingThing
            thingId={thingId}
            intervalTimes={intervalTimes}
            setIntervalTime={setIntervalTime}
            showModal={showDataStreamModal}
            showTaskModal={showTaskModal}
            showTaskingCapabilityModal={showTaskingCapabilityModal}
          />
          {!loading && (
            <section className={`my-4 `}>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <DataStreamsTable
                    dataStreams={dataStreams}
                    sensors={sensors}
                    error={error}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    indexOfFirstItem={indexOfFirstItem}
                    paginate={paginate}
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <FetchTaskData thingId={thingId} />
                </Col>
              </Row>
            </section>
          )}
          <section
            className={`${isDarkMode ? "dark:bg-darkPrimary dark:text-black" : ""}`}
          >
            <Modal
              title={null}
              open={isDataStreamModalOpen}
              onOk={handleDataStreamModalOk}
              onCancel={handleCancel}
              footer={null}
              closable={false}
              style={{ padding: 0 }}
              className={`${isDarkMode ? "dark:text-black" : ""}`}
            >
              <AddDataStream />
            </Modal>

            <Modal
              title={null}
              open={isTaskingCapabilityModalOpen}
              onOk={handleTaskingCapabilityModalOk}
              onCancel={handleCancel}
              footer={null}
              closable={false}
              style={{ padding: 0 }}
              className={isDarkMode ? "dark-mode" : ""}
            >
              <TaskingCapabilityForm />
            </Modal>
          </section>
        </>
      )}
    </>
  );
};

export default SettingThingPage;
