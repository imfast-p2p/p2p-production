import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Admin extends Component {
    render() {
        return (
            <div className="row">
                <div className="login col-md-6 mx-auto p-0">
                    <div className="card card-1">
                        <div className="login-box-1">
                            <div className="login-snip p-5">

                                <input id="tab-2" type="radio" name="tab" className="sign-up" />
                                <label htmlFor="tab-2" className="tab">Admin Login</label>
                                <div className="login-space">


                                    <div className="login">
                                        <div className="group">
                                            <label htmlFor="user" className="label">Username</label>
                                            <input id="user" type="text" className="input" placeholder="Enter your username" />
                                        </div>

                                        <div className="group">
                                            <label htmlFor="pass" className="label">Password</label>
                                            <input id="pass" type="password" className="input" data-type="password" placeholder="Enter your password" />
                                        </div>
                                        <div className="group">
                                            <input id="check" type="checkbox" className="check" />
                                            <label htmlFor="check"><span className="icon"></span> Keep me Signed in</label>
                                        </div>
                                        <div className="group">
                                            <Link to="/landing">
                                                <input type="submit" className="button" value="Sign In" />
                                            </Link>
                                        </div>
                                        <div className="hr"></div>
                                        <div className="foot">
                                            <a href="#">forgot Password?</a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Admin
