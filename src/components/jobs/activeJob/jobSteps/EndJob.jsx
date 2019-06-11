import React, { Component } from 'react'
import { Button, TreeSelect, Divider, Form, Checkbox} from 'antd'

const { TreeNode } = TreeSelect

export class CompleteJob extends Component {
  state = {
    upgrades: [
      { key: 1, name: "Carpet Shampoo", slug: "CarpetShampoo", price: 40, duration: 0.5 },
      { key: 2, name: "Leather Cleaning", slug: "LeatherCleaning", price: 20, duration: 0.1 },
      { key: 3, name: "Engine Detailing", slug: "EngineDetailing", price: 60, duration: 0.1 },
    ]
  }
  

  render() {
    return (
      <div>
        <p>Add any additionall information about your job here.</p>
        <Divider />
        <div>
         <Form.Item label="Service Upgrades" >
            {this.state.upgrades.map(item => {
              return (
              <div>
                <Checkbox value={item} onChange={this.props.handleUpgrade} >{item.name}</Checkbox>
                <br/>
              </div>
              )
            })}
          </Form.Item>
        </div>
        <Divider />
        <Button style={{ width: "100%" }} type="danger" onClick={this.props.handleCompletion}>Complete Job</Button> 
      </div>
    )
  }
}

export default CompleteJob
