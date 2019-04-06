import React, { Component } from 'react';
import { getEventsById, handleGoogleUser } from '../../services/eventsService';
import Weekday from '../weekday/Weekday';
import { Divider, DatePicker, Radio, Collapse, Row, Col, Statistic, Card, message, Button, Skeleton } from 'antd';
import moment from 'moment'

const { WeekPicker } = DatePicker
const { Panel } = Collapse

export class Dashboard extends Component {
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
    weekRevenue: 0,
    weekServices: 0,
    skeleton: false
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

  try {
    this.setState({ skeleton: true })
    const events = await getEventsById(selectedDetailer.email, this.state.selectedRange);
    this.setState({ events, selectedDetailer });
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
    this.setState({ weekServices: sum })
  } else {
    return 0
  }
}


// gets appointments for selected detailer
handleChange = async(date) => {
  const { selectedDetailer } = this.state;
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
  }
}

getWeekRevenue = (days) => {
  const sum = days.map((item, i) => {
    if (!item.revenue) return 0;
    if (!days[i + 1] || !days[i + 1].revenue) return item.revenue + 0
    return item.revenue + days[i + 1].revenue
  })
  const total = sum.reduce((a, b) => a + b)
  console.log(total)
}

render() {
  const { detailers, selectedDetailer, weekRevenue, weekServices, events, skeleton } = this.state
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
          <Radio.Group size="medium" style={{ marginLeft: 20 }} buttonStyle="solid" >
            {detailers.map((detailer, i) => {
              return <Radio.Button key={i} checked={detailer.name === selectedDetailer.name ? true : false} value={detailer} onChange={(e) => this.toggleDetailer(e)} >{detailer.name}</Radio.Button>
            })}
          </Radio.Group>
        </div>
        <div className="dashboard-week-totals" style={{ backgroundColor: "#fff", marginTop: 20, padding: 24, borderRadius: 4 }} >
          <Row>
            <Col span={4}>
              <Statistic value={weekRevenue} title="Total Revenue" /> 
            </Col>
            <Col span={4}>
              <Statistic value={weekServices} suffix="/30" title="Total Services" /> 
            </Col>
          </Row>
        </div>
        <div className="dashboard-days-card" style={{ marginTop: 20, maxWidth: 1200 }}>
          <Collapse bordered={false} style={{ backgroundColor: "#f7f7f7" }} >
              {events.map((props, day) => {
                if (skeleton) {
                  return <Card style={{ border: 0, borderRadius: 4, backgroundColor: "#fff", padding: 24, marginBottom: 5 }} ><Skeleton active loading /></Card>
                } else {
                  return <Weekday {...props} key={day} sendData={this.recieveData} getWeekRevenue={this.getWeekRevenue} day={day} days={events} />
                }
              })}
          </Collapse>
        </div>
      </div>
    )
  }
};

//<Google onSuccess={this.responseGoogle} onFailure={this.responseGoogle} />



const toolbarStyle = {
  marginTop: 10, 
  maxWidth: 1200, 
  backgroundColor: "#fff", 
  padding: 20, 
  borderRadius: 4
}

export default Dashboard
