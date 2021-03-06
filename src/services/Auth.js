import auth0 from 'auth0-js'
import Login from '../components/common/Login';
import history from '../history'

export default class Auth {
    accessToken;
    idToken;
    expiresAt;

    constructor() {
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getIdToken = this.getIdToken.bind(this);
        this.renewSession = this.renewSession.bind(this);
      }

    auth0 = new auth0.WebAuth({
        domain: "dev-8xmm9vci.auth0.com",
        clientID: "SuoWv6xjcK6cfLeM14HJe2b4PkWHq5Fo",
        redirectUri: "https://localhost:3000/callback",
        responseType: "token id_token",
        scope: 'openId',
        connection: 'google-oauth2'
    })

    login() {
        this.auth0.authorize()
    }

    handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken & authResult.idToken) {
                this.setSession(authResult)
            } else if (err) {
                history.replace("/")
                console.log(err)
                alert(`Error: ${err.error}. Check console log`)
            }
        })
    }

    getAccessToken() {
        return this.accessToken
    }

    getIdToken() {
        return this.idToken
    }

    setSession(authResult) {
        localStorage.setItem("isLoggedIn", 'true')

        let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime()
        this.accessToken = authResult.accessToken
        this.idToken = authResult.idToken
        this.expiresAt = expiresAt

        history.replace("/")
    }

    renewSession() {
        this.auth0.checkSession({}, (err, authResult) => {
           if (authResult && authResult.accessToken && authResult.idToken) {
             this.setSession(authResult);
           } else if (err) {
             this.logout();
             console.log(err);
             alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
           }
        });
      }

      logout() {
        // Remove tokens and expiry time
        this.accessToken = null;
        this.idToken = null;
        this.expiresAt = 0;
    
        // Remove isLoggedIn flag from localStorage
        localStorage.removeItem('isLoggedIn');
    
        this.auth0.logout({
          returnTo: window.location.origin
        });
    
        // navigate to the home route
        history.replace('/home');
      }

      isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        let expiresAt = this.expiresAt;
        return new Date().getTime() < expiresAt;
      }
}