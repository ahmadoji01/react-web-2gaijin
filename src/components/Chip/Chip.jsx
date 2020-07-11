import React, { Component } from "react";
import "./Chip.scss";

class Chip extends Component {
    render() {
        if(typeof(this.props.title) === "undefined") {
            return "";
        }

        return(
            <a href={this.props.link} className="chip">
                {this.props.title}
            </a>
        )
    }
}

export default Chip;