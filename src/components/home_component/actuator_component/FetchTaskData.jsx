import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Skeleton, Alert, Pagination, message, Switch } from "antd";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";

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
          }, //
        );
        const actuators = response.data;

        const storedStates = JSON.parse(Cookies.get("actuatorStates") || "{}");

        const actuatorsWithData = actuators.map((actuator) => ({
          actuatorId: actuator.id,
          actuatorName: actuator.name,
          taskId: null,
          taskingParameters: null,
          controlState:
            storedStates[actuator.id] !== undefined
              ? storedStates[actuator.id]
              : actuator.controlState,
        }));

        setTasksData(actuatorsWithData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching actuators data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchActuatorsData();
  }, [thingId, token]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSwitchChange = async (checked, actuator) => {
    const newControlState = checked ? 1 : 0;

    try {
      // Optimistically update local state
      setTasksData((prevTasks) =>
        prevTasks.map((task) =>
          task.actuatorId === actuator.actuatorId
            ? { ...task, controlState: newControlState }
            : task,
        ),
      );

      // Update control state in cookies
      const updatedControlStates = {
        ...JSON.parse(Cookies.get("actuatorStates") || "{}"),
        [actuator.actuatorId]: newControlState,
      };
      Cookies.set("actuatorStates", JSON.stringify(updatedControlStates), {
        expires: 7,
      });

      const response = await axios.post("/api/post/task", {
        taskingParameters: newControlState === -1 ? 1 : 0,
        thing_id: parseInt(thingId),
        actuator_id: actuator.actuatorId,
        token,
      });

      if (response.status === 201) {
        message.success(
          `Đã ${checked ? "bật" : "tắt"} ${actuator.actuatorName}`,
        );
      } else {
        message.error("Bật tắt thất bại");
        // Revert back to original state if API call fails
        setTasksData((prevTasks) =>
          prevTasks.map((task) =>
            task.actuatorId === actuator.actuatorId
              ? { ...task, controlState: checked ? 0 : 1 }
              : task,
          ),
        );
      }
    } catch (error) {
      message.error("Bật tắt thất bại");
      console.error("Lỗi bật tắt:", error);
      // Revert back to original state if API call fails
      setTasksData((prevTasks) =>
        prevTasks.map((task) =>
          task.actuatorId === actuator.actuatorId
            ? { ...task, controlState: checked ? 0 : 1 }
            : task,
        ),
      );
    }
  };

  const columns = [
    {
      title: "Bộ truyền động",
      dataIndex: "actuatorName",
      key: "actuatorName",
    },
    {
      title: "Trạng thái",
      dataIndex: "controlState",
      key: "controlState",
      render: (controlState) => {
        switch (controlState) {
          case -1:
            return "Mới";
          case 0:
            return "Đang tắt";
          case 1:
            return "Đang mở";
          default:
            return "Không xác định";
        }
      },
    },
    {
      title: "Điều khiển",
      key: "control",
      render: (text, record) => (
        <Switch
          checked={record.controlState === 1}
          onChange={(checked) => handleSwitchChange(checked, record)}
          checkedChildren="On"
          unCheckedChildren="Off"
        />
      ),
    },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = tasksData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="rounded-2xl bg-white">
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
            rowKey="actuatorId"
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
