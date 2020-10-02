import * as React from 'react';
import "./Builder.css";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Button, TextField } from '@material-ui/core';
import { ReactNode } from 'react';
const ipcRenderer = require('electron').ipcRenderer;

class Builder extends React.Component {
  state: any;

  constructor(props: any) {
    super(props);
    this.state = {
      new_component: 0,
      config: null,
      build: []
    }

    ipcRenderer.on('receive_config', (event, data) => {
      console.log(data);
      this.setState({ config: data })

    });
    ipcRenderer.send("get-config");
  }
  Add() {
    console.log("Sending build");

    let selected = Object.keys(this.state.config.components)[this.state.new_component];
    let id = this.state.build.length == 0 ? 0 : this.state.build[this.state.build.length - 1].id + 1;

    let new_build = [...this.state.build];
    new_build.push({
      name: selected,
      id: id,
      props: []
    });
    ipcRenderer.send("send-build", new_build);
    this.setState({
      build: new_build
    });
  }
  NewChanged(e) {
    this.setState({ new_component: e.target.value })
  }
  PropsChanged(id, val) {
    let new_build = [...this.state.build];
    for (let i = 0; i < new_build.length; i++) {
      if (new_build[i].id == id) {
        new_build[i].props = val;
        ipcRenderer.send("send-build", new_build);
        this.setState({
          build: new_build
        });
        break;
      }
    }
  }
  render() {
    if (this.state.config == null) return <div>error</div>;
    let component_names = Object.keys(this.state.config.components);
    let menu: ReactNode[] = [];
    let i = 0;
    for (let name of component_names) {
      menu.push(<MenuItem value={i}>{name}</MenuItem>);
      i++;
    }
    let active_components: ReactNode[] = [];
    console.log(this.state.build)
    for (let component of this.state.build) {
      let posible_props = this.state.config.components[component.name].props;
      active_components.push(
        <ComponentBlock
          name={component.name}
          id={component.id}
          pos_props={posible_props}
          active_props={component.props}
          OnChange={this.PropsChanged.bind(this)}
        />)
    }
    return (
      <div className="builder">
        <div className="old">
          {active_components}
        </div>
        <div className="new">


          <Select
            value={this.state.new_component}
            onChange={this.NewChanged.bind(this)}
          >
            {menu}
          </Select>
          <br />
          <Button variant="outlined" onClick={this.Add.bind(this)}>Add</Button>

        </div>


      </div>)
  }
}

class ComponentBlock extends React.Component<BlockProps> {
  state: any;
  Update: (id: number, val: any) => void;
  constructor(props: BlockProps) {
    super(props);
    this.state = {
      name: props.name,
      id: props.id,
      pos_props: props.pos_props,
      new_prop: 0,
      active_props: props.active_props
    }
    this.Update = this.props.OnChange;
  }
  NewChanged(e) {
    this.setState({ new_prop: e.target.value })
  }
  Add() {
    let new_prop = this.state.pos_props[this.state.new_prop];
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
  render() {
    let menu: any = [];
    let i = 0;
    for (let prop of this.state.pos_props) {
      menu.push(<MenuItem value={i}>{prop.name}</MenuItem>)
      i++;
    }

    let active_props: any = [];
    for (let prop of this.state.active_props) {
      active_props.push(<PropBlock name={prop.name} type={prop.type} value={prop.val} onChange={this.PropChanged.bind(this)} />)
    }

    return (
      <div className="component-block">
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
            <Button onClick={this.Add.bind(this)} variant="outlined">Add</Button>
          </div>
          <div>
            {active_props}
          </div>
        </div>
        <div>
          <h4>Content:</h4>
        </div>
      </div>);
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
  OnChange: (id: number, val: any) => void
}

class PropBlock extends React.Component<PropBlockProps> {
  state: any;
  SendUpdate: (name: string, val: string) => void;
  constructor(props: PropBlockProps) {
    super(props);
    this.state = {
      name: this.props.name,
      type: this.props.type,
      val: this.props.value,
    }
    this.SendUpdate = this.props.onChange;
  }
  Changed(e) {
    this.SendUpdate(this.state.name, e.target.value);
  }
  render() {
    return (
      <div className="prop-block">
        <TextField
          onChange={this.Changed.bind(this)}
          value={this.state.val}
          size="small"
          id="outlined-basic"
          label={this.props.name}
          placeholder={this.props.type}
          variant="outlined" />
      </div>
    )
  }
}
interface PropBlockProps {
  name: string,
  type: string,
  value: string,
  onChange: (name: string, val: string) => void
}

export default Builder;