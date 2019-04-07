import React, { Component } from 'react'
import { List, Divider, Statistic, Card, Row, Col, Button } from 'antd';
import axios from 'axios'
import moment from 'moment'

export class Dashboard extends Component {
    state = {
        weeks: [],
        totalRevenue: 0,
        totalServices: 0
    }

    async componentDidMount() {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/weeks`)
        this.setState({ weeks: data })
        console.log(data)
        this.getTotalRevenue()
        this.getTotalServices()
    }

    getTotalRevenue = () => {
        const total = this.state.weeks.map(week => week.totalRevenue)

        if (total.length > 0) {
            const sum = total.reduce((a, b) => a + b)
            this.setState({ totalRevenue: sum })
        } else {
            return 0
        }
    }

    getTotalServices = () => {
        const total = this.state.weeks.map(week => week.totalServices)
        if (total.length > 0) {
            const sum = total.reduce((a, b) => a + b)
            this.setState({ totalServices: sum })
        } else {
            return 0
        }
    }

    formatRange = (range) => {
        console.log(range)
        const date1 = moment(range[0]).format("MMM Do YYYY")
        const date2 = moment(range[1]).format("MMM Do YYYY")

        return `${date1} - ${date2}`
    }

    renderDescription = (item) => {
        console.log(item)
        return (
            <div>
                <i style={{ color: "#2c3e50", marginLeft: 5 }} className="fas fa-address-card"></i>  {item.detailer.name}
                <i style={{ color: "#2c3e50", marginLeft: 10 }} className="fas fa-clock"></i> {item.totalHours}
                <i style={{ color: "#2c3e50", marginLeft: 10 }} className="fas fa-dollar-sign"></i> {item.totalRevenue}
            </div>
        )
    } 

  render() {
    return (
        <div>
          <h1 style={{ fontSize: 32 }}>Dashboard</h1>
          <p>Welcome to Bubbly Operations Center, please login or register to get started.</p>
          <Divider />
          <Row>
            <Col span={8}>
                <div className="dashboard-total-revenue" style={{ padding: 24, backgroundColor: "#fff", borderRadius: 5 }} >
                    <Card bordered={false}>
                        <h3>Total Revenue</h3>
                        <Statistic value={this.state.totalRevenue} prefix="$" />
                    </Card>
                </div>
            </Col>
            <Col span={8}>
                <div className="dashboard-total-services" style={{ padding: 24, backgroundColor: "#fff", borderRadius: 5, marginLeft: 10 }} >
                    <Card bordered={false}>
                        <h3>Total Services</h3>
                        <Statistic value={this.state.totalServices} />
                    </Card>
                </div>
            </Col>
          </Row>

          <div style={{ padding: 24, backgroundColor: "#fff", textAlign: "center", borderRadius: 5, marginTop: 20 }} >
            <List dataSource={this.state.weeks} itemLayout="horizontal" renderItem={item => (
                <List.Item style={{ textAlign: "left", marginBottom: 10 }} >
                    <List.Item.Meta title={this.formatRange(item.range)} description={this.renderDescription(item)}/>
                    <div className="content" style={{ marginTop: 15 }} >
                        <Button style={{ marginRight: 10 }} shape="circle" ><i className="fas fa-chevron-down"></i></Button>
                        <Button type="danger" shape="circle" ><i className="fas fa-trash-alt"></i></Button>
                    </div>
                </List.Item>
            )}>
            </List>
          </div>
        </div>
    )
  }
}

export default Dashboard
