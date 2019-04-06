import React, { Component } from 'react';
import { Card, Row, Col, Typography, Badge, Button, Popover, Input, message, Divider, List, Drawer, Select, Tag } from 'antd';
import { getDistances } from '../../services/eventsService';
import dateFormat from 'dateformat';
import axios from 'axios';

const { Text } = Typography;
const { Option } = Select;
const { CheckableTag } = Tag
const { TextArea } = Input

export class EventCard extends Component {
  state = {
    visible: false,
    input: '',
    vehicleType: {},
    serviceType: {},
    services: [
      { name: "AmazingDetail", duration: 1.5,  types: [ { name: "Sedan", price: 59 }, { name: "Non-Sedan", price: 79 } ] },
      { name: "SuperiorDetail", duration: 1.75, types: [ { name: "Sedan", price: 99 }, { name: "Non-Sedan", price: 119 } ] },
      { name: "BubblyPro", duration: 2.5, types: [ { name: "Sedan", price: 159 }, { name: "Non-Sedan", price: 189 } ] },
      { name: "BubblyShowroom", duration: 3.5, types: [ { name: "Sedan", price: 249 }, { name: "Non-Sedan", price: 289 } ] },
    ]
  }


// formats the event date to display only time
formatDate = () => {
  const { event } = this.props
  const startTime = event.start.dateTime;
  const endTime = event.end.dateTime;
  const date = `${dateFormat(startTime, 'hh:MM TT')} - ${dateFormat(endTime, "hh:MM TT")}`;

  return <span><i style={{ color: "#2c3e50" }} className="fas fa-clock"></i> <span> {date}</span></span>
}

// formats vehicle information to display only the vehicle make & model
formatVehicleInfo = () => {
  const { event } = this.props
  if (!event.description) return "Not Provided";
  const regex = /\s\w*/g;
  let str = event.description.match(regex);

  const car = str.slice(12, 14);
  if (car.length > 0 ) return car;
  return "Not Provided"
}

// formats the summary property of event to display only the service name and the customer's name
formatSummary = () => {
  const { event } = this.props
  if (!event.summary) return "not found"
  const regex = /[^0-9]/g;
  const summary = event.summary.match(regex);

  return summary;
}

// formats the location property of event
formatLocation = () => {
  const { event } = this.props;
  return <span><i style={{ color: "#2c3e50" }} className="fas fa-map-marker-alt"></i> <span> {event.location}</span></span>
}

// opens and closes the drawer
handleDrawer = () => {
  this.setState({ visible: !this.state.visible })
}

// sends text message
handleTextSend = async() => {
  const { input } = this.state
  const obj = {
    to: "18329298338",
    text: input
  }

  try {
    console.log(process.env.REACT_APP_BACKEND_API)
    const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/sms`, obj)
    console.log(data);
    message.success("Your message was sent!")
  } catch(ex) {
    console.log(ex);
    message.error("Something went wrong!")
  }
  this.setState({ input: '', visible: false })
}

// handles change in input for text message
handleChange = (e) => {
  const value = e.target.value;
  this.setState({ input: value });
}

handleVehicleType = (value) => {
  this.setState({ vehicleType: value })

  const test = this.props.event.summary.split(' ')
  const test2 = test.splice(0, 2)
  const test3 = test2.join('')

  console.log(test3)
  const service = this.state.services.filter(service => service.name === test3 )
  const final = service.map(item => {
    const price = item.types.filter(type => type.name === value)
    return { name: item.name, price: price[0], duration: item.duration}
  })
  

  this.props.sendData(final[0])
}


  render() {
    const { event } = this.props;
    const { visible, input } = this.state
    if (!event.summary || !event.distances.rows[0]) return null;
    if (event.organizer.email === "gustavo.e.hernandez@shell.com") return null;
      return (
          <React.Fragment>
            <Drawer title="More Options" closable={true} onClose={this.handleDrawer} visible={visible} >
              <List>
                <List.Item>
                  <div style={{ marginTop: 20 }}>
                    <h4>Send SMS to customer</h4>
                    To: <Input disabled={true} value="+1 (832) 929-8338" style={{ marginBottom: 10 }} />
                    Message: <TextArea placeholder="Message Here" value={input} onChange={(e) => this.handleChange(e)} />
                    <Button onClick={this.handleTextSend} style={{ marginTop: 10, width: "100%" }} >Send</Button>
                  </div>
                </List.Item>
              </List>
            </Drawer>
            <Card size="small" type="plus-circle" theme="outlined" style={cardStyle} >
              <Row>
                <Col span={10} style={{ textAlign: "left" }}>
                  <h3>{this.formatSummary()}</h3>
                  <p style={{ fontSize: 12 }} >{this.formatLocation()}</p>
                  <p style={{ fontSize: 12 }} >{this.formatDate()}</p> 
                </Col>
                <Col span={1}>
                  <Divider type="vertical" style={dividerStyle} />
                </Col>
                <Col span={7} style={{ textAlign: "center", marginRight: 5 }}>
                    <p style={{ fontSize: 12 }}>More Info</p>
                    <Text code>{this.formatVehicleInfo()}</Text>
                    <br/>
                    <CheckableTag style={{ marginTop: 10 }} onChange={() => this.handleVehicleType("Sedan")} checked={this.state.vehicleType === "Sedan" ? true : false} >Sedan</CheckableTag>
                    <CheckableTag onChange={() => this.handleVehicleType("Non-Sedan")} checked={this.state.vehicleType === "Non-Sedan" ? true : false} >Non-Sedan</CheckableTag>                   
                    <br/>
                    <Badge style={badgeStyle} count={event.distances ? event.distances.rows[0].elements[0].duration.text : "No elements"} />
                </Col>
                <Col span={1}>
                  <Divider type="vertical" style={dividerStyle} />
                </Col>
                <Col span={1} offset={2} style={{ textAlign: "center", marginTop: 30 }}>
                  <i className="fas fa-ellipsis-h" onClick={this.handleDrawer} onClose={this.handleDrawer} style={{ cursor: "pointer" }} ></i>
                </Col>
              </Row>
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
  marginTop: 10,
  borderRadius: 5
}

const cardStyle = {
  padding: 20,
  minHeight: 150,
  marginLeft: -17, 
  marginRight: -17,
  marginBottom: -2,
  border: 0,
  borderBottom: "2px solid #f7f7f7",
  borderTop: "4px solid #f7f7f7"
}

export default EventCard



/*
  if (test3 === "AmazingDetail" && value === "Sedan") return this.props.sendData(59)
  if (test3 === "AmazingDetail" && value === "Non-Sedan") return 79
  if (test3 === "SuperiorDetail" && value === "Sedan") return 99
  if (test3 === "SuperiorDetail" && value === "Non-Sedan") return 119
  if (test3 === "BubblyPro" && value === "Sedan") return 159
  if (test3 === "BubblyPro" && value === "Non-Sedan") return 189
  if (test3 === "BubblyShowroom" && value === "Sedan") return 249
  if (test3 === "BubblyShowroom" && value === "Non-Sedan") return 289
  */