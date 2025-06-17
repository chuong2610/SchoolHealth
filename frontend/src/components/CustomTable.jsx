import React from "react";
import "./CustomTable.css";

const CustomTable = ({ columns, data }) => (
    <div className="custom-table-wrapper">
        <table className="custom-table">
            <thead>
                <tr>
                    {columns.map(col => (
                        <th key={col.key || col.dataIndex}>{col.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} style={{ textAlign: "center", color: "#aaa" }}>Không có dữ liệu</td>
                    </tr>
                ) : (
                    data.map((row, idx) => (
                        <tr key={row.key || idx}>
                            {columns.map(col => (
                                <td key={col.key || col.dataIndex}>
                                    {typeof col.render === "function"
                                        ? col.render(row[col.dataIndex], row)
                                        : row[col.dataIndex]}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);

export default CustomTable; 