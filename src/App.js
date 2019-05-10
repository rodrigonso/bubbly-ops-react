import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getEventsById } from './services/eventsService'
import SiderMenu from './components/menu/SiderMenu';
import Home from './components/home/Home';
import Appointments from './components/appointments/Appointments';
import Settings from './components/settings/Settings'
import ActiveJob from './components/jobs/activeJob/ActiveJob'
import { Layout, PageHeader } from 'antd';
import './App.css';
import jwt from 'jsonwebtoken'
import Jobs from './components/jobs/Jobs';
import axios from 'axios'
import moment from 'moment'
import Earnings from './components/earnings/Earnings';
import MobileMenu from './components/menu/MobileMenu';



const { Content, Header } = Layout;

const apiKey =  process.env.REACT_APP_GOOGLE_APIKEY
const clientId = process.env.REACT_APP_GOOGLE_CLIENTID

class App extends Component {
state = {
  token: '',
  uncompletedJobs: [],
  completedJobs: [],
  user: {},
  isMobile: false,
  isGapiReady: false
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
  const completedJobsDate = moment(new Date(localStorage.getItem("completedJobsDate"))).format("L")
  const completedJobs = JSON.parse(localStorage.getItem("completedJobs"))

  if (moment(startOfDay).format("L") !== completedJobsDate) {
    this.setState({ completedJobs: [] })
  } else if (completedJobs) {
    this.setState({ completedJobs }) 
  }
  
  if (token) {
    const user = jwt.decode(token);
    this.setState({ token, user })
    this.loadGoogleApi()
  } 
}

updateSigninStatus = async(isSignedIn) => {
  if (!isSignedIn) {
    console.log("User is not signed in")
    return window.gapi.auth2.getAuthInstance().signIn()
  }
  if (isSignedIn) return;

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
        this.getCurrentJobs()

        window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus)
        this.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
      })
    })
  }
  document.body.appendChild(script);
}

getCurrentJobs = async () => {
  const allJobs = await getEventsById(this.state.user.email, this.state.range)
  const completedJobs = await allJobs.map(async job => {
      const newJob = { jobData: job }
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/jobs/getJob/${job.id}`, newJob)
      return data
  })
  const res = await Promise.all(completedJobs)
  const jobs = res.filter(item => item !== '')
  console.log(jobs)

  if (this.state.completedJobs.length > 0) {
    const uncompletedJobs = jobs.filter(item => {
      return !this.state.completedJobs.find(o => o.jobData.id === item.jobData.id)
    })
    console.log(uncompletedJobs)
    this.setState({ uncompletedJobs })
  } else {
    this.setState({ uncompletedJobs: jobs })
  }
}

handleRefresh = () => {
  this.getCurrentJobs()
}

handleJobCompletion = (job) => {
  const uncompletedJobs = this.state.uncompletedJobs.filter(item => item.jobData.id !== job.id )
  const completedJobs = [...this.state.completedJobs]
  completedJobs.push(job)
  localStorage.setItem("completedJobs", JSON.stringify(completedJobs))
  localStorage.setItem("completedJobsDate", new Date())
  this.setState({ uncompletedJobs, completedJobs })
}

render() {
  const { user, isMobile, isGapiReady, uncompletedJobs, completedJobs } = this.state
  if (isGapiReady) console.log("Gapi Initialized")
    return (
        <Layout>
          {isMobile ? <MobileMenu user={user} /> : <SiderMenu user={user} isMobile={isMobile}/>}
          <Layout style={isMobile ? layoutStyleMobile : layoutStyleDesktop}>
            <Content style={{ margin: 'auto', maxWidth: 1400, background: "#f7f7f7", marginTop: 80 }} >
              <div className="app" style={isMobile ? appStyleMobile : appStyleDesktop}>
                <Route  exact path="/appointments" render={(props) => {
                  if (!user.username) return <Redirect to="/" />
                  else return <Appointments {...props} user={user} />
                }}
                />
                <Route  exact path="/settings" render={(props) => {
                  if (!user.username) return <Redirect to="/" />
                  else return <Settings {...props} user={user} />
                }}
                />
                <Route  exact path="/earnings" render={(props) => {
                  if (!user.username) return <Redirect to="/" />
                  else return <Earnings {...props} user={user} />
                }}
                />
                <Route  exact path="/jobs/:id" render={(props) => <ActiveJob {...props} user={user} handleJobCompletion={this.handleJobCompletion} isMobile={isMobile} isGapiReady={isGapiReady} /> } />
                <Route  exact path="/jobs" render={(props) => {
                  if (!user.username) return <Redirect to="/" />
                  else return <Jobs {...props} handleRefresh={this.handleRefresh} uncompletedJobs={uncompletedJobs} completedJobs={completedJobs} user={user} isMobile={isMobile} isGapiReady={isGapiReady} />
                }}
                />
                <Route  exact path="/" render={(props) => <Home {...props} user={user} isMobile={isMobile} isGapiReady={isGapiReady} uncompletedJobs={uncompletedJobs} completedJobs={completedJobs} /> } />
              </div>
            </Content>
          </Layout>
        </Layout>
    )
  }
}

const appStyleDesktop = {
  paddingTop: 10,
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
  minHeight: "100%"
}


const layoutStyleDesktop = {
  background: "#f7f7f7",
  minHeight: "100%"
}

export default App;
