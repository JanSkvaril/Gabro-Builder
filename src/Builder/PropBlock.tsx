import React from "react";
import { Button, Checkbox, FormControlLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { SketchPicker } from 'react-color';
const { dialog } = require('electron').remote;

/**
 * Contains specific prop
 */
class PropBlock extends React.Component<PropBlockProps, PropBlockState> {
    state: PropBlockState;
    SendUpdate: (name: string, val: string) => void;
    constructor(props: PropBlockProps) {
        super(props);

        this.state = {
            name: this.props.name,
            type: this.props.type,
            val: this.props.value || "",
        }

        this.SendUpdate = this.props.onChange;
    }
    componentDidMount() {

    }
    Remove() {
        this.props.onRemove(this.state.name);
    }
    Changed(e) {

        let val: string;
        if (this.state.type == "boolean") {
            val = e.target.checked;
        }
        else if (this.state.type == "color") {
            val = e;
        }
        else if (this.state.type.split("|").length > 1) {
            val = e;
        }
        else if (this.state.type == "filePath") {
            val = e;
        }
        else if (this.state.type == "bg") {
            val = e;
        }
        else {
            val = e.target.value;
        }


        this.setState({
            val: val
        })
        this.SendUpdate(this.state.name, val);
    }
    render() {
        let remove_button = <Button onClick={this.Remove.bind(this)} variant="text"><i>remove</i></Button>
        console.log(this.state.name[this.state.name.length]);
        if (this.state.name[this.state.name.length - 1] != "?") remove_button = <React.Fragment></React.Fragment>;
        if (this.state.type.split("|").length > 1) { //combo box
            let options = this.state.type.split("|");
            for (let i = 0; i < options.length; i++) {
                options[i] = options[i].replaceAll('"', "").trim();
            }

            return (
                <div className="prop-block">
                    <b> {this.state.name}:</b> <ComboBox onChange={this.Changed.bind(this)} options={options} val={this.state.val} />
                    {remove_button}
                </div>
            )
        }
        else if (this.state.type == "ritch") {
            return (
                <div>
                    <TextField

                        onChange={this.Changed.bind(this)}
                        value={this.state.val}
                        size="small"
                        fullWidth={true}
                        label={"Text"}
                        placeholder={"<p>Same text</p>"}
                        variant="outlined"
                        multiline
                        rowsMax={10}
                        rows={4}

                    />

                </div>)
        }
        else if (this.state.type == "filePath") {
            return (
                <div className="prop-block">
                    <b>{this.state.name}</b> <i>{this.state.val}</i> <PathSelector onChange={this.Changed.bind(this)} />
                    {remove_button}
                </div>
            )
        }
        else if (this.state.type == "boolean") {
            return (
                <div className="prop-block">
                    <FormControlLabel
                        control={
                            <Checkbox onChange={this.Changed.bind(this)} checked={Boolean(this.state.val)} color="default" name="checkedA" />
                        }
                        label={this.state.name}
                    />
                    {remove_button}
                </div>
            )
        }
        else if (this.state.type == "color") {

            return (
                <div className="prop-block">
                    <div style={{ float: "left", margin: "5px" }}>
                        <b>
                            {this.state.name}:
                        </b>
                    </div>
                    <ColorPicker onChange={this.Changed.bind(this)} color={this.state.val} />
                    {remove_button}
                    <br />

                </div>
            )
        }
        else if (this.state.type == "bg") {
            return (
                <div style={{ margin: "10px", padding: "20px", border: "1px solid rgba(0,0,0,0.3)", borderRadius: "15px" }}>
                    <h3>{this.props.name}  {remove_button}</h3> <br />
                    <BgPicker val={this.state.val} onChange={this.Changed.bind(this)} />

                </div>

            )
        }
        else {
            return (
                <div className="prop-block">
                    <TextField
                        onChange={this.Changed.bind(this)}
                        value={this.state.val}
                        size="small"

                        label={this.props.name}
                        placeholder={this.props.type}
                        variant="outlined" />
                    {remove_button}
                </div>
            )
        }
    }
}
interface PropBlockProps {
    name: string,
    type: string,
    value?: string,
    onChange: (name: string, val: string) => void,
    onRemove: (prop_name: string) => void,
}
interface PropBlockState {
    name: string,
    type: string,
    val?: string,
}

class ComboBox extends React.Component<ComboBoxProps> {
    state: any
    constructor(props: ComboBoxProps) {
        super(props);
        this.state = {
            val: this.props.options.indexOf(this.props.val || ""),
        };
    }
    componentDidMount() {
        console.log(this.state.val)
        if (this.state.val == -1) {
            this.props.onChange(this.props.options[0]);
            this.setState({
                val: 0
            })
        }
    }
    HandleChange = (e) => {
        this.props.onChange(this.props.options[e.target.value]);
        this.setState({
            val: e.target.value
        })
    }
    render() {
        if (this.state.val == -1) return <span></span>;
        let menu: any = [];
        let i = 0;
        for (let item of this.props.options) {
            menu.push(<MenuItem key={i} value={i}>{item}</MenuItem>);
            i++;
        }
        return (
            < Select

                value={this.state.val}
                onChange={this.HandleChange}
                label={this.state.val}
            >
                { menu}
            </Select>
        )
    }
}
interface ComboBoxProps {
    options: string[],
    onChange: (val: string) => void,
    val?: string
}

class ColorPicker extends React.Component<ColorPickerProps> {
    state: any
    constructor(props) {
        super(props)
        console.log(props.color);
        this.state = {
            displayColorPicker: false,
            color: props.color || {
                r: "122",
                g: "12",
                b: "122",
                a: "1",
            },
        };
    }
    componentDidMount() {
        if (!this.props.color) {
            this.props.onChange(this.state.color);
        }
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        this.setState({ color: color.rgb })
    };
    handleComplete = (color) => {

        this.props.onChange(color.rgb);
    }
    render() {

        const styles = {

            color: {
                width: '36px',
                height: '14px',
                borderRadius: '7px',
                background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
            },
            swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '7px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
            },

        };

        return (
            <div style={{ float: "left", margin: "5px" }}>
                <div style={styles.swatch} onClick={this.handleClick}>
                    <div style={styles.color} />
                </div>
                {
                    this.state.displayColorPicker ?
                        <div style={{
                            position: 'absolute',
                            zIndex: 2,
                        }}>
                            <div style={{
                                position: 'fixed',
                                top: '0px',
                                right: '0px',
                                bottom: '0px',
                                left: '0px',
                            }} onClick={this.handleClose} />
                            <SketchPicker color={this.state.color} onChange={this.handleChange} onChangeComplete={this.handleComplete} />
                        </div> : null}

            </div>
        )
    }
}

