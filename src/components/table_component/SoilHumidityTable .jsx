
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const LightTable = () => {
    const [data, setData] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchLight = async () => {
            try {
                if (!token) {
                    throw new Error("Token không tồn tại");
                }

                const response = await axios.get(
                    "/api/get/datastreams(5)/observations",
                    {
                        headers: {
                            token: token,
                        },
                    },
                );
                const newData = response.data;
                setData(prevData => [newData, ...prevData.slice(0, 2)]);
                console.log('loght test', response.data);
            } catch (error) {
                setLight("Lỗi lấy dữ liệu:", error);
            }
        };

        fetchLight();

        const interval = setInterval(() => {
            fetchLight();
        }, 3000); // Sau 3s sẽ fetch dữ liệu 1 lần

        return () => clearInterval(interval); // đảm bảo interval sẽ được dọn dẹp khi component unmount, ngăn ngừa việc gọi hàm fetch khi không cần thiết
    }, [token]);
    console.log('light table ', data);



    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('my sheet');

        worksheet.columns = [
            { header: 'STT', key: 'stt', width: 10 },
            { header: 'Giá trị', key: 'result', width: 20 },
            { header: 'Thời gian kết quả', key: 'resultTime', width: 30 },
            { header: 'Thời gian sử dụng', key: 'validTime', width: 30 },
        ];

        // Thêm dữ liệu từ mảng 'data' vào worksheet
        data.forEach((item, index) => {
            worksheet.addRow({
                stt: index + 1,
                result: item[0].result,
                resultTime: formatDate(item[0].resultTime),
                validTime: formatDate(item[0].validTime),
            });
        });


        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            row.eachCell(function (cell, colNumber) {
                cell.font = {
                    name: 'Arial',
                    family: 2,
                    bold: false,
                    size: 10,
                };
                cell.alignment = {
                    vertical: 'middle', horizontal: 'center'
                };
                row.getCell(colNumber).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                // }
            });
        });
        worksheet.getRow(1).font = { bold: true }; // Đặt hàng đầu tiên in đậm
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });


        saveAs(blob, 'download.xlsx');
        // workbook.xlsx.writeBuffer().then(data => {
        //     const blob = new Blob([data], {
        //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        //     })
        //     const url = window.URL.createObjectURL(blob)
        //     const anchor = document.createElement('a')
        //     anchor.href = url
        //     anchor.download = 'download.xlsx'
        //     anchor.click()
        //     window.URL.revokeObjectURL(url)
        // })
    };
    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        const formattedDate = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        return formattedDate;
    };



    return (
        <div className="flex-column w-full items-center border-4  px-4 py-3">


            {data.length > 0 ? (
                <>
                    <table id="dataTable" className="min-w-full divide-y divide-gray-200 border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Giá trị(%)</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Thời gian kết quả</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Thời gian sử dụng</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-no-wrap">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-no-wrap">{item[0].result}</td>
                                    <td className="px-6 py-4 whitespace-no-wrap">{formatDate(item[0].resultTime)}</td>
                                    <td className="px-6 py-4 whitespace-no-wrap">{formatDate(item[0].validTime)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={exportToExcel} className="mt-5 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Xuất file Excel</button>
                </>
            )
                : <span>Chưa có dữ liệu...</span>}


        </div>
    );
};

export default LightTable;
