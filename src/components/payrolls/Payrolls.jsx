import React, { Component } from 'react'
import { Table, Divider, Icon, Spin, Button } from 'antd'
import { css } from 'emotion' 
import axios from 'axios';

export class Payrolls extends Component {

	state = {
		payrolls: [],
		isLoading: false
	}

	async componentDidMount() { 
		try {
			const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/payrolls`)
			this.setState({ payrolls: data, isLoading: true })
		} catch(ex) {
			console.log(ex)
		} finally {
			this.setState({ isLoading: false })
		}
	}

	handleDelete = async(record) => {
		console.log(record)
		const { data } = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/payrolls/${record._id}`)
		const payrolls = [...this.state.payrolls]
		const updatedPayrolls = payrolls.filter(item => item._id !== record._id)
		this.setState({ payrolls: updatedPayrolls })
		console.log(data)
	}

  render() {
		const { payrolls, isLoading } = this.state
		if (isLoading) return <div style={{ textAlign: "center", marginTop: "50%" }}><Spin size="large" style={{ margin: "auto" }} indicator={<Icon type="loading" /> } /></div>

    return (
      <div style={{ height: "auto", marginBottom: 80, minWidth: 1000 }} >
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Payrolls</h1>
        <p>View and manage all payrolls submited.</p>
				<Divider />
				<Table className={body} dataSource={payrolls} style={{ backgroundColor: "#fff", borderRadius: 5, padding: 15 }} pagination={{ defaultPageSize: 10, size: "small", hideOnSinglePage: true }} >
					<Table.Column key="1" title={ <div style={{ fontWeight: 700 }}>Range</div> } dataIndex="range" render={(text, record, index) => <div>{record.range[0]} - {record.range[1]}</div>}  />
					<Table.Column key="2" title={ <div style={{ fontWeight: 700 }}>Employee</div> } dataIndex="employee.name" />
					<Table.Column key="3" title={ <div style={{ fontWeight: 700 }}>Hours</div> } dataIndex="totalHours" />
					<Table.Column key="4" title={ <div style={{ fontWeight: 700 }}>Tips</div> } render={(text, record, index) => <div>${record.totalTips}</div>} dataIndex="totalTips" />
					<Table.Column key="5" title={ <div style={{ fontWeight: 700 }}>Total</div> } render={(text, record, index) => <div>${record.totalWage}</div>} dataIndex="totalWage" />
					<Table.Column key="6" render={(text, record) => <Button shape="circle" onClick={() => this.handleDelete(record)} ><Icon type="delete" /></Button> } />
				</Table>
      </div>
    )
  }
}

const body = css({
  backgroundColor: 'green',
  '& thead > tr > th': {
    backgroundColor: 'white'
  }
})

export default Payrolls

