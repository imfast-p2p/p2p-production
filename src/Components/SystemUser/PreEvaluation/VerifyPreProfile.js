import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from "../SystemUserSidebar";
import FacilitatorSidebar from '../../../SidebarFiles/FacilitatorSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaFileDownload } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import openIt from '../../assets/AdminImg/openit.png'
import us from '../../assets/AdminImg/pro.png';
import editRole from '../../assets/editRole.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import XMLParser from "react-xml-parser";
import jsPDF from "jspdf";
import Loader from '../../Loader/Loader';

export class VerifyPreProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resMsg: "",

            memmId: "",
            jlgId: "",
            groupdetails: {},
            personalDetailList: [],
            addressDetails: [],
            permanentaddress: {},
            presentaddress: {},

            //Statement list
            loanStmt: [],
            msgResponse: {},
            memberDetails: [],
            updateStatus: "",
            updateComment: "",
            overallData: {},
            loanReqStatus: {},
            consentList: [],
            showLoader: false,
            loginType: sessionStorage.getItem('userType')
        }
    }
    componentDidMount = () => {
        console.log(sessionStorage.getItem("preData"));
        var data = sessionStorage.getItem("preData");
        var parsedData = JSON.parse(data);
        console.log(parsedData.List);

        var overallData = parsedData.List;;
        this.setState({ overallData: parsedData.List })
        console.log(overallData.memmid)
        this.getLoanRequestDetails(overallData.loanrequestnumber)
        $("#setPreEvlBtn").prop('disabled', true)
    }
    getLoanRequestDetails = (loanreqnumber) => {
        fetch(BASEURL + '/lsp/getloanrequeststatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: loanreqnumber
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    var memmID = resdata.msgdata.memmid;
                    var JlgId = resdata.msgdata.jlgid;
                    var loanConsent = resdata.msgdata.loanconsentsignerinfo;

                    this.setState({
                        loanReqStatus: resdata.msgdata,
                        consentList: loanConsent,

                        memmId: memmID,
                        jlgId: JlgId
                    })


                } else {

                    console.log(resdata.message)
                }
            })
    }
    viewLoanReqDocu = () => {
        fetch(BASEURL + '/lms/borr/getloanagreement?loanreqno=' + sessionStorage.getItem('loanreqno') + "&doctype=2", {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
            },
            responseType: 'arraybuffer',
            dataType: 'blob'
        })
            .then(response => {
                return response.blob();
            })
            .then((response) => {
                console.log('Response:', response)
                var file = new Blob([(response)], { type: 'application/pdf' });
                console.log(file);
                var fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                document.getElementsByClassName('PDFdoc')[0].src = fileURL + "#zoom=100";
                $("#launchColl").click();
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getgroupFullDetails = () => {
        fetch(BASEURL + "/usrmgmt/jlg/getgroupfullinfo?groupId=" + this.state.jlgId, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success") {
                    this.setState({ msgResponse: resdata.msgdata })
                    this.setState({ memberDetails: resdata.msgdata.memberdetails })
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
            .catch(err => {
                console.log(err.message)
            })
    }
    getPersonalDetails = () => {
        fetch(BASEURL + '/usrmgmt/getpersonaldetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                memmid: this.state.memmId,
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({ personalDetailList: resdata.msgdata.attributes })
                }
                else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
    }
    getAddressDetails = () => {
        fetch(BASEURL + '/usrmgmt/getaddressdetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                memmid: this.state.memmId,
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    var responseAddress = resdata.msgdata;
                    const length = responseAddress.length;
                    this.setState({ addressDetails: resdata.msgdata })
                    this.state.addressDetails.forEach((element) => {
                        if (element.addresstype === 1) {
                            this.setState({ permanentaddress: element })
                        } else if (element.addresstype === 2) {
                            this.setState({ presentaddress: element })
                        }
                    })
                    console.log(this.state.permanentaddress,
                        this.state.presentaddress)
                }
                else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
    }
    getDocumentDetails = () => {
        fetch(BASEURL + '/usrmgmt/getdocument?jlgid=' + this.state.jlgId, {
            method: 'Get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then(response => {
            return response.blob();
        })
            .then((response) => {
                $("#launchColl").click();
                console.log('Response:', response)
                var collFile = new Blob([(response)], { type: 'application/pdf' });
                console.log(collFile);
                var collfileURL = URL.createObjectURL(collFile);
                console.log(collfileURL);
                document.getElementsByClassName('PDFdoc')[0].src = collfileURL + "#zoom=100";
            })
            .catch((error) => {
                console.log(error)
            })
        // .then((Response) => Response.json())
        //     .then((resdata) => {
        //         if (resdata.status === 'Success') {


        //         } else {
        //             this.setState({ resMsg: resdata.message })
        //             $("#commonModal").click()
        //         }
        //     })
    }
    getLoanStmt = () => {
        fetch(BASEURL + '/usrmgmt/getstmtslist?loanreqno=' + sessionStorage.getItem('loanreqno'), {
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
                    this.setState({ loanStmt: resdata.msgdata });
                } else {
                    // alert("Issue: " + resdata.message);
                }
            })
    }
    downloadStmt = (stmtid, filename) => {
        console.log(stmtid);
        sessionStorage.setItem("stmtid", stmtid);
        this.bankStatements(stmtid, filename);
    }
    bankStatements = (stmtid, filename) => {
        console.log(filename)
        const extension = filename.split('.').pop();
        console.log(extension);
        if (extension == "xml") {
            fetch(BASEURL + "/usrmgmt/downloadstmt?stmtid=" + stmtid + "&loanreqno=" + sessionStorage.getItem('loanreqno'), {
                headers: {
                    'Authorization': "Bearer " + sessionStorage.getItem('token'),
                },
            })
                .then(response => {
                    return response.text();
                })
                .then((response) => {
                    $("#launchColl").click();
                    console.log('Response:', response)

                    var jsonDataFromXml = new XMLParser().parseFromString(response);
                    console.log(jsonDataFromXml)
                    var jsonLists = [];
                    jsonLists = jsonDataFromXml.children;
                    console.log(jsonLists);

                    var transactionList = [];
                    var transactionAttri = {};
                    var StartDate;
                    var EndDate;
                    jsonLists.forEach(element => {
                        console.log(element);
                        console.log(element.name);
                        if (element.name == "Transactions") {
                            transactionList = element.children;
                            transactionAttri = element.attributes;

                            StartDate = transactionAttri.startDate;
                            EndDate = transactionAttri.endDate;
                            console.log(transactionList);
                            console.log(transactionAttri);
                            console.log(StartDate, EndDate);
                        }
                    });
                    var profileList = [];
                    var profilechildrenList = [];
                    var profileAtri = {};
                    jsonLists.forEach(element => {
                        console.log(element);
                        console.log(element.name);
                        if (element.name == "Profile") {
                            profileList = element.children;
                            profileList.forEach(e => {
                                console.log(e);
                                profilechildrenList = e.children;
                                console.log(profilechildrenList);
                                profilechildrenList.forEach(e => {
                                    console.log(e);
                                    if (e.name == "Holder") {
                                        profileAtri = e.attributes;
                                        console.log(profileAtri)
                                    }
                                })
                            })
                            console.log(profileList);
                        }
                    });
                    const unit = "pt";
                    const size = "A4"; // Use A1, A2, A3 or A4
                    const orientation = "portrait"; // portrait or landscape
                    const marginLeft = 40;
                    const doc = new jsPDF(orientation, unit, size);
                    doc.setFontSize(13);

                    const title1 = "Borrower Statement";
                    const heading1 = "Name: " + profileAtri.name;
                    const heading2 = "Date : From " + StartDate + " to " + EndDate;
                    const title = title1 + '\n' + heading1 + '\n' + heading2;
                    const headers = [["Amount", "Current Balance", "Reference Number", "TXN. Type", "Date"]];

                    const data = transactionList.map(list => [list.attributes.amount,
                    list.attributes.currentBalance,
                    list.attributes.reference,
                    list.attributes.type,
                    list.attributes.valueDate
                    ]);

                    let content = {
                        startY: 100,
                        head: headers,
                        body: data
                    };
                    doc.text(title, marginLeft, 40);
                    doc.autoTable(content);

                    var collFile = new Blob([(doc.output('blob'))], { type: 'application/pdf' });
                    console.log(collFile);
                    var collfileURL = URL.createObjectURL(collFile);
                    console.log(collfileURL);
                    document.getElementsByClassName('PDFdoc')[0].src = collfileURL + "#zoom=100";
                })
                .catch((error) => {
                    console.log(error)
                })
        } else if (extension == "pdf") {
            fetch(BASEURL + "/usrmgmt/downloadstmt?stmtid=" + stmtid + "&loanreqno=" + sessionStorage.getItem('loanreqno'), {
                headers: {
                    'Authorization': "Bearer " + sessionStorage.getItem('token'),
                },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
                .then(response => {
                    return response.blob();
                })
                .then((response) => {
                    $("#launchColl").click();
                    console.log('Response:', response)
                    var collFile = new Blob([(response)], { type: 'application/pdf' });
                    console.log(collFile);
                    var collfileURL = URL.createObjectURL(collFile);
                    console.log(collfileURL);
                    document.getElementsByClassName('PDFdoc')[0].src = collfileURL + "#zoom=100";
                })
                .catch((error) => {
                    console.log(error)
                })
        }

    }

    updateStatus = (event) => {
        this.setState({ updateStatus: event.target.value })
        $("#setPreEvlBtn").prop('disabled', false)
    }
    updateComment = (event) => {
        this.setState({ updateComment: event.target.value })
    }
    setPreEvlVerification = () => {
        if (this.state.updateStatus === "" || null || undefined) {
            this.setState({ resMsg: "Status can not be empty, please select status." })
            $("#commonModal").click()
        } else {
            fetch(BASEURL + '/lsp/setpreevlverificationstatus', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    loanrequestnumber: sessionStorage.getItem("loanreqno"),
                    status: this.state.updateStatus,
                    comments: this.state.updateComment
                })
            }).then((Response) => {
                console.log(Response);
                return Response.json();
            })
                .then((resdata) => {
                    if (resdata.status === 'Success') {
                        console.log(resdata);
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click();
                        //‘Loan request verification completed’
                        $("#setPreEvlBtn").prop('disabled', false)
                    }
                    else {
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click();
                    }
                }).catch((error) => {
                    console.log(error)
                })
        }

    }
    cancelAndBackPage = () => {
        window.location = "/"
    }
    reloadPage = () => {
        var msg = this.state.resMsg
        if (msg.includes("successfull")) {
            window.location = "/preEvlVerify";
        } else if (msg.includes("Loan request verification completed.")) {
            window.location = "/preEvlVerify";
        }
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const { t } = this.props
        const { loginType } = this.state
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
        var { msgResponse, memberDetails, presentaddress, permanentaddress, loanReqStatus, consentList } = this.state;
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                {
                    this.state.showLoader && <Loader />
                }
                {loginType === "4" ?
                    < FacilitatorSidebar />
                    :
                    loginType === "1" &&
                    < SystemUserSidebar />
                }
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            {/* <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/preEvlVerify">Loan Request Verification</Link> / Verification</p> */}
                            {loginType === "1" ?
                                <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                    <Link to="/sysUserDashboard">Home</Link> /  <Link to="/preEvlVerify">Loan Request Verification</Link> / Verification</p>
                                :
                                loginType === "4" &&
                                <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                    <Link to="/facilitatorDashboard">Home</Link> /  <Link to="/preEvlVerify">Loan Request Verification</Link> / Verification</p>
                            }
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="ProductDefRes3">
                            <button style={myStyle}>
                                {/* <Link to={loginType === "4" ? "/facilitatorDashboard" : loginType === "1" && "/sysUserDashboard"} style={{ marginLeft: "10px" }}> */}
                                <Link to="/preEvlVerify" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", marginTop: "-10px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className="tab-content">
                        <div className="register-form">
                            <div className='' >
                                <div className="card" style={{ marginLeft: "50px", cursor: 'default', width: "92%", backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf" }}>
                                    <div className='row'>
                                        <div className='col-4' id='headingRef'>
                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Verification</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row pl-2 pr-2'>
                                        <div className='col'>
                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2'>
                                                    <div className='row pl-2 pr-2'>
                                                        <div className="col" style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Loan Request No.</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.overallData.loanrequestnumber}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Product ID</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.overallData.productid}</p>
                                                                </div>
                                                            </div>
                                                            {this.state.overallData.createdon != "null" ?
                                                                <div className='row'>
                                                                    <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                        <p className="mb-0 font-weight-bold">Created On</p>
                                                                    </div>
                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                    </div>
                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                        {this.state.overallData.createdon &&
                                                                            <p className="mb-0">{this.state.overallData.createdon.split(" ")[0].split("-").reverse().join("-")}</p>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                : ""
                                                            }

                                                            {/* <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Is Enabled</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {this.state.overallData.isenabled == "1" ? <p className="mb-0" style={{ color: "rgb(199, 188, 34)" }}>To complete by user</p> :
                                                                        <>{this.state.overallData.isenabled == "0" ?
                                                                            <p className="mb-0" style={{ color: "rgb(29, 143, 63)" }}>Initiated</p> : ""}
                                                                        </>
                                                                    }
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Status</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {this.state.overallData.activitystatus == "0" ? <p className="mb-0" style={{ color: "rgb(199, 188, 34)" }}>Not Initiated</p> :
                                                                        <>{this.state.overallData.activitystatus == "1" ? <p className="mb-0" style={{ color: "rgb(5, 54, 82)" }}>Pending</p> :
                                                                            <>{this.state.overallData.activitystatus == "2" ? <p className="mb-0" style={{ color: "rgb(29, 143, 63)" }}>Approved</p> :
                                                                                <>{this.state.overallData.activitystatus == "9" ? <p className="mb-0" style={{ color: "rgb(29, 143, 63)" }}>Skipped</p> : ""}</>}</>
                                                                        }
                                                                        </>
                                                                    }
                                                                </div>
                                                            </div>
                                                            {this.state.overallData.updatedon != "null" ?
                                                                <div className='row'>
                                                                    <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                        <p className="mb-0 font-weight-bold">Updated On</p>
                                                                    </div>
                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                    </div>
                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                        <p className="mb-0">
                                                                            {this.state.overallData.updatedon &&
                                                                                <span>
                                                                                    {
                                                                                        (() => {
                                                                                            const date = new Date(this.state.overallData.updatedon);
                                                                                            // Format the date to DD-MM-YYYY
                                                                                            const formattedDate = date.toLocaleDateString('en-GB'); // 'en-GB' formats as DD/MM/YYYY
                                                                                            return formattedDate.replace(/\//g, '-'); // Replace '/' with '-'
                                                                                        })()
                                                                                    }
                                                                                </span>}
                                                                        </p>
                                                                    </div>
                                                                </div> : ""
                                                            }

                                                            {this.state.overallData.performedby != "null" ?
                                                                <div className='row'>
                                                                    <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                        <p className="mb-0 font-weight-bold">Performed By</p>
                                                                    </div>
                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                    </div>
                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                        <p className="mb-0">{this.state.overallData.performedby}</p>
                                                                    </div>
                                                                </div> : ""
                                                            }
                                                            {this.state.overallData.comments != "null" && (
                                                                <div className='row'>
                                                                    <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                        <p className="mb-0 font-weight-bold">Comments</p>
                                                                    </div>
                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                    </div>
                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                        <p className="mb-0">{this.state.overallData.comments}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="accordion accordion-flush" id="accordionFlushExample">
                                                {loginType === "1" &&
                                                    <div className="row mb-2">
                                                        <div className="col">
                                                            <div class="accordion-item" style={{ backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                                <div class="accordion-header" id="flush-headingThree">
                                                                    <button class="accordion-button collapsed" onClick={this.getPersonalDetails} type="button" data-bs-toggle="collapse" style={{ color: "rgb(34, 44, 112)", fontWeight: "bold", fontSize: "14px" }}
                                                                        data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                                                        Personal Details
                                                                    </button>
                                                                </div>
                                                                <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                                                    <div class="accordion-body">
                                                                        <div className="form-row">
                                                                            <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                                <div className='row pr-2' >
                                                                                    {this.state.personalDetailList.map((list, index) => {
                                                                                        return (
                                                                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }} key={index}>
                                                                                                <div className='row'>
                                                                                                    <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                        <p className="mb-0 font-weight-bold">{list.attributetype}</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                        <p className="mb-0">{list.attributevalue}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    })}

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>}

                                                {loginType === "1" &&
                                                    <div className="row mb-2">
                                                        <div className="col">
                                                            <div class="accordion-item" style={{ backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                                <div class="accordion-header" id="flush-headingOne">
                                                                    <button class="accordion-button collapsed" onClick={this.getAddressDetails} type="button" data-bs-toggle="collapse" style={{ color: "rgb(34, 44, 112)", fontWeight: "bold", fontSize: "14px" }}
                                                                        data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                                                        Address Details
                                                                    </button>
                                                                </div>
                                                                <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                                                    <div class="accordion-body">
                                                                        <div className="form-row">
                                                                            <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                                {/* Permanent */}
                                                                                <div className='row pr-2'>
                                                                                    <div className='row'>
                                                                                        <div className='col-4' id='headingRef'>
                                                                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>{permanentaddress.addresstype === 1 ? "Permanent Address" : ""}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                        <div className='row'>
                                                                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                <p className="mb-0 font-weight-bold">Address Line 1</p>
                                                                                            </div>
                                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                                            </div>
                                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                <p className="mb-0">{permanentaddress.address1}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                        <div className='row'>
                                                                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                <p className="mb-0 font-weight-bold">Address Line 2</p>
                                                                                            </div>
                                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                                            </div>
                                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                <p className="mb-0">{permanentaddress.address2}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='row pr-2' >
                                                                                    {permanentaddress.address3 &&
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">Landmark</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{permanentaddress.address3}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    }
                                                                                    <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                        <div className='row'>
                                                                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                <p className="mb-0 font-weight-bold">City</p>
                                                                                            </div>
                                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                                            </div>
                                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                <p className="mb-0">{permanentaddress.city}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='row pr-2' >
                                                                                    <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                        <div className='row'>
                                                                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                <p className="mb-0 font-weight-bold">District</p>
                                                                                            </div>
                                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                                            </div>
                                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                <p className="mb-0">{permanentaddress.district}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                        <div className='row'>
                                                                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                <p className="mb-0 font-weight-bold">State</p>
                                                                                            </div>
                                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                                            </div>
                                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                <p className="mb-0">{permanentaddress.state}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='row pr-2 mb-3' >
                                                                                    <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                        <div className='row'>
                                                                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                <p className="mb-0 font-weight-bold">Pincode</p>
                                                                                            </div>
                                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                                            </div>
                                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                <p className="mb-0">{permanentaddress.pincode}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Present */}
                                                                                {!presentaddress || Object.keys(presentaddress).length === 0 ?
                                                                                    <></> :
                                                                                    <>
                                                                                        <div className='row pr-2'>
                                                                                            <div className='row'>
                                                                                                <div className='col-4' id='headingRef'>
                                                                                                    <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>{presentaddress.addresstypedesc}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                                <div className='row'>
                                                                                                    <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                        <p className="mb-0 font-weight-bold">Address Line 1</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                        <p className="mb-0">{presentaddress.address1}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                                <div className='row'>
                                                                                                    <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                        <p className="mb-0 font-weight-bold">Address Line 2</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                        <p className="mb-0">{presentaddress.address2}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='row pr-2' >
                                                                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                                <div className='row'>
                                                                                                    <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                        <p className="mb-0 font-weight-bold">Landmark</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                        <p className="mb-0">{presentaddress.address3}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                                <div className='row'>
                                                                                                    <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                        <p className="mb-0 font-weight-bold">City</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                        <p className="mb-0">{presentaddress.city}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='row pr-2' >
                                                                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                                <div className='row'>
                                                                                                    <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                        <p className="mb-0 font-weight-bold">District</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                        <p className="mb-0">{presentaddress.district}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                                <div className='row'>
                                                                                                    <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                        <p className="mb-0 font-weight-bold">State</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                        <p className="mb-0">{presentaddress.state}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='row pr-2' >
                                                                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                                <div className='row'>
                                                                                                    <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                        <p className="mb-0 font-weight-bold">Pincode</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                                    </div>
                                                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                        <p className="mb-0">{presentaddress.pincode}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>}

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                }

                                                {/* Loan Request Details */}
                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <div class="accordion-item" style={{ backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                            <div class="accordion-header" id="flush-headingLoan">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(34, 44, 112)", fontWeight: "bold", fontSize: "14px" }}
                                                                    data-bs-target="#flush-collapseLoan" aria-expanded="false" aria-controls="flush-collapseLoan">
                                                                    Loan Request Details
                                                                </button>
                                                            </div>
                                                            <div id="flush-collapseLoan" class="accordion-collapse collapse" aria-labelledby="flush-headingLoan" data-bs-parent="#accordionFlushExample">
                                                                <div class="accordion-body">
                                                                    <div className="form-row">
                                                                        <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                            <div className='row pr-2' >
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Borrower ID</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{loanReqStatus.borrowerid}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Loan Request Number</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{loanReqStatus.loanreqno}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row pr-2' >
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>Loan Amount Requested</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            {loanReqStatus.loanamtreq &&
                                                                                                <p className="mb-0">₹ {parseFloat(loanReqStatus.loanamtreq).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Product ID</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{loanReqStatus.productid}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className='row pr-2' >
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Tenure</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{loanReqStatus.tenurereq}&nbsp;{loanReqStatus.repaymentfrequencydesc}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Requested Date</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{loanReqStatus.loanreqdate ? loanReqStatus.loanreqdate : ""}
                                                                                                {/* loanReqStatus.loanreqdate.split("-").reverse().join("-") */}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row pr-2' >
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Loan Status</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            {loanReqStatus.loanstatus == 1 ? <p style={{ color: "rgb(199, 188, 34)", fontWeight: "600" }}>{`Active(loan request raised)`}</p> :
                                                                                                <>{loanReqStatus.loanstatus == 2 ? <p style={{ color: "rgb(5, 54, 82)", fontWeight: "600" }}>Offer generated</p> :
                                                                                                    <>{loanReqStatus.loanstatus == 3 ? <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600" }}>Offer accepted</p> :
                                                                                                        <>{(loanReqStatus.loanstatus == 4 || loanReqStatus.loanstatus == 8) ? <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600" }}>Rejected</p> :
                                                                                                            <>{loanReqStatus.loanstatus == 5 ? <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600" }}>Withdrawn</p> : ""}</>}</>}</>
                                                                                                }
                                                                                                </>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {loanReqStatus.jlgid &&
                                                                                    <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                        <div className='row'>
                                                                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                <p className="mb-0 font-weight-bold">Group ID</p>
                                                                                            </div>
                                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                                            </div>
                                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                <p className="mb-0">{loanReqStatus.jlgid}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>}
                                                                            </div>

                                                                            {consentList && Object.keys(consentList).length !== 0 && (
                                                                                <div className='pt-2'>
                                                                                    <div className='row'>
                                                                                        <div className='col-4' id='headingRef'>
                                                                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Signers</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='row'>
                                                                                        <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                                                            <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)", marginLeft: "10px" }}>
                                                                                                <div className='col-3'>
                                                                                                    <p style={{ fontWeight: "600", marginLeft: "10px" }}>{t('Name')}</p>
                                                                                                </div>
                                                                                                <div className='col-3'>
                                                                                                    <p style={{ fontWeight: "600", marginLeft: "3px" }}>{t('Status')}</p>
                                                                                                </div>
                                                                                                <div className='col-4'>
                                                                                                    <p style={{ fontWeight: "600", marginLeft: "-5px" }}>{t('Signed on')}</p>
                                                                                                </div>

                                                                                            </div>
                                                                                            <hr className="col-12" style={{ marginLeft: "16px", width: "92%", marginTop: "-15px", backgroundColor: "rgb(5, 54, 82)" }} />
                                                                                            {consentList && Object.keys(consentList).length !== 0 && (
                                                                                                <div className='scrollbar' style={{ marginTop: "-21px", height: (this.state.consentList.length > 2 ? "240px" : "120px") }}>
                                                                                                    {consentList.map((sign, index) => {
                                                                                                        return (
                                                                                                            <div className="col" key={index} style={{ marginBottom: "-10px" }}>
                                                                                                                <div className="card" style={{ borderRadius: "5px", cursor: "default" }}>
                                                                                                                    <div className='form-check mt-2'>
                                                                                                                        <div className='row'>
                                                                                                                            <div className='col-3' style={{
                                                                                                                                color: "rgb(5, 54, 82)",
                                                                                                                                fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                                                            }}>
                                                                                                                                <span>{sign.signername}</span>
                                                                                                                            </div>
                                                                                                                            <div className='col-3' style={{
                                                                                                                                color: "rgb(5, 54, 82)",
                                                                                                                                fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                                                            }}>
                                                                                                                                <p style={{ color: "rgb(29, 179, 69)", textWrap: "wrap", }}>Completed</p>
                                                                                                                            </div>
                                                                                                                            <div className='col-4' style={{
                                                                                                                                color: "rgb(5, 54, 82)",
                                                                                                                                fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                                                            }}>
                                                                                                                                {/* <span>{new Date(sign.signedon).toISOString().split('T')[0]}</span> */}
                                                                                                                                {sign.signedon &&
                                                                                                                                    <span>
                                                                                                                                        {
                                                                                                                                            (() => {
                                                                                                                                                const date = new Date(sign.signedon);
                                                                                                                                                // Format the date to DD-MM-YYYY
                                                                                                                                                const formattedDate = date.toLocaleDateString('en-GB'); // 'en-GB' formats as DD/MM/YYYY
                                                                                                                                                return formattedDate.replace(/\//g, '-'); // Replace '/' with '-'
                                                                                                                                            })()
                                                                                                                                        }
                                                                                                                                    </span>}
                                                                                                                            </div>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        )
                                                                                                    })}
                                                                                                </div>
                                                                                            )
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <div class="accordion-item" style={{ backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                            <div class="accordion-header" id="flush-headingTwo">
                                                                <button class="accordion-button collapsed" onClick={this.getLoanStmt} type="button" data-bs-toggle="collapse" style={{ color: "rgb(34, 44, 112)", fontWeight: "bold", fontSize: "14px" }}
                                                                    data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                                                    Financial Statement
                                                                </button>
                                                            </div>
                                                            <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                                                <div class="accordion-body">
                                                                    <div className="form-row">
                                                                        <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                            <div className='row pr-2' >
                                                                                <div className='row'>
                                                                                    {
                                                                                        this.state.loanStmt.map((loan, index) => {
                                                                                            return (
                                                                                                <>
                                                                                                    <div className='col-6'>
                                                                                                        <button type="button" className="btn" id="digisubmit4"
                                                                                                            style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", borderRadius: "10px" }}
                                                                                                            onClick={this.downloadStmt.bind(this, loan.stmtid, loan.filename)}><FaFileDownload style={{ marginTop: "-4px" }} />&nbsp;{loan.filename}</button>
                                                                                                    </div>
                                                                                                </>
                                                                                            )
                                                                                        })
                                                                                    }

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Group Details */}
                                                {loanReqStatus.jlgid &&
                                                    <>
                                                        <div className="row mb-2">
                                                            <div className="col">
                                                                <div class="accordion-item" style={{ backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                                    <div class="accordion-header" id="flush-headingGroup">
                                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(34, 44, 112)", fontWeight: "bold", fontSize: "14px" }}
                                                                            onClick={this.getgroupFullDetails}
                                                                            data-bs-target="#flush-collapseGroup" aria-expanded="false" aria-controls="flush-collapseGroup">
                                                                            Group Details
                                                                        </button>
                                                                    </div>
                                                                    <div id="flush-collapseGroup" class="accordion-collapse collapse" aria-labelledby="flush-headingGroup" data-bs-parent="#accordionFlushExample">
                                                                        <div class="accordion-body">
                                                                            <div className="form-row">
                                                                                <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                                    <div className='row pr-2'>
                                                                                        <div className='row'>
                                                                                            <div className='col-4' id='headingRef'>
                                                                                                <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Group Details</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">Group Name</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{msgResponse.groupname}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">Group Description</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{msgResponse.groupdesc}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='row pr-2' >
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">Occupation</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{msgResponse.occupation}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">State</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{msgResponse.state}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='row pr-2' >
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">District</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{msgResponse.district}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">Taluk</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{msgResponse.taluk}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Members */}
                                                                                    {memberDetails && Object.keys(memberDetails).length !== 0 && (
                                                                                        <div className='pt-2'>
                                                                                            <div className='row'>
                                                                                                <div className='col-4' id='headingRef'>
                                                                                                    <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Members</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='row'>
                                                                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                                                                    <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)", marginLeft: "10px" }}>
                                                                                                        <div className='col-3'>
                                                                                                            <p style={{ fontWeight: "600", marginLeft: "10px" }}>{t('Name')}</p>
                                                                                                        </div>
                                                                                                        <div className='col-3'>
                                                                                                            <p style={{ fontWeight: "600", marginLeft: "3px" }}>{t('Signing')}</p>
                                                                                                        </div>
                                                                                                        <div className='col-4'>
                                                                                                            <p style={{ fontWeight: "600", marginLeft: "-5px" }}>{t('Mobile Number')}</p>
                                                                                                        </div>

                                                                                                    </div>
                                                                                                    <hr className="col-12" style={{ marginLeft: "16px", width: "92%", marginTop: "-15px", backgroundColor: "rgb(5, 54, 82)" }} />
                                                                                                    <div className='scrollbar' style={{ marginTop: "-21px", height: (this.state.memberDetails.length > 2 ? "240px" : "120px") }}>
                                                                                                        {memberDetails.map((members, index) => {
                                                                                                            return (
                                                                                                                <div className="col" key={index} style={{ marginBottom: "-10px" }}>
                                                                                                                    <div className="card" style={{ borderRadius: "5px", cursor: "default" }}>
                                                                                                                        <div className='form-check mt-2'>
                                                                                                                            <div className='row'>
                                                                                                                                <div className='col-3' style={{
                                                                                                                                    color: "rgb(5, 54, 82)",
                                                                                                                                    fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                                                                }}>
                                                                                                                                    <span>{members.name}</span>
                                                                                                                                </div>
                                                                                                                                <div className='col-3' style={{
                                                                                                                                    color: "rgb(5, 54, 82)",
                                                                                                                                    fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                                                                }}>
                                                                                                                                    <p style={{ color: "rgb(179, 86, 29)", textWrap: "wrap", }}>{members.resolutiondocsignstatus == 1 ? "Initiated" :
                                                                                                                                        <p style={{ color: "rgb(235, 161, 52)", textWrap: "wrap", }}>{members.resolutiondocsignstatus == 2 ? "Pending" :
                                                                                                                                            <p style={{ color: "rgb(29, 179, 69)", textWrap: "wrap", }}>{members.resolutiondocsignstatus == 3 ? "Completed" : "Not Initiated"}
                                                                                                                                            </p>}
                                                                                                                                        </p>}
                                                                                                                                    </p>
                                                                                                                                </div>
                                                                                                                                <div className='col-4' style={{
                                                                                                                                    color: "rgb(5, 54, 82)",
                                                                                                                                    fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                                                                }}>
                                                                                                                                    <span>{members.mobileno}</span>
                                                                                                                                </div>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            )
                                                                                                        })}

                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col">
                                                                <div class="accordion-item" style={{ backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                                    <div class="accordion-header" id="flush-headingFour">
                                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(34, 44, 112)", fontWeight: "bold", fontSize: "14px" }}
                                                                            data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                                                                            Other Documents
                                                                        </button>
                                                                    </div>
                                                                    <div id="flush-collapseFour" class="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample">
                                                                        <div class="accordion-body">
                                                                            <div className="form-row">
                                                                                <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                                    <div className='row pr-2' >
                                                                                        <div className='row'>
                                                                                            <div className='col' style={{ marginLeft: "5px" }}>
                                                                                                {/* <p className="downloadTnc" id='downloadTnCid' style={{ cursor: "pointer", fontWeight: "500", fontSize: "14px" }} onClick={this.getDocumentDetails}>
                                                                                        View Document &nbsp; <FaFileDownload style={{ marginTop: "-4px" }} />
                                                                                    </p> */}
                                                                                                <button type="button" className="btn" id="digisubmit"
                                                                                                    style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", borderRadius: "10px" }} onClick={this.getDocumentDetails}>
                                                                                                    <FaFileDownload style={{ marginTop: "-4px" }} />&nbsp;JLG Resolution Document</button>
                                                                                            </div>
                                                                                            <div className='col' style={{ marginLeft: "5px" }}>
                                                                                                <button type="button" className="btn"
                                                                                                    style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", borderRadius: "10px" }} onClick={this.viewLoanReqDocu}>
                                                                                                    <FaFileDownload style={{ marginTop: "-4px" }} />&nbsp;Consent Document</button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>}
                                            </div>

                                            {this.state.overallData.activitystatus == "2" || this.state.overallData.activitystatus == "9" ?
                                                "" :

                                                <>
                                                    {loginType === "1" &&
                                                        <div>
                                                            <div className='form-row'>
                                                                <div className='col' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                                    <span>Verify Loan Request</span>
                                                                    <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                                </div>
                                                            </div>
                                                            <div className='form-row'>
                                                                <div className="form-group col">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "1px", fontSize: "14px" }}>Comments</p>
                                                                    <textarea id="reason1" className="form-control" placeholder={t(`Enter Comments`)}
                                                                        style={{ backgroundColor: "rgb(247, 248, 250)" }}
                                                                        rows={2} cols={40} type="text" maxLength={255} onChange={this.updateComment}></textarea>
                                                                </div>
                                                                <div className="form-group col">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "1px", fontSize: "14px" }}>Status*</p>
                                                                    <select className='form-select' onChange={this.updateStatus} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)" }}>
                                                                        <option defaultValue>Select Status</option>
                                                                        <option value="1">Approve</option>
                                                                        <option value="">Reject</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            <div className="form-row">
                                                                <div className="form-group col pt-2" style={{ textAlign: "end" }}>
                                                                    <button className='btn btn-sm text-white' id="setPreEvlBtn" onClick={this.setPreEvlVerification}
                                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button> &nbsp;
                                                                    <button className='btn btn-sm text-white' onClick={this.cancelAndBackPage}
                                                                        style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </>}
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
                                <iframe src="" className="PDFdoc" type="application/pdf" style={{ overflow: "auto", height: "100vh", width: "100%" }}>

                                </iframe>
                                <div className='pt-2' style={{ textAlign: "end", paddingRight: "15px" }}>
                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*  Common Alert */}
                    <button id='commonModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter21">
                    </button>
                    <div className="modal fade" id="exampleModalCenter21" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                {this.state.resMsg}
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.reloadPage}>Okay</button>
                                        </div>
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

export default withTranslation()(VerifyPreProfile)