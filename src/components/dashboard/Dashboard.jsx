import React, { Component } from 'react';
import JobCard from '../jobCard/JobCard';
import { Spin, Icon, Button, Tabs, notification } from 'antd';
import moment from 'moment'
import axios from 'axios'
import FilterBar from '../common/FilterBar';
import PayrollModal from './PayrollModal';
import JobsTable from './JobsTable';
import Metrics from './Metrics';

const { TabPane } = Tabs

export class Dashboard extends Component {
state = {
  jobs: [],
  employees: [],
  selectedEmployee: "",
  range: [],
  isDeleting: false,
  isLoading: false,
  viewAll: false,
  isModalOpen: false
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


//------ Getter methods --------//
getTotalHours = (jobs) => {
  if (jobs.length === 0) return 0;

  const washing = jobs.map(item => item.serviceType.duration)
  const driving = jobs.map(item => {
    const toDestination = item.distances.rows[1] ? parseInt(item.distances.rows[1].elements[1].duration.text) / 60 : 0
    const fromOrigin = item.distances.rows[0]? parseInt(item.distances.rows[0].elements[0].duration.text) / 60 : 0

    if (toDestination.length > 0) return toDestination + fromOrigin
    else return fromOrigin
  })
  return Math.floor((washing.reduce((a, b) => a + b) + driving.reduce((a, b) => a + b)))
}

getTotalRevenue = (jobs) => {
  if (jobs.length === 0) return 0

  const services = jobs.map(item => item.serviceType.price)
  const upgrades = jobs.map(item => item.upgrades.map(upgrade => upgrade.price)).flat()

  if (upgrades.length > 0) return services.reduce((a, b) => a + b) + upgrades.reduce((a, b) => a + b)
  else return services.reduce((a, b) => a + b)
}

getTotalMiles = (jobs) => {
  if (jobs.length === 0) return 0 

  const driving = jobs.map(item => {
    if (item.distances.error_message) return 0
    const toDestination = item.distances.rows[1] ? parseInt(item.distances.rows[1].elements[1].distance.text) : 0
    const fromOrigin = item.distances.rows[0] ? parseInt(item.distances.rows[0].elements[0].distance.text) : 0

    if (toDestination.length > 0) return toDestination + fromOrigin
    else return fromOrigin
  })

  return driving.reduce((a, b) => a + b)
}

getServiceTypes = (jobs) => {
  const amazing = jobs.filter(item => item.serviceType.name === "Amazing Detail")
  const superior = jobs.filter(item => item.serviceType.name === "Superior Detail")
  const pro = jobs.filter(item => item.serviceType.name === "Bubbly Pro")
  const showroom = jobs.filter(item => item.serviceType.name === "Bubbly Showroom")

  const services = [
    { name: "Amazing Detail", value: amazing.length },
    { name: "Superior Detail", value: superior.length },
    { name: "Bubbly Pro", value: pro.length },
    { name: "Bubbly Showroom", value: showroom.length },
  ]

  return services
}

getJobsByDay = (jobs) => {
  const days = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]

  if (jobs.length > 0) {
    const jobsByDay =  days.map(day => {
      return { name: day, value: jobs.filter(job => moment(job.date).format("ddd") == day).length }
    }) 
    return jobsByDay
  }
  else return []
}

//------ handler methods --------//
handlePayroll = async(data) => {
  const { selectedEmployee, range } = this.state
  const { totalWage, totalHours, totalTips, totalJobs } = data

  console.log(totalJobs)

  const period = [moment(range[0]).format('l'), moment(range[1]).format('l')]

  const payroll = {
    range: period,
    employee: { name: selectedEmployee.name, email: selectedEmployee.email, username: selectedEmployee.username, wage: selectedEmployee.wage, _id: selectedEmployee._id },
    totalHours,
    totalTips,
    totalWage,
    totalJobs
  }

  const msg = {
    to: selectedEmployee.email,
    range: period,
    totalWage,
    totalTips,
    totalHours,
    name: selectedEmployee.name,
    totalJobs
  }

  const res = await axios.post(`${process.env.REACT_APP_BACKEND_API}/payrolls`, payroll)
  const email = await axios.post(`${process.env.REACT_APP_BACKEND_API}/sendGrid/payrollDone`, msg)
  console.log(email)
  this.setState({ isModalOpen: false })
}

handleEmployeeSelection = (e) => {
  const { employees } = this.state
  const employee = employees.filter(item => item._id === e.target.value)
  this.setState({ selectedEmployee: employee[0] })
}

handleChange = async(date) => {
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

handleModal = () => {
  const { range, selectedEmployee } = this.state
  notification.close("payroll")
  if (range.length > 0 && selectedEmployee) {
    this.setState({ isModalOpen: !this.state.isModalOpen })
  }
  else notification.error({ message: "Error", description: "Select the desired employee and period in order to run a new payroll." })
}

render() {
  const { employees, isDeleting, isLoading, jobs, range, selectedEmployee, isModalOpen } = this.state
  const jobsByEmployee = selectedEmployee ? jobs.filter(job => job.employeeId === selectedEmployee._id) : jobs
  const jobsByDate = range.length > 0 ? jobsByEmployee.filter(job => range[1] >= job.jobData.start.dateTime && range[0] <= job.jobData.start.dateTime) : jobsByEmployee
  const totalHours = this.getTotalHours(jobsByDate)
  const totalRevenue = this.getTotalRevenue(jobsByDate)
  const serviceTypes = this.getServiceTypes(jobsByDate)
  const jobsByDay = this.getJobsByDay(jobsByDate)
  const totalDriving = this.getTotalMiles(jobsByDate)
  console.log(totalDriving)

    if (jobs.length === 0) return (
      <div style={{ textAlign: "center", marginTop: "50%" }}>
        <Spin size="large" style={{ margin: "auto" }} indicator={<Icon type="loading" /> } />
      </div>
    ) 

    return (
      <div style={{ height: "auto", marginBottom: 80, minWidth: 1000 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Dashboard</h1>
        <p>View and manage all detailers and respective appointments here.</p>
        <PayrollModal 
          selectedEmployee={selectedEmployee} 
          jobsByDate={jobsByDate} 
          totalHours={totalHours} 
          range={range} 
          isModalOpen={isModalOpen} 
          handleModal={this.handleModal} 
          handlePayroll={this.handlePayroll} 
        />
        <div className="dashboard-main" style={{ display: "grid", gridTemplateColumns: "25% 75%" }} >
          <div className="dashboard-left-panel" style={{ width: "18em", marginTop: "4.35em" }} >
            <Metrics 
              jobs={jobs} 
              jobsByDate={jobsByDate} 
              totalRevenue={totalRevenue} 
              totalDriving={totalDriving} 
              jobsByDay={jobsByDay} 
              serviceTypes={serviceTypes}
            />
            <FilterBar 
              handleChange={this.handleChange} 
              employees={employees} 
              selectedEmployee={selectedEmployee} 
              onEmployeeChange={this.handleEmployeeSelection} 
            />
          </div>
          <div style={{ marginLeft: 20 }} className="dashboard-right-panel" >
            <Tabs  
              style={{ maxWidth: 650 }} 
              tabBarExtraContent={
                (
                  <div>
                    <Button shape="round" type="ghost" >+ Job</Button>
                    <Button onClick={this.handleModal} style={{ marginLeft: 10 }} type="primary" shape="round">+ Payroll</Button>
                  </div> 
                )
              } 
              >
              <TabPane key="1" tab="Recent Jobs" >
                {jobsByDate.slice(0,5).map(job => {
                  return (
                    <JobCard 
                      key={job._id} 
                      job={job} 
                      isMobile={false} 
                      handleDelete={this.handleDelete} 
                      isLoading={isDeleting} 
                    />
                  ) 
                })}
              </TabPane>
              <TabPane key="2" tab="All Jobs" >
                <JobsTable data={jobsByDate} handleDelete={this.handleDelete}  />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard
