import React, { Component } from 'react'
import { Card, List, Button, Icon, Avatar, Typography, Tag, Divider, Rate } from 'antd'
import Spinner from '../common/Spinner'
import axios from 'axios';
import EmployeeCard from '../common/EmployeeCard';

const { Text } = Typography

export class Settings extends Component {
  state = {
    employees: [],
    services: []
  }

  async componentDidMount() {
    const employees = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees`)
    const services = await axios.get(`${process.env.REACT_APP_BACKEND_API}/services`)
    this.setState({ employees: employees.data, services: services.data })
  }

  render() {
    const { employees } = this.state
    if (employees.length === 0) return <Spinner />
    return (
      <React.Fragment>
        <EmployeeCard employees={employees} />

        <div style={{ padding: 24, margin: "auto", backgroundColor: "#fff", borderRadius: 5 }} >
          <Card bordered={false} title="Services" extra={<Icon style={fontSize} type="plus" /> } >
            <List itemLayout="horizontal" dataSource={this.state.services} renderItem={item => (
              <List.Item actions={[<Icon style={fontSize} type="edit" />, <Icon style={fontSize} type="delete" />]}>
                <List.Item.Meta title={item.name} description={(
                <div>
                <Icon type="dollar" /> {item.price}
                <Icon type="hourglass" style={{ marginLeft: 10 }} /> {item.duration} hours
                <Icon type="car" style={{ marginLeft: 10 }} /> {item.vehicleType}
              </div>
                )} /> 
              </List.Item> 
            )}
          />
          </Card>
        </div>
      </React.Fragment>
    )
  }
}

const fontSize = {
  fontSize: 16,
  color: "#2c3e50"
}

export default Settings
