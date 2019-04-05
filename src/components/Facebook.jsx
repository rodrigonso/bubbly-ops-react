import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';

export class Google extends Component {
state = {
    isLoggedIn: false,
    userID: '',
    name: '',
    email: ''
};

componentClicked = () => {
    console.log('Component Clicked');
}

 responseFacebook = (response) => {
    console.log(response);
}


  render() {
    let fbContent;
    if (this.state.isLoggedIn) {
        fbContent = null;
    } else { 
        fbContent = (
            <FacebookLogin
            appId="408325599929591"
            autoLoad={true}
            fields="name,email,picture"
            onClick={this.componentClicked}
            callback={this.responseFacebook} 
            />
        )
    }
    return (
      <div>
        {fbContent}
      </div>
    )
  }
}

export default Google
