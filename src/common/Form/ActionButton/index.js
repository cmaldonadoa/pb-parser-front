import { Button } from "antd";
import React from "react";
import { MdClose, MdEdit } from "react-icons/md";

function MiniButton({ icon, onClick, color }) {
  return (
    <Button
      type={"primary"}
      icon={icon}
      onClick={onClick}
      size="small"
      style={{ background: color, borderColor: color }}
    />
  );
}

const DeleteAction = ({ onClick }) => (
  <MiniButton icon={<MdClose />} onClick={onClick} color={"#EC971F"} />
);
const EditAction = ({ onClick }) => (
  <MiniButton icon={<MdEdit />} onClick={onClick} color={"#5BC0DE"} />
);

export { DeleteAction, EditAction };
