import {
  CheckCircleFilled,
  CloseCircleFilled,
  DownOutlined,
  UpOutlined,
  MinusCircleFilled,
} from "@ant-design/icons";
import { Col, Divider, Row, Tree } from "antd";
import List from "common/display/List";
import Table from "common/display/Table";
import Window from "common/display/Window";
import { ErrorModal } from "common/display/Modal";
import Form from "common/Form";
import { DeleteAction } from "common/Form/ActionButton";
import FilledButton from "common/Form/Button";
import CheckboxInput from "common/Form/CheckboxInput";
import RadioInput from "common/Form/RadioInput";
import FormRow from "common/Form/Row";
import Steps from "common/Form/Steps";
import Layout from "common/Layout";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";

const colorSwitch = (b, v) => {
  if (!!b) {
    return "#4fd95f";
  }
  if (v.length === 0) {
    return "#D9534F";
  }
  return "var(--color-1)";
};

const iconSwitch = (b, v) => {
  if (!!b) {
    return (
      <CheckCircleFilled style={{ fontSize: 18, color: colorSwitch(b, v) }} />
    );
  }
  if (v.length === 0) {
    return (
      <CloseCircleFilled style={{ fontSize: 18, color: colorSwitch(b, v) }} />
    );
  }
  return (
    <MinusCircleFilled style={{ fontSize: 18, color: colorSwitch(b, v) }} />
  );
};

