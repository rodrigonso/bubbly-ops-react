import React, { Component } from 'react'
import { Radio, Input, Button, Form, Rate, Divider, message } from 'antd';
import Joi from 'joi'


export class JobData extends Component {
	state = {
		make: '',
		model: '',
		vehicleType: '',
		rating: 0,
	}

	validateFields = (fields) => {
		const schema = {
			make: Joi.string().min(3).max(15).required(),
			model: Joi.string().min(2).max(15).required(),
			rating: Joi.number().required(),
			vehicleType: Joi.string().required()
		}

		return Joi.validate(fields, schema)
	}

	handleInput = (e) => {
    const field = e.target.placeholder
    if (field === "Ford") this.setState({ make: e.target.value })
    else this.setState({ model: e.target.value })
	}

	handleSelect = (e) => {
		this.setState({ vehicleType: e.target.value })
	}

	handleRate = (value) => {
		this.setState({ rating: value })
	}

	handleNext = () => {
		const { make, model, rating, vehicleType } = this.state
		const data = { make, model, rating, vehicleType }

		const { error } = this.validateFields(data)
		if (error) return message.error("All fields are required!")

		return this.props.nextStep(data)
	}


  render() {
		const { make, model, rating, isValidated } = this.state
		const { handleRate, nextStep } = this.props
    return (
			<div style={{ width: "100%" }} >
				<p>Insert details of your current customer. When you're done, press next.</p>
				<Divider />
				<Form>
					<Form.Item label="Make">
					<Input placeholder="Ford" value={make} onChange={this.handleInput} />
					</Form.Item>
					<Form.Item label="Model" >
					<Input placeholder="F-150" value={model} onChange={this.handleInput} />
					</Form.Item>
					<Divider />
					<Form.Item label="Vehicle Size" >
						<Radio.Group onChange={this.handleSelect} >
							<Radio value="Sedan" >Sedan</Radio>
							<br/>
							<Radio value="Non-Sedan" >Non-Sedan</Radio>
						</Radio.Group>
					</Form.Item>
					<Divider />
					<Form.Item label="Vehicle Conditions" >
							<Rate style={{ margin: "auto", fontSize: 30 }} value={rating} onChange={this.handleRate} />
					</Form.Item>
					<Divider />
					<Button style={{ width: "100%" }} type="primary" onClick={this.handleNext}>Next</Button> 
				</Form>
			</div>
    )
  }
}

export default JobData
