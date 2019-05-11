import React, { Component } from 'react';
import JobCard from '../jobCard/JobCard';
import { Divider, Typography, Spin, Icon, Skeleton, Button, Carousel, Tabs, Table, Pagination, Timeline, Badge, Tag } from 'antd';
import moment from 'moment'
import axios from 'axios'
import FilterBar from '../common/FilterBar';
import {
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


const { TabPane } = Tabs
const { Text } = Typography

export class Appointments extends Component {
state = {
  jobs: [],
  employees: [],
  selectedEmployee: "",
  range: [],
  isDeleting: false,
  isLoading: false,
  viewAll: false
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

viewAll = () => {
  this.setState({ viewAll: true })
}

viewRecent = () => {
  this.setState({ viewAll: false })
}

getTotalHours = (jobs) => {
  if (jobs.length === 0) return 0;

  const washing = jobs.map(item => item.serviceType.duration)
  const driving = jobs.map(item => {
    const toDestination = parseInt(item.distances.rows[1].elements[1].duration.text) / 60
    const fromOrigin = parseInt(item.distances.rows[0].elements[0].duration.text) / 60

    if (toDestination) return toDestination + fromOrigin
    else return fromOrigin

  })
  return Math.floor((washing.reduce((a, b) => a + b) + driving.reduce((a, b) => a + b)))
}

getTotalRevenue = (jobs) => {
  if (jobs.length === 0) return 0

  const services = jobs.map(item => item.serviceType.price)
  const upgrades = jobs.map(item => item.upgrades.map(upgrade => upgrade.price)).flat()

  return services.reduce((a, b) => a + b) + upgrades.reduce((a, b) => a + b)
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
  const { employees, isDeleting, isLoading, jobs, range, selectedEmployee, viewAll } = this.state

  const  maxJobs = jobs.slice(0,5)
  const jobsByEmployee = selectedEmployee ? maxJobs.filter(job => job.employeeId === this.state.selectedEmployee) : jobs
  const jobsByDate = range.length > 0 ? jobsByEmployee.filter(job => range[1] >= job.jobData.start.dateTime && range[0] <= job.jobData.start.dateTime) : jobsByEmployee
  const totalHours = this.getTotalHours(jobsByDate)
  const totalRevenue = this.getTotalRevenue(jobsByDate)

    return (
      <div style={{ height: "auto", marginBottom: 80, minWidth: 1000 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Dashboard</h1>
        <p>View and manage all detailers and respective appointments here.</p>
          <div style={{ display: "grid", gridTemplateColumns: "27% 73%" }} >
            <div style={{ width: "18em", marginTop: "4.35em" }} >
              <div style={{ backgroundColor: "#fff", borderRadius: 5, padding: 15, marginBottom: 10, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <Text style={{ fontSize: 12 }} type="secondary">Total Time</Text>
                  <p style={{ fontSize: 16 }}  >{totalHours} hrs</p>
                </div>
                <div>
                  <Text style={{ fontSize: 12 }} type="secondary">Total Revenue</Text>
                  <p style={{ fontSize: 16 }} >${totalRevenue}</p>
                </div>
              </div> 
              <FilterBar handleChange={this.handleChange} employees={employees} selectedEmployee={selectedEmployee} onEmployeeChange={this.handleEmployeeSelection} />
            </div>
            <div style={{ marginLeft: 20 }} className="dashboard-days-card" >
              <Tabs tabBarStyle={{ textAlign: "right" }} style={{ maxWidth: 600 }}>
                <TabPane key="1" tab="Recent Jobs" >
                  <div>
                    {jobsByDate.map(job => {
                      return <JobCard key={job._id} job={job} isMobile={false} handleDelete={this.handleDelete} isLoading={isDeleting} />
                    })}
                  </div>
                </TabPane>
                <TabPane key="2" tab="All Jobs" >
                  <div>
                    <Table rowKey={(record) => record._id} expandedRowRender={(record) => this.expandedRowRender(record)} dataSource={jobsByDate} style={{ backgroundColor: "#fff", borderRadius: 5 }} pagination={{ defaultPageSize: 10 }}  >
                      <Table.Column key="date" dataIndex="date" style={{ borderRadius: 5}}  title={ <div style={{ fontWeight: 700 }}>Date</div> } />
                      <Table.Column key="time" dataIndex="start" style={{ borderRadius: 5}}  title={ <div style={{ fontWeight: 700 }}>Time</div> } />
                      <Table.Column key="name" dataIndex="summary" style={{ borderRadius: 5}}  title={ <div style={{ fontWeight: 700 }}>Name</div> } />
                      <Table.Column key="amount" dataIndex="serviceType.price" style={{ borderRadius: 5}}  title={ <div style={{ fontWeight: 700 }}>Amount</div> } />
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

const divStyle = {
  maxWidth: 1400, 
  backgroundColor: "#fff", 
  padding: 20, 
  borderRadius: 4
}
export default Appointments
