import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getEventsById, handleGoogleUser } from './services/eventsService';
import SiderMenu from './components/siderMenu/SiderMenu';
import Home from './components/home/Home';
import Appointments from './components/appointments/Appointments';
import Dashboard from './components/dashboard/Dashboard';
import Settings from './components/settings/Settings'
import { Layout } from 'antd';
import './App.css';
import jwt from 'jsonwebtoken'
import TestMobile from './components/TestMobile';



const { Content } = Layout;

class App extends Component {
state = {
  token: '',
  user: {},
  isMobile: false
}

async componentDidMount() {
  const token = localStorage.getItem("token")


  if (navigator.userAgent.match(/iPhone/i)) this.setState({ isMobile: true })
  handleGoogleUser()

  if (token) {
    const user = jwt.decode(token);
    console.log(user)
    this.setState({ token, user })

  } else {
    console.log("No valid token found")
  }
}


  render() {
    const { token, user, isMobile } = this.state
    return (
        <Layout>
          <SiderMenu user={user} isMobile={isMobile}/>
          <Layout style={isMobile ? layoutStyleMobile : layoutStyleDesktop}>
            <Content style={{ margin: 'auto', overflow: "initial", maxWidth: 1000, background: "#f7f7f7" }} >
              <div className="app" style={isMobile ? appStyleMobile : appStyleDesktop}>
                <Route  exact path="/appointments" render={(props) => {
                  if (!user.username) return <Redirect to="/" />
                  else return <Appointments {...props} user={user} />
                }}
                />
                <Route  exact path="/dashboard" render={(props) => {
                  if (!user.isAdmin) return <Redirect to="/" />
                  return <Dashboard {...props} />
                  }} 
                />
                <Route exact path="/test" component={TestMobile} />
                <Route  exact path="/settings" render={(props) => <Settings {...props} /> } />
                <Route  exact path="/" render={(props) => <Home {...props} user={user} isMobile={isMobile} token={token} /> } />
              </div>
            </Content>
          </Layout>
        </Layout>
    )
  }
}

const appStyleDesktop = {
  paddingTop: 100,
  minHeight: 1080,
  minWidth: 800
}

const appStyleMobile = {
  padding: 24,
  minHeight: 1080,
}

const layoutStyleMobile = {
  marginLeft: 0,
  background: "#f7f7f7",
  mingHeight: "100%"
}


const layoutStyleDesktop = {
  marginLeft: 200,
  background: "#f7f7f7",
  mingHeight: "100%"
}

export default App;
