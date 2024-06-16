import { Card, Image, Skeleton, Typography } from "antd";
import { useEffect, useState } from "react";
import images from "../../../public/images";
import AddTask from "@/components/home_component/task_component/AddTask";

export default function DetailThingCard({ type, data }) {
    const imagePath = images[type];
    const [dataState, setDataState] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setDataState(data);
    }, [data]);

    useEffect(() => {
        setLoading(true);
        const timeoutId = setTimeout(() => setLoading(false), 1000);
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <Card
            title={
                <div>
                    <h4 className="text-lg font-bold items-center">{type}</h4>
                    {/* <AddTask actuator={dataState} /> */}
                </div>
            }
            className="w-full h-full p-4 md:p-6 flex flex-col justify-between"
            style={{ backgroundColor: "#fffffe" }}
        >
            <Skeleton loading={loading} active>
                {data && (
                    <div className="flex items-center justify-center md:flex-row">
                        <div className="flex items-center md:mr-4 mb-4 md:mb-0">
                            <div className="relative w-32 h-32 md:w-48 md:h-48">
                                <Image
                                    src={imagePath}
                                    alt="Sensor Image"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            {type === 'Light' ? (
                                <>
                                    <div className="text-4xl md:text-8xl font-semibold">
                                        {data?.result && (
                                            <p>{data?.result[0]?.temp}</p>
                                        )}
                                    </div>
                                    <p className="text-lg md:text-xl">Lux</p>
                                </>
                            ) : (
                                <>
                                    <div className="text-4xl md:text-8xl font-semibold">
                                        {data?.result && (
                                            <p>{data?.result[0]?.humi}</p>
                                        )}
                                    </div>
                                    <p className="text-lg md:text-xl">%</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </Skeleton>
        </Card>
    );
}
