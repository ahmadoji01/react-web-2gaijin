import React, { Component } from "react";
import NavigationBar from "../../components/NavigationBar";
import Toolbar from "../../components/Toolbar";
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/scss/image-gallery.scss";
import parse from 'html-react-parser';
import {
    Classes,
    Dialog,
    Icon
} from "@blueprintjs/core";
import ProductSlider from "../../components/ProductSlider";
import "./ProductDetail.scss";

import BankIcon from "../../icons/bankicon.png";
import CODIcon from "../../icons/codicon.png";
import PaypalIcon from "../../icons/paypalicon.png";
import WeChatIcon from "../../icons/wechaticon.png";
import Footer from "../../components/Footer";

const images = [
    {
      original: 'https://picsum.photos/id/1018/1000/600/',
      thumbnail: 'https://picsum.photos/id/1018/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1015/1000/600/',
      thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
];

class ProductDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            images: [],
            paymentMethod: [],
            windowWidth: 350,
            isLoading: false,
            activeIndex: 0,
        };
        this.populatePhotos = this.populatePhotos.bind(this);
    }

    populatePhotos(images) {
        var photos = new Array();
        images = images.map(function(image, i) { 
            var photo = { original: image["img_url"], thumbnail: image["img_url"] };
            photos.push(photo);
        });
        this.setState({ images: photos });
    }

    componentWillMount() {
        var productid = this.props.match.params.productid;
        fetch('https://go.2gaijin.com/products/' + productid)
        .then((response) => response.json())
        .then((responseJson) => {
            const jsonData = responseJson.data;
            this.populatePhotos(jsonData.item.images);
            this.setState({ data: jsonData});
            this.setState({ paymentMethod: jsonData.payment_method });
        })
        .catch((error) => {
            console.error(error);
        });
    }

    render() {
        if(!this.state.data.item) {
            return "";
        }

        var itemInfo = this.state.data.item;
        var lat = itemInfo.location.latitude; 
        var lng = itemInfo.location.longitude;
        const mapSrc = "https://maps.google.com/maps?q=" + lat + "," + lng + "&t=&z=13&ie=UTF8&iwloc=&output=embed&hl=en";
        
        let brand, condition, modelName, yearsOwned;
        if(this.state.data.details.brand != "") {
            brand = <tr className="detail-row">
                <td className="detail-icon"><Icon icon="tag" iconSize={14} /></td>
                <td className="detail-label">Brand</td>
                <td className="detail-info">{this.state.data.details.brand}</td>
            </tr> 
        }
        if(this.state.data.details.condition != "") {
            condition = <tr className="detail-row">
                <td className="detail-icon"><Icon icon="confirm" iconSize={14} /></td>
                <td className="detail-label">Condition</td>
                <td className="detail-info">{this.state.data.details.condition}</td>
            </tr> 
        }
        if(this.state.data.details.years_owned != "") {
            yearsOwned = <tr className="detail-row">
                <td className="detail-icon"><Icon icon="time" iconSize={14} /></td>
                <td className="detail-label">Years Owned</td>
                <td className="detail-info">{this.state.data.details.years_owned}</td>
            </tr>
        }
        if(this.state.data.details.model_name != "") {
            modelName = <tr className="detail-row">
                <td className="detail-icon"><Icon icon="barcode" iconSize={14} /></td>
                <td className="detail-label">Model Name</td>
                <td className="detail-info">{this.state.data.details.model_name}</td>
            </tr>
        }

        return (
            <>
                <NavigationBar />
                <Toolbar price={this.state.data.item.price} sellerInfo={this.state.data.seller} />
                <div className="row product-detail-container custom-container" style={{ marginTop: 80 }}>
                    <div className="col-6">
                        <ImageGallery showBullets={true} showPlayButton={false} items={this.state.images} />
                    </div>
                    <div className="col-6" style={{ textAlign: "left" }}>
                        <h3>{itemInfo.name}</h3>
                        <table className="product-details" style={{ marginTop: 10 }}>
                            {brand}
                            {condition}
                            {yearsOwned}
                            {modelName}
                        </table>
                        <div className="product-description" style={{ marginTop: 10 }}>
                            <h6>DESCRIPTION</h6>
                            <p className="desc-content">{parse(itemInfo.description)}</p> 
                        </div>
                        <iframe style={{width: "100%", height: 200, borderRadius: 16, marginTop: 10}}
                            frameborder="0" 
                            scrolling="no" 
                            src={mapSrc}
                            >
                        </iframe>
                        <div className="available-payment">
                            <h6>This seller accepts following payment method</h6>
                            <div className="row">
                                { this.state.paymentMethod.paypal && <><div className="col-3 payment-icon-container">
                                    <a href="#" onClick={() => this.setState({ isPaypalDialogOpen: true })}><img className="payment-icon" src={PaypalIcon} /></a>
                                </div>
                                <Dialog isOpen={this.state.isPaypalDialogOpen} onClose={() => this.setState({ isPaypalDialogOpen: false })} icon="info-sign" title="Payment with Paypal"><div className={Classes.DIALOG_BODY}><p><strong>{this.state.paymentMethod.paypal}</strong></p></div></Dialog>
                                </> }
                                { this.state.paymentMethod.wechat && <><div className="col-3 payment-icon-container">
                                    <a href="#" onClick={() => this.setState({ isWeChatDialogOpen: true })}><img className="payment-icon" src={WeChatIcon} /></a>
                                </div>
                                <Dialog isOpen={this.state.isWeChatDialogOpen} onClose={() => this.setState({ isWeChatDialogOpen: false })} icon="info-sign" title="Payment with Wechat"><div className={Classes.DIALOG_BODY}><p><strong>WeChat ID: {this.state.paymentMethod.wechat}</strong></p></div></Dialog>
                                </> }
                                { this.state.paymentMethod.bank_account_number && <><div className="col-3 payment-icon-container">
                                    <a href="#" onClick={() => this.setState({ isBankDialogOpen: true })}><img className="payment-icon" src={BankIcon} /></a>
                                </div>
                                <Dialog isOpen={this.state.isBankDialogOpen} onClose={() => this.setState({ isBankDialogOpen: false })} icon="info-sign" title="Payment with Bank Account"><div className={Classes.DIALOG_BODY}><p><strong>Bank Account Number: <br />{this.state.paymentMethod.bank_account_number}<br />Bank Account Holder's Name: <br />{this.state.paymentMethod.bank_account_name}<br />Bank Name: <br />{this.state.paymentMethod.bank_name}</strong></p></div></Dialog>
                                </> }
                                { this.state.paymentMethod.cod && <><div className="col-3 payment-icon-container">
                                    <a href="#" onClick={() => this.setState({ isCODDialogOpen: true })}><img className="payment-icon" src={CODIcon} /></a>
                                </div>
                                <Dialog isOpen={this.state.isCODDialogOpen} onClose={() => this.setState({ isCODDialogOpen: false })} icon="info-sign" title="Cash on Delivery"><div className={Classes.DIALOG_BODY}><p><strong>This seller accepts Cash on Delivery</strong></p></div></Dialog>
                                </> }
                            </div>
                        </div>
                    </div>  
                </div>
                <div className="row" style={{ marginTop: 30 }}>
                    <ProductSlider title="Other items from this seller" subtitle="Some items we'd love to share with fellow gaijins" items={this.state.data.selleritems} label="Featured" />
                </div>
                <div className="row" style={{ marginTop: 30, marginBottom: 90 }}>
                    <ProductSlider title="Other items you might like" subtitle="Some items we'd love to share with fellow gaijins" items={this.state.data.relateditems} label="Featured" />
                </div>
                <Footer />
            </>
        );
    }

}

export default ProductDetail;