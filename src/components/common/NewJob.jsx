import React, { Component } from 'react'
import { Divider, Input, Modal, Form, Select, Radio, DatePicker, TimePicker } from 'antd';

const { Option } = Select

export class NewJob extends Component {
  render() {
		const { isModalOpen } = this.props
    return (
        <Modal visible={isModalOpen} style={{ height: 400 }} >
					<div style={{ marginTop: 40, padding: 15 }}>
						<Form>
							<Form.Item>
								<div style={{ display: "grid", gridTemplateColumns: "60% 40%" }} > 
								<Input placeholder="Customer's Name" />
								<Input placeholder="Phone" style={{ width: "90%", marginLeft: "10%" }} />
								</div>
							</Form.Item>
							<Form.Item>
								<Input placeholder="joe@bubblynow.com" />
							</Form.Item>
							<Form.Item>
								<Input placeholder="Address" />
							</Form.Item>
							<Form.Item>
								
							</Form.Item>
							<Divider />
							<Form.Item>
								<Select>
									<Option key="1" >Gustavo</Option>
								</Select>
							</Form.Item>
							<Form.Item>
								<div style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
									<Radio.Group style={{ marginTop: -4 }} >
										<Radio.Button>Sedan</Radio.Button>
										<Radio.Button>Non-Sedan</Radio.Button>
									</Radio.Group>
									<Select>
										<Option key="1" >Amazing Detail</Option> 
									</Select>
								</div>
							</Form.Item>
							<Form.Item>
								<Select>
									<Option key="1">Carpet Shampoo</Option>
								</Select>
							</Form.Item>
							<Form.Item>
								<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
									<DatePicker />
									<TimePicker style={{ width: "90%", marginLeft: "10%" }}  use12Hours format="h:mm A" />
									<TimePicker style={{ width: "90%", marginLeft: "10%" }} use12Hours format="h:mm A" />
								</div>
							</Form.Item>
						</Form>
					</div> 
				</Modal>
    )
  }
}

export default NewJob
