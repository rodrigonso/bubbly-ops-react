import React, { Component } from 'react'
import { Divider, Button, Modal, InputNumber, Typography, Icon, Tag, Popconfirm } from 'antd';
import moment from 'moment'

const { Text } = Typography

export class PayrollModal extends Component {
	state = {
		hours: 0,
		tips: 0,
		wage: 10
	}

	componentDidMount() {
		this.setState({ hours: this.props.totalHours })
	}

	componentDidUpdate(prevProps) {
		if (prevProps.totalHours !== this.props.totalHours) {
				this.setState({ hours: this.props.totalHours })
		}
}

	handleChange = (value, name) => {
		this.setState({ [name]: value })
	} 

	
	handleSubmit = () => {
		const { tips, hours } = this.state
		const { jobsByDate } = this.props
		const data = {
			totalWage: this.getTotal(),
			totalTips: Math.floor(tips),
			totalHours: Math.floor(hours),
			totalJobs: jobsByDate
		}
		this.props.handlePayroll(data)
	}
	
	getTotal = () => {
		const { hours, tips, wage } = this.state
		return Math.floor((hours * wage) + tips)
	}

	getSubmitButton = () => {
		return (
			<Button onClick={this.handleSubmit}  type="primary" shape="round">Submit</Button>  
		)
	}

	render() {
		const { isModalOpen, totalHours, handleModal, jobsByDate, range, selectedEmployee } = this.props
		const { hours, tips, wage } = this.state
		if (!selectedEmployee) return null
		
		return (
			<Modal visible={isModalOpen} title="Run Payroll" onCancel={handleModal} footer={this.getSubmitButton()} >
				<div >
					<Tag color="#108ee9" style={{ borderRadius: 10, marginBottom: 5 }}  >
						<Icon type="user" />
						<Text style={{ color: "#fff", marginLeft: 5 }} >{selectedEmployee.name}</Text>
					</Tag>
					<br />
					<Tag color="#108ee9" style={{ borderRadius: 10 }}>
						<Icon type="calendar"></Icon>
						<Text style={{ color: "#fff", marginLeft: 5 }}>{moment(range[0]).format("l")} - {moment(range[1]).format("l")}</Text>
					</Tag> 
				</div>
				<Divider />
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
					<div>
						<Text type="secondary" style={{ fontSize: 12 }} >Hours</Text> 
						<br />
						<InputNumber style={{ width: "55%" }} onChange={(value) => this.handleChange(value, "hours")} value={hours} />  
					</div>
					<div>
						<Text type="secondary" style={{ fontSize: 12 }} >Tips</Text> 
						<br />
						<InputNumber style={{ width: "70%" }} onChange={(value) => this.handleChange(value, "tips")} value={tips} formatter={value => `$ ${value}`} />
					</div>
					<div>
						<Text type="secondary" style={{ fontSize: 12 }} >Wage</Text> 
						<br />
						<InputNumber style={{ width: "55%" }} onChange={(value) => this.handleChange(value, "wage")} value={wage} />
					</div>
					<div>
						<Text style={{ fontSize: 12 }} >Total Due</Text>
						<p style={{ fontSize: 20 }} >${this.getTotal()}</p>
					</div>
				</div>
		</Modal>
		)
	}
}

export default PayrollModal
