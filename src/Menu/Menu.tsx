import { Button, Drawer } from "@material-ui/core";
import React from "react";

const { dialog } = require('electron').remote;
import { ipcRenderer } from "electron";

import "./Menu.css";


let path = "";
class Menu extends React.Component {
    state: {
        path: string
    }
    constructor(props: any) {
        super(props)
        this.state = {
            path: ""
        }
    }


    Open() {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then((result) => {
            if (result.filePaths[0] != undefined) {
                ipcRenderer.send("set-path", result.filePaths[0]);
                this.setState({
                    path: result.filePaths[0]
                })
            }
        });

    }

    Create() {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then((result) => {
            if (result.filePaths[0] != undefined) {
                ipcRenderer.send("create", result.filePaths[0]);
                this.setState({
                    path: result.filePaths[0]
                })
            }
        });
    }
    render() {
        return (
            <div className="menu" >
                <span className="menu-path">CURRENT PROJECT: {this.state.path}</span>
                <Button onClick={this.Open.bind(this)} variant="text" > Open project</Button>
                <Button onClick={this.Create.bind(this)} variant="text">Create new</Button>
            </div >)
    }
}

export default Menu;


