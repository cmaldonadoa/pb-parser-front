import {
  CheckCircleFilled,
  CloseCircleFilled,
  DownOutlined,
  MinusCircleFilled,
} from "@ant-design/icons";
import { Col, Divider, Row } from "antd";
import List from "common/display/List";
import Table from "common/display/Table";
import Window from "common/display/Window";
import Form from "common/Form";
import { DeleteAction } from "common/Form/ActionButton";
import FilledButton from "common/Form/Button";
import CheckboxInput from "common/Form/CheckboxInput";
import RadioInput from "common/Form/RadioInput";
import FormRow from "common/Form/Row";
import Steps from "common/Form/Steps";
import Layout from "common/Layout";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

const colorSwitch = (s) => {
  if ("boolean" === typeof s && s) {
    return "#26A79A";
  }
  if ("boolean" === typeof s && !s) {
    return "#D9534F";
  }
  return "var(--color-1)";
};

const iconSwitch = (s) => {
  if ("boolean" === typeof s && s) {
    return (
      <CheckCircleFilled style={{ fontSize: 16, color: colorSwitch(s) }} />
    );
  }
  if ("boolean" === typeof s && !s) {
    return (
      <CloseCircleFilled style={{ fontSize: 16, color: colorSwitch(s) }} />
    );
  }
  return <MinusCircleFilled style={{ fontSize: 18, color: colorSwitch(s) }} />;
};

const UploadWindow = ({ onClick }) => {
  const hiddenFileInput = React.useRef(null);
  const [filename, setFilename] = useState("");
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Window title={"Subir archivo"}>
      <Form
        values={{ fileType }}
        onChange={({ fileType }) => setFileType(fileType)}
      >
        <RadioInput
          label="Tipo de modelo"
          name={"fileType"}
          options={[
            { label: "Arquitectura", value: "ARQUITECTURA" },
            { label: "Sitio", value: "SITIO" },
            { label: "Volumétrico", value: "VOLUMETRICO" },
          ]}
        />
        <FormRow align="bottom">
          <FilledButton
            loading={loading}
            disabled={!fileType || loading}
            label="Selecciona el modelo"
            name={"file"}
            outline
            onClick={() => hiddenFileInput.current.click()}
          >
            Subir archivo
          </FilledButton>
          <p style={{ marginBottom: 8 }}>{filename}</p>
        </FormRow>
      </Form>
      <input
        type="file"
        hidden
        ref={hiddenFileInput}
        accept=".ifc, .ifczip"
        onChange={(e) => {
          const fileUploaded = e.target.files[0];
          onClick(fileUploaded, fileType, () => {
            setLoading(false);
            setFilename("");
            setFileType(null);
          });
          setFilename(fileUploaded.name);
          setLoading(true);
        }}
      />
    </Window>
  );
};

const AnalyzeWindow = ({ data, onChange }) => {
  const { groupIds } = data;
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/groups`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then((success) =>
        setGroups(success.groups.sort((a, b) => a.group_id > b.group_id))
      )
      .catch((error) => console.log(error));
  }, []);

  return (
    <Window title={"Analizar"}>
      <Form values={{ groupIds }} onChange={onChange}>
        <CheckboxInput
          name="groupIds"
          label="Selecciona los grupos de reglas contra los cuales se validará el modelo"
          options={groups.map((e) => ({ label: e.name, value: e.group_id }))}
        />
      </Form>
    </Window>
  );
};

const ValidateWindow = ({ data, onChange }) => {
  const { tenderId } = data;
  const [tenders, setTenders] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/tenders`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then((success) =>
        setTenders(success.tenders.sort((a, b) => a.tender_id > b.tender_id))
      )
      .catch((error) => console.log(error));
  }, []);

  return (
    <Window title={"Validar"}>
      <Table
        columns={[{ label: "Nombre", value: "name" }]}
        selectedKey={tenderId}
        onChange={(keys, _) => onChange(keys[0])}
        data={tenders.map((e) => ({
          key: e.tender_id,
          name: e.name,
        }))}
        label="Selecciona el llamado contra el cuál se validará el modelo"
      />
    </Window>
  );
};

