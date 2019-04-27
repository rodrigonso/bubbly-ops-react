import React, { Component } from 'react';
import { Card, Row, Typography, Badge, Button, Input, message, Icon, List, Spin, Tag, Modal, TimePicker, Divider, Form } from 'antd';
import moment from 'moment'
import axios from 'axios';

const { Text } = Typography;
const { CheckableTag } = Tag
const { Search } = Input

export class TextMessage extends Component {
  state = {
    input: '',
    startTime: '',
    arrived: false,
    isLoading: false,
    isSent: false,
  }

componentDidMount() { 
  const startTime = this.getJobStart()
  this.setState({ startTime })
}

// sends text message
handleTextSend = async() => {
  const { input } = this.state

  //const test = this.props.event.summary.match(/\d+/g).map(Number);

  const obj = {
    to: "18329298338",
    text: `Hey, it's Bubbly Here!\n\nYour detailer is on the way to your location.\n\nCurrent ETA: ${input}\n\nThanks!`
  }

  try {
    this.setState({ isLoading: true })
    const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/sms`, obj)
    console.log(data);
    message.success("Your message was sent!")
    //if (this.props.nextStep) this.props.nextStep()
  } catch(ex) {
    console.log(ex);
    message.error("Something went wrong!")
  } finally {
    this.setState({ isLoading: false })
    this.setState({ isSent: true })
  }
}

getJobStart = () => {
  const { job } = this.props
  const startTime = moment(job.jobData.start.dateTime).format('LT')
  return startTime
}

handleSelect = (e) => {
  const { job } = this.props
  const value = e.target.value
  const startTime = new Date(job.jobData.start.dateTime)
  startTime.setMinutes(value)
  const input = moment(startTime).format('LT')
  this.setState({ input })
}

  render() {
      const { input, isSent, startTime, isLoading } = this.state
      return (
        <div style={{width: "100%", minHeight: 350 }}>
          <p>Select the appropiate number according to your ETA.</p>
          <Divider />
          <div>
            <h4>Normal</h4>
            <Button onClick={this.handleSelect} value={0} type="primary" style={{ marginRight: 5 }} >{startTime}</Button>
            <Button onClick={this.handleSelect} value={5} style={{ marginRight: 2 }} >+5</Button>
            <Button onClick={this.handleSelect} value={10} style={{ marginRight: 2 }}>+10</Button>
            <Button onClick={this.handleSelect} value={15} >+15</Button>
          </div>
          <br />
          {isSent ? 
            <React.Fragment>
              <Divider />
              <Icon type="check-circle" theme="filled" style={{ marginLeft: 55, color: "#52c41a" }}  />
              <p style={{ display: "inline", marginLeft: 5 }} >Your message was sent!</p>
            </React.Fragment> 
          : 
            <div>
              {isSent || this.state.input ? 
                <React.Fragment>
                  <Divider />
                  <h4 style={{ marginTop: 20, display: "inline" }} >Current ETA:</h4>
                  <p style={{ display: "inline", marginLeft: 5 }} >{input}</p>
                  <Button onClick={this.handleTextSend} loading={isLoading} type="danger" style={{ marginLeft: 55 }} >Send</Button>
                </React.Fragment> 
                : null}
            </div> }
          <Divider />
        </div>
      )
  }
}

const test = {
  top: -50,
  height: 250,
  width: 285,
  position: "absolute",
  background: "rgb(255,255,255)",
  background: "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.24455559490084988) 76%, rgba(255,255,255,1) 100%)"
}


export default TextMessage

/*
            <Card style={{ borderRadius: 5 }} >
              <div className="chat" style={{ position: "relative", height: 200, top: 40 }} >
                {this.state.input ? <div className="customer-otw" style={{ padding: 10, backgroundColor: "#1890ff", width: 200, float: "right", color: "#fff", borderRadius: 5,  }}>
                  <p>Hey, it's Bubbly Here!</p>
                  <p>Your detailer is on the way to your location.</p>
                  <p>Current ETA: {this.state.input}</p>
                  <p>Thanks!</p>
                  <Spin spinning={this.state.isLoading} style={{ float: "right" }}  indicator={<Icon type="loading" style={{ color: "#fff" }}  /> } />
                </div> : null }
                {this.state.arrived ? <div className="employee-arrived" style={{ padding: 10, backgroundColor: "#1890ff", width: 200, float: "right", color: "#fff", borderRadius: 5, marginTop: 10, marginBottom: 10 }}>
                  <p>Hey, it's Bubbly Here!</p>
                  <p>Your detailer has arrived, {this.props.user.name} will be expecting you.</p>
                  <p>Thanks!</p>
                </div> : null}
                <div className="overlay" style={test} >
                </div>
              </div>
              <div className="actions" style={{ marginTop: 40, borderRadius: 5 }} >
                <Search onChange={this.handleChange} placeholder="ETA" onSearch={this.handleTextSend} enterButton={<Icon type="arrow-up" />}  />
              </div>
            </Card>
*/