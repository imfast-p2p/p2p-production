import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import EvaluatorSidebar from '../../SidebarFiles/EvaluatorSidebar';
import { FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { withTranslation } from "react-i18next";
import Tooltip from "@material-ui/core/Tooltip";

export class ExtStmtInfo extends Component {
    constructor() {
        super();
        this.state = {
            pInfo: "1",
            TxInfo: "2",

            pInfoList: [],
            TxInfoList: [],

            offset: 0,
            loanOfferList: [],
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",
        }
    }
    componentDidMount() {
        console.log(sessionStorage.getItem('loanreqno'))
        console.log(sessionStorage.getItem('docName'))
        this.getborStmtInfo();
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
            TxInfoList: slice
        })
    }
    getborStmtInfo = () => {
        fetch(BASEURL + '/lms/getextractedstmtinfo?loanreqno=' + sessionStorage.getItem('loanreqno') + '&docid=' + sessionStorage.getItem('docName') + '&infotype=' + this.state.pInfo, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ pInfoList: resdata.msgdata.header })
                    console.log(this.state.pInfoList);
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
                    // window.location='/getEvaluatorLoans'
                }
            })
    }
    getborStmtInfo2 = () => {
        $('#BTxn-details').show();
        fetch(BASEURL + '/lms/getextractedstmtinfo?loanreqno=' + sessionStorage.getItem('loanreqno') + '&docid=' + sessionStorage.getItem('docName') + '&infotype=' + this.state.TxInfo, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ TxInfoList: resdata.msgdata.txnlist })
                    console.log(this.state.TxInfoList);

                    var data = resdata.msgdata.txnlist
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        TxInfoList: slice
                    })
                } else {
                    alert("Issue: " + resdata.message);
                    // window.location='/getEvaluatorLoans'
                }
            })
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const { t } = this.props;
        const reqno = sessionStorage.getItem('loanreqno');
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F4F7FC" }}>
                <EvaluatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='myEarningsRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-9' id='myEarningsRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/evaluatorDashboard">Home</Link>/ <Link to="/getEvaluatorLoans">Loan Evaluation</Link>/ <Link to="/evalCreditAppraisal">Evaluator Credit Appraisal</Link>/ Extracted Statement Info</p>
                        </div>

                        <div className="col" id='myEarningsRes3' style={{ textAlign: "end" }}>
                            <button style={myStyle}>
                                <Link to="/evalCreditAppraisal"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className="container-fluid row" style={{ paddingLeft: "86px" }}>
                        <div className='card'>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" style={{ fontSize: "15px" }}>
                                        <li className="nav-item"> <a data-toggle="pill" href="#Personal-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }} onClick={this.getborStmtInfo}>Personal Details</a> </li>
                                        <li className="nav-item"> <a data-toggle="pill" href="#Txn-details" className="nav-link detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }} onClick={this.getborStmtInfo2}>Transaction Details</a> </li>
                                    </ul>
                                </div>
                            </div>
                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="Personal-details" className=" register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.pInfoList == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No lists available.</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                        <Table responsive>
                                                            <Thead>
                                                                <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Keyword')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Value')}</Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.pInfoList.map((lists, index) => (
                                                                    <Tr key={index} style={{
                                                                        color: "rgba(5,54,82,1)",
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default',
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{lists.keyword}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>
                                                                            <Tooltip title={lists.value}>
                                                                                <span>
                                                                                    {typeof lists.value === 'string'
                                                                                        ? lists.value.substring(0, 90) + ".."
                                                                                        : ''}
                                                                                </span>
                                                                            </Tooltip>
                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        {/* &nbsp;
                                                        {this.state.reqNos.length > 1 &&
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
                                                            </div>} */}
                                                    </div>
                                                </>}
                                        </div>
                                        <div id="Txn-details" className=" register-form tab-pane fade" style={{ cursor: "default" }}>
                                            {this.state.TxInfoList == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No lists available.</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                        <Table responsive>
                                                            <Thead>
                                                                <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('TXN. Date')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Reference No.')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Description')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t('Credit')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t('Debit')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t('Balance')}</Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.TxInfoList.map((List, index) => (
                                                                    <Tr key={index} style={{
                                                                        color: "rgba(5,54,82,1)",
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default',
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{List.valuedate == "" ? "-" : List.txndate.split("-").reverse().join("-")}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>
                                                                            <Tooltip title={List.refno}>
                                                                                <span>{(List.refno).substring(0, 24) + ".."}</span>
                                                                            </Tooltip>
                                                                        </Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>
                                                                            <Tooltip title={List.desc}>
                                                                                <span>{(List.desc).substring(0, 40) + ".."}</span>
                                                                            </Tooltip>
                                                                        </Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>₹&nbsp;{List.credit == "" ? "-" : List.credit}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>₹&nbsp;{List.debit == "" ? "-" : List.debit}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>₹&nbsp;{List.balance == "" ? "-" : List.balance}</Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.TxInfoList.length > 1 &&
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
                </div>
            </div>
        );
    }
}

export default withTranslation()(ExtStmtInfo);
