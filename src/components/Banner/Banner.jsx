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
                <img className="banner-img" src="https://marketplace.canva.com/EAD7RZBpky0/1/0/400w/canva-blue-and-white-gaming-logo-N-0-xW64Gwc.jpg" />
            </div>
        );
    }

}

export default Banner;