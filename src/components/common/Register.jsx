import React, { Component } from 'react'
import { Button, Form, Input, message} from 'antd'
import axios from 'axios'
import Joi from 'joi'

export class Register extends Component {
state = {
    fields: [
        { name: "Name", value: '', validateStatus: "", schema: nameSchema },
        { name: "Email", value: '', validateStatus: "", schema: emailSchema },
        { name: "Username", value: '', validateStatus: "", schema: usernameSchema },
        { name: "Password", value: '', validateStatus: "", schema: passwordSchema }
    ]
}

handleChange = (e, item) => {
    const fields = [...this.state.fields];
    const index = fields.indexOf(item);
    fields[index].value = e.target.value;

    const obj = { field: e.target.value }

    const { error } = Joi.validate(obj, fields[index].schema)
    if (error) fields[index].validateStatus = "error"
    else fields[index].validateStatus = "success"

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
        const { data } = await axios.post(`http://localhost:3900/api/auth/register`, user);
        //${process.env.REACT_APP_BACKEND_API}
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
                    <Form.Item key={item.name} hasFeedback validateStatus={item.validateStatus} help={item.name === "Password" ? "Password must be at least 5 characters" : null } >
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

const usernameSchema = {
    field: Joi.string().alphanum().min(5).max(30).required(),
}

const emailSchema = {
    field: Joi.string().email().required(),
}

const nameSchema = {
    field: Joi.string().min(3).max(55).required()
}

const passwordSchema = {
    field: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/).required()
}


export default Register
