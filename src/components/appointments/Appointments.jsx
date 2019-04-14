import React, { Component } from 'react';
import JobCard from '../jobCard/JobCard';
import { Divider, Collapse } from 'antd';
import moment from 'moment'
import axios from 'axios'
import DataCard from './DataCard';
import FilterBar from '../common/FilterBar';


export class Appointments extends Component {
state = {
  jobs: [],
  employees: [],
  selectedEmployee: "",
  range: [],
  isDeleting: false
}

async componentDidMount() {
  const employees = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees`)
  this.setState({ employees: employees.data })

  const jobs = await axios.get(`${process.env.REACT_APP_BACKEND_API}/jobs/getAllJobs/`)
  this.setState({ jobs: jobs.data })
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
    this.setState({ isLoading: false })
    const { data } = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/jobs/deleteJob/${job.employeeId}/${job._id}`)
  } catch (ex) {
    console.log(ex)
  } finally {
    this.setState({ isLoading: false })
  }
}

render() {
  const { employees, isLoading, jobs, range, selectedEmployee } = this.state
  const jobsByEmployee = selectedEmployee ? jobs.filter(job => job.employeeId === this.state.selectedEmployee) : jobs
  const jobsByDate = range.length > 0 ? jobsByEmployee.filter(job => range[1] >= job.jobData.start.dateTime && range[0] <= job.jobData.start.dateTime) : jobsByEmployee

    return (
      <div style={{ height: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Appointments</h1>
        <p>View and manage all detailers and respective appointments here.</p>
        <Divider />
        <div style={{ marginTop: 20, marginBottom: 20 }}>
        </div>
        <FilterBar handleChange={this.handleChange} employees={employees} selectedEmployee={selectedEmployee} onEmployeeChange={this.handleEmployeeSelection} />
        <div className="dashboard-days-card" style={{ marginTop: 20, maxWidth: 1200 }}>
          <Collapse bordered={false} style={{ backgroundColor: "#f7f7f7" }} >
            {jobsByDate.map(job => {
              if (!job) return null
              return <JobCard key={job._id} job={job} isMobile={false} handleDelete={this.handleDelete} isLoading={isLoading} />
            })}
          </Collapse>
        </div>
      </div>
    )
  }
};



export default Appointments
