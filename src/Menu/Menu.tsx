import { Button, Drawer, LinearProgress } from "@material-ui/core";
import React from "react";

const { dialog } = require('electron').remote;
import { ipcRenderer } from "electron";

import "./Menu.css";


let path = "";
class Menu extends React.Component {
    state: {
        path: string,
        loading: boolean
    }
    constructor(props: any) {
        super(props)
        this.state = {
            path: "",
            loading: false,
        }

        ipcRenderer.on('build_update', (event, data) => {
            this.setState({ loading: false })
        });
        ipcRenderer.on("final-build-done", (event, data) => {
            this.setState({ loading: false })
        });
    }


    Open() {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then((result) => {
            if (result.filePaths[0] != undefined) {
                ipcRenderer.send("set-path", result.filePaths[0]);
                this.setState({
                    path: result.filePaths[0],
                    loading: true
                })
            }
        });

    }

    Create() {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then((result) => {
            if (result.filePaths[0] != undefined) {
                console.log(result.filePaths[0]);
                ipcRenderer.send("create", result.filePaths[0]);
                this.setState({
                    path: result.filePaths[0],
                    loading: true
                })
            }
        });
    }
    Build() {
        ipcRenderer.send("final-build");
        this.setState({
            loading: true
        })
    }
    render() {

        return (
            <div className="menu" >
                <span className="menu-path">CURRENT PROJECT: {this.state.path}</span>
                <Button onClick={this.Build.bind(this)} variant="text">Build</Button>
                <Button onClick={this.Open.bind(this)} variant="text" > Open project</Button>
                <Button onClick={this.Create.bind(this)} variant="text">Create new</Button>
                {this.state.loading ?
                    <div style={{ textAlign: "center" }}>
                        <i> loading...</i>
                        <LinearProgress />
                    </div>
                    : ""}
            </div >)
    }
}

export default Menu;


