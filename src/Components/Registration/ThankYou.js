import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {FaMailBulk} from 'react-icons/fa';
import {FaUserCheck} from 'react-icons/fa';
//updated
class ThankYou extends Component {
    render() {
        return (
            <div className="thanks">
                <h1>Thank You For Completing The Registration Process</h1>
                <h3>Please
                    <Link to="/login">
                        <button className="btn">click here</button>
                    </Link> to login</h3>
                <br />
                <div className="row  pl-3">
                    {/* <p ><FaMailBulk style={{ fontSize: "25px" }} />&nbsp;&nbsp;<span>Please check your registered email ID and complete the signing process</span>

                    </p> */}
                    <p><FaUserCheck style={{ fontSize: "25px" }} />&nbsp;&nbsp;<span>After Register Now Verify Later process, complete the KYC Verification with the registered username and password.</span>


                    </p>

                </div>
            </div>
        )
    }
}

export default ThankYou
