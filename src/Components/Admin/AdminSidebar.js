import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as HiIcons from "react-icons/hi";
import * as VscIcons from "react-icons/vsc";
import * as BiIcons from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import { withTranslation } from 'react-i18next';
import a1 from '../assets/AdminImg/homeassistant.svg';
import a2 from '../assets/AdminImg/UserManagement.svg';
import a3 from '../assets/AdminImg/RoleManagement.svg';
import a4 from '../assets/AdminImg/CustomerSupport.svg';
import a5 from '../assets/AdminImg/AdminRefD.svg';
import a6 from '../assets/AdminImg/FacilitatorEvaluator.svg';
import a7 from '../assets/AdminImg/BulkRegistration.svg';
import a8 from '../assets/AdminImg/AdminTransactions.svg';
import a9 from '../assets/AdminImg/ProductConfiguration.svg';
import $ from 'jquery';
import ViewallLoans from '../assets/img/ViewAllLoans2.svg';
import viewLoanReq from '../assets/img/ViewLoanRequest.svg';
import Tooltip from "@material-ui/core/Tooltip";
import { confirmAlert } from 'react-confirm-alert';
import { BASEURL } from '../assets/baseURL';

class AdminSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: true,
            showRoles: true,
            userType: "",
            pmAdminType: "",

            partnerName: "",
            makerPermissions: [],
            makerPermissions2: true,
            checkerPermissions: [],
            rolemgmtView: [],
            checkerViewPermissions: false,
            adminPermissions: false,
            dataLoaded: 'false'
        }
    }
    componentDidMount() {
        this.setState({
            userType: sessionStorage.getItem("userType"),
            dataLoaded: sessionStorage.getItem('dataLoaded')
        }, () => {
            console.log(this.state.dataLoaded, typeof (this.state.dataLoaded), typeof (sessionStorage.getItem('dataLoaded')))
            if (this.state.dataLoaded !== "true") {
                this.getAllPartners();
                this.setState({ dataLoaded: "true" }, () => {
                    sessionStorage.setItem('dataLoaded', "true");
                });
            }
        })
        console.log(this.state.userType)
        if (sessionStorage.getItem('sAdmin') === "1" && sessionStorage.getItem('pmDefault') === "1") {
            //Super Admin
            this.setState({ pmAdminType: "superAdmin" })
        } else if (sessionStorage.getItem('pmDefault') === "0") {
            this.setState({ pmAdminType: "pmAdmin" })
        } else {
            this.setState({ pmAdminType: "0" })
        }
        // this.getAllPartners();
        // this.updatePermissions();
    }
    componentDidUpdate(prevProps, prevState) {
        // Check if rolePermData props have changed
        // if (this.props.rolePermData !== prevProps.rolePermData) {
        //     this.updatePermissions(prevState);
        // }
        var storedArrayStringJSON = sessionStorage.getItem("rolePermData");
        var storedArray = JSON.parse(storedArrayStringJSON);
        console.log(storedArray);
        if (storedArray && storedArray.length > 0) {
            storedArray.forEach(element => {
                if (element.rolename === "VRFD_SYS_APPROVER" && !prevState.makerPermissions) {
                    console.log(element.permissions);
                    this.setState({ makerPermissions: true }, () => {
                        console.log(this.state.makerPermissions);
                    });
                }
                if (element.rolename === "USR_ROLE_MGMT_MAKER" && !prevState.makerPermissions2) {
                    console.log(element.permissions);
                    this.setState({ makerPermissions2: true }, () => {
                        console.log(this.state.makerPermissions2);
                    });
                }
                if (element.rolename === "VIEW_OPTNS_CHECKER" && !prevState.checkerViewPermissions) {
                    console.log(element.permissions);
                    this.setState({ checkerViewPermissions: true }, () => {
                        console.log(this.state.checkerViewPermissions);
                    });
                }
                if (element.rolename === "ADMIN" && !prevState.adminPermissions) {
                    console.log(element.permissions);
                    this.setState({ adminPermissions: true }, () => {
                        console.log(this.state.adminPermissions);
                    });
                }
            });
        } else {
            // If storedArray is not available yet, wait and check again
            setTimeout(() => {
                this.componentDidUpdate(prevProps, prevState);
            }, 1000); // Adjust the timeout value as needed
        }
    }
    // updatePermissions() {
    //     var storedArrayStringJSON = sessionStorage.getItem("rolePermData");
    //     if (storedArrayStringJSON) {
    //         var storedArray = JSON.parse(storedArrayStringJSON);
    //         console.log(storedArray);

    //         // Check if storedArray exists and is not empty
    //         if (storedArray) {
    //             const newState = {};
    //             storedArray.forEach(element => {
    //                 if (element.rolename === "VRFD_SYS_APPROVER") {
    //                     console.log(element.permissions);
    //                     newState.makerPermissions = true;
    //                 }
    //                 if (element.rolename === "USR_ROLE_MGMT_MAKER") {
    //                     console.log(element.permissions);
    //                     newState.makerPermissions2 = true;
    //                 }
    //                 if (element.rolename === "VIEW_OPTNS_CHECKER") {
    //                     console.log(element.permissions);
    //                     newState.checkerViewPermissions = true;
    //                 }
    //                 if (element.rolename === "ADMIN") {
    //                     console.log(element.permissions);
    //                     newState.adminPermissions = true;
    //                 }
    //             });

    //             // Update state only once after processing all elements
    //             this.setState(newState);
    //         } else {
    //             // If storedArray is not available yet, wait and check again
    //             setTimeout(() => {
    //                 this.updatePermissions();
    //             }, 1000); // Adjust the timeout value as needed
    //         }
    //     }
    // }

    assignRole = () => {
        sessionStorage.setItem("assignRoleFlag", true);
        window.location = "/createRole";
    }
    unAssignRole = () => {
        sessionStorage.setItem("unassignRoleFlag", 1);
        window.location = "/createRole";
    }

    roleMgmt = () => {
        if (this.state.userType === "0") {
            $(".roles").show()

        } else if (this.state.userType === "superAdmin") {
            $(".roles").show()
        }
        else {
            $(".pmroles").show()
        }
    }
    getAllPartners = () => {
        fetch(BASEURL + '/usrmgmt/getallpartners', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success' || 'SUCCESS' || 'success') {
                    console.log(resdata);
                    // 
                    if (resdata.msgdata) {
                        resdata.msgdata.forEach(element => {
                            this.setState({ partnerName: element.partnername })
                            sessionStorage.setItem('partnerName', element.partnername)
                        });
                    }
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
    render() {
        const { t } = this.props;
        console.log(this.state.userType)
        const { pmAdminType, makerPermissions, makerPermissions2, checkerPermissions, rolemgmtView, checkerViewPermissions, adminPermissions } = this.state;
        return (
            <nav className="sidenav navbar navbar-vertical p-2 fixed-left  navbar-expand-xs navbar-light bg-admin d-block"
                style={{ backgroundColor: "#F7FCFF", marginBottom: "3px", marginTop: "-9px" }} id="sidebar-wrapper">
                <div className="navbar-inner" style={{ display: "block ruby", width: "max-content" }}>
                    <div className="menu navbar-collapseOnSelect" expand="lg" id="sidenav-collapse-main">
                        <li className="nav-item" id="Pinfo" style={{ width: "170px", marginTop: "20px", marginBottom: "-10px" }}>

                            {pmAdminType === "0" ?
                                <Tooltip title="Platform Admin" >
                                    <p className="d-flex justify-content-center font-weight-bold text-dark" style={{ color: "white", marginTop: "-10px" }}>
                                        <FaIcons.FaUserAlt style={{ marginTop: "4px", width: "12px" }} />
                                        &nbsp;<span style={{ fontSize: "12px", wordWrap: "break-word", marginTop: "5px" }}>Platform Admin</span></p>
                                </Tooltip> :
                                pmAdminType === "pmAdmin" ?
                                    <Tooltip title={this.state.partnerName} >
                                        <p className="d-flex justify-content-center font-weight-bold text-dark" style={{ color: "white", marginTop: "-10px" }}>
                                            <FaIcons.FaUserAlt style={{ marginTop: "4px", width: "12px" }} />
                                            &nbsp;<span style={{ fontSize: "12px", wordWrap: "break-word", marginTop: "5px" }}>
                                                {this.state.partnerName.substring(0, 6) + "..."}</span></p>
                                    </Tooltip> :
                                    pmAdminType === "superAdmin" ?
                                        <Tooltip title="Super Admin" >
                                            <p className="d-flex justify-content-center font-weight-bold text-dark" style={{ color: "white", marginTop: "-10px" }}>
                                                <FaIcons.FaUserAlt style={{ marginTop: "4px", width: "12px" }} />
                                                &nbsp;<span style={{ fontSize: "12px", wordWrap: "break-word", marginTop: "5px" }}>
                                                    Super Admin
                                                </span></p>
                                        </Tooltip> :
                                        ""
                            }

                        </li>
                        <div className="scrollbar" style={{
                            height: "75vh",
                            overflowY: 'auto',
                            scrollbarWidth: "thin",
                        }}>
                            {pmAdminType === "0" ?
                                <ul className="navbar-nav">
                                    <li className="" id='nav-items'>
                                        <Link to="/landing" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <img src={a1} style={{ paddingLeft: "12px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "10px" }}>{t('Home')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/userManagement" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <img src={a2} style={{ marginLeft: "2px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('User Management')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    {makerPermissions2 === true ?
                                        <>
                                            <div className='mb-2'></div>
                                            <li className="roleMgmtClick" id='nav-items' onClick={this.roleMgmt}>
                                                <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                    <img src={a9} style={{ paddingLeft: "8px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "10px" }}>{t('Role Management')}</p>
                                                </a>
                                            </li>
                                            <li style={{ paddingLeft: "20px", display: "none" }} id='nav-items' className="roles">
                                                <Link to="/manageClients" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link">
                                                        <FaIcons.FaPeopleCarry style={{ color: "#222c70" }} />&nbsp;
                                                        <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Clients')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                <Link to="/assignRole" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link" style={{ cursor: "pointer" }}>
                                                        <FaIcons.FaUserCheck style={{ color: "#222c70" }} />&nbsp;
                                                        <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Roles')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                <Link to="/defineRole" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link">
                                                        <FaIcons.FaListAlt style={{ color: "#222c70" }} />&nbsp;
                                                        <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('View All Roles')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                <Link to="/managePermissions" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link">
                                                        <FaIcons.FaUserEdit style={{ color: "#222c70" }} />&nbsp;
                                                        <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Permissions')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                        </>
                                        : ""}
                                    {checkerViewPermissions === true ?
                                        <>
                                            <div className='mb-2'></div>
                                            <li className="" id='nav-items'>
                                                <Link to="/checkerPendingList" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                        <img src={a9} style={{ paddingLeft: "8px" }} />
                                                        <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Pending Operations')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                        </>
                                        : ""
                                    }
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/regFacEvlList" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <img src={a6} style={{ paddingLeft: "8px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "13px" }}>{t('Internal Facilitator/Evaluator')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    {adminPermissions === true &&
                                        <>
                                            <div className='mb-2'></div>
                                            <li className="" id='nav-items'>
                                                <Link to="/createOffice" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                        <FaIcons.FaBriefcase style={{ color: "#222c70" }} />
                                                        <p className="text text-dark" style={{ paddingLeft: "16px", marginTop: "-3px" }}>{t('Create Office')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                        </>
                                    }
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/BulkUploadUsers" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <img src={a7} style={{ paddingLeft: "8px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Bulk Registration')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/adminTransactions" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <img src={a8} style={{ paddingLeft: "8px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "13px" }}>{t("Escrow Passbook")}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    {/* <div className='mb-2'></div>
                                <li className="" id='nav-items'>
                                    <Link to="/productDefinitions" style={{ textDecoration: "none" }}>
                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                            <img src={a3} style={{ paddingLeft: "8px" }} />
                                            <p className="text text-dark" style={{ paddingLeft: "18px" }}>{t("Product List")}</p>
                                        </a>
                                    </Link>
                                </li> */}
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/auditTrails" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <img src={a5} style={{ paddingLeft: "13px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t("Audit Trail")}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/financialData" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <FaIcons.FaListUl style={{ color: "#222c70" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "20px", marginTop: "-5px" }}>{t("Operational Revenue Report")}</p>
                                                {/* <p className="text text-dark" style={{ paddingLeft: "20px", marginTop: "-5px" }}>{t("Platform Revenue Report")}</p> */}
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/partnerEarnings" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <FaIcons.FaListAlt style={{ color: "#222c70" }} />&nbsp;
                                                <p className="text text-dark" style={{ paddingLeft: "16px", marginTop: "-4px" }}>{t('Partner Earnings')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/pmPerformance" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <img src={a2} style={{ paddingLeft: "8px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "24px" }}>{t('Partner Performance')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                </ul> :
                                pmAdminType === "pmAdmin" ?
                                    <ul className="navbar-nav">
                                        <li className="" id='nav-items'>
                                            <Link to="/landing" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                    <img src={a1} style={{ paddingLeft: "12px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "10px" }}>{t('Home')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/userManagement" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                    <img src={a2} style={{ marginLeft: "2px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('User Management')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        {makerPermissions2 === true ?
                                            <>
                                                <div className='mb-2'></div>
                                                <li className="roleMgmtClick" id='nav-items' onClick={this.roleMgmt}>
                                                    <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                        <img src={a9} style={{ paddingLeft: "8px" }} />
                                                        <p className="text text-dark" style={{ paddingLeft: "10px" }}>{t('Role Management')}</p>
                                                    </a>
                                                </li>
                                                <li style={{ paddingLeft: "20px", display: "none" }} id='nav-items' className="roles">
                                                    <Link to="/manageClients" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link">
                                                            <FaIcons.FaPeopleCarry style={{ color: "#222c70" }} />&nbsp;
                                                            <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Clients')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                    <Link to="/assignRole" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link" style={{ cursor: "pointer" }}>
                                                            <FaIcons.FaUserCheck style={{ color: "#222c70" }} />&nbsp;
                                                            <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Roles')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                    <Link to="/defineRole" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link">
                                                            <FaIcons.FaListAlt style={{ color: "#222c70" }} />&nbsp;
                                                            <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('View All Roles')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                    <Link to="/managePermissions" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link">
                                                            <FaIcons.FaUserEdit style={{ color: "#222c70" }} />&nbsp;
                                                            <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Permissions')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                            </>
                                            : ""}
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/regFacEvlList" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                    <img src={a6} style={{ paddingLeft: "8px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "13px" }}>{t('Facilitator Approval')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        {checkerViewPermissions === true ?
                                            <>
                                                <div className='mb-2'></div>
                                                <li className="" id='nav-items'>
                                                    <Link to="/checkerPendingList" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                            <img src={a9} style={{ paddingLeft: "8px" }} />
                                                            <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Pending Operations')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                            </>
                                            : ""
                                        }
                                        {adminPermissions === true &&
                                            <>
                                                <div className='mb-2'></div>
                                                <li className="" id='nav-items'>
                                                    <Link to="/createOffice" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                            <FaIcons.FaBriefcase style={{ color: "#222c70" }} />
                                                            <p className="text text-dark" style={{ paddingLeft: "16px", marginTop: "-3px" }}>{t('Create Office')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                            </>
                                        }
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/BulkUploadUsers" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                    <img src={a7} style={{ paddingLeft: "8px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Bulk Registration')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/partnerEarnings" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                    <FaIcons.FaListAlt style={{ color: "#222c70" }} />&nbsp;
                                                    <p className="text text-dark" style={{ paddingLeft: "16px", marginTop: "-4px" }}>{t('Partner Earnings')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                    </ul> : ""
                            }
                            {pmAdminType === "superAdmin" ?
                                <ul className="navbar-nav">
                                    <li className="" id='nav-items'>
                                        <Link to="/landing" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <img src={a1} style={{ paddingLeft: "12px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "10px" }}>{t('Home')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/pmManagement" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <FaIcons.FaUsersCog style={{ color: "#222c70" }} />&nbsp;
                                                <p className="text text-dark" style={{ paddingLeft: "10px", marginTop: "-4px" }}>{t('Partner Management')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    {makerPermissions2 === true ?
                                        <>
                                            <div className='mb-2'></div>
                                            <li className="roleMgmtClick" id='nav-items' onClick={this.roleMgmt}>
                                                <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                    <img src={a9} style={{ paddingLeft: "8px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "10px" }}>{t('Role Management')}</p>
                                                </a>
                                            </li>
                                            <li style={{ paddingLeft: "20px", display: "none" }} id='nav-items' className="roles">
                                                <Link to="/manageClients" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link">
                                                        <FaIcons.FaPeopleCarry style={{ color: "#222c70" }} />&nbsp;
                                                        <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Clients')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                <Link to="/assignRole" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link" style={{ cursor: "pointer" }}>
                                                        <FaIcons.FaUserCheck style={{ color: "#222c70" }} />&nbsp;
                                                        <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Roles')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                <Link to="/defineRole" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link">
                                                        <FaIcons.FaListAlt style={{ color: "#222c70" }} />&nbsp;
                                                        <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('View All Roles')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                <Link to="/managePermissions" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link">
                                                        <FaIcons.FaUserEdit style={{ color: "#222c70" }} />&nbsp;
                                                        <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Permissions')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                        </>
                                        : ""}

                                    {/* <div className='mb-2'></div>
                                <li className="" id='nav-items'>
                                    <Link to="/regFacEvlList" style={{ textDecoration: "none" }}>
                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                            <FaIcons.FaTasks style={{ color: "#222c70" }} />&nbsp;
                                            <p className="text text-dark" style={{ paddingLeft: "10px", marginTop: "-4px" }}>{t('Facilitator/Evaluator List')}</p>
                                        </a>
                                    </Link>
                                </li> */}
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px", cursor: "not-allowed" }} disabled>
                                                {/* <FaIcons.FaMailBulk style={{ color: "#222c70" }} />&nbsp; */}
                                                <FaIcons.FaMailBulk style={{ color: "grey" }} />&nbsp;
                                                <p className="text text-grey" style={{ paddingLeft: "10px", marginTop: "-4px" }}>{t('Email Configuration')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px", cursor: "not-allowed" }} disabled>
                                                {/* <FaIcons.FaHotel style={{ color: "#222c70" }} />&nbsp; */}
                                                <FaIcons.FaHotel style={{ color: "grey" }} />&nbsp;
                                                <p className="text text-grey" style={{ paddingLeft: "10px", marginTop: "-4px" }}>{t('Bank Configuration')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    {/* <div className='mb-2'></div>
                                <li className="" id='nav-items'>
                                    <Link style={{ textDecoration: "none" }}>
                                        <a className="nav-link" href="#" style={{ height: "35px", cursor: "not-allowed" }} disabled>
                                            <FaIcons.FaDatabase style={{ color: "#222c70" }} />&nbsp;
                                            <p className="text text-dark" style={{ paddingLeft: "10px", marginTop: "-4px" }}>{t('Data Backup')}</p>
                                        </a>
                                    </Link>
                                </li> */}

                                </ul> :
                                ""
                            }
                        </div>
                    </div>
                </div>

            </nav>
        )
    }
}

export default withTranslation()(AdminSidebar)
