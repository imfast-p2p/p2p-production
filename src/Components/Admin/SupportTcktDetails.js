import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import AdminSidebar from './AdminSidebar';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { FaAngleLeft, FaFileUpload } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import ref from '../assets/rf.png'
import ref1 from '../assets/rf2.png'
import { confirmAlert } from 'react-confirm-alert';

export class SupportTcktDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reqno: "",
            reviewer: "",
            issueTrails: [],
            issuetype: sessionStorage.getItem("issuetype"),
            issuestatus: "2",
            reviewerdesc: ""
        }
        this.reqno = this.reqno.bind(this);
        this.reviewer = this.reviewer.bind(this);
        this.issuestatus = this.issuestatus.bind(this);
        this.reviewerdesc = this.reviewerdesc.bind(this);
        this.ticketDetails = this.ticketDetails.bind(this);
        this.assignTicket = this.assignTicket.bind(this);
        this.updateTicket = this.updateTicket.bind(this);
    }

    reqno(event) {
        this.setState({ reqno: event.target.value })
    }

    reviewer(event) {
        this.setState({ reviewer: event.target.value })
    }

    issuestatus(event) {
        this.setState({ issuestatus: event.target.value })
    }

    reviewerdesc(event) {
        this.setState({ reviewerdesc: event.target.value })
    }

    ticketDetails() {
        fetch(BASEURL + '/grievance/getsupportticketdetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                reqno: sessionStorage.getItem("reqno")
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    //alert(resdata.message);
                    this.setState({ issueTrails: resdata.msgdata.issuetrails })
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
                                        // window.location.reload();
                                    },
                                },
                            ],
                        });
                    }
                }
            })
    }

    assignTicket() {
        $('.otpField').toggle();
        fetch(BASEURL + '/grievance/assignticket', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                reqno: sessionStorage.getItem("reqno"),
                reviewer: this.state.reviewer
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
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
            })
    }

    updateTicket() {
        $('.otpButton').toggle();
        fetch(BASEURL + '/grievance/updatesupportticketstatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                reqno: sessionStorage.getItem("reqno"),
                issuetype: this.state.issuetype,
                issuestatus: this.state.issuestatus,
                reviewerdesc: this.state.reviewerdesc
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
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
            })
    }
    cancelUpdateTicket = () => {
        window.location.reload();
    }
    cancelassignTicket = () => {
        window.location.reload()
    }

    handleChange() {
        $('.text').toggle();
        $("#Pinfo").toggle();
    }

    onAssignTckt() {
        $('.otpField').toggle();
    }

    onUpdateTckt() {
        $('.otpButton').toggle();
    }

    render() {
        const desc = sessionStorage.getItem("issuedesc");
        const type = sessionStorage.getItem("issuetype");
        const mob = sessionStorage.getItem("mobilenumber");
        const raisedon = sessionStorage.getItem("raisedon");
        const sla = sessionStorage.getItem("sladuration");
        const reqno = sessionStorage.getItem("reqno");
        const lastupdated = sessionStorage.getItem("lastupdated");
        const raisedby = sessionStorage.getItem("raisedby");
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
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <AdminSidebar />

                <div className="main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/customerSupport">Customer Support</Link> / Ticket Details</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/customerSupport"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />

                    {/*  */}
                    {/* New Design */}
                    <div className="card" style={{ marginLeft: "50px", cursor: 'default', width: "92%", borderRadius: "7px" }}>
                        <div className='row'>
                            <div className='col-3' id='headingRef'>
                                <div className="two__image" style={{ paddingLeft: "10px" }}>
                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Ticket Details</p>
                                </div>
                            </div>
                        </div>
                        <div className='row' style={{ color: "#222c70", fontFamily: "Poppins,sans-serif", fontSize: "14px", padding: "0px 10px" }}>
                            <div className='col-2'>
                                <p style={{ fontWeight: "600" }}>Issue Type</p>
                                <p>{type == "" ? "-" : type}</p>
                            </div>
                            <div className='col-2'>
                                <p style={{ fontWeight: "600" }}>Issue Description</p>
                                <p>{desc == "" ? "-" : desc}</p>
                            </div>
                            <div className='col-2'>
                                <p style={{ fontWeight: "600" }}>Mobile Number</p>
                                <p>{mob == "" ? "-" : mob}</p>
                            </div>
                            <div className='col-2'>
                                <p style={{ fontWeight: "600" }}>Request Number</p>
                                <p>{reqno == "" ? "-" : reqno}</p>
                            </div>
                            <div className='col-2'>
                                <p style={{ fontWeight: "600" }}>Raised On</p>
                                <p>{raisedon == "" ? "-" : raisedon}</p>
                            </div>
                            <div className='col-2'>
                                <p style={{ fontWeight: "600" }}>SLA Duration</p>
                                <p>{sla == "" ? "-" : sla}</p>
                            </div>
                        </div>
                        <div className='row mb-1' style={{ color: "#222c70", fontFamily: "Poppins,sans-serif", fontSize: "14px", padding: "0px 10px" }}>
                            <div className='col-2'>
                                <p style={{ fontWeight: "600" }}>Raised By</p>
                                <p>{raisedby == "" ? "-" : raisedby}</p>
                            </div>
                            <div className='col-2'>
                                <p style={{ fontWeight: "600" }}>Last Updated</p>
                                <p>{lastupdated == "" ? "-" : lastupdated}</p>
                            </div>
                            <div className='col-6'>

                            </div>
                            <div className='col' style={{ textAlign: "center" }}>
                                <button className="btn btn-sm text-white" style={{ backgroundColor: "#0079BF" }}
                                    onClick={this.ticketDetails}>Issue Trail</button>
                            </div>
                        </div>
                        {this.state.issueTrails.map((issuestatus, index) => {
                            return (
                                <>
                                    <hr className="col-12" style={{ marginLeft: "10px", width: "93%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                                    <div class="row mb-1" style={{ color: "#222c70", fontFamily: "Poppins,sans-serif", fontSize: "14px", padding: "0px 10px" }}>
                                        <div className='col-2'>
                                            <p style={{ fontWeight: "600" }}>Reviewed On</p>
                                            <p style={{ marginTop: "-14px" }}>{new Date(issuestatus.reviewedon).toLocaleDateString('en-GB').split("/").join("-")}</p>
                                        </div>
                                        <div className='col-2'>
                                            <p style={{ fontWeight: "600" }}>Status</p>
                                            <p style={{ marginTop: "-14px" }}>{issuestatus.closed == "0" ? "Open" : <span>{issuestatus.closed == "1" ? "Closed" : ""}</span>}</p>
                                        </div>
                                        <div className='col-2'>
                                            <p style={{ fontWeight: "600" }}>Assigned To</p>
                                            <p style={{ marginTop: "-14px" }}>{issuestatus.reviewer}</p>
                                        </div>
                                        <div className='col-2'>
                                            <p style={{ fontWeight: "600" }}>Reviewer Level</p>
                                            <p style={{ marginTop: "-14px" }}>{issuestatus.reviewerlevel}</p>
                                        </div>
                                        <div className='col-2'>
                                            <p style={{ fontWeight: "600" }}>Resolution</p>
                                            <p style={{ marginTop: "-14px" }}>{issuestatus.reviewerdesc}</p>
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </div>

                    <div class="container" style={{ width: "94%" }}>
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <ul class="nav nav-pills flex-column" id="myTab" role="tablist" style={{ textAlign: "center", fontSize: "18px", fontFamily: "Poppins,sans-serif" }}
                                >
                                    <li class="nav-item mb-2">
                                        <a class="nav-link active" id="assign-tab" data-toggle="tab"
                                            href="#assign" role="tab" aria-controls="assign" aria-selected="true"><img src={ref} style={{ width: "20px" }} />&nbsp;Assign Ticket</a>
                                    </li>
                                    <li class="nav-item"    >
                                        <a class="nav-link" id="update-tab" data-toggle="tab"
                                            href="#update" role="tab" aria-controls="update" aria-selected="false"><img src={ref1} style={{ width: "20px" }} />&nbsp;Update Ticket</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-md-8">
                                <div class="tab-content" style={{ marginTop: "-15px", marginLeft: "-20px" }}>
                                    <div class="tab-pane fade show active" id="assign" role="tabpanel" aria-labelledby="update"  >
                                        <div className="card" style={{ cursor: 'default' }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className="form-row">
                                                    <div className="form-group col">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px" }}>Enter Reviewer Name</p>
                                                        <input type="text" className="form-control" autoComplete='off' placeholder='Enter Reviewer Name'
                                                            style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                            id="inputAddress" onChange={this.reviewer}
                                                        />
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className='form-row'>
                                                    <div className="form-group col pt-2" style={{ textAlign: "center" }}>
                                                        <button className='btn btn-sm text-white' onClick={this.assignTicket}
                                                            style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button> &nbsp;
                                                        <button className='btn btn-sm text-white' onClick={this.cancelassignTicket}
                                                            style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="update" role="tabpanel" aria-labelledby="assign"  >
                                        <div className="card" style={{ cursor: 'default' }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className="form-row">
                                                    {/* <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px" }}>Enter Issue Type</p>
                                                        <input type="text" className="form-control" autoComplete='off' placeholder='Enter Your Issue Type'
                                                            style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                            id="inputAddress" onChange={this.issuetype}
                                                        />
                                                    </div> */}
                                                    <div className="form-group col-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px" }}>Select Issue Status</p>
                                                        <select style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.issuestatus}>
                                                            <option defaultValue>Select</option>
                                                            <option value="1">Processing</option>
                                                            <option value="2">Closed</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px" }}>Enter Reviewer Description</p>
                                                        <textarea type="text" class="form-control" onChange={this.reviewerdesc}
                                                            rows={1} cols={30} maxLength={255}
                                                            placeholder="Description" style={{ color: "rgb(5, 54, 82)", marginTop: "-10px", backgroundColor: "rgb(247, 248, 250)" }}>

                                                        </textarea>
                                                    </div>
                                                </div>
                                                {/* <div className="form-row">
                                                    <div className="form-group col">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px" }}>Enter Reviewer Description</p>
                                                        <textarea type="text" class="form-control" onChange={this.reviewerdesc}
                                                            rows={3} cols={30} maxLength={255}
                                                            placeholder="Description" style={{ color: "rgb(5, 54, 82)", marginTop: "-10px", backgroundColor: "rgb(247, 248, 250)" }}>

                                                        </textarea>
                                                    </div>
                                                </div> */}
                                                <hr />
                                                <div className='form-row'>
                                                    <div className="form-group col pt-2" style={{ textAlign: "center" }}>
                                                        <button className='btn btn-sm text-white' onClick={this.updateTicket}
                                                            style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button> &nbsp;
                                                        <button className='btn btn-sm text-white' onClick={this.cancelUpdateTicket}
                                                            style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
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

export default SupportTcktDetails
