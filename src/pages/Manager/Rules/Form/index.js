import { Col, Divider, Row } from "antd";
import SuccessModal from "common/display/Modal";
import Window from "common/display/Window";
import Form from "common/Form";
import { DeleteAction, EditAction } from "common/Form/ActionButton";
import FilledButton from "common/Form/Button";
import CheckboxInput from "common/Form/CheckboxInput";
import IconButton from "common/Form/IconButton";
import RadioInput from "common/Form/RadioInput";
import FormRow from "common/Form/Row";
import SelectInput from "common/Form/SelectInput";
import Steps from "common/Form/Steps";
import TextInput from "common/Form/TextInput";
import Layout from "common/Layout";
import React, { useEffect, useState } from "react";
import { TiPlus } from "react-icons/ti";
import { useHistory, useLocation } from "react-router";

const Icon = () => <TiPlus style={{ marginRight: 4 }} />;

const BasicInfoWindow = ({ data, onChange }) => {
  const { name, modelTypes, buildingTypes, description, group, newGroupName } =
    data;
  const [groups, setGroups] = useState([]);

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
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Window title={"Características"}>
      <Form
        onChange={onChange}
        values={{
          name,
          description,
          modelTypes,
          buildingTypes,
          group,
          newGroupName,
        }}
      >
        <TextInput required name={"name"} label="Nombre de la regla" />
        <TextInput name={"description"} label="Descripción" />
        <CheckboxInput
          required
          name={"modelTypes"}
          label="Tipo de modelo al que aplicará"
          options={[
            { label: "Arquitectura", value: "ARQUITECTURA" },
            { label: "Volumétrico", value: "VOLUMETRICO" },
            { label: "Sitio", value: "SITIO" },
          ]}
        />
        <CheckboxInput
          required
          name={"buildingTypes"}
          label="Tipo de construcción al que aplicará"
          options={[
            { label: "Casas", value: "HOUSE" },
            { label: "Edificios", value: "APARTMENT" },
          ]}
        />
        <RadioInput
          flex="none"
          required
          name={"group"}
          label="Grupo"
          options={[
            ...groups.map((e) => ({ label: e.name, value: "" + e.group_id })),
            { label: "Otro", value: -1 },
          ]}
        />
        {group === -1 && <TextInput name="newGroupName" />}
      </Form>
    </Window>
  );
};

const Constraint = ({ data, onChange, deleteValue, onDelete }) => {
  const { index, type, on, attribute, values, operation, pset } = data;
  const [value, setValue] = useState("");

  const onFormChange = ({ type, on, attribute, operation, pset, value }) => {
    const valueEnded = !!value && value.slice(-1) === ",";

    onChange({
      index,
      type,
      on,
      attribute,
      operation,
      pset,
      ...(valueEnded && { value: value.slice(0, -1) }),
    });
    valueEnded ? setValue("") : setValue(value);
  };

  return (
    <>
      <Divider />
      <div
        style={{
          background: "white",
          border: "1px solid var(--detail)",
          borderRadius: 5,
          padding: 18,
        }}
      >
        <Row justify="space-between">
          <Col>Restricción</Col>
          <Col>
            <DeleteAction onClick={onDelete} />
          </Col>
        </Row>
        <div
          style={{
            marginTop: 12,
          }}
        >
          <Form
            values={{ type, on, attribute, operation, pset, value }}
            onChange={onFormChange}
          >
            <RadioInput
              button
              name={"on"}
              options={[
                { label: "Entidad", value: "ENTITY" },
                { label: "Tipo de la entidad", value: "TYPE" },
              ]}
            />
            <RadioInput
              name={"type"}
              options={[
                { label: "Atributo", value: "ATTRIBUTE" },
                { label: "Pset/Qto", value: "PSET_QTO" },
                ...(type !== "TYPE"
                  ? [{ label: "Ubicación", value: "LOCATION" }]
                  : []),
              ]}
            />
            {type === "PSET_QTO" ? (
              <TextInput label="Nombre de la propiedad" name={"pset"} />
            ) : null}

            <FormRow>
              <TextInput
                span={6}
                label="Nombre del atributo"
                name={"attribute"}
              />
              <SelectInput
                span={3}
                label="Operación"
                name={"operation"}
                options={[
                  { label: "=", value: "EQUAL" },
                  { label: "≠", value: "NOT_EQUAL" },
                  { label: ">", value: "GREATER" },
                  { label: "≥", value: "GREATER_EQUAL" },
                  { label: "<", value: "LESSER" },
                  { label: "≤", value: "LESSER_EQUAL" },
                  { label: "∃", value: "EXISTS" },
                  { label: "∄", value: "NOT_EXISTS" },
                ]}
              />
              <TextInput
                flex={"auto"}
                multiple={values}
                name={"value"}
                label="Valores aceptados"
                disabled={operation === "EXISTS" || operation === "NOT_EXISTS"}
                onDelete={(e) => deleteValue({ value: e, index })}
              />
            </FormRow>
          </Form>
        </div>
      </div>
    </>
  );
};

