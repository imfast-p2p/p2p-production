import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import SimpleReactValidator from 'simple-react-validator';
import AdminSidebar from './AdminSidebar';
import $ from 'jquery';
import './CreateUser.css';
import { withTranslation } from 'react-i18next';
import { VscTypeHierarchySub } from 'react-icons/vsc';
import { FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import { confirmAlert } from "react-confirm-alert";

var today;
class UpdateSysUserProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pannumber: '',
            userid: " ",
            usergroup: "",
            roleid: "",
            emptypeid: "",
            empstatusid: "",
            companyid: "",
            firstname: " ",
            middlename: " ",
            lastname: " ",
            gender: " ",
            dob: "",
            mobilenumber: " ",
            email: " ",
            maritalstatus: "",
            residenceaddress: " ",
            district: " ",
            state1: " ",
            pincode: "",
            city: "",

            stateList: [],
            districtList: [],
            roleList: [],

            additionaldata: {
                "key1": "xxxxxxxxxx",
                "key2": "yyyyyyyy",
                "key3": 1010
            },

            sysEmpTypes: [],
            sysEmpstatus: [],
            sompanyName: []
        }
    }
    componentDidMount() {
        // this.getStateList();
        var sysUserDetails = JSON.parse(sessionStorage.getItem("editSysDetails"));
        console.log(sysUserDetails);

        this.setState({
            firstname: sysUserDetails.firstName,
            middlename: sysUserDetails.middleName,
            lastname:sysUserDetails.lastName,
            gender: sysUserDetails.gender,
            mobilenumber: sysUserDetails.mobileNumber,
            email: sysUserDetails.empEmail,
            maritalstatus: sysUserDetails.maritalStatus,
            residenceaddress: sysUserDetails.residenceAddress,
            pincode: sysUserDetails.princode,
            city: sysUserDetails.city,
            companyid: sysUserDetails.companyId,
            usergroup: sysUserDetails.userGroup,
            roleid: sysUserDetails.roleId,
            emptypeid: sysUserDetails.empTypeId,
            empstatusid: sysUserDetails.empStatusId,
            pannumber: sysUserDetails.pan,
        })
    }
    firstname = (event) => {
        this.setState({ firstname: event.target.value })
    }
    middlename = (event) => {
        this.setState({ middlename: event.target.value })
    }
    lastname = (event) => {
        this.setState({ lastname: event.target.value })
    }
    gender = (event) => {
        this.setState({ gender: event.target.value })
    }
    dob = (event) => {
        //this.setState({ dob: event.target.value })
        today = new Date(event.target.value);
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        today = dd + '-' + mm + '-' + yyyy;
        console.log(today)

    }
    mobilenumber = (event) => {
        this.setState({ mobilenumber: event.target.value })
    }
    email = (event) => {
        this.setState({ email: event.target.value })
    }
    maritalstatus = (event) => {
        this.setState({ maritalstatus: event.target.value })
    }
    residenceaddress = (event) => {
        this.setState({ residenceaddress: event.target.value })
    }
    district = (event) => {
        this.setState({ district: event.target.value })
    }
    state1 = (event) => {
        this.setState({ state1: event.target.value })

        this.state.stateList
            .filter((e) => e.statecode == event.target.value)
            .map(() => {
                this.getDistrictList(event.target.value);
            })
    }
    statecode = (event) => {
        this.setState({ statecode: event.target.value })
    }
    pincode = (event) => {
        this.setState({ pincode: event.target.value })
    }
    city = (event) => {
        this.setState({ city: event.target.value })
    }
    companyname = (event) => {
        this.setState({ companyid: event.target.value })
        console.log(this.state.companyid)
    }
    getStateList = (event) => {
        fetch(BASEURL + '/usrmgmt/getstatelist', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ stateList: resdata.msgdata })
                    this.state.stateList.map((statelist) => {
                        return statelist.statename;
                    })
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
    }
    getDistrictList = (statecod) => {
        this.setState({ state1: statecod })
        fetch(BASEURL + '/usrmgmt/getdistrictlist?statecode=' + statecod, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ districtList: resdata.msgdata.distlist })
                }
                // else {
                //     alert("Issue: " + resdata.message);
                // }
            })
    }
    updateSysUserProfile = () => {
        fetch(BASEURL + 'usrmgmt/updatesystemuserprofile', {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
                userid: this.state.firstname,
                usergroup: parseInt(this.state.usergroup),
                roleid: parseInt(this.state.roleid),
                emptypeid: parseInt(this.state.emptypeid),
                empstatusid: parseInt(this.state.empstatusid),
                companyid: parseInt(this.state.companyid),
                firstname: this.state.firstname,
                middlename: this.state.middlename,
                lastname: this.state.lastname,
                gender: this.state.gender,
                dob: today,
                mobilenumber: this.state.mobilenumber,
                email: this.state.email,
                maritalstatus: parseInt(this.state.maritalstatus),
                residenceaddress: this.state.residenceaddress,
                district: this.state.districtList.find((dist) => dist.distid === this.state.district).distname,
                state: this.state.stateList.find((state) => state.statecode === this.state.state1).statename,
                city: this.state.city,
                pincode: parseInt(this.state.pincode),
                pan: this.state.pannumber,
            }),
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'Success' || 'SUCCESS' || 'success') {
                    console.log(resdata);

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
    }
    handleChange() {
        $('.text').toggle();
        $("#Pinfo").toggle();
    }
    cancelCreate = () => {
        window.location.reload();
    }

    test = (i) => {
        this.setState.roleid = this.state.roleList[i].roleid;
        console.log(this.state.roleid)
    }


    render() {
        const { t } = this.props
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
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-6' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/userManagement">User Management</Link> / Update System User Profile</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-2'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/userManagement"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className="card" style={{ cursor: "default", width: "92%", marginLeft: "45px", marginTop: "-10px" }}>
                        <div className="card-header border-1 bg-white">
                            <div className='row' style={{ paddingLeft: "3px" }}>
                                <div className='col-5' id='headingRef'>
                                    <div className="two__image" style={{ paddingLeft: "10px" }}>
                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Update System User Profile</p>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('First Name *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('Enter First Name')} onChange={this.firstname} value={this.state.firstname}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Middle Name')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('Enter Middle Name')} onChange={this.middlename} value={this.state.middlename}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Last Name *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('Enter Last Name')} onChange={this.lastname} value={this.state.lastname}
                                    />
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Date Of Birth *')}</p>
                                    <input type="date" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('DD-MM-YYYY')} onChange={this.dob}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Email ID *')}</p>
                                    <input type="email" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('Enter Email ID')} onChange={this.email} value={this.state.email}/>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Contact Number *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('Enter Mobile Number')} onChange={this.mobilenumber} value={this.state.mobilenumber}
                                    />
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Gender *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.gender} >
                                        <option defaultValue>Select Gender</option>
                                        <option value="M">{t('male')}</option>
                                        <option value="F">{t('female')}</option>
                                        <option value="O">{t('Others')}</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Marital Status *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.maritalstatus}>
                                        <option defaultValue>Select</option>
                                        <option value="1">{t('Married')}</option>
                                        <option value="0">{t('Single')}</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Address *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputCity" placeholder={t('Enter Address')} onChange={this.residenceaddress} value={this.state.residenceaddress}
                                    />
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('State *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onClick={this.state1} >
                                        <option defaultValue>Select State</option>
                                        {this.state.stateList.map((states, index) => (
                                            <option key={index} value={states.statecode} style={{ color: "GrayText" }}>{states.statename} </option>
                                        ))
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('District *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.district}>
                                        <option defaultValue>Select District</option>
                                        {this.state.districtList.map((districts, index) => {
                                            return (
                                                <option key={index} value={districts.distid} style={{ color: "GrayText" }}>{districts.distname}</option>
                                            )
                                        })
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('City *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputZip" placeholder={t('Enter City')} onChange={this.city} value={this.state.city}
                                    />
                                </div>

                            </div>

                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('PIN Code *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputZip" placeholder={t('Enter PIN Code')} onChange={this.pincode} value={this.state.pincode}
                                    />
                                </div>
                            </div>
                            <hr style={{ marginTop: "-2px" }} />

                            <div className="form-row" style={{ textAlign: "center" }}>
                                <div className="form-group col">
                                    <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                        onClick={this.updateSysUserProfile}  >Submit</button>
                                    <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                        onClick={this.cancelCreate}>{t('Cancel')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default withTranslation()(UpdateSysUserProfile)