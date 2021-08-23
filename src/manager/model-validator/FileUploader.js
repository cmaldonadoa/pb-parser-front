import React, { useState, useEffect } from "react";

import { Upload, Button, Timeline } from "antd";
import {
  UploadOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusSquareFilled,
  MinusSquareFilled,
} from "@ant-design/icons";

import "./index.scss";

const colorSwitch = (s) => {
  if ("boolean" === typeof s && s) {
    return "green";
  }
  if ("boolean" === typeof s && !s) {
    return "red";
  }
  return "blue";
};

const dotSwitch = (s, onClick, expanded) => {
  if ("boolean" === typeof s && s) {
    return <CheckOutlined style={{ fontSize: 16 }} />;
  }
  if ("boolean" === typeof s && !s) {
    return <CloseOutlined style={{ fontSize: 16 }} />;
  }

  if (expanded) {
    return <MinusSquareFilled onClick={onClick} style={{ fontSize: 18 }} />;
  }
  return <PlusSquareFilled onClick={onClick} style={{ fontSize: 18 }} />;
};

function Result(name, content) {
  if (!Array.isArray(content) || content.length == 0) return name;

  return (
    <>
      <p>{name}</p>
      <ul style={{ paddingLeft: "1.5em", listStyleType: "disc" }}>
        {content.map((e, i) => (
          <li key={i}>{e.guid}</li>
        ))}
      </ul>
    </>
  );
}

export default function FileUploader({ ...props }) {
  const [fileId, setFileId] = useState(null);
  const [parseShown, setParseShown] = useState(false);
  const [validateShown, setValidateShown] = useState(false);
  const [results, setResults] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [validating, setValidating] = useState(false);
  const [expanded, setExpanded] = useState([]);

  const onChange = (info) => {
    if (info.file.status === "done") {
      setFileId(info.file.response.id);
      setParseShown(true);
    } else if (info.file.status === "error") {
    }
  };

  const onDelete = () => {
    setParseShown(false);
    setFileId(null);
  };

  const onClickParse = () => {
    setResults(null);
    setParsing(true);
    const body = new FormData();
    body.append("file_id", fileId);
    body.append("group_id", 1);

    fetch(`${process.env.REACT_APP_API}/parse`, {
      method: "POST",
      body: body,
    })
      .then((response) => {
        setParsing(false);
        return response.json();
      })
      .then((success) => {
        setValidateShown(true);
      })
      .catch((error) => console.log(error));
  };

  const onClickValidate = () => {
    setResults(null);
    setValidating(true);
    const body = new FormData();
    body.append("file_id", fileId);
    body.append("group_id", 1);

    fetch(`${process.env.REACT_APP_API}/check`, {
      method: "POST",
      body: body,
    })
      .then((response) => {
        setValidating(false);
        return response.json();
      })
      .then((success) => {
        setResults(success.data);
        setExpanded(Object.keys(success.data).map((e) => false));
      })
      .catch((error) => console.log(error));
  };

  const toggleExpand = (i) => {
    expanded[i] = !expanded[i];
    setExpanded([...expanded]);
  };

  return (
    <>
      <Upload
        name="file"
        accept=".ifc"
        maxCount={1}
        action={`${process.env.REACT_APP_API}/upload`}
        onChange={onChange}
        onRemove={onDelete}
      >
        <Button icon={<UploadOutlined />}>Subir archivo</Button>
      </Upload>

      {parseShown && (
        <Button
          style={{ marginTop: 24, marginBottom: 24 }}
          type="primary"
          onClick={onClickParse}
          loading={parsing}
          disabled={parsing || validateShown}
        >
          {parsing ? "Analizando" : "Analizar"}
        </Button>
      )}

      {validateShown && (
        <Button
          style={{ marginTop: 24, marginBottom: 24, marginLeft: 24 }}
          type="primary"
          onClick={onClickValidate}
          loading={validating}
          disabled={validating}
        >
          {parsing ? "Validando" : "Validar"}
        </Button>
      )}

      {results && (
        <Timeline>
          {Object.keys(results).map((k, i) => (
            <Timeline.Item
              key={i}
              className="FileUploader-Fade"
              style={{ animationDelay: `${200 * i}ms` }}
              dot={dotSwitch(results[k], () => toggleExpand(i), expanded[i])}
              color={colorSwitch(results[k])}
            >
              {expanded[i] ? Result(k, results[k]) : Result(k)}
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </>
  );
}
