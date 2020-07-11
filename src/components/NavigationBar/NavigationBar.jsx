import React, { Component } from "react";
import {
    Alignment,
    Button,
    Classes,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Menu, MenuDivider, MenuItem, Popover, Position
} from "@blueprintjs/core";

class NavigationBar extends Component {

    

    render() {
        const exampleMenu = (
            <Menu>
                <MenuItem icon="graph" text="Graph" />
                <MenuItem icon="map" text="Map" />
                <MenuItem icon="th" text="Table" shouldDismissPopover={false} />
                <MenuItem icon="zoom-to-fit" text="Nucleus" disabled={true} />
                <MenuDivider />
                <MenuItem icon="cog" text="Settings...">
                    <MenuItem icon="add" text="Add new application" disabled={true} />
                    <MenuItem icon="remove" text="Remove application" />
                </MenuItem>
            </Menu>
        )

        return (
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading><img src={GaijinLogo} className="logo" /></NavbarHeading>
                    <NavbarDivider />
                    <Popover content={exampleMenu} position={Position.BOTTOM}>
                        <Button className={Classes.MINIMAL} text="Categories" />
                    </Popover>
                    <NavbarDivider />
                    <div class="bp3-input-group .bp3-large">
                        <span class="bp3-icon bp3-icon-search"></span>
                        <input class="bp3-input" type="search" placeholder="Search input" dir="auto" />
                        <Button intent="warning" text="Search" />
                    </div>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Button className={Classes.MINIMAL} icon="home" text="Home" />
                    <Button className={Classes.MINIMAL} icon="document" text="Files" />
                </NavbarGroup>
            </Navbar>
        )
    }

}

export default NavigationBar;