const ResultWindow = ({ groupId, data }) => {
  const [groupName, setGroupName] = useState("");
  let [passing, error, pending] = [0, 0, 0];

  Object.keys(data).forEach((k) => {
    const ruleResult = data[k];
    if (ruleResult.result === true) passing += 1;
    else if (ruleResult.result === false) error += 1;
    else pending += 1;
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/groups`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then((success) => {
        setGroupName(
          success.groups.find((e) => e.group_id === parseInt(groupId)).name
        );
      })
      .catch((error) => console.log(error));
  }, [setGroupName, groupId]);

  return (
    <Window title={groupName}>
      <Row gutter={24} justify="space=between">
        <Col>
          <Row gutter={72} justify="space_between">
            <Col>
              <Row gutter={8} align="middle">
                <Col>
                  <span
                    className="text-lg text-bold"
                    style={{ color: "var(--color-1)" }}
                  >
                    {passing}
                  </span>
                </Col>
                <Col>
                  <span
                    className="text-md text-bold"
                    style={{ color: "var(--color-1-text)" }}
                  >
                    cumplidas
                  </span>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={8} align="middle">
                <Col>
                  <span
                    className="text-lg text-bold"
                    style={{ color: "var(--color-1)" }}
                  >
                    {error}
                  </span>
                </Col>
                <Col>
                  <span
                    className="text-md text-bold"
                    style={{ color: "var(--color-1-text)" }}
                  >
                    falladas
                  </span>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={8} align="middle">
                <Col>
                  <span
                    className="text-lg text-bold"
                    style={{ color: "var(--color-1)" }}
                  >
                    {pending}
                  </span>
                </Col>
                <Col>
                  <span
                    className="text-md text-bold"
                    style={{ color: "var(--color-1-text)" }}
                  >
                    pendientes de revision
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col
          flex="auto"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            cursor: "pointer",
          }}
        >
          <DownOutlined />
        </Col>
      </Row>
      <Divider />
      <Row style={{ width: "100%" }}>
        <Col lg={24}>
          <List
            collapsable
            data={Object.keys(data).map((e) => ({
              name: data[e].name,
              endIcon: iconSwitch(data[e].result),
              color: colorSwitch(data[e].result),
              content: <em>{data[e].description}</em>,
            }))}
          />
        </Col>
      </Row>
    </Window>
  );
};

export default function ModelValidator({ ...props }) {
  const history = useHistory();

  const [currentStep, setCurrentStep] = useState(0);
  const [nextDisabled, setNextDisabled] = useState(false);

  const [files, setFiles] = useState([]);

  const [fileId, setFileId] = useState(0);
  const [groupIds, setGroupIds] = useState([]);
  const [tenderId, setTenderId] = useState(0);

  const [parsing, setParsing] = useState(false);
  const [validating, setValidating] = useState(false);

  const [results, setResults] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/files`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then((success) =>
        setFiles(success.files.sort((a, b) => a.upload_date < b.upload_date))
      )
      .catch((error) => console.log(error));
  }, [fileId]);

  const uploadFile = (file, fileType, callback) => {
    const body = new FormData();
    body.append("file", file);
    body.append("type", fileType);

    fetch(`${process.env.REACT_APP_API}/upload`, {
      method: "POST",
      body: body,
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setFileId(res.id);
        callback();
      });
  };

  const onClickParse = () => {
    setParsing(true);
    const body = new FormData();
    body.append("file_id", fileId);
    body.append("group_ids", groupIds);

    fetch(`${process.env.REACT_APP_API}/parse`, {
      method: "POST",
      body: body,
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => {
        setParsing(false);
        return response.json();
      })
      .then((success) => setCurrentStep(2))
      .catch((error) => console.log(error));
  };

  const onClickValidate = () => {
    setValidating(true);
    const body = new FormData();
    body.append("file_id", fileId);
    body.append("group_ids", groupIds);
    body.append("tender_id", tenderId);

    fetch(`${process.env.REACT_APP_API}/check`, {
      method: "POST",
      body: body,
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => {
        setValidating(false);
        return response.json();
      })
      .then((success) => {
        setCurrentStep(3);
        setResults(success.data);
      })
      .catch((error) => console.log(error));
  };

  const deleteFile = (id) =>
    fetch(`${process.env.REACT_APP_API}/files/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((success) =>
        fetch(`${process.env.REACT_APP_API}/files`, {
          method: "GET",
          headers: {
            Authorization: sessionStorage.getItem("auth"),
          },
        })
      )
      .then((response) => response.json())
      .then((success) =>
        setFiles(success.files.sort((a, b) => a.upload_date < b.upload_date))
      )
      .catch((error) => console.log(error));

  useEffect(() => {
    if (currentStep < 1) setNextDisabled(!fileId);
    else if (currentStep < 2) setNextDisabled(groupIds.length === 0);
    else if (currentStep < 3) setNextDisabled(!tenderId);
    else setNextDisabled(false);
  }, [setNextDisabled, fileId, currentStep, groupIds, tenderId]);

  return (
    <Layout
      headerLeftButton={{ content: "Mis proyectos", onClick: () => {} }}
      headerRightButton={{ content: "¿Cómo funciona?", onClick: () => {} }}
    >
      <Row>
        <Col xs={24}>
          <h1>Validación de modelos</h1>
        </Col>

        <Steps
          currentStep={currentStep}
          steps={["Seleccionar archivo", "Analizar", "Validar", "Resultados"]}
        />
      </Row>

      <div style={{ marginTop: 64 }}>
        {currentStep === 0 ? (
          <>
            <UploadWindow onClick={uploadFile} />

            <Table
              columns={[
                { label: "Nombre", value: "name" },
                { label: "Fecha", value: "date" },
                { label: "Tipo", value: "type" },
                { label: "Acciones", value: "actions" },
              ]}
              selectedKey={fileId}
              onChange={(keys, _) => setFileId(keys[0])}
              data={files.map((e) => ({
                key: e.file_id,
                name: e.filename,
                date: moment(e.upload_date).format("YYYY-MM-DD H:mm"),
                type: e.typename,
                actions: (
                  <Row gutter={12}>
                    <Col>
                      <DeleteAction onClick={() => deleteFile(e.file_id)} />
                    </Col>
                  </Row>
                ),
              }))}
            />
          </>
        ) : currentStep === 1 ? (
          <AnalyzeWindow
            data={{ groupIds }}
            onChange={({ groupIds }) => setGroupIds(groupIds)}
          />
        ) : currentStep === 2 ? (
          <ValidateWindow
            data={{ tenderId }}
            onChange={(k) => setTenderId(k)}
          />
        ) : (
          Object.keys(results).map((k) => (
            <ResultWindow data={results[k]} groupId={k} />
          ))
        )}
      </div>

      <Row
        justify={currentStep > 0 ? "space-between" : "end"}
        align="bottom"
        style={{ marginTop: 24, display: currentStep < 0 && "none" }}
      >
        <Col style={currentStep === 0 ? { display: "none" } : {}}>
          <FilledButton
            disabled={parsing || validating}
            green
            outline
            onClick={() => {
              setCurrentStep(currentStep - 1);
            }}
          >
            Anterior
          </FilledButton>
        </Col>
        <Col>
          <FilledButton
            disabled={nextDisabled}
            loading={parsing || validating}
            green
            onClick={() => {
              setNextDisabled(true);
              currentStep === 0 && setCurrentStep(1);
              currentStep === 1 && onClickParse();
              currentStep === 2 && onClickValidate();
              currentStep === 3 && history.push("/");
            }}
          >
            {currentStep < 2
              ? "Siguiente"
              : currentStep < 3
              ? "Validar"
              : "Finalizar"}
          </FilledButton>
        </Col>
      </Row>
    </Layout>
  );
}
