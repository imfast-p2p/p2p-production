import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import { FaAngleLeft, FaFolderPlus } from "react-icons/fa";
import dashboardIcon from '../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import * as FaIcons from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import $ from 'jquery';
// import '../Pagination.css'
// import './Support.css';

var paymentRelFlag;
export class Support extends Component {
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
        }
        this.issuetype = this.issuetype.bind(this);
        this.raiseSupportTicket = this.raiseSupportTicket.bind(this);
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
    getIssuTypes = () => {
        fetch(BASEURL + '/grievance/getallissuetypes', {
            method: 'Get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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
        var value;
        if (paymentRelFlag.includes("PY")) {
            value = JSON.stringify({
                loginname: "",
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
                    paymenttoaccount: this.state.paymenttoaccount
                }
            })
        } else {
            value = JSON.stringify({
                loginname: "",
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
    cancel = () => {
        window.location.reload();
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
                <div className="main-content" id="page-content-wrapper" style={{ paddingBottom: "183px" }}>
                    <div className="container-fluid row pt-2">
                        <div className='col-5' id="" style={{ marginLeft: "75px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/login">Home</Link> / Support</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="" style={{ marginRight: "37px" }}>
                            <button style={myStyle}>
                                <Link to="/login" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "83px", width: "84.4%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-3' id='headingRef' style={{ marginLeft: "34px" }}>
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
                                    <li class="nav-item mb-2" >
                                        <a class="nav-link" id="contact-tab" data-toggle="tab"
                                            href="#contact" role="tab" aria-controls="contact" aria-selected="false"><FaIcons.FaRegAddressCard />&nbsp;Contact Us</a>
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
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Issue Type*')}</p>
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
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Bank Ref. No.*')}</p>
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
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Payment Date*')}</p>
                                                        <input className='form-control' type='date' style={{ marginTop: "-12px" }} onChange={this.paymentDate} />
                                                        {this.state.isPaymentDateValid === false ? <p className='text-danger'>Future date can not be selected as payment date</p> : ""}
                                                    </div>
                                                </div>
                                                <div className='row mb-2 paymentRelatedTag' style={{ display: "none" }}>
                                                    <div className='col-6'>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Payment Purpose*')}</p>
                                                        <select className='form-select' onChange={this.paymentPurp} style={{ marginTop: "-12px" }}>
                                                            <option defaultValue>Select Payment Purpose</option>
                                                            <option value="1">Borrower due payment</option>
                                                            <option value="2">Repayment</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Amount*')}</p>
                                                        <input className='form-control' type='text' placeholder='Enter Amount' style={{ marginTop: "-12px" }} onChange={this.Amount} />
                                                        {this.state.isAmountValid === false ? <p className='text-danger'>Please enter a valid amount.</p> : ""}
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className='col-6 paymentRelatedTag' style={{ display: "none" }}>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Payment To Account*')}</p>
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
                                                        <button
                                                            className='btn btn-sm' id="raisetktbtn"
                                                            // disabled={this.state.issueDescFlag === false ? true : false}
                                                            style={{ backgroundColor: "rgb(136, 189, 72)", color: "white" }}
                                                            onClick={this.raiseSupportTicket}
                                                        >
                                                            Raise Ticket
                                                        </button>&nbsp;&nbsp;
                                                        <button className='btn btn-sm' style={{ backgroundColor: "#0074BF", color: "white" }} onClick={this.cancel}>Cancel</button>
                                                    </div>
                                                </div>
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

                </div>
            </div>
        )
    }
}

export default withTranslation()(Support)
