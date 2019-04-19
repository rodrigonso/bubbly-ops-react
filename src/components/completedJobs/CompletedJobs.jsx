import React, { Component } from 'react'
import JobCard from '../jobCard/JobCard'
import { Empty, Icon, Button } from 'antd'

export class CompletedJobs extends Component {

    formatSummary = (job) => {
        if (!job.jobData.summary) return "not found"
        const regex = /[^0-9]/g;
        const summary = job.jobData.summary.match(regex);
        
        return summary;
    }
      
  render() {
      const { completedJobs } = this.props
    return (
        <React.Fragment>
            <div style={{ display: "grid", gridTemplateColumns: "90% 10%", backgroundColor: "#fff", padding: 15, borderRadius: 5, marginBottom: 2 }} >
                <h4>Completed Jobs</h4>
            </div> 
            <div style={{ width: "100%", padding: 24, margin: "auto", backgroundColor: "#fff", borderRadius: 5 }} >
                {completedJobs.length > 0 ? completedJobs.map(job => {
                    return (
                        <div style={{ display: "grid", gridTemplateColumns: "90% 10%" }} >
                            <p>{this.formatSummary(job)}</p>
                            <Icon type="check" />
                        </div>
                    )
                }) : <Empty description="No jobs completed yet :(" />}
                {completedJobs.length > 0 ? <Button style={{ width: "100%" }}  type="danger">Finish Day</Button> : null} 
            </div>
        </React.Fragment>
    )
  }
}

export default CompletedJobs
