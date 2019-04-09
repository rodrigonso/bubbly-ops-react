import React, { Component } from 'react'
import { Divider, Card, Tabs, Button, Steps, Row, Col, Empty } from 'antd';
import { getEventsById, handleGoogleUser } from '../../services/eventsService';
import Login from '../common/Login';
import Register from '../common/Register'
import axios from 'axios';
import moment from 'moment'
import EventCard from '../eventCard/EventCard';
import TextMessage from '../textMessage/TextMessage';

const { TabPane } = Tabs;
const { Step } = Steps;

export class Home extends Component {
  state = {
    currentWeather: {},
    currentDay: [],
    currentUser: {},
    currentService: {},
    currentStep: 0,
    servicesToday: [],
  }

  async componentDidMount() {
    this.getWeather()

    const user = this.props.user
    this.setState({ currentUser: user })

  } 

  getWeather = async() => {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Rio+de+Janeiro&APPID=07c7bdc00508ea683a1dfa480336d2f4`)
    this.setState({ currentWeather: data })
    console.log(data)
  }

  getServicesToday = async() => {

    const dt1 = new Date().setHours(0,0,0,0)
    const dt2 = new Date().setHours(24,0,0,0)
    const range = [dt1, dt2]

    const today = moment(dt1).format("dddd")

    console.log(this.state.currentUser)

    const services = await getEventsById(this.props.user.email, range)
    const servicesToday = services.filter(item => item.name === today)

    this.setState({ servicesToday: servicesToday[0].events })
    this.setState({ currentService: servicesToday[0].events[0] })
  }

  filterCurrentEvent = () => {

    const date = new Date().toTimeString()
    const currentTime = date.slice(0, 8)

    const test = this.state.servicesToday.filter(service => {
      const serviceStartDate = service.start.dateTime
      const serviceStartTime = serviceStartDate.slice(11, 19)

      const serviceEndDate = service.end.dateTime
      const serviceEndTime = serviceEndDate.slice(11, 19)

      return serviceStartTime < currentTime && serviceEndTime > currentTime
    })

    this.setState({ currentService: test[0] })
  }

  nextStep = () => {
    this.setState({ currentStep: this.state.currentStep + 1 })
  }

  nextService = () => {
    if (this.state.servicesToday.length === 0) return null

    this.setState({ currentStep: 0 })
    const test = this.state.servicesToday.filter((service, i) => i !== this.state.servicesToday.indexOf(this.state.currentService))
    this.setState({ servicesToday: test })
    this.setState({ currentService: test[0] })
  }

  renderCurrentStep = () => {
    if (this.state.currentStep === 0) {
      return <TextMessage event={this.state.currentService} nextStep={this.nextStep} />
    } else if (this.state.currentStep === 1) {
      return (
          <div style={{ marginLeft: 80, marginTop: 30 }}>
            <Button onClick={this.nextStep} size="large" shape="circle" type="primary"><i className="fas fa-truck-pickup"></i></Button>
            <p style={{ display: "inline", marginLeft: 10 }} >Sedan</p>
            <br/>
            <br/>
            <Button onClick={this.nextStep} size="large" style={{ margin: "auto", }} shape="circle" type="primary"><i className="fas fa-car-side"></i></Button>
            <p style={{ display: "inline", marginLeft: 10 }} >Non-Sedan</p>
          </div>
      )
    } else {
      return <Button onClick={this.nextService} style={{ marginLeft: 90, marginTop: 60 }} type="danger">End Service</Button>
    }
  }

  formatSummary = () => {
    const { currentService } = this.state
    if (!currentService.summary) return "not found"
    const regex = /[^0-9]/g;
    const summary = currentService.summary.match(regex);
    console.log(summary)
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
        <div className="home-body" >
          <h1 style={{ fontSize: 32 }}>Home</h1>
          <p>Welcome to Bubbly Operations Center, please login or register to get started.</p>
          <Divider />
          <div style={{ padding: 50, backgroundColor: "#fff", textAlign: "center", borderRadius: 5 }} >
            <h2>Welcome, {user.username}</h2>
          </div>
          <div className="home-load-services" style={{ padding: 24, backgroundColor: "#fff", borderRadius: 5, marginTop: 20 }} >
            <Button type="primary" onClick={this.getServicesToday}>Get Services</Button>
          </div>
          {this.state.currentService && this.state.currentService.summary ? <div className="home-steps" style={{ padding: 24, marginTop: 20, backgroundColor: "#fff" }}>
            <Steps size="small" current={this.state.currentStep}>
              <Step title="Text Customer">
              </Step>
              <Step title="Vehicle Type" />
              <Step title="Finish Service" />
            </Steps>
            <div className="home-step-content" style={{ marginTop: 60}} >
               <Row>
                <Col offset={1} span={10}  >
                  <Card bordered={false}>
                    <h4>Current Customer</h4>
                    <i style={{ color: "#2c3e50" }} className="fas fa-user"></i>
                    <p style={{ display: "inline", marginLeft: 10 }}>{this.formatSummary()} </p>
                    <br />
                    <br />
                    <i style={{ color: "#2c3e50" }} className="fas fa-map-marker-alt"></i>
                    <p style={{ display: "inline", marginLeft: 10 }}>{this.state.currentService.location} </p>
                    <br />
                    <br />
                    <i style={{ color: "#2c3e50" }} className="fas fa-car"></i>
                    <p style={{ display: "inline", marginLeft: 10 }}>{this.formatVehicleInfo()} </p>
                  </Card>
                </Col>
                <Col span={2}>
                  <Divider type="vertical" style={{ height: 80, marginTop: 40 }} />
                </Col>
                <Col span={10} >
                  {this.renderCurrentStep()}
                </Col>
              </Row>
            </div>
          </div> : <div style={{ padding: 24, marginTop: 20, backgroundColor: "#fff" }} ><Empty description="No Current Services" /></div>}
        </div>
    )
  }
}

export default Home
