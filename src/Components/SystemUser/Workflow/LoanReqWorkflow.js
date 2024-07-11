import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaAngleLeft, FaEdit, FaAngleRight } from "react-icons/fa";
import { FcOk } from "react-icons/fc";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import '../ProductConfig/ProductDefinition/ProductDefinition.css';
import openIt from '../../assets/AdminImg/openit.png'
import us from '../../assets/AdminImg/pro.png';
import editRole from '../../assets/editRole.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import pic3 from '../../assets/AdminImg/picture.png';
import sysUser from '../../assets/All.png';
import './LoanWorkflow.css';
import { GiSandsOfTime, GiTimeTrap } from "react-icons/gi";
import { MdNotStarted } from "react-icons/md";

export class LoanReqWorkflow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",
            loanOfferList: [
                {
                    "borrowerid": "BOR-0000100042",
                    "productid": "ICASH",
                    "loanrequestdate": "2024-01-04",
                    "loanoutstanding": "100.00",
                    "loanaccountoverdue": "0",
                    "loanreqno": "R0000001303",
                    "rejectreason": "",
                    "isstmtsverified": "9",
                    "disbursementdate": "2024-01-04",
                    "repaymentfrequency": "2",
                    "loanaccountstatus": "1",
                    "loanclosuredate": "",
                    "loanlistingno": "L0000001303",
                    "loanamt": "100.00",
                    "p2pfeeschargesoutstanding": "0.00",
                    "loanstatus": "3",
                    "offeredamt": "100.00",
                    "requestedamt": "100.00",
                    "loanaccountno": "L0000001303",
                    "emiamt": "17.00",
                    "lastrepaymentdate": "2024-01-10",
                    "tenurerequested": "6",
                    "name": "Elango",
                    "tenureoffered": "6",
                    "repaymentfrequencydesc": "Day(s)"
                }
            ],
            toggle: false,
            workflowLists: [],
            toggle: null,
        }
    }
    componentDidMount() {
    }
    getLoanReqWfStages = (loanreqno) => {
        var Lists = [
            {
                "performedBy": "BOR-0000000011",
                "comments": "",
                "productId": "HOME",
                "activity": "Loan Request raising",
                "isEnabled": "1",
                "activityStatus": "2",
                "currentActivityId": "LN10",
                "updatedOn": "2023-11-29 00:00:00.0",
                "createdOn": ""
            },
            {
                "performedBy": "BOR-0000000011",
                "comments": "",
                "productId": "HOME",
                "activity": "Facilitation",
                "isEnabled": "1",
                "activityStatus": "0",
                "currentActivityId": "LN11",
                "updatedOn": "2023-11-29 00:00:00.0",
                "createdOn": ""
            },
            {
                "performedBy": "BOR-0000000011",
                "comments": "",
                "productId": "HOME",
                "activity": "Evaluation",
                "isEnabled": "1",
                "activityStatus": "9",
                "currentActivityId": "LN12",
                "updatedOn": "2023-11-29 00:00:00.0",
                "createdOn": ""
            },
            {
                "performedBy": "BOR-0000000011",
                "comments": "",
                "productId": "HOME",
                "activity": "Offer Generation",
                "isEnabled": "1",
                "activityStatus": "1",
                "currentActivityId": "LN13",
                "updatedOn": "2023-11-29 00:00:00.0",
                "createdOn": ""
            }
        ]
        this.setState({ workflowLists: Lists })

        // fetch(BASEURL + '/usrmgmt/getloanreqwfstages?loanrequestnumber='+loanreqno, {
        //     method: 'GET',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Authorization': "Bearer " + token
        //     }
        // }).then((Response) => Response.json())
        //     .then((resdata) => {
        //         if (resdata.status === 'Success'||'success'||'SUCCESS') {
        //             this.setState({steps:resdata.msgdata})
        //         }
        //         else {
        //         }
        //     })
    }
    handleToggle = (loan, loanreqno, isstmtsverified, productid, loanstatus) => {
        if (this.state.toggle === loanreqno) {
            // setToggle(null);
            this.setState({ toggle: null });
            return false
        }
        this.getLoanReqWfStages(loanreqno);
        this.setState({ toggle: loanreqno })
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
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
        console.log(this.state.steps);
        const Results = () => (
            <>
                <div className="form-row" style={{ marginLeft: "16px" }}>
                    <div className='col-3' id='headinglndwl'>
                        <div className="two__image" style={{ paddingLeft: "10px", marginLeft: "-10px" }}>
                            <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Workflow Stages</p>
                        </div>
                    </div>
                </div>
                <div className="form-row mb-2" style={{ marginLeft: "3px" }}>
                    <div className='col'>
                        <MdNotStarted />&nbsp;<span style={{ fontSize: "14px", color: "rgb(5, 54, 82)" }}>Not Initiated</span>
                        &nbsp; &nbsp;
                        <GiSandsOfTime />&nbsp;<span style={{ fontSize: "14px", color: "rgb(5, 54, 82)" }}>Initiated</span>
                        &nbsp; &nbsp;
                        <FcOk />&nbsp;<span style={{ fontSize: "14px", color: "rgb(5, 54, 82)" }}>Completed</span>
                    </div>
                </div>
                <div className="row pl-2 pr-2">
                    <div class="main">
                        <ul id="progress">
                            {this.state.workflowLists.map((step, index) => {
                                return (
                                    <li key={index} className={step.activityStatus === "2" || step.activityStatus === "9" ? 'active' : ''} style={{ color: step.activityStatus === "2" || step.activityStatus === "9" ? '#fff' : 'rgb(5, 54, 82)' }}>
                                        {step.activityStatus === "2" || step.activityStatus === "9" ? <FcOk /> : <span>{step.activityStatus === "0" ? <MdNotStarted /> : <GiSandsOfTime />}</span>} <span>{step.activity}</span>
                                    </li>
                                )
                            }
                            )}
                        </ul>
                    </div>
                </div>
            </>

        );
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Loan Requests</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="ProductDefRes3">
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    {/* New Design */}
                    <div className='container-fluid row' style={{ paddingLeft: "86px", marginTop: "-20px" }}>
                        <div className='card' style={{ cursor: "default" }}>
                            <div className='row pt-2 pl-2 pr-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"><a data-toggle="pill" id="myNavLink" href="#activeproducts" className="nav-link active"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }} ><img src={sysUser} style={{ width: "20px" }} /> &nbsp; {t('Loan Requests')} </a> </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="tab-content h-100">
                                <div class="tab-pane fade show active " id="activeproducts" role="tabpanel" style={{ marginBottom: "20px" }}>
                                    {/* Heading of entities */}
                                    <div className='row' style={{ marginLeft: "26px", fontWeight: "600", color: "rgba(5,54,82,1)" }}>
                                        <div className='col-3'>
                                            <p style={{ marginLeft: "-18px" }}>Loan Request Number</p>
                                        </div>
                                        <div className='col-3'>
                                            <p style={{ marginLeft: "40px" }}>Request Amount</p>
                                        </div>
                                        <div className='col-3'>
                                            <p style={{ marginLeft: "53px" }}>Request Date</p>
                                        </div>
                                        <div className='col'>

                                        </div>

                                    </div>
                                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-6px" }} />
                                    {/* lists */}
                                    <div className='row' id='container' style={{ marginTop: "-20px" }}>
                                        <div className='col-12' id='header'>
                                            {
                                                this.state.loanOfferList.map((loan, index) => {
                                                    return (
                                                        <div key={loan.loanreqno}>
                                                            {/* {loan.loanaccountstatus == 0 ? */}
                                                            <div className="row">
                                                                <div className="col">
                                                                    <div className='row' href="javascript:;">
                                                                        <div className='col'>
                                                                            <div className='card border-0' style={{ cursor: "default", marginBottom: "-10px", border: "1px solid rgba(40,116,166,1)", borderRadius: "5px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                                <div className="row item-list align-items-center" style={{ color: "rgba(5,54,82,1)", paddingTop: "10px" }}>
                                                                                    <div className="col-4 ">
                                                                                        <h6 className="pl-4" style={{ fontWeight: "490" }}>{loan.loanreqno}</h6>
                                                                                    </div>
                                                                                    <div className="col-3">

                                                                                        <h6 style={{ fontWeight: "490" }}>₹ {loan.requestedamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h6>
                                                                                    </div>
                                                                                    <div className="col-3">

                                                                                        <h6 style={{ fontWeight: "490" }}>{loan.loanrequestdate} </h6>
                                                                                    </div >
                                                                                    <div class="col pb-2" style={{ cursor: "pointer" }}>
                                                                                        <button className='btn btn-sm text-white' onClick={() => this.handleToggle(loan, loan.loanreqno, loan.isstmtsverified, loan.productid, loan.loanstatus)}
                                                                                            style={{ backgroundColor: "rgb(0, 121, 191)" }}>View</button>
                                                                                    </div>
                                                                                </div>
                                                                                {(loan.loanreqno === this.state.toggle) ?
                                                                                    <div id="content" style={{ border: "1px solid rgba(40,116,166,1)", borderRadius: "5px", paddingTop: "4px", paddingBottom: "4px" }}>
                                                                                        <Results loanData={loan} />
                                                                                    </div> : ''}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* : null
                                            } */}
                                                        </div>
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
            </div >
        )
    }
}

export default withTranslation()(LoanReqWorkflow)