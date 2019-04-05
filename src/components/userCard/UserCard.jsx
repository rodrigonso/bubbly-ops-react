import React, { Component } from 'react'
import { Card, Col, Avatar, Divider, Button } from 'antd';

export class UserCard extends Component {

renderButton = () => {
    const { currentUser, user, setFormVisibility, isLoggedIn } = this.props;
    if (currentUser.username === user.username) {
        return <Button type="danger">Logout</Button>
    } else if (isLoggedIn === true) {
        return <Button disabled={true} >Log In</Button>
    } else {
        return <Button type="primary" onClick={setFormVisibility}>Log In</Button>
    }
}


  render() {
    const { user } = this.props;
    return (
        <Col span={6}>
            <Card hoverable>
                <div style={{ margin: "0 auto", textAlign: "center"}}>
                    <Avatar size={64} >{user.name.charAt(0)}</Avatar>
                    <div style={{ marginTop: 10 }}>
                        <h1 style={{ fontSize: 18 }}>{user.name}</h1>
                        <br/>
                    </div>
                    <div style={{ marginTop: 150 }}>
                        <Divider />
                        {this.renderButton()}
                    </div>
                </div>
            </Card>
        </Col>
    )
  }
}

export default UserCard
