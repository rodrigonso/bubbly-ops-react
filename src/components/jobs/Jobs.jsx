import React, { Component } from 'react'
import UncompletedJobs from './uncompletedJobs/UncompletedJobs';
import CompletedJobs from './completedJobs/CompletedJobs'
import UpcomingJobs from './upcomingJobs/UpcomingJobs'
import { Divider, PageHeader, notification, Spin, Icon } from 'antd';
import axios from 'axios';

export class Jobs extends Component {
	state = {
			completedJobs: [],
			uncompletedJobs: [],
			isLoading: false
	}

	async componentDidMount() {
		const { user } = this.props
		this.setState({ completedJobs: this.props.completedJobs, uncompletedJobs: this.props.uncompletedJobs })

		try {
			this.setState({ isLoading: true })
			const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees/${user.employeeId}`)
			const jobInProgress = data.jobInProgress ? data.jobInProgress : null
			console.log(data)
			
			if (!jobInProgress) return
			if (jobInProgress.currentStep !== 3) this.props.history.push(`/jobs/${jobInProgress.jobData.id}`)
		} catch(ex) {
			console.log(ex)
			notification.error(ex)
		} finally {
			this.setState({ isLoading: false })
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.completedJobs !== this.props.completedJobs) {
			this.setState({ completedJobs: this.props.completedJobs })
		} else if (prevProps.uncompletedJobs !== this.props.uncompletedJobs) {
			this.setState({ uncompletedJobs: this.props.uncompletedJobs })
		}
	}

  render() {
		const { uncompletedJobs, completedJobs, isGapiReady, user } = this.props
		const { isLoading } = this.state

    if (isLoading) return <div style={{ margin: "auto", marginTop: "40vh"}} ><Spin indicator={<Icon style={{ fontSize: 20 }} type="loading" /> } /></div>
    return (
			<div style={{ overflowX: "hidden", minWidth: "100%" }} >
				<h1 style={{ fontSize: 32, fontWeight: 700 }}>Your Jobs</h1>
				<p>Here you can find all your jobs scheduled for today.</p>
				<Divider />
				<CompletedJobs completedJobs={completedJobs} uncompletedJobs={uncompletedJobs} user={user} />
				<UncompletedJobs {...this.props} handleRefresh={this.props.handleRefresh} user={user} uncompletedJobs={uncompletedJobs} isGapiReady={isGapiReady} />
				<UpcomingJobs user={user} />
			</div>
    )
  }
}

export default Jobs
