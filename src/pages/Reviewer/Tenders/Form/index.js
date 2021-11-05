import { Col, Row } from "antd";
import Card from "common/display/Card";
import Window from "common/display/Window";
import Form from "common/Form";
import RadioInput from "common/Form/RadioInput";
import FormRow from "common/Form/Row";
import SelectInput from "common/Form/SelectInput";
import TextInput from "common/Form/TextInput";
import Layout from "common/Layout";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

const TypeSelectWindow = ({ onClick }) => (
  <Window title={"Tipo de llamado"}>
    <Row justify="space-around">
      <Col lg={8}>
        <Card
          disabled
          title={"Llamado Nacional"}
          actionTitle={"Próximamente"}
        />
      </Col>
      <Col lg={8}>
        <Card
          title={"Llamado especial DS19"}
          actionTitle={"Versión beta"}
          action={onClick}
        />
      </Col>
    </Row>
  </Window>
);

const BasicInfoWindow = ({ data, onChange, disabled, onEdit }) => {
  const {
    name,
    region,
    commune,
    address,
    propertyRole,
    constructabilityCoef,
    soilOccupancyCoef,
    type,
    angle,
  } = data;

  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/regions`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("auth"),
      },
    })
      .then((response) => response.json())
      .then((success) => {
        const responseRegions = success.regions.sort(
          (a, b) => a.region_id > b.region_id
        );
        setRegions(responseRegions);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    !!region &&
      fetch(`${process.env.REACT_APP_API}/regions/${region}`, {
        method: "GET",
        headers: {
          Authorization: sessionStorage.getItem("auth"),
        },
      })
        .then((response) => response.json())
        .then((success) => {
          const responseCommunes = success.communes.sort(
            (a, b) => a.commune_id > b.commune_id
          );
          setCommunes(responseCommunes);
        })
        .catch((error) => console.log(error));
  }, [region]);

  return (
    <Window title={"Características"}>
      <Form
        onChange={onChange}
        values={{
          name,
          region,
          commune,
          address,
          propertyRole,
          constructabilityCoef,
          soilOccupancyCoef,
          type,
          angle,
        }}
      >
        <TextInput
          disabled={disabled}
          required
          name={"name"}
          label="Nombre del llamado"
        />
        <SelectInput
          disabled={disabled}
          required
          name={"region"}
          label="Región"
          options={regions.map((e) => ({
            label: e.name,
            value: "" + e.region_id,
          }))}
        />
        <SelectInput
          disabled={disabled}
          required
          name={"commune"}
          label="Comuna"
          options={communes.map((e) => ({
            label: e.name,
            value: "" + e.commune_id,
          }))}
        />
        <TextInput
          disabled={disabled}
          required
          name={"address"}
          label="Dirección"
        />
        <TextInput
          disabled={disabled}
          required
          name={"propertyRole"}
          label="Rol de la propiedad"
        />
        <TextInput
          disabled={disabled}
          required
          name={"constructabilityCoef"}
          label="Coeficiente de constructibilidad"
        />
        <TextInput
          disabled={disabled}
          required
          name={"soilOccupancyCoef"}
          label="Coeficiente de ocupación de suelo"
        />
        <SelectInput
          disabled={disabled}
          required
          name={"type"}
          label="Casa o edificio"
          options={[
            { label: "Casa", value: "HOUSE" },
            { label: "Edificio", value: "APARTMENT" },
          ]}
        />
        <RadioInput
          disabled={disabled}
          required
          name={"angle"}
          label="Rasante"
          options={[
            { label: "60°", value: 60 },
            { label: "70°", value: 70 },
            { label: "80°", value: 80 },
          ]}
        />
      </Form>
    </Window>
  );
};

const RequirementsWindow = ({ data, onChange, disabled, onEdit }) => {
  const {
    vulnerable,
    handicapVulnerable,
    medios1,
    handicapMedios1,
    medios2,
    handicapMedios2,
    total,
    isHandicapVulnerable,
    isHandicapMedios1,
    isHandicapMedios2,
  } = data;

  return (
    <Window title={"Requerimientos"}>
      <Form
        onChange={onChange}
        values={{
          vulnerable,
          handicapVulnerable,
          medios1,
          handicapMedios1,
          medios2,
          handicapMedios2,
          total,
          isHandicapVulnerable,
          isHandicapMedios1,
          isHandicapMedios2,
        }}
      >
        <FormRow>
          <TextInput
            disabled={disabled}
            span={7}
            required
            name={"vulnerable"}
            label="Viviendas vulnerables"
          />
          <TextInput
            disabled={disabled}
            span={7}
            offset={2}
            activable={"isHandicapVulnerable"}
            name={"handicapVulnerable"}
            label="Unidades con accesibilidad universal"
          />
        </FormRow>
        <FormRow>
          <TextInput
            disabled={disabled}
            span={7}
            required
            name={"medios1"}
            label="Viviendas sectores medios 01"
          />
          <TextInput
            disabled={disabled}
            span={7}
            offset={2}
            activable={"isHandicapMedios1"}
            name={"handicapMedios1"}
            label="Unidades con accesibilidad universal"
          />
        </FormRow>
        <FormRow>
          <TextInput
            disabled={disabled}
            span={7}
            required
            name={"medios2"}
            label="Viviendas sectores medios 02"
          />
          <TextInput
            disabled={disabled}
            span={7}
            offset={2}
            activable={"isHandicapMedios2"}
            name={"handicapMedios2"}
            label="Unidades con accesibilidad universal"
          />
        </FormRow>
        <FormRow>
          <TextInput
            disabled={disabled}
            span={7}
            required
            name={"total"}
            label="Mínimo de viviendas totales"
          />
        </FormRow>
      </Form>
    </Window>
  );
};

export default function TendersForm() {
  const { state } = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(!!state ? 3 : -1);
  const [currentData, setCurrentData] = useState({
    name: "",
    region: "",
    commune: "",
    address: "",
    propertyRole: "",
    constructabilityCoef: "",
    soilOccupancyCoef: "",
    type: "",
    angle: null,
    vulnerable: "",
    handicapVulnerable: "",
    medios1: "",
    handicapMedios1: "",
    medios2: "",
    handicapMedios2: "",
    total: "",
    isHandicapVulnerable: false,
    isHandicapMedios1: false,
    isHandicapMedios2: false,
  });

  const onChangeBasicInfo = ({
    name,
    region,
    commune,
    address,
    propertyRole,
    constructabilityCoef,
    soilOccupancyCoef,
    type,
    angle,
  }) =>
    setCurrentData((prevState) => ({
      ...prevState,
      ...(name !== undefined && { name }),
      ...(region !== undefined && { region }),
      ...(commune !== undefined && { commune }),
      ...(address !== undefined && { address }),
      ...(propertyRole !== undefined && { propertyRole }),
      ...(constructabilityCoef !== undefined && { constructabilityCoef }),
      ...(soilOccupancyCoef !== undefined && { soilOccupancyCoef }),
      ...(type !== undefined && { type }),
      ...(angle !== undefined && { angle }),
    }));

  const onChangeRequirements = ({
    vulnerable,
    handicapVulnerable,
    medios1,
    handicapMedios1,
    medios2,
    handicapMedios2,
    total,
    isHandicapVulnerable,
    isHandicapMedios1,
    isHandicapMedios2,
  }) =>
    setCurrentData((prevState) => ({
      ...prevState,
      ...(vulnerable !== undefined && { vulnerable }),
      ...(handicapVulnerable !== undefined && { handicapVulnerable }),
      ...(medios1 !== undefined && { medios1 }),
      ...(handicapMedios1 !== undefined && { handicapMedios1 }),
      ...(medios2 !== undefined && { medios2 }),
      ...(handicapMedios2 !== undefined && { handicapMedios2 }),
      ...(total !== undefined && { total }),
      ...(isHandicapVulnerable !== undefined && { isHandicapVulnerable }),
      ...(isHandicapMedios1 !== undefined && { isHandicapMedios1 }),
      ...(isHandicapMedios2 !== undefined && { isHandicapMedios2 }),
    }));

  useEffect(() => {
    !!state &&
      !loaded &&
      fetch(`${process.env.REACT_APP_API}/tenders/${state.tenderId}`, {
        method: "GET",
        headers: {
          Authorization: sessionStorage.getItem("auth"),
        },
      })
        .then((response) => response.json())
        .then((success) => {
          const o = success.tender;
          setCurrentData({
            name: o.name,
            region: "" + o.region_id,
            commune: "" + o.commune_id,
            address: o.address,
            propertyRole: o.property_role,
            constructabilityCoef: o.constructability_coef,
            soilOccupancyCoef: o.soil_occupancy_coef,
            type: o.building_type_name,
            angle: o.angle,
            vulnerable: o.vulnerable,
            handicapVulnerable: o.handicap_vulnerable,
            medios1: o.medios_1,
            handicapMedios1: o.handicap_medios_1,
            medios2: o.medios_2,
            handicapMedios2: o.handicap_medios_2,
            total: o.total,
            isHandicapVulnerable: o.handicap_vulnerable > 0,
            isHandicapMedios1: o.handicap_medios_1 > 0,
            isHandicapMedios2: o.handicap_medios_2 > 0,
          });
          setCurrentStep(2);
          setLoaded(true);
        })
        .catch((error) => console.log(error));
  }, [setCurrentData, state, currentData, loaded]);

  return (
    <>
      <Layout
        headerLeftButton={{ content: "Mis proyectos", onClick: () => {} }}
        headerRightButton={{ content: "¿Cómo funciona?", onClick: () => {} }}
      >
        <Row>
          <Col xs={24}>
            <h1>Ver llamado</h1>
          </Col>
        </Row>

        <Row>
          <Col lg={24}>
            {currentStep < 0 ? (
              <TypeSelectWindow onClick={() => setCurrentStep(0)} />
            ) : currentStep < 1 ? (
              <BasicInfoWindow
                data={currentData}
                onChange={onChangeBasicInfo}
              />
            ) : currentStep < 2 ? (
              <RequirementsWindow
                data={currentData}
                onChange={onChangeRequirements}
              />
            ) : (
              <>
                <BasicInfoWindow
                  disabled
                  data={currentData}
                  onEdit={() => setCurrentStep(0)}
                />
                <RequirementsWindow
                  disabled
                  data={currentData}
                  onEdit={() => setCurrentStep(1)}
                />
              </>
            )}
          </Col>
        </Row>
      </Layout>
    </>
  );
}
