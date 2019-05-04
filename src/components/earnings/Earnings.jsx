import React, { Component } from 'react'
import { Divider, Button, Statistic } from 'antd';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, YAxis } from 'recharts'
import axios from 'axios'
import moment from 'moment'

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
				return { name: day, value: jobs.filter(job => moment(job.jobData.start.dateTime).format("ddd") == day).length }
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
			<div style={{ backgroundColor: "#fff", padding: 24, borderRadius: 5, margin: "auto" }} >
				<h4>Services by Day</h4>
				<BarChart width={280} height={140} data={this.getJobsByDay()} style={{ marginLeft: -25 }} >
					<Tooltip />
					<Bar dataKey="value" fill="#096dd9" barSize={20} />
					<YAxis allowDecimals={false} />
					<XAxis dataKey="name"  />
				</BarChart>
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



// pie chart
/*
<div style={{ padding: 50, backgroundColor: "#fff", textAlign: "center", borderRadius: 5, display: "grid", gridTemplateColumns: "50% 50%", maxWidth: 330 }} >
<div className="chart" style={{ marginLeft: -60 }} >
	<PieChart width={200} height={150} >
			<Pie data={data} dataKey="value" innerRadius={40}>
				{data.map((item, i) => <Cell key={`cell-${i}`} fill={colors[i]} /> )}
			</Pie>
		</PieChart>
</div> 
<div className="details" style={{ marginRight: -20 }} >
	<p>Amazing Detail</p>
	<p>Superior Detail</p>
	<p>Bubbly Pro</p>
	<p>Bubbly Showroom</p>
</div>
</div>
*/