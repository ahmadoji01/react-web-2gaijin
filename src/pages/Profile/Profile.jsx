import React, { Component } from "react";
import NavigationBar from "../../components/NavigationBar";
import AvatarPlaceHolder from "../../illustrations/avatar-placeholder.png";
import "./Profile.scss";
import GoldCoin from "../../illustrations/GoldCoin.svg";
import SilverCoin from "../../illustrations/SilverCoin.svg";
import ProductCard from "../../components/ProductCard";
import {
    Button, Card, H3, Classes, Tabs, Tab, Dialog, FormGroup, Spinner, H5
} from "@blueprintjs/core";
import shortid from "shortid";
import axios from "axios";
import EditProfile from "../../dialogs/EditProfile/EditProfile";
import AuthService from "../../services/auth.service";
import Footer from "../../components/Footer";
import AppointmentContainer from "../../components/AppointmentContainer";
import Moment from 'react-moment';
import { geolocated } from 'react-geolocated';
import EmptyIllustration from "../../illustrations/EmptyIllustration.png";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: [],
            items: [],
            isError: false,
            isEditProfileDialogOpen: false,
            allowEditProfile: false,
            editProfile: [],
            isEmailConfirmed: false,
            isPhoneConfirmed: false,
            subscription: "",
            subsUntilDate: new Date(),
            emailLoading: false,
            emailConfirmSuccess: false,
            emailConfirmFail: false,
            phoneLoading: false,
            phoneConfirmSuccess: false,
            phoneConfirmFail: false,
            cardWidth: (window.innerWidth/6) - 50, 
            cardHeight: (window.innerHeight/5) - 50,
            pendingSeller: [],
            finishedSeller: [],
            acceptedSeller: [],
            pendingBuyer: [],
            finishedBuyer: [],
            acceptedBuyer: [],
            currLat: 0.0, currLng: 0.0,
            defaultActiveTab: "collections"
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.loadAppointments = this.loadAppointments.bind(this);
        this.sendEmailConfirmation = this.sendEmailConfirmation.bind(this);
        this.sendPhoneConfirmation = this.sendPhoneConfirmation.bind(this);
        this.findCoordinates = this.findCoordinates.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    findCoordinates = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const location = JSON.stringify(position);
            this.setState({ currLat: position.coords.latitude, currLng: position.coords.longitude });
        });
    }

    componentDidMount() {
        this.updateWindowDimensions();
        var url = window.location.href;
        if(url.indexOf('?' + "appointment" + '=') != -1 || url.indexOf('&' + "appointment" + '=') != -1) {
            this.setState({ defaultActiveTab: "appointments" });
        }
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ cardWidth: (window.innerWidth/6) - 50 });
        this.setState({ cardHeight: (window.innerHeight/5) - 50 });
        this.setState({ viewportWidth: window.innerHeight });
    }

    componentWillMount() {
        this.findCoordinates();
        var userid = this.props.match.params.userid;
        fetch('https://go.2gaijin.com/profile_visitor?user_id=' + userid)
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status == "Error") {
                this.setState({ isError: true });
                return;
            } else {
                const jsonData = responseJson.data;
                this.setState({ profile: jsonData.user_info });
                this.setState({ items: jsonData.collections });
            }
        })
        .catch((error) => {
            console.error(error);
        });

        AuthService.refreshToken();
        if(!localStorage.getItem("access_token")) { return; }
        let self = this;
        return axios.post(`https://go.2gaijin.com/get_profile_info`, {}, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": localStorage.getItem("access_token")
            }
        }).then(response => {
            if(response.data.status === "Success") {
                if(response.data.data.profile._id === userid) {
                    self.setState({ allowEditProfile: true });
                    self.setState({ editProfile: response.data.data.profile });
                    self.setState({ isEmailConfirmed: response.data.data.profile.email_confirmed });
                    self.setState({ isPhoneConfirmed: response.data.data.profile.phone_confirmed });
                    self.setState({ subsUntilDate: new Date(response.data.data.profile.subs_expiry_date) });
                    self.loadAppointments();
                }
            }
        });
    }

    sendEmailConfirmation() {
        var payload = {
            "email": localStorage.getItem("email"),
            "confirm_source": "desktop_web_app"
        }
        
        this.setState({ emailLoading: true });
        this.setState({ confirmEmailStatus: "" });
        return axios.post(`https://go.2gaijin.com/confirm_identity`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if(response.data["status"] == "Success") {
                this.setState({ emailLoading: false });
                this.setState({ emailConfirmSuccess: true });
            } else {
                this.setState({ emailLoading: false });
                this.setState({ emailConfirmFail: true });
            }
        });
    }

    sendPhoneConfirmation() {
        var payload = {
            "phone": localStorage.getItem("phone"),
        }

        if(!this.state.phoneNumber) { this.setState({ phoneConfirmFail: true }); return; }
        
        this.setState({ phoneLoading: true });
        return axios.post(`https://go.2gaijin.com/generate_phone_confirm_code`, payload, {
            headers: {
                "Authorization": localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            }
        }).then(response => {
            if(response.data["status"] == "Success") {
                this.setState({ phoneLoading: false });
                this.setState({ phoneConfirmSuccess: true });
            } else {
                this.setState({ phoneLoading: false });
                this.setState({ phoneConfirmFail: true });
            }
        });
    }

    loadAppointments() {
        let config = {
            headers: {'Authorization': localStorage.getItem("access_token") }
        } 
        
        axios
        .get(`https://go.2gaijin.com/get_seller_appointments`, config)
        .then(response => {
            if(response.data.data) {
                var appointmentData = response.data.data.appointments;
                var pending = appointmentData.filter(appointment => appointment.status === "pending");
                var finished = appointmentData.filter(appointment => appointment.status === "finished");
                var accepted = appointmentData.filter(appointment => appointment.status === "accepted");
                this.setState({ pendingSeller: pending });
                this.setState({ finishedSeller: finished });
                this.setState({ acceptedSeller: accepted });
                this.setState({ isLoading1: false });
            }
        });
        
        axios
        .get(`https://go.2gaijin.com/get_buyer_appointments`, config)
        .then(response => {
            if(response.data.data) {
                var appointmentData = response.data.data.appointments;
                var pending = appointmentData.filter(appointment => appointment.status === "pending");
                var finished = appointmentData.filter(appointment => appointment.status === "finished");
                var accepted = appointmentData.filter(appointment => appointment.status === "accepted");
                this.setState({ pendingBuyer: pending });
                this.setState({ finishedBuyer: finished });
                this.setState({ acceptedBuyer: accepted });
                this.setState({ isLoading2: false });
            }
        });
    }

    handleTabChange(newTabId) {
        this.setState({ defaultActiveTab: newTabId });
    }

    render() {
        
        const calendarStrings = {
            lastDay : '[Yesterday at ] LT',
            sameDay : '[Today at ] LT',
            nextDay : '[Tomorrow at ] LT',
            lastWeek : '[last] dddd [at] LT',
            nextWeek : 'dddd [at] LT',
            sameElse : 'dddd, L [at] LT'
        };

        if(this.state.profile.length == 0) {
            return "";
        }

        let avatarURL = this.state.profile.avatar_url;
        if(avatarURL == "") {
            avatarURL = AvatarPlaceHolder;
        }

        let fullName = this.state.profile.first_name + " " + this.state.profile.last_name;
        let goldCoins = this.state.profile.gold_coin;
        let silverCoins = this.state.profile.silver_coin;
        let shortBio = this.state.profile.short_bio;

        let emailSpinner;
        if(this.state.emailLoading) {
            emailSpinner = <Spinner intent="warning" size={24} style={{ marginBottom: 10 }} />;
        }

        let phoneSpinner;
        if(this.state.phoneLoading) {
            phoneSpinner = <Spinner intent="warning" size={24} style={{ marginBottom: 10 }} />;
        }

        let currLat = this.state.currLat, currLng = this.state.currLng;

        return(
            <>
                <NavigationBar />
                <div className="row product-detail-container custom-container" style={{ marginTop: 80 }}>
                    <div className="col-4">
                        <img src={avatarURL} className="avatar" style={{ width: 200 }} />
                    </div>
                    <div className="col-8 profile-info">
                        <h3>{fullName}</h3>
                        <div className="row coin-info">
                            <img src={GoldCoin} className="coin" /><p className="coin-info-text">{goldCoins} Gold(s)</p> 
                            <img src={SilverCoin} className="coin" /><p className="coin-info-text">{silverCoins} Silver(s)</p>
                        </div>
                        <div className="row short-bio">
                            <p>{shortBio}</p>
                        </div>
                        <div className="row short-bio">
                            { this.state.allowEditProfile &&
                                <>
                                    <Dialog isOpen={this.state.isEditProfileDialogOpen} onClose={() => this.setState({ isEditProfileDialogOpen: false })}><EditProfile editProfile={this.state.editProfile} /></Dialog> 
                                    <div className="col-12" style={{ paddingLeft: 0 }}>
                                        <Button style={{ width: "50%" }} onClick={() => this.setState({ isEditProfileDialogOpen: true })}>Edit Profile</Button>
                                    </div>

                                    <div className="row" style={{ paddingLeft: 0, marginTop: 20, width: "100%" }}>
                                        {!this.state.isEmailConfirmed && <div className="col-3">
                                            {emailSpinner}<Button style={{ width: "100%" }} disabled={this.state.emailLoading} onClick={this.sendEmailConfirmation}>Confirm My Email</Button>
                                            <Dialog isOpen={this.state.emailConfirmSuccess} onClose={() => this.setState({ emailConfirmSuccess: false })}><div className={Classes.DIALOG_BODY}><H5>A confirmation link is sent to your email! Check your email to confirm your identity</H5></div></Dialog>
                                            <Dialog isOpen={this.state.emailConfirmFail} onClose={() => this.setState({ emailConfirmFail: false })}><div className={Classes.DIALOG_BODY}><H5>Whoops. Something went wrong. Try again</H5></div></Dialog>
                                        </div>}
                                        
                                    </div>
                                    <div className="row" style={{ paddingLeft: 0, marginTop: 20, width: "100%" }}>
                                        {(new Date() <= this.state.subsUntilDate) && <div className="col-6">
                                            <p>Subscribed until <Moment calendar={calendarStrings}>{this.state.subsUntilDate}</Moment></p>
                                        </div>}
                                    </div>
                                </> }
                        </div>
                    </div>
                </div>
                <div className="row product-detail-container custom-container" style={{ marginTop: 50, paddingLeft: this.state.cardWidth, paddingRight: this.state.cardWidth }}>
                    <Tabs
                    animate={true}
                    onChange={this.handleTabChange}
                    id="TabsExample"
                    key={"horizontal"}
                    renderActiveTabPanelOnly={true}
                    selectedTabId={this.state.defaultActiveTab}
                    vertical={false}
                    style={{ borderBottom: "1px solid blue" }}
                    >
                        <Tab id="collections" title="Collections" panel={<CollectionPanel items={this.state.items} cardWidth={this.state.cardWidth} lat={currLat} lng={currLng} cardHeight={this.state.cardHeight} /> } />
                        { this.state.allowEditProfile && <Tab id="appointments" title="Transactions" panel={<AppointmentPanel pendingSeller={this.state.pendingSeller} finishedSeller={this.state.finishedSeller} acceptedSeller={this.state.acceptedSeller} pendingBuyer={this.state.pendingBuyer} finishedBuyer={this.state.finishedBuyer} acceptedBuyer={this.state.acceptedBuyer} /> } />}
                    </Tabs>
                </div>
                <Footer />
            </>
        );
    }
}

