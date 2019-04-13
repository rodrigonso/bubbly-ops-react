import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getEventsById, handleGoogleUser } from './services/eventsService';
import SiderMenu from './components/siderMenu/SiderMenu';
import Home from './components/home/Home';
import Appointments from './components/appointments/Appointments';
import Dashboard from './components/dashboard/Dashboard';
import Settings from './components/settings/Settings'
import moment from 'moment'
import { Layout } from 'antd';
import './App.css';
import jwt from 'jsonwebtoken'
import TestMobile from './components/TestMobile';
import axios from 'axios';



const { Content } = Layout;

const apiKey =  process.env.REACT_APP_GOOGLE_APIKEY
const clientId = process.env.REACT_APP_GOOGLE_CLIENTID

class App extends Component {
state = {
  token: '',
  user: {},
  isMobile: false,
  jobs: []
}

async componentDidMount() {
  const startOfDay = new Date()
  startOfDay.setHours(0,0,0,0)

  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 0, 0)

  const range = [startOfDay, endOfDay]
  this.setState({ range })

  if (navigator.userAgent.match(/iPhone/i)) this.setState({ isMobile: true })

  const token = localStorage.getItem("token")
  console.log(token)
  
  if (token) {
    const user = jwt.decode(token);
    this.setState({ token, user })
    this.loadGoogleApi()
  }
}

updateSigninStatus = async(isSignedIn) => {
  if (!isSignedIn) return window.gapi.auth2.getAuthInstance().signIn()
  if (isSignedIn) {
  
    const allJobs = await getEventsById(this.state.user.email, this.state.range)
  
    const completedJobs = await allJobs.map(async job => {
      const newJob = {
        jobData: job,
      }

      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/jobs/getJob/${job.id}`, newJob)
      return data
    })
    const res = await Promise.all(completedJobs)
    const uncompletedJobs = res.filter(item => item !== '')
    console.log(res)
    console.log(uncompletedJobs)
    this.setState({ jobs: uncompletedJobs })
  }
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
        this.setState({ gapiReady: true })

        window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus)
        this.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
      })
    })
  }
  document.body.appendChild(script);
}

handleJobCompletion = async(job) => {
  const { jobs } = this.state
  const uncompletedJobs = jobs.filter(item => item.jobData.id !== job.jobData.id )
  this.setState({ jobs: uncompletedJobs })

  console.log(job)
  const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/jobs/saveJob/${this.state.user.employeeId}`, job)
  console.log(data)
}

handleVehicleType = async(job) => {
  const jobs = [...this.state.jobs]
  const jobIndex = jobs.indexOf(job)

  const currentJob = jobs.filter(item => item.jobData.id === job.jobData.id)
  jobs[jobIndex] = currentJob[0]

  this.setState({ jobs })
}

render() {
    if (this.state.gapiReady) console.log("Gapi Ready, make your api call")
    const { user, isMobile, jobs } = this.state
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
                <Route  exact path="/" render={(props) => <Home {...props} user={user} jobs={jobs} isMobile={isMobile} handleVehicleType={this.handleVehicleType} handleJobCompletion={this.handleJobCompletion} /> } />
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
