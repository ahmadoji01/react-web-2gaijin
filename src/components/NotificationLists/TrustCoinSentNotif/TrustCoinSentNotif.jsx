import React, { Component } from "react";
import Moment from 'moment';
import "./TrustCoinSentNotif.scss";
import AvatarPlaceholder from "../../../illustrations/avatar-placeholder.png";
import GoldCoin from "../../../illustrations/GoldCoin.svg";
import SilverCoin from "../../../illustrations/SilverCoin.svg";

class TrustCoinSentNotif extends Component {

    render() {
        if(typeof(this.props.item) !== "undefined") {
            var notifItem = this.props.item;
            var avatarURL = "image"

            avatarURL = notifItem.notification_user.avatar_url;
            if(avatarURL == "") {
                avatarURL = AvatarPlaceholder;
            }

            let coinText, coinImg;
            if(notifItem.status == "gold") {
                coinText = <b>Gold Coin</b>;
                coinImg = <img src={GoldCoin} />;
            } else if(notifItem.status == "silver") {
                coinText = <b>Silver Coin</b>;
                coinImg = <img src={SilverCoin} />;
            }

            return (
                <React.Fragment>
                    <div className="content">
                        <div className="row notif-row notif-row-header">
                            <div className="col-3">
                                <img src={avatarURL} className="avatar avatar-notif" />
                            </div>
                            <div className="col-9">
                                <div className="text">
                                    <h7><b>{notifItem.notification_user.first_name}</b> sent you {coinImg} {coinText}. Fancy!</h7>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="divider-space-content"></div>
                </React.Fragment>
            );
        } else {
            return '';
        }
    }

}

export default TrustCoinSentNotif;