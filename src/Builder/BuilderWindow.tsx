import { ipcRenderer } from "electron";
import React from "react";
import Builder from "./Builder";

class BuilderWindow extends React.Component {
    state: any;
    SetChildBuild: any;
    constructor(props: any) {

        super(props);
        this.state = {
            config: null,
        }

        ipcRenderer.on('receive_config', (event, data) => {
            console.log(data);
            this.setState({ config: data })

        });
        ipcRenderer.on('build_update', (event, data) => {
            //this.child.SetBuild(data);
            this.SetChildBuild(data);

        });
        ipcRenderer.send("get-config");
    }
    componentDidMount() {
        ipcRenderer.send("set-path", "");
    }
    SendToCompile(build) {
        ipcRenderer.send("send-build", build);
    }
    render() {
        if (this.state.config == null) {
            return <div></div>
        }
        return (<div className="main-builder">
            <Builder onRef={ref => (this.SetChildBuild = ref)} config={this.state.config} SendBuild={this.SendToCompile.bind(this)} />
        </div>)
    }

}

export default BuilderWindow;