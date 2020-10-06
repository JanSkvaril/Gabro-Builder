import { Button, Drawer } from "@material-ui/core";
import React from "react";

const { dialog } = require('electron').remote;
import { ipcRenderer } from "electron";


function Open() {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then((result) => {
        ipcRenderer.send("set-path", result.filePaths[0]);
    });

}

function Menu(props) {

    return (
        <div>
            <Drawer variant="permanent" anchor={"bottom"} open={true} >
                <Button onClick={Open} variant="outlined">Open</Button>
            </Drawer>
        </div>)
}

export default Menu;


