import React, { Component } from 'react'
import { Button, Form, Input, message} from 'antd'
import Joi from 'joi'
import axios from 'axios'

export class Login extends Component {
state = {
    fields: [
        { name: "Username", value: '' },
        { name: "Password", value: '' }
    ],
    loading: false
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

    const { error } = Joi.validate(user, schema)
    if (error) return this.setState({ validateStatus: "error" })

    this.setState({ validateStatus: "success" })

    try {
        this.setState({ loading: true })
        const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/auth/login`, user);
        console.log(data);
        localStorage.setItem("token", data.token)
        window.location.reload()
    } catch (ex) {
        console.log(ex)
        message.error("Something went wrong")
    } finally {
        this.setState({ loading: false })
    }
}

  render() {
    const { fields, loading, validateStatus } = this.state;
    return (
        <Form>
            {fields.map(item => {
                return (
                    <Form.Item key={item.name} hasFeedback validateStatus={validateStatus}>
                        <Input key={item.name} type={item.name === "Password" ? "password" : null} value={item.value} placeholder={item.name} onChange={(e) => this.handleChange(e, item)} />
                    </Form.Item>
                )
            })}
            <Form.Item>
                <Button loading={loading} onClick={this.handleSubmit} type="primary" style={{ width: "100%", textAlign: "center" }}>Login</Button>
            </Form.Item>
        </Form>
    )
  }
}

const schema = {
    username: Joi.string().min(3).max(55).required(),
    password: Joi.string().min(3).max(55).required()
}

export default Login
