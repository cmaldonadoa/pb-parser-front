import React, { useState, Fragment, useEffect } from "react";

import { Button, Divider, Form, Input, Radio, Select, Col, Row } from "antd";
import {
  ArrowLeftOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { addStyles, StaticMathField } from "react-mathquill";

import "./index.scss";

addStyles();
const { Option } = Select;

function BasicInfo({ data, disabled, onChange }) {
  const [form] = Form.useForm();
  const [name, setName] = useState(!!data ? data.name : "");

  const onFormChange = ({ name }) => {
    onChange(name, null);
    setName(name);
  };

  const defaultData = [{ name: "name", value: name }];

  return (
    <>
      <Form
        className="RulesForm-PropertyForm"
        form={form}
        onValuesChange={onFormChange}
        fields={defaultData}
      >
        <Form.Item label="Nombre" name="name">
          <Input
            disabled={disabled}
            placeholder="Ej: Estructura y denominación"
            value={name}
          />
        </Form.Item>
      </Form>

      <Formula
        onChange={onChange}
        value={!!data ? data.formula : ""}
        disabled={disabled}
      />
    </>
  );
}

function Formula({ value, disabled, onChange }) {
  const [form] = Form.useForm();
  const [formula, setFormula] = useState(value || "");
  const [latex, setLatex] = useState("");

  useEffect(() => updateLatex(), []);

  const onFormChange = ({ formula }) => {
    onChange(null, formula);
    setFormula(formula);
  };

  const updateLatex = () => {
    const body = new FormData();
    body.append("formula", formula);

    fetch(`${process.env.REACT_APP_API}/parse_formula/`, {
      method: "POST",
      body: body,
    })
      .then((response) => response.json())
      .then((success) => setLatex(success.latex))
      .catch((error) => console.log(error));
  };

  const defaultData = [{ name: "formula", value: formula }];

  return (
    <div>
      <Form
        className="RulesForm-PropertyForm"
        form={form}
        onValuesChange={onFormChange}
        fields={defaultData}
      >
        <Row gutter={16}>
          <Col flex="auto">
            <Form.Item label="Fórmula" name="formula">
              <Input
                disabled={disabled}
                placeholder="Ej: p0 and p1"
                value={formula}
              />
            </Form.Item>
          </Col>
          <Col>
            <Button disabled={disabled} onClick={updateLatex}>
              Actualizar
            </Button>
          </Col>
        </Row>
      </Form>

      <div
        style={{
          display: !!latex ? "flex" : "none",
          justifyContent: "center",
        }}
      >
        <StaticMathField style={{ fontSize: 25, pointerEvents: "none" }}>
          {latex}
        </StaticMathField>
      </div>
    </div>
  );
}

function ConstraintForm({
  data,
  showActions,
  onDelete,
  shifted,
  disabled,
  onChange,
}) {
  const [form] = Form.useForm();

  const [type, setType] = useState("");
  const [pset, setPset] = useState("");
  const [on, setOn] = useState("");
  const [attribute, setAttribute] = useState("");
  const [operation, setOperation] = useState("");
  const [values, setValues] = useState([]);

  useEffect(() => {
    if (!data) return;

    setType(data.type);
    setPset(data.pset);
    setOn(data.on);
    setAttribute(data.attribute);
    setOperation(data.operation);
    setValues(data.values);
  }, [data]);

  const defaultData = [
    { name: "on", value: on },
    { name: "type", value: type },
    { name: "pset", value: pset },
    { name: "attribute", value: attribute },
    { name: "operation", value: operation },
    { name: "values", value: values },
  ];

  const onFormChange = ({ type, pset, on, attribute, operation, values }) => {
    onChange(
      type,
      pset,
      on,
      attribute,
      operation,
      !!values ? values.split(",") : values
    );
  };

  return (
    <div className="RulesForm-FormDeleteable">
      {(showActions || shifted) && (
        <div className="RulesForm-FormDeleteabe-Actions">
          <Button
            danger
            shape="circle"
            icon={<CloseOutlined />}
            size="Large"
            style={{ opacity: shifted && 0 }}
            onClick={!shifted && onDelete}
          />
        </div>
      )}

      <Form
        className="RulesForm-PropertyForm"
        form={form}
        onValuesChange={onFormChange}
        fields={defaultData}
      >
        <Form.Item label="Sobre" name="on">
          <Radio.Group value={on}>
            <Radio.Button disabled={disabled} value="ENTITY">
              Entidad
            </Radio.Button>
            <Radio.Button disabled={disabled} value="TYPE">
              Tipo
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Tipo" name="type">
          <Radio.Group value={type}>
            <Radio.Button disabled={disabled} value="pset">
              PropertySet
            </Radio.Button>
            <Radio.Button disabled={disabled} value="attribute">
              Atributo
            </Radio.Button>
            <Radio.Button disabled={disabled} value="location">
              Ubicación
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        {type === "pset" ? (
          <>
            <Form.Item label="Nombre del Pset" name="pset">
              <Input
                disabled={disabled}
                placeholder="Ej: Pset_\w+Common"
                value={pset}
              />
            </Form.Item>
            <Form.Item label="Nombre de la propiedad" name="attribute">
              <Input
                disabled={disabled}
                placeholder="Ej: IsExternal"
                value={attribute}
              />
            </Form.Item>
          </>
        ) : type === "attribute" ? (
          <Form.Item label="Nombre de la atributo" name="attribute">
            <Input
              disabled={disabled}
              placeholder="Ej: GlobalId"
              value={attribute}
            />
          </Form.Item>
        ) : type === "location" ? (
          <>
            <Form.Item label="Coordenada" name="attribute">
              <Radio.Group value={attribute}>
                <Radio.Button disabled={disabled} value="x">
                  {"X"}
                </Radio.Button>
                <Radio.Button disabled={disabled} value="y">
                  {"Y"}
                </Radio.Button>
                <Radio.Button disabled={disabled} value="z">
                  {"Z"}
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </>
        ) : null}
        <Form.Item label="Operación" name="operation">
          <Radio.Group value={operation}>
            <Radio.Button disabled={disabled} value="EQUAL">
              {"="}
            </Radio.Button>
            <Radio.Button disabled={disabled} value="NOT_EQUAL">
              {"≠"}
            </Radio.Button>
            <Radio.Button disabled={disabled} value="GREATER">
              {">"}
            </Radio.Button>
            <Radio.Button disabled={disabled} value="LESSER">
              {"<"}
            </Radio.Button>
            <Radio.Button disabled={disabled} value="GREATER_EQUAL">
              {"≥"}
            </Radio.Button>
            <Radio.Button disabled={disabled} value="LESSER_EQUAL">
              {"≤"}
            </Radio.Button>
            <Radio.Button disabled={disabled} value="EXISTS">
              {"∃"}
            </Radio.Button>
            <Radio.Button disabled={disabled} value="NOT_EXISTS">
              {"∄"}
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        {operation !== "EXISTS" && operation !== "NOT_EXISTS" && (
          <Form.Item label="Valor esperado" name="values">
            <Input disabled={disabled} placeholder="Ej: True" value={values} />
          </Form.Item>
        )}
      </Form>
    </div>
  );
}

function FilterForm({ data, showActions, onDelete, disabled, onChange }) {
  const [form] = Form.useForm();
  const [constraintsDeleteable, setConstraintsDeleteable] = useState(false);
  const [constraintsData, setConstraintData] = useState([
    {
      type: null,
      pset: null,
      on: null,
      attribute: null,
      operation: null,
      values: [],
      index: 0,
    },
  ]);

  const [scope, setScope] = useState("");
  const [space, setSpace] = useState("");
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    if (!data) return;

    setScope(data.scope);
    setSpace(data.space);
    setEntities(data.entities);
    setConstraintData(
      data.constraints
        .sort((a, b) => a.index > b.index)
        .map((c) => ({
          id: c.id,
          type: c.type,
          pset: c.pset,
          on: c.on,
          attribute: c.attribute,
          operation: c.operation,
          values: c.values,
          index: c.index,
        }))
    );
  }, [data]);

  const defaultData = [
    { name: "scope", value: scope },
    { name: "space", value: space },
    { name: "entities", value: entities },
  ];

  const togglePropsDeleteable = () => {
    setConstraintsDeleteable(!constraintsDeleteable);
  };

  const onFormChange = ({ scope, space, entities }) => {
    onChange(scope, space, !!entities ? entities.split(",") : entities);
  };

  const onClickAdd = () =>
    setConstraintData((prevState) => {
      prevState = [
        ...prevState,
        {
          index: prevState.length,
          operation: null,
          on: null,
          attribute: null,
          pset: null,
          values: [],
        },
      ];
      prevState = prevState.sort((a, b) => a.index > b.index);
      return prevState;
    });

  const deleteConstraint = (index) => {
    setConstraintData((prevState) => {
      delete prevState[index];
      prevState = prevState.filter((c) => !!c);
      prevState = prevState.sort((a, b) => a.index > b.index);
      return prevState;
    });
  };

  return (
    <>
      <div className="RulesForm-FormDeleteable">
        {showActions && (
          <div className="RulesForm-FormDeleteabe-Actions">
            <Button
              danger
              shape="circle"
              icon={<CloseOutlined />}
              size="Large"
              onClick={onDelete}
            />
          </div>
        )}

        <Form form={form} onValuesChange={onFormChange} fields={defaultData}>
          <Form.Item label="Buscar en" name="scope">
            <Radio.Group value={scope}>
              <Radio.Button disabled={disabled} value="global">
                Todo el modelo
              </Radio.Button>
              <Radio.Button disabled={disabled} value="space">
                IfcSpace
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {scope === "space" && (
            <Form.Item label="Nombre del espacio" name="space">
              <Input
                disabled={disabled}
                placeholder="Ej: Dormitorio Principal"
                value={space}
              />
            </Form.Item>
          )}

          <Form.Item label="Entidades IFC" name="entities">
            <Input
              disabled={disabled}
              placeholder="Ej: IfcBuildingElement, IfcFurnishingElement"
              value={entities}
            />
          </Form.Item>
        </Form>
      </div>

      {constraintsData.map((constraint) => (
        <Fragment key={constraint.index}>
          <Divider dashed />
          <ConstraintForm
            data={constraint}
            showActions={constraintsDeleteable && constraintsData.length > 1}
            onDelete={() => deleteConstraint(constraint.index)}
            shifted={
              showActions ||
              (constraintsDeleteable && constraintsData.length === 1)
            }
            disabled={disabled}
            onChange={(type, pset, on, attribute, operation, values) =>
              setConstraintData((prevState) => {
                const newConstraints = [...prevState];
                newConstraints[constraint.index] = {
                  ...newConstraints[constraint.index],
                  ...((!!type || type == "") && { type }),
                  ...((!!pset || pset == "") && { pset }),
                  ...((!!on || on == "") && { on }),
                  ...((!!attribute || attribute == "") && { attribute }),
                  ...((!!operation || operation == "") && { operation }),
                  ...((!!values || values == "") && { values }),
                };
                onChange(null, null, null, newConstraints);
                return newConstraints;
              })
            }
          />
        </Fragment>
      ))}

      <div style={{ marginTop: 24 }} className="RulesForm-ActionsContainer">
        <div />
        <div className="RulesForm-HorizontalItems">
          {(constraintsData.length > 1 || constraintsDeleteable) && (
            <Button
              danger={!constraintsDeleteable}
              type="dashed"
              onClick={togglePropsDeleteable}
              disabled={disabled}
            >
              {constraintsDeleteable ? "Listo" : "Quitar restricción"}
            </Button>
          )}
          <Button
            type="dashed"
            disabled={constraintsDeleteable || disabled}
            onClick={onClickAdd}
            icon={<PlusOutlined />}
          >
            Agregar otra restricción
          </Button>
        </div>
      </div>
    </>
  );
}

