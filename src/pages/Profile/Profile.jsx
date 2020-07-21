import React, { Component } from "react";
import NavigationBar from "../../components/NavigationBar";
import AvatarPlaceHolder from "../../illustrations/avatar-placeholder.png";
import "./Profile.scss";
import GoldCoin from "../../illustrations/GoldCoin.svg";
import SilverCoin from "../../illustrations/SilverCoin.svg";
import ProductCard from "../../components/ProductCard";
import {
    Button, Tabs, Tab, Dialog, FormGroup
} from "@blueprintjs/core";
import shortid from "shortid";
import axios from "axios";
import EditProfile from "../../dialogs/EditProfile/EditProfile";
import AuthService from "../../services/auth.service";
import Footer from "../../components/Footer";
import AppointmentContainer from "../../components/AppointmentContainer";

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
            cardWidth: (window.innerWidth/6) - 50, 
            cardHeight: (window.innerHeight/5) - 50,
            pendingSeller: [],
            finishedSeller: [],
            acceptedSeller: [],
            pendingBuyer: [],
            finishedBuyer: [],
            acceptedBuyer: []
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.loadAppointments = this.loadAppointments.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        
        var userid = this.props.match.params.userid;
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
                }
            }
        });
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
        this.loadAppointments();
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

    render() {
        
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
                                            <Button style={{ width: "100%" }} onClick={() => this.setState({ isEditProfileDialogOpen: true })}>Confirm My Email</Button>
                                        </div>}
                                        {!this.state.isPhoneConfirmed && <div className="col-3">
                                            <Button style={{ width: "100%" }} onClick={() => this.setState({ isEditProfileDialogOpen: true })}>Confirm My Phone</Button>
                                        </div>}
                                    </div>
                                </> }
                        </div>
                    </div>
                </div>
                <div className="row product-detail-container custom-container" style={{ marginTop: 50, paddingLeft: this.state.cardWidth, paddingRight: this.state.cardWidth }}>
                    <Tabs
                    animate={true}
                    id="TabsExample"
                    key={"horizontal"}
                    renderActiveTabPanelOnly={true}
                    vertical={false}
                    style={{ borderBottom: "1px solid blue" }}
                    >
                        <Tab id="collections" title="Collections" panel={<CollectionPanel items={this.state.items} cardWidth={this.state.cardWidth} cardHeight={this.state.cardHeight} /> } />
                        { this.state.allowEditProfile && <Tab id="appointments" title="Appointments" panel={<AppointmentPanel pendingSeller={this.state.pendingSeller} finishedSeller={this.state.finishedSeller} acceptedSeller={this.state.acceptedSeller} pendingBuyer={this.state.pendingBuyer} finishedBuyer={this.state.finishedBuyer} acceptedBuyer={this.state.acceptedBuyer} /> } />}
                    </Tabs>
                </div>
                <Footer />
            </>
        );
    }
}

const CollectionPanel = (props) => (
    <div className="row" style={{ margin: 0 }}>
        { props.items.map(function (item, i) {
            return (
                <div className="col-2dot4">
                    <ProductCard key={shortid.generate()} item={item} cardWidth={props.cardWidth} cardHeight={props.cardHeight} />
                </div>
            );
        })}
    </div>
);

const AppointmentPanel = (props) => (
    <div className="row" style={{ width: "100%" }}>
        <div className="col-6" style={{ textAlign: "left", align: "left" }}>
            <h5>Transaction as Seller</h5>
            <h6>Accepted Transaction</h6>
            { props.acceptedSeller.length == 0 && <p>You have no accepted transactions as seller</p> }
            <AppointmentContainer items={props.acceptedSeller} />
            <h6>Pending Approval</h6>
            { props.pendingSeller.length == 0 && <p>You have no pending transactions as seller</p> }
            <AppointmentContainer items={props.pendingSeller} />
            <h6>Finished Transaction</h6>
            { props.finishedSeller.length == 0 && <p>You have no finished transactions as seller</p> }
            <AppointmentContainer items={props.finishedSeller} />
        </div>
        <div className="col-6"  style={{ textAlign: "left", align: "left" }}>
            <h5>Transaction as Buyer</h5>
            <h6>Accepted Transaction</h6>
            { props.acceptedBuyer.length == 0 && <p>You have no accepted transactions as buyer</p> }
            <AppointmentContainer items={props.acceptedBuyer} />
            <h6>Pending Approval</h6>
            { props.pendingBuyer.length == 0 && <p>You have no pending transactions as buyer</p> }
            <AppointmentContainer items={props.pendingBuyer} />
            <h6>Finished Transaction</h6>
            { props.finishedBuyer.length == 0 && <p>You have no finished transactions as buyer</p> }
            <AppointmentContainer items={props.finishedBuyer} />
        </div>
    </div>
);

export default Profile;