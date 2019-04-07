import React, { Component } from 'react'
import EventCard from '../eventCard/EventCard'
import { Collapse, Card, Badge, Statistic, Row, Col, Button, Divider, Tooltip, Icon } from 'antd';

const { Panel } = Collapse;

export class Weekday extends Component {
  state = { 
    validatedAppointments: [],
    isValidated: false
  }

getFinalDistance = () => {
  const lastEvent = this.props.events[this.props.events.length -1];

  if (lastEvent && lastEvent.distances.rows[1]) {
    const value = lastEvent.distances.rows[1].elements[1].duration.text
    return parseInt(value, 10)
  } else {
    return "Not Found"
  }
}


getTotalDriving = () => {
  const distances = this.props.events.map(event => {
    const length = event.distances.rows.length
    
    if (length === 1) {
      return event.distances.rows[0].elements[0].duration.text
    } else if (length === 2) {
      return event.distances.rows[0].elements[0].duration.text
    } else {
      return "No distances found"
    }
  })

  const numbers = distances.map((item, i) => {
    return parseInt(item, 10)
  })

  if (numbers.length === 0) return 0
  const sum = numbers.reduce((a, b) => a + b) + this.getFinalDistance()

  return sum
}

recieveData = (event) => {
  const arr = [...this.state.validatedAppointments]
  arr.push(event)
  this.setState({ validatedAppointments: arr })
}

formatVehicleType = (type) => {
  const vehicleTypes = this.state.vehicleTypes;
  const nonSedans = vehicleTypes.filter(item => item === "Non-Sedan")
  const sedans = vehicleTypes.filter(item => item === "Sedan")

  if (type === "Sedans") return sedans.length
  if (type === "Non-Sedans" ) return nonSedans.length
}

getTotalRevenue = () => {
  const numbers = this.state.validatedAppointments.map(event => event.price.price)

  if (numbers.length > 0) {
    const sum = numbers.reduce((a, b) => a + b)

    this.props.days[this.props.day].revenue = sum
    return sum

  } else {
    return 0
  }
}

getTotalHours = () => {
  const numbers = this.state.validatedAppointments.map(event => event.duration)

  if (numbers.length > 0) {
    const sum = numbers.reduce((a, b) => a + b)
    return sum
  } else {
    return 0
  }
}

handleValidate = () => {
  const dayIndex = this.props.day

  const hours = this.getTotalHours()
  const revenue = this.getTotalRevenue()
  const driving = this.getTotalDriving() / 60

  const data = [
    { name: "hours", value: hours},
    { name: "revenue", value: revenue},
    { name: "driving", value: driving},
  ]
  this.setState({ isValidated: true })
  this.props.sendData(data, dayIndex)
}

renderValidateBadge = () => {
  if (this.state.isValidated) return (
    <React.Fragment>
      <Badge count={this.props.events.length} style={customBadgeStyle} />
      <span><i style={validatedIcon} className="fas fa-check-circle"></i></span>
    </React.Fragment>
  )
  else return <div className="panel-extras"><Badge count={this.props.events.length} style={customBadgeStyle} /></div>
}

  render() {
    return (
      <Panel key="1" {...this.props} header={this.props.name} style={customPanelStyle} extra={this.renderValidateBadge()} >
        {this.props.events.map(event => {
          return <EventCard sendData={this.recieveData} key={event.id} event={event} />
        })}
        <Card size="small" style={cardStyle} >
          <Row>
            <Col span={4}>
              <Statistic title="Total Driving" value={this.getTotalDriving() > 60 ? this.getTotalDriving() / 60 : this.getTotalDriving()} suffix={this.getTotalDriving() > 60 ? "hours" : "mins"} />
            </Col>
            <Col span={4}>
              <Statistic title="Total Services" value={this.props.events.length} suffix="/5" />
            </Col>
            <Col span={4}>
              <Statistic title="Total Revenue" value={this.getTotalRevenue()} prefix="$" />
            </Col>
            <Col span={4}>
              <Statistic title="Total Hours" value={this.getTotalHours()} suffix="hours" />
            </Col>
            <Col span={1}>
              <Divider type="vertical" style={{ height: 60 }} />
            </Col>
            <Col offset={2} span={4}>
              <Tooltip title="Confirm changes">
                <Button onClick={this.handleValidate} style={{ marginTop: 15 }} disabled={this.state.isValidated ? true : false} type="secondary" icon="check">Validate</Button>
              </Tooltip>
            </Col>
          </Row>
        </Card>
      </Panel>
    )
  }
}

const customBadgeStyle = {
    background: '#2c3e50',
    marginBottom: 6
  };

  const validatedIcon = {
    color: "#27ae60",
    fontSize: 20,
    marginLeft: 5, 
    marginTop: 5
  }

  const customPanelStyle = {
    background: "#fff",
    borderRadius: 4,
    marginBottom: 5,
    border: 0,
    overflow: "hidden"
  };

  const cardStyle = {
    padding: 20,
    marginLeft: -17, 
    marginRight: -17,
    border: 0,
    borderTop: "4px solid #f7f7f7"
  }

export default Weekday;
