import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import SiderMenu from './components/siderMenu/SiderMenu';
import Home from './components/home/Home';
import Appointments from './components/appointments/Appointments';
import Dashboard from './components/dashboard/Dashboard';
import Settings from './components/settings/Settings'
import { Layout } from 'antd';
import './App.css';
import jwt from 'jsonwebtoken'



const { Content } = Layout;

class App extends Component {
state = {
  token: '',
  user: {}
}

componentDidMount() {
  const token = localStorage.getItem("token")
  if (token) {
    const user = jwt.decode(token);
    this.setState({ token, user })
  } else {
    console.log("No valid token found")
  }
}


  render() {
    const { token, user } = this.state
    return (
        <Layout>
          <SiderMenu user={user} />
          <Layout style={{ marginLeft: 200, background: "#f7f7f7", mingHeight: "100%" }}>
            <Content style={{ margin: 'auto', overflow: "initial", maxWidth: 1000, background: "#f7f7f7" }} >
              <div className="app" style={{ paddingTop: 100, minHeight: 1080, minWidth: 800 }}>
                <Route  exact path="/appointments" render={(props) => {
                  if (!user.isAdmin) return <Redirect to="/" />
                  return <Appointments {...props} />
                  }} 
                />
                <Route  exact path="/dashboard" render={(props) => {
                  if (!user.isAdmin) return <Redirect to="/" />
                  return <Dashboard {...props} />
                  }} 
                />
                <Route  exact path="/settings" render={(props) => <Settings {...props} /> } />
                <Route  exact path="/" render={(props) => <Home {...props} user={user} token={token} /> } />
              </div>
            </Content>
          </Layout>
        </Layout>
    )
  }
}

export default App;
