import React, { Component } from 'react';
import { Card, Row, Col, Typography, Badge, Button, Input, message, Divider, List, Drawer, Tag, Modal, TimePicker } from 'antd';
import dateFormat from 'dateformat';
import axios from 'axios';
import moment from 'moment'

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
handleChange = (time) => {
  //const value = e.target.value;
  const text = moment(time._d).format("hh:mm A")
  this.setState({ input: text })

}

  render() {
      const { input, event } = this.state
      return (
        <div style={{ padding: 24, width: 300, margin: "auto", marginBottom: 20 }}>
            <h4>Send SMS to customer</h4>
            <Input disabled={true} value="+1 (832) 929-8338" style={{ marginBottom: 10 }} />
            <p style={{ float: "left", marginTop: 5}}>Current ETA: </p>
            <TimePicker style={{ float: "right", width: 160 }} format="hh:mm A" defaultValue={moment(new Date(), "hh:mm a")} use12Hours={true} onChange={this.handleChange} />
            <Button onClick={this.handleTextSend} type="primary" style={{ marginTop: 10, width: "100%" }} >Send</Button>
        </div>
      )
  }
}

export default TextMessage