import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import AdminSidebar from './AdminSidebar';

class System extends Component {

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
                        </div>
                        <div className="col">
                            <h4 className="">Manage Roles & Permissions</h4>
                        </div>
                        <div className="col"></div>
                    </div>
                    <hr />


                    <div className="row">
                        <div className="col"></div>
                        <div className="col mb-5">
                            <Link to="/defineRole">
                                <a className=" text-underlined"><u>Define or modify roles & associated permissions</u></a>
                            </Link>
                        </div>
                        <div className="col"></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default System
