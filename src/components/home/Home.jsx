import React, { Component } from 'react'
import { Divider, Tabs, Avatar, Badge, Typography, Icon, Button } from 'antd';
import Auth from '../../services/Auth'
import Login from '../common/Login';
import Register from '../common/Register'
const { TabPane } = Tabs;
const { Text } = Typography
 
export class Home extends Component {
  state = {
    user: {},
  }

  render() {
    const { user, isGapiReady } = this.props
    if (!user.id) {
      return (
        <div>
          <div style={{ padding: 24, margin: "auto", backgroundColor: "#fff", borderRadius: 5, minWidth: 325 }} >
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
            <Divider type="vertical" style={{ height: "80%", marginTop: 25, marginLeft: 20 }}  />
            <div style={{ margin: "auto" }} >
            </div>
          </div>
        </div>
      )
    }
    return (
        <div className="home-body" style={{ overflowX: "hidden", overflowY: "auto" }} >
          <h1 style={{ fontSize: 32, fontWeight: 700 }}>Home</h1>
          <p>Welcome to Bubbly Operations Center!</p>
          <Divider />
          <div style={{ padding: 50, backgroundColor: "#fff", textAlign: "center", borderRadius: 5 }} >
            <h2 style={{ color: "rgba(0,0,0,0.5", display: "inline", fontWeight: 700 }} >Welcome,</h2><h2 style={{ display: "inline", marginLeft: 5, fontWeight: 700 }} >{user.name}</h2>
          </div>
        </div>
    )
  }
}


export default Home
//