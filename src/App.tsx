import * as React from 'react';
import './App.css';

import {Link, Outlet} from 'react-router-dom'
import { AppBar, Tab, Tabs } from '@material-ui/core';

import 'reflect-metadata';
import {resolve} from "inversify-react";
import { AppService } from './view-models/misc/app.service';

import Settings from './components/misc/Settings';

import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "font-awesome/css/font-awesome.min.css";
import "primeflex/primeflex.css"

import { TabMenu } from 'primereact/tabmenu';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faDollarSign, faEuroSign, faBus, faTrain, faPlane, faRocket, faCar, faTaxi, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GlobalVars } from './common/common';
import Login from './components/misc/Login';

// https://stackoverflow.com/questions/53375964/using-a-link-component-with-listitem-and-typescript
// https://stackoverflow.com/questions/51257426/how-do-you-get-material-ui-tabs-to-work-with-react-router
function LinkTab(props: any) {
  return <Tab component={Link} {...props} />;
}

export default class App extends React.Component<any, any> {
  @resolve appService!: AppService;
  items = [
    {label: 'Words in Unit', icon: 'fa fa-bus fa-lg', url: '/words-unit'},
    {label: 'Phrases in Unit', icon: 'fa fa-train fa-lg', url: '/phrases-unit'},
    {label: 'Words in Textbook', icon: 'fa fa-car fa-lg', url: '/words-textbook'},
    {label: 'Phrases in Textbook', icon: 'fa fa-taxi fa-lg', url: '/phrases-textbook'},
    {label: 'Words in Language', icon: 'fa fa-plane fa-lg', url: '/words-lang'},
    {label: 'Phrases in Language', icon: 'fa fa-rocket fa-lg', url: '/phrases-lang'},
    {label: 'Patterns in Language', icon: 'fa fa-motorcycle fa-lg', url: '/patterns'},
    {label: 'Settings', icon: 'fa fa-gear fa-lg', url: '/settings'},
  ];
  items2 = [
    {label: 'Words in Unit', icon: 'bus', target: '/words-unit2'},
    {label: 'Phrases in Unit', icon: 'train', target: '/phrases-unit2'},
    {label: 'Words in Textbook', icon: 'car', target: '/words-textbook2'},
    {label: 'Phrases in Textbook', icon: 'taxi', target: '/phrases-textbook2'},
    {label: 'Words in Language', icon: 'plane', target: '/words-lang2'},
    {label: 'Phrases in Language', icon: 'rocket', target: '/phrases-lang2'},
    {label: 'Patterns in Language', icon: 'motorcycle', target: '/patterns2'},
    {label: 'Settings', icon: 'cog', target: '/settings'},
  ];

  constructor(props: any) {
    super(props);
    library.add(faDollarSign, faEuroSign, faBus, faTrain, faPlane, faRocket, faCar, faTaxi, faCog);
    const activeIndex = this.items.findIndex((value: any) => window.location.href.includes(value.url));
    this.state = {
      activeIndex,
      value: 0,
      valueApp: 0,
    };
  }

  componentDidMount() {
    console.log(this.appService);
  }

  render() {
    const loggedIn = localStorage.getItem('userid');
    if (!loggedIn)
      return (<Login />);

    GlobalVars.userid = loggedIn!;
    this.appService.getData();
    return (
      <div className="App">
        <h2>Lolly React</h2>
        <AppBar position="static" color="default">
          <Tabs value={this.state.valueApp} onChange={this.onTabAppChange} indicatorColor="primary" textColor="primary">
            <Tab label={<span><FontAwesomeIcon icon="dollar-sign" size="lg"/> App1</span>} />
            <Tab label={<span><FontAwesomeIcon icon="euro-sign" size="lg"/> App2</span>} />
          </Tabs>
        </AppBar>
        {this.state.valueApp === 0 && <div className="content-section implementation">
          <TabMenu model={this.items} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} />
        </div>}
        {this.state.valueApp === 1 && <AppBar position="static" color="default">
          <Tabs value={this.state.value} onChange={this.onTab2Change} indicatorColor="primary" textColor="primary">
            {this.items2.map((row: any) =>
              <LinkTab key={row.label} label={<span><FontAwesomeIcon icon={row.icon} size="lg"/> {row.label}</span>} to={row.target} />
            )}
          </Tabs>
        </AppBar>}
        <Outlet/>
      </div>
    );
  }

  onTabChange = (e: any) => {
    this.setState({activeIndex: e.index});
    // this.props.history.push(e.value.target);
  };

  onTab2Change = (event: any, value: any) => {
    this.setState({value});
  };

  onTabAppChange = (event: any, valueApp: any) => {
    let index = this.state.valueApp === 0 ? this.state.activeIndex : this.state.value;
    if (index === -1) index = 0;
    this.setState({valueApp});
    if (valueApp === 0) {
      this.setState({activeIndex: index});
      // this.props.history.push(this.items[index].target);
    } else {
      this.setState({value: index});
      // this.props.history.push(this.items2[index].target);
    }
  };

}
