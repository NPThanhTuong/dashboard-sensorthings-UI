import { useEffect, useState } from "react";
import { IoIosWater } from "react-icons/io";
import { FaTemperatureLow } from "react-icons/fa";

export default function DetailThingCard({ dataKey, dataValue, time }) {
    const [loading, setLoading] = useState(true);
    const [key, setKey] = useState();
    const [value, setValue] = useState();
    const [title, setTitle] = useState(null);
    const [IconComponent, setIconComponent] = useState(null);
    const [color, setColor] = useState(null);


    const test2 = {
        temp: {
            icon: 'IoIosWater',
            title: 'Temperature',
            color: 'green'
        },
        humi: {
            icon: 'FaTemperatureLow',
            title: 'Humidity',
            color: 'blue'
        }
    };

    const getKeyInfo = (key) => {
        const keyInfo = test2[key];
        return keyInfo ? keyInfo : null;
    };

    useEffect(() => {
        setKey(dataKey);
        setValue(dataValue);

        const keyInfo = getKeyInfo(dataKey);
        if (keyInfo) {
            setIconComponent(keyInfo.icon);
            setTitle(keyInfo.title);
            setColor(keyInfo.color);
        } else {
            setIconComponent(null);
            setTitle('Không có thông tin');
            setColor('white'); // default color if not found
        }
    }, [dataKey, dataValue]);

    useEffect(() => {
        setLoading(true);
        const timeoutId = setTimeout(() => setLoading(false), 1000);
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);
    return (
        <div className={`flex flex-col bg-white border-l-8 border-${color}-500 rounded-tr-lg rounded-br-lg md:w-auto`}>
            <div className="p-4 flex items-center w-80 justify-between">
                <div className={`rounded-full h-12 w-12 flex items-center justify-center bg-${color}-500`}>
                    <IoIosWater className="text-4xl md:text-6xl text-black" />
                </div>
                <p className="text-lg font-bold ml-4">{title}</p>
            </div>

            <div className="p-4 flex items-center justify-center">
                <p className={`text-4xl md:text-8xl font-semibold text-${color}-500`}>{value}</p>
            </div>
            <div className="p-4 text-center">
                <p>Thời gian cập nhật</p>
                <p className="text-lg">{time}</p>
            </div>
        </div>
    );
}
