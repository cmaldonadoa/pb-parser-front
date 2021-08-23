import React, { useState, useEffect } from "react";

import { List, Button, Typography } from "antd";

import RulesForm from "./RulesForm";

export default function RulesList({ ...props }) {
  const [data, setData] = useState([]);
  const [ruleData, setRuleData] = useState(null);
  const [ruleShown, setRuleShown] = useState(false);
  const [currentRule, setCurrentRule] = useState(-1);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/rules/1`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((success) => setData(success.rules))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    currentRule > 0 &&
      fetch(`${process.env.REACT_APP_API}/rules/1/${currentRule}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((success) => {
          setRuleData(success.rule);
          setRuleShown(true);
        })
        .catch((error) => console.log(error));
  }, [currentRule]);

  const hideRule = () => setRuleShown(false);

  const setRule = (i) => {
    setCurrentRule(i);
  };

  return ruleShown ? (
    <RulesForm actions id={currentRule} data={ruleData} onClick={hideRule} />
  ) : (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, idx) => (
        <>
          <List.Item
            actions={[
              <Button onClick={() => setRule(item.rule_id)} type="text">
                Ver
              </Button>,
            ]}
          >
            <Typography.Text>{item.name}</Typography.Text>
          </List.Item>
        </>
      )}
    />
  );
}
