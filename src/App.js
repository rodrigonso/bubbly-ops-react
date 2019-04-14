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

const apiKey =  process.env.REACT_APP_GOOGLE_APIKEY
const clientId = process.env.REACT_APP_GOOGLE_CLIENTID

class App extends Component {
state = {
  token: '',
  user: {},
  isMobile: false,
  isGapiReady: false
}

async componentDidMount() {
  if (navigator.userAgent.match(/iPhone/i)) this.setState({ isMobile: true })

  const token = localStorage.getItem("token")
  
  if (token) {
    const user = jwt.decode(token);
    this.setState({ token, user })
    this.loadGoogleApi()
  }
}

updateSigninStatus = async(isSignedIn) => {
  if (!isSignedIn) return window.gapi.auth2.getAuthInstance().signIn()

}

loadGoogleApi = () => {
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/client.js";

  script.onload = () => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        apiKey: apiKey,
        client_id: clientId,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: "https://www.googleapis.com/auth/calendar.readonly"
      }).then(() => {
        this.setState({ isGapiReady: true })

        window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus)
        this.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
      })
    })
  }
  document.body.appendChild(script);
}


render() {
  const { user, isMobile, isGapiReady } = this.state
  if (isGapiReady) console.log("Gapi Initialized")
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
                <Route  exact path="/settings" render={(props) => <Settings {...props} /> } />
                <Route  exact path="/" render={(props) => <Home {...props} user={user} isMobile={isMobile} isGapiReady={isGapiReady} /> } />
              </div>
            </Content>
          </Layout>
        </Layout>
    )
  }
}

const appStyleDesktop = {
  paddingTop: 100,
  minHeight: "100vh",
  minWidth: 800
}

const appStyleMobile = {
  padding: 24,
  minHeight: "100vh",
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
