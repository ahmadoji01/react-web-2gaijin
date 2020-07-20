import React, { Component } from 'react';
import './TrustCoinNotif.scss';
import Moment from 'react-moment';
import ProductCardHorizontal from '../../ProductCardHorizontal';
import { Button, Dialog  } from "@blueprintjs/core";
import axios from 'axios';
import { ReactComponent as CheckButton } from "../../../icons/CheckButtonIcon.svg";
import GoldCoin from "../../../illustrations/GoldCoin.svg";
import SilverCoin from "../../../illustrations/SilverCoin.svg";
import AvatarPlaceholder from "../../../illustrations/avatar-placeholder.png";

class TrustCoinNotif extends Component {

    state = {
        status: this.props.item.status,
        selectedCoin: "",
        isTrustCoinDialogOpen: false,
        isSuccessfulSendDialogOpen: false,
    }

    constructor(props) {
        super(props);
        this.selectCoin = this.selectCoin.bind(this);
    }

    selectCoin(coin) {
        this.setState({ selectedCoin: coin });
        if(coin == "gold") {
            this.goldCoinCard.className = "coin-card active-gold";
            this.silverCoinCard.className = "coin-card";
        } else if(coin == "silver") {
            this.goldCoinCard.className = "coin-card";
            this.silverCoinCard.className = "coin-card active-silver";
        }
    }

    giveTrustCoin(appointmentID, receiverID) {
        var payload = {
            "type": this.state.selectedCoin,
            "appointment_id": appointmentID,
            "receiver_id": receiverID,
        }

        return axios.post(`https://go.2gaijin.com/insert_trust_coin`, payload, {
            headers: {
                "Authorization": localStorage.getItem("access_token")
            }
        }).then(response => {
            if(response.data["status"] == "Success") {
                var jsonData = response.data.data;
                console.log(jsonData);
                this.setState({ status: "finished" });
                this.setState({ isSuccessfulSendDialogOpen: true });
                this.setState({ isTrustCoinDialogOpen: false });
            }
        });
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

        if(typeof(this.props.item) !== "undefined") {
            var notifItem = this.props.item;
            var avatarURL = "image"

            avatarURL = notifItem.notification_user.avatar_url;
            if(avatarURL == "") {
                avatarURL = AvatarPlaceholder;
            }
            
            var sheetClassName = "demo-sheet-swipe-to-close-" + this.props.notifNum;
            let trustCoinButton;
            if(this.state.status == "finished") {
                trustCoinButton = <div className="row notif-row">
                    <Button className="general-disabled-btn" style={{color: "#EF7132", marginTop: 5}} raised fill round>Tip has been sent</Button>
                </div>
            } else if(this.state.status == "pending") {
                trustCoinButton = <div className="row notif-row">
                    <div className="col-6">
                        <Button onClick={ () => this.setState({ isTrustCoinDialogOpen: true }) } className="general-btn" style={{color: "#fff", marginTop: 5}} raised fill round>Send Tip</Button>
                    </div>
                </div>
            }
            
            let goldSelected, silverSelected, checkValid;
            if(this.state.selectedCoin == "gold") {
                goldSelected = <div className="ok-indicator"><CheckButton /></div>;
            } else if(this.state.selectedCoin == "silver") {
                silverSelected = <div className="ok-indicator"><CheckButton /></div>;
            } else {
                checkValid = <p className="coin-valid-text" style={{ marginTop: 10 }}>Choose one of the trust coin</p>
            }

            return (
                <React.Fragment>
                    <div className="content">
                        <div className="row notif-row notif-row-header" style={{marginBottom: 0}}>
                            <div className="col-3">
                                <img src={avatarURL} className="avatar avatar-notif" />
                            </div>
                            <div className="col-9">
                                <div className="text">
                                    <h7><b>{notifItem.notification_user.first_name}</b> has finished transaction with you</h7>
                                </div>
                            </div>
                        </div>
                        {trustCoinButton}
                    </div>
                    <div className="divider-space-content"></div>
                    <Dialog 
                        isOpen={this.state.isSuccessfulSendDialogOpen}
                        onClose={() => this.setState({ isSuccessfulSendDialogOpen: false })}
                        title="Trust Coin Sent!">
                            <p style={{textAlign: "center", padding: 10}}><h4>You have successfully contributed to creating more trusted community!</h4></p>
                    </Dialog>
                    <Dialog 
                        isOpen={this.state.isTrustCoinDialogOpen} 
                        onClose={() => this.setState({ isTrustCoinDialogOpen: false })} 
                        icon="info-sign" 
                        title="Give Seller the Trust Coin">
                            <div>
                                <p style={{textAlign: "center", padding: 10}}><h4>How was the transaction experience with {notifItem.notification_user.first_name}?</h4></p>
                                <div style={{width: "100%"}}>
                                    <div style={{height: 300}}>
                                        <div className="row notif-row">
                                            <div className="col-6">
                                                <div className="coin-card" ref={ goldCoinCard => this.goldCoinCard = goldCoinCard } onClick={() => this.selectCoin("gold")}>
                                                    {goldSelected}
                                                    <img src={GoldCoin} className="coin-image" />
                                                    <p className="coin-text">It was GREAT!</p>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="coin-card" ref={ silverCoinCard => this.silverCoinCard = silverCoinCard } onClick={() => this.selectCoin("silver")}>
                                                    {silverSelected}
                                                    <img src={SilverCoin} className="coin-image" />
                                                    <p className="coin-text">It was OK!</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row notif-row" style={{ padding: "0 20px 0 20px" }}>
                                            {checkValid}
                                            <Button onClick={() => this.giveTrustCoin(notifItem.appointment_id, notifItem.notifier_id)} className="general-btn" style={{color: "#fff", marginTop: 30, width: "100%"}} raised fill round>Send Trust Coin</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </Dialog>
                </React.Fragment>
            );
        } else {
            return '';
        } 
    }

}

export default TrustCoinNotif;