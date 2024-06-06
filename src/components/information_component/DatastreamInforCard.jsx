import { useAuth } from "@/context/AuthContext";
import { Card, Image, Skeleton, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DatastreamInforCard({ datastreamId }) {
  const [loading, setLoading] = useState(true);
  const [datastreamInfo, setDatastreamInfo] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { token } = useAuth();

  const TEXT_ROWS = 2;

  useEffect(() => {
    setLoading(true);

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
    const timeoutId = setTimeout(() => setLoading(false), 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [datastreamId]);

  return (
    <Card
      title={<h4 className="text-lg font-bold">Thông tin quan trắc</h4>}
      style={{ width: 650, backgroundColor: "#fffffe" }}
    >
      <Skeleton loading={loading} active>
        {datastreamInfo && (
          <div className="flex gap-3">
            <div className="flex items-center">
              <Image
                width={200}
                src="/images/icons/streaming.png"
                fallback="/images/no-image.png"
                preview={false}
              />
            </div>
            <div>
              <h6 className="text-sm font-semibold text-tertiary">
                Mã cảm biến:
              </h6>
              <p className="ml-4 text-sub-headline">{datastreamInfo?.id}</p>
              <h6 className="mt-3 text-sm font-semibold text-tertiary">
                Tên cảm biến:
              </h6>
              <p className="ml-4 text-sub-headline">{datastreamInfo?.name}</p>
              <h6 className="mt-3 text-sm font-semibold text-tertiary">
                Mô tả:
              </h6>
              <Typography.Paragraph
                ellipsis={{
                  rows: TEXT_ROWS,
                  expandable: "collapsible",
                  expanded,
                  onExpand: (_, info) => {
                    setExpanded(info.expanded);
                  },
                }}
              >
                {datastreamInfo?.description}
              </Typography.Paragraph>
            </div>
          </div>
        )}
      </Skeleton>
    </Card>
  );
}
