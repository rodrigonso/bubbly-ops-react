import React, { Component } from 'react'
import { PageHeader, Steps, Button, Icon } from 'antd';
import JobData from './jobSteps/JobData';
import TextMessage from './jobSteps/TextMessage';
import CompleteJob from './jobSteps/EndJob';
import axios from 'axios'
import moment from 'moment'

const { Step } = Steps

export class ActiveJob extends Component {

    state = {
        activeJob: {},
        services: [],
        currentStep: 1,
        vehicleType: "",
        upgrades: [],
        make: "",
        model: "",
        rating: 0,
        price: {}
    }

    async componentDidMount() {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/services`)
        this.setState({ services: data })

        const activeJobData = JSON.parse(localStorage.getItem("activeJobData"))
        if (activeJobData) {
          const { vehicleType, make, model, rating } = activeJobData
          this.setState({ vehicleType, make, model, rating }) 
        }

        const currentStep = JSON.parse(localStorage.getItem("currentStep"))
        if (currentStep) this.setState({ currentStep })

        const activeJob = JSON.parse(localStorage.getItem("activeJob"))
        console.log(activeJob)
        if (activeJob) this.setState({ activeJob })
    }

    nextStep = (data) => {
      const { activeJob } = this.state
      if (data.make) {
        const { make, model, rating, vehicleType } = data
        this.setState({ make, model, rating, vehicleType })
        localStorage.setItem("activeJobData", JSON.stringify(data))
      }

      this.setState({ currentStep: this.state.currentStep + 1 })
      localStorage.setItem("currentStep", this.state.currentStep + 1)
    }

    handleBack = () => {
        localStorage.removeItem("activeJob")
        localStorage.removeItem("currentStep")
        localStorage.removeItem("activeJobData")
        this.props.history.push("/jobs")
    }

    handleUpgrade = (e) => {
      const value = e.target.value
      const upgrades = [...this.state.upgrades, value]

      this.setState({ upgrades })
    }

    calculateJobPrice = () => {
        const { make, model, rating, vehicleType, services, upgrades, activeJob } = this.state

        const summary = activeJob.jobData.summary.split(" ")
        const serviceName = summary.slice(0,2).toString().replace(/,/g, "")
    
        const service = services.map(service => {
          if (vehicleType === service.vehicleType && serviceName === service.slug) {
            console.log(service)
            return service
          }
          if (vehicleType === service.vehicleType && serviceName === service.slug ) {
            console.log(service)
            return service
          } 
        })
        const res = service.filter(item => item != null)
        console.log(res)

        const obj = {
          id: activeJob.jobData.id,
          upgrades,
          vehicleType: { make, model, vehicleType, rating },
          serviceType: res[0],
          summary: this.formatSummary(),
          date: moment(activeJob.jobData.start.dateTime).format("l"),
          start: moment(activeJob.jobData.start.dateTime).format("LT"),
          location: activeJob.jobData.location,
          jobData: activeJob.jobData
        }
        console.log(obj)
        return obj
    }

        
    handleCompletion = async() => {
      const job = this.calculateJobPrice()
      this.setState({ currentStep: 0 })
      this.props.handleJobCompletion(job)
      localStorage.removeItem("activeJobData")
      localStorage.removeItem("currentStep")
      localStorage.removeItem("activeJob")
      this.props.history.push("/jobs")
    }

    formatSummary = () => {
      const { activeJob } = this.state
      if (!activeJob.jobData.summary) return "not found"
  
      const summary = activeJob.jobData.summary.split(" ")
      const final = summary.slice(0, 4)
      return final.join(" ")
    }
    

  render() {
    const { make, model, rating, currentStep } = this.state
    const activeJob = JSON.parse(localStorage.getItem("activeJob"))
    return (
        <div style={{ width: "100%" }}  >
            <PageHeader onBack={this.handleBack} title="Active Job" backIcon={<Icon type="close"/>} style={{ borderRadius: 5 }}  />
            <div style={{ padding: 24, margin: "auto", backgroundColor: "#fff", borderRadius: 5 }} >
                <Steps size="small" current={currentStep} style={{ fontWeight: 700 }} >
                  <Step title="Text Customer"  /> 
                  <Step title="Customer Details" /> 
                  <Step title="Finish" /> 
                </Steps>
                <div className="content" style={{ marginTop: 20 }} >
                  {this.state.currentStep === 0 ? <TextMessage activeJob={activeJob} nextStep={this.nextStep} /> : null}
                  {this.state.currentStep === 1 ? <JobData handleInput={this.handleInput} nextStep={this.nextStep} make={make} model={model} rating={rating} handleRate={this.handleRate} handleSelect={this.handleSelect} /> : null}
                  {this.state.currentStep === 2 ? <CompleteJob handleCompletion={this.handleCompletion} handleUpgrade={this.handleUpgrade} /> : null}
                </div> 
            </div>
        </div>
    )
  }
}

export default ActiveJob
