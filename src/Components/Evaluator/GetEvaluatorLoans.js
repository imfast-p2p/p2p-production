import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import { Link } from 'react-router-dom';
import * as CgIcons from "react-icons/cg";
import * as AiIcons from "react-icons/ai";
import $ from 'jquery';
import EvaluatorSidebar from '../../SidebarFiles/EvaluatorSidebar';
import { withTranslation } from 'react-i18next';
import { FaAngleLeft, FaEye, FaSearch, FaTimesCircle,FaEllipsisV } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import v1 from '../assets/All.png';
import v2 from '../assets/verfied.png';
import v3 from '../assets/notVerified.png';
import verified from '../assets/verification.png';
import notEvaluated from '../assets/NotEvaluated.png';
import Evaluated from '../assets/Evaluated.png';
import batch from '../assets/batch.png';
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import openIt from '../assets/AdminImg/openit.png'
import editRole from '../assets/editRole.png';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

//updated
var verificationStatusValue = 0;
export class GetEvaluatorLoans extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loanDetails: [],
            verificationStatus: "0",
            rejectReason: "",

            offset: 0,
            loanOfferList: [],
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            query: '',
            searchString: [],

            rejectedList: [],
            rjoffset: 0,
            rjloanOfferList: [],
            rjorgtableData: [],
            rjperPage: 5,
            rjcurrentPage: 0,
            rjpageCount: "",

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
        this.status = this.status.bind(this);
        this.getEvlLoans = this.getEvlLoans.bind(this)
    }

    componentDidMount() {
        this.getEvlLoans();
    }
    status = () => {
        verificationStatusValue = ""
        this.getEvlLoans();
    }
    status1 = () => {
        verificationStatusValue = 0
        this.getEvlLoans();

    }
    status2 = () => {
        verificationStatusValue = 1
        this.getEvlLoans();
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
            loanDetails: slice
        })
    }

    rjhandlePageClick = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.rjperPage;
        this.setState({
            rjcurrentPage: selectedPage,
            rjoffset: offset
        }, () => {
            this.rjloadMoreData();
        })
    }
    rjloadMoreData = () => {
        const data = this.state.rjorgtableData;
        const slice = data.slice(this.state.rjoffset, this.state.rjoffset + this.state.rjperPage)
        this.setState({
            rjpageCount: Math.ceil(data.length / this.state.rjperPage),
            rejectedList: slice
        })
    }

    getEvlLoans() {
        console.log(verificationStatusValue);
        fetch(BASEURL + `/lsp/getevalloans/?verificationstatus=${verificationStatusValue}`, {
            method: 'get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    var list = resdata.msgdata;
                    list.reverse()
                    this.setState({ loanDetails: list });

                    console.log(this.state.loanDetails)
                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        loanDetails: slice
                    })

                    // list.sort((a, b) =>{
                    //     return new Date(b.loanreqdate).getTime()-new Date(a.loanreqdate).getTime()
                    // })
                    // console.log(list);

                    // var loanDetails2=[];
                    // var loanDetails1=[];
                    // resdata.msgdata.forEach(element => {
                    //    if(element.evalstatus==2){

                    //     loanDetails2.push(element);


                    //    }else{
                    //     loanDetails1.push(element);
                    //    }

                    // });
                    // console.log(loanDetails1)
                    // console.log(loanDetails2)
                    // this.setState({loanDetails1:loanDetails1,loanDetails2:loanDetails2});
                    // alert(resdata.message)
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

    getEvlAppraisal(loanreqno) {
        console.log(loanreqno);
        sessionStorage.setItem("loanreqno", loanreqno);
        window.location = "/evalCreditAppraisal";
    }
    rejectReason = (rejectedreason) => {
        console.log(rejectedreason);

        console.log(this.state.rejectReason);
        if (rejectedreason == "") {
            this.setState({ rejectReason: "-" });
            $("#rejectModal").click();
        } else if (rejectedreason) {
            this.setState({ rejectReason: rejectedreason });
            $("#rejectModal").click();
        }
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

                    // this.setState({ rejectedList: resdata.msgdata })
                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.rjoffset, this.state.rjoffset + this.state.rjperPage)
                    console.log(slice)

                    this.setState({
                        rjpageCount: Math.ceil(data.length / this.state.rjperPage),
                        rjorgtableData: data,
                        rejectedList: slice
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
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    searchInput = () => {
        let filter = document.getElementById("myInput").value.toUpperCase();
        let myTable = document.getElementById("myTable");
        let tr = myTable.getElementsByTagName("tr");

        for (let i = 0; i < tr.length; i++) {
            let td = tr[i].getElementsByTagName("td")[1]; // Adjust the index to match the correct column

            if (td) {
                let textValue = td.textContent || td.innerHTML;
                if (textValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    searchInput2 = () => {
        let filter = document.getElementById("myInput2").value.toUpperCase();
        let myTable = document.getElementById("myTable2");
        let tr = myTable.getElementsByTagName("tr");

        for (var i = 0; i < tr.length; i++) {
            let td = tr[i].getElementsByTagName("td")[1];

            if (td) {
                let textValue = td.textContent || td.innerHTML;
                if (textValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }

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
        const myStyle2 = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            cursor: "pointer",
            fontSize: "12px",
            // height: "25px",
            width: "150px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            padding: "7px 0px"
        }
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F4F7FC" }}>
                <EvaluatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/evaluatorDashboard">Home</Link> / Loan Evaluation</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/evaluatorDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "-5px" }} />
                    {/* New Design */}
                    <button type="button" id='rejectModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Launch demo modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />View Reject Reason</p>
                                            <hr style={{ width: "50px" }} />
                                            <div>
                                                <p style={{ color: "rgba(5,54,82,1)" }}>{this.state.rejectReason}</p>
                                                {/* <p style={{ color: "rgba(5,54,82,1)"}}>Some Reject Reason Message will print out</p> */}
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(0, 121, 191)" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='container-fluid row' style={{ paddingLeft: "86px", marginTop: "-25px" }}>
                        <div className='card' style={{overflow:"auto"}}>
                            <div className='row pt-2 pl-2 pr-2'>
                                <div className='col' style={{ fontSize: "14px" }}>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item" onClick={this.status}> <a data-toggle="pill" id="myNavLink" href="#myEarning-details" className="nav-link "
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }} ><img src={v1} style={{ width: "20px" }} /> &nbsp; {t('All')} </a> </li>
                                        <li className="nav-item" onClick={this.status1}> <a data-toggle="pill" id="myNavLink" href="#myEarning-details" className="nav-link active"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}><img src={v3} style={{ width: "30px" }} /> &nbsp;{t(' Not Evaluated')} </a> </li>
                                        <li className="nav-item" onClick={this.status2}> <a data-toggle="pill" id="myNavLink" href="#myEarning-details" className="nav-link"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}><img src={v2} style={{ width: "30px" }} /> &nbsp;{t(' Evaluated')} </a> </li>
                                        <li className="nav-item" onClick={this.rejectedLists}> <a data-toggle="pill" id="myNavLink" href="#rejectedLoans-details" className="nav-link"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}><FaTimesCircle /> &nbsp;{t('Rejected Loans')} </a> </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="tab-content h-100">
                                <div class="tab-pane fade show active" id="myEarning-details" role="tabpanel" style={{ marginBottom: "20px",marginTop:"-10px" }}>
                                    <div className='row mb-3'>
                                        <div className='col-12' style={{ paddingRight: "45px" }}>
                                            <div className="row example">
                                                <div className='col-md-10 col-sm-9 col-xs-8'>
                                                    <input type="text" id="myInput" class="form-control" placeholder="Search with request number" style={{ height: "38px", color: "rgb(5, 54, 82)" }} name="search" autoComplete='off' onKeyUp={this.searchInput} />
                                                </div>
                                                <div className='col-md-2 col-sm-3 col-xs-4' >
                                                    <button style={myStyle2}>
                                                        <FaSearch style={{ fontSize: "15px" }} />&nbsp;<span style={{ textDecoration: "none", color: "white", fontSize: "15px" }}>Search</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.loanDetails == "" ?
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
                                                            <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Request Date')}</Th>
                                                            <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Request Number')}</Th>
                                                            <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Facilitator ID')}</Th>
                                                            <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('CE Score')}</Th>
                                                            <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Verified?')}</Th>
                                                            <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "center" }}>{t('Evaluated?')}</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody id='myTable'>
                                                        {this.state.loanDetails.map((loan, index) => (
                                                            <Tr key={index} style={{
                                                                marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                            }}>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{loan.loanreqdate.split("-").reverse().join("-")}</Td>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{loan.loanreqno}</Td>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{loan.facid}</Td>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{loan.cescore ? loan.cescore : "-"}</Td>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{loan.facverified == 1 ? <span>Verified</span> :
                                                                    loan.facverified == 0 ? <span>Not Verified</span> :
                                                                        loan.facverified == 9 ? <span>Skipped</span> : ""}</Td>

                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "center", }}>
                                                                    {loan.evalstatus == 1 ?
                                                                        <button className="btn text-white btn-sm" style={{ backgroundColor: "rgb(0, 121, 191)", fontSize: "14px" }}
                                                                            onClick={this.getEvlAppraisal.bind(this, loan.loanreqno)}>&nbsp;<img src={notEvaluated} width="20px" />&nbsp;Not Evaluated</button>
                                                                        : <button className='btn btn-sm' style={{ color: "rgb(0, 121, 191)", cursor: "default", fontWeight: "bold" }}>&nbsp;<img src={Evaluated} width="20px" />&nbsp;Evaluated</button>}
                                                                </Td>
                                                            </Tr>
                                                        ))}
                                                    </Tbody>
                                                </Table>
                                                &nbsp;
                                                {this.state.loanDetails.length > 0 &&
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
                                <div class="tab-pane fade show" id="rejectedLoans-details" role="tabpanel" style={{ marginBottom: "20px" }}>
                                    <div className='row mb-3'>
                                        <div className='col-12' style={{ paddingRight: "45px" }}>
                                            <div className="row example">
                                                <div className='col-md-8 col-sm-9 col-xs-8'>
                                                    <input type="text" id="myInput2" class="form-control" placeholder="Search with request number" style={{ height: "38px", color: "rgb(5, 54, 82)" }} name="search" autoComplete='off' onKeyUp={this.searchInput2} />
                                                </div>
                                                <div className='col-md-2 col-sm-3 col-xs-4'>
                                                    <button style={myStyle2}>
                                                        <FaSearch style={{ fontSize: "15px" }} />&nbsp;<span style={{ textDecoration: "none", color: "white", fontSize: "15px" }}>Search</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                                            <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Rejected Date')}</Th>
                                                            <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Request Number')}</Th>
                                                            <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Facilitator ID')}</Th>
                                                            <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Risk Score')}</Th>
                                                            <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Verified?')}</Th>
                                                            <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Rejected by')}</Th>
                                                            <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('View Reject Reason')}</Th>
                                                            <Th style={{ fontWeight: "600", marginTop: "5px"}} ></Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody id='myTable2'>
                                                        {this.state.rejectedList.map((rjloan, index) => (
                                                            <Tr key={index} style={{
                                                                marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                            }}>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{new Date(rjloan.rejectedon).toLocaleDateString('en-GB').split("/").join("-")}</Td>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{rjloan.loanreqnumber}</Td>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{rjloan.loaninfo.facilitatorid}</Td>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{rjloan.creditscoreinfo.riskscore}</Td>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{rjloan.loaninfo.facilitatorverified == 1 ? "Verified" : "Not verified"}</Td>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{rjloan.rejectedby}</Td>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "center", }}>
                                                                <FaEye style={{ fontSize: "30px", color: "rgba(0,121,190,1)", marginLeft: "-50px" }} onClick={this.rejectReason.bind(this, rjloan.rejectedreason)} />
                                                                </Td>
                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>

                                                                            <span className="dropdown">

                                                                                <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                    className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                    <a className="dropdown-item"  onClick={this.creditScore.bind(this, rjloan.loanreqnumber, rjloan.creditscoreinfo)}>Credit Score info</a>
                                                                                    <a className="dropdown-item" onClick={this.loanInfo.bind(this, rjloan.loanreqnumber, rjloan.loaninfo)}>Loan Info</a>
                                                                                    <a className="dropdown-item" onClick={this.loanOfferInfo.bind(this, rjloan.loanreqnumber, rjloan.loanofferinfo)}>Loan Offer info</a>
                                                                                </div>
                                                                            </span>
                                                                        </Td>
                                                            </Tr>
                                                        ))}
                                                    </Tbody>
                                                </Table>
                                                &nbsp;
                                                {this.state.rejectedList.length > 0 &&
                                                    <div className="row justify-content-end">
                                                        <div className='col-auto'>
                                                            <div className='card border-0' style={{ height: "40px" }}>
                                                                <div style={{ marginTop: "-25px", marginLeft: "16px" }}>
                                                                    <ReactPaginate

                                                                        previousLabel={"<"}
                                                                        nextLabel={">"}
                                                                        breakLabel={"..."}
                                                                        breakClassName={"break-me"}
                                                                        pageCount={this.state.rjpageCount}
                                                                        onPageChange={this.rjhandlePageClick}
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
                                                    <p>
                                                        ₹ {parseFloat(this.state.dispAmt).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
                                                </div>
                                            </div><div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Per month</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>
                                                        ₹ {parseFloat(this.state.pmonth).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
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
                                                    <p>₹ {this.state.productid}</p>
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
                                                    <p>{this.state.facilitatorverified}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Statement verified</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>{this.state.isstatementsverified}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan Amount Requested</p>
                                                </div>
                                                <div className='col-1' style={{ fontWeight: "500" }}>:</div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>
                                                        ₹ {parseFloat(this.state.loanamtrequested).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
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
                                                    <p>{this.state.loanrequestdate.split("-").reverse().join("-")}</p>
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
                </div>
            </div>
        );

    }
}

export default withTranslation()(GetEvaluatorLoans);