import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import SystemUserSidebar from './SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import dashboardIcon from '../assets/icon_dashboard.png';
import { FaAngleLeft, FaEllipsisV, FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css'
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import openIt from '../assets/AdminImg/openit.png';
import editRole from '../assets/editRole.png';
import batch from '../assets/batch.png';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

var sptTxnRef = "";

var totalAmounts = "";
export class SuspenceTransaction extends Component {
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
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            sptStatus: "",
            error: "",

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

            totalAmounts: "0",
            totalTxns: "0",
            suspenseTxnRefno: ""
        }
        this.suspenceTran = this.suspenceTran.bind(this);
        this.fromdate = this.fromdate.bind(this);
        this.todate = this.todate.bind(this);
        this.bankrefno = this.bankrefno.bind(this);
    }
    fromdate = (event) => {
        this.setState({ fromdate: event.target.value })
        // const selectedFromDate = event.target.value;
        // const selectedToDate = this.state.todate;

        // if (this.isDifferenceWithinSixMonths(selectedFromDate, selectedToDate)) {
        //     this.setState({ fromdate: selectedFromDate, error: '' });
        //     $("#suspenceTxnBtn").prop('disabled', false);
        // } else {
        //     this.setState({
        //         fromdate: selectedFromDate,
        //         error: "Date ranges should not exceed 6 months.",
        //     });
        //     $("#suspenceTxnBtn").prop('disabled', true);
        // }
    }
    todate = (event) => {
        this.setState({ todate: event.target.value })
        // const selectedFromDate = this.state.fromdate;
        // const selectedToDate = event.target.value;

        // if (this.isDifferenceWithinSixMonths(selectedFromDate, selectedToDate)) {
        //     this.setState({ todate: selectedToDate, error: '' });
        //     $("#suspenceTxnBtn").prop('disabled', false);
        // } else {
        //     this.setState({
        //         todate: selectedToDate,
        //         error: "Date ranges should not exceed 6 months.",
        //     });
        //     $("#suspenceTxnBtn").prop('disabled', true);

        // }
    }
    // isDifferenceWithinSixMonths = (fromDate, toDate) => {
    //     const sixMonthsInMilliseconds = 6 * 30 * 24 * 60 * 60 * 1000; // Approximate

    //     const difference = new Date(toDate) - new Date(fromDate);

    //     return difference <= sixMonthsInMilliseconds;
    // };
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
        this.setState({ fromdate: frday })

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

                    var totalAmt = this.state.earningList.reduce((acc, obj) => {
                        return acc + parseFloat(obj.amt);
                    }, 0).toFixed(2);
                    this.setState({ totalAmounts: totalAmt })
                    console.log(totalAmt);

                    var totalTxn = this.state.earningList.length;
                    this.setState({ totalTxns: totalTxn });
                    console.log(totalTxn)
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
    componentDidMount() {
        console.log(sessionStorage.getItem('token'));
        this.loadDate();
    }
    SetStatus = (mode, sptxnno) => {
        console.log(sptxnno)
        var mode = mode;
        sptTxnRef = sptxnno;

        this.setState({ suspenseTxnRefno: sptxnno })
        if (mode == "PUPI" || mode == "MOBILE COLLECTION" || mode == "INCOMING RTGS" || mode == "IUPI") {
            // IUPI
            // MOBILE COLLECTION
            // INCOMING RTGS
            // PUPI
            // var payMode = "Inward"
            this.setState({ payMode: "INWARD" })
        } else if (mode == "OUPI" || mode == "OIMPS" || mode == "BPY(NEFT PAYMENT)") {
            // OUPI
            // OIMPS
            // BPY(NEFT PAYMENT)
            this.setState({ payMode: "OUTWARD" })
        }
        $("#setSptTxnStatusModal").click();
    }
    sptComments = (e) => {
        this.setState({ sptComments: e.target.value })
    }
    sptStatus = (e) => {
        this.setState({ sptStatus: e.target.value })
    }
    setSptTxnStatus = () => {
        console.log(sptTxnRef)
        fetch(BASEURL + '/lms/setsuspensetxnstatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                sptxnrefno: sptTxnRef,
                comments: this.state.sptComments,
                status: this.state.sptStatus,
                mode: this.state.payMode
            })
        }).then((Response) => {
            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata);
                    $("#exampleModalCenter").modal("hide");
                    alert(resdata.message)
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


    // demojson=()=>{

    //     setInputsfileAttachment({
    //         ...inputsfileAttachment,
    //         [nameofModel]: { "fieldLable": label, "fieldDesc": fieldDesc, "attachmentType": attachmentdataType, "maxAttachmentSize": MaxAttachmentSize, "inputField": nameofModel, "key": ##atchmt##${nameofModel}## }
    //     })
    // }
    handleChange() {
        console.log(window.innerWidth);
        if (window.innerWidth <= 360) {
            // $("#sidebar-wrapper").toggle();
            $(".component-to-toggle").toggle();
        } else {
            $('.text').toggle();
            $('#PImage').toggle();
            $('#Pinfo').toggle();
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
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            marginLeft: "14px"
        }
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
                <div className="component-to-toggle">
                    <SystemUserSidebar />
                </div>
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Suspense Transaction</p>
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
                    {/* <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>{t('Suspense Transaction')}</p>
                        </div>
                    </div> */}

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-25px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            &nbsp; {t(' Suspense Transaction')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col-lg-2 col-md-3 col-sm-6 mb-2'>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('From Date*')}</p>
                                    <input id="Fdate" type="date"
                                        defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            width: "100%",
                                            height: "34px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px"
                                        }} />
                                </div>
                                <div className='col-lg-2 col-md-3 col-sm-6 mb-2'>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('To Date*')}</p>
                                    <input id="Tdate" type="date"
                                        defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            width: "100%",
                                            height: "34px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px"
                                        }} />
                                </div>
                                <div className='col-lg-3 col-md-4 col-sm-12 mb-2'>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('Bank Ref No.(Optional)')}</p>
                                    <input type='text' className='form-control' placeholder='Reference No.' style={{ height: "34px" }} onChange={this.bankrefno} />
                                </div>
                                <div className='col-lg-3 col-md-4 col-sm-12 mb-2'>
                                    <p style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('Payment Mode')}</p>
                                    <select className='form-select' style={{ height: "34px" }} onChange={this.paymentMode}>
                                        <option defaultValue>Select</option>
                                        <option value="inward">Inward to P2P</option>
                                        <option value="outward">Outward to P2P</option>
                                        <option value="NONCUST">Non customer</option>
                                    </select>
                                </div>
                                <div className="col-lg-1 col-md-2 col-sm-12 mb-2  align-items-end">
                                    <button type="button" className="btn btn-sm text-white" style={{
                                        backgroundColor: "rgb(0, 121, 191)",
                                        marginTop: "25px",
                                        width: "100px",
                                    }}
                                        id='suspenceTxnBtn'
                                        onClick={this.suspenceTran}>{t('Apply')}</button>
                                </div>
                            </div>

                            <div class="d-flex flex-row" style={{ fontWeight: "600", fontSize: "14px", color: "rgba(5,54,82,1)", marginTop: "-10px" }}>
                                {/* <div class="pt-2 pb-3 pr-1">Show</div>
                                <div class="pt-2 pb-2"><input type='number' name="number" value={this.state.perPage} style={{ width: "39px", height: "18px", paddingLleft: "4px", fontWeight: "600", fontSize: "14px" }} onChange={this.perPage} /></div>
                                <div class="pt-2 pb-3 pl-1">Entries in a page</div>
                                &nbsp; */}
                                <div class="pt-2 pb-3 pr-1">Total transactions: <span style={{ fontWeight: "400" }}>{this.state.totalTxns}</span></div>
                                <div class="pt-2 pb-3 pr-1 pl-4">Amount: <span style={{ fontWeight: "400" }}>₹ {parseFloat(this.state.totalAmounts).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span></div>
                            </div>

                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.earningList == "" ?
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Mode')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Amount')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Channel')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Transaction Date')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Status')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>


                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.earningList.map((sub, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}> {
                                                                            sub.mode === "PUPI" || sub.mode === "MOBILE COLLECTION" || sub.mode === "INCOMING RTGS" || sub.mode === "IUPI" ? (
                                                                                <>Inward {`(${sub.mode})`}</>
                                                                            ) : sub.mode === "OUPI" || sub.mode === "OIMPS" || sub.mode === "BPY(NEFT PAYMENT)" ? (
                                                                                < >Outward {`(${sub.mode})`}</>
                                                                            ) : (
                                                                                <>Other Case</>
                                                                            )
                                                                        }</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>₹ {parseFloat(sub.amt).toFixed(2)}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{sub.channel === "BI" ? "Bank Interface" : <span>{sub.channel === "PG" ? "Payment Gateway" : ""}</span>}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{sub.txndatetime}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>
                                                                            {sub.status === "FAILED" ? (
                                                                                <span style={{ color: "rgb(255,165,0)", fontWeight:"500" }}>Failed</span>
                                                                            ) : sub.status === "NONCUST" ? (
                                                                                <span style={{ color: "rgb(23, 173, 58)", fontWeight:"500" }}>Noncustomer</span>
                                                                            ) : (
                                                                                <span></span>
                                                                            )}
                                                                        </Td>

                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>
                                                                            <span className="dropdown">

                                                                                <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                    className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                    <a class="dropdown-item" onClick={this.viewMoreDetails.bind(this, sub)}>More Details</a>
                                                                                    {sub.status !== "NONCUST" && (
                                                                                        <a class="dropdown-item" onClick={this.SetStatus.bind(this, sub.mode, sub.sptxnno)}>Set Status</a>
                                                                                    )}

                                                                                </div>
                                                                            </span>
                                                                        </Td>

                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.earningList.length > 1 &&
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

                    {/*sptTxnStatusModal*/}
                    <button type="button" id='setSptTxnStatusModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Spt Txn Status modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Set Suspense Transaction Status</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />

                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Status*</p>
                                                    <select className='form-select' onChange={this.sptComments} style={{ marginTop: "-10px" }}>
                                                        <option defaultValue>Select Status</option>
                                                        <option value="NONCUST">NONCUST</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Comments*</p>
                                                    <textarea type="text" className="form-control" placeholder='Reason for changing status' style={{ marginTop: "-10px" }} onChange={this.sptComments}></textarea>
                                                    <p>*Note: After this setting, this transaction will not be available for customer claim"</p>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setSptTxnStatus}>Submit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }} >Cancel</button>
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

export default withTranslation()(SuspenceTransaction)