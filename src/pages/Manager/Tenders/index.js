import { Col, Row } from "antd";
import List from "common/display/List";
import FilledButton from "common/Form/Button";
import Layout from "common/Layout";
import React, { useEffect, useState } from "react";
import { TiPlus } from "react-icons/ti";
import { useLocation } from "react-router";

const Icon = () => <TiPlus style={{ marginRight: 4 }} />;

export default function Rules({ ...props }) {
  const { state } = useLocation();
  const [tenders, setTenders] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/tenders`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then((success) => {
        setTenders(success.tenders);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Layout
      headerLeftButton={{ content: "Mis proyectos", onClick: () => {} }}
      headerRightButton={{ content: "¿Cómo funciona?", onClick: () => {} }}
    >
      <Row>
        <Col xs={24}>
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

      <h1>Listado de llamados</h1>
      <List
        data={tenders.map((e) => ({
          name: e.name,
          to: `/manager/tenders/edit`,
          shine: !!state && parseInt(state.tenderId) === e.tender_id,
          state: {
            tenderId: e.tender_id,
          },
        }))}
      />
    </Layout>
  );
}
