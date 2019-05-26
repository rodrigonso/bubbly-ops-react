import React, { Component } from 'react'
import { Divider, Button, Statistic, Typography, Icon, Spin } from 'antd';
import { Chart, Tooltip, Axis, Bar, Pie, Coord, Legend } from 'viser-react'
import DataSet from '@antv/data-set'
import axios from 'axios'
import moment from 'moment'

const { Text } = Typography

class Earnings extends Component {

	state = {
		user: {},
		jobs: [],
		jobsByDay: [],
		totalEarned: 0,
		isLoading: false
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

		try {
			this.setState({ isLoading: true })
			const res = await axios.get(`${process.env.REACT_APP_BACKEND_API}/jobs/getJobs/${this.props.user.employeeId}`)
			console.log(res.data)
			this.setState({ jobs: res.data })
		} catch (ex) {
			console.log(ex)
		} finally {
			this.setState({ isLoading: false })
		}
	}


	getJobType = async() => {
		const { jobs } = this.state
		
		const amazing = jobs.filter(item => item.serviceType.name === "Amazing Detail")
		const superior = jobs.filter(item => item.serviceType.name === "Superior Detail")

		const test = [
			{ key: 0, name: "Amazing Detail", value: amazing.length },
			{ key: 1, name: "Superior Detail", value: superior.length }
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


getServiceTypes = (jobs) => {

  const amazing = jobs.filter(item => item.serviceType.name === "Amazing Detail")
  const superior = jobs.filter(item => item.serviceType.name === "Superior Detail")
  const pro = jobs.filter(item => item.serviceType.name === "Bubbly Pro")
  const showroom = jobs.filter(item => item.serviceType.name === "Bubbly Showroom")

  const test = [
    { item: "Amazing Detail", value: amazing.length },
    { item: "Superior Detail", value: 3 },
    { item: "Bubbly Pro", value: 4 },
    { item: "Bubbly Showroom", value: 2 },
  ]

  return test
}


	test = () => {
		const dv = new DataSet.View().source(this.getServiceTypes(this.state.jobs));
		dv.transform({
			type: 'percent',
			field: 'value',
			dimension: 'item',
			as: 'percent'
		})
		const data = dv.rows
		return data
	}

  render() {
		if (this.state.isLoading) return <div style={{ overflowX: "hidden", overflowY: "auto", textAlign: "center", marginTop: "25%" }}><Spin size="large" style={{ margin: "auto" }} indicator={<Icon type="loading" /> } /></div>
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
				<Divider />
			</div>

			<div style={{ backgroundColor: "#fff", padding: 24, borderRadius: 5, margin: "auto", marginTop: 10 }} >
				<div style={{ marginLeft: -45 }}>
					<Chart height={300} data={this.test()} scale={scale2} >
						<Tooltip showTitle={false} />
						<Axis />
						<Legend dataKey="item" />
						<Coord type="theta" radius={0.75} innerRadius={0.6} />
						<Pie position="percent" color="item" style={{ stroke: "#fff", lineWidth: 2 }} label={['item', 'value']} /> 
					</Chart>
				</div>
			</div>
		</div>
    )
  }
}

export default Earnings

const sourceData = [
  { item: 'Amazing Detail', count: 40 },
  { item: 'Superior Detail', count: 21 },
  { item: '事例三', count: 17 },
  { item: '事例四', count: 13 },
  { item: '事例五', count: 9 }
];

const scale2 = [{
	dataKey: 'percent',
	min: 0,
	formatter: '.0%'
}]

const pieColors = ["#1890ff", "#096dd9", "#0050b3", "#003a8c" ]


const scale = [{
	dataKey: 'value',
	tickInterval: 1
}]