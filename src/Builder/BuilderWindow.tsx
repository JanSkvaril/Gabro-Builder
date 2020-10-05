import { ipcRenderer } from "electron";
import React from "react";
import Builder from "./Builder";

class BuilderWindow extends React.Component {
    state: any;
    constructor(props: any) {

        super(props);
        this.state = {
            config: null,
        }

        ipcRenderer.on('receive_config', (event, data) => {
            console.log(data);
            this.setState({ config: data })

        });
        ipcRenderer.send("get-config");
    }
    SendToCompile(build) {
        ipcRenderer.send("send-build", build);
    }
    render() {
        if (this.state.config == null) {
            return <div></div>
        }
        return (<div className="main-builder">
            <Builder config={this.state.config} SendBuild={this.SendToCompile.bind(this)} />
        </div>)
    }

}

export default BuilderWindow;