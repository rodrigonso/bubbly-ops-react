import React from 'react'
import { Divider, DatePicker, Radio } from 'antd'

const { RangePicker } = DatePicker

function FilterBar(props) {
  return (
    <div className="dashboard-tool-bar" style={toolbarStyle}>
        <p style={{ display: "inline", marginRight: 20 }} >Filter by range</p>
        <RangePicker onChange={props.handleChange} separator="|" />
        <Divider type="vertical" style={{ marginLeft: 40, height: 45 }}/>
        <p style={{ display: "inline", marginRight: 5, marginLeft: 10 }}> Filter by detailer</p>
        <Radio.Group size="medium" style={{ marginLeft: 20 }} buttonStyle="outline" onChange={props.onEmployeeChange} >
        <Radio.Button value={""} checked={props.selectedEmployee ? false : true} >All</Radio.Button>
            {props.employees.map((employee, i) => {
                return <Radio.Button key={i} value={employee._id} checked={props.selectedEmployee === i ? true : false} >{employee.name}</Radio.Button>
            })}
        </Radio.Group>
    </div>
  )
}

const toolbarStyle = {
    marginTop: 10, 
    maxWidth: 1200, 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 4
  }

export default FilterBar

