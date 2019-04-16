import React, { Component } from 'react'
import { Collapse, Steps, Typography, Input, Button, Icon, Empty, Card, Form, Select, Rate } from 'antd';
import { getEventsById } from '../../services/eventsService';
import TextMessage from '../textMessage/TextMessage'
import JobCard from '../jobCard/JobCard';
import axios from 'axios'

const { Step } = Steps;
const { Text } = Typography;
const { Option } = Select;

export class CurrentJobs extends Component {
    state = {
        services: [],
        jobs: [],
        currentStep: 0,
        make: "",
        model: "",
        start: "",
        end: "",
        isLoading: false,
        rating: 3.5
    }

    async componentDidMount() {
        const startOfDay = new Date()
        startOfDay.setHours(0,0,0,0)
      
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 0, 0)
      
        const range = [startOfDay, endOfDay]
        this.setState({ range })

        this.setState({ user: this.props.user })
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/services`)
        this.setState({ services: data })

        if (this.props.isGapiReady) this.getCurrentJobs()
      }

      componentDidUpdate(prevProps) {
          if (prevProps.isGapiReady !== this.props.isGapiReady) {
              this.getCurrentJobs()
          }
      }

      getCurrentJobs = async () => {

        try {
            this.setState({ isLoading: true })
            const allJobs = await getEventsById(this.props.user.email, this.state.range)
            const completedJobs = await allJobs.map(async job => {
                const newJob = { jobData: job }
                const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/jobs/getJob/${job.id}`, newJob)
                return data
                })
                const res = await Promise.all(completedJobs)
                const uncompletedJobs = res.filter(item => item !== '')
                console.log(res)
                console.log(uncompletedJobs)
                this.setState({ jobs: uncompletedJobs })
        } catch (ex) {
            console.log(ex)
        } finally {
            this.setState({ isLoading: false })
        }
      }

      nextStep = () => {
        this.setState({ currentStep: this.state.currentStep + 1 })
      }
    
      handleInput = (e) => {
        const field = e.target.placeholder
        if (field === "Ford") this.setState({ make: e.target.value })
        else this.setState({ model: e.target.value })
      }

      handleJobStart = () => {
        const start = new Date()
        this.setState({ start })
        this.nextStep()
      }
    
      handleJobCompletion = (job) => {
        const end = new Date()
        this.setState({ end })
    
        this.props.handleJobCompletion(job)
        this.setState({ currentStep: 0 })
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
    
    handleSelect = (value, job) => {
      console.log(value)
      job.vehicleType = { type: value, make: this.state.make, model: this.state.model }
      console.log(job)

      const serviceType = this.calculateJobPrice(job)
      job.serviceType = serviceType
      console.log(job)
      this.handleVehicleType(job)
    }

    handleRate = (value) => {
      this.setState({ rating: value })
    }


    renderCurrentStep = (job) => {
        if (this.state.currentStep === 0) {
          return <TextMessage job={job} nextStep={this.nextStep} user={this.props.user} />
        } else if (this.state.currentStep === 1) {
          return (
            <div style={{width: 300, marginBottom: 20 }} >
              <Card style={{ borderRadius: 5 }} >
                <Form>
                  <Form.Item>
                    <Input placeholder="Ford" value={this.state.make} onChange={this.handleInput} />
                  </Form.Item>
                  <Form.Item>
                    <Input placeholder="F-150" value={this.state.model} onChange={this.handleInput} />
                  </Form.Item>
                  <Form.Item>
                    <Select placeholder="Sedan" onChange={(value) => this.handleSelect(value, job)} >
                      <Option value="Sedan">Sedan</Option>
                      <Option value="Non-Sedan">Non-Sedan</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Rate the vehicle" >
                    <Rate style={{ margin: "auto" }} value={this.state.rating} onChange={this.handleRate} />
                  </Form.Item>
                </Form>
              </Card>
            </div>
          )
        } else {
          return (
            <div style={{ marginTop: 10, marginBottom: 20, marginLeft: 100 }} >
              <Button type="danger" onClick={() => this.handleJobCompletion(job)} ><Icon type="file-done" />End Job</Button>
            </div>
          ) 
        }
      }

      calculateJobPrice = (job) => {
        const { services } = this.state
        const summary = job.jobData.summary.split(" ")
        const serviceName = summary.slice(0,2).toString().replace(/,/g, "")
        console.log(serviceName)
    
        const service = services.map(service => {
          if (job.vehicleType.type === service.vehicleType && serviceName === service.slug) {
            console.log(service)
            return service
          }
          if (job.vehicleType.type === service.vehicleType && serviceName === service.slug ) {
            console.log(service)
            return service
          } 
        })
        const res = service.filter(item => item != null)
        console.log(res)
        return res[0]
      }

  render() {
      const { jobs, currentStep } = this.state
      if (jobs.length < 0) return (
        <div style={{ padding: 50, backgroundColor: "#fff", textAlign: "center", borderRadius: 5, marginTop: 20 }}>
            <Empty description="All caught up!" />
        </div>
      ) 
    return (
    <div style={{ marginTop: 20 }} >
        <Collapse bordered={false} accordion >
          {jobs.length > 0 ? jobs.map(job => {
            return (
            <Collapse.Panel key={job.start} style={{ border: 0, borderTop: "4px solid #f7f7f7", marginLeft: -40, marginRight: -20}} header={<JobCard job={job} isMobile={true} /> }>
              <div style={{ marginLeft: 40 }}>
                <Steps size="small" style={{ fontSize: 12 }} current={currentStep} >
                  <Step title={<Text type="secondary" style={{ fontSize: 12 }} >Notify Customer</Text>} />
                  <Step title={<Text type="secondary" style={{ fontSize: 12 }} >Add Info</Text>} />
                  <Step title={<Text type="secondary" style={{ fontSize: 12 }} >End Job</Text>} />
                </Steps>
                <div className="steps-content" >
                  {this.renderCurrentStep(job)}
                </div>
                <Button style={{ width: "95%" }} type="primary" onClick={this.nextStep}  >Next</Button>
              </div> 
            </Collapse.Panel>
            )
          }) : null }
        </Collapse>
      </div>
    )
  }
}

export default CurrentJobs
