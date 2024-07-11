import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import $ from 'jquery';

export class Clients extends Component {

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
                            <h4 className="pl-4">List Of Clients</h4>
                        </div>
                        <div className="col"></div>
                    </div>
                    <hr />
                    <div className="row bg-light p-5">
                        <div className="col-md-4">
                            <input type="text" className="mr-3 w-75 pl-2 pb-2 pt-1" placeholder="Filter display by name/client" />
                        </div>
                        <div className="col-md-4">
                            <input type="text" className="mr-3 w-75 pl-2 pb-2 pt-1" placeholder="Filter by name/mobile/client" />
                        </div>
                        <div className="col-md-4">
                            <button type="button" className="btn btn-primary mr-3"><span className="font-weight-bolder">&#43;</span> Import Clients</button>
                            <Link to="/createclient">
                                <button type="button" className="btn btn-primary"><span className="font-weight-bolder">&#43;</span> Create Client</button>
                            </Link>
                        </div>
                    </div>
                    <div className=" bg-light p-5">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Client #</th>
                                    <th>External Id</th>
                                    <th>Status</th>
                                    <th>Office</th>
                                    <th>Staff</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Clients
