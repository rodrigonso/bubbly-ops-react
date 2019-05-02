import React, { Component } from 'react'
import { PageHeader, Steps, Button, Icon } from 'antd';
import JobData from './jobSteps/JobData';
import TextMessage from './jobSteps/TextMessage';
import CompleteJob from './jobSteps/EndJob';
import axios from 'axios'

const { Step } = Steps

export class ActiveJob extends Component {

    state = {
        services: [],
        currentStep: 0,
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
    }

    nextStep = (data) => {
      if (data) {
        const { make, model, rating, vehicleType } = data
        this.setState({ make, model, rating, vehicleType })
      }

      this.setState({ currentStep: this.state.currentStep + 1 })
    }

    handleBack = () => {
        this.props.history.push("/jobs")
    }

    handleUpgrade = (e) => {
      const value = e.target.value
      const upgrades = [...this.state.upgrades, value]

      this.setState({ upgrades })
    }

    calculateJobPrice = () => {
        const { make, model, rating, vehicleType, services, upgrades } = this.state
        const { job } = this.props.location.state

        const summary = job.jobData.summary.split(" ")
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
            upgrades,
            vehicleType: { make, model, vehicleType, rating },
            serviceType: res[0],
            jobData: job.jobData
        }
        console.log(obj)
        return obj
    }

        
    handleCompletion = async() => {
        const job = this.calculateJobPrice()
        this.setState({ currentStep: 0 })
        this.props.handleJobCompletion(job)
        this.props.history.push("/jobs")
    }

    formatSummary = () => {
      const { job } = this.props.location.state
      if (!job.jobData.summary) return "not found"
      const regex = /[^0-9]/g;
      const summary = job.jobData.summary.match(regex);
    
      return summary;
    }
    

  render() {
      const { make, model, rating, currentStep } = this.state
      const { job } = this.props.location.state
    return (
        <div style={{ width: "100%" }}  >
            <PageHeader onBack={this.handleBack} title="Active Job" backIcon={<Icon type="close"/>} style={{ borderRadius: 5 }}  />
            <div style={{ padding: 24, margin: "auto", backgroundColor: "#fff", borderRadius: 5 }} >
                <Steps size="small" current={currentStep} >
                    <Step title="Text Customer" /> 
                    <Step title="Customer Details" /> 
                    <Step title="Finish" /> 
                </Steps>
                <div className="content" style={{ marginTop: 20 }} >
                  {this.state.currentStep === 0 ? <TextMessage job={this.props.location.state.job} nextStep={this.nextStep} /> : null}
                  {this.state.currentStep === 1 ? <JobData handleInput={this.handleInput} nextStep={this.nextStep} make={make} model={model} rating={rating} handleRate={this.handleRate} handleSelect={this.handleSelect} /> : null}
                  {this.state.currentStep === 2 ? <CompleteJob handleCompletion={this.handleCompletion} handleUpgrade={this.handleUpgrade} /> : null}
                </div> 
            </div>
        </div>
    )
  }
}

export default ActiveJob
