import React, {Component} from "react";
import "./Banner.scss";

class Banner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bannerSize: (window.innerWidth/4) - 50,
        };
    }

    render() {
        if(typeof(this.props.bannerSize) === "undefined") { return ""; }

        return(
            <div className="banner" style={{ width: this.props.bannerSize, height: this.props.bannerSize }}>
                <img className="banner-img" src={this.props.imgURL} />
            </div>
        );
    }

}

export default Banner;