const CollectionPanel = (props) => (
    <div className="row" style={{ margin: 0 }}>
        {props.items.length === 0 && <Card style={{ width: "97.5%", marginBottom: 20 }}><img src={EmptyIllustration} /><H3 style={{ marginTop: 10 }}>No items posted yet</H3></Card> }
        {
        props.items.map(function (item, i) {
            return (
                <div className="col-2dot4">
                    <ProductCard key={shortid.generate()} item={item} lat={props.lat} lng={props.lng} cardWidth={props.cardWidth} cardHeight={props.cardHeight} />
                </div>
            );
        })}
    </div>
);

const AppointmentPanel = (props) => (
    <div className="row" style={{ width: "100%" }}>
        <div className="col-6" style={{ textAlign: "left", align: "left" }}>
            <h5>Transaction as Seller</h5>
            { (props.acceptedSeller.length == 0 && props.pendingSeller.length == 0 && props.finishedSeller.length == 0) && <h6>You have no active transaction as seller</h6> }
            { props.acceptedSeller.length > 0 && <h6>Accepted Transaction</h6> }
            <AppointmentContainer type="seller" items={props.acceptedSeller} />
            { props.pendingSeller.length > 0 && <h6>Pending Approval</h6> }
            <AppointmentContainer type="seller" items={props.pendingSeller} />
            { props.finishedSeller.length > 0 && <h6>Finished Transaction</h6> }
            <AppointmentContainer type="seller" items={props.finishedSeller} />
        </div>
        <div className="col-6"  style={{ textAlign: "left", align: "left" }}>
            <h5>Transaction as Buyer</h5>
            { (props.acceptedBuyer.length == 0 && props.pendingBuyer.length == 0 && props.finishedBuyer.length == 0) && <h6>You have no active transaction as buyer</h6> }
            { props.acceptedBuyer.length > 0 && <h6>Accepted Transaction</h6> }
            <AppointmentContainer type="buyer" items={props.acceptedBuyer} />
            { props.pendingBuyer.length > 0 && <h6>Pending Approval</h6> }
            <AppointmentContainer type="buyer" items={props.pendingBuyer} />
            { props.finishedBuyer.length > 0 && <h6>Finished Transaction</h6> }
            <AppointmentContainer type="buyer" items={props.finishedBuyer} />
        </div>
    </div>
);

export default geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  })(Profile);