import React, { Component } from 'react'
import { Steps } from 'antd';

const { Step } = Steps;

export class Timelines extends Component {
state = {
    timelines: []
}


  render() {
      console.log(this.state);
    return (
        <div style={{ backgroundColor: "#fff", height: "auto" }}>
            <h1 style={{ fontSize: 24 }}>Timelines</h1>
            <div style={{ padding: 24, maxWidth: 1000 }}>
                <div style={{ maxWidth: 600, margin: "auto" }}>
                <Steps size="small">
                    <Step title="Validate" />
                    <Step title="Review" />
                    <Step title="Finished" />
                </Steps>
                </div>
                <div style={{ marginTop: 40 }}>
                </div>
            </div>
        </div>
    )
  }
}

export default Timelines
