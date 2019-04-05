import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import SiderMenu from './components/siderMenu/SiderMenu';
import Home from './components/home/Home';
import Dashboard from './components/dashboard/Dashboard';
import Settings from './components/settings/Settings'
import { Layout, message } from 'antd';
import './App.css';
import jwt from 'jsonwebtoken'



const { Header, Content } = Layout;

class App extends Component {
state = {
  token: '',
  user: {}
}

componentDidMount() {
  const token = localStorage.getItem("token")
  if (token) {
    const user = jwt.decode(token);
    this.setState({ token, user })
  } else {
    console.log("No valid token found")
  }
}


  render() {
    const { token, user } = this.state
    return (
        <Layout>
          <SiderMenu user={user} />
          <Layout style={{ marginLeft: 200, background: "#f7f7f7" }}>
            <Content style={{ margin: 'auto', overflow: "initial", maxWidth: 1000, background: "#f7f7f7" }} >
              <div style={{ padding: 24, minHeight: 1080 }}>
                <Route  exact path="/dashboard" render={(props) => <Dashboard {...props} /> } />
                <Route  exact path="/settings" render={(props) => <Settings {...props} /> } />
                <Route  exact path="/" render={(props) => <Home {...props} user={user} token={token} /> } />
              </div>
            </Content>
          </Layout>
        </Layout>
    )
  }
}

export default App;
