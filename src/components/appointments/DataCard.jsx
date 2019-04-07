import React, { Component } from 'react'
import { Divider, DatePicker, Radio, Collapse, Row, Col, Statistic, Card, message, Button, Skeleton, Tooltip } from 'antd';

export class DataCard extends Component {
  render() {
    const { revenue, services, driving, hours, isValidating, enableValidate, handleReset, handleValidate, isAdmin } = this.props;
    return (
        <div className="dashboard-week-totals" style={{ backgroundColor: "#fff", marginTop: 20, padding: 24, borderRadius: 4 }} >
          <Row>
            {isAdmin ? <Col span={4}>
              <Statistic value={revenue} prefix="$" title="Total Revenue" /> 
            </Col> : null}
            <Col span={4}>
              <Statistic value={services} suffix="/30" title="Total Services" /> 
            </Col>
            <Col span={4}>
              <Statistic value={driving} suffix="" title="Total Driving" /> 
            </Col>
            <Col span={4}>
              <Statistic value={hours} suffix="" title="Total Hours" /> 
            </Col>
            <Col span={1}>
              <Divider type="vertical" style={{ height: 50 }} />
            </Col>
            <Col span={3} offset={isAdmin ? 0 : 2}>
              <Tooltip title="Save week" arrowPointAtCenter>
                <Button loading={isValidating} onClick={handleValidate} disabled={!enableValidate || !isAdmin } type="primary" icon="save" style={{ marginTop: 8, marginLeft: 15 }} >
                Save
                </Button>
              </Tooltip>
            </Col>
            <Col span={2}>
              <Tooltip title="Restart" arrowPointAtCenter>
                <Button onClick={handleReset} disabled={!enableValidate || !isAdmin} type="danger" icon="reload" style={{ marginTop: 8, marginLeft: 10 }} >
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
