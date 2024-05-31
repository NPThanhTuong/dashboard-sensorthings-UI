import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const SoilHumidityTable = () => {
  const [data, setData] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchLight = async () => {
      try {
        if (!token) {
          throw new Error("Token không tồn tại");
        }

        const response = await axios.get(
          "/api/get/datastreams(5)/observations?top=all",
          {
            headers: {
              token: token,
            },
          },
        );
        const dataResonse = response.data;
        dataResonse.sort(function (a, b) {
          return new Date(b.resultTime) - new Date(a.resultTime);
        });

        setData(dataResonse);
      } catch (error) {
        setLight("Lỗi lấy dữ liệu:", error);
      }
    };

    fetchLight();

    const interval = setInterval(
      () => {
        fetchLight();
      },
      15 * 60 * 1000,
    ); // Sau 15p sẽ fetch dữ liệu 1 lần

    return () => clearInterval(interval); // đảm bảo interval sẽ được dọn dẹp khi component unmount, ngăn ngừa việc gọi hàm fetch khi không cần thiết
  }, [token]);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("my sheet");

    worksheet.columns = [
      { header: "STT", key: "stt", width: 10 },
      { header: "Giá trị", key: "result", width: 20 },
      { header: "Thời gian kết quả", key: "resultTime", width: 30 },
      { header: "Thời gian sử dụng", key: "validTime", width: 30 },
    ];

    // Thêm dữ liệu từ mảng 'data' vào worksheet
    data.forEach((item, index) => {
      worksheet.addRow({
        stt: index + 1,
        result: item.result,
        resultTime: formatDate(item.resultTime),
        validTime: formatDate(item.validTime),
      });
    });

    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      row.eachCell(function (cell, colNumber) {
        cell.font = {
          name: "Arial",
          family: 2,
          bold: false,
          size: 10,
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        row.getCell(colNumber).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        // }
      });
    });
    worksheet.getRow(1).font = { bold: true }; // Đặt hàng đầu tiên in đậm
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "do-am-dat.xlsx");
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
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDate = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${formattedDay}-${formattedMonth}-${date.getFullYear()}`;
    return formattedDate;
  };

  return (
    <div className="flex-column w-full items-center border-4  px-4 py-3">
      {data.length > 0 ? (
        <>
          <table
            id="dataTable"
            className="min-w-full divide-y divide-gray-200 border border-gray-300"
          >
            <thead>
              <tr>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500">
                  STT
                </th>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500">
                  Giá trị(%)
                </th>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500">
                  Thời gian kết quả
                </th>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500">
                  Thời gian sử dụng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="whitespace-no-wrap px-6 py-4">{index + 1}</td>
                  <td className="whitespace-no-wrap px-6 py-4">
                    {item.result}
                  </td>
                  <td className="whitespace-no-wrap px-6 py-4">
                    {formatDate(item.resultTime)}
                  </td>
                  <td className="whitespace-no-wrap px-6 py-4">
                    {formatDate(item.validTime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={exportToExcel}
            className="mt-5 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Xuất file Excel
          </button>
        </>
      ) : (
        <span>Không có dữ liệu...</span>
      )}
    </div>
  );
};

export default SoilHumidityTable;
