import React, { Component } from 'react';
import { BASEURL } from '../../assets/baseURL';
import FacilitatorSidebar from '../../../SidebarFiles/FacilitatorSidebar';
import { FaAngleLeft, FaFolderPlus } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './Support.css';
import * as FaIcons from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import $ from 'jquery';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css'
import Tooltip from "@material-ui/core/Tooltip";
import batch from '../../assets/batch.png';

var paymentRelFlag;
export class FacSupport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginname: "",
            mobilenumber: "",
            issuetype: "",
            reqno: "",
            captchaState: true,
            issueList: [],
            issuedesc: "",
            issueStatus: "",
            ticketsList: [],
            fromdate: "",
            todate: "",
            dateError: false,
            issueDescFlag: true,
            Bmobile: "",

            offset: 0,
            orgtableData: [],
            perPage: 2,
            currentPage: 0,
            pageCount: "",

            //Payment Info
            bankrefno: '',
            amount: '',
            paymentmode: '',
            paymentdate: '',
            paymentpurpose: '',
            paymenttoaccount: '',
            bankrefFlag: true,
            isPaymentDateValid: true,
            isAmountValid: true,
            isAccountNoValid: true,

            closeMyAccReason: "",
            closeAccOtp: "",
            closeAccOtpRef: "",
            closeReasonResp: ""
        }
        this.issuetype = this.issuetype.bind(this);
        this.raiseSupportTicket = this.raiseSupportTicket.bind(this);
        this.supportTicketStatus = this.supportTicketStatus.bind(this);

    }
    issuetype(event) {
        var issueList = this.state.issueList;
        console.log(issueList);
        var issueType = "";
        if (issueList) {
            issueList.filter((e) => e.issuetype === event.target.value).map((issue, index) => {
                console.log(issue.issuetype, issue.issuename, issue.issuetypedesc)
                this.setState({
                    issuedesc: issue.issuetypedesc,
                    issuename: issue.issuename,
                    issuetype: issue.issuetype
                })
                issueType = issue.issuetype;
            })
        }
        console.log(issueType);
        if (issueType.includes("PY")) {
            $(".paymentRelatedTag").show();
            paymentRelFlag = "PY";
            this.setState({
                paymentRelFlag: true,
                issueDescFlag: false
            })
        } else {
            $(".paymentRelatedTag").hide();
            paymentRelFlag = "";
            this.setState({
                paymentRelFlag: false,
                issueDescFlag: true
            })
        }
    }
    issueDesc = (event) => {
        this.setState({ issuedesc: event.target.value })
        const inputValue = event.target.value;
        const regex = /^[a-zA-Z].*[a-zA-Z0-9,. ]*$/; // Regular expression to match alphabets, numbers, periods, commas, and spaces only
        if (regex.test(inputValue)) {
            // Input is valid
            this.setState({ issueDescFlag: true })
        } else {
            // Input is invalid
            this.setState({ issueDescFlag: false })
        }
    }
    issueStatus = (event) => {
        this.setState({ issueStatus: event.target.value })
    }
    fromdate = (event) => {
        const fromDateValue = event.target.value;
        const toDateValue = this.state.todate;


        this.setState({ fromdate: fromDateValue });

        if (toDateValue && fromDateValue > toDateValue) {
            this.setState({ dateError: true });
        } else {
            this.setState({ dateError: false });
        }
    }
    todate = (event) => {
        const toDateValue = event.target.value;
        const fromDateValue = this.state.fromdate;

        this.setState({ todate: toDateValue });


        if (fromDateValue && toDateValue < fromDateValue) {
            this.setState({ dateError: true });
        } else {
            this.setState({ dateError: false });
        }
    }
    componentDidMount() {
        //loadCaptchaEnginge(6);
        this.loadDate();
        this.getIssuTypes()
        $("#customer-tab").prop('disabled', true);
    }
    handlePageClick = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData();
        })
    }
    loadMoreData = () => {
        const data = this.state.orgtableData;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            ticketsList: slice
        })
    }
    loadDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var frday;

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        frday = yyyy + '-' + mm + '-' + '01';
        this.setState({ dtoday: today });
        this.setState({ todate: today })
        this.setState({ dfrday: frday });
        this.setState({ fromdate: frday })
    }
    getsupportTickets = () => {
        fetch(BASEURL + '/grievance/getsupporttickets', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                fromdate: this.state.fromdate,
                todate: this.state.todate,
                issuestatus: this.state.issueStatus,
            })
        }).then((Response) => {
            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ ticketsList: resdata.msgdata })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        ticketsList: slice
                    })
                } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getIssuTypes = () => {
        fetch(BASEURL + '/grievance/getallissuetypes', {
            method: 'Get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then((Response) => {
            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ issueList: resdata.msgdata })
                    this.getPersonalDetails()
                    // alert(resdata.message);
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
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                    },
                                },
                            ],
                        });
                    }
                    //alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getPersonalDetails = (event) => {
        fetch(BASEURL + '/usrmgmt/getpersonaldetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                memmid: parseInt(sessionStorage.getItem('memmID'))
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({ showLoader: false })
                    console.log(resdata);
                    this.setState({ Bmobile: resdata.msgdata.mobile })
                } else {
                    this.setState({ showLoader: false })
                }
                // else {
                //     alert("Issue: " + resdata.message);
                // }
            })
    }
    //Raise Ticket
    bankRef = (e) => {
        this.setState({ bankrefno: e.target.value })
        const inputValue = e.target.value;
        const regex = /^[A-Za-z0-9]{10,20}$/; // Alphabets must be present, followed by any combination of alphabets, numbers
        if (regex.test(inputValue)) {
            // Input is valid
            this.setState({ bankrefFlag: true });
        } else {
            console.log("Invalid bank reference number");
            this.setState({ bankrefFlag: false });
        }
    }
    paymentMode = (e) => {
        this.setState({ paymentmode: e.target.value })
    }
    paymentDate = (e) => {
        this.setState({ paymentdate: e.target.value })
        const selectedDate = e.target.value;
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        console.log(selectedDate)
        console.log(today)

        if (selectedDate <= today) {
            this.setState({
                paymentDate: selectedDate,
                isPaymentDateValid: true
            });
        }
        else {
            this.setState({

                isPaymentDateValid: false
            });
        }
        console.log(this.state.isPaymentDateValid)
    }
    paymentPurp = (e) => {
        this.setState({ paymentpurpose: e.target.value })
    }
    Amount = (e) => {
        this.setState({ amount: e.target.value })
        const inputValue = e.target.value;
        const regex = /^\d+(\.\d{1,2})?$/; // Regex to validate amount (allowing decimal up to 2 places)
        if (regex.test(inputValue)) {
            this.setState({
                isAmountValid: true
            });
        }
        else {
            this.setState({
                isAmountValid: false
            });
        }

    }
    accNo = (e) => {
        this.setState({ paymenttoaccount: e.target.value })
        const inputValue = e.target.value;
        const regex = /^\d{10,20}$/; // Regex to validate account number (10-20 digits)
        if (regex.test(inputValue)) {
            this.setState({
                isAccountNoValid: true
            });
        }
        else {
            this.setState({
                isAccountNoValid: false
            });
        }

    }
    raiseSupportTicket = () => {
        // this.captchaSubmit();
        // if (this.captchaState == false)
        //     return;
        var value;
        if (paymentRelFlag.includes("PY")) {
            value = JSON.stringify({
                loginname: sessionStorage.getItem("userID"),
                mobilenumber: this.state.Bmobile,
                issuetype: this.state.issuetype,
                issuedesc: this.state.issuedesc,
                issuename: this.state.issuename,
                paymentinfo: {
                    bankrefno: this.state.bankrefno,
                    amount: this.state.amount,
                    paymentmode: this.state.paymentmode,
                    paymentdate: this.state.paymentdate,
                    paymentpurpose: this.state.paymentpurpose,
                    ...(this.state.paymenttoaccount && { paymenttoaccount: this.state.paymenttoaccount })
                }
            })
        } else {
            value = JSON.stringify({
                loginname: sessionStorage.getItem("userID"),
                mobilenumber: this.state.Bmobile,
                issuetype: this.state.issuetype,
                issuedesc: this.state.issuedesc,
                issuename: this.state.issuename,
            })
        }
        fetch(BASEURL + '/grievance/raisesupportticket', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: value,
        }).then((Response) => {

            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    confirmAlert({
                        message: resdata.message + " & your request number is " + resdata.msgdata.reqno,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location.reload()
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                    //alert(resdata.message + " & your request number is " + resdata.msgdata.reqno);
                } else {
                    if (paymentRelFlag.includes("PY")) {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                    },
                                },
                            ],
                            closeOnClickOutside: false,
                        });
                    }
                    else {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                    },
                                },
                            ],
                            closeOnClickOutside: false,
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    supportTicketStatus = () => {
        fetch(BASEURL + '/grievance/getsupportticketstatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loginname: this.state.loginname,
                mobilenumber: this.state.mobilenumber,
                reqno: this.state.reqno
            })
        }).then((Response) => {

            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    // if (resdata.msgdata.issuestatus == 0) {
                    //     document.getElementById("issueStatus").innerHTML = "Status: ticket raised";
                    // }
                    // else if (resdata.msgdata.issuestatus == 1) {
                    //     document.getElementById("issueStatus").innerHTML = "Status: processing";
                    // }

                    // else if (resdata.msgdata.issuestatus == 2) {
                    //     document.getElementById("issueStatus").innerHTML = "Status: closed";
                    // }
                    // alert(resdata.message + " & your ticket status is " + '');
                } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                    //alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    cancel = () => {
        window.location.reload();
    }
    //closeAcc
    closeMyAcc = () => {
        $("#closeAccModal").click()
    }
    closeReason = (event) => {
        this.setState({ closeMyAccReason: event.target.value })
    }
    closeAccOtp = (event) => {
        this.setState({ closeAccOtp: event.target.value })
    }
    setCloseMyAcc = (params) => {
        var result;
        var reasonSub = JSON.stringify({
            reason: this.state.closeMyAccReason
        })
        var otpRef = JSON.stringify({
            otp: parseInt(this.state.closeAccOtp),
            otpref: this.state.closeAccOtpRef,
            closeaccreason: this.state.closeReasonResp
        })
        if (params === "getOtp") {
            result = reasonSub;
        } else if (params === "submitOtp") {
            result = otpRef;
        }
        fetch(BASEURL + '/usrmgmt/closemyaccount', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: result
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    $("#exampleModalCenter6").modal('hide')
                    $("#textContent").show()
                    $("#otpContent").hide()
                    console.log("executing1")
                    if (resdata && resdata.msgdata && resdata.msgdata.otpref) {
                        $("#textContent").hide()
                        $("#otpContent").show()
                        this.setState({
                            closeAccOtpRef: resdata.msgdata.otpref,
                            closeReasonResp: resdata.msgdata.closeaccreason
                        })
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        $("#exampleModalCenter6").modal('show')
                                        var timeleft = 30;
                                        var downloadTimer = setInterval(function () {
                                            if (timeleft < 0) {
                                                clearInterval(downloadTimer);
                                                document.getElementById("countdown2").innerHTML = "Resend OTP";
                                                $('#countdown').hide()
                                                $('#countdown2').show()

                                            } else {
                                                document.getElementById("countdown").innerHTML = "Resend OTP in " + timeleft + "s";
                                                $('#countdown2').hide()
                                                $('#countdown').show()
                                            }
                                            timeleft -= 1;
                                        }, 1000);
                                    },
                                },
                            ],
                        });
                    } else if (!resdata.msgdata.otpref) {
                        console.log("executing")
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => { },
                                },
                            ],
                        });
                    }
                } else {
                    $("#exampleModalCenter6").modal('hide')
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    $("#exampleModalCenter6").modal('show')
                                },
                            },
                        ],
                    });
                }
            })
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#f4f7fc" }}>
                <FacilitatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/facilitatorDashboard">Home</Link> / Support</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="">
                            <button style={myStyle}>
                                <Link to="/facilitatorDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-3' id='headingRef'>
                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Support</p>
                            </div>
                        </div>
                    </div>
                    <div class="container" style={{ width: "94%" }}>
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <ul class="nav nav-pills flex-column" id="myTab" role="tablist" style={{ fontSize: "18px", fontFamily: "Poppins,sans-serif" }}
                                >
                                    <li class="nav-item mb-2">
                                        <a class="nav-link active" id="ticket-tab" data-toggle="tab"
                                            href="#ticket" role="tab" aria-controls="profile" aria-selected="false"><FaIcons.FaTicketAlt />&nbsp;Raise a Support Ticket</a>
                                    </li>
                                    <li class="nav-item mb-2">
                                        <a class="nav-link" id="viewTicket-tab" data-toggle="tab"
                                            href="#view-ticket" role="tab" aria-controls="view-ticket" aria-selected="false"><FaIcons.FaIdCardAlt />&nbsp;Check Ticket Status</a>
                                    </li>
                                    <li class="nav-item mb-2" >
                                        <a class="nav-link" id="contact-tab" data-toggle="tab"
                                            href="#contact" role="tab" aria-controls="contact" aria-selected="false"><FaIcons.FaRegAddressCard />&nbsp;Contact Us</a>
                                    </li>
                                    {/* <li class="nav-item mb-2">
                                        <a class="nav-link" id="customer-tab" data-toggle="tab" title='Service unavailable'
                                            href="#customer" role="tab" aria-controls="home" aria-selected="true"><FaIcons.FaComment />&nbsp;Chat with Customer Service</a>
                                    </li> */}
                                    <li class="nav-item mb-2" onClick={this.closeMyAcc}>
                                        <a class="nav-link" id="closeMyAcc-tab" data-toggle="tab"
                                            href="#closeAcc" role="tab" aria-controls="home" aria-selected="true"><FaIcons.FaComment />&nbsp;Close My Account</a>
                                    </li>
                                </ul>
                            </div>

                            <div class="col-md-8">
                                <div class="tab-content" id="myTabContent" style={{ marginTop: "-15px", marginLeft: "-20px" }}>

                                    <div class="tab-pane fade show active" id="ticket" role="tabpanel" aria-labelledby="ticket-tab">
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className='row'>
                                                    <div className='col' style={{ marginLeft: "15px" }}>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontSize: "18px" }}><FaIcons.FaTicketAlt /><span className="font-weight-bold">&nbsp;Raise Ticket</span></p>
                                                    </div>
                                                </div>
                                                <hr className='col-11' style={{ marginTop: "-10px" }} />
                                                <div className='row mb-2'>
                                                    <div className='col-6'>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Issue Type *')}</p>
                                                        <select id="inputState" style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-12px" }}
                                                            className="form-select" onChange={this.issuetype} >
                                                            <option defaultValue>{t('Select Issue Type')}</option>
                                                            {this.state.issueList.map((lists, index) => (
                                                                <option key={index} value={lists.issuetype} style={{ color: "GrayText" }}>{lists.issuename}</option>
                                                            ))
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className='col-6 paymentRelatedTag' style={{ display: "none" }}>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Bank Ref. No. *')}</p>
                                                        <input className='form-control' type='text' placeholder='Enter Reference no.' style={{ marginTop: "-12px" }} onChange={this.bankRef} />
                                                        {this.state.bankrefFlag === false ? <p className='text-danger'>Please enter a valid bank reference number.</p> : ""}
                                                    </div>
                                                </div>
                                                <div className='row mb-2 paymentRelatedTag' style={{ display: "none" }}>
                                                    <div className='col-6'>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Payment Mode')}</p>
                                                        <select className='form-select' onChange={this.paymentMode} style={{ marginTop: "-12px" }}>
                                                            <option defaultValue>Select Payment Mode</option>
                                                            <option value="UPI">UPI</option>
                                                            <option value="NEFT">NEFT</option>
                                                            <option value="RTGS">RTGS</option>
                                                            <option value="IMPS">IMPS</option>
                                                        </select>
                                                    </div>
                                                    <div className='col-6'>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Payment Date *')}</p>
                                                        <input className='form-control' type='date' style={{ marginTop: "-12px" }} onChange={this.paymentDate} />
                                                        {this.state.isPaymentDateValid === false ? <p className='text-danger'>Future date can not be selected as payment date</p> : ""}
                                                    </div>
                                                </div>
                                                <div className='row mb-2 paymentRelatedTag' style={{ display: "none" }}>
                                                    <div className='col-6'>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Payment Purpose *')}</p>
                                                        <select className='form-select' onChange={this.paymentPurp} style={{ marginTop: "-12px" }}>
                                                            <option defaultValue>Select Payment Purpose</option>
                                                            <option value="4">Facilitator top up</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Amount *')}</p>
                                                        <input className='form-control' type='text' placeholder='Enter Amount' style={{ marginTop: "-12px" }} onChange={this.Amount} />
                                                        {this.state.isAmountValid === false ? <p className='text-danger'>Please enter a valid amount.</p> : ""}
                                                    </div>

                                                </div>
                                                <div className="row mb-2">
                                                    <div className='col-6 paymentRelatedTag' style={{ display: "none" }}>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Payment To Account(Optional)')}</p>
                                                        <input className='form-control' type='text' placeholder='Enter Account number' style={{ marginTop: "-12px" }} onChange={this.accNo} />
                                                        {this.state.isAccountNoValid === false ? <p className='text-danger'>Please enter a valid account number.</p> : ""}
                                                    </div>
                                                    <div className={(paymentRelFlag?.includes("PY") ? 'col-6' : 'col')}>
                                                        <p htmlFor="Desc" id='reason' style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", width: "310px" }}>{t('User Description (Maximum 1000 words) *')}</p>
                                                        <textarea id="reason1" className="form-control" rows={4} cols={40} type="text" maxLength={255}
                                                            style={{ marginTop: "-12px" }} onChange={this.issueDesc}></textarea>
                                                        {this.state.issueDescFlag === false ? <p className="text-danger">Provide a valid description</p> : ""}
                                                    </div>
                                                </div>
                                                <div className='row' style={{ marginTop: "10px" }}>
                                                    <div className='col' style={{ textAlign: "end" }}>
                                                        {
                                                            paymentRelFlag === "" ?
                                                                <>
                                                                    <button
                                                                        className='btn btn-sm' id="raisetktbtn"
                                                                        disabled={this.state.issueDescFlag === false ? true : false}
                                                                        style={{ backgroundColor: "rgb(136, 189, 72)", color: "white" }}
                                                                        onClick={this.raiseSupportTicket}
                                                                    >
                                                                        Raise Ticket
                                                                    </button>
                                                                    &nbsp;&nbsp;
                                                                </>
                                                                :
                                                                paymentRelFlag?.includes("PY") ?
                                                                    <>
                                                                        <button
                                                                            className='btn btn-sm' id="raisetktbtn"
                                                                            disabled={(this.state.issueDescFlag === false || this.state.isAmountValid === false || this.state.isPaymentDateValid === false || this.state.bankrefFlag === false || this.state.isAccountNoValid === false) ? true : false}
                                                                            style={{ backgroundColor: "rgb(136, 189, 72)", color: "white" }}
                                                                            onClick={this.raiseSupportTicket}
                                                                        >
                                                                            Raise Ticket
                                                                        </button>
                                                                        &nbsp;&nbsp;
                                                                    </>
                                                                    :
                                                                    ""
                                                        }
                                                        <button className='btn btn-sm' style={{ backgroundColor: "#0074BF", color: "white" }} onClick={this.cancel}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="view-ticket" role="tabpanel" aria-labelledby="viewTicket-tab">
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className='row'>
                                                    <div className='col'>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}><span className="font-weight-bold"></span></p>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col'>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontSize: "18px" }}><FaIcons.FaTicketAlt /><span className="font-weight-bold">&nbsp;View Tickets</span></p>
                                                    </div>
                                                </div>
                                                <hr className='col-12' style={{ marginTop: "-10px", width: "95%" }} />
                                                <div className='row mb-2'>
                                                    <div className='col-3' id='date1' style={{ fontSize: "15px" }}>
                                                        <p htmlFor="date" style={{
                                                            fontSize: "16px", fontFamily: "Poppins,sans-serif", marginLeft: "0px",
                                                            color: "rgba(5,54,82,1)", marginBottom: "-10px", fontWeight: "600", width: "150px"
                                                        }}>{t('From Date *')}</p><br />
                                                        <input id="Fdate" type="date"
                                                            defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                                                border: "1px solid rgba(40,116,166,1)",
                                                                borderRadius: "5px",
                                                                width: "150px",
                                                                height: "35px",
                                                                fontSize: "15px",
                                                                color: "rgba(40,116,166,1)",

                                                            }} />
                                                    </div>
                                                    <div className='col-3' id='date2' style={{ fontSize: "15px" }}>
                                                        <p htmlFor="date" style={{
                                                            fontSize: "16px", fontFamily: "Poppins,sans-serif", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                                            marginBottom: "-10px", fontWeight: "600", width: "150px"
                                                        }}>{t('To Date *')}</p><br />
                                                        <input id="Tdate" type="date"
                                                            defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                                                border: "1px solid rgba(40,116,166,1)",
                                                                borderRadius: "5px",
                                                                width: "150px",
                                                                height: "35px",
                                                                fontSize: "15px",
                                                                color: "rgba(40,116,166,1)",
                                                            }} />
                                                    </div>
                                                    <div className='col-3' id='' style={{ fontSize: "15px" }}>
                                                        <p htmlFor="date" style={{ fontSize: "16px", fontFamily: "Poppins,sans-serif", marginLeft: "0px", color: "rgba(5,54,82,1)", marginBottom: "12px", fontWeight: "600" }}>{t('Status Type *')}</p>
                                                        <select className="form-select" style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            borderRadius: "5px",
                                                            width: "150px",
                                                            height: "35px",
                                                            fontSize: "15px",
                                                            color: "rgba(40,116,166,1)",
                                                        }} onChange={this.issueStatus}>
                                                            <option defaultValue>Select Issues</option>
                                                            <option value="0">{t('Open')}</option>
                                                            <option value="1">{t('Processing')}</option>
                                                            <option value="2">{t('Closed')}</option>
                                                            <option value="3">All</option>
                                                        </select>
                                                    </div>
                                                    {this.state.dateError === true ? <div className='col-3' style={{ fontSize: "15px" }}>
                                                        <button className='btn text-white' onClick={this.getsupportTickets} disabled
                                                            style={{ backgroundColor: "#0074bf", marginTop: "35px", paddingLeft: "38px", paddingRight: "38px" }}>Submit</button>
                                                    </div>
                                                        : <div className='col-3' style={{ fontSize: "15px" }}>
                                                            <button className='btn text-white' onClick={this.getsupportTickets}
                                                                style={{ backgroundColor: "#0074bf", marginTop: "35px", paddingLeft: "38px", paddingRight: "38px" }}>Submit</button>
                                                        </div>}
                                                </div>
                                                {this.state.dateError && <p className="text-danger">To Date cannot be less than From Date</p>}

                                                {/* lists */}
                                                {this.state.ticketsList == "" || null || undefined ?
                                                    null :
                                                    <>
                                                        <div className='form-row'>
                                                            {
                                                                this.state.ticketsList.map((tLists, index) => {
                                                                    return (
                                                                        <div className='col-6' key={index}>
                                                                            <div className='card p-3' style={{ border: "2px solid rgb(183, 214, 232)", marginBottom: "1px", cursor: "default" }}>
                                                                                <div className='row' style={{ fontSize: "14px", color: "#222C70" }}>
                                                                                    <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Request Number</p>
                                                                                    <p>{tLists.reqno == "" || null ? "-" : tLists.reqno}
                                                                                        <hr style={{ color: "rgba(42,143,211,1)" }} />
                                                                                    </p>
                                                                                    <div className='col-6' style={{ marginTop: "-30px" }}>
                                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Issue Type</p>
                                                                                        <Tooltip title={tLists.issuename} >
                                                                                            <p>
                                                                                                {tLists.issuename.substring(0, 14) + ".."}
                                                                                            </p>
                                                                                        </Tooltip>
                                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Expected Closure</p>
                                                                                        <p>{tLists.sladuration}&nbsp;{tLists.sladurationtype}</p>

                                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>User Description</p>
                                                                                        <Tooltip title={tLists.issuedesc} >
                                                                                            <p>
                                                                                                {tLists.issuedesc.substring(0, 14) + ".."}
                                                                                            </p>
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                    <div className='col-6' style={{ marginTop: "-30px" }}>
                                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Raised On</p>
                                                                                        <p>{new Date(tLists.raisedon).toLocaleDateString('en-GB').split("/").join("-")}</p>

                                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Issue Status</p>
                                                                                        <p>{tLists.issuestatus == "0" ? <p style={{ color: "rgb(181, 109, 33)" }}>Open</p> : <span>{tLists.issuestatus == "1" ? <p style={{ color: "rgb(56, 138, 15)" }}>Processing</p> :
                                                                                            <span>{tLists.issuestatus == "2" ? <p style={{ color: "green" }}>Closed</p> : "-"}</span>}</span>}</p>

                                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Last Updated On</p>
                                                                                        <p>{new Date(tLists.lastupdated).toLocaleDateString('en-GB').split("/").join("-")}</p>
                                                                                    </div>
                                                                                    {tLists.issuestatus == "1" || tLists.issuestatus == "2" ?
                                                                                        <>
                                                                                            <p className="font-weight-bold" style={{ marginBottom: "1px", fontSize: "14px", color: "#222C70" }}>Reviewer Description</p>
                                                                                            <p style={{ fontSize: "14px", color: "#222C70" }}>{tLists.reviewerdesc == "" || null ? "-" : tLists.reviewerdesc}</p>
                                                                                        </>
                                                                                        : ""
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                        </div>
                                                        <div className="row">
                                                            <div className='col'></div>
                                                            <div className='col'>
                                                                <div className='card border-0' style={{ height: "40px" }}>
                                                                    <ReactPaginate
                                                                        previousLabel={"<"}
                                                                        nextLabel={">"}
                                                                        breakLabel={"..."}
                                                                        breakClassName={"break-me"}
                                                                        pageCount={this.state.pageCount}
                                                                        onPageChange={this.handlePageClick}
                                                                        containerClassName={"pagination Customer"}
                                                                        subContainerClassName={"pages pagination"}
                                                                        activeClassName={"active"}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className='row'>
                                                    <div className='col'>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontSize: "16px", fontWeight: "bold", fontStyle: "Poppins, sans-serif" }}><FaIcons.FaQuestionCircle />&nbsp;Any Queries </p>
                                                    </div>
                                                </div>
                                                <hr className='col-11' style={{ marginTop: "-10px" }} />
                                                <div class="row" style={{ color: "rgb(5, 54, 82)" }}>
                                                    <div class="col-3">
                                                        <p style={{ fontWeight: "bold", fontStyle: "Poppins, sans-serif" }}>Mail To</p>
                                                    </div>
                                                    <div class="col-1">
                                                        <p style={{}}>:</p>
                                                    </div>
                                                    <div class="col-7" style={{ marginLeft: "-35px" }}>
                                                        <p style={{ fontStyle: "Poppins, sans-serif" }}><FaIcons.FaEnvelope /><span>&nbsp;info@imfast.in, customercare@imfast.in</span></p>

                                                    </div>
                                                </div>
                                                <div class="row" style={{ color: "rgb(5, 54, 82)" }}>
                                                    <div class="col-3">
                                                        <p style={{ fontWeight: "bold", fontStyle: "Poppins, sans-serif" }}>Call us on Toll Free Number</p>
                                                    </div>
                                                    <div class="col-1">
                                                        <p style={{}}>:</p>
                                                    </div>
                                                    <div class="col-7" style={{ marginLeft: "-35px" }}>
                                                        <p style={{ fontStyle: "Poppins, sans-serif" }}><FaIcons.FaPhone /><span>&nbsp;08046632400</span></p>

                                                    </div>
                                                </div>
                                                <div class="row" style={{ color: "rgb(5, 54, 82)" }}>
                                                    <div class="col-3">
                                                        <p style={{ fontWeight: "bold", fontStyle: "Poppins, sans-serif" }}>Office Address</p>
                                                    </div>
                                                    <div class="col-1">
                                                        <p style={{}}>:</p>
                                                    </div>
                                                    <div class="col-7" style={{ marginLeft: "-35px" }}>
                                                        <p style={{ fontStyle: "Poppins, sans-serif" }}><FaIcons.FaAddressCard /><span>&nbsp;No 5, 3F, Katha No. 10/5, Yashodhanagar, Bellary Road, Bangalore-560064 CIN: U72200KA2020PTC131606</span></p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <button id='closeAccModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter6">
                    </button>
                    <div className="modal fade" id="exampleModalCenter6" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" id='textContent' style={{}}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Account Closing</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div style={{ display: "" }} className="col">
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Reason For Closing</p>
                                                    <textarea type="text" style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-control" onChange={this.closeReason}
                                                        placeholder="Enter Your Reason" rows={3} cols={30} maxLength={255}>
                                                    </textarea>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' id='loanAcceptInputButtons' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={() => this.setCloseMyAcc("getOtp")}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-content" id='otpContent' style={{ display: "none" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Enter OTP For Closing Account</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div style={{ display: "" }} className="col">
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile OTP</p>
                                                    <input className='form-control' type='number' placeholder='Enter OTP' id='loanAcceptInput' onChange={this.closeAccOtp}
                                                        onInput={(e) => {
                                                            e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                        }}
                                                        autoComplete='off' style={{ marginTop: "-10px" }} />
                                                </div>
                                            </div>

                                            <div className='row mt-2'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <p id="countdown" style={{ color: "grey" }}></p>
                                                    <p id='countdown2' style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }} onClick={() => this.setCloseMyAcc("getOtp")}></p>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' id='loanAcceptInputButtons' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={() => this.setCloseMyAcc("submitOtp")}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
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

export default withTranslation()(FacSupport)