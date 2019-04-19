import React, { Component } from 'react'
import { Collapse, Steps, Typography, Input, Button, Icon, Empty, Spin, Form, Select, Rate, message } from 'antd';
import JobCard from '../jobCard/JobCard';
import axios from 'axios'

const { Step } = Steps;
const { Text } = Typography;
const { Option } = Select;

export class CurrentJobs extends Component {
    state = {
        services: [],
        isLoading: false,
    }

    async componentDidMount() {
      this.setState({ user: this.props.user })
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/services`)
      this.setState({ services: data })
    }

  render() {
      const { uncompletedJobs } = this.props
    return (
    <div style={{ marginTop: 80, minWidth: 330 }} >
      <div style={{ display: "grid", gridTemplateColumns: "90% 10%", backgroundColor: "#fff", padding: 15, borderRadius: 5, marginBottom: 2 }} >
        <h4>Current jobs</h4>
        <Button size="small" shape="circle" onClick={this.props.handleRefresh}  ><Icon type="sync" /></Button>  
      </div>
          {uncompletedJobs.length > 0 ? uncompletedJobs.map(job => {
            return (
              <JobCard job={job} isMobile={true} />
            )}
          ) : null}
      </div>
    )
  }
}

export default CurrentJobs
//borderBottom: "2px solid #f7f7f7",