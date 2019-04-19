import React, { Component } from 'react';
import JobCard from '../jobCard/JobCard';
import { Divider, Collapse, Spin, Icon } from 'antd';
import moment from 'moment'
import axios from 'axios'
import FilterBar from '../common/FilterBar';
import {
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


export class Appointments extends Component {
state = {
  jobs: [],
  employees: [],
  selectedEmployee: "",
  range: [],
  isDeleting: false,
  isLoading: false
}

async componentDidMount() {
  const employees = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees`)
  this.setState({ employees: employees.data })

  this.setState({ isLoading: true })

  try {
    const jobs = await axios.get(`${process.env.REACT_APP_BACKEND_API}/jobs/getAllJobs/`)
    this.setState({ jobs: jobs.data })
  } catch (ex) {
    console.log(ex)
  } finally {
    this.setState({ isLoading: false })
  }
}

handleEmployeeSelection = (e) => {
  this.setState({ selectedEmployee: e.target.value })
}

// gets appointments for selected detailer
handleChange = async(date) => {
  console.log(date)
  const start = moment(date[0]._d).format()
  const end = moment(date[1]._d).format()

  this.setState({ range: [start, end] })
}

handleDelete = async(job) => {
  try {
    this.setState({ isDeleting: true })
    const { data } = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/jobs/deleteJob/${job.employeeId}/${job._id}`)
    const jobs = [...this.state.jobs]
    const newJobs = jobs.filter(item => item._id !== job._id)
    this.setState({ jobs: newJobs })
  } catch (ex) {
    console.log(ex)
  } finally {
    this.setState({ isDeleting: false })
  }
}

render() {
  const { employees, isDeleting, isLoading, jobs, range, selectedEmployee } = this.state

  const jobsByEmployee = selectedEmployee ? jobs.filter(job => job.employeeId === this.state.selectedEmployee) : jobs
  const jobsByDate = range.length > 0 ? jobsByEmployee.filter(job => range[1] >= job.jobData.start.dateTime && range[0] <= job.jobData.start.dateTime) : jobsByEmployee

    return (
      <div style={{ height: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Appointments</h1>
        <p>View and manage all detailers and respective appointments here.</p>
        <Divider />
        <FilterBar handleChange={this.handleChange} employees={employees} selectedEmployee={selectedEmployee} onEmployeeChange={this.handleEmployeeSelection} />
        <div className="dashboard-days-card" style={{ marginTop: 20, maxWidth: 1200 }}>
         {!isLoading ? <Collapse bordered={false} style={{ backgroundColor: "#f7f7f7" }} >
            {jobsByDate.map(job => {
              if (!job) return null
              return <JobCard key={job._id} job={job} isMobile={false} handleDelete={this.handleDelete} isLoading={isDeleting} />
            })}
          </Collapse> : <Spin indicator={<Icon type="loading" /> } style={{ marginTop: "25%", marginLeft: "50%" }} />}
        </div>
      </div>
    )
  }
};

const divStyle = {
  marginTop: 10, 
  maxWidth: 1200, 
  backgroundColor: "#fff", 
  padding: 20, 
  borderRadius: 4
}



export default Appointments
