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
import Delivery from "../../dialogs/Delivery";
import Notifications from "../../dialogs/Notifications";

class HalfNavbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            isSignInDialogOpen: false,
            isDeliveryDialogOpen: false,
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

    onMyProfileClick(userID) {
        window.location = "/profile/" + userID;
    }

    render() {
        
        const accountMenu = (
            <Menu>
                <MenuItem text="My Profile" onClick={() => this.onMyProfileClick(localStorage.getItem("user_id"))} intent={INTENT_WARNING}  />
                <MenuItem text="Sign Out" onClick={this.onSignOutButtonClick} intent={INTENT_WARNING}  />
            </Menu>
        )

        return (
            <nav class="bp3-navbar no-shadow">
                <div class="bp3-navbar-group bp3-align-left">
                    <div class="bp3-navbar-heading"><img src={GaijinLogo} className="logo" /></div>
                </div>
                <div class="bp3-navbar-group bp3-align-right">
                    { this.state.isLoggedIn && 
                        <>
                            <Button className={Classes.MINIMAL} onClick={() => this.setState({ isDeliveryDialogOpen: true })} rightIcon="truck" text="Delivery" />
                            <Dialog isOpen={this.state.isDeliveryDialogOpen} onClose={() => this.setState({ isDeliveryDialogOpen: false })}><Delivery /></Dialog>
                            <Notifications />
                            <Button className={Classes.MINIMAL} icon="envelope" />
                            <Popover content={accountMenu} position={Position.BOTTOM}>
                                <Button className={Classes.MINIMAL} icon={<img src={localStorage.getItem("avatar_url")} className="avatar avatar-navbar" />} />
                            </Popover>
                        </>
                    }
                    { !this.state.isLoggedIn && 
                        <>
                            <Button className={Classes.MINIMAL} rightIcon="truck" text="Delivery" onClick={() => this.setState({ isSignInDialogOpen: true })} />
                            <Button className={Classes.MINIMAL} icon="notifications" onClick={() => this.setState({ isSignInDialogOpen: true })}  /> 
                            <Button className={Classes.MINIMAL} text="Sign In" onClick={() => this.setState({ isSignInDialogOpen: true })} />
                            <Dialog isOpen={this.state.isSignInDialogOpen} onClose={() => this.setState({ isSignInDialogOpen: false })}><SignIn /></Dialog>
                            <AnchorButton className={Classes.MINIMAL} text="Sign Up" href="/sign-up" />
                        </> 
                    }
                </div>
            </nav>
        )
    }

}

export default HalfNavbar;