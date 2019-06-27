import React, { Component } from 'react';
import { Button, message, Icon, Divider, Radio, notification } from 'antd';
import moment from 'moment'
import axios from 'axios';

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

componentDidUpdate(prevProps) {
  if (prevProps.activeJob !== this.props.activeJob) this.forceUpdate()
}

// sends text message
handleTextSend = async() => {
  const { input } = this.state
  const { activeJob } = this.props

  const phone = (activeJob.jobData.summary.match(/\d+/g).map(Number)).join();

  const obj = {
    to: phone.length === 10 ? `1${phone}` : phone,
    text: `Hey, it's Bubbly Here!\n\nYour detailer is on the way to your location.\n\nCurrent ETA: ${input}\n\nThanks!`
  }

  this.setState({ isLoading: true })
  const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/sms`, obj)
  if (data.error) return notification.error(data.error.message)
  else this.setState({ isSent: true })
}

getTimes = () => {
  const { activeJob } = this.props
  console.log(activeJob)
  const startTime = moment(activeJob.jobData.start.dateTime).format()

  const late1 = moment(startTime).add(10, 'm').toDate()
  const late2 = moment(startTime).add(15, 'm').toDate()

  this.setState({ startTime: moment(startTime).format("LT"), late1: moment(late1).format("LT"), late2: moment(late2).format("LT") })
}

handleSelect = (e) => {
  const { activeJob } = this.props
  
  const value = e.target.value
  const time = moment(activeJob.jobData.start.dateTime).format()
  const sendTime = moment(time).add(value, "m").toDate()

  const input = moment(sendTime).format("LT")
  this.setState({ input })
}

  render() {
      const { input, isSent, startTime, isLoading, late1, late2 } = this.state
      if (!this.props.activeJob) return null
      return (
        <div style={{width: "100%", minHeight: 350 }}>
          <p>Select the appropiate number according to your ETA.</p>
          <Divider />
          <div>
            <h4>On-Time</h4>
            <Radio.Group onChange={this.handleSelect} buttonStyle="solid" >
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
            <React.Fragment>
              {isSent || this.state.input ? 
                <div>
                  <Divider />
                  <h4 style={{ marginTop: 20, display: "inline" }} >Current ETA:</h4>
                  <p style={{ display: "inline", marginLeft: 5 }} >{input}</p>
                  <Button onClick={this.handleTextSend} loading={isLoading} type="danger" style={{ marginLeft: 65 }} >Send</Button>
                </div> 
                : null}
            </React.Fragment> }
          <Divider />
          <Button disabled={isSent ? false : true} style={{ width: "100%", marginTop: 100  }} type="primary" onClick={this.props.nextStep}>Next</Button> 
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