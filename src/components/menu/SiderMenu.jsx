import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Layout, Menu, Avatar, Divider } from 'antd'
import SubMenu from 'antd/lib/menu/SubMenu';

const { Sider } = Layout;

export class SiderMenu extends Component {

renderUserBadge = () => {
  const { user } = this.props
  if (user.username) {
    return (
      <SubMenu style={{ marginBottom: 20, marginTop: 20 }} title={<span><Avatar size="medium" shape="square">{user.username.charAt(0).toUpperCase()}</Avatar><span style={{ marginLeft: 20 }}>{user.username}</span></span>} >
        <Menu.Item>
          <NavLink to={`/users/${user.username}`}>Profile</NavLink>
        </Menu.Item>
        <Menu.Item>
          <p onClick={this.handleLogout} >Logout</p>
        </Menu.Item>
      </SubMenu>
    )
  } else {
    return (
      <Menu.Item>Login to get started</Menu.Item>
    )
  }
}

handleLogout = () => {
  localStorage.removeItem("token");
  window.location.reload()
  return;
}

  render() {
    const { user } = this.props
    if (this.props.isMobile) {
      return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", backgroundColor: "#fff" }} >
            <Menu mode="horizontal" style={{ border: 0 }} >
              <Menu.Item><NavLink to="/">Home</NavLink></Menu.Item>
              <Menu.Item><NavLink to="/earnings">Earnings</NavLink></Menu.Item>
              {user.email ? <Menu.Item style={{ marginLeft: 100 }} onClick={this.handleLogout} >Logout</Menu.Item> : null}
            </Menu>
          </div>
      )
    } 
    else return (
        <Sider trigger={null} style={this.props.isMobile ? styleMobile : styleDesktop}>
          <div style={{ margin: "auto" }} ><img alt="" src="https://bit.ly/2XPNPsM" style={{ margin: 20}} width="150px" height="auto" /></div>
          <Menu theme="dark" mode="inline" style={{ marginTop: 20 }}>
            <Menu.Divider style={{ backgroundColor: "rgba(255,255,255,0.1)", width: 150, margin: "auto" }}/>
              {this.renderUserBadge()}
            <Menu.Divider style={{ backgroundColor: "rgba(255,255,255,0.1)", width: 150, margin: "auto" }}/>
            <Menu.Item key="1">
              <NavLink to='/' >Home</NavLink>
            </Menu.Item>
            <Menu.Item key="2" disabled={user.username ? false : true}  >
              <NavLink to='/appointments' >Appointments</NavLink>
            </Menu.Item>
            <Menu.Item key="3" disabled={user && user.isAdmin ? false : true} >
              <NavLink to='/settings' >Settings</NavLink>
            </Menu.Item>
            <Menu.Divider style={{ backgroundColor: "rgba(255,255,255,0.1)", width: 150, margin: "auto" }}/>
          </Menu>
        </Sider>
    )
  }
}

const styleDesktop = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  left: 0
}

const styleMobile = {
  width: 0,
  height: "100vh",
  position: "fixed",
  left: 0
}

export default SiderMenu