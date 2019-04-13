import React, { Component } from 'react';
import { Card, Row, Col, Typography, Icon, Button, Input, Badge, Divider, List, Drawer, Tag } from 'antd';
import dateFormat from 'dateformat';
import axios from 'axios';
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
    const { job, isMobile } = this.props;
      return (
        <React.Fragment>
            <Card size="small" type="plus-circle" theme="outlined" style={cardStyle} >
            <div style={{ padding: 10 }}>
              <p>{this.formatSummary()}</p>
               <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr" }} >
                <div>
                  <Icon type="environment" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{job.jobData.location}</Text>
                  <br />
                  <Icon type="clock-circle" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{this.formatDate()}</Text> 
                  <br />
                  <Icon type="car" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{this.formatVehicleInfo()}</Text>
                </div>
                {isMobile ? null : <Badge count={this.formatPrice()} style={{ backgroundColor: "#2c3e50" }} />}
                {this.props.job.isCompleted ? null : <Button type="primary" >Begin<Icon type="caret-down" /></Button>}
                </div> 
              </div>
            </Card>
         </React.Fragment>
      )
  }
}

const dividerStyle = {
  height: 80
}

const badgeStyle = {
  backgroundColor: "#2c3e50",
  borderRadius: 5
}

const cardStyle = {
  minHeight: 150,
  border: 0,
  borderBottom: "2px solid #f7f7f7",
}

export default JobCard