const UploadWindow = ({ onClick }) => {
  const hiddenFileInput = React.useRef(null);
  const [filename, setFilename] = useState("");
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = ({ fileType }) => {
    fileType !== undefined && setFileType(fileType);
  };

  return (
    <Window title={"Subir archivo"}>
      <Form values={{ fileType }} onChange={onChange}>
        <FormRow align="bottom">
          <RadioInput
            label="Tipo de modelo"
            name={"fileType"}
            options={[
              { label: "Arquitectura", value: "ARQUITECTURA" },
              { label: "Sitio", value: "SITIO" },
              { label: "Volumétrico", value: "VOLUMETRICO" },
            ]}
          />
        </FormRow>
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

const TenderWindow = ({ data, onChange }) => {
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

const ResultWindow = ({ groupName, data }) => {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);
  const [open, setOpen] = useState(true);
  let [passing, error, pending] = [0, 0, 0];

  useEffect(() => {
    setHeight(ref.current.clientHeight);
  }, []);

  Object.keys(data).forEach((k) => {
    const ruleResult = data[k];
    if (!!ruleResult.bit) passing += 1;
    else if (ruleResult.values.length === 0) error += 1;
    else pending += 1;
  });

  const ResultsList = ({ values, details }) => {
    function toCamelCase(name) {
      return name
        .split("_")
        .map((w) => w[0] + w.slice(1).toLowerCase())
        .join(" ");
    }

    const treeData =
      details !== false &&
      details.map((e, i) => ({
        title: (
          <React.Fragment key={i}>
            <div>{`Recinto: ${
              e.spaces.length > 0
                ? e.spaces[0][0] === "#"
                  ? toCamelCase(e.spaces[0].slice(1))
                  : toCamelCase(e.spaces[0])
                : "Todo el modelo"
            }`}</div>
            {e.meta.length === 0 && (
              <em style={{ opacity: 0.5, paddingLeft: 24 }}>
                No hay información para mostrar
              </em>
            )}
          </React.Fragment>
        ),
        key: `0-${i}`,
        icon: null,
        children: e.meta.map((m, j) => ({
          title: `${m.entity} (ID: ${m.id})`,
          key: `0-${i}-${j}`,
          icon: null,
          children: Object.keys(m.values).map((v, k) => ({
            title: `${v} = ${m.values[v]}`,
            key: `0-${i}-${j}-${k}`,
            icon: null,
          })),
        })),
      }));

    return (
      <>
        {Array.isArray(values) &&
          values.length > 0 &&
          (values.length > 1 ? (
            <>
              <p>Valores encontrados:</p>
              <ul style={{ marginTop: 12 }}>
                {values.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>Valor encontrado: {values[0]}</p>
          ))}

        {!!treeData && (
          <Tree
            selectable={false}
            showLine={{ showLeafIcon: false }}
            showIcon={false}
            treeData={treeData}
            switcherIcon={<DownOutlined />}
          />
        )}
      </>
    );
  };

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
                    cumplidas{" "}
                    <CheckCircleFilled
                      style={{ fontSize: 18, color: "#4fd95f" }}
                    />
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
                    falladas{" "}
                    <CloseCircleFilled
                      style={{ fontSize: 18, color: "#D9534F" }}
                    />
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
                    a verificar por revisor{" "}
                    <MinusCircleFilled
                      style={{ fontSize: 18, color: "var(--color-1)" }}
                    />
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
          {!open && <DownOutlined onClick={() => setOpen(true)} />}
          {open && <UpOutlined onClick={() => setOpen(false)} />}
        </Col>
      </Row>
      <div
        ref={ref}
        style={{
          transition: "max-height 0.4s ease",
          overflow: "hidden",
          maxHeight: height > 0 ? (open ? 999999 : 0) : "unset",
        }}
      >
        <Divider />
        <Row style={{ width: "100%" }}>
          <Col lg={24}>
            <List
              collapsable
              data={data.map((e) => ({
                name: e.name,
                endIcon: iconSwitch(e.bit, e.values),
                color: colorSwitch(e.bit, e.values),
                content: (
                  <>
                    <p>
                      <i>{e.description}</i>
                    </p>
                    <ResultsList values={e.values} details={e.details} />
                  </>
                ),
              }))}
            />
          </Col>
        </Row>
      </div>
    </Window>
  );
};

export default function ModelValidator({ ...props }) {
  const history = useHistory();

  const [currentStep, setCurrentStep] = useState(0);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);

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
      .then((res) => {
        if (res.status === 200) return res;
        else {
          callback();
          throw new Error();
        }
      })
      .then((res) => res.json())
      .then((res) => {
        setFileId(res.id);
        callback();
      })
      .catch((err) => setOpenErrorModal(true));
  };

  const downloadPdf = () => {
    fetch(`${process.env.REACT_APP_API}/results/${fileId}`, {
      method: "POST",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((res) => {
        if (res.status === 200) return res;
        else {
          throw new Error();
        }
      })
      .then((res) => res.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = files.find((e) => e.file_id === fileId).filename + ".pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => setOpenErrorModal(true));
  };

  const onClickParse = () => {
    setParsing(true);
    const body = new FormData();
    body.append("file_id", fileId);
    body.append("group_ids", groupIds);
    body.append("tender_id", tenderId);

    fetch(`${process.env.REACT_APP_API}/parse`, {
      method: "POST",
      body: body,
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((res) => {
        if (res.status === 200) return res;
        else throw new Error();
      })
      .then((response) => {
        setParsing(false);
        return response.json();
      })
      .then((success) =>
        fetch(`${process.env.REACT_APP_API}/check`, {
          method: "POST",
          body: body,
          headers: {
            Authorization: sessionStorage.getItem("auth"),
          },
        })
      )
      .then((res) => {
        if (res.status === 200) return res;
        else throw new Error();
      })
      .then((response) => {
        setValidating(false);
        return response.json();
      })
      .then((success) =>
        fetch(`${process.env.REACT_APP_API}/results/${fileId}`, {
          method: "GET",
          headers: {
            Authorization: sessionStorage.getItem("auth"),
          },
        })
      )
      .then((res) => {
        if (res.status === 200) return res.json();
        else throw new Error();
      })
      .then((success) => {
        setCurrentStep(3);
        setResults(success.results);
      })
      .catch((err) => setOpenErrorModal(true));
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
    else if (currentStep < 2) setNextDisabled(!tenderId);
    else if (currentStep < 3) setNextDisabled(groupIds.length === 0);
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
                      <DeleteAction
                        onClick={(cb) => deleteFile(e.file_id).finally(cb)}
                      />
                    </Col>
                  </Row>
                ),
              }))}
            />
          </>
        ) : currentStep === 1 ? (
          <TenderWindow data={{ tenderId }} onChange={(k) => setTenderId(k)} />
        ) : currentStep === 2 ? (
          <AnalyzeWindow
            data={{ groupIds }}
            onChange={({ groupIds }) => setGroupIds(groupIds)}
          />
        ) : (
          Object.keys(results).map((k) => (
            <ResultWindow key={k} data={results[k]} groupName={k} />
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
          <Row gutter={16}>
            <Col>
              {currentStep === 3 && (
                <FilledButton onClick={downloadPdf}>Descargar</FilledButton>
              )}
            </Col>
            <Col>
              <FilledButton
                disabled={nextDisabled}
                loading={parsing || validating}
                green
                onClick={() => {
                  setNextDisabled(true);
                  currentStep === 0 && setCurrentStep(1);
                  currentStep === 1 && setCurrentStep(2);
                  currentStep === 2 && onClickParse();
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
        </Col>
      </Row>

      <ErrorModal
        open={openErrorModal}
        title={"Se ha producido un error"}
        onClose={() => {
          setOpenErrorModal(false);
          setNextDisabled(false);
          setParsing(false);
          setValidating(false);
        }}
      />
    </Layout>
  );
}
