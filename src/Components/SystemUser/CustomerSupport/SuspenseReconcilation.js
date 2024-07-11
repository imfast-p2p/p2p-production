import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import dashboardIcon from '../../assets/icon_dashboard.png';
import { FaAngleLeft, FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css'
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import openIt from '../../assets/AdminImg/openit.png';
import batch from '../../assets/batch.png';

export class SuspenceReconcilation extends Component {

    constructor(props) {
        super(props)
        this.state = {
            earningList: [],
            lenderid: "",
            bankrefno: "",
            fromdate: "",
            todate: "",
            dtoday: "",
            dfrday: "",
            payMode: "",

            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",

            complaintRefno: "",
            sptxnRefno: "",
            reconcileReason: "",

            paymentDate: sessionStorage.getItem("paymentDate"),
            userid: sessionStorage.getItem("complaintUID"),
            complaintrefno: sessionStorage.getItem("complaintRefNo"),
            paymenttype: sessionStorage.getItem("complaintPaymentType"),
            Amount: sessionStorage.getItem("complaintAmt"),

            sptClientref: "",
            sptClientrefno: "",
            sptBankrefno: "",
            sptPaymenttype: "",
            sptReceivedon: "",
            sptTxnrefno: "",

            sptMode: "",
            sptAmount: "",
            sptChannel: "",
            sptDate: "",
            sptStatus: "",
            sptMemmiD: "",
            sptUType: "",
            sptVccacc: "",
        }

        this.suspenceTran = this.suspenceTran.bind(this);
        this.fromdate = this.fromdate.bind(this);
        this.todate = this.todate.bind(this);
        this.bankrefno = this.bankrefno.bind(this);
    }

    fromdate(event) {
        this.setState({ fromdate: event.target.value })
    }
    todate(event) {
        this.setState({ todate: event.target.value })
    }

    bankrefno(event) {
        this.setState({ bankrefno: event.target.value })
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
            earningList: slice
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
        this.setState({ fromdate: frday });
    }
    loadSuspTxn = () => {
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
        fetch(BASEURL + '/lms/getsuspensetxns', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                fromdate: frday,
                todate: today,
                bankrefno: this.state.bankrefno,
                mode: this.state.payMode
            })
        }).then((Response) => {

            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ earningList: resdata.msgdata })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        earningList: slice
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
            })
            .catch((error) => {
                console.log(error)
            })
    }
    paymentMode = (e) => {
        this.setState({ payMode: e.target.value })
    }
    suspenceTran(event) {
        fetch(BASEURL + '/lms/getsuspensetxns', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                fromdate: this.state.fromdate,
                todate: this.state.todate,
                bankrefno: this.state.bankrefno,
                mode: this.state.payMode
            })
        }).then((Response) => {

            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ earningList: resdata.msgdata })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        earningList: slice
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

                    });
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    paymentReconcile = (sptxnno) => {
        this.setState({
            sptxnRefno: sptxnno
        })
        $("#setReconciliationModal").click();
    }
    reconcilReason = (event) => {
        this.setState({ reconcileReason: event.target.value })
    }
    submitReconciliation = () => {
        fetch(BASEURL + '/lms/paymentreconciliation', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                paymentcomplaintrefno: this.state.complaintRefno,
                sptxnrefno: this.state.sptxnRefno,
                reconciliationreason: this.state.reconcileReason,
            })
        }).then((Response) => {

            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata);
                    $("#exampleModalCenter").modal("hide")
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    // this.suspenceTran();
                                    window.location = "/sysUserDashboard";
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                } else {
                    alert(resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    cancelReconciliation = () => {
        let txtinput = document.getElementById('reconReason');
        txtinput.value = "";
    }
    componentDidMount() {
        console.log(sessionStorage.getItem('token'));
        this.loadDate();
        this.setState({ complaintRefno: sessionStorage.getItem("complaintRefNo") })
        this.loadSuspTxn();
    }
    viewMoreDetails = (sub) => {
        console.log(sub)
        this.setState({ sptClientref: sub.clientref })
        this.setState({ sptClientrefno: sub.clientrefno })
        this.setState({ sptBankrefno: sub.bankrefno })
        this.setState({ sptPaymenttype: sub.paymenttype })
        this.setState({ sptReceivedon: sub.receivedon })
        this.setState({ sptTxnrefno: sub.txnrefno })

        this.setState({ sptMode: sub.mode })
        this.setState({ sptAmount: sub.amt })
        this.setState({ sptChannel: sub.channel })
        this.setState({ sptDate: sub.txndatetime })
        this.setState({ sptStatus: sub.status })
        this.setState({ sptMemmiD: sub.memmid })
        this.setState({ sptUType: sub.usertype })
        this.setState({ sptVccacc: sub.vaccno })

        console.log(this.state.sptClientref,
            this.state.sptClientrefno,
            this.state.sptBankrefno,
            this.state.sptPaymenttype,
            this.state.sptReceivedon,
            this.state.sptTxnrefno)
        $("#viewMoremodal").click()
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
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            marginLeft: "14px"
        }
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
                <SystemUserSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/reconcilationList">Reconciliation List</Link> / Select Transaction</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />

                    <div className='row pl-4 font-weight-normal' style={{ marginLeft: "50px", fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)" }}>
                        <div className='col-1'>
                            <p style={{ marginLeft: "-35px", fontWeight: "600" }}>{t('Date')}</p>
                        </div>
                        <div className='col-2'>
                            <p style={{ marginLeft: "39px", fontWeight: "600" }}>{t('User ID')}</p>
                        </div>
                        <div className='col-4'>
                            <p style={{ marginLeft: "40px", fontWeight: "600" }}>{t('Complaint Reference No.')}</p>
                        </div>
                        <div className='col-2' style={{ textAlign: "end" }}>
                            <p style={{ fontWeight: "600" }}>{t('Payment Type')}</p>
                        </div>
                        <div className='col-2' style={{ textAlign: "end" }}>
                            <p style={{ fontWeight: "600" }}>{t('Amount')}</p>
                        </div>
                    </div>
                    <div className="" style={{ marginTop: "-20px" }}>
                        <div className='col'>
                            <div className='card border-0' style={{ transition: 'none', color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px", backgroundColor: 'rgba(242,242,242,1)' }}>
                                <div className="row item-list align-items-center">
                                    <div className="col-2">
                                        <p className="ml-2 p-0" style={{ fontSize: "15px", fontWeight: "490", marginTop: "15px" }}>{new Date(this.state.paymentDate).toLocaleDateString('en-GB').split("/").join("-")}</p>
                                    </div >
                                    <div className="col-2">
                                        <p style={{ fontSize: "15px", fontWeight: "490", paddingTop: "12px" }}>{this.state.userid}</p>
                                    </div >
                                    <div className="col-4">
                                        <p style={{ fontSize: "15px", fontWeight: "490", paddingTop: "12px" }}>{this.state.complaintrefno}</p>
                                    </div>
                                    <div className="col-2">
                                        <p style={{ fontSize: "15px", fontWeight: "490", paddingTop: "12px", width: "180px" }}>
                                            {this.state.paymenttype}
                                        </p>
                                    </div>

                                    <div className='col-2' style={{ textAlign: "center" }}>
                                        <p style={{ fontSize: "15px", paddingTop: "12px", fontWeight: "490" }}>
                                            ₹{parseFloat(this.state.Amount).toFixed(2)}
                                        </p>
                                    </div>

                                </div >
                            </div>
                        </div>
                    </div>
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>{t('Select Transaction')}</p>
                        </div>
                    </div>
                    {/* Select Date */}
                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-2'>
                            <p htmlFor="date" style={{
                                fontWeight: "600",
                                fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                marginBottom: "5px"
                            }}>{t('From Date*')}</p>
                            <input id="Fdate" type="date"
                                defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    // width: "240px",
                                    height: "34px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px"
                                }} />
                        </div>
                        &nbsp;
                        <div className='col-2' style={{ fontSize: "15px" }}>
                            <p htmlFor="date" style={{
                                fontWeight: "600",
                                fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                marginBottom: "5px"
                            }}>{t('To Date*')}</p>
                            <input id="Tdate" type="date"
                                defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    height: "34px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px"
                                }} />
                        </div>
                        <div className='col-3' style={{ fontSize: "15px" }}>
                            <p htmlFor="date" style={{
                                fontWeight: "600",
                                fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                marginBottom: "5px",
                            }}
                            >{t('Bank Ref No.(Optional)')}</p>
                            <input type='text' className='form-control' placeholder='Reference No.' style={{ height: "34px" }} onChange={this.bankrefno} />
                        </div>
                        <div className='col-3' style={{ fontSize: "15px" }}>
                            <p style={{
                                fontWeight: "600",
                                fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                marginBottom: "5px"
                            }}>{t('Payment Mode')}</p>
                            <select className='form-select' style={{ height: "34px" }} onChange={this.paymentMode}>
                                <option defaultValue>Select</option>
                                <option value="inward">Inward to P2P</option>
                                <option value="outward">Outward to P2P</option>
                            </select>
                        </div>
                        <div className="col-1" style={{ paddingTop: '23px' }}>
                            <button type="button" className="btn btn-sm text-white" style={{
                                backgroundColor: "rgb(0, 121, 191)",
                                paddingTop: "6px", paddingBottom: "6px"
                            }}
                                onClick={this.suspenceTran}>{t('Apply')}</button>
                        </div>
                    </div>
                    <div class="d-flex flex-row" style={{ marginLeft: "50px", fontWeight: "600", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                        <div class="pt-2 pb-3 pr-1">Show</div>
                        <div class="pt-2 pb-2"><input type='number' name="number" value={this.state.perPage} style={{ width: "39px", height: "18px", paddingLleft: "4px", fontWeight: "600", fontSize: "14px" }} onChange={this.perPage} /></div>
                        <div class="pt-2 pb-3 pl-1">Entries in a page</div>
                    </div>

                    {this.state.earningList == "" ?
                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                            <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                <p>No suspense transaction records !</p>
                            </div>
                        </div> :
                        <>
                            <div className='scrollbar' id="auditScroll" style={{ marginTop: "-10px" }}>
                                <div style={{
                                    whiteSpace: "nowrap"
                                }} id='secondAuditScroll'>
                                    <div className='row font-weight-normal'
                                        style={{
                                            marginLeft: "25px",
                                            fontWeight: "800",
                                            fontSize: "15px",
                                            color: "rgba(5,54,82,1)",
                                            width: "95%"
                                        }}>
                                        <div className='col-lg-2 col-md-5 col-sm-8'>
                                            <p style={{ marginLeft: "25px", fontWeight: "600" }}>{t('Payment Mode')}</p>
                                        </div>
                                        <div className='col-lg-2 col-md-5 col-sm-8'>
                                            <p style={{ fontWeight: "600", marginLeft: "5px" }}>{t('Amount')}</p>
                                        </div>
                                        <div className='col-lg-3 col-md-5 col-sm-8'>
                                            <p style={{ fontWeight: "600", marginLeft: "5px" }}>{t('Channel')}</p>
                                        </div>

                                        <div className='col-lg-2 col-md-5 col-sm-8'>
                                            <p style={{ fontWeight: "600", marginLeft: "5px" }}>{t('Transaction Date')}</p>
                                        </div>
                                        <div className='col-lg-2 col-md-5 col-sm-8' >
                                            <p style={{ fontWeight: "600", marginLeft: "5px" }}>{t('Status')}</p>
                                        </div>
                                        <div className='col-lg-1 col-md-1 col-sm-1' >

                                        </div>
                                    </div>
                                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                    {/* Lists */}
                                    <div className="scrollbar" style={{
                                        height: `${this.state.earningList.length <= 5 ? "160px" : this.state.earningList.length >= 10 && "300px"}`,
                                        overflowY: 'auto',
                                        marginTop: "-16px"
                                    }}>
                                        {this.state.earningList.map((sub, index) => {
                                            return (
                                                <div className='col' key={index}>
                                                    <div className='card border-0' style={{ marginBottom: "-15.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                        <div className="row item-list align-items-center">
                                                            <div className="col-lg-2 col-md-5 col-sm-8" style={{ paddingLeft: "11px" }}>
                                                                {
                                                                    sub.mode === "PUPI" || sub.mode === "MOBILE COLLECTION" || sub.mode === "INCOMING RTGS" || sub.mode === "IUPI" ? (
                                                                        <p className="ml-4 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap" }}>Inward {`(${sub.mode})`}</p>
                                                                    ) : sub.mode === "OUPI" || sub.mode === "OIMPS" || sub.mode === "BPY(NEFT PAYMENT)" ? (
                                                                        <p className="ml-4 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap" }}>Outward {`(${sub.mode})`}</p>
                                                                    ) : (
                                                                        <p className="ml-4 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap" }}>Other Case</p>
                                                                    )
                                                                }
                                                            </div >
                                                            <div className="col-lg-2 col-md-5 col-sm-8">
                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>₹ {parseFloat(sub.amt).toFixed(2)}</p>
                                                            </div >
                                                            <div className="col-lg-3 col-md-5 col-sm-8">
                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>
                                                                    {sub.channel === "BI" ? "Bank Interface" : <span>{sub.channel === "PG" ? "Payment Gateway" : ""}</span>}
                                                                </p>
                                                            </div>
                                                            <div className="col-lg-2 col-md-5 col-sm-8" >
                                                                {new Date(sub.txndatetime).toLocaleDateString('en-GB').split("/").join("-")}
                                                            </div>
                                                            <div className="col-lg-2 col-md-5 col-sm-8" >
                                                                {sub.status === "FAILED" ? (
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>Failed</p>
                                                                ) : sub.status === "NONCUST" ? (
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>Noncustomer</p>
                                                                ) : (
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}></p>
                                                                )}
                                                            </div>
                                                            <div className='col-lg-1 col-md-5 col-sm-8' >
                                                                <img src={openIt} style={{ height: "29px" }}
                                                                    class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                &nbsp;
                                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-140px" }}>
                                                                    <a class="dropdown-item" onClick={this.viewMoreDetails.bind(this, sub)}>More Details</a>
                                                                    <a class="dropdown-item" onClick={this.paymentReconcile.bind(this, sub.sptxnno)}>Set Reconciliation</a>
                                                                </div>
                                                            </div>
                                                        </div >
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    &nbsp;
                                    <div className="row float-right mr-4">
                                        <div className='card border-0'>
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
                            </div>
                        </>}

                    {/* set reconciliation */}
                    <button type="button" id="setReconciliationModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter" style={{ display: "none" }}>
                        Set reconciliation modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLongTitle" style={{ color: "#00264d" }}>Set Payment Reconciliation</h5>
                                </div>
                                <div class="modal-body">
                                    <div className='row mb-2'>
                                        <div className='col'>
                                            <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Payment Complaint Reference No.</p>
                                            <input className='form-control' type='text' style={{ marginTop: "-10px" }} readOnly value={this.state.complaintRefno} />
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col'>
                                            <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Suspense TXN No.</p>
                                            <input className='form-control' type='text' style={{ marginTop: "-10px" }} readOnly value={this.state.sptxnRefno} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Reconciliation Reason</p>
                                            <textarea type="text" className="form-control" id='reconReason' style={{ marginTop: "-10px" }} onChange={this.reconcilReason} placeholder='Enter Reason'></textarea>
                                        </div>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <div className='row'>
                                        <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                            <button className='btn btn-sm text-white delUpldSubmBtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.submitReconciliation}>Submit</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onClick={this.cancelReconciliation}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* View More Modal */}
                    <button type="button" id='viewMoremodal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter1">
                        View More modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter1" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />More Details</p>
                                            <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                            {
                                                this.state.sptMode != null && this.state.sptMode != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Mode</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            {
                                                                this.state.sptMode === "PUPI" || this.state.sptMode === "MOBILE COLLECTION" || this.state.sptMode === "INCOMING RTGS" || this.state.sptMode === "IUPI" ? (
                                                                    <p className="mb-0" style={{ wordWrap: 'break-word' }}>Inward {`(${this.state.sptMode})`}</p>
                                                                ) : this.state.sptMode === "OUPI" || this.state.sptMode === "OIMPS" || this.state.sptMode === "BPY(NEFT PAYMENT)" ? (
                                                                    <p className="mb-0" style={{ wordWrap: 'break-word' }}>Outward {`(${this.state.sptMode})`}</p>
                                                                ) : (
                                                                    <p className="mb-0" style={{ wordWrap: 'break-word' }}></p>
                                                                )
                                                            }
                                                        </div>
                                                    </div> : ""
                                            }
                                            {
                                                this.state.sptAmount != null && this.state.sptAmount != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Amount</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>₹ {parseFloat(this.state.sptAmount).toFixed(2)}</p>
                                                        </div>
                                                    </div> : ""
                                            }
                                            {
                                                this.state.sptChannel != null && this.state.sptChannel != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Channel</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.sptChannel === "BI" ? "Bank Interface" :
                                                                <span>{this.state.sptChannel === "PG" ? "Payment Gateway" : ""}</span>}
                                                            </p>
                                                        </div>
                                                    </div> : ""
                                            }
                                            {
                                                this.state.sptDate != null && this.state.sptDate != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Transaction Date</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.sptDate}</p>
                                                        </div>
                                                    </div> : ""
                                            }
                                            {
                                                this.state.sptStatus != null && this.state.sptStatus != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Status</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>

                                                            {this.state.sptStatus === "FAILED" ? (
                                                                <p className="mb-0" style={{ wordWrap: 'break-word', color: "rgb(255,165,0)" }}>Failed</p>
                                                            ) : this.state.sptStatus === "NONCUST" ? (
                                                                <p className="mb-0" style={{ wordWrap: 'break-word', color: "rgb(23, 173, 58)" }}>Noncustomer</p>
                                                            ) : (
                                                                <p className="mb-0"></p>
                                                            )}
                                                        </div>
                                                    </div> : ""
                                            }

                                            {
                                                this.state.sptMemmiD != null && this.state.sptMemmiD != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Member ID</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.sptMemmiD}</p>
                                                        </div>
                                                    </div> : ""
                                            }
                                            {
                                                this.state.sptUType != null && this.state.sptUType != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">User Type</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.sptUType == "2" ? "Lender" :
                                                                <span>{this.state.sptUType == "3" ? "Borrower" :
                                                                    <span>{this.state.sptUType == "4" ? "Facilitator" :
                                                                        <span>{this.state.sptUType == "5" ? "Evaluator" : ""}
                                                                        </span>
                                                                    }
                                                                    </span>
                                                                }
                                                                </span>
                                                            }</p>
                                                        </div>
                                                    </div> : ""
                                            }
                                            {
                                                this.state.sptClientref != null && this.state.sptClientref != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Client Reference</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.sptClientref}</p>
                                                        </div>
                                                    </div> : ""
                                            }
                                            {
                                                this.state.sptClientrefno != null && this.state.sptClientrefno != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Client Reference Number</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.sptClientrefno}</p>
                                                        </div>
                                                    </div> : ""
                                            }
                                            {
                                                this.state.sptBankrefno != null && this.state.sptBankrefno !== "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Bank Reference Number</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.sptBankrefno}</p>
                                                        </div>
                                                    </div> : ""
                                            }
                                            {
                                                this.state.sptPaymenttype != null && this.state.sptPaymenttype != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Payment Type</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0">{this.state.sptPaymenttype}</p>
                                                        </div>
                                                    </div> : ""
                                            }
                                            {
                                                this.state.sptReceivedon != null && this.state.sptReceivedon != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Received On</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0">{this.state.sptReceivedon}</p>
                                                        </div>
                                                    </div> : ""
                                            }

                                            {
                                                this.state.sptTxnrefno != null && this.state.sptTxnrefno != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Transaction Reference Number</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.sptTxnrefno}</p>
                                                        </div>
                                                    </div> : ""
                                            }

                                            {
                                                this.state.sptVccacc != null && this.state.sptVccacc != "" ?
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Virtual Account Number</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.sptVccacc}</p>
                                                        </div>
                                                    </div> : ""
                                            }
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" id='okSubmit' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }}>Okay</button>
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

export default withTranslation()(SuspenceReconcilation)