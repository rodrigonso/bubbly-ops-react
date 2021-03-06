import React, { Component } from 'react'
import { PageHeader, Steps, Icon, Spin, Button } from 'antd';
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
    currentStep: 0,
    vehicleType: "",
    upgrades: [],
    make: "",
    model: "",
    rating: 0,
    price: {},
    isLoading: false
  }

  async componentDidMount() {
    const { user } = this.props

    const { data: services } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/services`)
    this.setState({ services })

    try {
      this.setState({ isLoading: true })
      const { data: employee } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees/${user.employeeId}`)

      if (employee.jobInProgress) {
        this.setState({ activeJob: employee.jobInProgress })
      }

      if (!employee.jobInProgress) {
        return this.props.history.push("/jobs")
      }

      if (employee.jobInProgress.currentStep === 3) {
        this.setState({ activeJob: {} })
      } 

      if (employee.jobInProgress.currentStep) {
        this.setState({ currentStep: employee.jobInProgress.currentStep })
      }

      if (employee.jobInProgress.currentStep === 3) {
        this.props.history.push("/jobs")
      }
    } catch (ex) {
      console.log(ex)
    } finally {
      this.setState({ isLoading: false })
    }

    const activeJobData = JSON.parse(localStorage.getItem("activeJobData"))
    if (activeJobData) {
      const { vehicleType, make, model, rating } = activeJobData
      this.setState({ vehicleType, make, model, rating }) 
    }
  }

    getCustomersEmail = (job) => {
      console.log(job.jobData)
      const regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
      const email = job.jobData.description.match(regex)
      return email[0]
    }

    nextStep = async(data) => {
      const { activeJob } = this.state
      const { user } = this.props
      if (data.make) {
        const { make, model, rating, vehicleType } = data
        this.setState({ make, model, rating, vehicleType })
        localStorage.setItem("activeJobData", JSON.stringify(data))
      }

      this.setState({ currentStep: this.state.currentStep + 1 })
      localStorage.setItem("startTime", new Date())

      const jobInProgress = {
        currentStep: this.state.currentStep + 1,
        start: new Date(),
        jobData: activeJob.jobData
      }
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_API}/employees/${user.employeeId}`, jobInProgress)
      console.log(res)
    }

    handleBack = () => {
        const { user } = this.props
        axios.put(`${process.env.REACT_APP_BACKEND_API}/employees/${user.employeeId}`, {})
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
        const { user } = this.props

        const summary = activeJob.jobData.summary.split(" ")
        const serviceName = summary.slice(0,2).toString().replace(/,/g, "")
    
        const service = services.map(service => {
          if (vehicleType === service.vehicleType && serviceName === service.slug) {
            return service
          }
          if (vehicleType === service.vehicleType && serviceName === service.slug ) {
            return service
          }
          else return 
        })
        const res = service.filter(item => item != null)

        const obj = {
          id: activeJob.jobData.id,
          employeeId: user.employeeId,
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
      const { user } = this.props
      const job = this.calculateJobPrice()
      this.setState({ currentStep: 0 })
      this.props.handleJobCompletion(job)
      localStorage.removeItem("activeJobData")
      this.props.history.push("/jobs")

      const start = localStorage.getItem("startTime")

      const jobInProgress = {
        isCompleted: true,
        currentStep: 3,
        start,
        end: new Date(),
        jobData: job
      }

      // update job status in db
      await axios.put(`${process.env.REACT_APP_BACKEND_API}/employees/${user.employeeId}`, jobInProgress)

      // send email survey to customer
      await axios.post(`${process.env.REACT_APP_BACKEND_API}/survey`, {
        email: this.getCustomersEmail(job),
        employeeId: user.employeeId,
        serviceId: job.jobData.id
      })
    }

    formatSummary = () => {
      const { activeJob } = this.state
      if (!activeJob.jobData.summary) return "not found"
  
      const summary = activeJob.jobData.summary.split(" ")
      const final = summary.slice(0, 4)
      return final.join(" ")
    }
    

  render() {
    const { make, model, rating, currentStep, activeJob, isLoading } = this.state

    if (isLoading) return <Spin style={{ marginTop: "40vh" }} indicator={<Icon type="loading"/> } />
    if (!activeJob.jobData) {
      return null
    } 
    else return (
        <div style={{ width: "100%" }}  >
            <PageHeader onBack={this.handleBack} title="Active Job" backIcon={<Icon type="close"/>} style={{ borderRadius: 5 }} extra={currentStep === 0 ? <Icon onClick={this.nextStep} type="arrow-right">Skip</Icon> : null }  />
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
