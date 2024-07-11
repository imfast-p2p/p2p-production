import React, { Component } from 'react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import SystemUserSidebar from './SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { CP_VERSION } from '../assets/baseURL';
//import wallet from '../assets/wallet-dashboard.gif';
import './SysUserDashboard.css';
import { FaBars, FaRegEdit, FaRegListAlt, FaMoneyCheck, FaEnvelopeOpenText } from "react-icons/fa";
import welcomeimg from '../assets/welcomeface2.png';
import * as FaIcons from "react-icons/fa";
import editRole from '../assets/editRole.png';
import { BASEURL } from '../assets/baseURL';
import resetPw from '../assets/pwexpired.png';
import { confirmAlert } from 'react-confirm-alert';

var enfPwMsg = "";
var lastLoginTime = "";
var pdfData;

export class SysUserDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            regsysuserid: sessionStorage.getItem('userID'),
            regasutype: "",
            rbiquaterDate: "",

            pmType: "",
            partnerName: "",
            isRole: [],

            noofboronboarded: "",
            totdisbursementamt: "",
            totnoofloanaccounts: "",
        }
    }

    componentDidMount() {
        console.log(sessionStorage.getItem("userType"))
        // this.RbiReportResponse()
        lastLoginTime = sessionStorage.getItem('lastLoginTime');
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            if (this.props.location.frompath == "login") {
                var propsLocation = this.props.location.state.enforcePassData;
                console.log(propsLocation.enforcePasswd, propsLocation.enforcePassMsg);

                var enfprcePwMsg = propsLocation.enforcePassMsg;
                console.log("Check frompath" + enfprcePwMsg)

                if (enfprcePwMsg && enfprcePwMsg.trim() !== "") {
                    enfPwMsg = enfprcePwMsg;
                    $("#passwordExpModal").click();
                }
            }

            if (sessionStorage.getItem('pmDefault') === "0") {
                this.setState({ pmType: "pmSystemUser" }); // Update state using setState
                this.getPmPerformance();
            } else {
                this.setState({ pmType: "platformSysUser" }); // Update state using setState
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
                    // Log the state after it's updated to verify the change
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


    }
    changePw = () => {
        window.location = "/changePassword";
        // // this.props.history.push("/changePassword");
        // $("#changePwd").click()
    }
    viewContent = (tabs, event) => {
        if (tabs.key === "QTR_RPT") {
            event.preventDefault();
            event.stopPropagation();
            $("#consentModal").click();
        } else {
            // Handle other links or navigation logic here
        }
    }
    viewQuarterlyReport = () => {
        $("#consentModal").click();
    }
    rbiquaterDate = (e) => {
        this.setState({ rbiquaterDate: e.target.value })
    }
    cancelRbiResponse = () => {
        this.setState({ rbiquaterDate: '' })
        console.log(this.state.rbiquaterDate)
        document.getElementById('rbiQtDate').value = '';
    }
    RbiReportResponse = () => {
        fetch(BASEURL + '/lms/rbiquarterlyloansreport', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                qenddate: this.state.rbiquaterDate,
                format: "PDF"
            })
        })
            .then(response => {
                console.log(response);
                return response.blob();
            })
            .then((response) => {
                console.log(response)
                $("#exampleModalCenter1").modal('hide');
                $("#launchColl").click();
                console.log('Response:', response)
                var collFile = new Blob([(response)], { type: 'application/pdf' });
                console.log(collFile);
                var collfileURL = URL.createObjectURL(collFile);
                console.log(collfileURL);
                document.getElementsByClassName('PDFdoc')[0].src = collfileURL + "#zoom=100";
                this.setState({ rbiquaterDate: '' })
                document.getElementById('rbiQtDate').value = '';

                pdfData = collFile;

            })
            .catch((error) => {
                console.log(error);

            })
    }
    openPDF = (response) => {
        $("#exampleModalCenter1").modal('hide');
        $("#launchColl").click();
        console.log('Response:', response)
        const pdfContent = response;
        const pdfDataUri = `data:application/pdf;base64,${btoa(pdfContent)}`;
        document.getElementsByClassName('PDFdoc')[0].src = pdfDataUri + "#zoom=100";

        // var collFile = new Blob([(response)], { type: 'application/pdf' });
        // console.log(collFile);
        // var collfileURL = URL.createObjectURL(collFile);
        // console.log(collfileURL);
        // document.getElementsByClassName('PDFdoc')[0].src = collfileURL + "#zoom=100";

        this.setState({ rbiquaterDate: '' })
        document.getElementById('rbiQtDate').value = '';
    }
    registerModal = () => {
        $("#registerFacEVModal").click();
    }
    regasUtype = (event) => {
        this.setState({ regasutype: event.target.value })
        console.log(event.target.value);
    }

    regAsFacEvl = (event) => {
        fetch(BASEURL + '/lsp/regsysuserasfaceval', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                regsysuserid: sessionStorage.getItem('userID'),
                regasutype: parseInt(this.state.regasutype)
            })
        }).then((Response) => {
            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    alert(resdata.message)
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    handleOpenEmailClient = () => {
        console.log(pdfData)
        const mailtoLink = `mailto:?subject=Attached%20PDF&body=See%20attached%20PDF&attachment=${encodeURIComponent(pdfData)}`;
        window.location.href = mailtoLink;

        // const reader = new FileReader();
        // reader.onload = () => {
        //     const dataURL = reader.pdfData;

        //     // Construct mailto link with embedded PDF data
        //     const mailtoLink = `mailto:?subject=Attached%20PDF&body=See%20attached%20PDF&attachment=${encodeURIComponent(dataURL)}`;

        //     // Open default email client
        //     window.location.href = mailtoLink;
        // };
    };

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const { t } = this.props
        const user = sessionStorage.getItem('userID');

        const { pmType } = this.state;
        console.log(pmType, this.state.noofboronboarded
            , this.state.totdisbursementamt, this.state.totnoofloanaccounts)
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc", marginTop: "-10px" }}>
                <SystemUserSidebar />
                <div className="main-content container-fluid mt-2">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" style={{ marginLeft: "-20px" }}>
                            <button onClick={() => { this.handleChange() }} className="btn navbar-dark navbar-toggler" id="menu-toggle"><FaBars style={{ height: "25px", width: "40px" }} /></button>
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
                                                {pmType == "pmSystemUser" ?
                                                    ` ${(sessionStorage.getItem("userID"))}`
                                                    : `${sessionStorage.getItem("userID")}`}
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

                    {/*PM System User*/}
                    {pmType === "pmSystemUser" ?
                        (<>
                            <div class="row" style={{ marginTop: "-15px" }}>
                                <div class="col-md-3" >
                                    <Link to="/facEvlList" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(254,192,48,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaList style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Facilitator Lists')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" >
                                    <Link to="/suspenceTransaction" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-3 mb-3" style={{ height: "80px", borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(23,182,113,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Suspense Transaction')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" >
                                    <Link to="/kycVerification" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(21,162,183,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaVideo style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('KYC Verification')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                {/* <div class="col-md-3" >
                                    <Link to="/loanMonitoring" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(18,44,84,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaRegListAlt style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Loan Monitoring')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" >
                                    <Link to="/ovdPendingStatus" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(23,182,113,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Document Verification')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div> */}
                                <div class="col-md-3" >
                                    <Link to="/facReassign" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(253,89,26,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Facilitator Reassign')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            {sessionStorage.getItem("pmID") === "2" &&
                                (<>
                                    <div class="row" style={{ marginTop: "-20px" }}>
                                        <div class="col-md-3" >
                                            <Link to="/sysCusSupport" style={{ textDecoration: "none" }}>
                                                <div className="card shadow-sm p-3 mb-3" style={{ height: "80px", borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(18,44,84,1)", cursor: "pointer" }}>
                                                    <div className="row align-items-center">
                                                        <div className='col-2'>
                                                            <FaIcons.FaRegListAlt style={{ fontSize: "30px" }} />
                                                        </div>
                                                        <div className="col">
                                                            <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                                <p className="greeting m-0">{t('Grievance Management')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div class="col-md-3" >
                                            <Link to="/platformPsign" style={{ textDecoration: "none" }}>
                                                <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(23,166,242,1)", cursor: "pointer" }}>
                                                    <div className="row align-items-center">
                                                        <div className='col-2'>
                                                            <FaIcons.FaRegListAlt style={{ fontSize: "30px" }} />
                                                        </div>
                                                        <div className="col">
                                                            <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                                <p className="greeting m-0">{t('Platform Signing Documents')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div class="col-md-3" >
                                            <Link to="/ovdPendingStatus" style={{ textDecoration: "none" }}>
                                                <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(23,182,113,1)", cursor: "pointer" }}>
                                                    <div className="row align-items-center" style={{ paddingBottom: "8px", paddingTop: "7px" }}>
                                                        <div className='col-2'>
                                                            <FaIcons.FaRegListAlt style={{ fontSize: "30px" }} />
                                                        </div>
                                                        <div className="col">
                                                            <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                                <p className="greeting m-0">{t('Document Verification')}</p>
                                                                <p className="subtext m-0">{this.state.noofactiveloans}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div class="col-md-3" >
                                            <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(253,89,26,1)", cursor: "pointer" }} onClick={this.viewQuarterlyReport}>
                                                <div className="row align-items-center">
                                                    <div className='col-2' style={{ marginTop: "-19px" }}>
                                                        <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                                    </div>
                                                    <div className="col">
                                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                            <p className="greeting m-0">{t('Quarterly Loan Performance Report')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row" style={{ marginTop: "-20px" }}>
                                        <div class="col-md-3" style={{}}>
                                            <>
                                                <div className="card shadow-sm p-3 mb-3" style={{ height: "80px", borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(18,44,84,1)", cursor: "pointer" }}>
                                                    <div className="row align-items-center">
                                                        <div className='col-2'>
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
                                            </>
                                        </div>
                                        <div class="col-md-3" style={{}}>
                                            <>
                                                <div className="card shadow-sm p-3 mb-3" style={{ height: "80px", borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(128, 52, 5)", cursor: "default" }}>
                                                    <div className="row align-items-center">
                                                        <div className='col-2'>
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
                                            </>
                                        </div>
                                        <div class="col-md-3" style={{}}>
                                            <>
                                                <div className="card shadow-sm p-3 mb-3" style={{ height: "80px", borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(8, 168, 46)", cursor: "default" }}>
                                                    <div className="row align-items-center">
                                                        <div className='col-2'>
                                                            <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                                        </div>
                                                        <div className="col">
                                                            <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                                <p className="greeting m-0">{t('Disbursement Amount')}</p>
                                                                <p className="subtext m-0">{this.state.totdisbursementamt}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
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
                                    </div>
                                </>)}
                        </>
                        ) :
                        <>
                            <div class="row" style={{ marginTop: "-15px" }}>
                                <div class="col-md-3" >
                                    <Link to="/facEvlList" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(254,192,48,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaList style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Facilitator/ Evaluator Lists')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" >
                                    <Link to="/suspenceTransaction" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-3 mb-3" style={{ height: "80px", borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(23,182,113,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Suspense Transaction')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" >
                                    <Link to="/kycVerification" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(21,162,183,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaVideo style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('KYC Verification')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" >
                                    <Link to="/productDefinition" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(5,116,22,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center" style={{ paddingBottom: "8px", paddingTop: "8px" }}>
                                                <div className='col-2'>
                                                    <FaIcons.FaFileAlt style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Product Configuration')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div class="row" style={{ marginTop: "-15px" }}>
                                <div class="col-md-3" >
                                    <Link to="/sysCusSupport" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(18,44,84,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaRegListAlt style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Grievance Management')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" >
                                    <Link to="/platformPsign" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(23,166,242,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center">
                                                <div className='col-2'>
                                                    <FaIcons.FaRegListAlt style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Platform Signing Documents')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" >
                                    <Link to="/ovdPendingStatus" style={{ textDecoration: "none" }}>
                                        <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "rgb(23,182,113,1)", cursor: "pointer" }}>
                                            <div className="row align-items-center" style={{ paddingBottom: "8px", paddingTop: "7px" }}>
                                                <div className='col-2'>
                                                    <FaIcons.FaRegListAlt style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className="col">
                                                    <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                        <p className="greeting m-0">{t('Document Verification')}</p>
                                                        <p className="subtext m-0">{this.state.noofactiveloans}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div class="col-md-3" >
                                    <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(253,89,26,1)", cursor: "pointer" }} onClick={this.viewQuarterlyReport}>
                                        <div className="row align-items-center">
                                            <div className='col-2' style={{ marginTop: "-19px" }}>
                                                <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                            </div>
                                            <div className="col">
                                                <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                    <p className="greeting m-0">{t('Quarterly Loan Performance Report')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {/* {pmType === "pmSystemUser" ?
                        <div class="row" style={{ marginTop: "-15px" }}>
                            <div class="col-md-3" >
                                <Link to="/facEvlList" style={{ textDecoration: "none" }}>
                                    <div class="card" id="SyscardChange1" style={{ borderRadius: "16px", height: "80px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(254,192,48,1)", cursor: "pointer" }}>

                                        <div class="row card-body">
                                            <div className='col-2'>
                                                <FaIcons.FaList style={{ fontSize: "30px", color: "white" }} />
                                            </div>
                                            <div className='col' style={{ paddingLeft: "20px" }}>
                                                <h6 className='card-title' id="SyscardChangeT1" >{t('Facilitator Lists')}</h6>
                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            </div>
                            <div class="col-md-3" >
                                <Link to="/loanMonitoring" style={{ textDecoration: "none" }}>
                                    <div class="card" id="SyscardChange5" style={{ borderRadius: "16px", height: "80px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(18,44,84,1)" }}>
                                        <div class="row card-body">
                                            <div className='col-2'>
                                                <FaIcons.FaRegListAlt style={{ fontSize: "30px" }} />
                                            </div>
                                            <div className='col' style={{ paddingLeft: "20px" }}>
                                                <h6 className='card-title' id="SyscardChangeT8" >{t('Loan Monitoring')}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div class="col-md-3" >
                                <Link to="/ovdPendingStatus" style={{ textDecoration: "none" }}>
                                    <div class="card" id="SyscardChange6" style={{ borderRadius: "16px", height: "80px", backgroundColor: "RGBA(23,166,242,1)", color: "rgba(255,255,255,1)" }}>
                                        <div class="row card-body">
                                            <div className='col-2'>
                                                <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                            </div>
                                            <div className='col' style={{ paddingLeft: "20px" }}>
                                                <h6 className='card-title' id="SyscardChangeT10" >{t('Document Verification')}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div class="col-md-3" >
                                <Link to="/facReassign" style={{ textDecoration: "none" }}>
                                    <div class="card" id="SyscardChange7" style={{ borderRadius: "16px", height: "80px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(253,89,26,1)" }} onClick={this.viewContent}>
                                        <div class="row card-body">
                                            <div className='col-2'>
                                                <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                            </div>
                                            <div className='col' style={{ paddingLeft: "20px" }} >
                                                <h6 className='card-title' id="SyscardChangeT14"  >{t('Facilitator Reassign')}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div> :
                        pmType === "platformSysUser" ?
                            <>
                                <div class="row" style={{ marginTop: "-15px" }}>
                                    <div class="col-md-3" >
                                        <Link to="/facEvlList" style={{ textDecoration: "none" }}>
                                            <div class="card" id="SyscardChange1" style={{ borderRadius: "16px", height: "80px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(254,192,48,1)", cursor: "pointer" }}>
                                                <div class="row card-body">
                                                    <div className='col-2'>
                                                        <FaIcons.FaList style={{ fontSize: "30px", color: "white" }} />
                                                    </div>
                                                    <div className='col' style={{ paddingLeft: "20px" }}>
                                                        <h6 className='card-title' id="SyscardChangeT1" >{t('Facilitator/ Evaluator Lists')}</h6>
                                                    </div>
                                                </div>

                                            </div>
                                        </Link>
                                    </div>
                                    <div class="col-md-3" >
                                        <Link to="/suspenceTransaction" style={{ textDecoration: "none" }}>
                                            <div class="card" id="SyscardChange2" style={{ borderRadius: "16px", height: "80px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(23,182,113,1)", cursor: "pointer" }}>
                                                <div class="row card-body">
                                                    <div className='col-2'>
                                                        <FaIcons.FaMoneyCheck style={{ fontSize: "30px", color: "white" }} />
                                                    </div>
                                                    <div className='col' style={{ paddingLeft: "20px" }} >
                                                        <h6 className='card-title' id="SyscardChangeT2" >{t('Suspense Transaction')}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div class="col-md-3" >
                                        <Link to="/kycVerification" style={{ textDecoration: "none" }}>
                                            <div class="card" id="SyscardChange3" style={{ borderRadius: "16px", height: "80px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(21,162,183,1)", cursor: "pointer" }}>

                                                <div class="row card-body">
                                                    <div className='col-2'>
                                                        <FaIcons.FaVideo style={{ fontSize: "30px", color: "white" }} />
                                                    </div>
                                                    <div className='col' style={{ paddingLeft: "20px" }}>
                                                        <h6 className='card-title' id="SyscardChangeT3"  >KYC Verification</h6>
                                                    </div>
                                                </div>

                                            </div>
                                        </Link>
                                    </div>
                                    <div class="col-md-3" >
                                        <Link to="/productDefinition" style={{ textDecoration: "none" }}>
                                            <div class="card" id="SyscardChange4" style={{ borderRadius: "16px", height: "80px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(5,116,22,1)", cursor: "pointer" }}>

                                                <div class="row card-body">
                                                    <div className='col-2'>
                                                        <FaIcons.FaFileAlt style={{ fontSize: "30px", color: "white" }} />
                                                    </div>
                                                    <div className='col' style={{ paddingLeft: "20px" }} >
                                                        <h6 className='card-title' id="SyscardChangeT4"  >Product Configuration</h6>
                                                    </div>
                                                </div>

                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div class="row" style={{ marginTop: "-15px" }}>
                                    <div class="col-md-3" >
                                        <Link to="/sysCusSupport" style={{ textDecoration: "none" }}>
                                            <div class="card" id="SyscardChange5" style={{ borderRadius: "16px", height: "80px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(18,44,84,1)" }}>
                                                <div class="row card-body">
                                                    <div className='col-2'>
                                                        <FaIcons.FaRegListAlt style={{ fontSize: "30px" }} />
                                                    </div>
                                                    <div className='col' style={{ paddingLeft: "20px" }}>
                                                        <h6 className='card-title' id="SyscardChangeT8" >{t('Grievance Management')}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div class="col-md-3" >
                                        <Link to="/platformPsign" style={{ textDecoration: "none" }}>
                                            <div class="card" id="SyscardChange6" style={{ borderRadius: "16px", height: "80px", backgroundColor: "RGBA(23,166,242,1)", color: "rgba(255,255,255,1)" }}>
                                                <div class="row card-body">
                                                    <div className='col-2'>
                                                        <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                                    </div>
                                                    <div className='col' style={{ paddingLeft: "20px" }}>
                                                        <h6 className='card-title' id="SyscardChangeT10" >{t('Platform Signing Documents')}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div class="col-md-3" >
                                        <Link to="/ovdPendingStatus" style={{ textDecoration: "none" }}>
                                            <div class="card" id="SyscardChange8" style={{ borderRadius: "16px", height: "80px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(23,182,113,1)" }}>
                                                <div class="row card-body">
                                                    <div className='col-2'>
                                                        <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                                    </div>
                                                    <div className='col' style={{ paddingLeft: "20px" }}>
                                                        <h6 className='card-title' id="SyscardChangeT12"  >{t('Document Verification')}</h6>
                                                        <h5 className='card-text' id="SyscardChangeT13" style={{ marginTop: "-5px" }}>{this.state.noofactiveloans}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div class="col-md-3" >
                                        <div class="card" id="SyscardChange7" style={{ borderRadius: "16px", height: "80px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(253,89,26,1)" }} onClick={this.viewContent}>
                                            <div class="row card-body">
                                                <div className='col-2'>
                                                    <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                                </div>
                                                <div className='col' style={{ paddingLeft: "20px" }} >
                                                    <h6 className='card-title' id="SyscardChangeT14"  >{t('Quarterly Loan Performance Report')}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </> : ""
                    } */}

                    {/* Register as Fac/Evl List */}
                    {pmType === "platformSysUser" ?
                        (<div className='row' style={{ marginTop: "-10px", marginBottom: "5px" }}>
                            <div className='col'>
                                <div className="card shadow-sm p-3 mb-3" style={{ fontSize: "15px", cursor: "default", borderRadius: "15px", backgroundColor: "RGBA(255,247,229,1)" }}>
                                    <div class="card-header" style={{ backgroundColor: "RGBA(255,168,0,1)", width: "110.8%", height: "28px", marginTop: "-17px", marginLeft: "-17.5px", borderRadius: "15px 15px 0 0", color: "white", fontWeight: "bold" }}>
                                        <p style={{ marginTop: "-6px", textAlign: "center", marginLeft: "-70px" }}>{t('Register as Facilitator / Evaluator')}</p>
                                    </div>
                                    <div class="row card-body" style={{ backgroundColor: "RGBA(255,247,229,1)", width: "107.5%", marginLeft: "-12px", borderRadius: "0 0 15px 15px" }}>
                                        <div className='row justify-content-center'>
                                            <div className='col' style={{ textAlign: "center" }}>
                                                <button className='btn btn-sm text-white' style={{ backgroundColor: "RGBA(255,168,42,1)" }} onClick={this.registerModal}>
                                                    Register
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>) : ""}

                    {/* Register Modal */}
                    <button type="button" id='registerFacEVModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Register
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Register as Facilitator / Evaluator</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>User Type</p>
                                                    <select className='form-select' style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px" }} onChange={this.regasUtype}>
                                                        <option defaultValue>{t('Select Usert Type')}</option>
                                                        <option value="4">{t('Facilitator')}</option>
                                                        <option value="5">{t('Evaluator')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" onClick={this.regAsFacEvl}
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(0, 121, 191)" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quarterly Report Modal */}
                    <button id='consentModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter1">
                    </button>
                    <div className="modal fade" id="exampleModalCenter1" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <div className="modal-body" id='consentBody'>

                                    <div className='row mb-2'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Select Date</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Select Quarter End Date</p>
                                                    <input className='form-control' type='date' id='rbiQtDate' onChange={this.rbiquaterDate} style={{ marginTop: "-10px" }} />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.RbiReportResponse}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onClick={this.cancelRbiResponse}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Pdf preview */}
                    <button type="button" id='launchColl' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>

                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div className='modal-body'>
                                    <iframe src="" className="PDFdoc" type="application/pdf" style={{ overflow: "auto", height: "80vh", width: "100%" }}>

                                    </iframe>
                                    <div className='pt-2' style={{ textAlign: "end", paddingRight: "15px" }}>
                                        <button
                                            type="button" class="btn text-white btn-sm"
                                            style={{ backgroundColor: "rgb(23, 182, 113)" }}
                                            onClick={this.handleOpenEmailClient}
                                        ><FaEnvelopeOpenText />Mail</button>
                                        &nbsp;
                                        <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(0, 121, 191)" }}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password expiry */}
                    <button type="button" id='passwordExpModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3">
                        Password expiry modal
                    </button>

                    <div class="modal fade" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header" style={{ marginBottom: "-20px" }}>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <dvi class="modal-body" style={{ marginBottom: "-20px" }}>
                                    <img src={resetPw} style={{ width: "80px" }} />
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>{enfPwMsg}</p>
                                </dvi>
                                <div class="modal-footer">
                                    <button type="button" class="btn text-white"
                                        style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.changePw}>
                                        Change password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <button onClick={this.handleOpenEmailClient}>Open Email Client</button> */}

                    <div className="fixed">
                        <div className="footer">
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
            </div >
        )
    }
}

export default withTranslation()(SysUserDashboard)