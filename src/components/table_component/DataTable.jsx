import React from "react";
import { Table, Button } from "antd";
import moment from "moment";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const DataTable = ({ observations, dataStreamId }) => {
  const unitMap = {
    5: "lux",
    6: "%",
  };
  const unit = unitMap[dataStreamId] || "";

  // Define columns including STT
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, record, index) => index + 1,
    },
    {
      title: `Kết quả (${unit})`,
      dataIndex: "result",
      key: "result",
      render: (text) => text[0],
    },
    {
      title: "Thời gian kết quả",
      dataIndex: "resultTime",
      key: "resultTime",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Thời gian hợp lệ",
      dataIndex: "validTime",
      key: "validTime",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"),
    },
  ];

  const exportToExcel = () => {
    // Prepare data for export, including STT
    const dataForExport = observations.map((obs, index) => ({
      ...obs,
      stt: index + 1,
      result: obs.result[0], // Extract the first element of 'result'
      resultTime: moment(obs.resultTime).format("DD/MM/YYYY HH:mm:ss"),
      validTime: moment(obs.validTime).format("DD/MM/YYYY HH:mm:ss"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExport); // Convert mapped data to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Append the worksheet to the workbook
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    }); // Convert workbook to Excel file in array buffer format
    const fileName = `data_export_${moment().format("YYYY-MM-DD_HH-mm-ss")}.xlsx`; // Generate a unique file name
    saveAs(new Blob([excelBuffer]), fileName); // Save the Excel file
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={exportToExcel}
        style={{ marginBottom: 16 }}
      >
        Xuất Excel
      </Button>
      <Table
        dataSource={observations.map((obs, index) => ({
          ...obs,
          stt: index + 1,
        }))}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default DataTable;
