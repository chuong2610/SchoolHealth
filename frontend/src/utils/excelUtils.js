import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const ExportToExcel = (
  dataArray,
  fileName = "results",
  sheetName = "Data"
) => {
  const worksheet = XLSX.utils.json_to_sheet(dataArray); // lay du lieu ra tao worksheet
  const workbook = {
    Sheets: { [sheetName]: worksheet },
    SheetNames: [sheetName],
  }; // tao workbook

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  }); // Dùng để chuyển workbook thành dữ liệu file

  // tao file
  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `${fileName}.xlsx`); // luu file dinh dang excel
};

export const ImportFromExcel = (file, callback) => {
  const reader = new FileReader();

  // xu li du lieu
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result); // doc mang nhi phan
    const workbook = XLSX.read(data, { type: "array" }); // doc workbook

    const sheetName = workbook.SheetNames[0]; // lay ra sheet dau tien trong workbbook
    const worksheet = workbook.Sheets[sheetName]; // lay noi dung sheet dau tien

    const jsonData = XLSX.utils.sheet_to_json(worksheet); // chuyen sang JSON

    callback(jsonData); // goi ham cb de xu ly du lieu
  };

  reader.readAsArrayBuffer(file); // doc file
};
