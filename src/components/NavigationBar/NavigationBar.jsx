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
import GaijinLogo from "../../illustrations/gaijinlogo.svg";
import "./NavigationBar.scss";

class NavigationBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchBarWidth: (window.innerWidth/2)
        }; 
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ searchBarWidth: (window.innerWidth/2) });
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

        return (
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading><a href="/"><img src={GaijinLogo} className="logo" /></a></NavbarHeading>
                    <NavbarDivider />
                    <Popover content={exampleMenu} position={Position.BOTTOM}>
                        <Button className={Classes.MINIMAL} text="Categories" />
                    </Popover>
                    <NavbarDivider />
                    <div className="bp3-input-group .bp3-large" style={{ width: this.state.searchBarWidth }}>
                        <span className="bp3-icon bp3-icon-search" style={{ fontSize: 18, paddingTop: 5, paddingLeft: 10, color: "#9BACCE" }}></span>
                        <input className="bp3-input" type="search" style={{ height: 40, paddingLeft: 50 }} placeholder="Try Fridge, Table" dir="auto" />
                        <Button className="nav-search-btn" intent="warning">Search</Button>
                    </div>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Button className={Classes.MINIMAL} rightIcon="truck" text="Delivery" />
                    <Button className={Classes.MINIMAL} icon="notifications" />
                    <Button className={Classes.MINIMAL} icon="envelope" />
                    <Button className={Classes.MINIMAL} icon="user" />
                </NavbarGroup>
            </Navbar>
        )
    }
}

export default NavigationBar;