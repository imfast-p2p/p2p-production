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
import { confirmAlert } from 'react-confirm-alert';

export class EditSysUser extends Component {
    constructor() {
        super();

        this.state = {
            firstName: sessionStorage.getItem("fName"),
            lastname: sessionStorage.getItem("lName"),
            email: sessionStorage.getItem("empEmailID"),
            mobile: sessionStorage.getItem("mobileno"),
            dob: sessionStorage.getItem("dob"),
            roleList: [],


            roles: [],
            memmid: "",
            userid: ""
        };
        // this.addRole =  this.addRole.bind();
    }

    componentDidMount() {
        this.getGroups();
        $(function () {
            function moveItems(origin, dest) {
                $(origin).find(':selected').appendTo(dest);
            }
            $('#left').click(function () {
                moveItems('#hidden', '#visible');
            });

            $('#right').on('click', function () {
                moveItems('#visible', '#hidden');
            });
        })
        // $('#').on('change', function () {
        //     $(this).children().eq(this.selectedIndex).appendTo('#hidden');
        // });
        // $('#hidden').on('click', function () {
        //     $('#hidden').children().eq(this.selectedIndex).appendTo('#visible');
        // });
    }

    firstName = (e) => {
        console.log(e.target.value);
        this.setState({ firstName: e.target.value })

    }
    lastName = (e) => {
        this.setState({ lastname: e.target.value })
    }
    email = (e) => {
        this.setState({ email: e.target.value })
    }
    dob = (e) => {
        this.setState({ dob: e.target.value })
    }

    addRole = () => {

    }
    removeRole() {

    }

