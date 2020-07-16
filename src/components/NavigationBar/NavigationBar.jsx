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
                <MenuItem icon="graph" text="Apparels" />
                <MenuItem icon="map" text="Books" />
                <MenuItem icon="map" text="Electronics" />
                <MenuItem icon="map" text="Footwear" />
                <MenuItem icon="map" text="Furnitures" />
                <MenuItem icon="map" text="Kitchens" />
                <MenuItem icon="map" text="Sports" />
                <MenuItem icon="map" text="Vehicles" />
                <MenuItem icon="map" text="White Appliances" />
                <MenuItem icon="map" text="Miscellaneous" />
                <MenuItem icon="th" text="Table" shouldDismissPopover={false} />
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
            <Navbar className="full-navbar">
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading><a href="/"><img src={GaijinLogo} className="logo" /></a></NavbarHeading>
                    <NavbarDivider />
                    <Popover content={exampleMenu} position={Position.BOTTOM}>
                        <Button className={Classes.MINIMAL} text="Categories" />
                    </Popover>
                    <NavbarDivider />
                    <div className="bp3-input-group .bp3-large" style={{ width: searchBarWidth }}>
                        <span className="bp3-icon bp3-icon-search" style={{ fontSize: 18, paddingTop: 5, paddingLeft: 10, color: "#9BACCE" }}></span>
                        <form onSubmit={this.searchSubmit}><input value={this.state.searchTerm} onChange={this.searchTermChange} className="bp3-input" type="search" style={{ height: 40, paddingLeft: 50 }} placeholder="Try Fridge, Table" dir="auto" /></form>
                        <Button className="nav-search-btn" intent="warning" onClick={this.searchSubmit}>Search</Button>
                    </div>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Button className={Classes.MINIMAL} rightIcon="truck" text="Delivery" />
                    <Button className={Classes.MINIMAL} icon="notifications" />
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
                </NavbarGroup>
            </Navbar>
        )
    }
}

export default NavigationBar;