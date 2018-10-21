import * as React from 'react';
import './Common.css'

const DictBrowser = (props: any) => {
    return (
      <iframe style={{width:'100%', height:'500px'}} src={props.url} />
    );
};

export default DictBrowser;
