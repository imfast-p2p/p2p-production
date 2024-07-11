import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaAngleDoubleRight, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit, FaFolderPlus, FaDownload, FaRegSave } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import openIt from '../../assets/AdminImg/openit.png'
// import us from '../../assets/AdminImg/pro.png';
// import editRole from '../../assets/editRole.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import batch from '../../assets/batch.png';
// import jsPDF from "jspdf";
import "jspdf-autotable";
import Tooltip from "@material-ui/core/Tooltip";
import cronstrue from "cronstrue";

export class SchedulerMonitoring extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offset: 0,
            orgtableData: [],
            perPage: 20,
            currentPage: 0,
            pageCount: "",
            list: [],
            pdfBtn: false,
            resMsg: "",
            userID: sessionStorage.getItem('userID'),
            loanreqNo: "",
            orderNo: "",
            showLoader: false,
            getSchedulerMonitoringList: []
        }
    }
    componentDidMount() {
        this.getSchedulerMonitoring()
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
            getSchedulerMonitoringList: slice
        })
    }
    getSchedulerMonitoring() {
        var url = `/usrmgmt/getschedulermonitoringlist`
        this.setState({ showLoader: true })
        fetch(BASEURL + url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((response) => {
            console.log("Response:", response);
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success" || resdata.status == "SUCCESS") {
                    this.setState({ showLoader: false })

                    var data = resdata.msgdata
                    console.log(data)
                    if (data) {
                        var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                        console.log(slice)

                        this.setState({
                            pageCount: Math.ceil(data.length / this.state.perPage),
                            orgtableData: data,
                            getSchedulerMonitoringList: slice
                        })
                    }
                } else {
                    this.setState({
                        showLoader: false,
                        resMsg: resdata.message
                    })
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    convertCronToText = (cronExpression) => {
        try {
            return cronstrue.toString(cronExpression);
        } catch (error) {
            return 'Invalid cron expression';
        }
    };
    viewMoreDetails = (lists) => {
        console.log(lists, lists.servicename);
        this.setState({ serviceName: lists.servicename }, () => {
            $("#retriggerModal").click()
        })
    }
    retriggerReason = (event) => {
        this.setState({ retriggerReason: event.target.value })
    }
    retriggerScheduler = () => {
        fetch(BASEURL + '/usrmgmt/retriggerschedulerservice', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                servicename: this.state.serviceName,
                reason: ""
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {

                }
                else {
                }
            })
    }
    reloadPage = () => {
        var msg = this.state.resMsg
        if (msg.includes("successfull")) {
            window.location.reload();
        }
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
        console.log(this.state.groupStatus, this.state.getSchedulerMonitoringList)
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc", marginTop: "-7px" }}>
                < SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Scheduler Monitoring</p>
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
                    <hr className="col-11" style={{ marginLeft: "57px", width: "87%", marginTop: "-5px", backgroundColor: "rgba(4,78,160,1)" }} />

                    <div className='row' style={{ marginTop: "-10px" }}>
                        <div className="col-lg-8 col-sm-6 col-md-10" style={{ textAlign: "end" }}>
                            <p className="" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)", marginRight: "28px" }}>
                                Scheduler Monitoring
                            </p>
                        </div>
                    </div>
                    {/* New Design */}
                    {this.state.getSchedulerMonitoringList == "" ?
                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                            <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                <p>{this.state.resMsg}</p>
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
                                        <div className='col-lg-3 col-md-5 col-sm-8'>
                                            <p style={{ marginLeft: "25px", fontWeight: "600" }}>{t('Service Name')}</p>
                                        </div>
                                        <div className='col-lg-4 col-md-5 col-sm-8'>
                                            <p style={{ fontWeight: "600", marginLeft: "5px" }}>{t('Service Description')}</p>
                                        </div>
                                        <div className='col-lg-2 col-md-5 col-sm-8'>
                                            <p style={{ fontWeight: "600" }}>{t('Cron Time')}</p>
                                        </div>

                                        <div className='col-lg-2 col-md-5 col-sm-8'>
                                            <p style={{ fontWeight: "600" }}>{t('Last Ran On')}</p>
                                        </div>
                                        <div className='col-lg-1 col-md-5 col-sm-8' >

                                        </div>
                                    </div>
                                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                    {/* Lists */}
                                    <div className="scrollbar" style={{
                                        height: `${this.state.getSchedulerMonitoringList.length <= 5 ? "150px" : this.state.getSchedulerMonitoringList.length >= 10 && "300px"}`,
                                        overflowY: 'auto',
                                        marginTop: "-16px"
                                    }}>
                                        {this.state.getSchedulerMonitoringList && this.state.getSchedulerMonitoringList.length > 0 &&
                                            this.state.getSchedulerMonitoringList.map((lists, index) => {
                                                const convertedCron = this.convertCronToText(lists.crontime);
                                                return (
                                                    <div className='col' key={index}>
                                                        <div className='card border-0' style={{ marginBottom: "-15px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                            <div className="row item-list align-items-center">
                                                                <div className="col-lg-3 col-md-5 col-sm-8" style={{ paddingLeft: "11px" }}>
                                                                    {lists.servicename.length > 22 ? (
                                                                        <Tooltip title={lists.servicename}>
                                                                            <p className="ml-4 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap", cursor: "pointer" }}>
                                                                                {lists.servicename.substring(0, 23) + ".."}
                                                                            </p>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <p className="ml-4 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap" }}>
                                                                            {lists.servicename}
                                                                        </p>
                                                                    )}
                                                                </div >
                                                                <div className="col-lg-4 col-md-5 col-sm-8">
                                                                    {lists.servicedesc.length > 39 ? (
                                                                        <Tooltip title={lists.servicedesc}>
                                                                            <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "initial", cursor: "pointer" }}>
                                                                                {lists.servicedesc.substring(0, 40) + ".."}
                                                                            </p>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "initial" }}>
                                                                            {lists.servicedesc}
                                                                        </p>
                                                                    )}
                                                                </div >
                                                                {
                                                                    lists.crontime &&
                                                                    <div className="col-lg-2 col-md-5 col-sm-8">
                                                                        {convertedCron.length > 16 ? (
                                                                            <Tooltip title={convertedCron}>
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "initial", cursor: "pointer" }}>
                                                                                    {convertedCron.substring(0, 16) + ".."}
                                                                                </p>
                                                                            </Tooltip>
                                                                        ) : (
                                                                            <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "initial" }}>
                                                                                {convertedCron}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                }
                                                                <div className="col-lg-2 col-md-5 col-sm-8" >
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", }}>{lists.lastranon ? lists.lastranon : "-"}</p>
                                                                </div>
                                                                <div className='col-lg-1 col-md-5 col-sm-8' >
                                                                    <img src={openIt} style={{ height: "29px" }}
                                                                        class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                    &nbsp;
                                                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-114px" }}>
                                                                        <a class="dropdown-item" onClick={this.viewMoreDetails.bind(this, lists)}
                                                                        >Retrigger Scheduler</a>
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

                    <button type="button" id="retriggerModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter29" style={{ display: "none" }}>
                        Retriger Modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter29" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body" style={{ cursor: "default" }}>
                                    <div className='row mb-2'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />
                                                Retrigger
                                            </p>
                                            <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
                                        </div>
                                    </div>
                                    <div className='row mb-2' style={{ marginTop: "-10px" }}>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Service Name *</p>
                                            <input className='form-control' style={{ marginTop: "-13px" }} value={this.state.serviceName} readOnly />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;
                                                Reason *
                                            </p>
                                            <textarea type="text" style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-control" onChange={this.retriggerReason}
                                                placeholder="Enter Reason" rows={3} cols={30} maxLength={255}>
                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <div className='row'>
                                        <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                            <button className='btn btn-sm text-white' id="retriggerBtn" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.retriggerScheduler}>Submit</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} data-dismiss="modal">Cancel</button>
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

export default withTranslation()(SchedulerMonitoring)