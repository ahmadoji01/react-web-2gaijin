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

import Badge from '@material-ui/core/Badge';
import MessageIcon from "../../icons/MessageIcon.svg";

import axios from "axios";
import AvatarPlaceholder from "../../illustrations/avatar-placeholder.png";

class HalfNavbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            isSignInDialogOpen: false,
            isDeliveryDialogOpen: false,
            notifRead: true,
            messageRead: true
        };
        this.onSignOutButtonClick = this.onSignOutButtonClick.bind(this);
    }

    componentWillMount() {
        if(AuthService.getCurrentUser()) {
            this.setState({ isLoggedIn: true });
            
            let config = {
                headers: {'Authorization': localStorage.getItem("access_token") },
            };

            axios
            .get(`https://go.2gaijin.com/check_notif_read`, config)
            .then(res => {
                if(res.data){
                    this.setState({ notifRead: res.data.data.notif_read });
                    this.setState({ messageRead: res.data.data.message_read });
                }
            });  
        }
    }

    componentDidMount() {
        var url = window.location.href;
        var lastPart = url.split("/").pop();
        if(lastPart === "order_delivery") {
            if(AuthService.getCurrentUser()) {
                this.setState({ isDeliveryDialogOpen: true });
            } else {
                this.setState({ isSignInDialogOpen: true });
            }
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

        let avatarURL;
        if(localStorage.getItem("avatar_url")) {
            avatarURL = localStorage.getItem("avatar_url");
        } else {
            avatarURL = AvatarPlaceholder;
        }

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
                            <Notifications isNotifRead={this.state.notifRead} />
                            <Button className={Classes.MINIMAL} onClick={() => window.location="/m"} ><Badge color="secondary" variant="dot" invisible={this.state.messageRead}><img src={MessageIcon} style={{ maxWidth: 24 }}/></Badge></Button>
                            <Popover content={accountMenu} position={Position.BOTTOM}>
                                <Button className={Classes.MINIMAL} icon={<img src={avatarURL} className="avatar avatar-navbar" />} />
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