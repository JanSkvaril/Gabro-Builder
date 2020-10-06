import { Drawer } from '@material-ui/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BuilderWindow from "./Builder/BuilderWindow";
import "./index.css"
import Menu from './Menu/Menu';
ReactDOM.render(
    <div>

        <Menu />
        <BuilderWindow />
    </div>
    , document.getElementById('root'));