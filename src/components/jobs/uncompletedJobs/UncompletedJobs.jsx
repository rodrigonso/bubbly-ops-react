import React, { Component } from 'react'
import { Button, Icon } from 'antd';
import JobCard from '../../common/JobCard';
import axios from 'axios'


export class UncompletedJobs extends Component {
  state = {
      services: [],
      uncompletedJobs: [],
      isLoading: false
  }

  async componentDidMount() {
    this.setState({ user: this.props.user })
    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/services`)
    this.setState({ services: data })
  }

  componentDidUpdate(prevProps) {
		if (prevProps.uncompletedJobs !== this.props.uncompletedJobs) {
			this.setState({ uncompletedJobs: this.props.uncompletedJobs })
		} 
	}

  handleBegin = async(job) => {
    const { user } = this.props

    const jobInProgress = {
      currentStep: 0,
      jobData: job.jobData
    }

    try {
      this.setState({ isLoading: true })
      const { data } = await axios.put(`${process.env.REACT_APP_BACKEND_API}/employees/${user.employeeId}`, jobInProgress)
      this.props.history.push(`/jobs/${job.jobData.id}`)
    } catch (ex) {
      console.log(ex)
    } finally {
      this.setState({ isLoading: false })
    }
  } 

  render() {
    const { uncompletedJobs } = this.props
    const { isLoading } = this.state
    return (
    <div style={{ marginTop: 20, minWidth: 320 }} >
      <div style={{ display: "grid", gridTemplateColumns: "90% 10%", padding: 15, backgroundColor: "#fff", borderRadius: 5 }} >
        <div>
          <Icon style={{ fontSize: 18 }}  type="exception" />
          <h4 style={{ marginTop: 5, marginLeft: 10, display: "inline", fontWeight: 400 }} >Uncompleted Jobs</h4>
        </div>
      </div>
      <div style={{ marginTop: 2 }} >
          {uncompletedJobs.length > 0 ? uncompletedJobs.map((job, i) => {
            return (
              <JobCard key={i} i={i} job={job} isLoading={isLoading}  handleRefresh={this.props.handleRefresh} isMobile={true} handleBegin={this.handleBegin} />
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