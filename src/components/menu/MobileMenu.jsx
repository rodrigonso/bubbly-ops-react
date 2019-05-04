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
				<div style={menuStyle} >
					<img src={require('./Artboard 1.png')} style={{ height: 40, position: "relative", top: 7, left: 15 }}  />
					<div onClick={this.handleDrawer} style={{ marginLeft: 200, marginTop: 15, fontSize: 20, color: "#fff" }} >{user.email ? <i className={isOpen ? "fas fa-times" : "fas fa-bars"} /> : null}</div>
				</div>
				<Drawer placement="top" closable={false} visible={isOpen} height={300} onClose={this.handleDrawer} zIndex={5} bodyStyle={{ }}>
					<Menu style={{ width: "24rem", marginLeft: "-1.5rem", fontFamily: 'Nunito Sans', marginTop: 50 }} mode="vertical" >
						<Menu.Item style={{ fontSize: 16, fontWeight: 700 }}><NavLink to="/" >Home</NavLink></Menu.Item>
						<Menu.Item style={{ fontSize: 16, fontWeight: 700 }}><NavLink to="/jobs" >Jobs</NavLink></Menu.Item>
						<Menu.Item style={{ fontSize: 16, fontWeight: 700 }}><NavLink to="/earnings" >Earnings</NavLink></Menu.Item>
						<Menu.Divider style={{ marginTop: 20 }} />
					</Menu>
					<Button shape="round" style={{ marginTop: 15, marginLeft: 120 }} onClick={this.handleLogout} >Logout</Button>
				</Drawer>
			</React.Fragment>
    )
  }
}

const data = [
	{ name: "Home", link: "/home" },
	{ name: "Jobs", link: "/jobs" },
	{ name: "Earnings", link: "/earnings" },
]

const menuStyle = {
	background: "rgb(36,59,85)",
	background: "linear-gradient(90deg, rgba(36,59,85,1) 0%, rgba(44,62,80,1) 100%)",
	filter: "drop-shadow(0 0 0.5rem rgba(0,0,0,0.5))",
	display: "grid",
	position: "absolute",
	gridTemplateColumns: "1fr 2fr",
	backgroundColor: "#0184d4",
	height: 60,
	zIndex: 10,
	width: "100%"
} 

export default MobileMenu



//