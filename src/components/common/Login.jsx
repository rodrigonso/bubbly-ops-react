import React, { Component } from 'react'
import { Layout, Button, Col, Row, Form, Input, message} from 'antd'
import jwt from 'jsonwebtoken'
import axios from 'axios'

export class Login extends Component {
state = {
    fields: [
        { name: "Username", value: '' },
        { name: "Password", value: '' }
    ]
}

handleChange = (e, item) => {
    const fields = [...this.state.fields];
    const index = fields.indexOf(item);
    fields[index].value = e.target.value;
    this.setState({ fields });
}

handleSubmit = async() => {
    const user = {
        username: this.state.fields[0].value,
        password: this.state.fields[1].value
    }

    try {
        const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/login`, user);
        console.log(data);
        localStorage.setItem("token", data.token)
        window.location.replace("/");
    } catch (ex) {
        console.log(ex)
        message.error("Something went wrong")
    }

}

  render() {
      console.log(process.env.REACT_APP_BACKEND_API_URL)
    const { fields } = this.state;
    return (
        <Form>
            {fields.map(item => {
                return (
                    <Form.Item key={item.name}>
                        <Input key={item.name} type={item.name === "Password" ? "password" : null} value={item.value} placeholder={item.name} onChange={(e) => this.handleChange(e, item)} />
                    </Form.Item>
                )
            })}
            <Form.Item>
                <Button onClick={this.handleSubmit} type="primary" style={{ width: "100%", textAlign: "center" }}>Login</Button>
            </Form.Item>
        </Form>
    )
  }
}

export default Login
