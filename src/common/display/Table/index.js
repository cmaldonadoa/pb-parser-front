import { Table } from "antd";
import React from "react";

export default function SelectableTable({
  data,
  columns,
  selectedKey,
  onChange,
  label,
}) {
  return (
    <div style={{ paddingLeft: 12, paddingRight: 12 }}>
      <label className="text-sm" style={{ color: "var(--color-2-text)" }}>
        {label}
      </label>
      <Table
        size="middle"
        rowSelection={{
          type: "radio",
          onChange: onChange,
          selectedRowKeys: [selectedKey],
        }}
        columns={columns.map((e) => ({
          title: (
            <span
              className="text-bold text-sm"
              style={{ color: "var(--color-1)", background: "none" }}
            >
              {e.label}
            </span>
          ),
          dataIndex: e.value,
        }))}
        dataSource={data}
        pagination={{ position: ["none", "bottomLeft"], pageSize: 10 }}
      />
    </div>
  );
}
