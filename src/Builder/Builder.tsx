import * as React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Button } from '@material-ui/core';
import { ReactNode } from 'react';
import ComponentBlock from './ComponentBlock';
import { Build, Component, Prop } from './Interfaces'

/**
 * Builder holds added components and select button for adding new ones.  
 */
class Builder extends React.Component<BuildProps, BuildState> {
  state: BuildState
  SendBuild: any;
  constructor(props: BuildProps) {
    super(props);
    this.state = {
      new_component: 0,
      config: props.config,
      build: [],
      id: 0,
      parrent_component_name: this.props.ParrentName,
    }
    this.SendBuild = props.SendBuild;
  }
  componentDidMount() {
    if (this.props.onRef != undefined)
      this.props.onRef(this.SetBuild.bind(this))
  }
  /** Sets build from parrent component */
  SetBuild(new_build) {
    let highest_id = -100;
    for (let comp of new_build) {
      if (comp.id > highest_id) {
        highest_id = comp.id;
      }
    }
    if (highest_id == -100) highest_id = -1;
    this.setState({
      build: new_build,
      id: highest_id + 1
    });
  }
  /** Adds new component to the build */
  Add(index) {
    let selected = Object.keys(this.state.config.components)[index];
    let id = this.state.id;

    let new_build = [...this.state.build];
    new_build.push({
      name: selected,
      id: id,
      props: [],
      children: null
    });
    this.SendBuild(new_build);
    this.setState({
      build: new_build,
      id: this.state.id + 1
    });
  }
  /** Clicked on selelct */
  NewChanged(e) {
    this.Add(e.target.value);
  }
  /** Prop from child component changed */
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
  /** Get build from child component */
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
  /** For handling removing components */
  ComponentDeleted(id) {
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

  /** Moves order of components */
  HandleMove(id: number, dir: "up" | "down") {
    let new_build: Build = [];
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

  /** Duplicates given component */
  HandleDulicate(id: number) {
    let new_build: Build = [];
    for (let i = 0; i < this.state.build.length; i++) {
      new_build.push(this.state.build[i]);
      if (this.state.build[i].id == id) {
        let copy: Component = JSON.parse(JSON.stringify(this.state.build[i]));
        copy.id = this.state.id;
        new_build.push(copy);
      }
    }
    this.SendBuild(new_build);
    this.setState({
      build: new_build,
      id: this.state.id + 1,
    })
  }

  /** When component changes to different one - will remove props */
  HandleComponentNameChange(id: number, new_name: string) {
    let new_build: Build = [];
    for (let i = 0; i < this.state.build.length; i++) {

      if (this.state.build[i].id == id) {
        let new_component: Component = {
          children: JSON.parse(JSON.stringify(this.state.build[i].children)),
          id: this.state.id,
          name: new_name,
          props: []
        }

        new_build.push(new_component);
      }
      else {

        new_build.push(this.state.build[i]);
      }
    }
    this.SendBuild(new_build);
    this.setState({
      build: new_build,
      id: this.state.id + 1
    })
  }
  render() {
    if (this.state.config == null) return <div>error</div>;
    let component_names = Object.keys(this.state.config.components);
    let menu: ReactNode[] = [];
    let canChangeTo: ReactNode[] = [];
    let i = 0;
    menu.push(<MenuItem key={-1} value={-1}>{<i>Add component</i>}</MenuItem>);
    for (let name of component_names) {
      for (let allowed_child of this.state.config.components[name].can_be_in) {
        if (allowed_child == this.state.parrent_component_name) {
          menu.push(<MenuItem key={i} value={i}>{name}</MenuItem>);
          canChangeTo.push(name);
          break;
        }
      }
      i++;
    }

    let active_components: ReactNode[] = [];
    i = 0;
    for (let component of this.state.build) {
      let posible_props: Prop[] = [...this.state.config.components[component.name].props];
      active_components.push(
        <ComponentBlock
          canChangeTo={[...canChangeTo]}
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
          OnDuplicate={this.HandleDulicate.bind(this)}
          OnNameChange={this.HandleComponentNameChange.bind(this)}
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
            value={-1}
            onChange={this.NewChanged.bind(this)}
          >
            {menu}
          </Select>
          <br />
        </div>


      </div>)
  }
}

interface BuildProps {
  /** Type of parrent component - for allowed child component */
  ParrentName: string,
  /** Config file */
  config: any,
  /** Function called when build is changed */
  SendBuild: (build: any) => void,
  /** To set loaded build */
  onRef?: any,
}
interface BuildState {
  new_component: number,
  config: any,
  build: Build,
  id: number,
  parrent_component_name: string
}


export default Builder;