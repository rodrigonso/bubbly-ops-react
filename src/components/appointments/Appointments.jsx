import React, { Component } from 'react';
import { getEventsById, handleGoogleUser } from '../../services/eventsService';
import Weekday from '../weekday/Weekday';
import JobCard from '../jobCard/JobCard';
import { Divider, DatePicker, Radio, Collapse, Row, Col, Statistic, Card, message, Button, Skeleton, Tooltip } from 'antd';
import moment from 'moment'
import axios from 'axios'
import DataCard from './DataCard';
import { userInfo } from 'os';

const { WeekPicker } = DatePicker

export class Appointments extends Component {
state = {
  jobs: [],
  employees: [],
}

async componentDidMount() {
  this.setState({ jobs: this.props.jobs })
  const employees = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees`)
  this.setState({ employees: employees.data })

  const jobs = await axios.get(`${process.env.REACT_APP_BACKEND_API}/jobs/getJobs/${this.props.user.employeeId}`)
  this.setState({ jobs: jobs.data })
}

getRevenue = () => {
  const { jobs } = this.state
  if (jobs.length > 0) {
    const prices = jobs.map(job => job.serviceType.price)
    return prices.reduce((a, b) => a + b)
  }
  else return 0
}

// handles detailer selection
toggleDetailer = async(e) => {
  const selectedDetailer = e.target.value;

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
    if (this.props.user.isAdmin) this.setState({ isDetailerBtn: true })
  }
}

render() {
  const { user, jobs } = this.props
  const { employees, revenue } = this.state
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
          <Radio.Group size="medium" style={{ marginLeft: 20 }} buttonStyle="outline"  >
            {employees.map((employee, i) => {
              return <Radio.Button key={i} onChange={(e) => this.toggleDetailer(e)} >{employee.name}</Radio.Button>
            })}
          </Radio.Group>
        </div>
        <DataCard isAdmin={user.isAdmin} jobs={jobs} />
        <div className="dashboard-days-card" style={{ marginTop: 20, maxWidth: 1200 }}>
          <Collapse bordered={false} style={{ backgroundColor: "#f7f7f7" }} >
            {this.state.jobs ? this.state.jobs.map(job => <JobCard job={job} isMobile={false} />) : null}
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
