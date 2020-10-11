import React from "react";
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';


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
        // if (this.state.val == "") {

        //     this.state.val = this.props.value;
        // }
        // 
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

        let val: string = e.target.value;
        console.log(val);
        if (this.state.type == "boolean") {
            val = e.target.checked;
        }

        this.setState({
            val: val
        })
        this.SendUpdate(this.state.name, val);
    }
    render() {
        if (this.state.type == "ritch") {
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
        // else if (this.state.type == "color") {
        //     return (
        //         <div className="prop-block">
        //             {this.state.name}:

        //         </div>
        //     )
        // }
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
export default PropBlock;