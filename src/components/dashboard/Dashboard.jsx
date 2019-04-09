import React, { Component } from 'react'
import { List, Divider, Statistic, Card, Row, Col, Button, message, Icon, Spin } from 'antd';
import axios from 'axios'
import moment from 'moment'


export class Dashboard extends Component {
    state = {
        weeks: [],
        totalRevenue: 0,
        totalServices: 0,
        totalDriving: 0,
        isDeleting: false,
        isLoading: false
    }

    async componentDidMount() {

        try {
            this.setState({ isLoading: true })
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_API}/weeks`)
            console.log(res.error)
            this.setState({ weeks: res.data })
            console.log(res.data)
            this.getTotalRevenue()
            this.getTotalServices()
        } catch(ex) {
            console.log(ex)
            message.error("Something went wrong!")
        } finally {
            this.setState({ isLoading: false })
        }

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
                <i style={{ color: "#2c3e50", marginLeft: 10 }} className="fas fa-clock"></i> {item.totalHours} hours
                <i style={{ color: "#2c3e50", marginLeft: 10 }} className="fas fa-dollar-sign"></i> {item.totalRevenue}
                <i style={{ color: "#2c3e50", marginLeft: 10 }} className="fas fa-car"></i> {item.totalDriving / 60} hours
            </div>
        )
    } 

    handleDelete = async(item) => {
        try {
            this.setState({ isDeleting: true })
            const { data } = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/weeks/${item._id}`)
            const weeks = [...this.state.weeks]
            const final = weeks.filter(week => week._id !== item._id)

            this.setState({ weeks: final })
            message.success("Item was deleted with success!")
        } catch(ex) {
            message.error("Something went wrong!")
            console.log(ex)
        } finally {
            this.setState({ isDeleting: false })
        }
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
            {!this.state.isLoading ? <List dataSource={this.state.weeks} itemLayout="horizontal" renderItem={item => (
                <List.Item actions={[<Button onClick={() => this.handleDelete(item)} type="danger" loading={this.state.isDeleting} icon="delete" >Delete</Button>]} style={{ textAlign: "left", marginBottom: 10 }} >
                    <List.Item.Meta 
                    title={this.formatRange(item.range)}
                    description={
                        <span>
                            <i className="fas fa-clipboard-check"></i>
                            <p style={{ display: "inline", marginLeft: 10 }} >Rodrigo </p>
                            <br />
                        </span>
                    }
                    />
                    <div className="content" >
                        <Row style={{ minWidth: 200 }} >

                            <Col span={8}>
                                <p>Employee</p>
                                <i class="fas fa-address-card"></i>
                                <p style={{ display: "inline", marginLeft: 10 }} >{item.detailer.name}</p>
                                <br />
                                <i class="fas fa-money-check-alt"></i>
                                <p style={{ display: "inline", marginLeft: 10 }} >${(item.totalDriving + item.totalHours) * 10 }</p>
                            </Col>
                            <Col offset={4} span={6}>
                                <Statistic value={item.totalRevenue} title="Total Revenue" prefix="$" /> 
                                <Statistic value={item.totalServices} title="Total Services" />
                            </Col>
                        </Row>
                    </div>
                </List.Item>
            )}>
            </List> : <Spin style={{ margin: "auto" }} indicator={<Icon type="loading" />} />}
          </div>
        </div>
    )
  }
}

export default Dashboard
