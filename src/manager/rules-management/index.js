import React, { useState, useEffect } from "react";

import { Layout, Row, Col } from "antd";

import HeaderMenu from "../../common/HeaderMenu";
import RulesList from "./RulesList";
import RulesForm from "./RulesForm";

const { Header, Content, Footer } = Layout;

export default function RulesManager({ ...props }) {
  const [formShown, setFormShown] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    setContent(formShown ? <RulesForm onClick={hideForm} /> : <RulesList />);
  }, [formShown, setContent]);

  const showForm = () => setFormShown(true);
  const hideForm = () => setFormShown(false);

  return (
    <Layout>
      <Header style={{ position: "fixed", width: "100%", zIndex: 2 }}>
        <HeaderMenu onClick={showForm} />
      </Header>
      <Content
        style={{ minHeight: "100vh", paddingTop: 64 + 24, background: "#fff" }}
      >
        <Row justify="center">
          <Col xl={20} xxl={16} xs={22}>
            {content}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
