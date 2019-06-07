import React, { Component } from 'react'
import JobCard from '../jobCard/JobCard';
import axios from 'axios'
import { Empty } from 'antd';

export class InProgress extends Component {
  state = {
    jobsInProgress: []
  }

  async componentDidMount() {
    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees`)
    const jobsInProgress = data.map(item => item.jobInProgress).filter(item => item != null)
  
    this.setState({ jobsInProgress })
  }

  render() {
    const { jobsInProgress } = this.state
    const { services } = this.props

    return (
      <div>
        {jobsInProgress.map((job, i) => {
          if (job.currentStep > 0) {
            return (
              <JobCard 
                progress
                i={i}
                job={job}
                isMobile={false}
                services={services}
              />
            )
          } else {
            return (
              <div style={{ backgroundColor: "#fff", padding: 15, borderRadius: 5 }}>
                <Empty />
              </div> 
            )
          }
        })}
      </div>
    )
  }
}

export default InProgress
