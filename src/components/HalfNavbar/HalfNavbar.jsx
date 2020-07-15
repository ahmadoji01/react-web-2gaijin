import React, { Component } from "react";
import {
    Alignment,
    Button,
    Classes,
    Dialog,
    Navbar,
    NavbarGroup,
    NavbarHeading,
    Menu, MenuDivider, MenuItem, Popover, Position, AnchorButton
} from "@blueprintjs/core";
import GaijinLogo from "../../illustrations/gaijinlogo.svg";
import AuthService from "../../services/auth.service";
import SignIn from "../../dialogs/SignIn";
import { INTENT_WARNING } from "@blueprintjs/core/lib/esm/common/classes";

class HalfNavbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            isSignInDialogOpen: false,
        };
        this.onSignOutButtonClick = this.onSignOutButtonClick.bind(this);
    }

    componentWillMount() {
        if(AuthService.getCurrentUser()) {
            this.setState({ isLoggedIn: true });
        }
    }

    onSignOutButtonClick() {
        AuthService.logout().then(() => {
            window.location = "/";
        });
    }

    render() {
        
        const accountMenu = (
            <Menu>
                <MenuItem text="Sign Out" onClick={this.onSignOutButtonClick} intent={INTENT_WARNING}  />
            </Menu>
        )

        return (
            <nav class="bp3-navbar no-shadow">
                <div class="bp3-navbar-group bp3-align-left">
                    <div class="bp3-navbar-heading"><img src={GaijinLogo} className="logo" /></div>
                </div>
                <div class="bp3-navbar-group bp3-align-right">
                    <button class="bp3-button bp3-minimal bp3-icon-truck">Delivery</button>
                    <button class="bp3-button bp3-minimal bp3-icon-notifications"></button>
                    <button class="bp3-button bp3-minimal bp3-icon-envelope"></button>
                    { this.state.isLoggedIn && 
                    <Popover content={accountMenu} position={Position.BOTTOM}>
                        <Button className={Classes.MINIMAL} icon="user" />
                    </Popover> }
                    { !this.state.isLoggedIn && 
                    <>
                        <Button className={Classes.MINIMAL} text="Sign In" onClick={() => this.setState({ isSignInDialogOpen: true })} />
                        <Dialog isOpen={this.state.isSignInDialogOpen} onClose={() => this.setState({ isSignInDialogOpen: false })}><SignIn /></Dialog>
                        <AnchorButton className={Classes.MINIMAL} text="Sign Up" href="/sign-up" />
                    </> }
                </div>
            </nav>
        )
    }

}

export default HalfNavbar;