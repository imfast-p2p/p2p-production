import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import AdminSidebar from './AdminSidebar';
import $ from 'jquery';

class AddRole extends Component {

    constructor(props) {
        super(props)

        this.state = {
            groupid: 5,
            rolename: "BASIC ADMIN",
            roledesc: "Adminstrator role",
            permissions: []
        }

        this.rolename = this.rolename.bind(this);
        this.roledesc = this.roledesc.bind(this);
        this.createRole = this.createRole.bind(this);
    }

    rolename(event) {
        this.setState({ rolename: event.target.value })
    }

    roledesc(event) {
        this.setState({ roledesc: event.target.value })
    }

    createRole() {
        fetch(BASEURL + '/usrmgmt/usercreaterole', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                groupid: parseInt(this.state.groupid),
                rolename: this.state.rolename,
                roledesc: this.state.roledesc,
                permissions: this.state.permissions
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    alert("User role created successfully")
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }

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
                                <Link to="/defineRole">
                                    <a href="#" className="previous round mr-5">&laquo; Previous</a>
                                </Link>
                            </div>
                        </div>
                        <div className="col">
                            <h2>Add Role</h2>
                        </div>
                        <div className="col"></div>

                    </div>
                    <hr />

                    <div className="bg-light p-5">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="name" className="float-right">Name:</label>
                            </div>
                            <div className="col-md-4">
                                <input id="name" onChange={this.rolename} type="text" className="w-100" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="desc" className="float-right">Description:</label>
                            </div>
                            <div className="col-md-4">
                                <input id="desc" onChange={this.roledesc} type="text" className="w-100" />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-3">
                                <Link to="/defineRole">
                                    <button type="button" className="btn btn-info m-1">Cancel</button>
                                </Link>
                                <button type="button" onClick={this.createRole} className="btn btn-success m-1">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddRole
