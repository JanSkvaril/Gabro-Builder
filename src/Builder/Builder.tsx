import * as React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Button } from '@material-ui/core';
import { ReactNode } from 'react';
import ComponentBlock from './ComponentBlock';



class Builder extends React.Component<BuildProps> {
  state: any;
  SendBuild: any;
  constructor(props: BuildProps) {
    super(props);
    this.state = {
      new_component: 0,
      config: props.config,
      build: [],
    }
    this.SendBuild = props.SendBuild;
  }
  componentDidMount() {
    if (this.props.onRef != undefined)
      this.props.onRef(this.SetBuild.bind(this))
  }
  SetBuild(new_build) {
    this.setState({
      build: new_build
    });
  }
  Add() {

    let selected = Object.keys(this.state.config.components)[this.state.new_component];
    let id = this.state.build.length == 0 ? 0 : this.state.build[this.state.build.length - 1].id + 1;

    let new_build = [...this.state.build];
    new_build.push({
      name: selected,
      id: id,
      props: [],
      children: null
    });
    this.SendBuild(new_build);
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
        this.SendBuild(new_build);
        this.setState({
          build: new_build
        });
        break;
      }
    }
  }
  RecieveBuild(id, build) {
    let new_build = [...this.state.build];
    for (let i = 0; i < new_build.length; i++) {
      if (new_build[i].id == id) {
        new_build[i].children = build;
        this.SendBuild(new_build);
        this.setState({
          build: new_build
        });
        break;
      }
    }

  }
  ComponentDeleted(id) {
    // if (!confirm("Are you sure you want do delete this component?")) {
    //   return;
    // }
    let new_build: any = [];
    for (let i = 0; i < this.state.build.length; i++) {
      if (this.state.build[i].id != id) {
        new_build.push(this.state.build[i]);
      }
    }

    this.SendBuild(new_build);
    this.setState({
      build: new_build
    });
  }
  HandleMove(id: number, dir: "up" | "down") {
    let new_build: any = [];
    if (dir == "down") {

      for (let i = 0; i < this.state.build.length; i++) {
        if (this.state.build[i].id == id) {
          if (i + 1 == this.state.build.length) return;

          new_build.push(this.state.build[i + 1]);
          new_build.push(this.state.build[i]);
          i++;
        }
        else {
          new_build.push(this.state.build[i]);
        }
      }
    }
    else {

      for (let i = 0; i < this.state.build.length; i++) {

        if (this.state.build[i].id == id) {
          if (i == 0) return;
          new_build.pop();
          new_build.push(this.state.build[i]);
          new_build.push(this.state.build[i - 1]);

          i++;
        }
        else {
          new_build.push(this.state.build[i]);
        }
      }
    }
    this.SendBuild(new_build);
    this.setState({
      build: new_build
    });
  }
  render() {
    //console.log(this.state.config)
    if (this.state.config == null) return <div>error</div>;
    let component_names = Object.keys(this.state.config.components);
    let menu: ReactNode[] = [];
    let i = 0;
    for (let name of component_names) {
      menu.push(<MenuItem key={i} value={i}>{name}</MenuItem>);
      i++;
    }
    let active_components: ReactNode[] = [];
    i = 0;
    for (let component of this.state.build) {
      let posible_props = [...this.state.config.components[component.name].props];
      // console.log(component.props);
      active_components.push(
        <ComponentBlock
          key={component.id}
          name={component.name}
          id={component.id}
          pos_props={posible_props}
          active_props={component.props}
          OnChange={this.PropsChanged.bind(this)}
          config={this.state.config}
          SubBuildUpdate={this.RecieveBuild.bind(this)}
          OnDelete={this.ComponentDeleted.bind(this)}
          OnMove={this.HandleMove.bind(this)}
          PreviousBuild={component.children}
        />)
      i++;
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

interface BuildProps {
  config: any,
  SendBuild: (build: any) => void,
  onRef?: any,
}


export default Builder;