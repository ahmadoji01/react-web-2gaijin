import React, { Component } from "react";
import { Alignment, Classes, Button, Dialog, Navbar, NavbarHeading, NavbarDivider, NavbarGroup, Icon } from "@blueprintjs/core";

class AboutUs extends Component {

    render() {
        return (<div className={`${Classes.DIALOG_BODY} appointment-dialog`}>
            <div >
                <div >
                    <h4>About Us</h4>
                </div>
                <div >
                    <p>
                        Word <em>gaijin</em> is a Japanese word which means foreigner. 2Gaijin.com is a website designed special for all foreigners living in Japan to buy or sell 2nd hand goods. By `foreigners` does not only mean English-speaking foreigners, but also other foreigners whose first language is not English, (Chinese, Indonesian, and others). Main purposes of 2Gaijin.com are:
                    </p>
                    <ul>
                        <li>
                            to reduce environmental waste that came from second hand goods being thrown away by foreigners as they leave Japan.
                        </li>
                        <li>
                            to provide a more effective online platform for foreigners to trade their second hand goods.
                        </li>
                        <li>
                            to help University students saving more money for textbooks, by giving them access to an online platform that makes it easier for students to sell away their unused textbooks.
                        </li>
                        <li>
                            to provide means for new-coming foreigners to find second hand furniture, beds, bicycles and/or other equipment that some leaving foreigners are willing to sell with cheaper price.
                        </li>
                    </ul>
                    Japanese people who are interested to sell/buy second hand goods to/from foreigners are more than welcome to join!
                </div>
            </div>
        </div>);
    }

}

export default AboutUs;