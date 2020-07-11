import React, { Component } from 'react'
import "./CategoryIcon.scss"

class CategoryIcon extends Component {
    
    render() {
        if(typeof(this.props.iconname) !== 'undefined') {
            return(
                <div className={`cat-icon-base base-${this.props.iconcolor}-color`}>
                    <img className="icon-svg" src={`${process.env.PUBLIC_URL}/icons/${this.props.iconname.replace(/\s+/g, '')}Icon.svg`} />
                    <div className="icon-name">{this.props.iconname}</div>
                </div>
            )
        }
    }

}

export default CategoryIcon;