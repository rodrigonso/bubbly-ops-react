import React, { Component } from 'react'
import { Modal, Form, Input, TimePicker, DatePicker, Divider, Select, InputNumber, Button } from 'antd';
import moment from 'moment'
import axios from 'axios'
import uniqid from 'uniqid'

export class NewJob extends Component {
  state = {
    job: {},
    employeeId: '',
    summary: '',
    date: '',
    start: '',
    vehicleType: '',
    make: '',
    model: '',
    serviceType: '',
    location: '',
    origins: '',
    destinations: '',
    duration: 0,
    distance: 0
  }
 
  handleTextInput = (e, type) => {
    this.setState({ [type]: e.target.value })
  }

  handleDate = (value, type) => {
    this.setState({ [type]: value })
  }

  handleVehicleType = (value) => {
    this.setState({ vehicleType: value })
  }

  handleServiceType = (value) => {
    this.setState({ serviceType: value })
  }

  handleEmployeeSelection = (value) => {
    this.setState({ employeeId: value })
  }

  handleAddress = (e, type) => {
    this.setState({ [type]: e.target.value })
  }

  handleDistances = (value, type) => {
    this.setState({ [type]: value })
  }

  handleSave = async() => {
    const { job } = this.props
    const { distance, duration, summary, start, date, origins, destinations, make, model, vehicleType, employeeId } = this.state

    const serviceType = this.props.services.filter(item => item._id === this.state.serviceType)
    console.log(serviceType)

    const obj = {
      employeeId,
      location: origins,
			summary,
			jobData: { 
				description: summary,
				location: origins,
				organizer: employeeId,
				id: uniqid(),
				start: { dateTime: start },
				end: { dateTime: start }
			},
      start: moment(start).format("LT"),
      date: moment(date).format('l'),
      vehicleType: {
        make,
        model,
        rating: 0,
        vehicleType
			},
			upgrades: [],
      serviceType: serviceType[0],
      distances: {
        origin_addresses: [origins],
        destination_addresses: [destinations],
        rows: [
          { 
            elements : [
              {
                distance: { text: `${distance} mi` },
                duration: { text: `${duration} min` }
              }
            ] 
          }
        ]
      }
		}
		try {
			const res = await axios.post(`${process.env.REACT_APP_BACKEND_API}/jobs`, job)
			console.log(res)
			this.props.handleNewJob(obj)
		} catch (ex) {
			console.log(ex)
		}
  }

  render() {
    const { isVisible, services, job, employees, isEditing } = this.props
    const { origins, destinations, vehicleType, summary, make, model, start, date, serviceType, distance, duration, employeeId } = this.state

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
		} 
		
		const filteredServices = services.filter(item => item.vehicleType === vehicleType)

    return (
      <div>
        <Modal onCancel={this.props.handleModal} visible={isVisible} title="New Job" footer={<Button loading={isEditing} onClick={this.handleSave} type="primary" shape="round">Save</Button>  } >
          <div style={{ marginTop: 20 }} >
            <Form {...formItemLayout} labelAlign="left" >
              <Form.Item label="Summary">
                <Input value={summary} onChange={(e) => this.handleTextInput(e, "summary")} placeholder="Bubbly Pro for John Bubbles" />
              </Form.Item> 
                <Form.Item label="Date">
                  <DatePicker allowClear={false} value={date} onChange={(value) => this.handleDate(value, "date")} style={{ marginRight: "1.2rem" }} />  
                  <TimePicker allowClear={false} value={start} minuteStep={30} onChange={(value) => this.handleDate(value, "start")} style={{ width: "10rem" }} use12Hours format="hh:mm A" />
                </Form.Item>
                <Form.Item label="Employee">
                  <Select onChange={this.handleEmployeeSelection} defaultValue={employeeId} defaultActiveFirstOption={false} style={{ width: "50%" }} >
                    {employees.map(item => <Select.Option  key={item._id} value={item._id}>{item.name}</Select.Option> )}  
                  </Select> 
                </Form.Item> 
                <Divider />
                <Form.Item label="Vehicle"  >
                  <Input value={make}  onChange={(e) => this.handleTextInput(e, "make")} placeholder="Ford" style={{ width: "50%", marginRight: "5%" }}  />
                  <Input value={model} onChange={(e) => this.handleTextInput(e, "model")} placeholder="F-150" style={{ width: "45%" }}  />
                </Form.Item>
                <Form.Item label="Service" >
                  <Select value={vehicleType} onChange={this.handleVehicleType} style={{ width: "40%", marginRight: "5%" }} >
                    <Select.Option key="1" value="Sedan" >Sedan</Select.Option>
                    <Select.Option key="2" value="Non-Sedan" >Non-Sedan</Select.Option>
                  </Select>
                  <Select disabled={vehicleType ? false : true } defaultValue={serviceType} onChange={this.handleServiceType} style={{ width: "55%" }}  >
                    {filteredServices.map(item => <Select.Option key={item._id} value={item._id} >{item.name}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Divider />
                <Form.Item label="Origin" >
                  <Input value={origins} style={{ width: "85%", marginRight: "5%" }} onChange={(e) => this.handleAddress(e, "origins")} placeholder="12307 Bubbles Ave, Houston, TX 77043" />
                </Form.Item>
                <Form.Item label="Destination" >
                  <Input value={destinations} onChange={(e) => this.handleAddress(e, "destinations")} placeholder="2210 Bubbly Court, Houston, TX 77004" style={{ width: "75%", marginLeft: "10%", marginRight: "5%" }} />
                </Form.Item>
                <Form.Item label="Distances" >
                  <InputNumber onChange={(value) => this.handleDistances(`${value} mi`, "distance")} style={{ marginRight: "10%", marginLeft: "10%" }} defaultValue={distance} formatter={(item) => `${item} mi`} />
                  <InputNumber onChange={(value) => this.handleDistances(`${value} min`, "duration") } formatter={(item) => `${item} min`} defaultValue={duration} />
                </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}

export default NewJob
