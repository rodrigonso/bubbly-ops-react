import React, { Component } from 'react';
import { Card, Row, Col, Typography, Badge, Button, Input, message, Icon, List, Spin, Tag, Modal, TimePicker } from 'antd';
import dateFormat from 'dateformat';
import axios from 'axios';
import moment from 'moment'
import Search from 'antd/lib/input/Search';

const { Text } = Typography;
const { CheckableTag } = Tag
const { TextArea } = Input

export class TextMessage extends Component {
  state = {
    input: '',
    isLoading: false,
    reply: "",
    isSent: false
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
    console.log(process.env.REACT_APP_BACKEND_API)
    const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/sms`, obj)
    console.log(data);
    message.success("Your message was sent!")
    //if (this.props.nextStep) this.props.nextStep()
  } catch(ex) {
    console.log(ex);
    message.error("Something went wrong!")
  } finally {
    this.setState({ isLoading: false })
    setTimeout(() => this.setState({ reply: "Thanks! I will be waiting you here." }), 2000)
    this.setState({ isSent: true })
  }
}

handleArrived = () => {
  this.props.nextStep()
}

// handles change in input for text message
handleChange = (e) => {
  const value = e.target.value;
  this.setState({ input: value })
}

  render() {
      const { input, event } = this.state
      return (
        <div style={{width: 300, marginBottom: 20 }}>
            <Card style={{ borderRadius: 5 }}  >
            
              <div className="chat" style={{ minHeight: 200 }} >
                {this.state.input ? <div className="customer" style={{ padding: 10, backgroundColor: "#1890ff", width: 200, float: "right", color: "#fff", borderRadius: 5,  }}>
                  <p>Hey, it's Bubbly Here!</p>
                  <p>Your detailer is on the way to your location.</p>
                  <p>Current ETA: {this.state.input}</p>
                  <p>Thanks!</p>
                  <Spin spinning={this.state.isLoading} style={{ float: "right" }}  indicator={<Icon type="loading" style={{ color: "#fff" }}  /> } />
                </div> : null }
                {this.state.reply ? <div className="customer" style={{ padding: 10, backgroundColor: "#f5f5f5", width: 200, float: "left", color: "#000", borderRadius: 5, marginTop: 10, marginBottom: 20 }}>
                  <p>{this.state.reply}</p>
                </div> : null }
              </div>
              <div className="actions" style={{ marginTop: 10 }} > 
                <Search placeholder="12:30 PM" value={input} onChange={this.handleChange} enterButton="Send" onSearch={this.handleTextSend} />{this.state.isSent ? <Button onClick={this.handleArrived} style={{ backgroundColor: "#27ae60", color: "#fff", width: "100%", borderColor: "#2ecc71", marginTop: 10 }}>I have arrived!</Button> : null}
              </div>
            </Card>

        </div>
      )
  }
}

export default TextMessage