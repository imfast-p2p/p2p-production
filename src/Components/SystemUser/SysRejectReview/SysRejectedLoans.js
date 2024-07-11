import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from "../SystemUserSidebar";
import $ from 'jquery';
import { FaAngleLeft, FaEllipsisV } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from "react-confirm-alert";
import editRole from '../../assets/editRole.png';
import openIt from '../../assets/AdminImg/openit.png'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
//updated

export class SysRejectedLoans extends Component {

    constructor(props) {
        super(props)
        this.state = {
            offset: 0,
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",
            rejectedList: [],

            LoanReqno: "",
            reviewerComment: "",
            reviewStatus: "",

            //Credit Score
            Evlmodulation: "",
            cbd: "",
            gincome: "",
            riskscore: "",
            lvr: "",
            ldef: "",
            nde: "",
            dispAmt: "",
            pmonth: "",

            //Loaninfo
            productid: "",
            facilitatorid: "",
            facilitatorverified: "",
            isstatementsverified: "",
            loanamtrequested: "",
            loanpurpose: "",
            loanrequestdate: "",
            loansize: "",
            noofrepaymentsrequested: "",

            //LoanOffer info
            noofrepaymentsoffered: "",
            loanamtoffered: "",
            loanofferdate: "",
            loanofferEmi: "",
            loanofferIntRate: "",
            loanofferRiskRate: "",
        }
    }
    componentDidMount = () => {
        this.rejectedLists()
    }
    perPage = (event) => {
        this.setState({ perPage: event.target.value })
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
            rejectedList: slice
        })
    }
    rejectedLists = (event) => {
        fetch(BASEURL + '/lms/getrejectedloanlist', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    this.setState({ showLoader: false })

                    var list = resdata.msgdata;
                    list.sort((a, b) => {
                        return new Date(b.rejectedon).getTime() - new Date(a.rejectedon).getTime()
                    })
                    console.log(list);
                    this.setState({ rejectedList: list })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        rejectedList: slice
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
                }
            }).catch((error) => {
                console.error(error);
            });
    }
    review = (loanreqnumber) => {
        this.setState({ LoanReqno: loanreqnumber })
        $("#reviewModal").click()
    }
    reviewerComment = (event) => {
        this.setState({ reviewerComment: event.target.value })
    }
    selectStatus = (event) => {
        this.setState({ reviewStatus: event.target.value })
    }
    setRejectedloanStatus = () => {
        fetch(BASEURL + '/lms/setrejectedloanstatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: this.state.LoanReqno,
                reviewercomment: this.state.reviewerComment,
                status: parseInt(this.state.reviewStatus)
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
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
            }).catch((error) => {
                console.error(error);
            });
    }

    creditScore = (loanreqnumber,
        creditscoreinfo
    ) => {
        this.setState({ LoanReqno: loanreqnumber })

        console.log(this.state.LoanReqno)
        var creditScoreJson = creditscoreinfo;
        console.log(creditScoreJson)
        this.setState({ Evlmodulation: creditScoreJson.evlmodulation })
        this.setState({ cbd: creditScoreJson.cbd })
        this.setState({ gincome: creditScoreJson.gincome })
        this.setState({ riskscore: creditScoreJson.riskscore })
        this.setState({ lvr: creditScoreJson.lvr })
        this.setState({ ldef: creditScoreJson.ldef })
        this.setState({ nde: creditScoreJson.nde })
        this.setState({ pmonth: creditScoreJson.permonth })
        this.setState({ dispAmt: creditScoreJson.disposalamount })
        $("#creditScoreModal").click()
    }
    loanInfo = (loanreqnumber, loaninfo) => {
        this.setState({ LoanReqno: loanreqnumber })

        console.log(this.state.LoanReqno)
        var loanInfoJson = loaninfo;
        console.log(loanInfoJson)

        this.setState({ productid: loanInfoJson.productid })
        this.setState({ facilitatorid: loanInfoJson.facilitatorid })
        this.setState({ facilitatorverified: loanInfoJson.facilitatorverified })
        this.setState({ isstatementsverified: loanInfoJson.isstatementsverified })
        this.setState({ loanamtrequested: loanInfoJson.loanamtrequested })
        this.setState({ loanpurpose: loanInfoJson.loanpurpose })
        this.setState({ loanrequestdate: loanInfoJson.loanrequestdate })
        this.setState({ loansize: loanInfoJson.loansize })
        this.setState({ noofrepaymentsrequested: loanInfoJson.noofrepaymentsrequested })
        $("#loanInfoModal").click()
    }
    loanOfferInfo = (loanreqnumber, loanofferinfo) => {
        this.setState({ LoanReqno: loanreqnumber })

        console.log(this.state.LoanReqno)
        var loanofferinfoJson = loanofferinfo;

        console.log(loanofferinfoJson)
        this.setState({ noofrepaymentsoffered: loanofferinfoJson.noofrepaymentsoffered })
        this.setState({ loanamtoffered: loanofferinfoJson.loanamtoffered })
        this.setState({ loanofferdate: loanofferinfoJson.loanamtoffereddate })
        this.setState({ loanofferEmi: loanofferinfoJson.emi })
        this.setState({ loanofferIntRate: loanofferinfoJson.interestrate })
        this.setState({ loanofferRiskRate: loanofferinfoJson.riskrating })

        $("#loanofferinfoModal").click()
    }
    handleChange() {
        $('.text').toggle();
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
        console.log(this.state.rejectedList)
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <SystemUserSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' style={{ marginLeft: "40px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Loan Requests Review</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            &nbsp; {t('Loan Requests Review')} </a> </li>
                                    </ul>

                                </div>
                            </div>

                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.rejectedList == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No lists available.</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll1'>
                                                        <Table responsive>
                                                            <Thead>
                                                                <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Loan request number')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Rejected by')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Rejected reason')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Rejected on')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>

                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.rejectedList.map((lists, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.loanreqnumber}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.rejectedby}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.rejectedreason}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{new Date(lists.rejectedon).toLocaleDateString('en-GB').split("/").join("-")}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>
                                                                            <span className="dropdown">

                                                                                <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                    className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                    <a class="dropdown-item" onClick={this.creditScore.bind(this, lists.loanreqnumber, lists.creditscoreinfo)}>Credit Score Info.</a>
                                                                                    <a class="dropdown-item" onClick={this.loanInfo.bind(this, lists.loanreqnumber, lists.loaninfo)}>Loan Info.</a>
                                                                                    <a class="dropdown-item" onClick={this.loanOfferInfo.bind(this, lists.loanreqnumber, lists.loanofferinfo)}>Loan Offer Info.</a>
                                                                                    <a class="dropdown-item" onClick={this.review.bind(this, lists.loanreqnumber)}>Set Loan Status</a>

                                                                                </div>
                                                                            </span>
                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.rejectedList.length > 1 &&
                                                            <div className="row justify-content-end">
                                                                <div className='col-auto'>
                                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                                        <div style={{ marginTop: "-25px", marginLeft: "16px" }}>
                                                                            <ReactPaginate
                                                                                previousLabel={"<"}
                                                                                nextLabel={">"}
                                                                                breakLabel={"..."}
                                                                                breakClassName={"break-me"}
                                                                                pageCount={this.state.pageCount}
                                                                                onPageChange={this.handlePageClick}
                                                                                containerClassName={"pagination"}
                                                                                subContainerClassName={"pages pagination"}
                                                                                activeClassName={"active"}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>}
                                                    </div>
                                                </>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* CreditScoreModal*/}
                    <button type="button" id='creditScoreModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter1">
                        CreditScore modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter1" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Credit Score</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan request number</p>
                                                    <p style={{ marginTop: "-10px" }}>{this.state.LoanReqno}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Gross Income</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>₹ {this.state.gincome}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Disposal Amount</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>₹ {this.state.dispAmt}</p>
                                                </div>
                                            </div><div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Per month</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>₹ {this.state.pmonth}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Number Of Default Loans</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.ldef}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Number Of Check Bounce</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.cbd}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan value ratio</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.lvr}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Evaluator Moderation</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.Evlmodulation}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Risk Score</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.riskscore}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Non Discretionary Expense Value</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.nde}</p>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }} >Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* loanInfoModal*/}
                    <button type="button" id='loanInfoModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2">
                        loanInfoModal modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle2" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Loan Info</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan request number</p>
                                                    <p style={{ marginTop: "-10px" }}>{this.state.LoanReqno}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Product ID</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.productid}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Facilitator ID</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.facilitatorid}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Facilitator verified</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.facilitatorverified === 1 ? "Verified" : this.state.facilitatorverified === 0 ? "Not Verified" : "-"}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Statement verified</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.isstatementsverified === 1 ? "Verified" : this.state.isstatementsverified === 0 ? "Not Verified" : "-"}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan Amount Requested</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.loanamtrequested}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan Purpose</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.loanpurpose}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan requested on</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.loanrequestdate}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan Size</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.loansize}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>No. of repayments requested</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.noofrepaymentsrequested}</p>
                                                </div>
                                            </div>

                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }} >Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* loanofferinfoModal*/}
                    <button type="button" id='loanofferinfoModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3">
                        loanofferinfoModal modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle3" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Loan Offer Info</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan request number</p>
                                                    <p style={{ marginTop: "-10px" }}>{this.state.LoanReqno}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>No. of repayments offered</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.noofrepaymentsoffered}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan amount offered</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>₹ {this.state.loanamtoffered}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan Offer date</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.loanofferdate}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan Offer EMI</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>₹ {this.state.loanofferEmi}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Interest rate</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.loanofferIntRate} P.A.</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Risk rate</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.loanofferRiskRate}</p>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }} >Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Review*/}
                    <button type="button" id='reviewModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Review modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Review</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan request number</p>
                                                    <p style={{ marginTop: "-10px" }}>{this.state.LoanReqno}</p>
                                                    {/* <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px", textTransform: 'uppercase' }}
                                                        id="inputAddress" placeholder={t('Enter Loan request number')}  readOnly
                                                    /> */}
                                                </div>
                                            </div>
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Reviewer Comment</p>
                                                    <textarea type="text" class="form-control" onChange={this.reviewerComment}
                                                        rows={3} cols={30} maxLength={255}
                                                        placeholder="Description" style={{ color: "rgb(5, 54, 82)", marginTop: "-10px" }}>
                                                    </textarea>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Status</p>
                                                    <select className='form-select' onChange={this.selectStatus} style={{ marginTop: "-10px" }}>
                                                        <option defaultValue>Select Status</option>
                                                        <option value="1">Approve</option>
                                                        <option value="2">Reject</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setRejectedloanStatus}>Submit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }} >Cancel</button>
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
export default withTranslation()(SysRejectedLoans)