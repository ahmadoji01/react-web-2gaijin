import React, { Component } from 'react';
import "./ProductCard.scss";
import SoldOutIcon from "../../icons/SoldOutIcon.svg";
import PinIcon from "../../icons/PinIcon.svg";
import shortid from 'shortid';

class ProductCard extends Component {
    
    constructor(props) {
        super(props);
        this.state = { cardWidth: (window.innerWidth/2) - 25, cardHeight: (window.innerHeight/2) - 25, locText: "", imgVis: false, getElement: null };
        this.calcDistance = this.calcDistance.bind(this);
    }

    calcDistance() {
        if(typeof(this.props.item) !== 'undefined') {
            var item = this.props.item;
            var lat1 = parseFloat(item.location.latitude);
            var lng1 = parseFloat(item.location.longitude);
            var lat2 = parseFloat(this.props.lat);
            var lng2 = parseFloat(this.props.lng);
            
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
            
            this.setState({ locText: d.toFixed(1) + " km away" });
        }
    }

    componentDidMount() {
        this.calcDistance();
        this.setState(() => {
          return {
            getElement: document.getElementsByClassName("page-content-with-infinite-scroll")[0]
          };
        });
    }

    redirectToProductDetail(productID) {
        this.$f7.view.main.router.navigate("/product/" + productID);
    }

    render() {
        var containmentDOMRect = this.state.getElement
        ? this.state.getElement : null;
        if(typeof(this.props.item) !== 'undefined') {
            const item = this.props.item;
            let locColumn;
            if(this.state.locText != "") {
                locColumn = <p className="location" style={{ display: "inline" }}><img src={PinIcon} style={{ width: 20, height: 20, float: "left" }} />{this.state.locText}</p>
            }

            let cardWidth = this.props.cardWidth;
            let soldOut;
            if(item.availability != "available") {
                soldOut = <div className="love-button card-sold">
                    <img src={SoldOutIcon} style={{ maxWidth: cardWidth/2 }} />
                </div>;
            }

            return(
                <a href={`/product/${item["_id"]}`} className="product-card" style={{ width: `${cardWidth}px`, textDecoration: "none", color: "black" }} >
                    <div className="content content-shadow-product">
                        {soldOut}
                        <div 
                        className="image-container" 
                        style={{backgroundImage: `url(${item["img_url"]})`, 
                        }} />
                        <div className="card-text">
                            <p className="title-product">{item.name}</p>
                            <p className="location">by {item.seller_name}</p>
                            <p className="price">¥{item.price}</p>
                            {locColumn}
                        </div>
                    </div>
                </a>
            );
        } else {
            return '';
        }
    }
}
    
export default ProductCard;