    getGroups = () => {
        fetch(BASEURL + '/usrmgmt/usergetallroles', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })

            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    this.setState({ roleList: resdata.msgdata })
                }
                else {
                    if (resdata.code === '0102') {
                        confirmAlert({
                            message: resdata.message + ", please login again to continue.",
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        window.location = '/login';
                                        sessionStorage.removeItem('status')
                                        sessionStorage.clear();
                                        sessionStorage.clear();
                                    },
                                },
                            ],
                            closeOnClickOutside: false,
                        });
                    } else {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        // window.location.reload();
                                    },
                                },
                            ],
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    add = (e) => {
        //         document.getElementById("Selection").children()
        //         ('#visible').on('change', function () {
        //     $(this).children().eq(this.selectedIndex).appendTo('#hidden');
        // });
    }

    handleChange() {
        $(".text").toggle();
    }
    addUserRoles = () => {
        let selectElement = document.getElementById('hidden');
        let optionNames = [...selectElement.options].map(o => o.text);
        console.log(optionNames);
        for (var i = 0; i < optionNames.length; i++) {
            for (var j = 1; j < optionNames.length; j++) {
                if ((optionNames[i] === "BOR_SUPPORT") && (optionNames[j] === "BOR_SUPPORT_MANAGER")) {

                    alert("Selected roles have conflict. Please verify and reassign the roles")
                    break;
                } else if ((optionNames[i] === "INV_SUPPORT") && (optionNames[j] === "INV_SUPPORT_MANAGER")) {
                    alert("Selected roles have conflict. Please verify and reassign the roles")
                    break;
                } else if ((optionNames[i] === "FIELD_EXECUTIVE") && (optionNames[j] === "FIELD_MANAGER")) {
                    alert("Selected roles have conflict. Please verify and reassign the roles")
                    break;
                } else if ((optionNames[i] === "LEGAL_EXECUTIVE") && (optionNames[j] === "LEGAL_MANAGER")) {
                    alert("Selected roles have conflict. Please verify and reassign the roles")
                    break;
                } if ((optionNames[i] === "BORROWER_MANAGER") && (optionNames[j] === "BORROWER_SUPORT")) {

                    alert("Selected roles have conflict. Please verify and reassign the roles")
                    break;
                }
            }
        }
        fetch(BASEURL + '/usrmgmt/addUserRoles', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                memmid: "",
                userid: "",
                roles: ""
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
        // alert("User details saved successfully.")
        // window.location.reload();


    }
    render() {
        const { t } = this.props;

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
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <AdminSidebar />

                <div
                    className="pl-3 pr-3 main-content bg-light"
                    id="page-content-wrapper"
                >
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id="borAccRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-6' id="borAccRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/userManagement">User Management</Link> / <Link to="/viewuser">View User</Link> / Edit System User</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/viewuser"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className="container-fluid">

                        <div className='row' >
                            <div className='col card item-list' style={{ marginLeft: "30px", cursor: "default" }}>
                                <div className='row item-list align-items-center' style={{ marginBottom: "20px" }}>
                                    <div className="col">
                                        <div className="col" style={{ paddingTop: "30px" }}>

                                            <h4>Edit User</h4>
                                            <hr />
                                            <form className="pl-4">
                                                <div class="form-group row">
                                                    <label class="col-sm-2 col-form-label">First Name</label>
                                                    <div class="col-sm-4">
                                                        <input type="text" class="form-control border border-dark" name="fname" style={{ height: "30px", marginLeft: "-40px" }} value={this.state.firstName} onChange={this.firstName} />
                                                    </div>
                                                </div>
                                                <div class="form-group row" style={{ marginTop: "-10px" }}>
                                                    <label class="col-sm-2 col-form-label">Last Name</label>
                                                    <div class="col-sm-4">
                                                        <input type="text" class="form-control border border-dark" name="lname" style={{ height: "30px", marginLeft: "-40px" }} value={this.state.lastname} onChange={this.lastName} />
                                                    </div>
                                                </div>
                                                <div class="form-group row" style={{ marginTop: "-10px" }}>
                                                    <label class="col-sm-2 col-form-label">Email</label>
                                                    <div class="col-sm-4">
                                                        <input type="text" disabled class="form-control border border-dark" name="email" style={{ height: "30px", marginLeft: "-40px" }} value={this.state.email} onChange={this.email} />
                                                    </div>
                                                </div>
                                                <div class="form-group row" style={{ marginTop: "-10px" }}>
                                                    <label class="col-sm-2 col-form-label">Mobile</label>
                                                    <div class="col-sm-4">
                                                        <input type="text" class="form-control border border-dark" name="mobile" style={{ height: "30px", marginLeft: "-40px" }} value={this.state.mobile} readOnly />
                                                    </div>
                                                </div>
                                                <div class="form-group row" style={{ marginTop: "-10px" }}>
                                                    <label class="col-sm-2 col-form-label">DOB</label>
                                                    <div class="col-sm-4">
                                                        <input type="text" class="form-control border border-dark" name="dob" style={{ height: "30px", marginLeft: "-40px" }} value={this.state.dob} onChange={this.dob} />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        <div className="row pl-4">
                                            <div className="col" style={{ marginLeft: "20px" }}>
                                                <label >Available Roles</label>
                                                <select name="cars" id="visible" multiple scroll={true} className="scrollbar" style={{ height: "100px", width: "210px" }} >
                                                    {
                                                        this.state.roleList.map((role, index) => (
                                                            <option id='optionVal' key={index} style={{ color: "GrayText" }} >{role.rolename}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="col" style={{ marginLeft: "15px" }}>
                                                <div className="row" style={{ marginTop: "40px" }}>
                                                    <div className="col">
                                                        <input type="button" className="btn btn-info btn-block col" id="right" value=">" style={{ width: "auto" }} />
                                                        <input type="button" className="btn btn-info btn-block col" id="left" value="<" style={{ width: "auto" }} />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="col">
                                                <label >Assigned Roles</label>
                                                <select name="cars" id="hidden" multiple scroll={true} className="scrollbar" style={{ height: "100px", width: "200px" }} >
                                                </select>
                                            </div>
                                            <div className="col"></div>
                                            <div className="col"></div>
                                            <div className="col"></div>
                                            <div className="col"></div>

                                        </div>
                                        <br />

                                        <div style={{ marginLeft: "40px" }}>
                                            <button className="btn border" id="CancelBtn" >Cancel</button>&nbsp; &nbsp;
                                            <button className="btn btn-primary" id="SubmitBtn" onClick={this.addUserRoles}>Submit</button>
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

export default withTranslation()(EditSysUser);