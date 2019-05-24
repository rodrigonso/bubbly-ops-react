import React, { Component } from 'react'
import { Divider, Button, Statistic, Typography } from 'antd';
import { Chart, Tooltip, Axis, Bar } from 'viser-react'
import axios from 'axios'
import moment from 'moment'

const { Text } = Typography

class Earnings extends Component {

	state = {
		user: {},
		jobs: [],
		jobsByDay: [],
		totalEarned: 0
	}

	componentDidMount() {
		const jobs = this.getJobs()
		this.setState({ jobs })
	}

	componentDidUpdate(prevProps) {
		if (prevProps.user !== this.props.user) {
			const jobs = this.getJobs()
			this.setState({ jobs })
		} 
	}


	getJobs = async() => {
		if (!this.props.user.employeeId) return null

		const res = await axios.get(`${process.env.REACT_APP_BACKEND_API}/jobs/getJobs/${this.props.user.employeeId}`)
		console.log(res.data)
		this.setState({ jobs: res.data })
	}


	getJobType = async() => {
		const { jobs } = this.state
		
		const amazing = jobs.filter(item => item.serviceType.name === "Amazing Detail")
		const superior = jobs.filter(item => item.serviceType.name === "Superior Detail")

		const test = [
			{ name: "Amazing Detail", value: amazing.length },
			{ name: "Superior Detail", value: superior.length }
		]

		console.log(test)
		this.setState({ data: test })
		return test
	}

	getJobsByDay = () => {
		const { jobs } = this.state
		const days = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]

		if (jobs.length > 0) {
			const jobsByDay =  days.map(day => {
				return { name: day, value: jobs.filter(job => moment(job.date).format("ddd") == day).length }
			}) 
			return jobsByDay
		}
		else return []
	}

	getTotalEarned = () => {
		const { jobs } = this.state
		if (jobs.length > 0) {
			const washing = jobs.map(job => job.serviceType.duration)
			const totalWashing = washing.reduce((a, b) => a + b) * 10

			const driving = jobs.map(job =>  job.distances.rows.length > 1 ? parseInt(job.distances.rows[0].elements[0].duration.text) : 0)
			const drivingBack = jobs.map(job =>  job.distances.rows.length === 2 ? parseInt(job.distances.rows[1].elements[1].duration.text) : 0)

			const totalDriving = ((driving.reduce((a, b) => a + b) / 60) * 10) + ((drivingBack.reduce((a, b) => a + b) / 60) * 10)
			const totalEarned = totalDriving + totalWashing
			return Math.round(totalEarned)
		}
		else return 0
	}

  render() {
		console.log(this.props.user)
    return (
			<div className="home-body" style={{ overflowX: "hidden", overflowY: "auto" }} >
			<h1 style={{ fontSize: 32, fontWeight: 700 }}>Earnings</h1>
			<p>Here you can find a full report of all of your earnings.</p>
			<Divider />
			<div style={{ backgroundColor: "#fff", padding: 15, borderRadius: 5 }} >
				<Text type="secondary">Services by Day</Text>
				<div style={{ marginLeft: -45 }}>
					<Chart width={340} height={300} data={this.getJobsByDay()} scale={scale} >
						<Tooltip />
						<Axis />
						<Bar position="name*value" />
					</Chart>
				</div>
			</div>
			<div style={{ backgroundColor: "#fff", padding: 24, borderRadius: 5, margin: "auto", marginTop: 10 }} >
				<h4>Total Earned</h4>
				<Statistic value={this.getTotalEarned()} prefix="$" /> 
			</div>
		</div>
    )
  }
}

export default Earnings

const scale = [{
	dataKey: 'value',
	tickInterval: 1
}]