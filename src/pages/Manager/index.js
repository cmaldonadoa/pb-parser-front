import { Col, Row } from "antd";
import Card from "common/display/Card";
import FilledButton from "common/Form/Button";
import Layout from "common/Layout";
import React, { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { useHistory } from "react-router";

const Icon = () => <TiPlus style={{ marginRight: 4 }} />;

export default function Manager({ ...props }) {
  const history = useHistory();
  const [nTenders, setNTenders] = useState(0);
  const [nRules, setNRules] = useState(0);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/self_tenders`, {
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

    fetch(`${process.env.REACT_APP_API}/self_rules`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then((success) => !!success.rules && setNRules(success.rules.length))
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
              <FilledButton to={"/manager/tenders/new"}>
                <Icon /> Nuevo llamado
              </FilledButton>
            </Col>
            <Col lg="auto">
              <FilledButton green to={"/manager/rules/new"}>
                <Icon /> Nueva regla
              </FilledButton>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row justify="space-between" align="bottom" style={{ height: "50%" }}>
        <Col lg={10}>
          <Card
            title={nTenders + " Llamado(s) realizado(s)"}
            actionTitle={"Ver detalles"}
            action={() => history.push("/manager/tenders")}
          />
        </Col>
        <Col lg={10}>
          <Card
            green
            title={nRules + " Regla(s) creada(s)"}
            actionTitle={"Ver detalles"}
            action={() => history.push("/manager/rules")}
          />
        </Col>
      </Row>
    </Layout>
  );
}
