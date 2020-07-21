import React, { Component } from 'react';
import AppointmentBar from "../AppointmentBar/AppointmentBar";

class AppointmentContainer extends Component {


    render() {
        if(typeof(this.props.items) !== "undefined") {
            
            var items = this.props.items;
            var type = this.props.type;
            items.sort(function(a, b){
                if(a.status < b.status) { return -1; }
                if(a.status > b.status) { return 1; }
                return 0;
            })
            items = items.map(function(item, i) {
                return <div key={i+1}><AppointmentBar item={item} type={type} /></div>
            });
            
            return(
                <div className="container" style={{ marginBottom: 10 }}>
                    {items}
                </div>
            );
        } else {
            return '';
        }
        
    }

}

export default AppointmentContainer;