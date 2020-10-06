import React from "react";
import { TextField } from '@material-ui/core';


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
    value: string,
    onChange: (name: string, val: string) => void
}

export default PropBlock;