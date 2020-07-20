import React, { Component } from 'react';
import './ProductCardHorizontal.scss';
import { geolocated } from 'react-geolocated';
import CalendarIcon from "../../icons/CalendarIcon.svg";
import Moment from 'react-moment';

class ProductCardHorizontal extends Component {
    
    constructor(props) {
        super(props);
        this.state = { cardWidth: (window.innerWidth/2) - 25, cardHeight: (window.innerHeight/2) - 25, locText: "", currLat: 0.0, currLng: 0.0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.findCoordinates = this.findCoordinates.bind(this);
        this.calcDistance = this.calcDistance.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        //this.findCoordinates();
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
        this.setState({ cardWidth: (window.innerWidth/2) - 25 });
        this.setState({ cardHeight: (window.innerHeight/2) - 25 });
    }

    findCoordinates = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const location = JSON.stringify(position);
            this.setState({ currLat: position.coords.latitude, currLng: position.coords.longitude }, () => {
                this.calcDistance();
            });
        });
    }

    calcDistance() {
        if(typeof(this.props.item) !== 'undefined') {
            var item = this.props.item;
            var lat1 = parseFloat(item.location.latitude);
            var lng1 = parseFloat(item.location.longitude);
            var lat2 = parseFloat(this.state.currLat);
            var lng2 = parseFloat(this.state.currLng);

            if(this.state.locText != "") {
                return;
            }
            
            if (lat1 === 0.0 || lat2 === 0.0) {
                if(this.state.locText != "") {
                    this.setState({ locText: "" });
                }
                return;
            }

            var R = 6371;
            var dLat = (lat2-lat1) * (Math.PI/180);
            var dLon = (lng2-lng1) * (Math.PI/180); 
            var a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
                Math.sin(dLon/2) * Math.sin(dLon/2)
                ; 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c;

            this.setState({ locText: d.toFixed(1) + " km away"});
        }
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
        if(typeof(this.props.item) !== 'undefined') {
            const item = this.props.item;
            const meetingTime = this.props.meeting_time;      

            var meetingTimeInfo;
            if(meetingTime) {
                meetingTimeInfo = <><img src={CalendarIcon} style={{ width: 20, height: 20, float: "left" }} /><b> <Moment calendar={calendarStrings}>{meetingTime}</Moment></b></>;
            }

            return(
                <div className="profile-container content-shadow" style={{ marginLeft: 0, marginRight: 0, width: "100%" }}>
                    <div className="row" style={{paddingBottom: 0}}>
                        <div className="col-3 product-img-container" style={{backgroundImage: `url("${item["img_url"]}")`}}></div>
                        <div className="col-9">
                            <div className="text" style={{padding: 0, fontFamily: "Poppins"}}>
                                <p className="title-product" style={{lineHeight: "1em", height: "2em", marginTop: 10, marginBottom: 0, fontWeight: 600, color: "black"}}>{item.name}</p>
                                <p className="location" style={{marginBottom: 0}}>by {item.seller_name}</p>
                                <p className="price" style={{marginBottom: 0}}>¥{item.price}</p>
                                <p className="appointment-time-text" style={{ display: "inline" }}>{meetingTimeInfo}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return '';
        }  
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  })(ProductCardHorizontal);