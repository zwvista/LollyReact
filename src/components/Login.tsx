import * as React from 'react';
import { Button } from 'primereact/button';
import './Common.css'
import { InputText } from 'primereact/inputtext';
import { Inject } from 'react.di';
import { GlobalVars } from '../common/common';
import { Password } from 'primereact/password';
import { LoginService } from '../view-models/login.service';

export default class Login extends React.Component<any, any> {
  @Inject loginService!: LoginService;

  render() {
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

};

