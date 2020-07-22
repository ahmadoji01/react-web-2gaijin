import React, { Component } from "react";
import {
    Alignment,
    Button,
    Classes,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Menu, MenuDivider, MenuItem, Popover, Position, Dialog
} from "@blueprintjs/core";
import AvatarPlaceHolder from "../../illustrations/avatar-placeholder.png";
import "./Toolbar.scss";
import AuthService from "../../services/auth.service";
import MakeAppointment from "../../dialogs/MakeAppointment/MakeAppointment";
import MakeAppointmentWithDelivery from "../../dialogs/MakeAppointment/MakeAppointmentWithDelivery";
import SignIn from "../../dialogs/SignIn";

class Toolbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toolbarWidth: window.innerWidth - 300,
            isLoggedIn: false,
            isAppointmentDialogOpen: false,
            isAppWithDeliveryDialogOpen: false,
            isSignInDialogOpen: false,
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

    componentWillMount() {
        if(AuthService.getCurrentUser()) {
            this.setState({isLoggedIn: true});
        }
    }

    updateWindowDimensions() {
        this.setState({ toolbarWidth: window.innerWidth - 300 });
    }

    render() {
        if(typeof(this.props.price) === "undefined") {
            return "";
        }

        let appointmentDialog, appWithDeliveryDialog;
        if(this.state.isLoggedIn) {
            appointmentDialog = <Dialog title={"Pick a time to meet with this item's seller"} isOpen={this.state.isAppointmentDialogOpen} onClose={() => {this.setState({ isAppWithDeliveryDialogOpen: false, isAppointmentDialogOpen: false })}}><MakeAppointment productID={this.props.productID} /></Dialog>;
            appWithDeliveryDialog = <Dialog title={"Pick a time when you would like this item to be delivered"} isOpen={this.state.isAppWithDeliveryDialogOpen} onClose={() => {this.setState({ isAppWithDeliveryDialogOpen: false, isAppointmentDialogOpen: false })}}><MakeAppointmentWithDelivery productID={this.props.productID} /></Dialog>;
        }

        var price = this.props.price;
        var avatarURL = this.props.sellerInfo.avatar_url;
        var sellerName = this.props.sellerInfo.first_name + " " + this.props.sellerInfo.last_name;
        
        if(avatarURL == "") {
            avatarURL = AvatarPlaceHolder;
        }

        const requestMenu = (
            <Menu>
                <MenuItem onClick={ () => this.setState({ isAppointmentDialogOpen: true }) } text="Make Appointment with Seller" />
                <MenuItem onClick={ () => this.setState({ isAppWithDeliveryDialogOpen: true }) } text="Deliver this Item to Me" />
            </Menu>
        );

        let actionBtn;
        if(this.state.isLoggedIn) {
            if(localStorage.getItem("user_id") === this.props.sellerInfo._id) {
                actionBtn = <Button className="general-btn" text="Mark as Sold" />;
            } else {
                actionBtn = <Popover content={requestMenu} position={Position.TOP} style={{ zIndex: 12039181 }}>
                    <Button className="request-buy-btn" text="Request to Buy" />
                </Popover>;
            }
        } else {
            actionBtn = <><Dialog isOpen={this.state.isSignInDialogOpen} onClose={() => this.setState({ isSignInDialogOpen: false })}><SignIn /></Dialog>
            <Button className="request-buy-btn" text="Request to Buy" onClick={() => this.setState({ isSignInDialogOpen: true })} /></>;
        }

        return (
            <Navbar className="toolbar">
                <div style={{ margin: "0 auto", width: this.state.toolbarWidth }}>
                    <NavbarGroup align={Alignment.LEFT} className="toolbar-group">
                        <NavbarHeading><a href={`/profile/${this.props.sellerInfo._id}`}><img src={avatarURL} className="avatar" style={{ width: 50 }} /></a></NavbarHeading>
                        <NavbarHeading className="toolbar-text">{sellerName}</NavbarHeading>
                    </NavbarGroup>
                    <NavbarGroup align={Alignment.RIGHT} className="toolbar-group">
                        <NavbarHeading className="toolbar-text">¥{price}</NavbarHeading>
                        <Navbar.Divider />
                        {actionBtn}
                    </NavbarGroup>
                </div>
                {appointmentDialog}
                {appWithDeliveryDialog}
            </Navbar>
        )
    }

}

export default Toolbar;