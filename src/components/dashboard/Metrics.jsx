import React, { Component } from 'react'
import { Divider, Typography, Icon, Collapse } from 'antd';
import {
  PieChart, Pie, Cell, XAxis, YAxis, BarChart, Tooltip, Legend, Bar
} from 'recharts';

const { Text } = Typography

export class Metrics extends Component {
	render() {
		const { jobs, jobsByDate, totalRevenue, totalDriving, jobsByDay, serviceTypes } = this.props
		return (
			<Collapse style={{ marginBottom: 30 }} bordered={false} expandIcon={({ isActive }) => <Icon style={{ marginLeft: "6.2rem", marginTop: isActive ? "26rem" : "0.7rem" }} type="caret-down" rotate={isActive ? 180 : 0} />}>
				<div style={{ backgroundColor: "#fff", borderRadius: 5, padding: 15 }} >
					<PieChart width={200} height={250} >
						<Pie data={serviceTypes} dataKey="value" innerRadius={45} cx="35%" cy="45%"  >
							{serviceTypes.map((entry, index) => <Cell key={index} fill={pieColors[index]} /> )}
						</Pie>
						<Tooltip />
						<Legend align="left" iconSize={8} iconType="circle" />
					</PieChart>
					<Divider />
				</div>
				<div style={{backgroundColor: "#fff", marginTop: -25, padding: 15, display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: 5 }}>
					<div>
						<Text style={{ fontSize: 12 }} type="secondary">Total Jobs</Text>
						<p style={{ fontSize: 16 }}  >{jobsByDate.length}</p>
					</div>
					<div>
						<Text style={{ fontSize: 12 }} type="secondary">Total Revenue</Text>
						<p style={{ fontSize: 16 }} >${totalRevenue}</p>
					</div>
				</div>
				<Collapse.Panel style={{ border: 0 , marginTop: -40}} >
					<Divider />
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} >
						<div>
							<Text style={{ fontSize: 12 }} type="secondary">Job Average</Text>
							<p style={{ fontSize: 16 }}  >${Math.floor(totalRevenue/jobsByDate.length)}</p>
						</div>
						<div>
							<Text style={{ fontSize: 12 }} type="secondary">Average Distance</Text>
							<p style={{ fontSize: 16 }} >{Math.floor(totalDriving/jobsByDate.length)} miles</p>
						</div>
					</div>
					<Divider />
					<Text style={{ fontSize: 12 }} type="secondary" >Services by Day</Text>
					<BarChart width={270} height={170} data={jobsByDay} style={{ marginLeft: -50, fontSize: 14, marginTop: 5 }} >
						<Tooltip />
						<Bar dataKey="value" fill="#096dd9" barSize={15} />
						<YAxis allowDecimals={false} />
						<XAxis dataKey="name"  />
					</BarChart>
					<Divider />
				</Collapse.Panel> 
			</Collapse>
		)
	}
}

export default Metrics

const pieColors = ["#1890ff", "#096dd9", "#0050b3", "#003a8c" ]
