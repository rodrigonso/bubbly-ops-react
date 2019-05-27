import React, { Component } from 'react'
import { Divider, Typography, Icon, Button, Table, Timeline, Tag } from 'antd';
import { css } from 'emotion'

const { Text } = Typography

export class JobsTable extends Component {

	expandedRowRender = (record) => {
		if (record.distances.rows.length === 0) return null
		return (
			<React.Fragment>
				<div style={{ display: "grid", gridTemplateColumns: "40% 20% 20% 20%" }} >
					<div>
						<Text style={{ fontSize: 12 }} type="secondary">Total</Text>
						<p style={{ fontSize: 16 }}  >${record.serviceType.price}</p>
					</div>
					<div>
						<Text style={{ fontSize: 12 }} type="secondary">Trip Time</Text>
						<p style={{ fontSize: 16 }}  >{record.distances.rows[0].elements[0].duration.text}</p>
					</div>
					<div>
						<Text style={{ fontSize: 12 }} type="secondary">Distance</Text>
						<p style={{ fontSize: 16 }}  >{record.distances.rows[0].elements[0].distance.text}</p>
					</div>
					<div>
						<Text style={{ fontSize: 12 }} type="secondary">Job Time</Text>
						<p style={{ fontSize: 16 }}  >{record.serviceType.duration} hrs</p>
					</div>
				</div>
				<Divider />
				<div style={{ display: "grid", gridTemplateColumns: "40% 40%" }}  >
					<Timeline>
						<Timeline.Item>
							<p>Origin</p>
							<p type="secondary" style={{ fontSize: 10, marginTop: -15, color: "rgba(0, 0, 0, 0.45)" }}>{record.distances.origin_addresses[0]}</p> 
						</Timeline.Item>
						<Timeline.Item>
							<p>Destination</p>
							<p type="secondary" style={{ fontSize: 10, marginTop: -15, color: "rgba(0, 0, 0, 0.45)" }}>{record.distances.destination_addresses[0]}</p> 
						</Timeline.Item>
					</Timeline>
					<div style={{ marginLeft: 150 }} >
						<Text type="secondary">Upgrades</Text>
						<div style={{ marginTop: 10 }} >
							{record.upgrades.map(item => <Tag style={{ marginBottom: 5 }}  color="blue">{item.name}</Tag> )}
						</div>
					</div>
				</div>
			</React.Fragment>
		)
	}

	render() {
		const { data, handleDelete } = this.props
		const body = css({
			backgroundColor: 'green',
			'& thead > tr > th': {
				backgroundColor: 'white'
			}
		})

		return (
			<Table 
				className={body} 
				rowKey={(record) => record._id} 
				expandedRowRender={(record) => this.expandedRowRender(record)} 
				dataSource={data} 
				style={{ backgroundColor: "#fff", borderRadius: 5, padding: 15 }} 
				pagination={{ defaultPageSize: 10 }}
			>
				<Table.Column key="date"
					dataIndex="date" 
					style={{ borderRadius: 5}} 
					title={ <div style={{ fontWeight: 700 }}>Date</div> }
				/>
				<Table.Column 
					key="time" 
					dataIndex="start" 
					style={{ borderRadius: 5}}  
					title={ <div style={{ fontWeight: 700 }}>Time</div> }
				/>
				<Table.Column 
					key="name" 
					dataIndex="summary" 
					style={{ borderRadius: 5}}  
					title={ <div style={{ fontWeight: 700 }}>Name</div> }
				/>
				<Table.Column 
					key="amount" 
					render={(text, record, index) => <div>${record.serviceType.price}</div>} 
					style={{ borderRadius: 5}}  
					title={ <div style={{ fontWeight: 700 }}>Amount</div> }
				/>
				<Table.Column 
					key="actions" 
					dataIndex="id" 
					style={{ borderRadius: 5}} 
					render={(text, record) => <Button shape="circle" onClick={() => handleDelete(record)} ><Icon type="delete" /></Button> } 
					title={ <div style={{ fontWeight: 700 }}></div> }
				/>
			</Table>
		)
	}
}

export default JobsTable
