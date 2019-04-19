import React, { Component } from 'react'
import { Divider, Tabs } from 'antd';
import Login from '../common/Login';
import Register from '../common/Register'
import CurrentJobs from '../currentJobs/CurrentJobs'

const { TabPane } = Tabs;

export class Home extends Component {
  state = {
    user: {},
  }

  render() {
    const { user, isGapiReady } = this.props
    if (!user.id) {
      return (
        <div>
          <h1 style={{ fontSize: 32 }}>Home</h1>
          <p>Welcome to Bubbly Operations Center, please login or register to get started.</p>
          <Divider />
          <div style={{ padding: 24, margin: "auto", backgroundColor: "#fff" }} >
            <Tabs style={{ width: 250, margin: "auto" }} >
              <TabPane tab="Login" key="1">
                <p>Please login with your credentials below</p>
                <Login />
                <p>Don't have an account? <a href="/" >Register now!</a></p>
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
        <div className="home-body" style={{ overflowX: "hidden", overflowY: "auto", }} >
          <h1 style={{ fontSize: 32 }}>Home</h1>
          <p>Welcome to Bubbly Operations Center, please login or register to get started.</p>
          <Divider />
          <div style={{ padding: 50, backgroundColor: "#fff", textAlign: "center", borderRadius: 5 }} >
            <h2>Welcome, {user.username}</h2>
          </div>
        </div>
    )
  }
}


export default Home
