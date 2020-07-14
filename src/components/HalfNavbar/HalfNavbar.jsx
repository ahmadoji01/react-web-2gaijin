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
            <nav class="bp3-navbar no-shadow">
                <div class="bp3-navbar-group bp3-align-left">
                    <div class="bp3-navbar-heading"><img src={GaijinLogo} className="logo" /></div>
                </div>
                <div class="bp3-navbar-group bp3-align-right">
                    <button class="bp3-button bp3-minimal bp3-icon-truck">Delivery</button>
                    <button class="bp3-button bp3-minimal bp3-icon-notifications"></button>
                    <button class="bp3-button bp3-minimal bp3-icon-envelope"></button>
                </div>
            </nav>
        )
    }

}

export default HalfNavbar;