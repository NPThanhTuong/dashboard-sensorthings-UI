import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Table, Skeleton, Alert, Pagination } from "antd";

const FetchTaskData = ({ thingId }) => {
  const [tasksData, setTasksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { token } = useAuth();

  useEffect(() => {
    const fetchActuatorsData = async () => {
      try {
        const response = await axios.get(
          `/api/get/things(${thingId})/actuator?top=all`,
          {
            headers: {
              token: token,
            },
          },
        );
        const actuators = response.data;

        const tasksPromises = actuators?.map(async (actuator) => {
          const taskResponse = await axios.get(
            `/api/get/actuator(${actuator.id})/task`,
            {
              headers: {
                token: token,
              },
            },
          );
          return taskResponse.data.map((task) => ({
            actuatorId: actuator.id,
            actuatorName: actuator.name,
            taskId: task.id,
            taskingParameters: task.taskingParameters,
          }));
        });

        const actuatorsWithData = (await Promise.all(tasksPromises)).flat();
        setTasksData(actuatorsWithData);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchActuatorsData();
  }, [thingId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const mapTaskingParameters = (value) => {
    switch (value) {
      case -1:
        return "mới";
      case 0:
        return "đang tắt";
      case 1:
        return "đang mở";

      default:
        return value;
    }
  };

  const columns = [
    {
      title: "Bộ truyền động",
      dataIndex: "actuatorName",
      key: "actuatorName",
    },
    {
      title: "ID nhiệm vụ",
      dataIndex: "taskId",
      key: "taskId",
    },
    {
      title: "Tham số nhiệm vụ",
      dataIndex: "taskingParameters",
      key: "taskingParameters",
      render: (taskingParameters) => mapTaskingParameters(taskingParameters),
    },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = tasksData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white">
      {loading ? (
        <Skeleton active />
      ) : error ? (
        <Alert message={`Lỗi: ${error.message}`} type="error" showIcon />
      ) : (
        <>
          <Table
            dataSource={currentTasks}
            columns={columns}
            pagination={false}
            rowKey="taskId"
          />
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={tasksData.length}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FetchTaskData;
