import React from "react";
import { Checkbox, FormControlLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { SketchPicker } from 'react-color';

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
        // if (this.state.type == "boolean" && this.state.val == "") {
        //     this.setState({
        //         val: "true"
        //     })
        // }

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
        else {
            val = e.target.value;
        }


        this.setState({
            val: val
        })
        this.SendUpdate(this.state.name, val);
    }
    render() {
        if (this.state.type.split("|").length > 1) { //combo box
            let options = this.state.type.split("|");
            for (let i = 0; i < options.length; i++) {
                options[i] = options[i].replaceAll('"', "");
            }
            return (
                <div className="prop-block">
                    <b> {this.state.name}:</b> <ComboBox onChange={this.Changed.bind(this)} options={options} val={this.state.val} />
                </div>
            )
        }
        else if (this.state.type == "ritch") {
            return (
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

                />)
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
                </div>
            )
        }
        else if (this.state.type == "color") {

            return (
                <div className="prop-block">
                    <div style={{ float: "left" }}>
                        <b>
                            {this.state.name}:
                        </b>
                    </div>
                    <ColorPicker onChange={this.Changed.bind(this)} color={this.state.val} /><br />
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
                </div>
            )
        }
    }
}
interface PropBlockProps {
    name: string,
    type: string,
    value?: string,
    onChange: (name: string, val: string) => void
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
        if (this.state.val == -1) return;
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
            color: {
                r: "122",
                g: "12",
                b: "122",
                a: "1",
            },
        };
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
                borderRadius: '2px',
                background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
            },
            swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
            },

        };

        return (
            <div style={{ float: "left", marginLeft: "10px" }}>
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





export default PropBlock;