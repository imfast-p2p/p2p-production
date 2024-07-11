import React, { Component } from 'react';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import $, { event } from 'jquery';
import './SysCustomerSupport.css';
import { withTranslation } from 'react-i18next';
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaAngleLeft, FaUserTimes, FaUserCheck } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import a1 from '../../assets/AdminImg/approve.png'
import a2 from '../../assets/AdminImg/notapprove.png';
import Tooltip from "@material-ui/core/Tooltip";

export class SysuserGrievReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fromdate: "",
            todate: "",
            dtoday: "",
            dfrday: "",

            greviencestatus: "0",
            grievReportList: [],

            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",
            orgtableData: [],

            issueList: [],
            issueType: "",

        }
    }
    componentDidMount() {
        this.loadDate();
        this.grievReportStatus();
        //this.getIssuTypes()
    }
    fromDate = (event) => {
        this.setState({ fromdate: event.target.value })
    }
    toDate = (event) => {
        this.setState({ todate: event.target.value })
    }
    issuestatus = (event) => {
        this.setState({ greviencestatus: event.target.value })
        console.log(this.state.greviencestatus)
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
            grievReportList: slice
        })
    }

    loadDate = () => {
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

    // getIssuTypes = () => {
    //     fetch(BASEURL + '/grievance/getallissuetypes', {
    //         method: 'Get',
    //         headers: {
    //             'Authorization': "Bearer " + sessionStorage.getItem('token')
    //         },
    //     }).then((Response) => {
    //         console.log(Response);
    //         return Response.json();
    //     })
    //         .then((resdata) => {
    //             if (resdata.status === 'SUCCESS') {
    //                 console.log(resdata);
    //                 this.setState({ issueList: resdata.msgdata })
    //             } else {
    //                 confirmAlert({
    //                     message: resdata.message,
    //                     buttons: [
    //                         {
    //                             label: "Okay",
    //                             onClick: () => {
    //                             },
    //                         },
    //                     ],
    //                 });
    //                 //alert("Issue: " + resdata.message);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }
    issueType = (e) => {
        this.setState({ issueType: e.target.value })
    }
    grievReportStatus = (event) => {
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
        fetch(BASEURL + '/grievance/grievanceincidents', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                fromdate: frday,
                todate: today,
                greviencestatus: this.state.greviencestatus
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {

                    var list = resdata.msgdata;
                    list.sort((a, b) => {
                        return new Date(b.requestedon).getTime() - new Date(a.requestedon).getTime()
                    })
                    console.log(list);
                    this.setState({ grievReportList: list })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        grievReportList: slice
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
    grievReport = (event) => {
        var data;
        var data2;
        var data3;
        var data4;
        data = JSON.stringify({
            fromdate: this.state.fromdate,
            todate: this.state.todate,
            issuetype: this.state.issueType,
        })
        data2 = JSON.stringify({
            fromdate: this.state.fromdate,
            todate: this.state.todate,
            greviencestatus: this.state.greviencestatus
        })
        data3 = JSON.stringify({
            fromdate: this.state.fromdate,
            todate: this.state.todate,
            issuetype: this.state.issueType,
            greviencestatus: this.state.greviencestatus
        })
        data4 = JSON.stringify({
            fromdate: this.state.fromdate,
            todate: this.state.todate,
        })

        var result;
        if (this.state.issueType && this.state.greviencestatus == "") {
            result = data;
        } else if (this.state.issueType == "" && this.state.greviencestatus) {
            result = data2;
        } else if (this.state.issueType && this.state.greviencestatus) {
            result = data3;
        } else {
            result = data4;
        }


        fetch(BASEURL + '/grievance/grievanceincidents', {
            method: 'POST',
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
                if (resdata.status == 'SUCCESS') {
                    var list = resdata.msgdata;
                    list.sort((a, b) => {
                        return new Date(b.requestedon).getTime() - new Date(a.requestedon).getTime()
                    })
                    console.log(list);
                    this.setState({ grievReportList: list })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        grievReportList: slice
                    })

                } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                }
                            }
                        ]
                    })
                }
            })
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
                        <div className='col-4' style={{ marginLeft: "40px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Grievance Report</p>
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

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-25px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            &nbsp; {t('Grievance Report')} </a> </li>
                                    </ul>

                                </div>
                            </div>

                            <div className='row' style={{ padding: "10px", marginLeft: "-25px", marginTop: "-20px" }}>
                                <div className='col-lg-2 col-md-3 col-sm-4 col-6 Fdate mb-2'>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('From Date*')}</p>
                                    <input type="date"
                                        defaultValue={this.state.dfrday} onChange={this.fromDate} style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            width: "100%",
                                            height: "30px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px"
                                        }} />
                                </div>
                                &nbsp;
                                <div className='col-lg-2 col-md-3 col-sm-4 col-6 Fdate mb-2' style={{ fontSize: "15px" }}>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('To Date*')}</p>
                                    <input type="date"
                                        defaultValue={this.state.dtoday} onChange={this.toDate} style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            width: "100%",
                                            height: "30px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px"
                                        }} />
                                </div>
                                {/* <div className="col-3" style={{ fontSize: "15px" }}>
                                        <p htmlFor="status" style={{ fontWeight: "600", fontSize: "13px", color: "rgba(5,54,82,1)", }}>{t('Issue Type')}: </p>
                                        <select className="form-select" onChange={this.issueType} style={{ height: "35px", marginTop: "-16px" }}>
                                            <option defaultValue>{t('Select Issue Type')}</option>
                                            {this.state.issueList.map((lists, index) => (
                                                <option key={index} value={lists.issuetype}>{lists.issuename}</option>
                                            ))
                                            }
                                        </select>
                                    </div> */}
                                &nbsp;
                                <div className="col-lg-3 col-md-3 col-sm-4 col-6 Fdate mb-2" style={{ fontSize: "15px" }}>
                                    <p htmlFor="status" style={{ fontWeight: "600", fontSize: "13px", color: "rgba(5,54,82,1)", }}>{t('Status')}: </p>
                                    <select className="form-select" onChange={this.issuestatus} style={{ marginTop: "-16px" }}>
                                        <option defaultValue>{t('Select')}</option>
                                        <option value="0">{t('Unassigned')}</option>
                                        <option value="1">{t('Assigned and Processing')}</option>
                                        <option value="2">{t('Closed')}</option>
                                    </select>
                                </div>
                                &nbsp;
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6 Fdate mb-2 align-items-end" style={{ paddingTop: '21px' }}>
                                    <button type="button" className="btn btn-sm text-white" style={{
                                        backgroundColor: "rgb(0, 121, 191)", paddingLeft: "40px", paddingRight: "40px"
                                    }}
                                        onClick={this.grievReport}>{t('Apply')}</button>
                                </div>
                            </div>

                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.grievReportList == "" ?
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Requested On')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Request Number')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Issue Name')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Status')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Reviewer')}</Th>
                                                                    {this.state.grievReportList.some(report => report.status === "0" || report.status === "1") &&
                                                                        <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Reviewed On')}</Th>
                                                                    }
                                                                    {this.state.grievReportList.some(report => report.status === "2") &&
                                                                        <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Closed On')}</Th>
                                                                    }
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.grievReportList.map((report, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{new Date(report.requestedon).toLocaleDateString('en-GB').split("/").join("-")}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{report.reqno}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{report.issuename}</Td>
                                                                        
                                                                        {report.status === "0" && <Td style={{ color: "rgb(199, 188, 34)", fontSize: "14px", fontWeight: "490", textAlign: "left", }}><img src={a2} style={{ height: "19px" }} />&nbsp;Open</Td>}
                                                                        {report.status === "1" && <Td style={{ color: "rgb(29, 143, 63)", fontSize: "14px", fontWeight: "490", textAlign: "left", }}><img src={a1} style={{ height: "19px" }} />&nbsp;Processing</Td>}
                                                                        {report.status === "2" && <Td style={{ color: "rgb(5, 54, 82)", fontSize: "14px", fontWeight: "490", textAlign: "left", }}><FaUserCheck style={{ marginLeft: "-10px" }} />&nbsp;Closed</Td>}
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{report.reviewer ? report.reviewer : "-"}
                                                                        </Td>
                                                                        {this.state.grievReportList.some(report => report.status === "0" || report.status === "1") &&
                                                                            <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{report.reviewedon ? report.reviewedon : "-"}</Td>
                                                                        }
                                                                        {this.state.grievReportList.some(report => report.status === "2") &&
                                                                            <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{report.closedon}</Td>
                                                                        }
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.grievReportList.length > 1 &&
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
        )
    }
}

export default withTranslation()(SysuserGrievReport)