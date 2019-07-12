import React, { Component } from 'react'
import JobCard from '../common/JobCard';
import axios from 'axios'
import { Empty, Typography } from 'antd';
import moment from 'moment'

const { Text } = Typography

export class InProgress extends Component {
  state = {
    jobsInProgress: [],
    isLoading: false,
    lastUpdated: new Date()
  }

  async componentDidMount() {
    this.getJobsInProgress()
  }

  getJobsInProgress = async() => {
    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees`)
    const jobsInProgress = data.map(item => item.jobInProgress).filter(item => item != null)
    console.log(jobsInProgress)
    this.setState({ jobsInProgress })
    this.autoUpdate()
  }

  autoUpdate = () => {
    setInterval(async() => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees`)
        const jobsInProgress = data.map(item => item.jobInProgress).filter(item => item != null)
        this.setState({ jobsInProgress, lastUpdated: new Date() })
      } catch (ex) {
        console.log(ex)
      } finally {
      }
    }, 60000)
  }

  render() {
    const { jobsInProgress, lastUpdated } = this.state
    const { services, employees } = this.props

    if (jobsInProgress.length === 0) {
      return (
        <div style={{ backgroundColor: "#fff", padding: 15, borderRadius: 5 }}>
          <Empty />
        </div> 
      )
    }

    return (
      <div>
        {jobsInProgress.map((job, i) => {
          if (job.currentStep === 0) {
            return (
              <div style={{ backgroundColor: "#fff", padding: 15, borderRadius: 5, marginBottom: 10 }}>
                 <Empty />
              </div> 
            )
          } else {
            return (
              <div>
                <JobCard 
                  progress
                  i={i}
                  job={job}
                  isMobile={false}
                  services={services}
                  employees={employees}
                />
              </div>
            )
          }
        })}
        <Text style={{ marginLeft: "40%", fontSize: 12 }} type="secondary">Last updated {moment(lastUpdated).format("LT")}</Text>
      </div>
    )
  }
}

export default InProgress
