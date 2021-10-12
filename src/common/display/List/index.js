import { Button, Col, Row, Collapse } from "antd";
import React from "react";
import { useHistory } from "react-router";

const Item = ({ number, name, to, state, shine, endIcon }) => {
  const history = useHistory();

  const redirect = () => history.push(to, state);

  return (
    <Button
      style={{
        border: "1px solid var(--detail)",
        borderRadius: 5,
        padding: "7px 20px",
        width: "100%",
        cursor: "pointer",
        marginBottom: 12,
        background: shine && "var(--detail)",
      }}
      size="large"
      onClick={redirect}
    >
      <Row gutter={24} justify="space-between">
        <Col
          className="text-bold text-sm"
          style={{
            color: "var(--color-1)",
            textAlign: "right",
          }}
        >
          <div style={{ width: 24 }}>{number}</div>
        </Col>
        <Col flex="auto">
          <Row justify="space-between" className="text-sm">
            <Col>{name}</Col>
            <Col>{!!endIcon ? endIcon : "Ver detalle"}</Col>
          </Row>
        </Col>
      </Row>
    </Button>
  );
};

const CollapseItem = ({ number, name, color, endIcon, content }) => {
  const { Panel } = Collapse;

  return (
    <Collapse
      style={{
        border: `2px solid ${color}`,
        borderRadius: 5,
        width: "100%",
        cursor: "pointer",
        marginBottom: 12,
        background: "white",
        color: "var(--color-2-text)",
      }}
      expandIcon={({ isActive }) => null}
    >
      <Panel
        header={
          <Row gutter={24} justify="space-between">
            <Col
              className="text-bold text-sm"
              style={{
                color: "var(--color-1)",
                textAlign: "right",
              }}
            >
              <div style={{ width: 24 }}>{number}</div>
            </Col>
            <Col flex="auto">
              <Row justify="space-between" className="text-sm">
                <Col>{name}</Col>
                <Col>{!!endIcon ? endIcon : "Ver detalle"}</Col>
              </Row>
            </Col>
          </Row>
        }
        key="1"
        className="site-collapse-custom-panel"
      >
        <p>{content}</p>
      </Panel>
    </Collapse>
  );
};

export default function List({ data, collapsable }) {
  return (
    <div style={{ paddingLeft: 12, paddingRight: 12 }}>
      {data.length > 0 ? (
        data.map((d, i) =>
          collapsable ? (
            <CollapseItem
              key={i}
              number={i + 1}
              name={d.name}
              to={d.to}
              state={d.state}
              endIcon={d.endIcon}
              color={d.color}
              content={d.content}
            />
          ) : (
            <Item
              key={i}
              number={i + 1}
              name={d.name}
              to={d.to}
              state={d.state}
              endIcon={d.endIcon}
            />
          )
        )
      ) : (
        <p>No hay elementos para mostrar</p>
      )}
    </div>
  );
}
