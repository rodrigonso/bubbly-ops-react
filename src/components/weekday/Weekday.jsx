import React, { Component } from 'react'
import JobCard from '../jobCard/JobCard'
import { Collapse, Card, Badge, Statistic, Row, Col, Button, Divider, Tooltip, Icon } from 'antd';

const { Panel } = Collapse;

export class Weekday extends Component {
  state = { 
    validatedAppointments: [],
    isValidated: false
  }

getFinalDistance = () => {
  const { events } = this.props;
  const lastEvent = events[events.length -1];

  if (lastEvent && lastEvent.distances.rows[1]) {
    const value = lastEvent.distances.rows[1].elements[1].duration.text
    return parseInt(value, 10)
  } else {
    return "Not Found"
  }
}


getTotalDriving = () => {
  const { validatedAppointments } = this.state;
  const distances = validatedAppointments.map(event => {
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
  return numbers.reduce((a, b) => a + b) + this.getFinalDistance()
}

recieveData = (event) => {
  const arr = [...this.state.validatedAppointments]
  arr.push(event)
  this.setState({ validatedAppointments: arr })
}

getTotalRevenue = () => {
  const { validatedAppointments } = this.state
  const numbers = this.state.validatedAppointments.map(event => event.service.price.price)

  if (numbers.length > 0) {
    const sum = numbers.reduce((a, b) => a + b)

    this.props.days[this.props.day].revenue = sum
    return sum

  } else {
    return 0
  }
}

getTotalHours = () => {
  const { validatedAppointments } = this.state
  const numbers = validatedAppointments.map(event => event.service.duration)

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
  const { events } = this.props
  if (this.state.isValidated) return (
    <React.Fragment>
      <Badge count={events.length} style={customBadgeStyle} />
      <span><i style={validatedIcon} className="fas fa-check-circle"></i></span>
    </React.Fragment>
  )
  else return <div className="panel-extras"><Badge count={events.length} style={customBadgeStyle} /></div>
}

  render() {
    const { events, isAdmin } = this.props
    const { isValidated } = this.state
    return (
      <Panel key="1" {...this.props} header={this.props.name} style={customPanelStyle} extra={this.renderValidateBadge()} >
        {events.map(event => {
          return <JobCard sendData={this.recieveData} key={event.id} event={event} />
        })}
        <Card size="small" style={cardStyle} >
          <Row>
            <Col span={4}>
              <Statistic title="Total Services" value={events.length} suffix="/5" />
            </Col>
            <Col span={4}>
              <Statistic title="Total Driving" value={this.getTotalDriving() > 60 ? Math.round((this.getTotalDriving() / 60) * 10 ) / 10 : this.getTotalDriving()} suffix={this.getTotalDriving() > 60 ? "hours" : "mins"} />
            </Col>
            <Col span={4}>
              <Statistic title="Total Hours" value={this.getTotalHours()} suffix="hours" />
            </Col>
            {isAdmin ? <Col span={4}>
              <Statistic title="Total Revenue" value={this.getTotalRevenue()} prefix="$" />
            </Col> : null}
            <Col span={1}>
              <Divider type="vertical" style={{ height: 60 }} />
            </Col>
            <Col offset={isAdmin ? 2 : 4} span={4}>
              <Tooltip title="Confirm changes">
                <Button onClick={this.handleValidate} style={{ marginTop: 15 }} disabled={isValidated} type="secondary" icon="check">Validate</Button>
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
