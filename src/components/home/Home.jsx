import React, { Component } from 'react'
import { Divider, Row, Card, Tabs} from 'antd';
import Login from '../common/Login';
import Register from '../common/Register'
import axios from 'axios';

const { TabPane } = Tabs;

export class Home extends Component {
  state = {
    currentWeather: {}
  }

  componentDidMount() {
    this.getWeather()
  } 

  getWeather = async() => {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Rio+de+Janeiro&APPID=07c7bdc00508ea683a1dfa480336d2f4`)
    this.setState({ currentWeather: data })
    console.log(data)
  }

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
          <div style={{ padding: 50, backgroundColor: "#fff", textAlign: "center", borderRadius: 5 }} >
            <h2>Welcome, {user.username}</h2>
          </div>
          <div className="home-weather" style={{ padding: 24, backgroundColor: "#fff", borderRadius: 5, marginTop: 20 }} >
            <h3>Current Weather</h3>
            <Card>
            </Card>
          </div>
        </div>
    )
  }
}

export default Home
