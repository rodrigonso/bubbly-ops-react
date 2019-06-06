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

    if (jobsInProgress.length === 0 || jobsInProgress.currrentStep === 0) {
      return (
        <div style={{ backgroundColor: "#fff", padding: 15, borderRadius: 5 }}>
          <Empty />
        </div> 
      )
    }

    return (
      <div>
        {jobsInProgress.slice(0,2).map((job, i) => {
          return (
            <JobCard 
              progress
              i={i}
              job={job}
              isMobile={false}
              services={services}
            />
          )
        })}
      </div>
    )
  }
}

export default InProgress
