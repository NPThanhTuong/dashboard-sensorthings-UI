import { Button, Card, Divider, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const DataStreamDisplay = ({ selectedDataStream, sensorData }) => {
  const navigate = useNavigate();

  const datastreamId = selectedDataStream?.id;

  return (
    <Card
      className="h-full w-full rounded-xl p-6 shadow-lg"
      style={{ background: "#f9f9f9", borderColor: "#d9d9d9" }}
    >
      {selectedDataStream ? (
        <>
          <Title level={3} className="mb-4 font-bold">
            {selectedDataStream?.name}
          </Title>
          <div className="mb-6">
            <Text strong style={{ fontSize: "16px" }}>
              Mô tả:{" "}
            </Text>
            <Text style={{ fontSize: "16px" }}>
              {selectedDataStream?.description}
            </Text>
          </div>
          {sensorData && (
            <>
              <Divider />
              <Title level={4} className="mb-4 font-bold">
                Thông tin sensor
              </Title>
              <div className="mb-6">
                <Text strong style={{ fontSize: "16px" }}>
                  Tên:{" "}
                </Text>
                <Text style={{ fontSize: "16px" }}>{sensorData?.name}</Text>
              </div>
              <div className="mb-6">
                <Text strong style={{ fontSize: "16px" }}>
                  Mô tả:{" "}
                </Text>
                <Text style={{ fontSize: "16px" }}>
                  {sensorData?.description}
                </Text>
              </div>
              <Button
                style={{ backgroundColor: "#ff8e3c", borderColor: "#ff8e3c" }}
                onClick={() => navigate(`/observation/${datastreamId}`)}
                shape="round"
                size="large"
                className="button-primary"
              >
                Quan sát
              </Button>
            </>
          )}
        </>
      ) : (
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Chọn luồng dữ liệu
        </Text>
      )}
    </Card>
  );
};

export default DataStreamDisplay;
