import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Layout, Menu, Avatar } from 'antd'
import SubMenu from 'antd/lib/menu/SubMenu';
import jwt from 'jsonwebtoken'

const { Sider } = Layout;

export class SiderMenu extends Component {

renderUserBadge = () => {
  const token = localStorage.getItem("token")
  if (token) {
    const user = jwt.decode(token);
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
    return (
        <Sider trigger={null} style={{ overflow: "auto", height: "100vh", position: "fixed", left: 0 }}>
          <div style={{ margin: "auto" }} ><img alt="" src="https://bit.ly/2XPNPsM" style={{ margin: 20}} width="150px" height="auto" /></div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} style={{ marginTop: 20 }}>
            <Menu.Divider style={{ backgroundColor: "rgba(255,255,255,0.1)", width: 150, margin: "auto" }}/>
            {this.renderUserBadge()}
            <Menu.Divider style={{ backgroundColor: "rgba(255,255,255,0.1)", width: 150, margin: "auto" }}/>
            <Menu.Item key="1">
              <NavLink to='/' ><span>Home</span></NavLink>
            </Menu.Item>
            <Menu.Item key="2" disabled={user && user.isAdmin ? false : true} >
              <NavLink to='/dashboard' ><span>Dashboard</span></NavLink>
            </Menu.Item>
            <Menu.Divider style={{ backgroundColor: "rgba(255,255,255,0.1)", width: 150, margin: "auto" }}/>
          </Menu>
        </Sider>
    )
  }
}

export default SiderMenu
