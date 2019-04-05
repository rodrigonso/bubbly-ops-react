import React, { Component } from 'react';
import Google from '../common/Google';
import { getEventsById } from '../../services/eventsService';
import Collapsable from '../collapsable/Collapsable';
import { Divider, DatePicker, Radio } from 'antd';
import moment from 'moment'

const { WeekPicker } = DatePicker

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
    selectedRange: []
}

responseGoogle = (response) => {
  localStorage.setItem("accessToken", response.accessToken);
  window.location.reload();
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

test = (date) => {
  console.log(date)
  const dt = moment(date._d).subtract(6, 'days')
  console.log(dt);
}

render() { 
    return (
        <div style={{ height: "auto" }}>
          <h1 style={{ fontSize: 32 }}>Appointments</h1>
          <p>View and manage all detailers and respective appointments here.</p>
          <Divider />
          <div style={{ marginTop: 20, marginBottom: 20 }}>
          <Google onSuccess={this.responseGoogle} onFailure={this.responseGoogle} />
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
          <div className="dashboard-days-card" style={{ marginTop: 40, maxWidth: 1200 }}>
            {this.state.events.length > 0 ? <Collapsable days={this.state.events} /> : <p style={{ marginLeft: 300, marginTop: 300, fontSize: 16 }}>Nothing to see here :P</p>}
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


//<RangePicker onChange={this.handleChange} separator="|" size="default" />
export default Dashboard
