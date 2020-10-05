import React from "react";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Button, TextField } from '@material-ui/core';
import Builder from "./Builder";
import PropBlock from "./PropBlock";
import "./Builder.css";

class ComponentBlock extends React.Component<BlockProps> {
    state: any;
    Update: (id: number, val: any) => void;
    SubBuildUpdate: (id: number, build: any) => void;
    constructor(props: BlockProps) {
        super(props);
        this.state = {
            name: props.name,
            id: props.id,
            pos_props: props.pos_props,
            new_prop: -1,
            active_props: props.active_props,
            config: props.config,
            color: "rgb(" + (Math.random() * 100 + 150) + "," + (Math.random() * 100 + 150) + "," + (Math.random() * 100 + 150) + ")"
        }
        for (let i = 0; i < this.state.pos_props.length; i++) {
            this.state.pos_props[i].used = false;

        }
        this.Update = this.props.OnChange;
        this.SubBuildUpdate = props.SubBuildUpdate;

    }
    componentDidMount() {
        if (this.state.name == "Text") {
            console.log("stalo se")
            this.Add(0);
        }
    }
    NewChanged(e) {
        let anyUnusedPropIndex = -1;

        this.setState({ new_prop: anyUnusedPropIndex }, () => {
            this.Add(e.target.value);

        })

    }
    Add(prop_index) {
        this.state.pos_props[prop_index].used = true;
        let new_prop = this.state.pos_props[prop_index];
        let new_active_props = [...this.state.active_props];
        new_active_props.push(new_prop);
        this.setState({ active_props: new_active_props });
    }
    PropChanged(name: string, val: string) {
        let new_active_props = [...this.state.active_props];
        for (let i = 0; i < new_active_props.length; i++) {
            if (new_active_props[i].name == name) {
                new_active_props[i].val = val;
                console.log(name + val);
                // this.setState({ active_props: new_active_props });
                this.Update(this.state.id, new_active_props);
                break;
            }
        }
    }
    SubBuildSend(build) {
        this.SubBuildUpdate(this.state.id, build);
    }
    render() {
        let menu: any = [];
        menu.push(<MenuItem value={-1}>{<i>Select new prop</i>}</MenuItem>);
        let i = 0;
        for (let prop of this.state.pos_props) {
            if (prop.name != "children?" && prop.used == false) {
                menu.push(<MenuItem value={i}>{prop.name}</MenuItem>)
            }
            i++;
        }


        let styles = {
            background: this.state.color
        }
        let active_props: any = [];
        for (let prop of this.state.active_props) {
            active_props.push(<PropBlock name={prop.name} type={prop.type} value={prop.val} onChange={this.PropChanged.bind(this)} />)
        }
        if (this.state.name == "Text") {
            return (
                <div>
                    <div className="component-block" style={styles}>
                        <div className="component-props">
                            <div>
                                {active_props}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="component-block" style={styles}>
                    <h3>{this.state.name} {this.state.id}</h3>
                    <div className="component-props">
                        <div>
                            <h4>Props:  </h4>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.new_prop}
                                onChange={this.NewChanged.bind(this)}
                            >
                                {menu}
                            </Select>
                            {/* <Button onClick={this.Add.bind(this)} variant="text">Add</Button> */}
                        </div>
                        <div>
                            {active_props}
                        </div>
                    </div>
                    <div>
                        <h4>Content:</h4>
                        <Builder SendBuild={this.SubBuildSend.bind(this)} config={this.state.config} />
                    </div>
                </div>);
        }
    }
};

interface BlockProps {
    name: string,
    id: number,
    pos_props: {
        name: string,
        type: string
    }[],
    active_props: {
        name: string,
        type: string,
        val: string
    }[],
    OnChange: (id: number, val: any) => void,
    SubBuildUpdate: (id: number, build: any) => void;
    config: any
}

export default ComponentBlock;
