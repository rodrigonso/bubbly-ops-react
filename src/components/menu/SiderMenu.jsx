import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Avatar, Button, Icon } from 'antd'
import SubMenu from 'antd/lib/menu/SubMenu';

export class DesktopMenu extends Component {
state = {
  currentKey: 'home'
}

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

handleMenuChange = (e) => {
  console.log(e)
  this.setState({ currentKey: e.key })
}

handleLogout = () => {
  localStorage.removeItem("token");
  window.location.reload()
  return;
}

  render() {
    const { user } = this.props
    const { currentKey } = this.state
    if (!user.email) {
      return (
        <div style={{ backgroundColor: "#fff", height: 55, fontWeight: 700, width: "100%" }} >
          <img src={require('./Bubbly-Logo2.png')} style={{ height: 90, top: -20, position: "relative", left: 15 }}  />
        </div>
      )
    }
    return (
      <div style={menuDesktop}>
        <div style={{ float: 'left'}} >
          <NavLink to="/" >
            <img src={require('./Bubbly-Logo2.png')} style={{ height: 90, marginTop: '-20px', cursor: 'pointer' }}  key="home" onClick={() => this.handleMenuChange({ key: "home" })} />
          </NavLink>
        </div>
        <div style={{ float: 'right' }} >
          <Menu mode="horizontal" style={{ marginTop: 7, fontSize: 16, border: 0 }} onClick={this.handleMenuChange} selectedKeys={[currentKey]}  >
            <Menu.Item key="home" ><NavLink to="/">Home</NavLink></Menu.Item>
            <Menu.Item key="dashboard" ><NavLink to="/appointments">Dashboard</NavLink></Menu.Item>
            <Menu.Item key="payrolls" ><NavLink to="/payrolls">Payrolls</NavLink></Menu.Item>
            <Menu.Item key="settings" ><NavLink to="/settings">Settings</NavLink></Menu.Item>
            <Menu.SubMenu key="user" title={<span><Avatar shape="circle" size="small" /> {user.username} <Icon type="caret-down"/></span>} >
              <Menu.Item><Icon type="setting" /> Account Settings</Menu.Item>
              <Menu.Item><Icon type="question-circle" /> Support</Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={this.handleLogout} ><Icon type="logout" /> Logout</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
      </div>
    )
  }
}

const menuDesktop = {
  backgroundColor: "#fff",
  height: 55,
  fontWeight: 700,
  fontFamily: "Nunito Sans",
  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.12),0 2px 4px 0 rgba(0,0,0,0.08)",
  
  
}
const styleMobile = {
  width: 0,
  height: "100vh",
  position: "fixed",
  left: 0
}

export default DesktopMenu

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