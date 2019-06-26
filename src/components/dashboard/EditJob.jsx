import React, { Component } from 'react'
import { Modal, Form, Input, TimePicker, DatePicker, Divider, Select, InputNumber, Button } from 'antd';
import moment from 'moment'
import Joi from 'joi'

export class EditJob extends Component {
  state = {
    job: this.props.job,
    summary: '',
    date: '',
    start: '',
    vehicleType: '',
    serviceType: '',
    origins: '',
    destinations: '',
    duration: '',
    distance: '',
    employeeId: ''
  }

  componentDidUpdate(prevProps) {
    if (prevProps.job !== this.props.job) {
      const { job } = this.props
      this.setState({ job })
      this.setState({ 
        employeeId: job.employeeId,
        summary: job.summary,
        date: job.date,
        start: job.jobData.start.dateTime,
        vehicleType: job.vehicleType.vehicleType,
        make: job.vehicleType.make,
        model: job.vehicleType.model,
        serviceType: job.serviceType._id,
        location: job.location,
        origins: this.checkIfDistances() ? job.distances.origin_addresses : '',
        destinations: this.checkIfDistances() ? job.distances.destination_addresses : '',
        duration: this.checkIfDistances() ? parseInt(job.distances.rows[0].elements[0].duration.text) : 0,
        distance: this.checkIfDistances() ? parseInt(job.distances.rows[0].elements[0].distance.text) : 0,
       })
    }
  }

  checkIfDistances = () => {
    const { job } = this.props
    if (job.distances.rows.length > 0) return true
    else return false
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

  handleSave = () => {
    const { job } = this.props
    const { distance, duration, summary, start, date, origins, destinations, make, model, vehicleType, employeeId } = this.state

    const serviceType = this.props.services.filter(item => item._id === this.state.serviceType)
    console.log(serviceType)

    const obj = {
      _id: job._id,
      employeeId,
      jobData: job.jobData,
      location: origins,
      upgrades: job.upgrades,
      summary,
      start: moment(start).format("LT"),
      date: moment(date).format('l'),
      vehicleType: {
        make,
        model,
        rating: job.vehicleType.rating,
        vehicleType
      },
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
    console.log(obj)
    this.props.handleSave(obj)
  }

  render() {
    const { isVisible, services, job, employees } = this.props
    const { origins, destinations, vehicleType, summary, make, model, start, date, serviceType, distance, duration, employeeId } = this.state

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }

    const filteredServices = services.filter(item => item.vehicleType ===  vehicleType ) 

    if (!job.summary) return null
    return (
      <div>
        <Modal onCancel={this.props.handleClose} visible={isVisible} title="Edit Job" footer={<Button onClick={this.handleSave} type="primary" shape="round">Save</Button>  } >
          <div style={{ marginTop: 20 }} >
            <Form {...formItemLayout} labelAlign="left" >
              <Form.Item label="Summary">
                <Input value={summary ? summary : job.summary} onChange={(e) => this.handleTextInput(e, "summary")} placeholder="Bubbly Pro for John Bubbles" />
              </Form.Item> 
                <Form.Item label="Date">
                  <DatePicker allowClear={false} value={moment(date ? date : job.jobData.start.dateTime)} onChange={(value) => this.handleDate(value, "date")} style={{ marginRight: "1.2rem" }} />  
                  <TimePicker allowClear={false} value={moment(start ? start : job.jobData.start.dateTime)} minuteStep={30} onChange={(value) => this.handleDate(value, "start")} style={{ width: "10rem" }} use12Hours format="hh:mm A" />
                </Form.Item>
                <Form.Item label="Employee">
                  <Select onChange={this.handleEmployeeSelection} defaultValue={employeeId} defaultActiveFirstOption={false} style={{ width: "50%" }} >
                    {employees.map(item => <Select.Option  key={item._id} value={item._id}>{item.name}</Select.Option> )}  
                  </Select> 
                </Form.Item> 
                <Divider />
                <Form.Item label="Vehicle"  >
                  <Input value={make ? make : job.vehicleType.make}  onChange={(e) => this.handleTextInput(e, "make")} placeholder="Ford" style={{ width: "50%", marginRight: "5%" }}  />
                  <Input value={model ? model : job.vehicleType.model} onChange={(e) => this.handleTextInput(e, "model")} placeholder="F-150" style={{ width: "45%" }}  />
                </Form.Item>
                <Form.Item label="Service" >
                  <Select value={vehicleType ? vehicleType : job.vehicleType.vehicleType} onChange={this.handleVehicleType} style={{ width: "40%", marginRight: "5%" }} >
                    <Select.Option key="1" value="Sedan" >Sedan</Select.Option>
                    <Select.Option key="2" value="Non-Sedan" >Non-Sedan</Select.Option>
                  </Select>
                  <Select defaultValue={serviceType ? serviceType : job.serviceType.name} onChange={this.handleServiceType} style={{ width: "55%" }}  >
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

export default EditJob
