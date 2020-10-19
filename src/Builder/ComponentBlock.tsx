import React from "react";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Builder from "./Builder";
import PropBlock from "./PropBlock";
import "./Builder.css";
import { Button } from "@material-ui/core";
import { Build, Component, Prop } from './Interfaces'
const { dialog } = require('electron').remote;

/** Component block added in builder. I has its own builder for children */
class ComponentBlock extends React.Component<BlockProps, BlockState> {
    state: BlockState;
    Update: (id: number, val: any) => void;
    SubBuildUpdate: (id: number, build: any) => void;
    OnDelete: (id: number) => void;
    OnMove: (id: number, dir: "up" | "down") => void;
    OnDuplicate: (id: number) => void;
    OnNameChange: (id: number, new_name: string) => void;
    SetChildBuild: any;
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
        this.Update = this.props.OnChange;
        this.SubBuildUpdate = props.SubBuildUpdate;
        this.OnDelete = this.props.OnDelete;
        this.OnMove = this.props.OnMove;
        this.OnDuplicate = this.props.OnDuplicate;
        this.OnNameChange = this.props.OnNameChange;
    }
    componentDidMount() {
        if (this.state.name == "Text" && this.state.active_props.length == 0) {
            this.Add(0);
        }
        else if (this.state.active_props.length == 0) {
            this.AddRequired();
        }
        if (this.props.PreviousBuild != undefined) {
            this.SetChildBuild(this.props.PreviousBuild);
        }

    }
    PropUsed(prop_name) {
        for (let active_prop of this.state.active_props) {
            if (active_prop.name == prop_name) return true;
        }
        return false;
    }
    NewChanged(e) {
        let anyUnusedPropIndex = -1;

        this.setState({ new_prop: anyUnusedPropIndex }, () => {
            this.Add(e.target.value);

        })

    }
    AddRequired() {
        let new_active_props = [...this.state.active_props];
        for (let i = 0; i < this.state.pos_props.length; i++) {
            if (this.state.pos_props[i].name[this.state.pos_props[i].name.length - 1] != "?") {
                let new_prop = JSON.parse(JSON.stringify(this.state.pos_props[i]));
                new_active_props.push(new_prop);
            }

        }
        this.setState(
            {
                active_props: new_active_props,
                //    pos_props: new_posible_props
            }, () => {
                // this.render();
            });
    }
    Add(prop_index) {
        let new_prop = JSON.parse(JSON.stringify(this.state.pos_props[prop_index]));
        let new_active_props = [...this.state.active_props];
        new_active_props.push(new_prop);
        this.Update(this.state.id, new_active_props);
        this.setState(
            {
                active_props: new_active_props,
                //    pos_props: new_posible_props
            }, () => {
                // this.render();
            });
    }
    Remove(props_name) {
        console.log(props_name);
        let new_active_props: Prop[] = [];
        for (let i = 0; i < this.state.active_props.length; i++) {
            if (this.state.active_props[i].name != props_name) {
                new_active_props.push(this.state.active_props[i]);
            }

        }
        this.Update(this.state.id, new_active_props);
        this.setState(
            {
                active_props: new_active_props,
            });

    }
    PropChanged(name: string, val: string) {
        let new_active_props = [...this.state.active_props];
        for (let i = 0; i < new_active_props.length; i++) {
            if (new_active_props[i].name == name) {
                new_active_props[i].val = val;
                // console.log(name + val);
                // this.setState({ active_props: new_active_props });
                this.Update(this.state.id, new_active_props);
                break;
            }
        }
    }
    SubBuildSend(build) {
        this.SubBuildUpdate(this.state.id, build);
    }
    Delete() {

        dialog.showMessageBox({
            buttons: ["Yes", "Cancel"],
            message: "Do you really want to delete this component?"
        }).then((data) => {
            if (data.response == "0") {
                this.OnDelete(this.state.id);
            }
        })

    }
    MoveDown() {
        this.OnMove(this.state.id, "down");
    }
    MoveUp() {
        this.OnMove(this.state.id, "up");
    }
    Duplicate() {
        this.OnDuplicate(this.state.id);
    }
    ChangeName(e) {
        dialog.showMessageBox({
            buttons: ["Yes", "Cancel"],
            message: "Do you really want to delete this component?"
        }).then((data) => {
            if (data.response == "0") {
                let new_name = Object.keys(this.state.config.components)[e.target.value];
                console.log(new_name);
                this.OnNameChange(this.state.id, new_name);
            }
        })

    }

    render() {
        //console.log(this.state.active_props);
        //console.log(this.state.pos_props);
        let menu: any = [];
        menu.push(<MenuItem key={-1} value={-1}>{<i>Add prop</i>}</MenuItem>);
        let i = 0;

        for (let prop of this.state.pos_props) {

            if (prop.name != "children?" && this.PropUsed(prop.name) == false) {
                menu.push(<MenuItem key={i} value={i}>{prop.name}</MenuItem>)
            }
            i++;
        }


        let styles = {
            background: this.state.color
        }
        let active_props: any = [];
        for (let prop of this.state.active_props) {
            active_props.push(
                <PropBlock
                    key={prop.name}
                    name={prop.name}
                    type={prop.type}
                    value={prop.val}
                    onChange={this.PropChanged.bind(this)}
                    onRemove={this.Remove.bind(this)} />)
        }

        let component_names = Object.keys(this.state.config.components);
        let new_name_menu: any[] = [];
        i = 0;
        new_name_menu.push(<MenuItem key={-1} value={-1}>{<i>Change to</i>}</MenuItem>);
        for (let name of component_names) {
            if (name != "Text") {
                for (let allowed_change of this.props.canChangeTo) {
                    if (allowed_change != this.state.name && allowed_change == name) {
                        new_name_menu.push(<MenuItem key={i} value={i}>{name}</MenuItem>);
                        break;
                    }
                }
            }
            i++;
        }

        let header = <div> <h3>{this.state.name} {this.state.id}</h3>
            <Button onClick={this.Delete.bind(this)}>Delete</Button>
            <Button onClick={this.MoveDown.bind(this)}>DOWN</Button>
            <Button onClick={this.MoveUp.bind(this)}>UP</Button>
            <Button onClick={this.Duplicate.bind(this)}>Duplicate</Button></div>
        if (this.state.name == "Text") {
            return (
                <div>
                    <div className="component-block" style={styles}>
                        {header}
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
                <div key={this.state.id} className="component-block" style={styles}>
                    {header}
                    <Select
                        value={-1}
                        onChange={this.ChangeName.bind(this)}
                    >
                        {new_name_menu}
                    </Select>
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
                        <Builder ParrentName={this.state.name} onRef={ref => (this.SetChildBuild = ref)} SendBuild={this.SubBuildSend.bind(this)} config={this.state.config} />
                    </div>
                </div>);
        }
    }
};

interface BlockProps {
    /** Name of the component - like Section */
    name: string,
    /** Unique id */
    id: number,
    /** Possible props */
    pos_props: {
        name: string,
        type: string
    }[],
    /** Allowed children of the parrent */
    canChangeTo: any,
    /** Props changed by user */
    active_props: Prop[],
    /** Called on any change */
    OnChange: (id: number, val: any) => void,
    /** Components buiild changed */
    SubBuildUpdate: (id: number, build: any) => void,
    /** When user clicks on delete button */
    OnDelete: (id: number) => void,
    /** When user moves the component */
    OnMove: (id: number, dir: "up" | "down") => void,
    /** When user click on duplicate button */
    OnDuplicate: (id: number) => void,
    /** When user changes type of the component */
    OnNameChange: (id: number, new_name: string) => void,
    /** Config file */
    config: any,
    /** Loaded build */
    PreviousBuild?: Build | null
}
interface BlockState {

    name: string,
    id: number,
    pos_props: Prop[],
    new_prop: number,
    active_props: Prop[],
    config: any,
    color: string

}

export default ComponentBlock;
