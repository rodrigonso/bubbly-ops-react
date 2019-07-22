import React, { Component } from 'react'
import { Divider, Descriptions, Typography, Icon, Spin, Empty, Rate, Statistic, Carousel, Card } from 'antd';
import { Chart, Tooltip, Axis, Bar } from 'viser-react'
import axios from 'axios'
import moment from 'moment'

const { Text } = Typography

class Earnings extends Component {

	state = {
		employee: {},
		jobs: [],
		payrolls: [],
		jobsByDay: [],
		totalEarned: 0,
		isLoading: false
	}

	async componentDidMount() {
		try {
			this.setState({ isLoading: true })
			
			const { data: allJobs } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/jobs`)
			const jobs = allJobs.filter(item => item.employeeId === this.props.user.employeeId)
			this.setState({ jobs })

			const { data: employee } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees/${this.props.user.employeeId}`)
			this.setState({ employee })

			const { data: allPayrolls } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/payrolls`)
			const payrolls = allPayrolls.filter(item => item.employee._id === this.props.user.employeeId)
			this.setState({ payrolls })
		} catch (ex) {
			console.log(ex)
		} finally {
			this.setState({ isLoading: false })
		}
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

	getLatestPayroll = () => {
		const { payrolls } = this.state
		if (payrolls.length > 0) {
			return (
				<Descriptions bordered >
					<Descriptions.Item label="Period" >{payrolls[0].range[0]} - {payrolls[0].range[1]}</Descriptions.Item>
					<Descriptions.Item label="Hours" >{payrolls[0].totalHours}</Descriptions.Item>
					<Descriptions.Item label="Tips" >${payrolls[0].totalTips}</Descriptions.Item>
					<Descriptions.Item label="Total" >${payrolls[0].totalWage} <Text type="secondary">without taxes</Text> </Descriptions.Item>
				</Descriptions> 
			)
		}
		else return <Empty />
	}

	getAveragePayroll = () => {
		const { payrolls } = this.state

		if (payrolls.length === 0) return <Empty />
		const totals = payrolls.map(i => {
			return i.totalWage
		})
		const average = totals.reduce((a, b) => a + b)
		return Math.ceil(average / payrolls.length)
	}

	getAverageTips = () => {
		const { payrolls } = this.state

		if (payrolls.length === 0) return <Empty />
		const tips = payrolls.map(i => i.totalTips)
		const jobs = payrolls.map(i => i.totalJobs)
		const totalTips = tips.reduce((a, b) => a + b)
		const totalJobs = jobs.reduce((a, b) => a + b)
		return Math.ceil(totalTips / totalJobs)
	}

  render() {
		const { isLoading, employee } = this.state

		if (isLoading) return <Spin size="large" style={{ height: '50vh', width: '50vw' }} indicator={<Icon type="loading" /> } />

    return (
			<div className="home-body" style={{ overflowX: "hidden", maxWidth: "87vw", overflowY: "auto" }} >
			<h1 style={{ fontSize: 32, fontWeight: 700 }}>Earnings</h1>
			<p>Here you can find a full report of all of your earnings.</p>
			<Divider />
			<div style={{ backgroundColor: '#fff', padding: 15, borderRadius: 5 }} >
				<Text type="secondary">Stats</Text>
				<Carousel swipeToSlide draggable centerPadding={75} centerMode dots={false} >
					<div>
						<Card style={{ marginRight: 10, marginTop: 10 }} >
							<div style={{ margin: 'auto' }}>
								<Text style={{ fontSize: 12 }} type="secondary">Avg Rating</Text>
								<br/>
								<Text style={{ fontSize: 26 }} >{employee.rating}</Text>
								<Text type="secondary"> / 5</Text>
							</div> 
						</Card>
					</div>
					<div>
						<Card style={{ marginRight: 10, marginTop: 10 }} >
							<div style={{ margin: 'auto' }}>
								<Text style={{ fontSize: 12 }} type="secondary">Avg Payroll</Text>
								<br/>
								<Text style={{ fontSize: 26 }} >${this.getAveragePayroll()}</Text>
							</div> 
						</Card>
					</div>
					<div>
						<Card style={{ marginRight: 10, marginTop: 10 }} >
							<div style={{ margin: 'auto' }}>
								<Text style={{ fontSize: 12 }} type="secondary">Avg Tips</Text>
								<br/>
								<Text style={{ fontSize: 26 }} >${this.getAverageTips()}</Text>
								<Text type="secondary"> per car</Text> 
							</div> 
						</Card>
					</div>
				</Carousel>
			</div>
			<div style={{ backgroundColor: "#fff", padding: 15, borderRadius: 5, marginTop: 10 }}>
				<Text type="secondary">Latest Payroll</Text>
				<div style={{ marginTop: 10 }}>
					{this.getLatestPayroll()}
				</div>
			</div>
			<div style={{ backgroundColor: "#fff", padding: 15, borderRadius: 5, marginTop: 10 }} >
				<Text type="secondary">Services by Day</Text>
				<div style={{ marginLeft: -45, marginTop: 10 }}>
					<Chart width={340} height={300} data={this.getJobsByDay()} scale={scale} >
						<Tooltip />
						<Axis />
						<Bar position="name*value" />
					</Chart>
				</div>
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