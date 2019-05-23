import React, { Component } from 'react'
import { Table, Divider, Icon, Spin } from 'antd'
import { css } from 'emotion' 
import axios from 'axios';

export class Payrolls extends Component {

	state = {
		payrolls: []
	}

	async componentDidMount() { 
		const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/payrolls`)
		this.setState({ payrolls: data })
	}

  render() {
		const { payrolls } = this.state
		if (payrolls.length === 0) return <div style={{ textAlign: "center", marginTop: "50%" }}><Spin size="large" style={{ margin: "auto" }} indicator={<Icon type="loading" /> } /></div>

    return (
      <div style={{ height: "auto", marginBottom: 80, minWidth: 1000 }} >
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Payrolls</h1>
        <p>View and manage all payrolls submited.</p>
				<Divider />
				<Table className={body} dataSource={payrolls} style={{ backgroundColor: "#fff", borderRadius: 5, padding: 15 }} >
					<Table.Column key="1" title={ <div style={{ fontWeight: 700 }}>Range</div> } dataIndex="range" render={(text, record, index) => <div>{record.range[0]} - {record.range[1]}</div>}  />
					<Table.Column key="2" title={ <div style={{ fontWeight: 700 }}>Employee</div> } dataIndex="employee.name" />
					<Table.Column key="3" title={ <div style={{ fontWeight: 700 }}>Hours</div> } dataIndex="totalHours" />
					<Table.Column key="4" title={ <div style={{ fontWeight: 700 }}>Total</div> } render={(text, record, index) => <div>${record.totalWage}</div>} dataIndex="totalWage" />
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
