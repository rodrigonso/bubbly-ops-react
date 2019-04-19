import React, { Component } from 'react';
import { Card, Row, Typography, Badge, Button, Input, message, Icon, List, Spin, Tag, Modal, TimePicker } from 'antd';
import dateFormat from 'dateformat';
import axios from 'axios';

const { Text } = Typography;
const { CheckableTag } = Tag
const { Search } = Input

export class TextMessage extends Component {
  state = {
    input: '',
    arrived: false,
    isLoading: false,
    isSent: false,
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

handleArrived = () => {
  setTimeout(() => this.setState({ arrived: true }), 1000)
  this.props.nextStep()
}

// handles change in input for text message
handleChange = (e) => {
  const value = e.target.value;
  this.setState({ input: value })
}

  render() {
      const { input, isSent } = this.state
      return (
        <div style={{width: "100%" }}>
        <p>Let your customer know when to expect you!</p>
            <Card style={{ borderRadius: 5 }}  >
              <div className="chat" style={{ minHeight: 200 }} >
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
              </div>
              <div className="actions" style={{ marginTop: 10, borderRadius: 5 }} >
                <Search onChange={this.handleChange} placeholder="ETA" onSearch={this.handleTextSend} enterButton={<Icon type="arrow-up" />}  />
              </div>
            </Card>
        </div>
      )
  }
}

// <Search placeholder="12:30 PM" disabled={isSent} value={input} onChange={this.handleChange} enterButton={<Icon type="arrow-up" />} onSearch={this.handleTextSend} />

export default TextMessage