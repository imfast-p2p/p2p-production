import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import AdminSidebar from './AdminSidebar';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaUsers, FaAngleLeft, FaUserCircle, FaRegFileAlt, FaRegFile } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import ref from '../assets/rf.png'
import ref1 from '../assets/rf2.png'
import { confirmAlert } from 'react-confirm-alert';

export class ReferenceDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reqid: "",
            refmobile: "",
            rcdone: "",
            rcresult: "",
            refcomment: "",
            earningList: [],
            fromdate: "",
            todate: "",
            usertype: "",
            userstatus: "",
            statecode: "",
            userpincode: "",
            distcode: "",

            approvestatus: "",

        }

        this.reqid = this.reqid.bind(this);
        this.refmobile = this.refmobile.bind(this);
        this.rcdone = this.rcdone.bind(this);
        this.rcresult = this.rcresult.bind(this);
        this.refcomment = this.refcomment.bind(this);
        this.verifyRefDetails = this.verifyRefDetails.bind(this);
        this.fromdate = this.fromdate.bind(this);
        this.todate = this.todate.bind(this);
        this.FacEvalList = this.FacEvalList.bind(this);
        this.usertype = this.usertype.bind(this);
    }
    componentDidMount() {
        this.listsDate()
    }

    reqid(event) {
        this.setState({ reqid: event.target.value })
    }
    refmobile(event) {
        this.setState({ refmobile: event.target.value })
    }
    rcdone(event) {
        this.setState({ rcdone: event.target.value })
    }
    rcresult(event) {
        this.setState({ rcresult: event.target.value })
    }
    refcomment(event) {
        this.setState({ refcomment: event.target.value })
    }

    approvestatus = (event) => {
        this.setState({ approvestatus: event.target.value })
    }

    fromdate(event) {
        this.setState({ fromdate: event.target.value })
    }
    todate(event) {
        this.setState({ todate: event.target.value })
    }

    usertype(event) {
        this.setState({ usertype: event.target.value })
    }

    fromdate(event) {
        this.setState({ fromdate: event.target.value })
    }
    todate(event) {
        this.setState({ todate: event.target.value })
    }

    listsDate() {
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

    verifyRefDetails() {

        fetch(BASEURL + '/lsp/verifyreferencedetails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                reqid: this.state.reqid,
                refmobile: this.state.refmobile,
                rcdone: this.state.rcdone,
                rcresult: this.state.rcresult,
                refcomment: this.state.refcomment
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    alert(resdata.message);
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
                                        // window.location.reload();
                                    },
                                },
                            ],
                        });
                    }
                }
            })
    }

    FacEvalList() {

        fetch(BASEURL + '/lsp/getfacevallist', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                fromdate: this.state.fromdate,
                todate: this.state.todate,
                usertype: this.state.usertype,
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    alert(resdata.message);
                    this.setState({ earningList: resdata.msgdata })
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
                                        // window.location.reload();
                                    },
                                },
                            ],
                        });
                    }
                }
            })
    }
    setRefDetails = () => {
        fetch(BASEURL + '/lsp/approvefacevl', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                reqid: this.state.reqid,
                approvestatus: this.state.approvestatus
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'success') {
                    console.log(resdata);
                    window.location = "/landing"
                }
                else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    cancelVerify = () => {
        window.location.reload()
    }
    cancelRefDetails = () => {
        window.location.reload()
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
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{backgroundColor:"#f4f7fc"}}>
                <AdminSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='evlnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id='evlnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / Reference Details</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='evlnavRes3'>
                            <button style={myStyle}>
                                <Link to="/landing"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-4' id='headingRef'>
                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Reference Details</p>
                            </div>
                        </div>
                    </div>
                    <div class="container" style={{ width: "94%" }}>
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <ul class="nav nav-pills flex-column" id="myTab" role="tablist" style={{ textAlign: "center", fontSize: "18px", fontFamily: "Poppins,sans-serif" }}
                                >
                                    <li class="nav-item mb-2"  >
                                        <a class="nav-link active" id="ref-tab" data-toggle="tab"
                                            href="#verifyRef-details" role="tab" aria-controls="verifyRef-details" aria-selected="true"><img src={ref} style={{ width: "20px" }} />&nbsp;Verify Reference Details</a>
                                    </li>
                                    <li class="nav-item mb-2" >
                                        <a class="nav-link" id="refprofile-tab" data-toggle="tab"
                                            href="#approveRef-details" role="tab" aria-controls="approveRef-details" aria-selected="false"><img src={ref1} style={{ width: "20px" }} />&nbsp;Approve Reference Statement</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-md-8">
                                <div class="tab-content" style={{ marginTop: "-15px", marginLeft: "-20px" }}>
                                    <div class="tab-pane fade show active" id="verifyRef-details" role="tabpanel" aria-labelledby="verifyRef-details"  >
                                        <div className="card" style={{ cursor: 'default', width: "80%" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Request Id')}</p>
                                                        <input type="text" className="form-control" autoComplete='off' style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                            id="inputAddress" placeholder={t('Enter Request Id')} onChange={this.reqid}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Mobile Number')}</p>
                                                        <input type="text" className="form-control" autoComplete='off' style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                            id="inputAddress" placeholder={t('Enter Mobile Number')} onChange={this.refmobile}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-12" style={{ fontSize: "14px" }}>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Reference Check Done')}</p>
                                                        <select style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.rcdone} >
                                                            <option defaultValue>{t('Select')}</option>
                                                            <option value="0">{t('Negative Feedback from Reference')}</option>
                                                            <option value="1">{t('Positive Feedback from Reference')}</option>
                                                        </select>
                                                    </div>
                                                </div >
                                                <div className="form-row">
                                                    <div className="form-group col-md-12" style={{ fontSize: "14px" }}>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Reference Check Result')}</p>
                                                        <select style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.rcresult} >
                                                            <option defaultValue>{t('Select')}</option>
                                                            <option value="0">{t('Not Contacted the Reference')}</option>
                                                            <option value="1">{t('Contacted the Reference')}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='form-row'>
                                                    <div className="form-group col">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Reference Comment')}</p>
                                                        <textarea type="text" style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-control" onChange={this.refcomment}
                                                            placeholder="Reference Comment" rows={3} cols={30} maxLength={255}>

                                                        </textarea>
                                                    </div>
                                                </div>
                                                <hr style={{ marginTop: "0px" }} />
                                                <div className='form-row'>
                                                    <div className="form-group col pt-2" style={{ textAlign: "center" }}>
                                                        <button className='btn btn-sm text-white' onClick={this.verifyRefDetails}
                                                            style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button> &nbsp;
                                                        <button className='btn btn-sm text-white' onClick={this.cancelVerify}
                                                            style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div >
                                        </div>
                                    </div>

                                    <div class="tab-pane fade show " id="approveRef-details" role="tabpanel" aria-labelledby="approveRef-details"  >
                                        <div className="card" style={{ cursor: 'default', width: "80%" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className="form-row">
                                                    <div className="form-group col-md-6" style={{ fontSize: "14px" }}>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Request Id')}</p>
                                                        <input type="text" className="form-control" autoComplete='off' style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                            id="inputAddress" placeholder={t('Enter Reference Name')} onChange={this.reqid}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6" style={{ fontSize: "14px" }}>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Approve Status')}</p>
                                                        <select style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.approvestatus} >
                                                            <option defaultValue>Select</option>
                                                            <option value="1">Approve</option>
                                                            <option value="0">Reject</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className='form-row'>
                                                    <div className="form-group col pt-2" style={{ textAlign: "center" }}>
                                                        <button className='btn btn-sm text-white' onClick={this.setRefDetails}
                                                            style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button> &nbsp;
                                                        <button className='btn btn-sm text-white' onClick={this.cancelRefDetails}
                                                            style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="container-fluid">
                        <button onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>

                        <div className="h-100 pt-3 pl-2 pr-2 pb-2">
                            <ul role="tablist" className="nav bg-light nav-pills nav-fill mb-3">
                                <li className="nav-item"> <a data-toggle="pill" href="#verifyRef-details" className="nav-link border active"> Verify Reference Details </a> </li>
                                <li className="nav-item"> <a data-toggle="pill" href="#approveRef-details" className="nav-link border"> Approve Reference Details </a> </li>

                            </ul>
                        </div>
                        <div className="tab-content h-100">
                            <div id="verifyRef-details" className="register-form tab-pane fade show active">
                                <div className='' style={{ marginLeft: "15%" }}>
                                    <div className="card" style={{ cursor: 'default', width: "50%" }}>
                                        <div className="card-header border-0">
                                            <div className='form-group'>
                                                <div className="row item-list align-items-center">
                                                    <div className="group">
                                                        <label htmlFor="RId">Req Id:</label>
                                                        <input type="text" className="" style={{ marginLeft: "44px" }} onChange={this.reqid} id="RId" placeholder="Enter Request Id" />
                                                    </div>
                                                    <div className="group">
                                                        <label htmlFor="Mno">Mobile No:</label>
                                                        <input type="text" className="ml-3" onChange={this.refmobile} id="Mno" placeholder="Enter Mobile Number" />
                                                    </div>
                                                    <div className="group">
                                                        <label htmlFor="status" className="label">{t('Reference Check Done')}: </label>
                                                        <select className="form-select border border-dark h-50 w-100" onChange={this.rcdone} style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}>
                                                            <option defaultValue>{t('--Select--')}</option>
                                                            <option value="0">{t('Negative Feedback from Reference')}</option>
                                                            <option value="1">{t('Positive Feedback from Reference')}</option>
                                                        </select>
                                                    </div>
                                                    <div className="group">
                                                        <label htmlFor="s" className="label">{t('Reference Check Result')}: </label>
                                                        <select className="form-select border border-dark h-50 w-100" onChange={this.rcresult} style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}>
                                                            <option defaultValue>{t('--Select--')}</option>
                                                            <option value="0">{t('Not Contacted the Reference')}</option>
                                                            <option value="1">{t('Contacted the Reference')}</option>
                                                        </select>
                                                    </div>

                                                    <div className="group pt-2">
                                                        <label htmlFor="desc">Reference Comment</label>
                                                        <textarea id="user" type="text" onChange={this.refcomment} className="input" placeholder="Reference Comment" ></textarea>
                                                    </div>
                                                    <div className="group pt-2" style={{ textAlign: "end" }}>
                                                        <button className='btn btn-info' style={{ width: "100px" }} onClick={this.verifyRefDetails}>Submit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div >
                                    </div >
                                </div>
                            </div>
                            <div id="approveRef-details" className="register-form tab-pane fade mt-3">
                                <form>
                                    <div className="form-row p-4">
                                        <div className="form-group col pl-4">
                                            <label htmlFor="Rname">Req Id</label>
                                            <input type="text" className="ml-3" onChange={this.reqid} id="Rname" placeholder="Enter Reference Name" />
                                        </div>
                                        <div className="form-group col">
                                            <label htmlFor="Mno">Approve Status</label>
                                            <select className="w-50 ml-3" onChange={this.approvestatus}>
                                                <option defaultValue>--Select--</option>
                                                <option value="1">Approve</option>
                                                <option value="0">Reject</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="btnProfile" style={{ paddingRight: "120px" }}>
                                        <button type="button" onClick={this.setRefDetails} className="btn btn-success">Submit</button>
                                    </div>

                                </form>
                            </div>

                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default withTranslation()(ReferenceDetails)
