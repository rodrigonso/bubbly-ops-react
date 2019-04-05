import React, { Component } from 'react'
import EventCard from '../eventCard/EventCard'
import { Collapse, Card, Badge, Statistic, Row, Col } from 'antd';

const { Panel } = Collapse;

export class Weekday extends Component {
  state = { 
    events: [],
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
  const arr = [...this.state.events]
  arr.push(event)
  this.setState({ events: arr })
}

formatVehicleType = (type) => {
  const vehicleTypes = this.state.vehicleTypes;
  const nonSedans = vehicleTypes.filter(item => item === "Non-Sedan")
  const sedans = vehicleTypes.filter(item => item === "Sedan")

  if (type === "Sedans") return sedans.length
  if (type === "Non-Sedans" ) return nonSedans.length
}

getTotalRevenue = () => {
  const numbers = this.state.events.map(event => event.price.price)

  if (numbers.length > 0) {
    const sum = numbers.reduce((a, b) => a + b)

    this.props.days[this.props.day].revenue = sum

    this.props.getWeekRevenue(this.props.days)
    return sum
  } else {
    return 0
  }
}

  render() {
    return (
      <Panel key="1" {...this.props} header={this.props.name} style={customPanelStyle} extra={<Badge style={customBadgeStyle} count={this.props.events.length} />} >
        {this.props.events.map(event => <EventCard sendData={this.recieveData} key={event.id} event={event} />)}
        <Card size="small" style={cardStyle} >
          <Row>
            <Col span={6}>
              <Statistic title="Total Driving" value={this.getTotalDriving()} suffix="mins" />
            </Col>
            <Col span={6}>
              <Statistic title="Total Services" value={this.props.events.length} suffix="/5" />
            </Col>
            <Col span={6}>
              <Statistic title="Total Revenue" value={this.getTotalRevenue()} prefix="$" />
            </Col>
          </Row>
        </Card>
      </Panel>
    )
  }
}

const customBadgeStyle = {
    background: '#2c3e50',
  };

  const customPanelStyle = {
    background: "#fff",
    borderRadius: 4,
    marginBottom: 10,
    border: 0,
    overflow: "hidden"
  };

  const cardStyle = {
    padding: 20,
    marginLeft: -17, 
    marginRight: -17,
    marginBottom: -2,
    border: 0,
    borderTop: "4px solid #f7f7f7"
  }

export default Weekday;


/*
        <React.Fragment>

            <Collapse style={{ backgroundColor: "#f7f7f7" }} >
            {this.props.days.map(day => {
              this.getTotal(day)
                return (
                    <Panel key={day.name} style={customPanelStyle} header={day.name} extra={<Badge count={day.events.length} style={customBadgeStyle} />} >
                        {day.events.map(event => <EventCard sendData2={this.recieveData2} sendData={this.recieveData} key={event.id} day={day} event={event} />)}
                        <Card size="small" style={cardStyle} >
                          <Row>
                            <Col span={6}>
                              <Statistic title="Total Driving" value={this.getTotal(day)} suffix="mins" />
                           </Col>
                           <Col span={6}>
                              <Statistic title="Total Services" value={day.events.length} suffix="/5" />
                           </Col>
                           <Col span={6}>
                              <Statistic title="Total Revenue" value={0} prefix="$" />
                           </Col>
                          </Row>
                        </Card>
                    </Panel>
                ) 
            })}
            </Collapse>
        </React.Fragment>
*/