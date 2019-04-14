import React, { Component } from 'react';
import { Card, Row, Col, Typography, Icon, Button, Input, Badge, Divider, List, Drawer, Tag } from 'antd';
import dateFormat from 'dateformat';
import moment from 'moment'
import TextMessage from '../textMessage/TextMessage';

const { Text } = Typography;
const { CheckableTag } = Tag
const { TextArea } = Input

export class JobCard extends Component {
  state = {
    visible: false,
    input: '',
  }


// formats the event date to display only time
formatDate = () => {
  const { job } = this.props
  const startTime = job.jobData.start.dateTime;
  const endTime = job.jobData.end.dateTime;
  const date = `${dateFormat(startTime, 'hh:MM TT')} - ${dateFormat(endTime, "hh:MM TT")}`;

  return date
}

// formats vehicle information to display only the vehicle make & model
formatVehicleInfo = () => {
  const { job } = this.props
  if (this.props.job.isCompleted) return `${job.vehicleType.make} ${job.vehicleType.model}`

  if (!job.jobData.description) return "Not Provided";
  const regex = /\s\w*/g;
  let str = job.jobData.description.match(regex);

  const car = str.slice(12, 14);
  if (car.length > 0 ) return car;
  return "Not Provided"
}

// formats the summary property of event to display only the service name and the customer's name
formatSummary = () => {
  const { job } = this.props
  if (!job.jobData.summary) return "not found"
  const regex = /[^0-9]/g;
  const summary = job.jobData.summary.match(regex);

  return summary;
}

// formats the location property of event
formatLocation = () => {
  const { event } = this.props;
  return <span><i style={{ color: "#2c3e50" }} className="fas fa-map-marker-alt"></i> <span> {event.location}</span></span>
}

formatPrice = () => {
  const { job } = this.props
  if (job.serviceType) return `$${job.serviceType.price}`
  else return "$0"
  
}

  render() {
    const { job, isMobile, isLoading } = this.props;
    if (isMobile) return (
      <React.Fragment>
      <Card size="small" type="plus-circle" theme="outlined" style={cardStyle} >
      <div style={{ padding: 10 }}>
         <div style={{ display: "grid", gridTemplateColumns: "70% 30%" }} >
          <div >
            <p>{this.formatSummary()}</p>
            <Icon type="environment" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{job.jobData.location}</Text>
            <br />
            <Icon type="clock-circle" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{this.formatDate()}</Text> 
            <br />
            <Icon type="car" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{this.formatVehicleInfo()}</Text>
          </div>
          <div style={{ margin: "auto" }} >
            {this.props.job.isCompleted ? null : <Button type="primary" style={{ marginRight: 10 }}  >Begin</Button>}
          </div>
          </div> 
        </div>
      </Card>
   </React.Fragment>
    )
    else return (
        <React.Fragment>
            <Card size="small" type="plus-circle" theme="outlined" style={cardStyle} >
            <div style={{ padding: 10 }}>
               <div style={{ display: "grid", gridTemplateColumns: "40% 40% 20%" }} >
                <div >
                  <p>{this.formatSummary()}</p>
                  <Icon type="environment" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{job.jobData.location}</Text>
                  <br />
                  <Icon type="clock-circle" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{this.formatDate()}</Text> 
                  <br />
                </div>
                <div style={{ margin: "auto" }} >
                  <br/>
                  <Icon type="dollar" style={{ marginRight: 5 }} />{this.formatPrice()}
                  <br />
                  <Icon type="car" style={{ marginRight: 5 }} />{this.formatVehicleInfo()}
                  <br />
                  <Icon type="calendar" style={{ marginRight: 5 }} />{moment(job.jobData.start.dateTime).format('L')}
                </div>
                <div style={{ margin: "auto" }} >
                  <Button type="danger" onClick={() => this.props.handleDelete(job)} loading={isLoading} >Delete</Button>
                </div>
                </div> 
              </div>
            </Card>
         </React.Fragment>
      )
  }
}

const badgeStyle = {
  fontSize: 12,
  padding: 5
}

const cardStyle = {
  minHeight: 150,
  border: 0,
  borderBottom: "2px solid #f7f7f7",
}

export default JobCard