export default function RulesForm({ id, actions, data, onClick }) {
  const history = useHistory();
  const [currentData, setCurrentData] = useState({
    name: !!data ? data.name : "",
    formula: !!data ? data.formula : "",
    groupId: 1,
    filters: !!data
      ? data.filters
          .sort((a, b) => a.index > b.index)
          .map((f) => ({
            id: f.id,
            index: f.index,
            scope: f.scope,
            space: f.space,
            entities: f.entities,
            constraints: f.constraints
              .sort((a, b) => a.index > b.index)
              .map((c) => ({
                id: c.id,
                index: c.index,
                operation: c.operation,
                on: c.on,
                attribute: c.attribute,
                pset: c.pset,
                values: c.values,
                type: c.type,
              })),
          }))
      : [],
  });

  const [currentFilter, setCurrentFilter] = useState(-1);
  const [rulesDeleteable, setRulesDeleteable] = useState(false);
  const [disabled, setDisabled] = useState(!!data);
  const [saveDisabled, setSaveDisabled] = useState(false);

  const addFilter = () => {
    setCurrentData((prevState) => ({
      ...prevState,
      filters: [
        ...prevState.filters,
        {
          index: prevState.filters.length,
          scope: null,
          space: null,
          entities: [],
          constraints: [
            {
              index: 0,
              operation: null,
              on: null,
              attribute: null,
              pset: null,
              values: [],
            },
          ],
        },
      ],
    }));
    setCurrentFilter(currentData.filters.length);
  };

  const toggleDeleteable = () => {
    setRulesDeleteable(!rulesDeleteable);
    setSaveDisabled(!saveDisabled);
  };

  const onDeleteFilter = (index) =>
    setCurrentData((prevState) => {
      let newFilters = [...prevState.filters];
      delete newFilters[index];
      newFilters = newFilters.filter((e) => !!e);
      prevState.filters = newFilters;

      setCurrentFilter(newFilters.length > 0 ? 0 : -1);
      return prevState;
    });

  const onSelectFilter = (value) => setCurrentFilter(value);

  const toggleDisabled = () => setDisabled(!disabled);

  const saveRule = () => {
    setSaveDisabled(true);
    const url = !!id
      ? `${process.env.REACT_APP_API}/rules/${id}`
      : `${process.env.REACT_APP_API}/rules`;
    fetch(url, {
      method: !!id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentData),
    })
      .then((response) => (!!id ? setSaveDisabled(false) : history.push("/")))
      .catch((error) => console.log(error));
  };

  const deleteRule = () => {
    setSaveDisabled(true);
    setDisabled(true);
    setRulesDeleteable(false);

    fetch(`${process.env.REACT_APP_API}/rules/${id}`, {
      method: "DELETE",
    })
      .then((response) => history.push("/"))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="RulesForm-ActionsContainer">
        <Button
          shape="circle"
          icon={<ArrowLeftOutlined />}
          size="Large"
          onClick={onClick}
        />
        {actions && (
          <div className="RulesForm-HorizontalItems">
            <Button type="primary" danger size="Large" onClick={deleteRule}>
              Eliminar
            </Button>
          </div>
        )}
      </div>

      <Divider />

      <BasicInfo
        data={!!data && { name: data.name, formula: data.formula }}
        disabled={disabled}
        onChange={(name, formula) => {
          setCurrentData((prevState) => ({
            ...prevState,
            ...(!!name && { name }),
            ...(!!formula && { formula }),
          }));
        }}
      />

      <Divider />

      <Select
        placeholder="Selecciona un filtro"
        style={{ width: 200, marginBottom: currentFilter >= 0 && 24 }}
        value={currentFilter >= 0 ? currentFilter : null}
        onChange={onSelectFilter}
      >
        {currentData.filters.map((_, i) => (
          <Option key={i} value={i}>{`p${i}`}</Option>
        ))}
      </Select>

      {currentFilter >= 0 && (
        <FilterForm
          showActions={rulesDeleteable}
          onDelete={() => onDeleteFilter(currentFilter)}
          data={currentData.filters[currentFilter]}
          disabled={disabled}
          onChange={(scope, space, entities, constraints) =>
            setCurrentData((prevState) => {
              const idx = prevState.filters.findIndex(
                (f) => f.index == currentData.filters[currentFilter].index
              );
              const newFilters = [...prevState.filters];
              newFilters[idx] = {
                ...newFilters[idx],
                ...(!!scope && { scope }),
                ...(!!space && { space }),
                ...(!!entities && { entities }),
                ...(!!constraints && { constraints }),
              };
              return { ...prevState, filters: newFilters };
            })
          }
        />
      )}

      <Divider />

      <div className="RulesForm-ActionsContainer">
        <div className="RulesForm-HorizontalItems">
          <Button
            danger={!rulesDeleteable}
            type={rulesDeleteable && "primary"}
            onClick={toggleDeleteable}
            disabled={disabled}
          >
            {rulesDeleteable ? "Listo" : "Quitar Filtro"}
          </Button>
          <Button
            style={{ display: rulesDeleteable && "none" }}
            onClick={addFilter}
            disabled={disabled}
          >
            Nuevo Filtro
          </Button>
        </div>

        <Button
          type="primary"
          onClick={disabled ? toggleDisabled : saveRule}
          disabled={saveDisabled}
        >
          {disabled ? "Editar" : "Guardar"}
        </Button>
      </div>
    </>
  );
}
