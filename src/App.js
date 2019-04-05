import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import SiderMenu from './components/siderMenu/SiderMenu';
import Home from './components/home/Home';
import Dashboard from './components/dashboard/Dashboard';
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

protectedRoute = () => {
  const { user } = this.state
  if (user && user.isAdmin) {
    return <Route exact path="/dashboard" component={Dashboard} />
  } else {
    return <Route exact path="/" component={Home} />
  }
}

  render() {
    const { token, user } = this.state
    return (
      <Router>
        <Layout className="body" >
          <Layout>
            <SiderMenu user={user} />
            <Layout style={{ marginLeft: 200, background: "#f7f7f7" }}>
              <Content style={{ margin: 'auto', overflow: "initial", maxWidth: 1000, background: "#f7f7f7" }} >
                  <Route exact path="/" render={props => <Home {...props} user={user} token={token} /> } />
                  <Route exact path="/dashboard" render={props => <Dashboard {...props} /> } />
              </Content>
            </Layout>
          </Layout>
      </Layout>
    </Router>
    )
  }
}

export default App;
