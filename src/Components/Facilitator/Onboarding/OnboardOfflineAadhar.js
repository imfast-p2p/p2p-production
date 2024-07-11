import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";
import { withTranslation } from 'react-i18next';
import { BASEURL } from '../../assets/baseURL';
import FacilitatorSidebar from '../../../SidebarFiles/FacilitatorSidebar';
import { FaAngleDoubleDown, FaAngleLeft, FaRegFileAlt } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import $ from 'jquery';


export class OnboardOfflineAadhar extends Component {
    constructor() {
        super();
        this.state = {
            mobileno: "",
            utype: "3",
            passcode: "",
            kycmode: "3",
            reId: "",

            invalidMnum: false,
        }
    }
    componentDidMount() {
        $('#oFkycSubmitBtn').prop('disabled', true)
    }
    utype = (event) => {
        if (event.target.value == "Lender") {
            this.setState({ utype: "2" })
            console.log(event.target.value);
        } else if (event.target.value == "Borrower") {
            this.setState({ utype: "3" })
            console.log(event.target.value);
        }
    }
    mobilenumber = (event) => {
        var mobileValid = /^[6-9][0-9]{9}$/;
        var eventmInput = event.target.value;
        if (mobileValid.test(eventmInput)) {
            console.log("passed")
            this.setState({ invalidMnum: false })
            $('#oFkycSubmitBtn').prop('disabled', false)
            this.setState({ mobileno: event.target.value })
        } else {
            this.setState({ invalidMnum: true })
            $('#oFkycSubmitBtn').prop('disabled', true)
        }

    }
    passcode = (event) => {
        this.setState({ passcode: event.target.value })
    }
    checkFile = () => {
        var zipfileFields = document.querySelector("input[id='zipfilesData']").files;
        console.log(zipfileFields);
    }


    uploadAadhar = () => {
        const zipformDatas = new FormData()
        var zipfileField = document.querySelector("input[id='zipfilesData']");

        var bodyData = JSON.stringify({
            mobileno: this.state.mobileno,
            utype: this.state.utype,
            passcode: this.state.passcode,
            kycmode: this.state.kycmode
        })
        zipformDatas.append("file", zipfileField.files[0]);
        zipformDatas.append("info", bodyData);

        fetch(BASEURL + '/verification/offlinekyc/kycverification', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                // 'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: zipformDatas
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    this.setState({ reId: resdata.msgdata.referenceid })
                    sessionStorage.setItem("onboardRefID", resdata.msgdata.referenceid);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    let data1 = {
                                        mobile: this.state.mobileno,
                                        usertype: this.state.utype
                                    }
                                    this.props.history.push({
                                        pathname: '/onboardRegister',
                                        frompath: 'onboardOfflineAadhar',
                                        state: {
                                            aadhaarXml: data1
                                        }
                                    })
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                    //alert(resdata.message);

                } else {
                    confirmAlert({
                        message: resdata.message + " " + "Please try with other methods.",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                    //alert(resdata.message + " " + "Please try with other methods.");
                }
            }).catch(error => console.log(error)
            );

    }
    cancelUpload = () => {
        window.location.reload();
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#f4f7fc" }}>
                <FacilitatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/facilitatorDashboard">Home</Link> / <Link to="/customer">Customer Onboarding</Link> / Offline Aadhar</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/customerOnboarding"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "-3px" }} />
                    <div style={{ paddingLeft: "28%", paddingRight: "28%", paddingTop: "5px" }}>
                        <div className="container">
                            <div className="row" >
                                <div className="col-md-12 ">
                                    <div className="card" style={{ width: "100%", cursor: "default", boxShadow: "5px 10px 14px #888888" }}>
                                        <div className="credentials" style={{ padding: "10px 20px" }}>
                                            <div className='row' style={{}}>
                                                <div className='col-6' id='headingCust'>
                                                    <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Offline Aadhar</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='row mb-2'>
                                                <div className='col-4' style={{ fontSize: "14px", paddingTop: "10px", fontFamily: "Poppins,sans-serif" }}>
                                                    <p style={{ fontWeight: "bold", color: "#222c70" }}>
                                                        Registering as
                                                    </p>
                                                    {/* <div className='row'>
                                                        <div className='col'></div>
                                                        <div className='col'>
                                                            <select className="form-select" onChange={this.utype} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}>
                                                                <option defaultValue>
                                                                    Select
                                                                </option>
                                                               
                                                                <option value="Borrower">Borrower</option>
                                                            </select>
                                                        </div>
                                                        <div className='col'></div>
                                                    </div> */}
                                                </div>
                                                {/* <div className='col-4' style={{ fontFamily: "Poppins,sans-serif" }}>
                                                    <input className="form-control" type="text" value="Borrower" readOnly />
                                                </div> */}
                                                {/* Please check once before changing any instances/enhancements */}
                                                <div className='col-4' style={{ fontFamily: "Poppins,sans-serif" }}>
                                                    <select className="form-select" onChange={this.utype} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)"}}>
                                                        <option defaultValue>
                                                            Select
                                                        </option>
                                                        <option value="Lender">Lender</option>
                                                        <option value="Borrower">Borrower</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row mb-2">
                                                <div className="col">
                                                    <p className="u1" style={{ color: "#222c70", fontWeight: "bold", fontSize: "14px", fontFamily: "Poppins,sans-serif" }}>
                                                        Upload File
                                                    </p>
                                                    <div style={{ marginTop: "-10px" }}>
                                                        <input type="file" id="zipfilesData" accept='.zip'
                                                            className="border text-dark" onChange={this.checkFile} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col">
                                                    <p className="u1" style={{ color: "#222c70", fontWeight: "bold", fontSize: "14px", fontFamily: "Poppins,sans-serif" }}>
                                                        Passcode
                                                    </p>
                                                    <div style={{ marginTop: "-10px" }}>
                                                        <input type="password" className="form-control" id="passcode" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)" }}
                                                            placeholder={t('Enter Passcode')} onChange={this.passcode} autoComplete="off" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col">
                                                    <p className="u1" style={{ color: "#222c70", fontWeight: "bold", fontSize: "14px", fontFamily: "Poppins,sans-serif" }}>
                                                        Mobile Number
                                                    </p>
                                                    <div style={{ marginTop: "-10px" }}>
                                                        <input type="number" className="form-control" id="mobilenum" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)" }}
                                                            placeholder={t('Enter Mobile Number')} autoComplete="off" onChange={this.mobilenumber} />
                                                        {(this.state.invalidMnum) ? <span className='text-danger'>Invalid Mobile number</span> : ''}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <button className=" btn btn-sm text-white" id='oFkycSubmitBtn' onClick={this.uploadAadhar}
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button>
                                                    &nbsp;
                                                    <button className=" btn btn-sm text-white" onClick={this.cancelUpload}
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
        )
    }
}

export default withTranslation()(OnboardOfflineAadhar);