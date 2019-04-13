import React, { Component } from 'react'
import { Divider, Card, Tabs, Button, Steps, Row, Icon, Typography, Empty, Collapse, Input } from 'antd';
import { getEventsById, handleGoogleUser } from '../../services/eventsService';
import Login from '../common/Login';
import Register from '../common/Register'
import axios from 'axios';
import moment from 'moment'
import JobCard from '../jobCard/JobCard';
import TextMessage from '../textMessage/TextMessage';
import SedanSvg from '../common/svg/SedanSvg';

const { TabPane } = Tabs;
const { Step } = Steps;
const { Text } = Typography;

export class Home extends Component {
  state = {
    user: {},
    jobs: [],
    services: [],
    currentStep: 0,
    make: "",
    model: ""
  }

  async componentDidMount() {
    this.setState({ user: this.props.user })
    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/services`)
    this.setState({ services: data })
  }
 
  static getDerivedStateFromProps(props, state) {
    if (props.jobs !== state.jobs) {
      return {
        jobs: props.jobs,
      }
    }
    else return null
  }

  nextStep = () => {
    this.setState({ currentStep: this.state.currentStep + 1 })
  }

  handleInput = (e) => {
    const field = e.target.placeholder
    if (field === "Ford") this.setState({ make: e.target.value })
    else this.setState({ model: e.target.value })
  }

  handleSelect = (job, type) => {
    if (type === "Non-Sedan") job.vehicleType = { type, make: this.state.make, model: this.state.model } 
    if (type === "Sedan") job.vehicleType = { type, make: this.state.make, model: this.state.model } 

    console.log(job)

    const serviceType = this.calculateJobPrice(job)
    job.serviceType = serviceType
    console.log(job)
    this.props.handleVehicleType(job)
    this.nextStep()
  }

  calculateJobPrice = (job) => {
    const { services } = this.state
    const summary = job.jobData.summary.split(" ")
    const serviceName = summary.slice(0,2).toString().replace(/,/g, "")
    console.log(serviceName)

    const service = services.map(service => {
      if (job.vehicleType.type === service.vehicleType && serviceName === service.name) {
        console.log(service)
        return service
      }
      if (job.vehicleType.type === service.vehicleType && serviceName === service.name ) {
        console.log(service)
        return service
      } 
    })
    const res = service.filter(item => item != null)
    console.log(res)
    return res[0]
  }

  renderCurrentStep = (job) => {
    if (this.state.currentStep === 0) {
      return <TextMessage job={job} nextStep={this.nextStep} />
    } else if (this.state.currentStep === 1) {
      return (
        <div style={{ width: 200, marginLeft: 45, marginBottom: 20 }} >
          <Input placeholder="Ford" value={this.state.make} onChange={this.handleInput} />
          <br />
          <Input placeholder="F-150" value={this.state.model} onChange={this.handleInput} />
          <br />
          <Button onClick={() => this.handleSelect(job, "Sedan")} style={{ width: "100%", marginBottom: 5 }} >Sedan</Button> 
          <Button onClick={() => this.handleSelect(job, "Non-Sedan")} style={{ width: "100%" }} >Non-Sedan</Button> 
        </div>
      )
    } else {
      return (
        <div style={{ marginTop: 10, marginBottom: 20, marginLeft: 100 }} >
          <Button type="danger" onClick={() => this.props.handleJobCompletion(job)} ><Icon type="file-done" />End Job</Button>
        </div>
      ) 
    }
  }

  formatSummary = () => {
    const { currentService } = this.state
    if (!currentService.summary) return "not found"
    const regex = /[^0-9]/g;
    const summary = currentService.summary.match(regex);
    return summary;
  }

  formatVehicleInfo = () => {
    const { currentService } = this.state
    if (!currentService.description) return "Not Provided";
    const regex = /\s\w*/g;
    let str = currentService.description.match(regex);
  
    const car = str.slice(12, 14);
    if (car.length > 0 ) return car;
    return "Not Provided"
  }

  render() {
    const { user } = this.props
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
          {this.props.jobs.length > 0 ? <div style={{ marginTop: 20 }} >
            <Collapse bordered={false} accordion >
              {this.props.jobs.length > 0 ? this.props.jobs.map(job => {
                return (
                <Collapse.Panel style={{ border: 0, borderTop: "4px solid #f7f7f7", marginLeft: -40, marginRight: -20}} header={<JobCard job={job} isMobile={true} /> }>
                  <div style={{ marginLeft: 40 }}>
                    <Steps size="small" style={{ fontSize: 12 }} current={this.state.currentStep} >
                      <Step title={<Text type="secondary" style={{ fontSize: 12 }} >Notify Customer</Text>} />
                      <Step title={<Text type="secondary" style={{ fontSize: 12 }} >Put Info</Text>} />
                      <Step title={<Text type="secondary" style={{ fontSize: 12 }} >End Job</Text>} />
                    </Steps>
                    <div className="steps-content" >
                      {this.renderCurrentStep(job)}
                    </div>
                  </div> 
                </Collapse.Panel>
                )
              }) : null }
            </Collapse>
          </div> : <div style={{ padding: 50, backgroundColor: "#fff", textAlign: "center", borderRadius: 5, marginTop: 20 }}><Empty description="All caught up!" /></div>}
        </div>
    )
  }
}


export default Home
