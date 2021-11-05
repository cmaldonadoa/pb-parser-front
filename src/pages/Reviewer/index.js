import { Col, Row } from "antd";
import Card from "common/display/Card";
import FilledButton from "common/Form/Button";
import Layout from "common/Layout";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

export default function Reviewer({ ...props }) {
  const history = useHistory();
  const [nFiles, setNFiles] = useState(0);
  const [nTenders, setNTenders] = useState(0);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/self_files`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then((success) => !!success.files && setNFiles(success.files.length))
      .catch((error) => console.log(error));

    fetch(`${process.env.REACT_APP_API}/tenders`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then(
        (success) => !!success.tenders && setNTenders(success.tenders.length)
      )
      .catch((error) => console.log(error));
  }, []);

  return (
    <Layout
      headerLeftButton={{ content: "Mis proyectos", onClick: () => {} }}
      headerRightButton={{ content: "¿Cómo funciona?", onClick: () => {} }}
    >
      <Row style={{ height: "50%" }}>
        <Col xs={24}>
          <h1 className="text-center" style={{ marginBottom: 0 }}>
            Hola
          </h1>
          <h2 className="text-center">¿Qué quieres hacer?</h2>

          <Row justify="end" gutter={48} style={{ alignSelf: "bottom" }}>
            <Col lg="auto">
              <FilledButton to={"/reviewer/validate"}>
                Validar modelo
              </FilledButton>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row justify="space-between" align="bottom" style={{ height: "50%" }}>
        <Col lg={10}>
          <Card
            title={nTenders + " Llamado(s) disponible(s)"}
            actionTitle={"Ver detalles"}
            action={() => history.push("/reviewer/tenders")}
          />
        </Col>
        <Col lg={10}>
          <Card
            green
            title={nFiles + " Archivo(s) subido(s)"}
            actionTitle={"Ver detalles"}
            action={() => history.push("/reviewer/validate")}
          />
        </Col>
      </Row>
    </Layout>
  );
}
