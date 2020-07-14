import React, { Component } from 'react'
import "./CategoryIcon.scss"

class CategoryIcon extends Component {
    


    render() {
        if(typeof(this.props.iconname) !== 'undefined') {
            return(
                <div className={`cat-icon-base base-${this.props.iconcolor}-color`} style={{ width: this.props.iconsize, height: this.props.iconsize }}>
                    <img className="icon-svg" src={`${process.env.PUBLIC_URL}/icons/${this.props.iconname.replace(/\s+/g, '')}Icon.svg`} style={{ width: (this.props.iconsize - 30) }} />
                    <div className="icon-name" style={{ fontSize: this.props.iconsize/8 }}>{this.props.iconname}</div>
                </div>
            )
        }
    }

}

export default CategoryIcon;