import React, { Component } from 'react'
import { Layout, Divider, Col, Row, Form, Input, Tabs} from 'antd';
import Login from '../common/Login';
import Register from '../common/Register'
import jwt from 'jsonwebtoken'

const { TabPane } = Tabs;

export class Home extends Component {
  render() {
    const { user, token } = this.props
    if (!token) {
      return (
        <div>
          <h1 style={{ fontSize: 32 }}>Home</h1>
          <p>Welcome to Bubbly Operations Center, please login or register to get started.</p>
          <Divider />
          <div style={{ padding: 50, margin: "auto", backgroundColor: "#fff" }} >
            <Tabs style={{ width: 300, margin: "auto" }} >
              <TabPane tab="Login" key="1">
                <p>Please login with your credentials below</p>
                <Login />
                <p>Don't have an account? <a>Register now!</a></p>
              </TabPane>
              <TabPane tab="Register" key="2">
                <p>Enter your information below to sign-up</p>
                <Register />
              </TabPane>
            </Tabs>
          </div>
        </div>
      )
    }
    return (
        <div>
          <h1 style={{ fontSize: 32 }}>Home</h1>
          <p>Welcome to Bubbly Operations Center, please login or register to get started.</p>
          <Divider />
          <div style={{ padding: 50, backgroundColor: "#fff", textAlign: "center" }} >
            <h2>Welcome, {user.username}</h2>
            <p></p>
          </div>
        </div>
    )
  }
}

export default Home