interface ColorPickerProps {
    onChange: any,
    color?: string
}

class PathSelector extends React.Component<PathProps> {
    state: any
    constructor(props: PathProps) {
        super(props);
    }
    Open() {
        dialog.showOpenDialog({
            properties: ['openFile']
        }).then((result) => {
            if (result.filePaths[0] != undefined) {
                this.props.onChange(result.filePaths[0])
            }
        });

    }
    render() {
        return (
            <Button onClick={this.Open.bind(this)} variant="outlined" > Select</Button>
        )
    }
}
interface PathProps {
    onChange: (path: string) => void,
}

class BgPicker extends React.Component<BgProps> {
    state: any
    constructor(props: BgProps) {
        super(props);
        this.state = {
            gradient: props.val.gradient || [{ r: 0, g: 0, b: 0, a: 0 }, { r: 0, g: 0, b: 0, a: 0 }],
            bgImagePath: props.val.bgImagePath || "",
            isGradient: false
        };
    }
    Update = () => {
        this.props.onChange({
            gradient: this.state.gradient,
            bgImagePath: this.state.bgImagePath
        })
    }
    ChangeFirstColor = (color) => {
        let new_gradient = [...this.state.gradient];
        new_gradient[0] = color;
        if (JSON.stringify(this.state.gradient[0]) == JSON.stringify({ r: 0, g: 0, b: 0, a: 0 })) {
            new_gradient[0].a = 1;
        }
        if (this.state.isGradient == false) {
            new_gradient[1] = color;
            if (JSON.stringify(this.state.gradient[1]) == JSON.stringify({ r: 0, g: 0, b: 0, a: 0 })) {
                new_gradient[1].a = 1;
            }
        }
        this.setState({
            gradient: new_gradient
        }, this.Update)
    }
    ChangeSecondColor = (color) => {
        let new_gradient = [...this.state.gradient];
        new_gradient[1] = color;
        if (JSON.stringify(this.state.gradient[1]) == JSON.stringify({ r: 0, g: 0, b: 0, a: 0 })) {
            new_gradient[1].a = 1;
        }
        this.setState({
            gradient: new_gradient
        }, this.Update)
    }
    ChangePath = (path) => {
        this.setState({
            bgImagePath: path
        }, this.Update)
    }
    CheckBoxChanged(e) {
        this.setState(
            {
                isGradient: e.target.checked
            }
        );

    }
    render() {

        return (
            <div>
                <div style={{ width: "100%", height: "75px" }}>
                    <FormControlLabel
                        control={
                            <Checkbox onChange={this.CheckBoxChanged.bind(this)} checked={Boolean(this.state.isGradient)} color="default" name="checkedA" />
                        }
                        label={"Gradient"}
                    /> <br />
                    <b style={{ float: "left", margin: "5px" }}>Color:</b>
                    <ColorPicker color={this.state.gradient[0]} onChange={this.ChangeFirstColor} />
                    {this.state.isGradient ? <ColorPicker color={this.state.gradient[1]} onChange={this.ChangeSecondColor} /> : ""}
                </div>

                <div style={{ width: "100%", margin: "5px" }}>
                    <b>Background image:</b> <i>{this.state.bgImagePath}</i> <PathSelector onChange={this.ChangePath.bind(this)} />
                </div>
            </div >
        )
    }
}
interface BgProps {
    val: any
    onChange: (bg: any) => void
}



export default PropBlock;