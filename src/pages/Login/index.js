import { Col, Row } from "antd";
import Form from "common/Form";
import FilledButton from "common/Form/Button";
import TextInput from "common/Form/TextInput";
import Layout from "common/Layout";
import jwt_decode from "jwt-decode";
import React, { useCallback, useEffect, useState } from "react";
import {
  RiEyeFill,
  RiEyeOffFill,
  RiLock2Fill,
  RiUserFill,
} from "react-icons/ri";
import { useHistory } from "react-router";

const EyeIcon = ({ open, onClick }) => {
  const props = {
    onClick: onClick,
    style: {
      cursor: "pointer",
      color: "var(--detail)",
    },
  };
  return open ? <RiEyeFill {...props} /> : <RiEyeOffFill {...props} />;
};

export default function Login({ ...props }) {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordShown = () => setPasswordShown(!passwordShown);

  const redirect = useCallback(() => {
    try {
      const jwt = sessionStorage.getItem("auth");
      const decoded = jwt_decode(jwt);
      decoded.role === "ADMIN"
        ? history.push("/manager")
        : history.push("/reviewer");
    } catch {}
  }, [history]);

  const authenticate = () => {
    fetch(`${process.env.REACT_APP_API}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.text())
      .then((res) => sessionStorage.setItem("auth", res))
      .then((res) => history.go(0));
  };

  useEffect(() => {
    redirect();
  }, [redirect]);

  return (
    <Layout
      headerLeftButton={{ content: "¿Qué es PARPro?", onClick: () => {} }}
      headerRightButton={{ content: "¿Cómo funciona?", onClick: () => {} }}
    >
      <Row justify="center" style={{ height: "100%" }} align="middle">
        <Col lg={12}>
          <h1 className="text-center">Bienvenido a PARPro</h1>

          <hr />

          <p>
            Plataforma de verificación automática para modelos IFC, desarrollada
            para el Ministerio de Vivienda y Urbanismo
          </p>
          <p>
            El principal objetivo es optimizar los tiempos de revisión para el
            cumplimiento de los proyectos DS19
          </p>

          <Form
            values={(username, password)}
            onChange={({ username, password }) => {
              username !== undefined && setUsername(username);
              password !== undefined && setPassword(password);
            }}
            onSubmit={authenticate}
          >
            <TextInput
              name="username"
              label="Usuario"
              startIcon={
                <RiUserFill
                  style={{
                    color: "var(--color-1)",
                  }}
                />
              }
            />
            <TextInput
              name="password"
              label="Contraseña"
              startIcon={
                <RiLock2Fill
                  style={{
                    color: "var(--color-1)",
                  }}
                />
              }
              type={passwordShown ? "text" : "password"}
              endIcon={
                <EyeIcon open={!passwordShown} onClick={togglePasswordShown} />
              }
            />

            <Row justify="center" style={{ marginTop: 48 }}>
              <Col lg="auto">
                <FilledButton green onClick={authenticate}>
                  Ingresar
                </FilledButton>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Layout>
  );
}
