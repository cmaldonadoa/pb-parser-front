import { Col, Row, Tabs } from "antd";
import List from "common/display/List";
import { DeleteAction, EditAction } from "common/Form/ActionButton";
import FilledButton from "common/Form/Button";
import Layout from "common/Layout";
import React, { useEffect, useState } from "react";
import { TiPlus } from "react-icons/ti";
import { useLocation } from "react-router";

const { TabPane } = Tabs;

const Icon = () => <TiPlus style={{ marginRight: 4 }} />;

export default function Rules() {
  const { state } = useLocation();
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [rules, setRules] = useState([]);

  const deleteRule = (id) =>
    fetch(`${process.env.REACT_APP_API}/rules/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then((success) =>
        fetch(`${process.env.REACT_APP_API}/rules/${currentGroup}`, {
          method: "GET",
          headers: {
            Authorization: sessionStorage.getItem("auth"),
          },
        })
      )
      .then((response) => response.json())
      .then((success) => {
        setRules(success.rules);
      })
      .catch((error) => console.log(error));

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/groups`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then((success) => {
        const resposeGroups = success.groups.sort(
          (a, b) => a.group_id > b.group_id
        );
        setGroups(resposeGroups);
        setCurrentGroup(
          !!state ? state.groupId : "" + resposeGroups[0].group_id
        );
      })
      .catch((error) => console.log(error));
  }, [state]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/rules/${currentGroup}`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then((success) => {
        setRules(success.rules);
      })
      .catch((error) => console.log(error));
  }, [currentGroup]);

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

      <h1>Listado de reglas</h1>
      <Tabs
        defaultActiveKey={1}
        activeKey={"" + currentGroup}
        onChange={(k) => setCurrentGroup(k)}
      >
        {groups.map((e) => (
          <TabPane tab={e.name} key={"" + e.group_id} className="text-md">
            <List
              data={rules.map((e) => ({
                name: e.name,
                to: `/manager/rules/edit`,
                shine: !!state && parseInt(state.ruleId) === e.rule_id,
                state: {
                  ruleId: e.rule_id,
                  groupId: currentGroup,
                },
                actions: (
                  <Row gutter={16} style={{ zIndex: 10 }}>
                    <Col>
                      <DeleteAction
                        onClick={(event) => {
                          deleteRule(e.rule_id);
                          event.stopPropagation();
                        }}
                      />
                    </Col>
                    <Col>
                      <EditAction />
                    </Col>
                  </Row>
                ),
              }))}
            />
          </TabPane>
        ))}
      </Tabs>
    </Layout>
  );
}
