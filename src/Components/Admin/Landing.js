import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import './Landing.css';
import { CP_VERSION } from '../assets/baseURL';
//import wallet from '../assets/wallet-dashboard.gif';
import { withTranslation } from 'react-i18next';
import { FaBars } from "react-icons/fa";
import welcomeimg from '../assets/welcomeface2.png';
import * as FaIcons from "react-icons/fa";
import walletimg from '../assets/icons/wallet.png'
import { confirmAlert } from "react-confirm-alert";
import batch from '../assets/batch.png';
import * as MdIcons from "react-icons/md";

var lastLoginTime = "";
class Landing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            partnerLists: [],
            commisionList: [],
            partnerName: "",
            partnerInfo: {},

            isRole: [],
            pmAdminType: "",

            noofboronboarded: "",
            totdisbursementamt: "",
            totnoofloanaccounts: "",

            maintenanceStatus: "",
            maintenanceReason: "",
            maintenanceValue: false
        }
    }

    componentDidMount() {
        lastLoginTime = sessionStorage.getItem('lastLoginTime');
        console.log(sessionStorage.getItem("userType"))

        // this.getAllCommisions();
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            //screen shrink
            window.addEventListener('resize', this.handleResize);
            this.handleResize();

            if (sessionStorage.getItem('sAdmin') === "1" && sessionStorage.getItem('pmDefault') === "1") {
                //Super Admin
                var maintenanceMode = sessionStorage.getItem("ismaintenanceOn");
                if (maintenanceMode) {
                    var boolValue = (maintenanceMode.toLowerCase() === "true");
                    console.log(boolValue)
                    this.setState({ maintenanceValue: boolValue })
                }
                this.setState({
                    pmAdminType: "superAdmin"
                })

            } else if (sessionStorage.getItem('pmDefault') === "0") {
                this.setState({ pmAdminType: "pmAdmin" })
                this.getPmPerformance();
                //this.getAllPartners();
            } else {
                this.setState({ pmAdminType: "0" })
                this.getPmPerformance();
                //this.getAllPartners();
            }

            var isRoles = sessionStorage.getItem('isRoles');
            console.log(isRoles);
            var isRolesArray = [];
            if (isRoles) {
                isRolesArray = isRoles.split(',');
            }
            console.log(isRolesArray);
            if (isRoles !== null && isRoles !== undefined) {
                this.setState({ isRole: isRolesArray }, () => {
                    console.log("Updated state isRole:", this.state.isRole);
                    this.getRolePermissions()
                });
            } else {
                console.log("isRoles is empty");
            }
        } else {
            window.location = '/login'
        }
    }
    getRolePermissions = () => {
        fetch(BASEURL + '/usrmgmt/getrolepermissions', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                roles: this.state.isRole
            })
        }).then((Response) => {
            return Response.json();
        }).then((resdata) => {
            console.log(resdata);
            if (resdata.status == "Success" || "SUCCESS" || "success") {
                console.log(resdata.msgdata);
                var data = JSON.stringify(resdata.msgdata);
                sessionStorage.setItem("rolePermData", data);
            } else {
                //alert(resdata.message)
            }
        })
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
                    this.setState({ partnerLists: resdata.msgdata })

                    // 
                    if (resdata.msgdata) {
                        resdata.msgdata.forEach(element => {
                            this.setState({ partnerName: element.partnername });
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
    getAllCommisions = () => {
        fetch(BASEURL + '/misreports/getallpartnerservicecommission', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        partnerCommLists: slice
                    })
                } else {
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
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click()
                    }
                }
            })
    }
    getPmPerformance = () => {
        fetch(BASEURL + '/lsp/getcurrentpmperformance', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Response:', response)
                return response.json();
            })//updated
            .then((resdata) => {
                if (resdata.status == 'Success' || 'SUCCESS' || 'success') {
                    console.log(resdata.msgdata);
                    var resData = resdata.msgdata;
                    resData.forEach(element => {
                        this.setState({ noofboronboarded: element.noofboronboarded });
                        this.setState({ totdisbursementamt: element.totdisbursementamt });
                        this.setState({ totnoofloanaccounts: element.totnoofloanaccounts });
                    });

                } else {
                    this.setState({ showLoader: false })
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
                                        window.location.reload();
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
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    handleResize = () => {
        console.log(window.innerWidth)
        if (window.innerWidth <= 685) {
            this.hideSideNav();
        } else {
            $(".component-to-toggle").show()
        }
    }
    maintenanceClick = () => {
        $("#maintenanceModal").click()
    }
    maintenanceStatus = (event) => {
        console.log(event.target.checked)
        if (event.target.checked === true) {
            this.setState({
                maintenanceStatus: "1",
                maintenanceValue: true
            })
        } else if (event.target.checked === false) {
            this.setState({
                maintenanceStatus: "0",
                maintenanceValue: false
            })
        }
    }
    maintenanceReason = (event) => {
        this.setState({ maintenanceReason: event.target.value })
    }
    setMaintenance = () => {
        fetch(BASEURL + '/usrmgmt/setmaintenancemode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                status: this.state.maintenanceStatus,
                reason: this.state.maintenanceReason
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    $("#exampleModal12").modal('hide')
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {

                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                } else {
                    $("#exampleModal12").modal('hide')
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    $("#exampleModal12").modal('show')
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }
            })
    }
    handleChange() {
        $(".component-to-toggle").show()
        $('.text').toggle();
        $("#Pinfo").toggle();
    }
    hideSideNav = () => {
        $(".component-to-toggle").hide();
    }
    render() {
        const { t } = this.props;
        const partnerName = sessionStorage.getItem('partnerName');
        console.log(partnerName)
        const user = sessionStorage.getItem('userID');
        const { partnerInfo } = this.state;
        console.log(partnerInfo)
        const { pmAdminType } = this.state;

        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <div className="component-to-toggle">
                    <AdminSidebar />
                </div>
                <div className="main-content container-fluid">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" style={{ marginLeft: "-20px" }}>
                            <button onClick={() => { this.handleChange() }} className="btn navbar-dark navbar-toggler" id="menu-toggle"><FaBars style={{ height: "25px", width: "30px" }} /></button>
                        </div>
                        <div className='col-4' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className="col-4" style={{ textAlign: "end" }}>
                            {lastLoginTime !== undefined && lastLoginTime !== null && lastLoginTime !== '' ?
                                <p style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(34, 44, 112)", fontSize: "15px" }}>{t('Last Login Time')}: <span style={{ fontWeight: "400" }}>{lastLoginTime}</span></p>
                                : ""
                            }
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: "-10px" }}>
                        <div className='col'>
                            <div className="card shadow-sm p-3 mb-3" id='commonCard-container'>
                                <div className="row align-items-center">
                                    <div className="col-4">
                                        <div className="card-content">
                                            <p className="greeting m-0">{t('Welcome ')},
                                                {pmAdminType === "superAdmin" ?
                                                    "Super Admin" :
                                                    pmAdminType === "pmAdmin" ?
                                                        <>{partnerName}</> : "Platform Admin"
                                                }
                                            </p>
                                            {lastLoginTime !== undefined && lastLoginTime !== null && lastLoginTime !== '' ? ""
                                                :
                                                <p className="subtext m-0">{t(`Welcome to the platform! Glad to have you here.`)}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-4">

                                    </div>
                                    <div className="col-4" style={{ textAlign: "end" }}>
                                        <div className="card-image">
                                            <img src={welcomeimg} alt="User waving" className="img-fluid" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {pmAdminType === "pmAdmin" ?
                        <>
                            <div class="row" style={{ marginTop: "-10px" }}>
                                <div class="col-md-3" style={{}}>
                                    <Link to="/userManagement" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(0, 102, 153)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaUsersCog style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('User Management')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" style={{}}>
                                    <Link to="/regFacEvlList" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(21,162,183,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Facilitator Approval')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" style={{}}>
                                    <Link to="/BulkUploadUsers" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(23,182,113,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaUsers style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Bulk Registration')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" style={{}}>
                                    <Link to="/userManagement" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(254,192,48,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaUsers style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Bulk Registration')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div class="row" style={{ marginTop: "-10px" }}>
                                <div class="col-md-3" style={{}}>
                                    <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(18,44,84,1)", cursor: "default" }}>
                                        <div className="row align-items-center">
                                            <div className='col-2' style={{ marginTop: "-19px" }}>
                                                <FaIcons.FaUsers style={{ fontSize: "30px" }} />
                                            </div>
                                            <div className="col">
                                                <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                    <p className="greeting m-0">{t('Borrowers Onboarded')}</p>
                                                    <p className="subtext m-0">{this.state.noofboronboarded}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3" style={{}}>
                                    <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(128, 52, 5)", cursor: "default" }}>
                                        <div className="row align-items-center">
                                            <div className='col-2' style={{ marginTop: "-19px" }}>
                                                <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                            </div>
                                            <div className="col">
                                                <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                    <p className="greeting m-0">{t('Total Loan Accounts')}</p>
                                                    <p className="subtext m-0">{this.state.totnoofloanaccounts}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3" style={{}}>
                                    <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(8, 168, 46)" }}>
                                        <div className="row align-items-center">
                                            <div className='col-2' style={{ marginTop: "-19px" }}>
                                                <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                            </div>
                                            <div className="col">
                                                <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                    <p className="greeting m-0">{t('Disbursement Amount')}</p>
                                                    <p className="subtext m-0">
                                                        {this.state.totdisbursementamt ? <span>
                                                            ₹ {parseFloat(this.state.totdisbursementamt).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </span> : "0"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3" style={{}}>
                                    <Link to="/partnerEarnings" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(31, 142, 207)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaMoneyBillAlt style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Partner Earnings')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            {/* Commission and charges */}
                            {/* <div className='row' style={{ marginLeft: "0.5px", marginTop: "-13px" }}>
                                <div class="card text-center" id="BescrowChange1" style={{ width: "98.5%", borderRadius: "15px", height: "160px", cursor: "default" }}>
                                    <div class="card-header" style={{ backgroundColor: "RGBA(255,168,0,1)", width: "110.8%", height: "40px", marginLeft: "-13.5px", borderRadius: "15px 15px 0 0", color: "white", fontWeight: "bold" }}>
                                        <h5 style={{ marginTop: "-6px" }}>Partner and Commission</h5>
                                    </div>
                                    <div class="row card-body" style={{ backgroundColor: "RGBA(255,247,229,1)", width: "107.5%", marginLeft: "-12px", borderRadius: "0 0 15px 15px" }}>
                                        <div className='col' id="BescrowChange2" style={{ textAlign: "end" }}>
                                            <img src={walletimg} style={{ fontSize: "40px" }} />
                                        </div>
                                        {Object.keys(partnerInfo).length !== 0 ?
                                            <div className='col-5' id="BescrowChange3">
                                             
                                                <div className='row'>
                                                    <div className='col'>
                                                        <h6 className='card-title' style={{ color: "#222C70" }}>Partner Name</h6>
                                                        <p className='card-title' style={{ color: "#222C70" }}>{partnerInfo.partnername}</p>
                                                    </div>
                                                    <div className='col'>
                                                        <h6 className='card-title' style={{ color: "#222C70" }}>Commission Earned</h6>
                                                        <p className='card-title' style={{ color: "#222C70" }}>
                                                            <FaIcons.FaRupeeSign style={{ height: "14px" }} />
                                                            {parseFloat(partnerInfo.commearned).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div> : ""
                                        }

                                        <div className='col'>

                                        </div>

                                    </div>

                                </div>
                            </div> */}
                        </>

                        : pmAdminType === "superAdmin" ?
                            <div class="row" style={{ marginTop: "-10px" }}>
                                <div class="col-md-3" style={{}}>
                                    <Link to="/pmManagement" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(0, 102, 153)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaUsersCog style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Partner Management')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" style={{}}>
                                    <Link to="/defineRole" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(21,162,183,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaUsersCog style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Role Management')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" style={{}}>
                                    <Link style={{ textDecoration: "none" }} disabled>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(179, 134, 0)", cursor: "pointer" }}>
                                            <div className="row align-items-center" >
                                                <div className='col-2'>
                                                    <FaIcons.FaListAlt style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Email Configuration')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" style={{}}>
                                    <Link style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" onClick={this.maintenanceClick} style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(254,192,48,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <MdIcons.MdAdminPanelSettings style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Maintenance Mode')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            :
                            <>
                                <div class="row" style={{ marginTop: "-10px" }}>
                                    <div class="col-md-3" >
                                        <Link to="/userManagement" style={{ textDecoration: "none" }}>
                                            <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(0, 102, 153)", cursor: "pointer" }}>
                                                <div className="row align-items-center">
                                                    <div className='col-2'>
                                                        <FaIcons.FaUsersCog style={{ fontSize: "30px" }} />
                                                    </div>
                                                    <div className="col">
                                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                            <p className="greeting m-0">{t('User Management')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div class="col-md-3" >
                                        <Link to="/userManagement" style={{ textDecoration: "none" }}>
                                            <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(179, 134, 0)", cursor: "pointer" }}>
                                                <div className="row align-items-center">
                                                    <div className='col-2'>
                                                        <FaIcons.FaListAlt style={{ fontSize: "30px", color: "white" }} />
                                                    </div>
                                                    <div className="col">
                                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                            <p className="greeting m-0">{t('View All Roles')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div class="col-md-3" >
                                        <Link to="/customerSupport" style={{ textDecoration: "none" }}>
                                            <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(21,162,183,1)", cursor: "pointer" }}>
                                                <div className="row align-items-center">
                                                    <div className='col-2'>
                                                        <FaIcons.FaMicrophone style={{ fontSize: "30px", color: "white" }} />
                                                    </div>
                                                    <div className="col">
                                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                            <p className="greeting m-0">{t('Customer Support')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div class="col-md-3" >
                                        <Link to="/createOffice" style={{ textDecoration: "none" }}>
                                            <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(5,116,22,1)", cursor: "pointer" }}>
                                                <div className="row align-items-center">
                                                    <div className='col-2'>
                                                        <FaIcons.FaList style={{ fontSize: "30px", color: "white" }} />
                                                    </div>
                                                    <div className="col">
                                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                            <p className="greeting m-0">{t('Create Office')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div class="row" style={{ marginTop: "-10px",marginBottom:"20px" }}>
                                    <div class="col-md-3" >
                                        <Link to="/regFacEvlList" style={{ textDecoration: "none" }}>
                                            <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(18,44,84,1)", cursor: "pointer" }}>
                                                <div className="row align-items-center">
                                                    <div className='col-2'>
                                                        <FaIcons.FaTasks style={{ fontSize: "30px", color: "white" }} />
                                                    </div>
                                                    <div className="col">
                                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                            <p className="greeting m-0">{t('Facilitator/ Evaluator List')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div class="col-md-3" >
                                        <Link to="/BulkUploadUsers" style={{ textDecoration: "none" }}>
                                            <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(23,182,113,1)", cursor: "pointer" }}>
                                                <div className="row align-items-center">
                                                    <div className='col-2'>
                                                        <FaIcons.FaUsers style={{ fontSize: "30px", color: "white" }} />
                                                    </div>
                                                    <div className="col">
                                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                            <p className="greeting m-0">{t('Bulk Registration')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div class="col-md-3" >
                                        <Link to="/adminTransactions" style={{ textDecoration: "none" }}>
                                            <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(0, 128, 128)", cursor: "pointer" }}>
                                                <div className="row align-items-center">
                                                    <div className='col-2'>
                                                        <FaIcons.FaAddressCard style={{ fontSize: "30px", color: "white" }} />
                                                    </div>
                                                    <div className="col">
                                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                            <p className="greeting m-0">{t('Escrow Passbook')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div class="col-md-3" >
                                        <Link to="/financialData" style={{ textDecoration: "none" }}>
                                            <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(254,192,48,1)", cursor: "pointer" }}>
                                                <div className="row align-items-center">
                                                    <div className='col-2'>
                                                        <FaIcons.FaProductHunt style={{ fontSize: "30px", color: "white" }} />
                                                    </div>
                                                    <div className="col">
                                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                            <p className="greeting m-0">{t('Financial Data')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </>
                    }

                    {/*  */}
                    <button type="button" id="maintenanceModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal12" style={{ display: "none" }}>
                        Maintenance Modal
                    </button>
                    <div class="modal fade" id="exampleModal12" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row mb-2'>
                                        <div className='col-10'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><MdIcons.MdAdminPanelSettings style={{ fontSize: "x-large" }} /> &nbsp;Enable/ Disable Maintenance Mode</p>
                                            <hr style={{ width: "70px", marginTop: "-12px", backgroundColor: "rgb(5, 54, 82)" }} />
                                        </div>
                                        <div className="col-2">
                                            <FaIcons.FaTimesCircle type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ color: "rgb(5, 54, 82)", fontSize: "18px" }} />
                                        </div>
                                    </div>
                                    <div className="mb-2" style={{ marginTop: "-10px", }}>
                                        <div className="row">
                                            <div className="col-lg-12 col-md-10 col-sm-12">
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>
                                                    <div className='row'>
                                                        <div className='col-lg-4 col-md-8 col-sm-12'>
                                                            <p style={{ width: "max-content" }}>
                                                                Maintenance Mode *
                                                            </p>
                                                        </div>
                                                        <div className='col'>
                                                            <div class="form-check form-switch" style={{ marginTop: "-8px" }}>
                                                                <input class="form-check-input" type="checkbox" role="switch" checked={this.state.maintenanceValue === true}
                                                                    id="flexSwitchCheckDefault" onChange={this.maintenanceStatus} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row' style={{ marginTop: "-16px" }}>
                                            <div className="col-lg-12 col-md-10 col-sm-12">
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Reason *</p>
                                                <textarea type="text" class="form-control" onChange={this.maintenanceReason} rows={3} cols={30} maxLength={255}
                                                    placeholder="Reason" style={{ marginTop: "-10px" }}>
                                                </textarea>
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col" style={{ textAlign: "center" }}>
                                                <button type="button" class="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setMaintenance}>Submit</button>
                                                &nbsp;
                                                <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="fixed">
                        <div className="footer ">
                            <div className="footer-body">
                                <div className="row">
                                    <div className="bg-dark">
                                        <h5 className="mb-0"></h5>
                                        <span className="mb-0"></span>
                                        <p className="m-3 text-light">{CP_VERSION} </p>
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

export default withTranslation()(Landing)
