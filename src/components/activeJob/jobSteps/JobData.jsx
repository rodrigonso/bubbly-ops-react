import React, { Component } from 'react'
import { Collapse, Steps, Typography, Input, Button, Icon, Empty, Card, Form, Select, Rate } from 'antd';

const { Option } = Select

export class JobData extends Component {
  render() {
      const { job, handleInput, handleRate, nextStep, make, model, rating, handleSelect } = this.props
    return (
        <div style={{ width: "100%" }} >
            <Card style={{ borderRadius: 5, width: "100%" }} >
            <Form>
                <Form.Item>
                <Input placeholder="Ford" value={make} onChange={handleInput} />
                </Form.Item>
                <Form.Item>
                <Input placeholder="F-150" value={model} onChange={handleInput} />
                </Form.Item>
                <Form.Item>
                <Select placeholder="Sedan" onChange={(value) => handleSelect(value, job)} >
                    <Option value="Sedan">Sedan</Option>
                    <Option value="Non-Sedan">Non-Sedan</Option>
                </Select>
                </Form.Item>
                <Form.Item label="Rate the vehicle" >
                <Rate style={{ margin: "auto" }} value={rating} onChange={handleRate} />
                </Form.Item>
            </Form>
            </Card>
        </div>
    )
  }
}

export default JobData
