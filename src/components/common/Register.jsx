import React, { Component } from 'react'
import { Layout, Button, Col, Row, Form, Input, message} from 'antd'
import jwt from 'jsonwebtoken'
import axios from 'axios'

export class Register extends Component {
state = {
    fields: [
        { name: "Name", value: '' },
        { name: "Username", value: '' },
        { name: "Email", value: '' },
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
    const { fields } = this.state;
    const user = {
        name: fields[0].value,
        email: fields[1].value,
        username: fields[2].value,
        password: fields[3].value,
    }
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/register`, user);
        console.log(data);
        message.success("You have successfully signed in!")
        localStorage.setItem("token", data.token)
        window.location.replace("/");
    } catch(ex) {
        console.log(ex)
        message.error("Something went wrong");
    }
}

  render() {
    const { fields } = this.state;
    return (
        <Form >
            {fields.map(item => {
                return (
                    <Form.Item key={item.name}>
                        <Input key={item.name} type={item.name === "Password" ? "password" : null} value={item.value} placeholder={item.name} onChange={(e) => this.handleChange(e, item)} />
                    </Form.Item>
                )
            })}
            <Form.Item>
                <Button onClick={this.handleSubmit} type="primary" style={{ width: "100%", textAlign: "center" }}>Register</Button>
            </Form.Item>
        </Form>
    )
  }
}

export default Register
