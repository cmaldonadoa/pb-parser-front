import { Col, Row } from "antd";
import List from "common/display/List";
import { DeleteAction, EditAction } from "common/Form/ActionButton";
import Layout from "common/Layout";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function Tenders({ ...props }) {
  const { state } = useLocation();
  const [tenders, setTenders] = useState([]);

  const deleteTender = (id) =>
    fetch(`${process.env.REACT_APP_API}/tenders/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then((success) =>
        fetch(`${process.env.REACT_APP_API}/tenders`, {
          method: "GET",
          headers: {
            Authorization: sessionStorage.getItem("auth"),
          },
        })
      )
      .then((response) => response.json())
      .then((success) => {
        setTenders(success.tenders);
      })
      .catch((error) => console.log(error));

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
      <h1>Listado de llamados</h1>
      <List
        data={tenders.map((e) => ({
          name: e.name,
          to: `/reviewer/tenders/view`,
          shine: !!state && parseInt(state.tenderId) === e.tender_id,
          state: {
            tenderId: e.tender_id,
          },
        }))}
      />
    </Layout>
  );
}
