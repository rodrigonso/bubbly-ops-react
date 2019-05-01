import React, { Component } from 'react'
import { Radio, Typography, Input, Button, Icon, Empty, Card, Form, Select, Rate, Divider } from 'antd';

const { Option } = Select
const { RadioGroup } = Radio

export class JobData extends Component {
  render() {
      const { job, handleInput, handleRate, nextStep, make, model, rating, handleSelect } = this.props
    return (
        <div style={{ width: "100%" }} >
            <p>Insert details of your current customer. When you're done, press next.</p>
            <Divider />
            <Form>
                <Form.Item label="Make">
                <Input placeholder="Ford" value={make} onChange={handleInput} />
                </Form.Item>
                <Form.Item label="Model" >
                <Input placeholder="F-150" value={model} onChange={handleInput} />
                </Form.Item>
                <Divider />
                <Form.Item label="Vehicle Size" >
                    <Radio.Group onChange={handleSelect} >
                        <Radio value="Sedan" >Sedan</Radio>
                        <br/>
                        <Radio value="Non-Sedan" >Non-Sedan</Radio>
                    </Radio.Group>
                </Form.Item>
                <Divider />
                <Form.Item label="Vehicle Conditions" >
                    <Rate style={{ margin: "auto", fontSize: 30 }} value={rating} onChange={handleRate} />
                </Form.Item>
                <Divider />
                <Button style={{ width: "100%" }} type="primary" onClick={this.props.nextStep}>Next</Button> 
            </Form>
        </div>
    )
  }
}

export default JobData
