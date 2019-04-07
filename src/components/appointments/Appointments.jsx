import React, { Component } from 'react';
import { getEventsById, handleGoogleUser } from '../../services/eventsService';
import Weekday from '../weekday/Weekday';
import { Divider, DatePicker, Radio, Collapse, Row, Col, Statistic, Card, message, Button, Skeleton, Tooltip } from 'antd';
import moment from 'moment'
import axios from 'axios'

const { WeekPicker } = DatePicker

export class Appointments extends Component {
state = {
    detailers: [
      { id: 1, name: "Rodrigo", email: "rodrigo@bubblynow.com" },
      { id: 2, name: "Gustavo", email: "gutymaule@gmail.com" },
      { id: 3, name: "Eric", email: "eric@bubblynow.com" },
    ],
    events: [],
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    selectedDetailer: { id: 2, name: "Gustavo", email: "gutymaule@gmail.com" },
    selectedRange: [],
    services: 0,
    hours: 0,
    driving: 0,
    revenue: 0,
    skeleton: false,
    enableValidate: false,
    isValidating: false,
    isDetailerBtn: false
}

componentDidMount() {
  handleGoogleUser(this.state.selectedDetailer, this.state.selectedRange)
}

responseGoogle = (response) => {
  console.log(response);
  const token = response.accessToken
  
  if (!token) return "token invalid"
  localStorage.setItem("accessToken", token);
  this.props.history.replace("/dashboard")
  return;
};

// handles detailer selection
toggleDetailer = async(e) => {
  const selectedDetailer = e.target.value;

  this.handleReset()

  try {
    this.setState({ skeleton: true })
    const events = await getEventsById(selectedDetailer.email, this.state.selectedRange);
    this.setState({ events, selectedDetailer });
    this.getTotalServices()
  } catch(ex) {
    message.error("Something went wrong!")
  } finally {
    this.setState({ skeleton: false })
  }
}

getTotalServices = () => {
  const total = this.state.events.map(event => event.events.length)
  if (total.length > 0) {
    const sum = total.reduce((a, b) => a + b)
    this.setState({ services: sum })
  } else {
    return 0
  }
}

handleReset = () => {
  this.setState({ hours: 0, driving: 0, revenue: 0, services: 0 })
  return false
}

// gets appointments for selected detailer
handleChange = async(date) => {
  const { selectedDetailer } = this.state;

  this.handleReset()

  console.log(date)
  const dt = moment(date._d).subtract(6, 'days')
  const start = dt._d
  const end = dt._i
  const range = [];
  range.push(start, end);
  
  try {
    this.setState({ skeleton: true })

    const events = await getEventsById(selectedDetailer.email, range);
    this.setState({ events, selectedRange: range })
  } catch(ex) {
    console.log(ex)
    message.error("Something went wrong!")
  } finally {
    this.setState({ skeleton: false })
    this.getTotalServices()
    this.setState({ isDetailerBtn: true })
  }
}

recieveData = (data, dayIndex) => {
  const events = [...this.state.events]
  const day = this.state.events.filter((event, i) => i === dayIndex)
  day[0].data = data

  events[dayIndex] = day[0]
  this.setState({ events })
  this.saveWeekData()
}

saveWeekData = () => {
  this.state.events.map(event => {
    if (!event.data) return;
      event.data.map(item => {
        this.setState({ [item.name]: item.value + this.state[item.name] })
    })
  })
  this.setState({ enableValidate: true })
}

handleValidate = async() => {
  const filteredEvents = this.state.events.filter(event => event.data)

  const obj = {
    data: filteredEvents,
    range: this.state.selectedRange,
    detailer: this.state.selectedDetailer,
    totalHours: this.state.hours,
    totalDriving: this.state.driving,
    totalRevenue: this.state.revenue,
    totalServices: this.state.services,
  }

  try {
    this.setState({ isValidating: true })
    const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/weeks`, obj)
    console.log(data)
    message.success("Week was validated with sucess!")

  } catch(ex) {
    console.log(ex)
    message.error("We were unable to validate the selected week!")

  } finally {
    this.setState({ isValidating: false })
  }
}

render() {
  const { detailers, selectedDetailer, revenue, driving, hours, services, events, skeleton } = this.state
    return (
      <div style={{ height: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Appointments</h1>
        <p>View and manage all detailers and respective appointments here.</p>
        <Divider />
        <div style={{ marginTop: 20, marginBottom: 20 }}>
        </div>
        <div className="dashboard-tool-bar" style={toolbarStyle}>
          <p style={{ display: "inline", marginRight: 20 }} >Select week</p>
          <WeekPicker onChange={this.handleChange} />
          <Divider type="vertical" style={{ marginLeft: 40, height: 45 }}/>
          <p style={{ display: "inline", marginRight: 5, marginLeft: 10 }}> Select detailer</p>
          <Radio.Group size="medium" style={{ marginLeft: 20 }} buttonStyle="outline" disabled={!this.state.isDetailerBtn} >
            {detailers.map((detailer, i) => {
              return <Radio.Button key={i} checked={detailer.name === selectedDetailer.name ? true : false} value={detailer} onChange={(e) => this.toggleDetailer(e)} >{detailer.name}</Radio.Button>
            })}
          </Radio.Group>
        </div>
        <div className="dashboard-week-totals" style={{ backgroundColor: "#fff", marginTop: 20, padding: 24, borderRadius: 4 }} >
          <Row>
            <Col span={4}>
              <Statistic value={revenue} prefix="$" title="Total Revenue" /> 
            </Col>
            <Col span={4}>
              <Statistic value={services} suffix="/30" title="Total Services" /> 
            </Col>
            <Col span={4}>
              <Statistic value={driving} suffix="" title="Total Driving" /> 
            </Col>
            <Col span={4}>
              <Statistic value={hours} suffix="" title="Total Hours" /> 
            </Col>
            <Col span={1}>
              <Divider type="vertical" style={{ height: 50 }} />
            </Col>
            <Col span={3}>
              <Tooltip title="Save week" arrowPointAtCenter>
                <Button loading={this.state.isValidating} onClick={this.handleValidate} disabled={!this.state.enableValidate} type="primary" icon="save" style={{ marginTop: 8, marginLeft: 15 }} >
                Save
                </Button>
              </Tooltip>
            </Col>
            <Col span={2}>
              <Tooltip title="Restart" arrowPointAtCenter>
                <Button onClick={this.handleReset} disabled={!this.state.enableValidate} type="danger" icon="reload" style={{ marginTop: 8, marginLeft: 10 }} >
                Reset
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </div>
        <div className="dashboard-days-card" style={{ marginTop: 20, maxWidth: 1200 }}>
          <Collapse bordered={false} style={{ backgroundColor: "#f7f7f7" }} >
              {events.map((props, day) => {
                if (skeleton) {
                  return <Card style={{ border: 0, borderRadius: 4, backgroundColor: "#fff", padding: 24, marginBottom: 5 }} ><Skeleton active loading /></Card>
                } else {
                  return <Weekday {...props} key={day} sendData={this.recieveData} day={day} days={events} />
                }
              })}
          </Collapse>
        </div>
      </div>
    )
  }
};

const toolbarStyle = {
  marginTop: 10, 
  maxWidth: 1200, 
  backgroundColor: "#fff", 
  padding: 20, 
  borderRadius: 4
}

export default Appointments
