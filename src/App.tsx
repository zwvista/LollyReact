import * as React from 'react';
import './App.css';

import { Link, Outlet, useNavigate } from 'react-router-dom'
import { AppBar, Tab, Tabs } from '@mui/material';

import 'reflect-metadata';
import { container } from "tsyringe";
import { AppService } from './view-models/misc/app.service';

import Settings from './components/misc/Settings';

// import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "font-awesome/css/font-awesome.min.css";
import "primeflex/primeflex.css"

import { TabMenu } from 'primereact/tabmenu';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faDollarSign, faEuroSign, faBus, faTrain, faCar, faTaxi, faPlane, faRocket, faMotorcycle, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GlobalVars } from './common/common';
import Login from './components/misc/Login';
import { useState } from "react";

// https://stackoverflow.com/questions/53375964/using-a-link-component-with-listitem-and-typescript
// https://stackoverflow.com/questions/51257426/how-do-you-get-material-ui-tabs-to-work-with-react-router
function LinkTab(props: any) {
  return <Tab component={Link} {...props} />;
}

export default function App() {
  const appService = container.resolve(AppService);
  console.log(appService);
  const items = [
    {label: 'Words in Unit', icon: 'fa fa-bus fa-lg', url: '/words-unit'},
    {label: 'Phrases in Unit', icon: 'fa fa-train fa-lg', url: '/phrases-unit'},
    {label: 'Words in Textbook', icon: 'fa fa-car fa-lg', url: '/words-textbook'},
    {label: 'Phrases in Textbook', icon: 'fa fa-taxi fa-lg', url: '/phrases-textbook'},
    {label: 'Words in Language', icon: 'fa fa-plane fa-lg', url: '/words-lang'},
    {label: 'Phrases in Language', icon: 'fa fa-rocket fa-lg', url: '/phrases-lang'},
    {label: 'Patterns in Language', icon: 'fa fa-motorcycle fa-lg', url: '/patterns'},
    {label: 'Settings', icon: 'fa fa-gear fa-lg', url: '/settings'},
  ];
  const items2 = [
    {label: 'Words in Unit', icon: 'bus', url: '/words-unit2'},
    {label: 'Phrases in Unit', icon: 'train', url: '/phrases-unit2'},
    {label: 'Words in Textbook', icon: 'car', url: '/words-textbook2'},
    {label: 'Phrases in Textbook', icon: 'taxi', url: '/phrases-textbook2'},
    {label: 'Words in Language', icon: 'plane', url: '/words-lang2'},
    {label: 'Phrases in Language', icon: 'rocket', url: '/phrases-lang2'},
    {label: 'Patterns in Language', icon: 'motorcycle', url: '/patterns2'},
    {label: 'Settings', icon: 'cog', url: '/settings'},
  ];
  const index = items.findIndex((value: any) => window.location.href.includes(value.url));
  const [indexTab, setIndexTab] = useState(index);
  const [indexTab2, setIndexTab2] = useState(0);
  const [indexApp, setIndexApp] = useState(0);
  const navigate = useNavigate();
  library.add(faDollarSign, faEuroSign, faBus, faTrain, faCar, faTaxi, faPlane, faRocket, faMotorcycle, faCog);

  function onTabAppChange(event: any, value: any) {
    let index = value === 0 ? indexTab : indexTab2;
    if (index === -1) index = 0;
    setIndexApp(value);
    if (value === 0) {
      setIndexTab(index);
      navigate(items[index].url);
    } else {
      setIndexTab2(index);
      navigate(items2[index].url);
    }
  }

  const loggedIn = localStorage.getItem('userid');
  if (!loggedIn)
    return (<Login />);

  GlobalVars.userid = loggedIn!;
  appService.getData();
  return (
    <div className="App">
      <h2>Lolly React</h2>
      <AppBar position="static" color="default">
        <Tabs value={indexApp} onChange={onTabAppChange} indicatorColor="primary" textColor="primary">
          <Tab label={<span><FontAwesomeIcon icon="dollar-sign" size="lg"/> App1</span>} />
          <Tab label={<span><FontAwesomeIcon icon="euro-sign" size="lg"/> App2</span>} />
        </Tabs>
      </AppBar>
      {indexApp === 0 && <div className="content-section implementation">
        <TabMenu model={items} activeIndex={indexTab} onTabChange={e => setIndexTab(e.index)} />
      </div>}
      {indexApp === 1 && <AppBar position="static" color="default">
        <Tabs value={indexTab2} onChange={(e, v) => setIndexTab2(v)} indicatorColor="primary" textColor="primary">
          {items2.map((row: any) =>
            <LinkTab key={row.label} label={<span><FontAwesomeIcon icon={row.icon} size="lg"/> {row.label}</span>} to={row.url} />
          )}
        </Tabs>
      </AppBar>}
      <Outlet/>
    </div>
  );
}
