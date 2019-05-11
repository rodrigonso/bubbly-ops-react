import auth0 from 'auth0-js'
import Login from '../components/common/Login';

export default class Auth {
    auth0 = new auth0.WebAuth({
        domain: "dev-8xmm9vci.auth0.com",
        clientID: "SuoWv6xjcK6cfLeM14HJe2b4PkWHq5Fo",
        redirectUri: "https://localhost:3000/callback",
        responseType: "token id_token",
        scope: 'openId'
    })

    login = () => {
        this.auth0.authorize()
    }
}