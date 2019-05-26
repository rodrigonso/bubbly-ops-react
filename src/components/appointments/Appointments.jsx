import React, { Component } from 'react';
import { css } from 'emotion'
import JobCard from '../jobCard/JobCard';
import { Divider, Typography, Spin, Icon, Skeleton, Button, Input, Tabs, Table, Pagination, Timeline, Badge, Tag, Modal, Form, Select, Radio, DatePicker, TimePicker, Collapse, notification, InputNumber } from 'antd';
import moment from 'moment'
import axios from 'axios'
import FilterBar from '../common/FilterBar';
import {
  PieChart, Pie, Cell, XAxis, YAxis, BarChart, Tooltip, Legend, Bar
} from 'recharts';
import NewJob from '../common/NewJob';
import PayrollModal from './PayrollModal';


const { TabPane } = Tabs
const { Text } = Typography
const { Option } = Select

export class Appointments extends Component {
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

handleEmployeeSelection = (e) => {
  const { range, selectedEmployee, employees } = this.state
  const employee = employees.filter(item => item._id === e.target.value)
  this.setState({ selectedEmployee: employee[0] })
}

// gets appointments for selected detailer
handleChange = async(date) => {
  const { range, selectedEmployee, employees } = this.state
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

handleModal = () => {
  const { range, selectedEmployee } = this.state
  notification.close("payroll")
  if (range.length > 0 && selectedEmployee) {
    this.setState({ isModalOpen: !this.state.isModalOpen })
  }
  else notification.error({ message: "Error", description: "Select the desired employee and period in order to run a new payroll." })
}

viewAll = () => {
  this.setState({ viewAll: true })
}

viewRecent = () => {
  this.setState({ viewAll: false })
}

getSelectedEmployee = () => {

}

getTotalHours = (jobs) => {
  if (jobs.length === 0) return 0;

  const washing = jobs.map(item => item.serviceType.duration)
  const driving = jobs.map(item => {
    const toDestination = item.distances.rows[1] ? parseInt(item.distances.rows[1].elements[1].duration.text) / 60 : 0
    const fromOrigin = parseInt(item.distances.rows[0].elements[0].duration.text) / 60

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
    const toDestination = item.distances.rows[1] ? parseInt(item.distances.rows[1].elements[1].distance.text) : 0
    const fromOrigin = parseInt(item.distances.rows[0].elements[0].distance.text)

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

  const test = [
    { name: "Amazing Detail", value: amazing.length },
    { name: "Superior Detail", value: superior.length },
    { name: "Bubbly Pro", value: pro.length },
    { name: "Bubbly Showroom", value: showroom.length },
  ]

  return test
}

getJobsByDay = (jobs) => {
  const days = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
  console.log(jobs)

  if (jobs.length > 0) {
    const jobsByDay =  days.map(day => {
      return { name: day, value: jobs.filter(job => moment(job.date).format("ddd") == day).length }
    }) 
    return jobsByDay
  }
  else return []
}

handlePayroll = async(data) => {
  const { selectedEmployee, range } = this.state
  const { totalWage, totalHours, totalTips, totalJobs } = data

  const payroll = {
    range: [moment(range[0]).format('l'), moment(range[1]).format('l')],
    employee: { name: selectedEmployee.name, email: selectedEmployee.email, username: selectedEmployee.username, wage: selectedEmployee.wage, _id: selectedEmployee._id },
    totalHours,
    totalTips,
    totalWage,
    totalJobs: totalJobs.length
  }

  const res = await axios.post(`${process.env.REACT_APP_BACKEND_API}/payrolls`, payroll)
  this.setState({ isModalOpen: false })
}

expandedRowRender = (job) => {
  return (
    <React.Fragment>
      <div style={{ display: "grid", gridTemplateColumns: "40% 20% 20% 20%" }} >
        <div>
          <Text style={{ fontSize: 12 }} type="secondary">Total</Text>
          <p style={{ fontSize: 16 }}  >${job.serviceType.price}</p>
        </div>
        <div>
          <Text style={{ fontSize: 12 }} type="secondary">Trip Time</Text>
          <p style={{ fontSize: 16 }}  >{job.distances.rows[0].elements[0].duration.text}</p>
        </div>
        <div>
          <Text style={{ fontSize: 12 }} type="secondary">Distance</Text>
          <p style={{ fontSize: 16 }}  >{job.distances.rows[0].elements[0].distance.text}</p>
        </div>
        <div>
          <Text style={{ fontSize: 12 }} type="secondary">Job Time</Text>
          <p style={{ fontSize: 16 }}  >{job.serviceType.duration} hrs</p>
        </div>
      </div>
      <Divider />
      <div style={{ display: "grid", gridTemplateColumns: "40% 40%" }}  >
        <Timeline>
          <Timeline.Item>
            <p>Origin</p>
            <p type="secondary" style={{ fontSize: 10, marginTop: -15, color: "rgba(0, 0, 0, 0.45)" }}>{job.distances.origin_addresses[0]}</p> 
          </Timeline.Item>
          <Timeline.Item>
            <p>Destination</p>
            <p type="secondary" style={{ fontSize: 10, marginTop: -15, color: "rgba(0, 0, 0, 0.45)" }}>{job.distances.destination_addresses[0]}</p> 
          </Timeline.Item>
        </Timeline>
        <div style={{ marginLeft: 150 }} >
          <Text type="secondary">Upgrades</Text>
          <div style={{ marginTop: 10 }} >
            {job.upgrades.map(item => <Tag style={{ marginBottom: 5 }}  color="blue">{item.name}</Tag> )}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
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

    if (jobs.length === 0) return <div style={{ textAlign: "center", marginTop: "50%" }}><Spin size="large" style={{ margin: "auto" }} indicator={<Icon type="loading" /> } /></div>

    return (
      <div style={{ height: "auto", marginBottom: 80, minWidth: 1000 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Dashboard</h1>
        <p>View and manage all detailers and respective appointments here.</p>
          <PayrollModal selectedEmployee={selectedEmployee} jobsByDate={jobsByDate} totalHours={totalHours} range={range} isModalOpen={isModalOpen} handleModal={this.handleModal} handlePayroll={this.handlePayroll} />
          <div className="dashboard-main-layout" style={{ display: "grid", gridTemplateColumns: "25% 75%" }} >
            <div className="dashboard-vitals" style={{ width: "18em", marginTop: "4.35em" }} >
             <Collapse style={{ marginBottom: 30 }} bordered={false} expandIcon={({ isActive }) => <Icon style={{ marginLeft: "6.2rem", marginTop: isActive ? "26rem" : "0.7rem" }} type="caret-down" rotate={isActive ? 180 : 0} />}>
                <div style={{ backgroundColor: "#fff", borderRadius: 5, padding: 15 }} >
                  <PieChart width={200} height={250} >
                    <Pie data={serviceTypes} dataKey="value" innerRadius={45} cx="35%" cy="45%"  >
                      {serviceTypes.map((entry, index) => <Cell key={index} fill={pieColors[index]} /> )}
                    </Pie>
                    <Tooltip />
                    <Legend align="left" iconSize={8} iconType="circle" />
                  </PieChart>
                  <Divider />
                </div>
                <div style={{backgroundColor: "#fff", marginTop: -25, padding: 15, display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: 5 }}>
                  <div>
                    <Text style={{ fontSize: 12 }} type="secondary">Total Jobs</Text>
                    <p style={{ fontSize: 16 }}  >{jobsByDate.length}</p>
                  </div>
                  <div>
                    <Text style={{ fontSize: 12 }} type="secondary">Total Revenue</Text>
                    <p style={{ fontSize: 16 }} >${totalRevenue}</p>
                  </div>
                </div>
                <Collapse.Panel style={{ border: 0 , marginTop: -40}} >
                  <Divider />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} >
                    <div>
                      <Text style={{ fontSize: 12 }} type="secondary">Job Average</Text>
                      <p style={{ fontSize: 16 }}  >${Math.floor(totalRevenue/jobsByDate.length)}</p>
                    </div>
                    <div>
                      <Text style={{ fontSize: 12 }} type="secondary">Average Distance</Text>
                      <p style={{ fontSize: 16 }} >{Math.floor(totalDriving/jobsByDate.length)} miles</p>
                    </div>
                  </div>
                  <Divider />
                  <Text style={{ fontSize: 12 }} type="secondary" >Services by Day</Text>
                  <BarChart width={270} height={170} data={jobsByDay} style={{ marginLeft: -50, fontSize: 14, marginTop: 5 }} >
                    <Tooltip />
                    <Bar dataKey="value" fill="#096dd9" barSize={15} />
                    <YAxis allowDecimals={false} />
                    <XAxis dataKey="name"  />
                  </BarChart>
                  <Divider />
                </Collapse.Panel> 
              </Collapse>
             <FilterBar handleChange={this.handleChange} employees={employees} selectedEmployee={selectedEmployee} onEmployeeChange={this.handleEmployeeSelection} />
            </div>
            <div style={{ marginLeft: 20 }} className="dashboard-days-card" >
              <Tabs  style={{ maxWidth: 650 }} tabBarExtraContent={<span><Button shape="round" type="ghost" >+ Job</Button><Button onClick={this.handleModal} style={{ marginLeft: 10 }} type="primary" shape="round">+ Payroll</Button></span> } >
                <TabPane key="1" tab="Recent Jobs" >
                  <div>
                    {jobsByDate.slice(0,5).map(job => {
                      return <JobCard key={job._id} job={job} isMobile={false} handleDelete={this.handleDelete} isLoading={isDeleting} />
                    })}
                  </div>
                </TabPane>
                <TabPane key="2" tab="All Jobs" >
                  <div>
                    <Table className={body} rowKey={(record) => record._id} expandedRowRender={(record) => this.expandedRowRender(record)} dataSource={jobsByDate} style={{ backgroundColor: "#fff", borderRadius: 5, padding: 15 }} pagination={{ defaultPageSize: 10 }}  >
                      <Table.Column key="date" dataIndex="date" style={{ borderRadius: 5}}  title={ <div style={{ fontWeight: 700 }}>Date</div> } />
                      <Table.Column key="time" dataIndex="start" style={{ borderRadius: 5}}  title={ <div style={{ fontWeight: 700 }}>Time</div> } />
                      <Table.Column key="name" dataIndex="summary" style={{ borderRadius: 5}}  title={ <div style={{ fontWeight: 700 }}>Name</div> } />
                      <Table.Column key="amount" render={(text, record, index) => <div>${record.serviceType.price}</div>} style={{ borderRadius: 5}}  title={ <div style={{ fontWeight: 700 }}>Amount</div> } />
                      <Table.Column key="actions" dataIndex="id" style={{ borderRadius: 5}} render={(text, record) => <Button shape="circle" onClick={() => this.handleDelete(record)} ><Icon type="delete" /></Button> } title={ <div style={{ fontWeight: 700 }}></div> } />
                    </Table>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
    )
  }
};

const pieColors = ["#1890ff", "#096dd9", "#0050b3", "#003a8c" ]

const body = css({
  backgroundColor: 'green',
  '& thead > tr > th': {
    backgroundColor: 'white'
  }
})

const divStyle = {
  maxWidth: 1400, 
  backgroundColor: "#fff", 
  padding: 20, 
  borderRadius: 4
}
export default Appointments
