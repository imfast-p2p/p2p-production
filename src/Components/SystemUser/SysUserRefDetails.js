import React, { Component } from 'react';
import $, { event } from 'jquery';
import { BASEURL } from '../assets/baseURL';
import SystemUserSidebar from './SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import dashboardIcon from '../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css'
import { FaAngleLeft } from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import editRole from '../assets/editRole.png';
import openIt from '../assets/AdminImg/openit.png';
import { confirmAlert } from "react-confirm-alert";

var userIDStatus = "";
export class SysUserRefDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            referenceDetails: [],
            referencedetails2: "",
            referencedetails3: "",
            approvestatus: "",

            offset: 0,
            orgtableData: [],
            perPage: 2,
            currentPage: 0,
            pageCount: "",

            reqid: "",
            refmobile: "",
            rcdone: "",
            rcresult: "",
            refcomment: "",

            associateName: sessionStorage.getItem("associateName"),
            associateID: sessionStorage.getItem("useriD"),

            pmType: ""
        }
        this.getRefDetails = this.getRefDetails.bind(this);
    }

    componentDidMount() {
        this.getRefDetails();
        userIDStatus = sessionStorage.getItem('userIDStatus');

        if (sessionStorage.getItem('pmDefault') === "0") {
            this.setState({ pmType: "pmSystemUser" })
        } else {
            this.setState({ pmType: "platformSysUser" })
        }
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
            referenceDetails: slice
        })
    }
    approvestatus = (event) => {
        this.setState({ approvestatus: event.target.value })
    }
    getRefDetails() {
        fetch(BASEURL + '/lsp/getreferencedetails?userid=' + sessionStorage.getItem("useriD"), {
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
                    this.setState({ referenceDetails: resdata.msgdata });
                    this.setState({ referencedetails2: resdata.msgdata[0].refcheckflag })
                    console.log(this.state.referencedetails2)
                    this.setState({ referencedetails3: resdata.msgdata[1].refcheckflag })
                    console.log(this.state.referencedetails3)

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        referenceDetails: slice
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
    approveFacEval = () => {
        fetch(BASEURL + '/lsp/approvefacevl', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                reqid: sessionStorage.getItem('useriD'),
                approvestatus: this.state.approvestatus
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'success') {
                    console.log(resdata);

                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location = "/sysUserDashboard";
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
            })
    }
    verifyrefDetails = (refmobileno, requestorid) => {
        sessionStorage.setItem("refMobile", refmobileno)
        sessionStorage.setItem("reqID", requestorid)

        this.setState({
            refmobile: refmobileno,
            reqid: requestorid
        })
        $("#verifyRefModal").click()
        //window.location = '/verifyRefDetails'
    }
    rcdone = (event) => {
        this.setState({ rcdone: event.target.value })
        if (event.target.value === "1") {
            $("#rcResultMenu").show();
        } else if (event.target.value === "0") {
            $("#rcResultMenu").hide();
        }
    }
    rcresult = (event) => {
        this.setState({ rcresult: event.target.value })
    }
    refcomment = (event) => {
        this.setState({ refcomment: event.target.value })
    }
    verifyReferences = (event) => {
        var withRcResult = JSON.stringify({
            reqid: this.state.reqid,
            refmobile: this.state.refmobile,
            rcdone: this.state.rcdone,
            rcresult: "1",
            refcomment: this.state.refcomment
        })
        var withoutRcResult = JSON.stringify({
            reqid: this.state.reqid,
            refmobile: this.state.refmobile,
            rcdone: this.state.rcdone,
            rcresult: "0",
            refcomment: this.state.refcomment
        })
        var result = this.state.rcdone === "1" ? withRcResult : this.state.rcdone === "0" ? withoutRcResult : "";
        fetch(BASEURL + '/lsp/verifyreferencedetails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: result,
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    //alert(resdata.message)
                    confirmAlert({
                        message: resdata.message,
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
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            marginLeft: "14px"
        }
        const { pmType } = this.state
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <SystemUserSidebar />
                <div className="main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> /
                                {pmType === "pmSystemUser" ?
                                    <Link to="/facEvlList">Facilitator/Evaluator List</Link> :
                                    <Link to="/facEvlList">Associate List</Link>}
                                / Reference Details</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="">
                            <button style={myStyle}>
                                <Link to="/facEvlList" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-3' id='headingRef'>
                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Reference Details</p>
                            </div>
                        </div>
                    </div>

                    <div class="container" style={{ width: "94%" }}>
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <ul class="nav nav-pills flex-column" id="myTab" role="tablist" style={{ fontSize: "18px", fontFamily: "Poppins,sans-serif" }}
                                >
                                    <li class="nav-item mb-2" onClick={this.getIssuTypes}>
                                        <a class="nav-link active" id="ticket-tab" data-toggle="tab"
                                            href="#ticket" role="tab" aria-controls="profile" aria-selected="false"><FaIcons.FaTicketAlt />&nbsp;Reference Details List</a>
                                    </li>
                                    <li class="nav-item mb-2">
                                        <a class="nav-link" id="viewTicket-tab" data-toggle="tab"
                                            href="#view-ticket" role="tab" aria-controls="view-ticket" aria-selected="false"><FaIcons.FaIdCardAlt />&nbsp;Approve Status</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-md-8">
                                <div class="tab-content" id="myTabContent" style={{ marginTop: "-15px", marginLeft: "-20px" }}>
                                    <div class="tab-pane fade show active" id="ticket" role="tabpanel" aria-labelledby="ticket-tab">
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className='row'>
                                                    <div className='col'>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontSize: "18px" }}><FaIcons.FaTicketAlt /><span className="font-weight-bold">&nbsp;Reference Details List</span></p>
                                                    </div>
                                                </div>

                                                <p className="font-weight-bold" style={{ fontWeight: "500", marginBottom: "1px", color: "#222C70", fontSize: "15px" }}>
                                                    Associate: <span style={{ fontWeight: "400" }}>{`${this.state.associateName}` + `(${this.state.associateID})`}</span>
                                                </p>
                                                <p></p>
                                                {/* lists */}
                                                {this.state.referenceDetails == "" || null || undefined ?
                                                    null :
                                                    <>
                                                        <div className='form-row' style={{ marginTop: "-20px" }}>
                                                            {
                                                                this.state.referenceDetails.map((reference, index) => {
                                                                    return (
                                                                        <div className='col-6' key={index}>
                                                                            <div className='card p-3' style={{ border: "2px solid rgb(183, 214, 232)", overflow: "visible", marginBottom: "1px", cursor: "default" }}>
                                                                                <div className='row' style={{ fontSize: "14px", color: "#222C70" }}>
                                                                                    <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Reference Name
                                                                                        <span class="dropup" style={{ float: "right" }}>
                                                                                            <img src={openIt} style={{ height: "35px" }}
                                                                                                class="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                            &nbsp;
                                                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                                {reference.refcheckdone == 1 && reference.refcheckresult == 1 ?
                                                                                                    null :
                                                                                                    <a class="dropdown-item" onClick={this.verifyrefDetails.bind(this, reference.refmobileno, reference.requestorid)}>View Reference Details</a>}
                                                                                            </div>
                                                                                        </span>
                                                                                    </p>

                                                                                    <p style={{ marginTop: "-10px" }}> {reference.refreename}
                                                                                        <hr style={{ color: "rgba(42,143,211,1)" }} />
                                                                                    </p>

                                                                                    <div className='col-6' style={{ marginTop: "-30px" }}>
                                                                                        {/* <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Reference Name</p>
                                                                                        <p>{reference.refreename}</p> */}

                                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Ref. Check Date</p>
                                                                                        <p>{reference.refcheckdate !== "" ?
                                                                                            new Date(reference.refcheckdate).toLocaleDateString('en-GB').split("/").join("-") : "-"
                                                                                        }</p>

                                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Ref. Verified By</p>
                                                                                        <p>{reference.refcheckdone == 1 ?
                                                                                            <p style={{ color: "rgb(56, 138, 15)" }}>{t('Verifiedbysystemuser')}</p>
                                                                                            : <p style={{ color: "rgb(181, 109, 33)" }}>{t('Notyetverified')}<span className='text-primary font-weight-bold'>  &raquo;</span>
                                                                                            </p>}
                                                                                        </p>

                                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Ref. Check Flag</p>
                                                                                        <p>{reference.refcheckflag == 1 ?
                                                                                            <p style={{ color: "rgb(56, 138, 15)" }}>{t('Reference Accepted')}</p>
                                                                                            : reference.refcheckflag == 0 ?
                                                                                                <p style={{ color: "rgb(181, 109, 33)" }}>{t('Reference Not Yet Accepted')}<span className='text-primary font-weight-bold'>  &raquo;</span>
                                                                                                </p> :
                                                                                                <p style={{ color: "rgb(181, 109, 33)" }}>{t('Reference Rejected')}<span className='text-primary font-weight-bold'>  &raquo;</span>
                                                                                                </p>
                                                                                        }
                                                                                        </p>

                                                                                    </div>
                                                                                    <div className='col-6' style={{ marginTop: "-30px" }}>
                                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Request Date</p>
                                                                                        <p>{new Date(reference.requestdate).toLocaleDateString('en-GB').split("/").join("-")}</p>

                                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Ref. Mobile No.</p>
                                                                                        <p>{reference.refmobileno == "" || null ? "-" : reference.refmobileno}</p>

                                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Ref. Check Result</p>
                                                                                        <p>{reference.refcheckresult == 1 ?
                                                                                            <p style={{ color: "rgb(56, 138, 15)" }}>{t('Verification Successfull')}</p>
                                                                                            : reference.refcheckresult == 0 ?
                                                                                                <p style={{ color: "rgb(181, 109, 33)" }}>{t('Notyetverified')}<span className='text-primary font-weight-bold'>&raquo;</span>
                                                                                                </p> :
                                                                                                <p style={{ color: "rgb(181, 109, 33)" }}>{t('Verification Failed')}<span className='text-primary font-weight-bold'>&raquo;</span>
                                                                                                </p>
                                                                                        }
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                        </div>
                                                        <div className="row">
                                                            <div className='col'></div>
                                                            <div className='col'>
                                                                <div className='card border-0' style={{ height: "40px" }}>
                                                                    <ReactPaginate
                                                                        previousLabel={"<"}
                                                                        nextLabel={">"}
                                                                        breakLabel={"..."}
                                                                        breakClassName={"break-me"}
                                                                        pageCount={this.state.pageCount}
                                                                        onPageChange={this.handlePageClick}
                                                                        containerClassName={"pagination Customer"}
                                                                        subContainerClassName={"pages pagination"}
                                                                        activeClassName={"active"}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="view-ticket" role="tabpanel" aria-labelledby="viewTicket-tab">
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                {this.state.referencedetails2 === "1" && this.state.referencedetails3 === "1" && userIDStatus === "1" ?
                                                    <div>
                                                        <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", textAlign: "center" }}>
                                                            References are Approved.
                                                        </p>
                                                    </div> : <>
                                                        <div className='row'>
                                                            <div className='col'>
                                                                <p style={{ color: "rgba(5,54,82,1)", fontSize: "18px" }}><FaIcons.FaTicketAlt /><span className="font-weight-bold">&nbsp;Approve Status *</span></p>
                                                            </div>
                                                        </div>
                                                        <div className='form-group'>
                                                            <div className="row item-list align-items-center">
                                                                <div className="group">
                                                                    <select className="form-select border border-dark h-50 w-100" onChange={this.approvestatus} style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}>
                                                                        <option defaultValue>{t('--Select--')}</option>
                                                                        <option value="1">{t('Approve')}</option>
                                                                        <option value="0">{t('Reject ')}</option>
                                                                    </select>
                                                                </div>

                                                                <div className="group pt-2" style={{ textAlign: "end" }}>
                                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.approveFacEval}>Submit</button>&nbsp;
                                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }} >Cancel</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Verify Ref Detail Modal */}
                    <button type="button" id='verifyRefModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Verify Ref modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Verify Reference Details</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>{t('Reference Check Done *')}</p>
                                                    <select className='form-select' onChange={this.rcdone} style={{ marginTop: "-10px" }}>
                                                        <option defaultValue>{t('--Select--')}</option>
                                                        <option value="1">{t('Contacted The Reference')}</option>
                                                        <option value="0">{t('References Are Not Contactable')}</option>
                                                    </select>

                                                </div>
                                            </div>
                                            <div className='row mb-2' id='rcResultMenu' style={{ display: "none" }}>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>{t('Reference Check Result')}</p>
                                                    <select className='form-select' onChange={this.rcresult} style={{ marginTop: "-10px" }}>
                                                        <option defaultValue>{t('--Select--')}</option>
                                                        <option value="1">{t('Positive Feedback From Reference')}</option>
                                                        <option value="0">{t('Negative Feedback From Reference')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Reference Comment *</p>
                                                    <textarea type="text" class="form-control" onChange={this.refcomment}
                                                        rows={3} cols={30} maxLength={255}
                                                        placeholder="Reference Comment" style={{ color: "rgb(5, 54, 82)", marginTop: "-10px" }}>
                                                    </textarea>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.verifyReferences}>Submit</button>&nbsp;
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

export default withTranslation()(SysUserRefDetails)