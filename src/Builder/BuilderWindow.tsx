import { ipcRenderer } from "electron";
import React from "react";
import Builder from "./Builder";

/** Main component holding all other components and builds */
class BuilderWindow extends React.Component {
    state: any;
    SetChildBuild: any;
    constructor(props: any) {

        super(props);
        this.state = {
            config: null,
            recieved_first_build: false
        }

        ipcRenderer.on('receive_config', (event, data) => {
            console.log(data);
            this.setState({ config: data })

        });
        ipcRenderer.on('build_update', (event, data) => {


            this.setState({ recieved_first_build: true }, () => {
                this.SetChildBuild(data);
            })
        });
        ipcRenderer.send("get-config");
    }
    componentDidMount() {
        //  ipcRenderer.send("set-path", "");
    }
    SendToCompile(build) {
        ipcRenderer.send("send-build", build);
    }
    render() {
        if (this.state.config == null) {
            return <div></div>
        }
        else if (this.state.recieved_first_build == false) {
            return (<div style={{ textAlign: "center", margin: "30px" }}>
                <h2>No project selected</h2>
                <h3>Please open existing project or create new one</h3>
            </div>)
        }
        return (<div className="main-builder">
            <Builder ParrentName="root" onRef={ref => (this.SetChildBuild = ref)} config={this.state.config} SendBuild={this.SendToCompile.bind(this)} />
        </div>)
    }

}

export default BuilderWindow;