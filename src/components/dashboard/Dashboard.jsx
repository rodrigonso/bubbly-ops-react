import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { getEventsById } from '../../services/eventsService';
import Weekday from '../weekday/Weekday';
import { Divider, DatePicker, Radio, Collapse, Row, Col, Statistic, Card } from 'antd';
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
    weekRevenue: 0
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
  const events = await getEventsById(selectedDetailer.email, this.state.selectedRange);
  this.setState({ events, selectedDetailer });
}

// gets appointments for selected detailer
handleChange = async(date) => {
  const { selectedDetailer } = this.state;
  const dt = moment(date._d).subtract(6, 'days')
  const start = dt._d
  const end = dt._i
  const range = [];
  range.push(start, end);
  
  const events = await getEventsById(selectedDetailer.email, range);
  this.setState({ events, selectedRange: range })
}

getWeekRevenue = (days) => {
  const sum = days.map((item, i) => {
    if (!item.revenue) return 0;
    if (!days[i + 1].revenue) return item.revenue + 0
    return item.revenue + days[i + 1].revenue
  })
  const total = sum.reduce((a, b) => a + b)
  console.log(total)
}

render() { 
    return (
      <div style={{ height: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Appointments</h1>
        <p>View and manage all detailers and respective appointments here.</p>
        <Divider />
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <GoogleLogin
          clientId="111663759471-906452b0rdqva4fn9jrahjf7j0e30qf7.apps.googleusercontent.com"
          buttonText="Authorize with Google"
          scope="https://www.googleapis.com/auth/calendar.readonly"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
        />
        </div>
        <div className="dashboard-tool-bar" style={toolbarStyle}>
          <p style={{ display: "inline", marginRight: 20 }} >Select week</p>
          <WeekPicker onChange={this.handleChange} />
          <Divider type="vertical" style={{ marginLeft: 40, height: 45 }}/>
          <p style={{ display: "inline", marginRight: 5, marginLeft: 10 }}> Select detailer</p>
            <Radio.Group size="medium" style={{ marginLeft: 20 }} buttonStyle="solid" >
              {this.state.detailers.map((detailer, i) => {
                return <Radio.Button key={i} checked={detailer.name === this.state.selectedDetailer.name ? true : false} value={detailer} onChange={(e) => this.toggleDetailer(e)} >{detailer.name}</Radio.Button>
              })}
            </Radio.Group>
        </div>
        <div className="dashboard-week-totals" style={{ backgroundColor: "#fff", marginTop: 20, padding: 24, borderRadius: 4 }} >
          <Row>
            <Col span={6}>
              <Statistic count={this.state.weekRevenue} title="Total Revenue" /> 
            </Col>
          </Row>
        </div>
        <div className="dashboard-days-card" style={{ marginTop: 20, maxWidth: 1200 }}>
          <Collapse bordered={false} style={{ backgroundColor: "#f7f7f7" }} >
              {this.state.events.map((props, day) => <Weekday {...props} key={day} getWeekRevenue={this.getWeekRevenue} day={day} days={this.state.events}/>)}
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
