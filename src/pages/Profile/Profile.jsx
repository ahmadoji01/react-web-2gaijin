import React, { Component } from "react";
import NavigationBar from "../../components/NavigationBar";
import AvatarPlaceHolder from "../../illustrations/avatar-placeholder.png";
import "./Profile.scss";
import GoldCoin from "../../illustrations/GoldCoin.svg";
import SilverCoin from "../../illustrations/SilverCoin.svg";
import ProductCard from "../../components/ProductCard";
import {
    Tabs, Tab
} from "@blueprintjs/core";
import shortid from "shortid";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: [],
            items: [],
            isError: false,
            cardWidth: (window.innerWidth/6) - 50, 
            cardHeight: (window.innerHeight/5) - 50,
        }
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
        this.setState({ cardWidth: (window.innerWidth/6) - 50 });
        this.setState({ cardHeight: (window.innerHeight/5) - 50 });
        this.setState({ viewportWidth: window.innerHeight });
    }

    componentWillMount() {
        var userid = this.props.match.params.userid;
        fetch('https://go.2gaijin.com/profile_visitor?user_id=' + userid)
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
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
                            <img src={GoldCoin} className="coin" /><p className="coin-text">{goldCoins} Gold(s)</p> 
                            <img src={SilverCoin} className="coin" /><p className="coin-text">{silverCoins} Silver(s)</p>
                        </div>
                        <div className="row short-bio">
                            <p>{shortBio}</p>
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
                    </Tabs>
                </div>
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

export default Profile;