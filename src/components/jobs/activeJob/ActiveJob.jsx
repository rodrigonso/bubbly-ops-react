import React, { Component } from 'react'
import { PageHeader, Steps, Button, message } from 'antd';
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
        make: "",
        model: "",
        rating: 0,
        price: {}
    }

    async componentDidMount() {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/services`)
        this.setState({ services: data })
    }

    nextStep = () => {
        this.setState({ currentStep: this.state.currentStep + 1 })
    }

    handleInput = (e) => {
    const field = e.target.placeholder
    if (field === "Ford") this.setState({ make: e.target.value })
    else this.setState({ model: e.target.value })
    }

    handleRate = (value) => {
        this.setState({ rating: value })
    }

    handleSelect = (e) => {
        this.setState({ vehicleType: e.target.value })
    }

    handleBack = () => {
        this.props.history.push("/jobs")
    }

    calculateJobPrice = () => {
        const { make, model, rating, vehicleType, services } = this.state
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
            vehicleType: { make, model, vehicleType, rating },
            serviceType: res[0],
            jobData: job.jobData
        }
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
        <div style={{ minWidth: 330 }}  >
            <PageHeader onBack={this.handleBack} title={this.formatSummary()} />
            <div style={{ padding: 24, margin: "auto", backgroundColor: "#fff", borderRadius: 5 }} >
                <Steps size="small" current={currentStep} >
                    <Step title="Text Customer" /> 
                    <Step title="Customer Details" /> 
                    <Step title="Finish" /> 
                </Steps>
                <div className="content" style={{ marginTop: 20 }} >
                  {this.state.currentStep === 0 ? <TextMessage job={this.props.location.state.job} /> : null}
                  {this.state.currentStep === 1 ? <JobData handleInput={this.handleInput} make={make} model={model} rating={rating} handleRate={this.handleRate} handleSelect={this.handleSelect} /> : null}
                  {this.state.currentStep === 2 ? <CompleteJob /> : null}
                  {this.state.currentStep < 2 ? 
                    <Button style={{ width: "100%", marginTop: 10 }} type="primary" onClick={this.nextStep}>Next</Button> 
                    : <Button style={{ width: "100%" }} type="danger" onClick={this.handleCompletion} >End Job</Button> }
                </div> 
            </div>
        </div>
    )
  }
}

export default ActiveJob
