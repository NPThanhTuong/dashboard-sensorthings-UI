import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Image,
  Skeleton,
  Typography,
  Flex,
} from "antd";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";

export default function SensorInforCard({ datastreamId }) {
  const [sensorInfo, setSensorInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(false);
  const { token } = useAuth();

  const TEXT_ROWS = 2;

  useEffect(() => {
    setLoading(true);

    try {
      if (!token) {
        throw new Error("Token không tồn tại");
      }

      const getSensorInfo = async () => {
        const res = await axios.get(
          `/api/get/datastreams(${datastreamId})/sensors`,
          {
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          },
        );

        setSensorInfo(res.data[0]);
      };
      getSensorInfo();
    } catch (error) {
      console.log("Lỗi lấy dữ liệu cảm biến");
    }

    const timeoutId = setTimeout(() => setLoading(false), 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [datastreamId]);

  // Xử lý cho modal chỉnh sửa
  // const showModalEditSensor = () => {
  //   setIsModalOpen(true);
  // };

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };

  return (
    <Card
      title={<h4 className="text-lg font-bold">Thông tin cảm biến</h4>}
      // extra={ chỗ này để chỉnh sửa thông tin sensor
      //   <>
      //     <Button
      //       type="primary"
      //       icon={<EditOutlined />}
      //       onClick={showModalEditSensor}
      //     >
      //       Chỉnh sửa
      //     </Button>

      //     <Modal
      //       title="Basic Modal"
      //       open={isModalOpen}
      //       onOk={handleOk}
      //       onCancel={handleCancel}
      //     >
      //       <Form form={form} layout="vertical">
      //         <Form.Item
      //           label="Mã cảm biến:"
      //           tooltip="Trường mã cảm biến không được sửa đổi"
      //           disabled
      //         >
      //           <Input disabled value={sensorInfo?.id} />
      //         </Form.Item>
      //         <Form.Item
      //           label="Tên cảm biến:"
      //           tooltip={{
      //             title: "Đây là trường bắt buộc",
      //             icon: <InfoCircleOutlined />,
      //           }}
      //           rules={[
      //             {
      //               required: true,
      //               message: "Vui nhập trường này!",
      //             },
      //           ]}
      //         >
      //           <Input value={sensorInfo?.name} placeholder="Tên cảm biến" />
      //         </Form.Item>
      //         <Form.Item
      //           label="Mô tả cảm biến:"
      //           tooltip={{
      //             title: "Đây là trường bắt buộc",
      //             icon: <InfoCircleOutlined />,
      //           }}
      //           rules={[
      //             {
      //               required: true,
      //               message: "Vui nhập trường này!",
      //             },
      //           ]}
      //         >
      //           <Input.TextArea
      //             value={sensorInfo?.description}
      //             placeholder="Tên cảm biến"
      //           />
      //         </Form.Item>
      //       </Form>
      //     </Modal>
      //   </>
      // }
      style={{
        width: 650,
        backgroundColor: "#fffffe",
        borderColor: "#0d0d0d",
      }}
      bordered={false}
    >
      <Skeleton loading={loading} active>
        {sensorInfo && (
          <div className="flex gap-4">
            <div className="flex items-center">
              <Image
                width={200}
                src="/images/icons/temperature-control.png"
                fallback="/images/no-image.png"
                preview={false}
              />
            </div>
            <div>
              <h6 className="text-sm font-semibold text-tertiary">
                Mã cảm biến:
              </h6>
              <p className="ml-4 text-sub-headline">{sensorInfo?.id}</p>
              <h6 className="mt-3 text-sm font-semibold text-tertiary">
                Tên cảm biến:
              </h6>
              <p className="ml-4 text-sub-headline">{sensorInfo?.name}</p>
              <h6 className="mt-3 text-sm font-semibold text-tertiary">
                Mô tả:
              </h6>
              <Typography.Paragraph
                ellipsis={{
                  rows: TEXT_ROWS,
                  expandable: "collapsible",
                  expanded,
                  onExpand: (_, info) => setExpanded(info.expanded),
                }}
              >
                {sensorInfo?.description}
              </Typography.Paragraph>
            </div>
          </div>
        )}
      </Skeleton>
    </Card>
  );
}
