import React, { Component } from 'react'
import { Divider, DatePicker, Radio, Collapse, Row, Col, Statistic, Card, message, Button, Skeleton, Tooltip } from 'antd';

export class DataCard extends Component {
  state = {
    revenue: 0
  }

  componentDidMount() {
    this.setState({ jobs: this.props.jobs })
  }

  static getDerivedStateFromProps(props, state) {
    if (props.jobs !== state.jobs) {
      this.setState({ jobs: props.jobs })
    }
    else return null
  }

  render() {
    const { jobs, isAdmin } = this.props;
    return (
        <div className="dashboard-week-totals" style={{ backgroundColor: "#fff", marginTop: 20, padding: 24, borderRadius: 4 }} >
          <Row>
            {isAdmin ? <Col span={4}>
              <Statistic prefix="$" title="Total Revenue" /> 
            </Col> : null}
            <Col span={4}>
              <Statistic value={jobs ? jobs.length : 0} suffix="/30" title="Total Services" /> 
            </Col>
            <Col span={4}>
              <Statistic suffix="" title="Total Driving" /> 
            </Col>
            <Col span={4}>
              <Statistic  suffix="" title="Total Hours" /> 
            </Col>
            <Col span={1}>
              <Divider type="vertical" style={{ height: 50 }} />
            </Col>
            <Col span={3} offset={isAdmin ? 0 : 2}>
              <Tooltip title="Save week" arrowPointAtCenter>
                <Button type="primary" icon="save" style={{ marginTop: 8, marginLeft: 15 }} >
                Save
                </Button>
              </Tooltip>
            </Col>
            <Col span={2}>
              <Tooltip title="Restart" arrowPointAtCenter>
                <Button type="danger" icon="reload" style={{ marginTop: 8, marginLeft: 10 }} >
                Reset
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </div>
    )
  }
}

export default DataCard
