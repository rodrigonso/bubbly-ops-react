import React, { Component } from 'react'
import { getDistances } from '../../services/eventsService'
import { Empty, Icon, Button, Modal } from 'antd'
import Axios from 'axios';

export class CompletedJobs extends Component {
    state = {
        isLoading: false,
    }

    componentDidUpdate(prevProps) {
        if (prevProps.completedJobs !== this.props.completedJobs) {
            this.setState({ completedJobs: this.props.completedJobs })
        }
      }


    formatSummary = (job) => {
        if (!job.jobData.summary) return "not found"
        const regex = /[^0-9]/g;
        const summary = job.jobData.summary.match(regex);
        
        return summary;
    }

    handleCompletion = async() => {
        try {
            this.setState({ isLoading: true })
            const jobsWithDistances = this.props.completedJobs.map(async(job, i) => await getDistances(job, i, this.props.completedJobs))
            const jobs = await Promise.all(jobsWithDistances)
    
            console.log(jobs)
    
            const res = jobs.map(async(item) => {
                const response = await Axios.post(`${process.env.REACT_APP_BACKEND_API}/jobs/saveJob/${this.props.user.employeeId}`, item)
                return response
            })
            const final = await Promise.all(res)
            console.log(final)
        } catch (ex) {
            console.log(ex)
        } finally {
            this.setState({ isLoading: false })
            Modal.success({ title: "Success!", content: "Your jobs have been saved to the database!" })
        }
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
                {completedJobs.length > 0 ? <Button loading={this.state.isLoading} onClick={this.handleCompletion} style={{ width: "100%" }}  type="danger">Finish Day</Button> : null} 
            </div>
        </React.Fragment>
    )
  }
}

export default CompletedJobs
