import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Card, List, Icon, Avatar, Typography, Button, Divider, Rate, Menu, Tabs } from 'antd'
import Spinner from '../common/Spinner'
import axios from 'axios';
import EmployeeCard from '../common/EmployeeCard';
import ServicesCard from '../common/ServicesCard';

const { TabPane } = Tabs
const { Text } = Typography

export class Settings extends Component {
  state = {
    employees: [],
    services: [],
    currentPage: 0
  }

  async componentDidMount() {
    const employees = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees`)
    const services = await axios.get(`${process.env.REACT_APP_BACKEND_API}/services`)
    this.setState({ employees: employees.data, services: services.data })
  }

  render() {
    const { employees, services } = this.state
    if (employees.length === 0) return <Spinner />
    return ( 
      <div style={{ backgroundColor: '#fff', borderRadius: 5, padding: '20px 0px 20px 0px' }} >
        <Tabs tabPosition="left" defaultActiveKey="1" tabBarStyle={{ width: '12.5%' }}  >
          <TabPane key="1" tab="Employees" >
            <div style={{ marginLeft: 40, marginTop: 5, marginBottom: 20, marginRight: 40 }} >
              <h2 style={{ fontWeight: 700 }} >Employees</h2>
              <EmployeeCard employees={employees} />
          </div>
          </TabPane>
          <TabPane key="2" tab="Services" >
            <div style={{ marginLeft: 40, marginTop: 5, marginBottom: 20, marginRight: 40 }} >
             <h2 style={{ fontWeight: 700 }} >Services</h2>
             <ServicesCard services={services} />
            </div>
          </TabPane>
        </Tabs>

      </div>
    )
  }
}

const fontSize = {
  fontSize: 16,
  color: "#2c3e50"
}

export default Settings