const FilterWindow = ({
  saved,
  data,
  onChange,
  addContraint,
  deleteConstraint,
  onChangeConstraint,
  deleteFilter,
  saveFilter,
  undoSaveFilter,
  deleteValue,
  deleteEntity,
}) => {
  const { index, name, spaces, entities, constraints } = data;
  const [entity, setEntity] = useState("");
  const [saveDisabled, setSaveDisabled] = useState(true);

  const onFormChange = ({ name, spaces, entity }) => {
    const entityEnded = !!entity && entity.slice(-1) === ",";

    onChange({
      name,
      spaces,
      ...(entityEnded && { entity: entity.slice(0, -1) }),
    });
    entityEnded ? setEntity("") : setEntity(entity);
  };

  useEffect(
    () =>
      setSaveDisabled(
        !name ||
          entities.length === 0 ||
          constraints.filter((e) => !!e).length === 0 ||
          constraints
            .filter((e) => !!e)
            .some(
              (e) =>
                !e.type ||
                !e.on ||
                !e.attribute ||
                !e.operation ||
                (e.operation !== "EXISTS" &&
                  e.operation !== "NOT_EXISTS" &&
                  e.values.length === 0) ||
                (e.type === "PSET_QTO" && !e.pset)
            )
      ),
    [name, spaces, entities, constraints, setSaveDisabled]
  );

  return saved ? (
    <Window title={"Filtro"}>
      <Row justify="space-between" align="bottom">
        <Col>
          <span className="text-bold">{name}</span>
        </Col>
        <Col>
          <Row gutter={18}>
            <Col>
              <DeleteAction onClick={deleteFilter} />
            </Col>
            <Col>
              <EditAction onClick={undoSaveFilter} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Window>
  ) : (
    <Window title={"Filtro"}>
      <Form values={{ name, spaces, entity }} onChange={onFormChange}>
        <TextInput required name={"name"} label="Nombre del filtro" />
        <TextInput name={"spaces"} label="Recinto" />
        <TextInput
          required
          multiple={entities}
          name={"entity"}
          label="Entidades IFC"
          onDelete={(e) => deleteEntity({ entity: e })}
        />
      </Form>
      {constraints.map(
        (e, i) =>
          !!e && (
            <Constraint
              key={i}
              data={e}
              onChange={onChangeConstraint}
              onDelete={() => deleteConstraint(index, i)}
              deleteValue={deleteValue}
            />
          )
      )}
      <Row justify="space-between" align="bottom" style={{ marginTop: 24 }}>
        <Col>
          <IconButton
            green
            icon={<TiPlus />}
            label="Agregar nueva restricción"
            onClick={() => addContraint(index)}
          />
        </Col>
        <Col>
          <Row gutter={24}>
            <Col>
              <FilledButton outline onClick={deleteFilter}>
                Quitar
              </FilledButton>
            </Col>
            <Col>
              <FilledButton onClick={saveFilter} disabled={saveDisabled}>
                Registrar
              </FilledButton>
            </Col>
          </Row>
        </Col>
      </Row>
    </Window>
  );
};

const FormulaWindow = ({ data, onChange }) => {
  const { name, formula } = data;

  return (
    <Window title={"Fórmula"}>
      <Form values={{ name, formula }} onChange={onChange}>
        <TextInput name={"name"} label="Nombre de la regla" disabled />
        <TextInput required name={"formula"} label="Fórmula" />
      </Form>
    </Window>
  );
};

