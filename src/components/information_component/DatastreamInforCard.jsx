import { useAuth } from "@/context/AuthContext";
import { Card, Image, Skeleton, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DatastreamInforCard({ data }) {
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const TEXT_ROWS = 2;

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Card
      title={<h4 className="text-lg font-bold">Thông tin quan trắc</h4>}
      style={{ width: 650, backgroundColor: "#fffffe" }}
    >
      <Skeleton loading={loading} active>
        {data && (
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
                Mã luồng quan trắc:
              </h6>
              <p className="ml-4 text-sub-headline">{data?.id}</p>
              <h6 className="mt-3 text-sm font-semibold text-tertiary">
                Tên luồng quan trắc:
              </h6>
              <p className="ml-4 text-sub-headline">{data?.name}</p>
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
                {data?.description}
              </Typography.Paragraph>
            </div>
          </div>
        )}
      </Skeleton>
    </Card>
  );
}
