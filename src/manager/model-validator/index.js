import React, { useState, useEffect } from "react";

import { Layout, Row, Col } from "antd";

import HeaderMenu from "../../common/HeaderMenu";
import FileUploader from "./FileUploader";

const { Header, Content, Footer } = Layout;

export default function ModelValidator({ ...props }) {
  return (
    <Layout>
      <Header style={{ position: "fixed", width: "100%", zIndex: 2 }}>
        <HeaderMenu />
      </Header>
      <Content
        style={{ minHeight: "100vh", paddingTop: 64 + 24, background: "#fff" }}
      >
        <Row justify="center">
          <Col xl={20} xxl={16} xs={22}>
            <FileUploader />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
