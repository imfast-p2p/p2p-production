import React, { Component } from 'react';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import $, { event } from 'jquery';
import './SysCustomerSupport.css';
import { withTranslation } from 'react-i18next';
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaAngleLeft, FaEllipsisV } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';

import totalTick from '../../assets/AdminImg/totTick.png';
import openTick from '../../assets/AdminImg/openTick.png';
import openIt from '../../assets/AdminImg/openit.png';
import { confirmAlert } from 'react-confirm-alert';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import Tooltip from "@material-ui/core/Tooltip";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

export class Reconcilation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            paymentComplaintList: [],

            offset: 0,
            perPage: 10,
            currentPage: 0,
            pageCount: "",
        }
    }
    componentDidMount() {
        this.paymentcomplaintList();
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
            paymentComplaintList: slice
        })
    }
    paymentcomplaintList = (event) => {
        fetch(BASEURL + '/lms/getpaymentcomplaintlist', {
            method: 'Get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    this.setState({ paymentComplaintList: resdata.msgdata })

                    var data = resdata.msgdata;
                    data.sort((a, b) => {
                        return new Date(b.paymentdate).getTime() - new Date(a.paymentdate).getTime()
                    })

                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        paymentComplaintList: slice
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
    }

    RouteReconcile = (complaintrefno,
        paymentdate,
        userid,
        paymenttype,
        amt) => {
        sessionStorage.setItem("complaintRefNo", complaintrefno);
        sessionStorage.setItem("paymentDate", paymentdate);
        sessionStorage.setItem("complaintUID", userid);
        sessionStorage.setItem("complaintPaymentType", paymenttype);
        sessionStorage.setItem("complaintAmt", amt);

        //window.location="/suspenseTransactions";
        $("#suspenseTxn").click()
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
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <SystemUserSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Payment Reconciliation</p>
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
                    {/* <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>{t('Payment Reconciliation')}</p>
                        </div>
                    </div> */}


                    {/* {this.state.paymentComplaintList == "" ?
                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                            <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                <p>No lists available.</p>
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
                                            <p style={{ marginLeft: "25px", fontWeight: "600" }}>{t('Date')}</p>
                                        </div>
                                        <div className='col-lg-2 col-md-5 col-sm-8'>
                                            <p style={{ fontWeight: "600", marginLeft: "5px" }}>{t('User ID')}</p>
                                        </div>
                                        <div className='col-lg-3 col-md-5 col-sm-8'>
                                            <p style={{ fontWeight: "600", marginLeft: "5px" }}>{t('Complaint Reference No.')}</p>
                                        </div>

                                        <div className='col-lg-2 col-md-5 col-sm-8'>
                                            <p style={{ fontWeight: "600", marginLeft: "5px" }}>{t('Payment Type')}</p>
                                        </div>
                                        <div className='col-lg-2 col-md-5 col-sm-8' >
                                            <p style={{ fontWeight: "600", marginLeft: "5px" }}>{t('Amount')}</p>
                                        </div>
                                        <div className='col-lg-1 col-md-1 col-sm-1' >

                                        </div>
                                    </div>
                                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                  
                                    <div className="scrollbar" style={{
                                        height: `${this.state.paymentComplaintList.length <= 5 ? "150px" : this.state.paymentComplaintList.length >= 10 && "300px"}`,
                                        overflowY: 'auto',
                                        marginTop: "-16px"
                                    }}>
                                        {this.state.paymentComplaintList.map((lists, index) => {
                                            return (
                                                <div className='col' key={index}>
                                                    <div className='card border-0' style={{ marginBottom: "-15.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                        <div className="row item-list align-items-center">
                                                            <div className="col-lg-2 col-md-5 col-sm-8" style={{ paddingLeft: "11px" }}>
                                                                <p className="ml-4 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap" }}>
                                                                    {new Date(lists.paymentdate).toLocaleDateString('en-GB').split("/").join("-")}
                                                                </p>
                                                            </div >
                                                            <div className="col-lg-2 col-md-5 col-sm-8">
                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.userid}</p>
                                                            </div >
                                                            <div className="col-lg-3 col-md-5 col-sm-8">
                                                                <Tooltip title={lists.complaintrefno}>
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>
                                                                        {lists.complaintrefno.substring(0, 23) + ".."}
                                                                    </p>
                                                                </Tooltip>
                                                            </div>
                                                            <div className="col-lg-2 col-md-5 col-sm-8" >
                                                                <Tooltip title={lists.paymenttype}>
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>
                                                                        {lists.paymenttype.substring(0, 18) + ".."}
                                                                    </p>
                                                                </Tooltip>
                                                            </div>
                                                            <div className="col-lg-2 col-md-5 col-sm-8" >
                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>₹{parseFloat(lists.amt).toFixed(2)}</p>
                                                            </div>
                                                            <div className='col-lg-1 col-md-5 col-sm-8' >
                                                                <img src={openIt} style={{ height: "29px" }}
                                                                    class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                &nbsp;
                                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-140px" }}>
                                                                    <a class="dropdown-item"
                                                                        onClick={this.RouteReconcile.bind(this, lists.complaintrefno, lists.paymentdate, lists.userid, lists.paymenttype, lists.amt)}
                                                                    >Suspense Transactions</a>
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
                        </>} */}


                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            &nbsp; {t('Payment Reconciliation')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.paymentComplaintList == "" ?
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Date')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('User ID')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Complaint Reference No.')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Payment Type')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "end" }}>{t('Amount')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.paymentComplaintList.map((lists, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}> {new Date(lists.paymentdate).toLocaleDateString('en-GB').split("/").join("-")}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.userid}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}><Tooltip title={lists.complaintrefno}>
                                                                            <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>
                                                                                {lists.complaintrefno.substring(0, 23) + ".."}
                                                                            </p>
                                                                        </Tooltip></Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}><Tooltip title={lists.paymenttype}>
                                                                            <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>
                                                                                {lists.paymenttype.substring(0, 18) + ".."}
                                                                            </p>
                                                                        </Tooltip></Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "end", }}>₹{parseFloat(lists.amt).toFixed(2)}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>
                                                                            <span className="dropdown">
                                                                                <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                    className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                    <a className="dropdown-item" onClick={this.RouteReconcile.bind(this, lists.complaintrefno, lists.paymentdate, lists.userid, lists.paymenttype, lists.amt)}>Suspense Transactions</a>

                                                                                </div>
                                                                            </span>

                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.paymentComplaintList.length > 1 &&
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

                    {/* Route to SuspenseTransaction page */}
                    <Link to="/suspenseTransactions"><button id='suspenseTxn' style={{ display: "none" }}>Refresh
                    </button></Link>
                </div>
            </div>
        )
    }
}

export default withTranslation()(Reconcilation)