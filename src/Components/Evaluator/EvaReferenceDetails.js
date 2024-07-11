import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import EvaluatorSidebar from '../../SidebarFiles/EvaluatorSidebar';
import { FaUsers, FaAngleLeft, FaRegFileAlt, FaRegFolder, } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import { BsFolderPlus } from 'react-icons/bs';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from "react-confirm-alert";
//updated
export class EvaReferenceDetails extends Component {

    constructor(props) {
        super(props)

        this.state = {
            refname: "",
            refmobile: "",
            referenceDetails: [],

            checkFacMnum: sessionStorage.getItem("E_Mobile"),
            numError: false,
        }

        this.refname = this.refname.bind(this);
        this.refmobile = this.refmobile.bind(this);
        this.setRefDetails = this.setRefDetails.bind(this);
        this.getRefDetails = this.getRefDetails.bind(this);
        this.selectRef1 = React.createRef();
        this.selectRef2 = React.createRef();
    }
    refname(event) {
        this.setState({ refname: event.target.value })
    }
    refmobile(event) {
        var mobileValid = /^[6-9][0-9]{9}$/;
        var checknum = this.state.checkFacMnum;
        var checkeventnum = event.target.value;
        if (mobileValid.test(checkeventnum) && checknum != checkeventnum) {
            console.log("passed")
            this.setState({ numError: false })
            $('#RefSubmitBtn').prop('disabled', false)
            this.setState({ refmobile: event.target.value })
            console.log(this.state.refmobile)
        } else {
            this.setState({ numError: true })
            $('#RefSubmitBtn').prop('disabled', true)
        }
    }
    componentDidMount() {
        this.getRefDetails1();
        $('#RefSubmitBtn').prop('disabled', true)
    }
    setRefDetails() {
        fetch(BASEURL + '/lsp/setreferencedetails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                refname: this.state.refname,
                refmobile: parseInt(this.state.refmobile)
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    $(this.selectRef1.current).val('');
                                    $(this.selectRef2.current).val('');
                                },
                            },
                        ],
                    });
                }
                else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    //window.location.reload()
                                },
                            },
                        ],
                    });
                }
            })
    }
    getRefDetails1() {
        fetch(BASEURL + `/lsp/getreferencedetails?userid=` + sessionStorage.getItem('userID'), {
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

                    var totalReference = resdata.msgdata.length;
                    console.log(totalReference)
                    if (totalReference >= 2) {
                        $("#minReferenceMsg").hide()
                        $("#maxReferenceMsg").show()
                    } else if (totalReference < 2) {
                        $("#minReferenceMsg").show()
                        $("#maxReferenceMsg").hide()
                    }

                } else {
                    // $("#profile").hide()
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
    getRefDetails() {
        fetch(BASEURL + `/lsp/getreferencedetails?userid=` + sessionStorage.getItem('userID'), {
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
                } else {
                    $("#profile").hide()
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    //window.location.reload()
                                },
                            },
                        ],
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
            // height: "25px",
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            marginLeft: "14px"
        }
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F7FCFF" }}>
                <EvaluatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='evlnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='evlnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/evaluatorDashboard">Home</Link> / Reference Details</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='evlnavRes3'>
                            <button style={myStyle}>
                                <Link to="/evaluatorDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    {/* new Design */}
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
                                    <li class="nav-item mb-2">
                                        <a class="nav-link active" id="ref-tab" data-toggle="tab"
                                            href="#home" role="tab" aria-controls="home" aria-selected="true"><BsFolderPlus />&nbsp;Add Reference Details</a>
                                    </li>
                                    <li class="nav-item"    >
                                        <a class="nav-link" id="refprofile-tab" data-toggle="tab"
                                            href="#profile" role="tab" aria-controls="profile" aria-selected="false" onClick={this.getRefDetails}><FaUsers />&nbsp;View Reference Details</a>
                                    </li>
                                </ul>
                            </div>

                            <div class="col-md-8">
                                <div class="tab-content" id="myTabContent" style={{ marginTop: "-15px", marginLeft: "-20px" }}>
                                    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="ref-tab">
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white" id='minReferenceMsg'>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Reference Name')}</p>
                                                        <input type="text" ref={this.selectRef1} className="form-control" style={{ height: "49px", backgroundColor: "rgb(247, 248, 250)" }}
                                                            onChange={this.refname} id="Rname" placeholder="Enter Reference Name" />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Mobile" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Mobile Number')}</p>
                                                        <input type="number" ref={this.selectRef2} className="form-control" id="inputAddress" style={{ height: "49px", backgroundColor: "rgb(247, 248, 250)" }}
                                                            placeholder={t('Enter Mobile Number')} onChange={this.refmobile} />
                                                        {(this.state.numError) ? <span className='text-danger'>Invalid Mobile number</span> : ''}
                                                    </div>
                                                </div>
                                                <hr />

                                                <div className="form-row" style={{ textAlign: "center" }}>
                                                    <div className="form-group col">
                                                        <button type="button" className="btn mr-2 text-white" id='RefSubmitBtn' style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                            onClick={this.setRefDetails}>Submit</button>
                                                        <button type="button" className="btn text-white" style={{ backgroundColor: "#0079BF" }}
                                                            onClick={this.cancelsetRefDetails}>{t('Cancel')}</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card-header border-1 bg-white" id='maxReferenceMsg' style={{ display: "none" }}>
                                                <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", textAlign: "center" }}>
                                                    Maximum 2 references are allowed.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="refprofile-tab">
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className="form-row">
                                                    <div className='col' style={{ textAlign: "end" }}>
                                                        <input type='button' id='brownSquare' style={{ cursor: "default" }} /> <span style={{ fontSize: "13px", color: "#222C70" }}>Not yet Verified</span>
                                                        &nbsp;
                                                        <input type='button' id='greenSquare' style={{ cursor: "default" }} /> <span style={{ fontSize: "13px", color: "#222C70" }}>Verified</span>
                                                    </div>
                                                </div>
                                                <div className='form-row'>
                                                    {
                                                        this.state.referenceDetails.map((reference, index) => {
                                                            return (
                                                                <div className='col-6' key={index}>
                                                                    <div className='card p-3' style={{ border: "2px solid rgb(183, 214, 232)", marginBottom: "1px", cursor: "default" }}>
                                                                        <div className='row' style={{ fontSize: "14px", color: "#222C70" }}>
                                                                            <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Refree Name</p>
                                                                            <p>{reference.refreename}
                                                                                <hr style={{ color: "rgba(42,143,211,1)" }} />
                                                                            </p>
                                                                            <div className='col-6' style={{ marginTop: "-30px" }}>
                                                                                <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Requestor Id</p>
                                                                                <p>{reference.requestorid}</p>

                                                                                <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Ref Mobile No</p>
                                                                                <p>{reference.refmobileno}</p>

                                                                                <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Ref Check Date</p>
                                                                                <p>{reference.refcheckdate == "" || null ? "-" : reference.refcheckdate}</p>
                                                                            </div>
                                                                            <div className='col-6' style={{ marginTop: "-30px" }}>
                                                                                <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Request Date</p>
                                                                                <p>{reference.requestdate}</p>

                                                                                <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Ref Check Done</p>
                                                                                <p>{reference.refcheckdone == "0" ? <p style={{ color: "rgb(181, 109, 33)" }}>Not yet Verified</p> :
                                                                                    <p style={{ color: "rgb(56, 138, 15)" }}>Verified by System User</p>}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="container-fluid">
                        <button onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>

                        <div className="h-100 p-5">
                            <ul role="tablist" className="nav bg-light nav-pills nav-fill mb-3">
                                <li className="nav-item"> <a data-toggle="pill" href="#setRef-details" className="nav-link border active"> {t('SetReferenceDetails')} </a> </li>
                                <li className="nav-item"> <a data-toggle="pill" href="#viewRef-details" className="nav-link border" onClick={this.getRefDetails}> {t('ViewReferenceDetails')} </a> </li>
                            </ul>
                        </div>
                        <div className="tab-content  h-100" style={{ paddingTop: "0px", paddingRight: '5px', paddingLeft: '5px' }}>
                            <div id="setRef-details" className="register-form tab-pane fade show active">
                                <div className="card border-0 register-form tab-pane fade show active " id="user-details" style={{ padding: '30px', cursor: 'default' }}>
                                  
                                    <form>
                                        <div className="form-row" >
                                            <div className="form-group col-lg-5 col-md-5 col-sm-5">
                                                <label htmlFor="Rname">{t('ReferenceName')}</label>
                                                <input type="text" className="ml-3" onChange={this.refname} id="Rname" placeholder="Enter Reference Name" />
                                            </div>
                                            <div className="form-group col-lg-5 col-md-5 col-sm-5">
                                                <label htmlFor="Mno">{t('MobileNumber')}</label>
                                                <input type="text" className="ml-3" onChange={this.refmobile} id="Mno" placeholder="Enter Mobile Number" />
                                            </div>
                                            <div className="form-group  col-lg-2 col-md-2 col-sm-2">
                                                <div className="btnProfile">
                                                    <button type="button" onClick={this.setRefDetails} className="ml-5 btn btn-success">{t('Submit')}</button>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                            <div id="viewRef-details" className="register-form tab-pane fade">
                                <div className="card border-0 register-form tab-pane fade show active " id="user-details" style={{ padding: '30px', cursor: 'default' }}>
                                    
                                    <div className="card" style={{ cursor: "default" }}>
                                        <div className="card-header border-0">
                                            <div className="row item-list align-items-center">

                                                <div className="col">
                                                    <h6 className="ml-4">{t('RefreeName')}</h6>
                                                </div>
                                                <div className="col">
                                                    <h6>{t('RequestorId')}</h6>
                                                </div >
                                                <div className="col">
                                                    <h6>{t('RefMobileNo ')}</h6>
                                                </div>
                                                <div className="col">
                                                    <h6>{t('RequestDate ')}</h6>
                                                </div >
                                                <div className="col">
                                                    <h6>{t('RefCheckDate')}</h6>
                                                </div >
                                                <div className="col">
                                                    <h6>{t('Reference Check Done')}</h6>
                                                </div >
                                            </div >
                                        </div >
                                    </div >

                                    <div className="" style={{ cursor: "default" }}>
                                        {
                                            this.state.referenceDetails.map((reference, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div className="card" style={{ cursor: "default" }}>
                                                            <div className="card-header border-0" style={{ paddingRight: "21px", paddingTop: "0px", paddingBottom: "0px", marginBottom: '-10px', marginTop: '0px', cursor: "default" }}>
                                                                <div className="row item-list align-items-center">
                                                                    <div className="col">
                                                                        <p className="ml-4">{reference.refreename}</p>
                                                                    </div>
                                                                    <div className="col">
                                                                        <p>{reference.requestorid}</p>
                                                                    </div >
                                                                    <div className="col">
                                                                        <p >{reference.refmobileno}</p>
                                                                    </div>
                                                                    <div className="col">
                                                                        <p>{reference.requestdate}</p>
                                                                    </div >
                                                                    <div className="col">
                                                                        <p>{reference.refcheckdate}</p>
                                                                    </div >
                                                                    <div className="col">
                                                                        {reference.refcheckdone == "0" ? <p>Not yet Verified</p> :
                                                                            <p>Verified by System User</p>}

                                                                    </div >
                                                                </div >
                                                            </div >
                                                        </div >
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default withTranslation()(EvaReferenceDetails)
