import React, { Component } from 'react'
import { Table } from 'antd'
import axios from 'axios';

export class Payrolls extends Component {

	state = {
		payrolls: []
	}

	async componentDidMount() { 
		const payrolls = await axios.get(`${process.env.REACT_APP_BACKEND_API}/payrolls`)
		this.setState({ payrolls })
	}

  render() {
    return (
      <div>
        <Table dataSource={this.state.payrolls} >
					<Table.Column title="Date" dataIndex="date" />
					<Table.Column title="Employee" dataIndex="employee" />
					<Table.Column title="Hours" dataIndex="hours" />
					<Table.Column title="Total" dataIndex="total" />
        </Table>
      </div>
    )
  }
}

export default Payrolls
