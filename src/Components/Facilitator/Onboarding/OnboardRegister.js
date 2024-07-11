import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import FacilitatorSidebar from '../../../SidebarFiles/FacilitatorSidebar';
import { withTranslation } from 'react-i18next';
import SimpleReactValidator from 'simple-react-validator';
import {
    FaAngleDoubleDown, FaAngleLeft, FaUsers,
    FaFolderPlus, FaUserPlus, FaRegTrashAlt
} from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import './customerOnboard.css'
import cusOB from '../../assets/cusOb.png';
import cusOB2 from '../../assets/cusb2.png';
import { confirmAlert } from "react-confirm-alert";
import editRole from '../../assets/editRole.png';
import { BsInfoCircle } from "react-icons/bs";
import batch from '../../assets/batch.png';

var diffPath = false;
var dataList = [];
export class OnboardRegister extends Component {
    constructor(props) {
        super(props)
        //updated
        this.state = {
            name: "",
            gender: "",
            dob: "",
            mobilenumber: "",
            email: "",
            pannumber: "",
            utype: 0,

            regMode: "",
            referenceId: "",

            referenceId: sessionStorage.getItem('onboardRefID'),
            dateofbirth: "",

            showBorrowerID: "",

            options: ['Male', 'Female', 'Others'],
            invalidUsername: false,
            invalidEmail: false,
            invalidPan: false,
            invalidMnum: false,

            dobValid: false,
            resMsg: "",
            otpm: '',
            otpe: '',
            mobileref: '',
            emailref: '',
            userInfo: {}
        }
        this.validator = new SimpleReactValidator();
    }
    pannumber = (event) => {
        this.setState({ pannumber: event.target.value })
        var regex = /[A-Za-z]{3}[Pp]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]{1}$/;
        var eventInput = event.target.value;
        if (regex.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidPan: false })
            this.setState({ pannumber: event.target.value.toUpperCase().trim() })
        } else {
            this.setState({ invalidPan: true })
        }
    }

    name = (event) => {
        // this.setState({ name: event.target.value })
        var username = event.target.value;
        var isValid = true;
        this.setState({ name: username });
        for (var i = 0; i < username.length; i++) {
            var charCode = username.charCodeAt(i);
            if (!(charCode >= 65 && charCode <= 90) && // A-Z
                !(charCode >= 97 && charCode <= 122) && // a-z
                !(charCode >= 48 && charCode <= 57) && // 0-9
                charCode !== 95 && // underscore
                charCode !== 46 && //dot
                charCode !== 32) { // space
                isValid = false;
                break;
            }
        }
        if (isValid) {
            this.setState({
                name: username,
                invalidUsername: false
            });
        } else {
            this.setState({
                invalidUsername: true
            });
        }
    }
    gender = (event) => {
        var gender = event.target.value;
        if (gender == "Male") {
            this.setState({ gender: "M" })
        } else if (gender == "Female") {
            this.setState({ gender: "F" })
        } else if (gender == "Others") {
            this.setState({ gender: "O" })
        }
    }
    dob = (event) => {
        this.setState({ dateofbirth: event.target.value });
        console.log(event.target.value)

        const enteredDateOfBirth = event.target.value;
        const today = new Date();
        const enteredDate = new Date(enteredDateOfBirth);

        // Calculate age
        const age = today.getFullYear() - enteredDate.getFullYear();
        const monthDiff = today.getMonth() - enteredDate.getMonth();

        // If the birth month has not occurred yet this year, or if the birth month is in the future
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < enteredDate.getDate())) {
            this.setState({ dateofbirth: enteredDateOfBirth, age: age - 1 });
        } else {
            this.setState({ dateofbirth: enteredDateOfBirth, age });
        }

        // Check if the age is greater than or equal to 18
        if (age < 18) {
            this.setState({ dobValid: true })
            console.log("You must be 18 years or older.");
        } else {
            this.setState({ dobValid: false })
            console.log("Executed success.")
        }
    }
    mobilenumber = (event) => {
        // this.setState({ mobilenumber: event.target.value })
        this.setState({ mobilenumber: eventInput });
        var eventInput = event.target.value;
        var mobileValid = /^[6-9]\d{9}$/;

        if (mobileValid.test(eventInput)) {
            console.log("passed");
            this.setState({ invalidMnum: false });
            this.setState({ mobilenumber: eventInput });
            $('#checkbox').prop('disabled', false);
        } else {
            this.setState({ invalidMnum: true });
        }
    }
    email = (event) => {
        // this.setState({ email: event.target.value })
        var emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var eventInput = event.target.value;
        if (emailCheck.test(eventInput)) {
            console.log("passed");
            this.setState({ invalidEmail: false })
            this.setState({ email: event.target.value })

        } else {
            console.log('failed');
            this.setState({ invalidEmail: true })
        }
    }
    usertype1 = () => {
        this.setState({ utype: 2 })
        console.log(this.state.utype)
    }
    usertype2 = () => {
        this.setState({ utype: 3 })
        console.log(this.state.utype)

    }
    userType = (event) => {
        if (event.target.value == "Lender") {
            this.setState({ utype: "2" })
            console.log(event.target.value);
            $(".JlGroupField").hide();

        } else if (event.target.value == "Borrower") {
            this.setState({ utype: "3" })
            console.log(event.target.value);
            $(".JlGroupField").show();
        }
    }
    componentDidMount() {
        if (this.props.location.frompath == "onboardOfflineAadhar") {
            var propsLocation1 = this.props.location.state.aadhaarXml;
            this.setState({
                mobilenumber: propsLocation1.mobile
            })
            this.setState({ referenceId: sessionStorage.getItem("onboardRefID") })
            this.setState({ regMode: 3 })
            this.setState({ utype: propsLocation1.usertype })
            diffPath = true;
            this.getOfflineKYC();
            console.log(this.state.mobilenumber)
        } else if (this.props.location.frompath == "onboardAadharQR") {
            var propsLocation2 = this.props.location.state.aadhaarQR;
            console.log(propsLocation2);
            this.setState({ mobilenumber: propsLocation2.mobile })
            this.setState({ referenceId: sessionStorage.getItem("onboardRefID") })
            this.setState({ regMode: 3 });
            this.setState({ utype: propsLocation2.usertype })
            diffPath = true;

            this.getOfflineKYC();
        } else {
            sessionStorage.getItem('mobileno')
            sessionStorage.getItem('Digi_gender')
            sessionStorage.getItem('username')
            sessionStorage.getItem('pan')
            sessionStorage.getItem('dob')
            sessionStorage.getItem('referenceNo')

            this.setState({ gender: sessionStorage.getItem('Digi_gender') })
            this.setState({ name: sessionStorage.getItem('username') })
            this.setState({ referenceId: sessionStorage.getItem('referenceNo') })
            this.setState({ mobilenumber: sessionStorage.getItem('mobileno') })
            this.setState({ pannumber: sessionStorage.getItem('pan') })
            this.setState({ dateofbirth: sessionStorage.getItem('dob') })
            var digiGender = sessionStorage.getItem('Digi_gender');

            if (digiGender !== "" && digiGender !== null) {
                this.setState({ regMode: 2 });
            } else {
                this.setState({ regMode: 1 });
            }

            console.log(sessionStorage.getItem('dob'))
            //var DOB = sessionStorage.getItem('dob')
            var DOB = sessionStorage.getItem('dob')
            if (DOB) {
                var reverse = DOB.split("-").reverse().join("-");
                console.log(reverse)
                this.setState({ dateofbirth: reverse })
                console.log(this.state.dateofbirth)
            } else {
                return false;
            }

            console.log(this.state.regMode)

        }
        //mask of PAN 5-9 
        var n = 'BNFPC1234T';
        var singleNumber = n.slice(0, 4) + n.slice(4, n.length - 1).replace(/\d/g, '*') + n.slice(n.length - 1);
        console.log(singleNumber);
    }
    getOfflineKYC = () => {
        fetch(BASEURL + `/verification/offlinekyc/getkycinfo?refid=${this.state.referenceId}`, {
            method: "GET",

        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === "Success") {
                    this.setState({ gender: resdata.msgdata.gender })
                    this.setState({ dateofbirth: resdata.msgdata.dob })
                    this.setState({ name: resdata.msgdata.name })
                    this.setState({ offlineReg: true });
                } else {
                    //alert(resdata.message);
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
            }).catch(error => console.log(error)
            );
    }
    agentRegistration = () => {
        console.log(this.state.pannumber, this.state.name, this.state.mobilenumber, this.state.email)
        console.log(this.state.regMode)

        if (
            this.state.pannumber === null || this.state.pannumber === "" ||
            this.state.name === null || this.state.name === "" ||
            this.state.mobilenumber === null || this.state.mobilenumber === "" ||
            this.state.dateofbirth === null || this.state.dateofbirth === "" ||
            this.state.gender === null || this.state.gender === ""
        ) {
            this.setState({ resMsg: "Please Fill all the fields" })
            $("#exampleModalCenter6").modal('hide');
            $("#commonModal").click();

        } else if (this.state.dobValid == true) {
            this.setState({ resMsg: "Customer must be equal to or older than 18 years" })
            $("#exampleModalCenter6").modal('hide');
            $("#commonModal").click();
        } else {
            var selfReg = JSON.stringify({
                name: this.state.name,
                mobilenumber: this.state.mobilenumber,
                ...(this.state.email && { email: this.state.email }),
                pannumber: this.state.pannumber,
                dateofbirth: this.state.dateofbirth,
                utype: parseInt(this.state.utype),
                gender: this.state.gender,
                regmode: 1

            })
            var digiResponse = JSON.stringify({
                name: this.state.name,
                mobilenumber: this.state.mobilenumber,
                ...(this.state.email && { email: this.state.email }),
                pannumber: this.state.pannumber,
                dateofbirth: this.state.dateofbirth,
                utype: parseInt(this.state.utype),
                gender: this.state.gender,
                regmode: parseInt(this.state.regMode),
                refid: this.state.referenceId
            })
            var offlineKYCReg = JSON.stringify({
                name: this.state.name,
                mobilenumber: this.state.mobilenumber,
                ...(this.state.email && { email: this.state.email }),
                pannumber: this.state.pannumber,
                dateofbirth: this.state.dateofbirth,
                utype: parseInt(this.state.utype),
                gender: this.state.gender,
                regmode: parseInt(this.state.regMode),
                refid: this.state.referenceId
            })
            var bodyData;
            if (this.state.regMode == 1) {
                bodyData = selfReg;
            } else if (this.state.regMode == 2) {
                bodyData = digiResponse;
            } else if (this.state.regMode == 3) {
                bodyData = offlineKYCReg;
            }

            fetch(BASEURL + '/usrmgmt/agentassistedregistration', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: bodyData
            }).then((Response) => Response.json())
                .then((resdata) => {
                    if (resdata.status === 'Success') {
                        console.log(resdata);
                        //alert(resdata.message)
                        this.setState({
                            showBorrowerID: resdata.msgdata.login,
                            resMsg: resdata.message + ` ID: ${resdata.msgdata.login}`
                        })
                        $("#exampleModalCenter6").modal('hide');
                        $("#commonModal").click();

                        // confirmAlert({
                        //     message: resdata.message + ` ID: ${showBorrowerID}`,
                        //     buttons: [
                        //         {
                        //             label: "Okay",
                        //             onClick: () => {
                        //                 window.location = "/facilitatorDashboard"
                        //             },
                        //         },
                        //     ],
                        //     closeOnClickOutside: false,
                        // });
                        // this.setState({ resMsg: resdata.message + `Borrower ID ${showBorrowerID}` })
                        // $("#commonModal").click();
                    }
                    else {
                        this.setState({ resMsg: resdata.message })
                        $("#exampleModalCenter6").modal('hide');
                        $("#commonModal").click();
                        console.log(resdata.message)
                        // window.location.reload()
                    }
                })
        }
    }
    cancelRegistration = () => {
        window.location = "/facilitatorDashboard"
    }
    mobileOtp = (event) => {
        this.setState({ otpm: event.target.value })
    }
    emailOtp = (event) => {
        this.setState({ otpe: event.target.value })
    }
    otp = (event) => {
        fetch(BASEURL + '/usrmgmt/v2/generateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...(this.state.email && { email: this.state.email }),
                mobilenumber: this.state.mobilenumber,
                utype: parseInt(this.state.utype),
                pan: this.state.pannumber
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    // alert(resdata.message);
                    this.setState({
                        mobileref: resdata.msgdata.mobileref,
                        resMsg: resdata.message
                    });
                    if (resdata.msgdata.emailref) {
                        this.setState({ emailref: resdata.msgdata.emailref });
                    }
                    if (resdata.msgdata.userinfo) {
                        this.setState({ userInfo: resdata.msgdata.userinfo })
                    }
                    $("#commonModal").click()
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
                    });
                }
            })
    }
    checkResMsg = () => {
        if (this.state.resMsg.includes("ID:")) {
            window.location = "/facilitatorDashboard";
        } else if (this.state.resMsg.includes("OTP")) {
            $("#exampleModalCenter21").modal('hide');
            $("#otpModal").click();
        } else if (this.state.resMsg.includes("Please Fill all the fields")) {
            $("#otpModal").click();
        } else if (this.state.resMsg.includes("Customer must be equal to or older than 18 years")) {
            $("#otpModal").click();
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

        if (this.state.utype == 2) {
            $(".JlGroupField").hide();

        } else if (this.state.utype == 3) {
            $(".JlGroupField").show();

        }
        console.log(this.state.utype)
        var genderType;
        if (this.state.gender == "M") {
            genderType = "Male"
        } else if (this.state.gender == "F") {
            genderType = "Female"
        } else if (this.state.gender == "O") {
            genderType = "Others"
        }
        var uniqueOptions = [...new Set(this.state.options)];
        console.log(this.state.membergrpcategory)
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
                                <Link to="/facilitatorDashboard">Home</Link> / <Link to="/customer">Customer Onboarding</Link> / Registration</p>
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
                    {/* new Design */}
                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-4' id='headingCust'>
                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600", fontSize: "14px" }}>Registration</p>
                            </div>
                        </div>
                    </div>

                    <div class="container" style={{ width: "94%", fontSize: "14px" }}>
                        <div class="row">
                            {/* <div class="col-md-4 mb-3">
                                <ul class="nav nav-pills flex-column" id="myTab" role="tablist" style={{ textAlign: "center", fontSize: "18px", fontFamily: "Poppins,sans-serif" }}
                                >
                                    <li class="nav-item mb-2" onClick={this.usertype2}>
                                        <a class="nav-link active" id="profile-tab" data-toggle="tab"
                                            href="#profile" role="tab" aria-controls="profile" aria-selected="false" value="3"><FaUsers />Borrower</a>
                                    </li>
                                    <li class="nav-item " >
                                        <a class="nav-link" id="home-tab" data-toggle="tab"
                                            href="#home" role="tab" aria-controls="home" aria-selected="true" value="2" ><img src={cusOB} style={{ width: "30px" }} />Lender</a>
                                    </li>

                                </ul>
                            </div> */}

                            <div class="col-md-8">
                                <div class="tab-content" id="myTabContent" style={{ marginTop: "-15px" }}>
                                    <div class="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                {/*  */}
                                                <div className='row mb-2'>
                                                    <div className='col-3'>
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>Registering as</p>
                                                    </div>
                                                    {diffPath == false ?
                                                        <div className='col-4' style={{ fontFamily: "Poppins,sans-serif" }}>
                                                            <select className="form-select" onChange={this.userType} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)" }}>
                                                                <option defaultValue>
                                                                    Select
                                                                </option>
                                                                <option value="Lender">Lender</option>
                                                                <option value="Borrower">Borrower</option>
                                                            </select>
                                                        </div> :
                                                        <div className='col-4' style={{ fontFamily: "Poppins,sans-serif" }}>
                                                            <input className="form-control" type="text" value={`${this.state.utype == 2 ? "Lender" : "Borrower"}`} readOnly />
                                                        </div>}
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Name')}</p>
                                                        <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                            id="inputAddress" placeholder={t('EnterFirstName')} onChange={this.name} value={this.state.name} autoComplete="off" />
                                                        {(this.state.invalidUsername) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Username</span> : ''}
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="dob" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }} >{t('Date Of Birth')}</p>
                                                        <input type="date" onChange={this.dob} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                            className="form-control" id="dob" placeholder="MM/DD/YYYY" value={this.state.dateofbirth} />
                                                        {(this.state.dobValid) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Please enter a valid date of birth.</span> : ''}

                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Gender" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('gender')}</p>
                                                        <select id="genderSelect" className="form-select" onChange={this.gender} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}>
                                                            {/* {this.state.gender ? <option>{this.state.gender == "M" ? "Male" :
                                                                <span>{this.state.gender == "F" ? "Female" : <span>{this.state.gender == "F" ? "Others" : "Select"}</span>}</span>}</option> :
                                                                <option defaultValue>{t('Select Gender')}</option>}
                                                            <option value="M">{t('male')}</option>
                                                            <option value="F">{t('female')}</option>
                                                            <option value="O">{t('Others')}</option> */}

                                                            {this.state.gender ? (
                                                                genderType && (
                                                                    <option key={genderType} value={genderType}>
                                                                        {genderType}
                                                                    </option>
                                                                )
                                                            ) : (
                                                                <option defaultValue="">
                                                                    Select Gender
                                                                </option>
                                                            )}
                                                            {uniqueOptions.map(option => (
                                                                option !== genderType && (
                                                                    <option key={option} value={option}>
                                                                        {option}
                                                                    </option>
                                                                )
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Email" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Email(Optional)')}</p>
                                                        <input type="text" className="form-control" id="inputAddress" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                            placeholder={t('Enter Email ID')} onChange={this.email} autoComplete="off" />
                                                        {(this.state.invalidEmail) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Email ID</span> : ''}
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Mobile" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Mobile')}</p>
                                                        <input type="number" className="form-control" id="inputAddress" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                            placeholder={t('Enter Mobile Number')} onChange={this.mobilenumber} value={this.state.mobilenumber} autoComplete="off" />
                                                        {(this.state.invalidMnum) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Mobile Number</span> : ''}
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Pan" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t("PAN")}</p>
                                                        <input id="Pan" type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                            placeholder={t('Enter PAN')} onChange={this.pannumber} autoComplete="off" value={this.state.pannumber} />
                                                        {this.validator.message('pannumber', this.state.pannumber, 'required|pannumber|min:8|10|max:14', { className: 'text-danger' })}
                                                        {(this.state.invalidPan) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid PAN</span> : ''}
                                                    </div>
                                                </div>
                                                <hr />

                                                <div className="form-row" style={{ textAlign: "center" }}>
                                                    <div className="form-group col">
                                                        <button type="button" className="btn btn-sm mr-2 text-white" style={{ backgroundColor: "rgb(136, 189, 72)", fontSize: "14px" }}
                                                            onClick={this.agentRegistration}>Register</button>
                                                        <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: "#0079BF", fontSize: "14px" }}
                                                            onClick={this.cancelRegistration}>{t('Cancel')}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button id='commonModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter21">
                    </button>
                    <div className="modal fade" id="exampleModalCenter21" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <div className="modal-body">
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                        {this.state.resMsg}
                                    </p>
                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)", float: "right" }} onClick={this.checkResMsg}>Okay</button>
                                        </div>
                                    </div></div>
                            </div>
                        </div>
                    </div>
                    {/* otp Modal */}
                    <button id='otpModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter6">
                        Launch demo modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter6" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div className="modal-body">
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Enter OTP</p>
                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                    {
                                        this.state.userInfo &&
                                        <>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "14px" }}>{this.state.userInfo.msg}</p>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "14px" }}>
                                                <div className='col-lg-4 col-md-4 col-sm-4'>
                                                    <p className=''>Name</p>
                                                    <p className='' style={{ fontWeight: "500", marginTop: "-14px" }}>{this.state.userInfo.name}</p>
                                                </div>
                                                <div className='col-lg-4 col-md-4 col-sm-4'>
                                                    <p className=''>Email ID</p>
                                                    <p className='' style={{ fontWeight: "500", marginTop: "-14px", wordWrap: "break-word" }}>{this.state.userInfo.emailid}</p>
                                                </div>
                                                <div className='col-lg-4 col-md-4 col-sm-4'>
                                                    <p className=''>Mobile Number</p>
                                                    <p className='' style={{ fontWeight: "500", marginTop: "-14px" }}>{this.state.userInfo.mobilenumber}</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "14px" }}>
                                                <div className='col-lg-3 col-sm-3 col-md-2'>
                                                    <p className=''>PAN</p>
                                                    <p className='' style={{ fontWeight: "500", marginTop: "-14px" }}>{this.state.userInfo.pan}</p>
                                                </div>
                                            </div>
                                        </>
                                    }

                                    <div className='row'>
                                        <div className='col-lg-6'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "14px" }}>Mobile OTP</p>
                                            <input className='form-control' type='number' placeholder='Enter OTP' onChange={this.mobileOtp}
                                                onInput={(e) => {
                                                    e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                }}
                                                autoComplete='off' style={{ marginTop: "-10px" }} />
                                        </div>
                                        {this.state.emailref &&
                                            <div className='col-lg-6'>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "14px" }}>Email OTP</p>
                                                <input className='form-control' type='number' placeholder='Enter OTP' onChange={this.emailOtp}
                                                    onInput={(e) => {
                                                        e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                    }}
                                                    autoComplete='off' style={{ marginTop: "-10px" }} />
                                            </div>
                                        }
                                    </div>
                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.agentRegistration}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" style={{ backgroundColor: "#0079BF" }} onClick={this.cancelRegistration}>Cancel</button>
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

export default withTranslation()(OnboardRegister)
