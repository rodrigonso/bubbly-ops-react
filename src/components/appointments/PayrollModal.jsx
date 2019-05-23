import React, { Component } from 'react'
import { Divider, Button, Modal, InputNumber, Typography } from 'antd';
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

	getTotal = () => {
		const { hours, tips, wage } = this.state
		return (hours * wage) + tips
	}

	handleSubmit = () => {
		const { tips, hours } = this.state
		const data = {
			totalWage: this.getTotal(),
			totalTips: tips,
			totalHours: hours
		}
		this.props.handlePayroll(data)
	}

	render() {
		const { isModalOpen, totalHours, handleModal, handlePayroll, jobsByDate, range } = this.props
		const { hours, tips, wage } = this.state
		return (
			<Modal visible={isModalOpen} title="Run Payroll" onCancel={handleModal} footer={<Button onClick={this.handleSubmit}  type="primary" shape="round">Submit</Button>  } >
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} >
					<span><Text type="secondary">Total Jobs</Text><p>{jobsByDate.length}</p></span>
					<span><Text type="secondary">Period</Text><p>{moment(range[0]).format("l")} - {moment(range[1]).format("l")}</p></span>
				</div>
				<Divider />
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
					<div>
						<Text type="secondary">Hours</Text> 
						<br />
						<InputNumber style={{ width: "55%" }} onChange={(value) => this.handleChange(value, "hours")} value={hours} />  
					</div>
					<div>
						<Text type="secondary">Tips</Text> 
						<br />
						<InputNumber style={{ width: "70%" }} onChange={(value) => this.handleChange(value, "tips")} value={tips} formatter={value => `$ ${value}`} />
					</div>
					<div>
						<Text type="secondary">Wage</Text> 
						<br />
						<InputNumber style={{ width: "55%" }} onChange={(value) => this.handleChange(value, "wage")} value={wage} />
					</div>
					<div>
						<h4>Total Due</h4>
						<p style={{ fontSize: 20 }} >${this.getTotal()}</p>
					</div>
				</div>
		</Modal>
		)
	}
}

export default PayrollModal
