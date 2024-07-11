import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import $ from 'jquery';

export class CreateClient extends Component {

    handleChange() {
        $('.text').toggle();
    }


    render() {
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <AdminSidebar />

                <div className="main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid row">
                        <div className="col">
                            <button onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                            <div className="top">

                            </div>
                        </div>

                    </div>
                    <div className="card">
                        <div className="card-header border-0">
                            <div className="row">
                                <div className="col-sm-2 col-md-2 col-lg-2">
                                    <Link to="/clients">
                                        <a href="#" className="back">‹</a>
                                    </Link>
                                </div>
                                <div className="col-sm-8 col-md-8 col-lg-8">
                                    <h4 style={{ paddingLeft: '40%' }}>Create Client</h4>
                                </div>
                                <div className="col-sm-2 col-md-2 col-lg-2"></div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <hr style={{ width: '100%' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4 col-md-4 col-lg-4">
                                    <label htmlFor="user" className="label ">Office:</label>
                                    <input type="text" className="form-control" id="user" />
                                </div>
                                <div className="col-sm-4 col-md-4 col-lg-4">
                                    <label htmlFor="user" className="label ">Legal form:</label>
                                    <input type="text" className="form-control" id="user" />
                                </div>
                                <div className="col-sm-4 col-md-4 col-lg-4">
                                    <label htmlFor="user" className="label ">First name:</label>
                                    <input type="text" className="form-control" id="first" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4 col-md-4 col-lg-4">
                                    <label htmlFor="firstname" className="label">Middle Name:</label>
                                    <input type="text" className="form-control" id="second" />
                                </div>
                                <div className="col-sm-4 col-md-4 col-lg-4">
                                    <label htmlFor="lastname" className="label ">Last Name:</label>
                                    <input id="last" type="text" className="form-control" />
                                </div>
                                <div className="col-sm-4 col-md-4 col-lg-4">
                                    <label htmlFor="email" className="label ">Email:</label>
                                    <input id="email" type="text" className="form-control" />
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-sm-4 col-md-4 col-lg-4">
                                    <label htmlFor="check" className="mr-2">Auto generate password</label>
                                    <input id="check" type="checkbox" className="check" defaultChecked />
                                </div>
                                <div className="col-sm-4 col-md-4 col-lg-4">

                                </div>
                                <div className="col-sm-4 col-md-4 col-lg-4">
                                    <Link to="/clients">
                                        <input type="submit" className="btn btn-danger m-1" value="Cancel" />
                                    </Link>
                                    <input type="submit" className="btn btn-primary m-1" value="Submit" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default CreateClient