export default function RulesForm({ data }) {
  const { state } = useLocation();
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [savedFilters, setSavedFilters] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [currentData, setCurrentData] = useState({
    name: "",
    description: "",
    formula: "",
    modelTypes: [],
    buildingTypes: [],
    group: null,
    filters: [],
  });

  const addFilter = () =>
    setCurrentData((prevState) => ({
      ...prevState,
      filters: [
        ...prevState.filters,
        {
          name: "",
          index: prevState.filters.length,
          spaces: "",
          entities: [],
          constraints: [
            {
              index: 0,
              operation: null,
              on: null,
              attribute: null,
              pset: null,
              type: null,
              values: [],
            },
          ],
        },
      ],
    }));

  const deleteFilter = (index) =>
    setCurrentData((prevState) => {
      const filters = [...prevState.filters];
      delete filters[index];
      return { ...prevState, filters };
    });

  const applyFilter = (index) => setSavedFilters([...savedFilters, index]);
  const removeAppliedFilter = (index) =>
    setSavedFilters([...savedFilters.filter((e) => e !== index)]);

  const addContraint = (fIndex) =>
    setCurrentData((prevState) => {
      const filters = [...prevState.filters];
      const filter = filters[fIndex];
      filter.constraints.push({
        index: filter.constraints.length,
        operation: null,
        on: null,
        attribute: null,
        pset: null,
        type: null,
        values: [],
      });
      filters[fIndex] = filter;
      return {
        ...prevState,
        filters,
      };
    });

  const deleteConstraint = (fIndex, cIndex) =>
    setCurrentData((prevState) => {
      const filters = [...prevState.filters];
      const filter = filters[fIndex];
      const constraints = [...filter.constraints];
      delete constraints[cIndex];
      filter.constraints = constraints;
      filters[fIndex] = filter;
      return {
        ...prevState,
        filters,
      };
    });

  const deleteValue =
    (fIndex) =>
    ({ index, value }) =>
      setCurrentData((prevState) => {
        const filters = [...prevState.filters];
        const filter = filters[fIndex];
        const constraints = [...filter.constraints];
        const constraint = constraints[index];
        const newValues = [...constraint.values.filter((e) => e !== value)];

        constraints[index] = {
          ...constraint,
          ...{ values: newValues },
        };

        filters[fIndex] = {
          ...filter,
          constraints,
        };
        return { ...prevState, filters };
      });

  const deleteEntity =
    (fIndex) =>
    ({ entity }) =>
      setCurrentData((prevState) => {
        const filters = [...prevState.filters];
        const filter = filters[fIndex];
        const newEntities = [...filter.entities.filter((e) => e !== entity)];

        filters[fIndex] = {
          ...filter,
          ...{ entities: newEntities },
        };
        return { ...prevState, filters };
      });

  const onChangeBasicInfo = ({
    name,
    group,
    modelTypes,
    buildingTypes,
    description,
    newGroupName,
  }) => {
    setCurrentData((prevState) => ({
      ...prevState,
      ...(group !== undefined && { group }),
      ...(name !== undefined && { name }),
      ...(modelTypes !== undefined && { modelTypes }),
      ...(buildingTypes !== undefined && { buildingTypes }),
      ...(description !== undefined && { description }),
    }));
    newGroupName !== undefined && setNewGroupName(newGroupName);
  };

  const onChangeFilter =
    (fIndex) =>
    ({ name, spaces, entity }) =>
      setCurrentData((prevState) => {
        const filters = [...prevState.filters];
        const filter = filters[fIndex];
        const newEntities = !entity
          ? filter.entities
          : filter.entities.concat(entity);

        filters[fIndex] = {
          ...filter,
          ...(name !== undefined && { name }),
          ...(spaces !== undefined && { spaces }),
          ...{ entities: newEntities },
        };
        return { ...prevState, filters };
      });

  const onChangeConstraint =
    (fIndex) =>
    ({ index, operation, on, attribute, pset, type, value }) =>
      setCurrentData((prevState) => {
        const filters = [...prevState.filters];
        const filter = filters[fIndex];
        const constraints = [...filter.constraints];
        const constraint = constraints[index];
        const newValues = !value
          ? constraint.values
          : constraint.values.concat(value);

        constraints[index] = {
          ...constraint,
          ...(operation !== undefined && { operation }),
          ...(on !== undefined && { on }),
          ...(attribute !== undefined && { attribute }),
          ...(pset !== undefined && { pset }),
          ...(type !== undefined && { type }),
          ...{ values: newValues },
        };

        filters[fIndex] = {
          ...filter,
          constraints,
        };
        return { ...prevState, filters };
      });

  const onChangeFormula = ({ formula }) =>
    setCurrentData((prevState) => ({
      ...prevState,
      ...(formula !== undefined && { formula }),
    }));

  useEffect(() => {
    if (currentStep < 1)
      setNextDisabled(
        !currentData.name ||
          currentData.modelTypes.length === 0 ||
          currentData.buildingTypes.length === 0 ||
          !currentData.group
      );
    else if (currentStep < 2)
      setNextDisabled(
        savedFilters.length === 0 ||
          savedFilters.length < currentData.filters.filter((e) => !!e).length
      );
    else if (currentStep < 3) setNextDisabled(!currentData.formula);
  }, [currentData, setNextDisabled, currentStep, savedFilters]);

  const uploadRule = () => {
    const url = !!state
      ? `${process.env.REACT_APP_API}/rules/${state.ruleId}`
      : `${process.env.REACT_APP_API}/rules`;

    const dataCopy = { ...currentData };
    dataCopy.filters = currentData.filters
      .filter((e) => !!e)
      .map((e) => ({
        ...e,
        constraints: e.constraints.filter((c) => !!c),
        spaces: !!e.spaces ? [e.spaces] : [],
      }));

    dataCopy.group === -1
      ? fetch(`${process.env.REACT_APP_API}/groups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("auth"),
          },
          body: JSON.stringify({ name: newGroupName }),
        })
          .then((res) => res.json())
          .then((res) => res.group)
          .then((groupId) =>
            fetch(url, {
              method: !!state ? "PUT" : "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: sessionStorage.getItem("auth"),
              },
              body: JSON.stringify({ ...dataCopy, group: groupId }),
            })
          )
          .then((res) => res.json())
          .then((res) => {
            setOpenSuccessModal(true);
            window.setTimeout(
              () =>
                history.push("/manager/rules", {
                  ruleId: res.ruleId,
                  groupId: 1,
                }),
              3000
            );
          })
          .catch((err) => console.log(err))
      : fetch(url, {
          method: !!state ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("auth"),
          },
          body: JSON.stringify(dataCopy),
        })
          .then((res) => res.json())
          .then((res) => {
            setOpenSuccessModal(true);
            window.setTimeout(
              () =>
                history.push("/manager/rules", {
                  ruleId: res.ruleId,
                  groupId: currentData.group,
                }),
              3000
            );
          })
          .catch((err) => console.log(err));
  };

  useEffect(() => {
    !!state
      ? fetch(
          `${process.env.REACT_APP_API}/rules/${state.groupId}/${state.ruleId}`,
          {
            method: "GET",
            headers: {
              Authorization: sessionStorage.getItem("auth"),
            },
          }
        )
          .then((response) => response.json())
          .then((success) => {
            const r = success.rule;
            r.filters = r.filters.map((e) => ({
              ...e,
              spaces: e.spaces.length > 0 ? e.spaces[0] : "",
            }));
            setCurrentData({ ...r, group: state.groupId });
            setSavedFilters([...r.filters.map((e) => e.index)]);
          })
          .catch((error) => console.log(error))
      : addFilter();
  }, [setCurrentData, state]);

  return (
    <>
      <Layout
        headerLeftButton={{ content: "Mis proyectos", onClick: () => {} }}
        headerRightButton={{ content: "¿Cómo funciona?", onClick: () => {} }}
      >
        <Row>
          <Col xs={24}>
            <Row justify="end" gutter={48}>
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

            <h1>Nueva regla</h1>
          </Col>

          <Steps
            currentStep={currentStep}
            steps={["Características", "Filtros", "Fórmula"]}
          />
        </Row>

        <Row>
          <Col lg={24}>
            {currentStep < 1 ? (
              <BasicInfoWindow
                data={{ ...currentData, newGroupName }}
                onChange={onChangeBasicInfo}
              />
            ) : currentStep < 2 ? (
              <>
                {currentData.filters.map(
                  (e) =>
                    !!e && (
                      <FilterWindow
                        key={e.index}
                        saved={savedFilters.indexOf(e.index) >= 0}
                        data={e}
                        addContraint={addContraint}
                        deleteConstraint={deleteConstraint}
                        onChange={onChangeFilter(e.index)}
                        onChangeConstraint={onChangeConstraint(e.index)}
                        deleteFilter={() => deleteFilter(e.index)}
                        saveFilter={() => applyFilter(e.index)}
                        undoSaveFilter={() => removeAppliedFilter(e.index)}
                        deleteValue={deleteValue(e.index)}
                        deleteEntity={deleteEntity(e.index)}
                      />
                    )
                )}
                <IconButton
                  style={{ marginBottom: 24 }}
                  icon={<TiPlus />}
                  label="Agregar nuevo filtro"
                  onClick={addFilter}
                />
              </>
            ) : (
              <FormulaWindow data={currentData} onChange={onChangeFormula} />
            )}
          </Col>
        </Row>

        <Row
          justify={currentStep > 0 ? "space-between" : "end"}
          align="bottom"
          style={{ marginTop: 24 }}
        >
          <Col style={currentStep === 0 ? { display: "none" } : {}}>
            <FilledButton
              green
              outline
              onClick={() => {
                setCurrentStep(currentStep - 1);
              }}
            >
              Anterior
            </FilledButton>
          </Col>
          <Col>
            <FilledButton
              disabled={nextDisabled}
              green
              onClick={() => {
                setCurrentStep(currentStep + 1);
                setNextDisabled(true);
                currentStep >= 2 && uploadRule();
              }}
            >
              {currentStep < 2 ? "Siguiente" : "Finalizar"}
            </FilledButton>
          </Col>
        </Row>
      </Layout>

      <SuccessModal
        open={openSuccessModal}
        title={"Has creado una regla con éxito"}
      />
    </>
  );
}
