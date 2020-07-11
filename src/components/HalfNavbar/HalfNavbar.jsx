import React, { Component } from "react";
import {
    Alignment,
    Button,
    Classes,
    Navbar,
    NavbarGroup,
    NavbarHeading,
} from "@blueprintjs/core";
import GaijinLogo from "../../illustrations/gaijinlogo.svg";

class HalfNavbar extends Component {

    render() {
        return (
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading><img src={GaijinLogo} className="logo" /></NavbarHeading>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Button className={Classes.MINIMAL} icon="notifications" />
                    <Button className={Classes.MINIMAL} icon="envelope" />
                </NavbarGroup>
            </Navbar>
        )
    }

}

export default HalfNavbar;