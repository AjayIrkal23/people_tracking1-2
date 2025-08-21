import React, { useContext } from "react";
import { Select } from "antd";
import MapContext from "@/context/MapContext";
import { Battery } from "@/interfaces/map";

const SelectCellar: React.FC = () => {
  const { location, setLocation } = useContext(MapContext);

  const handleChange = (value: Battery) => {
    setLocation(value);
  };

  return (
    <Select
      className="my-4 absolute top-2 right-4 z-50"
      defaultValue={location}
      style={{
        width: 140,
        height: 50,
        border: `3px solid black`,
        borderRadius: "10px",
      }}
      onChange={handleChange}
      options={[
        { value: Battery.one, label: "Battery 1" },
        { value: Battery.two, label: "Battery 2" },
      ]}
    />
  );
};

export default SelectCellar;
