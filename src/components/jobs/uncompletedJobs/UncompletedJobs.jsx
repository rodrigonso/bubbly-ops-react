import React, { Component } from 'react'
import { Collapse, Steps, Typography, Input, Button, Icon, Empty, Spin, Form, Select, Rate, message, Skeleton } from 'antd';
import JobCard from '../../jobCard/JobCard';
import axios from 'axios'

const { Step } = Steps;
const { Text } = Typography;
const { Option } = Select;

export class UncompletedJobs extends Component {
  state = {
      services: [],
  }

  async componentDidMount() {
    this.setState({ user: this.props.user })
    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/services`)
    this.setState({ services: data })
  }

  handleBegin = (job) => {
    localStorage.setItem("activeJob", JSON.stringify(job))
    this.props.history.push(`/jobs/${job.jobData.id}`)
  }

  render() {
      const { uncompletedJobs } = this.props
    return (
    <div style={{ marginTop: 20, minWidth: 320 }} >
      <div style={{ display: "grid", gridTemplateColumns: "90% 10%", padding: 15, backgroundColor: "#fff", borderRadius: 5 }} >
        <div>
          <Icon style={{ fontSize: 18 }}  type="exception" />
          <h4 style={{ marginTop: 5, marginLeft: 10, display: "inline", fontWeight: 400 }} >Uncompleted Jobs</h4>
        </div>
      </div>
      <div style={{ marginTop: 2 }} >
          {uncompletedJobs.length > 0 ? uncompletedJobs.map(job => {
            return (
              <JobCard job={job} isMobile={true} handleBegin={this.handleBegin} />
            )}
          ) : <div style={{ padding: 15, backgroundColor: "#fff", marginTop: 2, minHeight: 200 }} >
                <Button type="primary" onClick={this.props.handleRefresh} style={{ marginLeft: 100, marginTop: 50 }}><Icon type="reload" />Refresh</Button>
              </div>}
        </div>
      </div>
    )
  }
}

export default UncompletedJobs
//borderBottom: "2px solid #f7f7f7"
//<Button size="small" shape="circle" onClick={this.props.handleRefresh}  ><Icon type="sync" /></Button> 