import React, { Component } from "react";
import "./ProductSlider.scss";
import FullWidthCard from "../FullWidthCard";
import shortid from "shortid";
import Carousel from 'react-multi-carousel';
import SliderNext from "../../illustrations/slidernext.svg";
import SliderPrev from "../../illustrations/sliderprev.svg";
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4
    }
};

const CustomLeftArrow = ({ onClick }) => {
    return <img src={SliderPrev} onClick={() => onClick()} />
};
const CustomRightArrow = ({ onClick }) => {
    return <img src={SliderNext} onClick={() => onClick()} />
};

class ProductSlider extends Component {

    render() {
        if(typeof(this.props.items) !== "undefined") {
            return(
                <div className="custom-container">
                    <div className="section-container">
                        <div className="section-title">
                            {this.props.title}
                        </div>
                    </div>
                    <div className="section-container" style={{ marginBottom: 12 }}>
                        <div className="section-subtitle">
                            {this.props.subtitle}
                        </div>
                    </div>
                    <div className="section-container">
                        <Carousel
                            additionalTransfrom={10}
                            arrows
                            autoPlaySpeed={3000}
                            centerMode={false}
                            className=""
                            containerClass="container-with-dots"
                            dotListClass=""
                            draggable
                            focusOnSelect={false}
                            infinite
                            itemClass=""
                            keyBoardControl
                            minimumTouchDrag={80}
                            renderButtonGroupOutside={false}
                            renderDotsOutside={false}
                            responsive={responsive}
                            showDots={true}
                            sliderClass=""
                            slidesToSlide={1}
                            swipeable
                            >
                                { this.props.items.map(function (item, i) {
                                    return (
                                        <FullWidthCard key={shortid.generate()} item={item} />
                                    );
                                })}
                        </Carousel>
                    </div>
                </div>
            );
        } else {
           return ""; 
        }
    }

}

export default ProductSlider;