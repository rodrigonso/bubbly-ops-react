import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Layout, Menu, Avatar, Divider, Button } from 'antd'
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
    if (!user.email) {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "10% 80% 10%", backgroundColor: "#fff", height: 55, fontWeight: 700 }} >
        <img src={require('./Bubbly-Logo2.png')} style={{ height: 90, top: -20, position: "relative", left: 15 }}  />
        <Menu mode="horizontal" style={{ marginTop: 5 }}  >
          <Menu.Item><NavLink to="/">Home</NavLink></Menu.Item>
          <Menu.Item><NavLink to="/appointments">Dashboard</NavLink></Menu.Item>
          <Menu.Item><NavLink to="/earnings">Earnings</NavLink></Menu.Item>
          <Menu.Item><NavLink to="/settings">Settings</NavLink></Menu.Item>
        </Menu>
        <Button onClick={this.handleLogout} style={{ width: 80, marginTop: 10, marginLeft: "50%" }} shape="round" >Logout</Button>
      </div>
      )
    }
    return (
      <div style={menuDesktop} >
        <img src={require('./Bubbly-Logo2.png')} style={{ height: 90, top: -20, position: "relative", left: 15 }}  />
        <Menu mode="horizontal" style={{ marginTop: 7, fontSize: 16 }}  >
          <Menu.Item><NavLink to="/">Home</NavLink></Menu.Item>
          <Menu.Item><NavLink to="/appointments">Dashboard</NavLink></Menu.Item>
          <Menu.Item><NavLink to="/earnings">Earnings</NavLink></Menu.Item>
          <Menu.Item><NavLink to="/settings">Settings</NavLink></Menu.Item>
        </Menu>
        <Button onClick={this.handleLogout} style={{ width: 80, marginTop: 10, marginLeft: "35%" }} shape="round" >Logout</Button>
      </div>
    )
  }
}

const menuDesktop = {
  display: "grid",
  gridTemplateColumns: "10% 80% 10%",
  backgroundColor: "#fff",
  height: 55,
  fontWeight: 700,
  fontFamily: "Nunito Sans",
  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.12),0 2px 4px 0 rgba(0,0,0,0.08)"
  
}
const styleMobile = {
  width: 0,
  height: "100vh",
  position: "fixed",
  left: 0
}

export default SiderMenu

/*
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
*/