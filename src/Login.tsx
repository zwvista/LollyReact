import * as React from 'react';
import './App.css';

import { Inject, Module } from 'react.di';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "font-awesome/css/font-awesome.min.css";
import "primeflex/primeflex.css"

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { UserService } from './services/misc/user.service';
import { LoginService } from './view-models/login.service';
import { GlobalVars } from './common/common';
import App from './App';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

@Module({
  providers: [
    UserService, LoginService
  ],
})
export default class Login extends React.Component<any, any> {
  @Inject loginService!: LoginService;

  constructor(props: any) {
    super(props);
  }

  render() {
    const loggedIn = localStorage.getItem('userid');
    if (!loggedIn)
      return (
        <div>
          <div className="p-grid mt-2 mb-2">
            <label htmlFor="username" className="col-2 control-label">USERNAME:</label>
            <InputText className="p-col-3" id="username" value={this.loginService.item.USERNAME} onChange={this.onChangeUsername} />
          </div>
          <div className="p-grid mt-2 mb-2">
            <label htmlFor="password" className="col-2 control-label">PASSWORD:</label>
            <Password className="p-col-3" id="password" value={this.loginService.item.PASSWORD} onChange={this.onChangePassword} />
          </div>
          <div>
            <Button label="Login" onClick={this.login} />
          </div>
        </div>
      );

    GlobalVars.userid = loggedIn!;
    return (<App />);
  }

  onChangeUsername = (e: any) => {
    this.loginService.item.USERNAME = (e.nativeEvent.target as HTMLInputElement).value;
    this.setState({loginService: this.loginService});
  };

  onChangePassword = (e: any) => {
    this.loginService.item.PASSWORD = (e.nativeEvent.target as HTMLInputElement).value;
    this.setState({loginService: this.loginService});
  };

  login = () => {
    this.loginService.login().subscribe(userid => {
      if (userid) {
        localStorage.setItem('userid', userid);
        GlobalVars.userid = userid;
        window.location.reload();
      }
    });
  }
}
