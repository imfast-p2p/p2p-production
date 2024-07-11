import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import * as CgIcons from "react-icons/cg";
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import $ from 'jquery';
import EvaluatorSidebar from '../../SidebarFiles/EvaluatorSidebar';
import { withTranslation } from 'react-i18next';
import { FaUsers, FaAngleLeft, FaRegFileAlt, FaRegFolder, } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import { confirmAlert } from "react-confirm-alert";

export class UpdateStmt extends Component {
    constructor() {

        super();

        this.state = {
            stmtsinfo: [],
            rejectreason: "",
            status: "",
            resMsg: ""
        }

    }

    rejectreason = (event) => {
        this.setState({ rejectreason: event.target.value })
    }
    status = (event) => {
        this.setState({ status: event.target.value })
    }
    setExtractedStmt = () => {
        var docId = sessionStorage.getItem('docName');
        var stmtStatus = this.state.status;

        var stminfo = {
            docid: docId,
            status: stmtStatus
        }
        console.log(stminfo, this.state.status);
        if (this.state.status === "2" && this.state.rejectreason === "") {
            this.setState({ resMsg: "Reject reason can not be empty, please enter the reason." })
            $("#commonModal").click();
        } else if (this.state.status === "" || null || undefined) {
            this.setState({ resMsg: "Please select the status." })
            $("#commonModal").click();
        }
        else {
            fetch(BASEURL + '/lms/setextractedstmtstatus', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    stmtsinfo: [stminfo],
                    loanreqno: sessionStorage.getItem('loanreqno'),
                    rejectreason: this.state.rejectreason
                })
            })
                .then((Response) => {
                    return Response.json();
                })
                .then((resdata) => {
                    if (resdata.status == 'Success') {
                        console.log(resdata.message);
                        // alert(resdata.message)
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        window.location = "/evalCreditAppraisal"
                                    },
                                },
                            ],
                            closeOnClickOutside: false,
                        });

                    } else {
                        //alert("Issue: " + resdata.message);
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click();
                    }
                })
        }

    }
    cancelExtrStmt = () => {
        window.location = "/evalCreditAppraisal"
    }

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }


    render() {
        const reqno = sessionStorage.getItem('loanreqno');
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F4F7FC" }}>
                <EvaluatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='evanavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-7' id='evanavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/evaluatorDashboard">Home</Link> / <Link to="/evalCreditAppraisal">Evaluator Credit Appraisal</Link> / Update Statement Status</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className="col" id='evanavRes3'>
                            <button style={myStyle}>
                                <Link to="/evalCreditAppraisal"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />

                    <div className="tab-content h-100">
                        <div className="register-form tab-pane fade show active">
                            <div className='' style={{ marginLeft: "15%" }}>
                                <div className="card" style={{ cursor: 'default', width: "50%", padding: "2px 10px 0px 10px" }}>
                                    <div className='form-group'>
                                        <div className="row item-list align-items-center">
                                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingTop: "15px", }}>
                                                <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                                <div>
                                                    <h4 className="heading1" style={{ color: "#00264d" }}>
                                                        Update Statement Status
                                                    </h4>
                                                </div>
                                                <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                            </div>

                                            <div className="group">
                                                <p htmlFor="s" style={{ color: "#222c70", fontWeight: "600" }}>{t('Statement Status *')} </p>
                                                <select className="form-select" onChange={this.status} style={{ marginTop: "-10px" }}>
                                                    <option defaultValue>{t('--Statement Status--')}</option>
                                                    <option value="1">{t('Verified')}</option>
                                                    <option value="2">{t('Rejected')}</option>
                                                </select>
                                            </div>

                                            <div className="group pt-2">
                                                <p htmlFor="desc" style={{ color: "#222c70", fontWeight: "600" }}>{t('Reason(Mandatory if rejected)')}</p>
                                                <textarea type="text" class="form-control" id="user" onChange={this.rejectreason}
                                                    rows={4} cols={30} maxLength={255}
                                                    placeholder="Reason" style={{ color: "rgb(5, 54, 82)", marginTop: "-10px" }}>
                                                </textarea>
                                                {/* <textarea id="user" type="text" onChange={this.rejectreason} className="input" placeholder="Reason" rows={4}></textarea> */}
                                            </div>
                                            <div className="group pt-2" style={{ textAlign: "end" }}>
                                                <button className='btn btn-sm text-white' style={{ width: "100px", backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setExtractedStmt}>Submit</button> &nbsp;
                                                <button className='btn btn-sm text-white' style={{ width: "100px", backgroundColor: "#0079BF" }} onClick={this.cancelExtrStmt}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </div>
                        </div>
                    </div>


                    {/*  Common Alert */}
                    <button id='commonModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter21">
                    </button>
                    <div className="modal fade" id="exampleModalCenter21" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <dvi class="modal-body">
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>{this.state.resMsg}</p>
                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                </dvi>
                                <div class="modal-footer" style={{ marginTop: "-28px" }}>
                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} >Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(UpdateStmt);
