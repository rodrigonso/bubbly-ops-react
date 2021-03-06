import React, { Component } from 'react';
import { Button, Tabs, notification } from 'antd';
import moment from 'moment'
import axios from 'axios'
import FilterBar from '../common/FilterBar';
import NewPayroll from './NewPayroll';
import JobsTable from './JobsTable';
import Metrics from './Metrics';
import EditJob from './EditJob';
import RecentJobs from './RecentJobs';
import InProgress from './InProgress';
import Spinner from '../common/Spinner';
import NewJob from '../common/NewJob';

const { TabPane } = Tabs

export class Dashboard extends Component {
state = {
  jobs: [],
  employees: [],
  serivces: [],
  selectedEmployee: "",
  search: "",
  range: [],
  isDeleting: false,
  isLoading: false,
  isPayrollOpen: false,
  isPayrollLoading: false,
  isNewJobOpen: false
}

// lifecycle hooks
async componentDidMount() {
  const employees = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees`)
  const services = await axios.get(`${process.env.REACT_APP_BACKEND_API}/services`)
  this.setState({ employees: employees.data, services: services.data })

  this.setState({ isLoading: true })

  try {
    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/jobs`)
    this.setState({ jobs: data })
  } catch (ex) {
    console.log(ex)
  } finally {
    this.setState({ isLoading: false })
  }
}


// getters
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
      return { name: day, value: jobs.filter(job => moment(job.date).format("ddd") === day).length }
    }) 
    return jobsByDay
  }
  else return []
}

// event handlers
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

  try {
    this.setState({ isPayrollLoading: false })

    axios.post(`${process.env.REACT_APP_BACKEND_API}/payrolls`, payroll)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
    
    axios.post(`${process.env.REACT_APP_BACKEND_API}/sendGrid/payrollDone`, msg)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  
    this.setState({ isModalOpen: false })
  } catch (ex) {
    console.log(ex)
  } finally {
    this.setState({ isPayrollLoading: false })
  }
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

handleSearch = (e) => {
  this.setState({ search: e.target.value })
}

handleDelete = (job) => {
  console.log("Deleting...")
  const jobs = [...this.state.jobs]
  const newJobs = jobs.filter(item => item._id !== job._id)
  this.setState({ jobs: newJobs })
}

handleJobEdit = async(job) => {
  const { jobs } = this.state
  const filter = jobs.filter(item => item._id === job._id).flat()
  const index = jobs.indexOf(filter[0])

  jobs[index] = job
  console.log(job)
  this.setState({ jobs })
}

handleNewJob = (job) => {
  const { jobs } = this.state
  jobs.unshift(job)
  this.setState({ isNewJobOpen: false })
  this.setState({ jobs })
}

handleModal = () => {
  const { range, selectedEmployee } = this.state
  notification.close("payroll")
  if (range.length > 0 && selectedEmployee) {
    this.setState({ isPayrollOpen: !this.state.isPayrollOpen })
  }
  else notification.error({ message: "Error", description: "Select the desired employee and period in order to run a new payroll." })
}

handleModal2 = () => {
  this.setState({ isNewJobOpen: !this.state.isNewJobOpen })
}

render() {
  const { employees, services, isNewJobOpen, isPayrollLoading, jobs, range, selectedEmployee, isPayrollOpen, isDeleting, search } = this.state

  const jobsByEmployee = selectedEmployee ? jobs.filter(job => job.employeeId === selectedEmployee._id) : jobs
  const jobsByDate = range.length > 0 ? jobsByEmployee.filter(job => range[1] >= job.jobData.start.dateTime && range[0] <= job.jobData.start.dateTime) : jobsByEmployee
  const jobsBySearch = search ? jobsByDate.filter(job => {
    const lowerCase = job.summary.toLowerCase()
    return lowerCase.indexOf(search.toLowerCase()) !== -1  
  }) : jobsByDate 
  
  const totalHours = this.getTotalHours(jobsByDate)
  const totalRevenue = this.getTotalRevenue(jobsByDate)
  const serviceTypes = this.getServiceTypes(jobsByDate)
  const jobsByDay = this.getJobsByDay(jobsByDate)
  const totalDriving = this.getTotalMiles(jobsByDate)
  console.log(totalDriving)

    if (jobs.length === 0) return <Spinner />
    return (
      <div style={{ height: "auto", marginBottom: 80, minWidth: 1200 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Dashboard</h1>
        <p>View and manage all detailers and respective appointments here.</p>
        <NewJob
          isVisible={isNewJobOpen}
          services={services}
          employees={employees}
          handleNewJob={this.handleNewJob}
          handleModal2={this.handleModal2}
        />
        <NewPayroll 
          selectedEmployee={selectedEmployee} 
          jobs={jobsBySearch} 
          totalHours={totalHours} 
          range={range} 
          isPayrollOpen={isPayrollOpen} 
          handleModal={this.handleModal} 
          handlePayroll={this.handlePayroll}
          loading={isPayrollLoading} 
        />
        <div className="dashboard-main" style={{ display: "grid", gridTemplateColumns: "21% 79%" }} >
          <div className="dashboard-left-panel" style={{ width: "18em", marginTop: "4.35em" }} >
            <Metrics 
              jobs={jobs} 
              jobsBySearch={jobsBySearch} 
              totalRevenue={totalRevenue} 
              totalDriving={totalDriving} 
              jobsByDay={jobsByDay} 
              serviceTypes={serviceTypes}
            />
            <FilterBar 
              value={search} 
              handleChange={this.handleChange} 
              employees={employees} 
              selectedEmployee={selectedEmployee} 
              onEmployeeChange={this.handleEmployeeSelection} 
              handleSearch={this.handleSearch}
            />
          </div>
          <div style={{ marginLeft: 20 }} className="dashboard-right-panel" >
            <Tabs  
              style={{ maxWidth: 750 }} 
              tabBarExtraContent={
                (
                  <div>
                    <Button onClick={this.handleModal2} shape="round" type="ghost" >+ Job</Button>
                    <Button onClick={this.handleModal} style={{ marginLeft: 10 }} type="primary" shape="round">+ Payroll</Button>
                  </div> 
                )
              } 
              defaultActiveKey="1"
              >
                <TabPane key="0" tab="In Progress">
                  <InProgress 
                    jobs={jobsBySearch}
                    employees={employees}
                  />
                </TabPane> 
                <TabPane key="1" tab="Recent Jobs" >
                  <RecentJobs
                    jobs={jobsBySearch} 
                    services={services}
                    employees={employees} 
                    handleDelete={this.handleDelete} 
                    handleJobEdit={this.handleJobEdit}
                  />
                </TabPane>
                <TabPane key="2" tab="All Jobs" >
                  <JobsTable 
                    jobs={jobsBySearch} 
                    employees={employees} 
                    handleDelete={this.handleDelete} 
                    handleJobEdit={this.handleJobEdit}
                  />
                </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard
