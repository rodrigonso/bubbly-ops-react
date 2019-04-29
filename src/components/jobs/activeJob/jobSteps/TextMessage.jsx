import React, { Component } from 'react';
import { Card, Row, Typography, Badge, Button, Input, message, Icon, List, Spin, Tag, Modal, TimePicker, Divider, Form, Radio } from 'antd';
import moment from 'moment'
import axios from 'axios';

const { Text } = Typography;
const { CheckableTag } = Tag
const { Search } = Input

export class TextMessage extends Component {
  state = {
    input: '',
    startTime: '',
    late1: '',
    late2: '',
    arrived: false,
    isLoading: false,
    isSent: false,
  }

componentDidMount() { 
  this.getTimes()
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
    this.setState({ isSent: true })
  } catch(ex) {
    console.log(ex);
    message.error("Something went wrong!")
  } finally {
    this.setState({ isLoading: false })
  }
}

getTimes = () => {
  const { job } = this.props
  const startTime = moment(job.jobData.start.dateTime).format()

  const late1 = moment(startTime).add(10, 'm').toDate()
  const late2 = moment(startTime).add(15, 'm').toDate()

  this.setState({ startTime: moment(startTime).format("LT"), late1: moment(late1).format("LT"), late2: moment(late2).format("LT") })
}

handleSelect = (e) => {
  const { job } = this.props
  
  const value = e.target.value
  const time = moment(job.jobData.start.dateTime).format()
  const sendTime = moment(time).add(value, "m").toDate()

  const input = moment(sendTime).format("LT")
  this.setState({ input })
}

  render() {
      const { input, isSent, startTime, isLoading, late1, late2 } = this.state
      return (
        <div style={{width: "100%", minHeight: 350 }}>
          <p>Select the appropiate number according to your ETA.</p>
          <Divider />
          <div>
            <h4>Normal</h4>
            <Radio.Group defaultValue={0} onChange={this.handleSelect} buttonStyle="solid" >
              <Radio.Button value={0}>{startTime}</Radio.Button>
              <Radio.Button value={10}>{late1}</Radio.Button>
              <Radio.Button value={15}>{late2}</Radio.Button>
            </Radio.Group>
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
                  <Button onClick={this.handleTextSend} loading={isLoading} type="danger" style={{ marginLeft: 65 }} >Send</Button>
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
  <Button onClick={this.handleSelect} value={0} type="primary" style={{ marginRight: 5 }} >{startTime}</Button>
  <Button onClick={this.handleSelect} value={5} style={{ marginRight: 2 }} >+5</Button>
  <Button onClick={this.handleSelect} value={10} style={{ marginRight: 2 }}>+10</Button>
  <Button onClick={this.handleSelect} value={15} >+15</Button>
*/