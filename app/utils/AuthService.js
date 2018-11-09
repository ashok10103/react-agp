import { browserHistory } from 'react-router';
import { EventEmitter } from 'events';
import cookie from 'react-cookies';


export default class AuthService extends EventEmitter {
  constructor(props) {
    super();

    this.isLogged = this.isLogged.bind(this);
  }

  isLogged() {    
    const token = this.getToken();
    return !!token;
  }

  getToken() {
    return cookie.load('user_access_token');
  }
}
