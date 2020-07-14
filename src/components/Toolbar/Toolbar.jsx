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
import AvatarPlaceHolder from "../../illustrations/avatar-placeholder.png";
import "./Toolbar.scss";

class Toolbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toolbarWidth: window.innerWidth - 300
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
        this.setState({ toolbarWidth: window.innerWidth - 300 });
    }

    render() {
        if(typeof(this.props.price) === "undefined") {
            return "";
        }

        var price = this.props.price;
        var avatarURL = this.props.sellerInfo.avatar_url;
        var sellerName = this.props.sellerInfo.first_name + " " + this.props.sellerInfo.last_name;
        
        if(avatarURL == "") {
            avatarURL = AvatarPlaceHolder;
        }

        return (
            <Navbar className="toolbar">
                <div style={{ margin: "0 auto", width: this.state.toolbarWidth }}>
                    <NavbarGroup align={Alignment.LEFT} className="toolbar-group">
                        <NavbarHeading><a href="/"><img src={avatarURL} className="avatar" style={{ width: 50 }} /></a></NavbarHeading>
                        <NavbarHeading className="toolbar-text">{sellerName}</NavbarHeading>
                    </NavbarGroup>
                    <NavbarGroup align={Alignment.RIGHT} className="toolbar-group">
                        <NavbarHeading className="toolbar-text">¥{price}</NavbarHeading>
                        <Navbar.Divider />
                        <Button className="request-buy-btn" text="Request to Buy" />
                    </NavbarGroup>
                </div>
            </Navbar>
        )
    }

}

export default Toolbar;