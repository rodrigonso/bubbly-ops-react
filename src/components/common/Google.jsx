import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

export class Google extends Component {
  render() {
    return (
        <GoogleLogin
        clientId="111663759471-906452b0rdqva4fn9jrahjf7j0e30qf7.apps.googleusercontent.com"
        buttonText="Authorize with Google"
        scope="https://www.googleapis.com/auth/calendar.readonly"
        onSuccess={this.props.onSuccess}
        onFailure={this.props.onFailure}
      />
    )
  }
}

export default Google
