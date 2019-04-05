import React, { Component } from 'react'
import { Statistic, Card, Col, Row } from 'antd';

export class Statistics extends Component {
  
getTotalServices = () => {
    this.props.days.map(day => {
        return day.events.length;
    })
}


render() {
    console.log(this.getTotalServices())
    return (
      <div>
        <Row> 
            <Col span={5} offset={9}>
                <Card style={{ textAlign: "center", marginRight: 5 }}>
                    <Statistic title="Total Revenue" value={4} />
                </Card>
            </Col>
            <Col span={5} >
                <Card style={{ textAlign: "center", marginRight: 5 }}>
                    <Statistic title="Total Services" value={this.getTotalServices()} />
                </Card>
            </Col>
            <Col span={5} >
                <Card style={{ textAlign: "center" }}>
                    <Statistic title="Total Miles" value={this.getTotalServices()} />
                </Card>
            </Col>
        </Row>
      </div>
    )
  }
}

export default Statistics
