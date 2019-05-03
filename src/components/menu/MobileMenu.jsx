import React, { Component } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { Drawer, Divider, Avatar, List, Button, Menu } from 'antd'

export class MobileMenu extends Component {
	state = {
		isOpen: false
	}

	handleDrawer = () => {
		this.setState({ isOpen: !this.state.isOpen })
	}

	handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload()
		return;
	}

  render() {
		const { isOpen } = this.state
		const { user } = this.props
    return (
			<React.Fragment>
				<div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", backgroundColor: "#2c3e50", height: 60}} >
					<img src={require('./Bubbly-Logo2.png')} style={{ height: 90, position: "relative", top: -15, left: 15 }}  />
					<div onClick={this.handleDrawer} style={{ marginLeft: 200, marginTop: 15, fontSize: 20, color: "#ecf0f1" }} >{user.email ? <i className="fas fa-bars" /> : null}</div>
				</div>
				<div  >
					<Drawer visible={isOpen} closable={false} onClose={this.handleDrawer} bodyStyle={{ height: "100%", backgroundColor: "#2c3e50" }}  >
						<div style={{ marginTop: 10 }} >
							<Avatar shape="square" icon="user" style={{ marginLeft: 35 }} />
							<h3 style={{ display: "inline", marginLeft: 10, color: "#fff" }} >{user.username}</h3>
						</div>
						<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.4", marginLeft: -10 }} /> 
						<div style={{ marginTop: 20, width: "100%", marginLeft: -25, width: 260 }} >
							<Menu theme="dark" defaultSelectedKeys={["1"]} style={{ backgroundColor: "#2c3e50", fontWeight: 600, fontSize: 20 }}  >
								<Menu.Item key="1"><NavLink  to="/" >Home</NavLink></Menu.Item>
								<Menu.Item key="2" ><NavLink  to="/jobs" >Jobs</NavLink></Menu.Item>
								<Menu.Item key="3" ><NavLink  to="/earnings" >Earnings</NavLink></Menu.Item>
							</Menu>
						</div>
						<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.4", marginLeft: -10 }} /> 
						<Button style={{ marginTop: 10, marginLeft: 60 }} onClick={this.handleLogout}>Logout</Button>
					</Drawer>
				</div>
			</React.Fragment>
    )
  }
}

const data = [
	{ name: "Home", link: "/home" },
	{ name: "Jobs", link: "/jobs" },
	{ name: "Earnings", link: "/earnings" },
]

export default MobileMenu
