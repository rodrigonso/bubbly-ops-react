import React, { Component } from 'react';
import { Card, Row, Col, Typography, Badge, Button, Input, message, Divider, List, Drawer, Tag, Modal } from 'antd';
import dateFormat from 'dateformat';
import axios from 'axios';

const { Text } = Typography;
const { CheckableTag } = Tag
const { TextArea } = Input

export class TextMessage extends Component {
  state = {
    input: '',
  }

// sends text message
handleTextSend = async() => {
  const { input } = this.state

  const test = this.props.event.summary.match(/\d+/g).map(Number);

  const obj = {
    to: "18329298338",
    text: `Hey, it's Bubbly Here!\n\nYour detailer is on the way to your location.\n\nCurrent ETA: ${input}\n\nThanks!`
  }

  try {
    console.log(process.env.REACT_APP_BACKEND_API)
    const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/sms`, obj)
    console.log(data);
    message.success("Your message was sent!")
    if (this.props.nextStep) this.props.nextStep()
  } catch(ex) {
    console.log(ex);
    message.error("Something went wrong!")
  }
  this.setState({ input: '' })
}

// handles change in input for text message
handleChange = (e) => {
  const value = e.target.value;
  this.setState({ input: value });
}

  render() {
      const { input, event } = this.state
      return (
        <div style={{ padding: 24, width: 300, margin: "auto", marginBottom: 20 }}>
            <h4>Send SMS to customer</h4>
            <Input disabled={true} value="+1 (832) 929-8338" style={{ marginBottom: 10 }} />
            <Input placeholder="Current ETA" value={input} onChange={(e) => this.handleChange(e)} />
            <Button onClick={this.handleTextSend} type="primary" style={{ marginTop: 10, width: "100%" }} >Send</Button>
      </div>
      )
  }
}

export default TextMessage