import React, { Component } from "react";
import {
    Alignment,
    AnchorButton,
    Button,
    Classes,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Menu, MenuDivider, MenuItem, Popover, Position, Dialog
} from "@blueprintjs/core";
import GaijinLogo from "../../illustrations/gaijinlogo.svg";
import "./NavigationBar.scss";
import AuthService from "../../services/auth.service";
import SignIn from "../../dialogs/SignIn";
import { INTENT_WARNING } from "@blueprintjs/core/lib/esm/common/classes";

import { ReactComponent as ApparelsIcon} from "../../icons/ApparelsIcon.svg";
import { ReactComponent as BooksIcon} from "../../icons/BooksIcon.svg";
import { ReactComponent as ElectronicsIcon} from "../../icons/ElectronicsIcon.svg";
import { ReactComponent as FootwearIcon} from "../../icons/FootwearIcon.svg";
import { ReactComponent as FurnituresIcon} from "../../icons/FurnituresIcon.svg";
import { ReactComponent as KitchensIcon} from "../../icons/KitchensIcon.svg";
import { ReactComponent as MiscellaneousIcon} from "../../icons/MiscellaneousIcon.svg";
import { ReactComponent as SportsIcon} from "../../icons/SportsIcon.svg";
import { ReactComponent as VehiclesIcon} from "../../icons/VehiclesIcon.svg";
import { ReactComponent as WhiteAppliancesIcon} from "../../icons/WhiteAppliancesIcon.svg";

import Notifications from "../../dialogs/Notifications";

class NavigationBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchBarWidth: (window.innerWidth/2),
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            searchTerm: "",
            isLoggedIn: false,
            isSignInDialogOpen: false,
            isNotificationOpen: false,
        }; 
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.searchTermChange = this.searchTermChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.onSignOutButtonClick = this.onSignOutButtonClick.bind(this);
    }

    componentDidMount() {
        if(typeof(this.props.term) !== "undefined") {
            this.setState({ searchTerm: this.props.term });
        }

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillMount() {
        if(AuthService.getCurrentUser()) {
            this.setState({ isLoggedIn: true });
        }
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ searchBarWidth: (window.innerWidth/2) });
        this.setState({ viewportWidth: (window.innerWidth) });
        this.setState({ viewportHeight: (window.innerHeight) });
    }

    searchTermChange(e) {
        this.setState({ searchTerm: e.target.value });
    }

    searchSubmit(e) {
        e.preventDefault();
        window.location = "/search?q=" + this.state.searchTerm;
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
        const exampleMenu = (
            <Menu>
                <MenuItem href="/search?category=Apparels" icon={<ApparelsIcon />} text="Apparels" />
                <MenuItem href="/search?category=Books" icon={<BooksIcon />} text="Books" />
                <MenuItem href="/search?category=Electronics" icon={<ElectronicsIcon />} text="Electronics" />
                <MenuItem href="/search?category=Footwear" icon={<FootwearIcon />} text="Footwear" />
                <MenuItem href="/search?category=Furnitures" icon={<FurnituresIcon />} text="Furnitures" />
                <MenuItem href="/search?category=Kitchens" icon={<KitchensIcon />} text="Kitchens" />
                <MenuItem href="/search?category=Sports" icon={<SportsIcon />} text="Sports" />
                <MenuItem href="/search?category=Vehicles" icon={<VehiclesIcon />} text="Vehicles" />
                <MenuItem href="/search?category=White Appliances" icon={<WhiteAppliancesIcon />} text="White Appliances" />
                <MenuItem href="/search?category=Miscellaneous" icon={<MiscellaneousIcon />} text="Miscellaneous" />
            </Menu>
        )

        const accountMenu = (
            <Menu>
                <MenuItem text="My Profile" onClick={() => this.onMyProfileClick(localStorage.getItem("user_id"))} intent={INTENT_WARNING}  />
                <MenuItem text="Sign Out" onClick={this.onSignOutButtonClick} intent={INTENT_WARNING}  />
            </Menu>
        )

        let searchBarWidth;
        if(this.state.viewportHeight > this.state.viewportWidth) {
            searchBarWidth = this.state.searchBarWidth/2 + 80;
        } else {
            searchBarWidth = this.state.searchBarWidth
        }

        return (
            <nav class="bp3-navbar full-navbar">
                <div class="bp3-navbar-group bp3-align-left">
                    <div class="bp3-navbar-heading"><a href="/"><img src={GaijinLogo} className="logo" /></a></div>
                    <span class="bp3-navbar-divider"></span>
                    <Popover content={exampleMenu} position={Position.BOTTOM} style={{ zIndex: 12039181 }}>
                        <Button className={Classes.MINIMAL} text="Categories" />
                    </Popover>
                    <span class="bp3-navbar-divider"></span>
                    <div className="bp3-input-group .bp3-large" style={{ width: searchBarWidth }}>
                        <span className="bp3-icon bp3-icon-search" style={{ fontSize: 18, paddingTop: 5, paddingLeft: 10, color: "#9BACCE" }}></span>
                        <form onSubmit={this.searchSubmit}><input value={this.state.searchTerm} onChange={this.searchTermChange} className="bp3-input" type="search" style={{ height: 40, paddingLeft: 50 }} placeholder="Try Fridge, Table" dir="auto" /></form>
                        <Button className="nav-search-btn" intent="warning" onClick={this.searchSubmit}>Search</Button>
                    </div>
                </div>
                <div class="bp3-navbar-group bp3-align-right">
                    <Button className={Classes.MINIMAL} rightIcon="truck" text="Delivery" />
                    <Notifications />
                    <Button className={Classes.MINIMAL} icon="envelope" />
                    { this.state.isLoggedIn && 
                    <Popover content={accountMenu} position={Position.BOTTOM}>
                        <Button className={Classes.MINIMAL} icon={<img src={localStorage.getItem("avatar_url")} className="avatar avatar-navbar" />} />
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

export default NavigationBar;