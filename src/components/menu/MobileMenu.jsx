import React, { Component } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { Drawer, Divider, Avatar, List, Button, Menu } from 'antd'

export class MobileMenu extends Component {
	state = {
		isOpen: false,
		currentKey: 'home'
	}

	handleDrawer = () => {
		this.setState({ isOpen: !this.state.isOpen })
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
		const { isOpen, currentKey } = this.state
		const { user } = this.props
    return (
			 <React.Fragment>
				<div style={menuStyle} >
					<NavLink to="/">
						<img src={require('./Bubbly-Logo2.png')} style={{ height: 85, position: "relative", top: -12, left: 15 }} onClick={() => this.handleMenuChange({key: "home"})}  />
					</NavLink>
					<div onClick={this.handleDrawer} style={{ marginLeft: 200, marginTop: 15, fontSize: 20, color: "#2c3e50" }} >{user.email ? <i className={isOpen ? "fas fa-times" : "fas fa-bars"} /> : null}</div>
				</div>
				<Drawer placement="top" closable={false} visible={isOpen} height={300} onClose={this.handleDrawer} zIndex={5} bodyStyle={{ }}>
					<Menu onClick={this.handleMenuChange} selectedKeys={[currentKey]} style={{ width: "24rem", marginLeft: "-1.5rem", fontFamily: 'Nunito Sans', marginTop: 50 }} mode="vertical" >
						<Menu.Item key="home" style={{ fontSize: 16, fontWeight: 700 }}><NavLink to="/" >Home</NavLink></Menu.Item>
						<Menu.Item key="jobs" style={{ fontSize: 16, fontWeight: 700 }}><NavLink to="/jobs" >Jobs</NavLink></Menu.Item>
						<Menu.Item key="earnings" style={{ fontSize: 16, fontWeight: 700 }}><NavLink to="/earnings" >Earnings</NavLink></Menu.Item>
						<Menu.Divider style={{ marginTop: 20 }} />
					</Menu>
					<Button shape="round" style={{ marginTop: 15, marginLeft: 120 }} onClick={this.handleLogout} >Logout</Button>
				</Drawer>
			</React.Fragment>
    )
  }
}

const menuStyle = {
	filter: "drop-shadow(0 0 0.5rem rgba(0,0,0,0.25))",
	display: "grid",
	position: "absolute",
	gridTemplateColumns: "1fr 2fr",
	backgroundColor: "#fff",
	height: 60,
	zIndex: 10,
	width: "100%"
} 

export default MobileMenu
