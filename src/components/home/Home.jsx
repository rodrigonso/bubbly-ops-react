import React, { Component } from 'react'
import { Divider, Tabs, Avatar, Badge, Button } from 'antd';
import Login from '../common/Login';
import Register from '../common/Register'

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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} >
            <Button onClick={() => this.props.history.push("/jobs")} type="default" style={{marginTop: 15, minHeight: 125, marginRight: 10, backgroundColor: "#fff", textAlign: "center", borderRadius: 5}} >
              <Badge count={this.props.uncompletedJobs.length} ><Avatar shape="square" size="large" icon="solution" /></Badge>
              <h4>Current Jobs</h4>
            </Button>
          </div>
        </div>
    )
  }
}


export default Home
