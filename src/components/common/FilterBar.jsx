import React from "react";
import { Divider, DatePicker, Radio, Badge } from "antd";

const { RangePicker } = DatePicker;

function FilterBar(props) {
  return (
    <div className="dashboard-tool-bar" style={toolbarStyle}>
      <h4> Filter Detailers</h4>
      <Radio.Group
        size="default"
        buttonStyle="solid"
        onChange={props.onEmployeeChange}
      >
        <Radio.Button
          style={radioStyle}
          value={""}
          checked={props.selectedEmployee ? false : true}
        >
          All
        </Radio.Button>
        {props.employees.map((employee, i) => {
          return (
            <Radio.Button
              style={radioStyle}
              key={i}
              value={employee._id}
              checked={props.selectedEmployee === i ? true : false}
            >
              {employee.name}
            </Radio.Button>
          );
        })}
      </Radio.Group>
      <Divider />
      <h4>Filter Ranges</h4>
      <RangePicker
        onChange={props.handleChange}
        separator="|"
        placeholder={["Start", "End"]}
        style={{ width: "100%" }}
      />

      <br />
    </div>
  );
}

const radioStyle = {
  display: "block",
  marginBottom: 5,
  width: 200,
  borderRadius: 5
};

const toolbarStyle = {
  height: 350,
  backgroundColor: "#fff",
  padding: 25,
  borderRadius: 5
};

export default FilterBar;
