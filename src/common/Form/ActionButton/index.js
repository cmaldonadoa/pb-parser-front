import React, { useState } from "react";
import { MdClose, MdEdit } from "react-icons/md";

function MiniButton({ icon, onClick, color }) {
  const [disabled, setDisabled] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!disabled) {
      setDisabled(true);
      onClick(() => setDisabled(false));
    }
  };

  return (
    <div
      onClick={handleClick}
      size="small"
      style={{
        color: "white",
        background: color,
        borderColor: color,
        cursor: "pointer",
        width: 24,
        height: 24,
        fontSize: 18,
        textAlign: "center",
      }}
    >
      {icon}
    </div>
  );
}

const DeleteAction = ({ onClick }) => (
  <MiniButton icon={<MdClose />} onClick={onClick} color={"#EC971F"} />
);
const EditAction = ({ onClick }) => (
  <MiniButton icon={<MdEdit />} onClick={onClick} color={"#5BC0DE"} />
);

export { DeleteAction, EditAction };
