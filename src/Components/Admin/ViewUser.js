import React, { Component } from "react";
import { BASEURL } from "../assets/baseURL";
import AdminSidebar from "./AdminSidebar";
import $ from "jquery";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import * as FaIcons from "react-icons/fa"
import * as MdIcons from "react-icons/md"
import { FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';

export class ViewUser extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }

    // componentDidMount() {
    //     this.allUsers();
    //     this.getFacilitators();
    //     this.getEvaluators();
    // }
    edit = () => {
        window.location = "/EditSysUser"
    }

    handleChange() {
        $(".text").toggle();
    }

    render() {
        const { t } = this.props;

        let sytemUID = sessionStorage.getItem("SysID");
        let fname = sessionStorage.getItem("fName");
        let lname = sessionStorage.getItem("lName");
        let empEmpId = sessionStorage.getItem("empEmailID");
        let mobile = sessionStorage.getItem("mobileno");
        let dob = sessionStorage.getItem("dob")
        const myStyle = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "4px 2px",
            cursor: "pointer",
            fontSize: "12px",
            // height: "25px",
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            marginLeft: "14px"
        }

        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
                <AdminSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id="borAccRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-6' id="borAccRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/userManagement">User Management / </Link> View User</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/userManagement"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className="container-fluid">
                        <div className='row'>
                            <div className='col card item-list' style={{ marginLeft: "30px" }}>
                                <div className='row item-list align-items-center'>
                                    <div className="col">
                                        <div className="col" style={{ paddingTop: "30px" }}>
                                            <div className="col" style={{ display: "block", textAlign: "end" }}>
                                                <button type="button" class="btn btn-primary" onClick={this.edit}><FaIcons.FaEdit />Edit</button>&nbsp;
                                                <button type="button" class="btn border"><MdIcons.MdDeleteOutline />Delete</button>&nbsp;

                                            </div>
                                            <h4>User Details</h4>
                                            <table className="table table-bordered" style={{ width: "450px" }}>
                                                <tbody>

                                                    <tr>
                                                        <th style={{ flexWrap: "nowrap" }}>First Name</th>
                                                        <td style={{ textAlign: "left" }}>{fname}</td>
                                                    </tr>
                                                    <tr style={{ backgroundColor: "rgb(248, 250, 247)" }}>
                                                        <th>Last Name</th>
                                                        <td style={{ textAlign: "left" }}>{lname}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Email</th>
                                                        <td style={{ textAlign: "left" }}>{empEmpId}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Mobile Number</th>
                                                        <td style={{ textAlign: "left" }}>{mobile}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Date of Birth</th>
                                                        <td style={{ textAlign: "left" }}>{dob}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(ViewUser);