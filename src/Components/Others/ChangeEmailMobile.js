import React, { Component } from 'react';
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { BASEURL } from '../assets/baseURL';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { FaMobileAlt, FaAngleLeft } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

class ChangeEmailMobile extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            optntype: "",							//4-edit only mobile, 5-edit only email						
            mobilenumber: "",			//Mobile Number mandaroty if its a change of mobilenumber			
            email: "",	//Email mandaroty if its a change of email id
            utype: "",                          //1-system user, 2-lender, 3-borrower, 4-facilitator, 5-evaluator

            email: "",
            emailref: "",
            emailotp: "",
            optntype: "",		//4-edit only mobile, 5-edit only email	
            mobile: "",
            mobref: "",
            mobileotp: "",

            Emobref: "",
            Eemailref: "",

            pmobile: "",
            pemail: "",
            //changeType
            changeType: sessionStorage.getItem("changeType")
        }
        this.mobilenumber = this.mobilenumber.bind(this);
        this.email = this.email.bind(this);
        this.mobileotp = this.mobileotp.bind(this);
        this.emailotp = this.emailotp.bind(this);
        this.getCMOtp = this.getCMOtp.bind(this);
        this.getCEOtp = this.getCEOtp.bind(this);
        this.editPDM = this.editPDM.bind(this);
        this.editPDE = this.editPDE.bind(this);
        this.getPersonalDetails = this.getPersonalDetails.bind(this);
    }
    mobilenumber(event) {
        this.setState({ mobilenumber: event.target.value })
    }
    email(event) {
        this.setState({ email: event.target.value })
    }
    mobileotp(event) {
        this.setState({ mobileotp: event.target.value })
    }
    emailotp(event) {
        this.setState({ emailotp: event.target.value })
    }
    componentDidMount() {
        this.getPersonalDetails();
    }
    getPersonalDetails(event) {
        fetch(BASEURL + '/usrmgmt/getpersonaldetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                memmid: parseInt(sessionStorage.getItem('memmID')),
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ pemail: resdata.msgdata.email })
                    this.setState({ pmobile: resdata.msgdata.mobile })
                }
                else {
                    alert(resdata.message);
                }
            })
    }
    getCMOtp(event) {
        fetch(BASEURL + '/usrmgmt/getotpforeditpersonaldetails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                optntype: "4",
                mobilenumber: this.state.mobilenumber,
                email: this.state.pemail,
                utype: sessionStorage.getItem('userType')
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    this.setState({ mobref: resdata.msgdata.mobileref })
                    this.setState({ emailref: resdata.msgdata.emailref })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    $('.otpField').toggle();
                                    $(".otpButton").toggle();
                                },
                            },
                        ],
                    });
                    $("#mobileOtp").hide()
                    $("#cMOtpbtn").hide()
                    var timeleft = 30;
                    var downloadTimer = setInterval(function () {
                        if (timeleft < 0) {
                            clearInterval(downloadTimer);
                            document.getElementById("countdown2").innerHTML = "Resend OTP";
                            $('#countdown').hide()
                            $('#countdown2').show()

                        } else {
                            document.getElementById("countdown").innerHTML = "Resend OTP in " + timeleft + "s";
                            $('#countdown2').hide()
                            $('#countdown').show()
                        }
                        timeleft -= 1;
                    }, 1000);
                }
                else {
                    // alert("Issue: " + resdata.message);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    // $('.otpField').toggle();
                                    // $(".otpButton").toggle();
                                },
                            },
                        ],
                    });
                }

            })
    }
    MregenerateOTP = () => {
        fetch(BASEURL + '/usrmgmt/regenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                operationtype: 4,
                emailref: String(this.state.emailref),
                mobileref: String(this.state.mobref),
                otpmode: "3"
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    // alert(resdata.message);
                    this.setState({ mobref: resdata.msgdata.mobileref });
                    this.setState({ emailref: resdata.msgdata.emailref });

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

                    var timeleft = 30;
                    var downloadTimer = setInterval(function () {
                        if (timeleft < 0) {
                            clearInterval(downloadTimer);
                            document.getElementById("countdown2").innerHTML = "Resend OTP";
                            $('#countdown').hide()
                            $('#countdown2').show()

                        } else {
                            document.getElementById("countdown").innerHTML = "Resend OTP in " + timeleft + "s";
                            $('#countdown2').hide()
                            $('#countdown').show()
                        }
                        timeleft -= 1;
                    }, 1000);


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
            .catch((error) => {
                console.log(error)
            })
    }
    editPDM(event) {
        fetch(BASEURL + '/usrmgmt/editpersonaldetails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                email: this.state.pemail,
                emailref: this.state.emailref,
                emailotp: this.state.emailotp,
                optntype: "4",
                mobile: this.state.mobilenumber,
                mobref: this.state.mobref,
                mobileotp: this.state.mobileotp
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    confirmAlert({
                        message: resdata.message + ". Please Login again to access your account",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    sessionStorage.removeItem('status')
                                    window.location = '/login';
                                },
                            },
                        ],
                    });

                }
                else {
                    // alert("Issue: " + resdata.message);
                    confirmAlert({
                        message: "Issue: " + resdata.message,
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

    getCEOtp(event) {
        fetch(BASEURL + '/usrmgmt/getotpforeditpersonaldetails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                optntype: "5",
                mobilenumber: this.state.pmobile,
                email: this.state.email,
                utype: sessionStorage.getItem('userType')
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);

                if (resdata.status == 'Success') {
                    this.setState({ Emobref: resdata.msgdata.mobileref })
                    this.setState({ Eemailref: resdata.msgdata.emailref })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    $('.emailotpButton').toggle();
                                    $(".emailotpField").toggle();
                                },
                            },
                        ],
                    });
                    $("#EmailOtpBtn").hide()
                    $("#chCEotpbtn").hide()
                    var timeleft = 30;
                    var downloadTimer = setInterval(function () {
                        if (timeleft < 0) {
                            clearInterval(downloadTimer);
                            document.getElementById("Ecountdown2").innerHTML = "Resend OTP";
                            $('#Ecountdown').hide()
                            $('#Ecountdown2').show()

                        } else {
                            document.getElementById("Ecountdown").innerHTML = "Resend OTP in " + timeleft;
                            $('#Ecountdown2').hide()
                            $('#Ecountdown').show()
                        }
                        timeleft -= 1;
                    }, 1000);
                }
                else {
                    // alert("Issue: " + resdata.message);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    // $('.otpField').toggle();
                                    // $(".otpButton").toggle();
                                },
                            },
                        ],
                    });
                }

            })
    }
    EregenerateOTP = () => {
        fetch(BASEURL + '/usrmgmt/regenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                operationtype: 5,
                emailref: String(this.state.Eemailref),
                mobileref: String(this.state.Emobref),
                otpmode: "3"
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    // alert(resdata.message);
                    this.setState({ Emobref: resdata.msgdata.mobileref })
                    this.setState({ Eemailref: resdata.msgdata.emailref })

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

                    var timeleft = 30;
                    var downloadTimer = setInterval(function () {
                        if (timeleft < 0) {
                            clearInterval(downloadTimer);
                            document.getElementById("Ecountdown2").innerHTML = "Resend OTP";
                            $('#Ecountdown').hide()
                            $('#Ecountdown2').show()

                        } else {
                            document.getElementById("Ecountdown").innerHTML = "Resend OTP in " + timeleft;
                            $('#Ecountdown2').hide()
                            $('#Ecountdown').show()
                        }
                        timeleft -= 1;
                    }, 1000);


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
            .catch((error) => {
                console.log(error)
            })
    }
    editPDE(event) {

        fetch(BASEURL + '/usrmgmt/editpersonaldetails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                email: this.state.email,
                emailref: this.state.Eemailref,
                emailotp: this.state.emailotp,
                optntype: "5",
                mobile: this.state.pmobile,
                mobref: this.state.Emobref,
                mobileotp: this.state.mobileotp
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    confirmAlert({
                        message: resdata.message + ". Please Login again to access your account",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    sessionStorage.removeItem('status')
                                    window.location = '/login';
                                },
                            },
                        ],
                    });

                }
                else {
                    // alert("Issue: " + resdata.message);
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
    cancelSubmit = () => {
        window.location.reload()
    }

    // onSelectOption() {
    //     $('.otpField').toggle();
    // }

    backFromChangeEmailMobile = () => {
        if (sessionStorage.getItem('userType') == 2) {
            window.location = "/lenderdashboard";
        } else if (sessionStorage.getItem('userType') == 3) {
            window.location = "/borrowerdashboard";
        } else if (sessionStorage.getItem('userType') == 4) {
            window.location = "/facilitatorDashboard";
        } else if (sessionStorage.getItem('userType') == 5) {
            window.location = "/evaluatorDashboard";
        } else if (sessionStorage.getItem('userType') == 1) {
            window.location = "/sysUserDashboard";
        } else if (sessionStorage.getItem('userType') == 0) {
            window.location = "/landing";
        } else {
            window.location = "/";
        }
    }
    render() {
        var chType = this.state.changeType;
        console.log(chType);
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
        return (
            <div style={{ paddingLeft: "24%", paddingRight: "24%", paddingTop: "5px" }}>
                <div className="">
                    <div className="row d-flex justify-content-center" >
                        <div className="col-md-12 ">
                            <div className="card" style={{ width: "100%", cursor: "default", boxShadow: "5px 10px 18px #888888" }}>
                                <div className="credentials" style={{ padding: "10px 20px" }}>

                                    {chType == "2" ?
                                        <div className="form-row" id='addressdetails1' style={{ paddingLeft: "20px" }}>
                                            <div className='col-6' id='headinglndwl'>
                                                <div className="two__image" style={{ paddingLeft: "20px", marginLeft: "-10px" }}>
                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Change Mobile Number</p>
                                                </div>
                                            </div>
                                            <div className="col" id='facnavRes3' style={{ textAlign: "end" }}>
                                                <button style={myStyle} onClick={this.backFromChangeEmailMobile}>
                                                    <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></button>
                                            </div>
                                        </div>
                                        :
                                        <span>{chType == "1" ?
                                            <div className="form-row" id='addressdetails1' style={{ paddingLeft: "20px" }}>
                                                <div className='col-5' id='headinglndwl'>
                                                    <div className="two__image" style={{ paddingLeft: "20px", marginLeft: "-10px" }}>
                                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Change Email ID</p>
                                                    </div>
                                                </div>
                                                <div className="col" id='facnavRes3' style={{ textAlign: "end" }}>
                                                    <button style={myStyle} onClick={this.backFromChangeEmailMobile}>
                                                        <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></button>
                                                </div>
                                            </div>
                                            :
                                            <span>{chType == "3" ?
                                                <div className="form-row" id='addressdetails1' style={{ paddingLeft: "20px" }}>
                                                    <div className='col-9' id='headinglndwl'>
                                                        <div className="two__image" style={{ paddingLeft: "20px", marginLeft: "-10px" }}>
                                                            <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Change Mobile Number/Email ID</p>
                                                        </div>
                                                    </div>
                                                    <div className="col" id='facnavRes3' style={{ textAlign: "end" }}>
                                                        <button style={myStyle} onClick={this.backFromChangeEmailMobile}>
                                                            <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></button>
                                                    </div>
                                                </div> : null}</span>}</span>
                                    }
                                    <div className='row pt-2 pl-2 pr-2'>
                                        <div className='col'>
                                            {chType == "1" ?
                                                <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                                    <li className="nav-item" > <a data-toggle="pill" id="myNavLink" href="#email" className="nav-link active"
                                                        style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}><MdOutlineEmail />&nbsp;Email ID</a> </li>
                                                </ul>
                                                :
                                                <span>{chType == "2" ?
                                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                                        <li className="nav-item" > <a data-toggle="pill" id="myNavLink" href="#mobile" className="nav-link active"
                                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}><FaMobileAlt />
                                                            &nbsp;Mobile Number</a> </li>
                                                    </ul>
                                                    :
                                                    <span>{chType == "3" ?
                                                        <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                                            <li className="nav-item" > <a data-toggle="pill" id="myNavLink" href="#mobile" className="nav-link active"
                                                                style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}><FaMobileAlt />
                                                                &nbsp;Mobile Number</a> </li>
                                                            <li className="nav-item" > <a data-toggle="pill" id="myNavLink" href="#email" className="nav-link"
                                                                style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}><MdOutlineEmail />&nbsp;Email ID</a> </li>
                                                        </ul> : null}</span>}</span>}

                                        </div>
                                    </div>
                                    <div className='row mt-2' style={{ marginTop: "-12px" }}>
                                        <div className='col'>
                                            {chType == "1" ?
                                                <div className='tab-content'>
                                                    <div id="email" className=" container register-form tab-pane fade show active" style={{}}>
                                                        <div id='emailotpButton' >
                                                            <div className='row mb-2'>
                                                                <p className=' ' style={{ fontStyle: "Poppins, sans-serif", fontSize: "16px", color: "#00264d", fontWeight: "bold" }} >
                                                                    Enter New Email Address
                                                                </p>
                                                                <div className='col-9' style={{ marginTop: "-10px" }}>
                                                                    <input className='form-control' type="text" placeholder="Enter New Email Address" style={{ backgroundColor: "whitesmoke" }} onChange={this.email} />
                                                                </div>
                                                                <div className='col-3' style={{ marginTop: "-10px" }}>
                                                                    <button className='btn text-white' id='EmailOtpBtn' onClick={this.getCEOtp} style={{ backgroundColor: "#0079BF", paddingLeft: "30px", paddingRight: "30px" }}>Get OTP</button>
                                                                    <span>
                                                                        <p id="Ecountdown" style={{ color: "grey" }}></p>
                                                                        <p id='Ecountdown2' onClick={this.EregenerateOTP} style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}></p>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='emailotpField' style={{ display: "none" }}>
                                                            <div className='row'>
                                                                <div className='col-6'>
                                                                    <p style={{ fontStyle: "Poppins, sans-serif", color: "#00264d", fontWeight: "bold" }}>Mobile OTP</p>
                                                                    <input className='form-control' type='number' placeholder='Enter Mobile OTP' onChange={this.mobileotp}
                                                                        style={{ backgroundColor: "whitesmoke", borderRadius: "8px", marginTop: "-10px" }}
                                                                        onInput={(e) => {
                                                                            e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                                        }} />
                                                                </div>
                                                                <div className='col-6'>
                                                                    <p style={{ fontStyle: "Poppins, sans-serif", color: "#00264d", fontWeight: "bold" }}>Email OTP</p>
                                                                    <input className='form-control' type='number' placeholder='Enter Email OTP' onChange={this.emailotp}
                                                                        style={{ backgroundColor: "whitesmoke", borderRadius: "8px", marginTop: "-10px" }}
                                                                        onInput={(e) => {
                                                                            e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                                        }} />
                                                                </div>
                                                            </div>
                                                            <div className='row' style={{ marginTop: "5px" }}>
                                                                <div className='col' style={{ textAlign: "end" }}>
                                                                    <button className='btn btn-sm' onClick={this.editPDE} style={{ backgroundColor: "rgb(136, 189, 72)", color: "white" }}>Submit</button>&nbsp;&nbsp;
                                                                    <button className='btn btn-sm' onClick={this.cancelSubmit} style={{ backgroundColor: "#0074BF", color: "white" }}>Cancel</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <span>{chType == "2" ?
                                                    <div className='tab-content'>
                                                        <div id="mobile" className=" container register-form tab-pane fade show active" style={{}}>
                                                            <div id='otpButton' >
                                                                <div className='row mb-2'>
                                                                    <p className=' ' style={{ fontStyle: "Poppins, sans-serif", fontSize: "16px", color: "#00264d", fontWeight: "bold" }} >
                                                                        Enter New Mobile Number
                                                                    </p>
                                                                    <div className='col-9' style={{ marginTop: "-10px" }}>
                                                                        <input className='form-control' type="number" placeholder="Enter New Mobile Number" style={{ backgroundColor: "whitesmoke" }} onChange={this.mobilenumber} />
                                                                    </div>
                                                                    <div className='col-3' style={{ marginTop: "-10px" }}>
                                                                        <button className='btn text-white' id='mobileOtp' onClick={this.getCMOtp} style={{ backgroundColor: "#0079BF", paddingLeft: "30px", paddingRight: "30px" }}>Get OTP</button>
                                                                        <span id='showCountDown'>
                                                                            <p id="countdown" style={{ color: "grey" }}></p>
                                                                            <p id='countdown2' onClick={this.MregenerateOTP} style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}></p>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='otpField' style={{ display: "none" }}>
                                                                <div className='row'>
                                                                    <div className='col-6'>
                                                                        <p style={{ fontStyle: "Poppins, sans-serif", color: "#00264d", fontWeight: "bold" }}>Mobile OTP</p>
                                                                        <input className='form-control' type='number' placeholder='Enter Mobile OTP' onChange={this.mobileotp}
                                                                            style={{ backgroundColor: "whitesmoke", borderRadius: "8px", marginTop: "-10px" }}
                                                                            onInput={(e) => {
                                                                                e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                                            }} />
                                                                    </div>
                                                                    <div className='col-6'>
                                                                        <p style={{ fontStyle: "Poppins, sans-serif", color: "#00264d", fontWeight: "bold" }}>Email OTP</p>
                                                                        <input className='form-control' type='number' placeholder='Enter Email OTP' onChange={this.emailotp}
                                                                            style={{ backgroundColor: "whitesmoke", borderRadius: "8px", marginTop: "-10px" }}
                                                                            onInput={(e) => {
                                                                                e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                                            }} />
                                                                    </div>
                                                                </div>
                                                                <div className='row' style={{ marginTop: "5px" }}>
                                                                    <div className='col' style={{ textAlign: "end" }}>
                                                                        <button className='btn btn-sm' onClick={this.editPDM} style={{ backgroundColor: "rgb(136, 189, 72)", color: "white" }}>Submit</button>&nbsp;&nbsp;
                                                                        <button className='btn btn-sm' onClick={this.cancelSubmit} style={{ backgroundColor: "#0074BF", color: "white" }}>Cancel</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <span>{chType == "3" ?
                                                        <div className='tab-content'>
                                                            <div id="mobile" className=" container register-form tab-pane fade show active" style={{}}>
                                                                <div id='otpButton' >
                                                                    <div className='row mb-2'>
                                                                        <p className=' ' style={{ fontStyle: "Poppins, sans-serif", fontSize: "16px", color: "#00264d", fontWeight: "bold" }} >
                                                                            Enter New Mobile Number
                                                                        </p>
                                                                        <div className='col-9' style={{ marginTop: "-10px" }}>
                                                                            <input className='form-control' type="number" placeholder="Enter New Mobile Number" style={{ backgroundColor: "whitesmoke" }} onChange={this.mobilenumber} />
                                                                        </div>
                                                                        <div className='col-3' style={{ marginTop: "-10px" }}>
                                                                            <button className='btn text-white' id='cMOtpbtn' onClick={this.getCMOtp} style={{ backgroundColor: "#0079BF", paddingLeft: "30px", paddingRight: "30px" }}>Get OTP</button>
                                                                            <span id='showCountDown'>
                                                                                <p id="countdown" style={{ color: "grey" }}></p>
                                                                                <p id='countdown2' onClick={this.MregenerateOTP} style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}></p>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='otpField' style={{ display: "none" }}>
                                                                    <div className='row'>
                                                                        <div className='col-6'>
                                                                            <p style={{ fontStyle: "Poppins, sans-serif", color: "#00264d", fontWeight: "bold" }}>Mobile OTP</p>
                                                                            <input className='form-control' type='number' placeholder='Enter Mobile OTP' onChange={this.mobileotp}
                                                                                style={{ backgroundColor: "whitesmoke", borderRadius: "8px", marginTop: "-10px" }}
                                                                                onInput={(e) => {
                                                                                    e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                                                }} />
                                                                        </div>
                                                                        <div className='col-6'>
                                                                            <p style={{ fontStyle: "Poppins, sans-serif", color: "#00264d", fontWeight: "bold" }}>Email OTP</p>
                                                                            <input className='form-control' type='number' placeholder='Enter Email OTP' onChange={this.emailotp}
                                                                                style={{ backgroundColor: "whitesmoke", borderRadius: "8px", marginTop: "-10px" }}
                                                                                onInput={(e) => {
                                                                                    e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                                                }} />
                                                                        </div>
                                                                    </div>
                                                                    <div className='row' style={{ marginTop: "5px" }}>
                                                                        <div className='col' style={{ textAlign: "end" }}>
                                                                            <button className='btn btn-sm' onClick={this.editPDM} style={{ backgroundColor: "rgb(136, 189, 72)", color: "white" }}>Submit</button>&nbsp;&nbsp;
                                                                            <button className='btn btn-sm' onClick={this.cancelSubmit} style={{ backgroundColor: "#0074BF", color: "white" }}>Cancel</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div id="email" className=" container register-form tab-pane fade show " style={{}}>
                                                                <div id='emailotpButton' >
                                                                    <div className='row mb-2'>
                                                                        <p className=' ' style={{ fontStyle: "Poppins, sans-serif", fontSize: "16px", color: "#00264d", fontWeight: "bold" }} >
                                                                            Enter New Email Address
                                                                        </p>
                                                                        <div className='col-9' style={{ marginTop: "-10px" }}>
                                                                            <input className='form-control' type="text" placeholder="Enter New Email Address" style={{ backgroundColor: "whitesmoke" }} onChange={this.email} />
                                                                        </div>
                                                                        <div className='col-3' style={{ marginTop: "-10px" }}>
                                                                            <button className='btn text-white' id='chCEotpbtn' onClick={this.getCEOtp} style={{ backgroundColor: "#0079BF", paddingLeft: "30px", paddingRight: "30px" }}>Get OTP</button>
                                                                            <span>
                                                                                <p id="Ecountdown" style={{ color: "grey" }}></p>
                                                                                <p id='Ecountdown2' onClick={this.EregenerateOTP} style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}></p>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='emailotpField' style={{ display: "none" }}>
                                                                    <div className='row'>
                                                                        <div className='col-6'>
                                                                            <p style={{ fontStyle: "Poppins, sans-serif", color: "#00264d", fontWeight: "bold" }}>Mobile OTP</p>
                                                                            <input className='form-control' type='number' placeholder='Enter Mobile OTP' onChange={this.mobileotp}
                                                                                style={{ backgroundColor: "whitesmoke", borderRadius: "8px", marginTop: "-10px" }}
                                                                                onInput={(e) => {
                                                                                    e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                                                }} />
                                                                        </div>
                                                                        <div className='col-6'>
                                                                            <p style={{ fontStyle: "Poppins, sans-serif", color: "#00264d", fontWeight: "bold" }}>Email OTP</p>
                                                                            <input className='form-control' type='number' placeholder='Enter Email OTP' onChange={this.emailotp}
                                                                                style={{ backgroundColor: "whitesmoke", borderRadius: "8px", marginTop: "-10px" }}
                                                                                onInput={(e) => {
                                                                                    e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                                                }} />
                                                                        </div>
                                                                    </div>
                                                                    <div className='row' style={{ marginTop: "5px" }}>
                                                                        <div className='col' style={{ textAlign: "end" }}>
                                                                            <button className='btn btn-sm' onClick={this.editPDE} style={{ backgroundColor: "rgb(136, 189, 72)", color: "white" }}>Submit</button>&nbsp;&nbsp;
                                                                            <button className='btn btn-sm' onClick={this.cancelSubmit} style={{ backgroundColor: "#0074BF", color: "white" }}>Cancel</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> : null}</span>}</span>}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            // <div className="row">
            //     <div className="login col-md-6 mx-auto p-0">
            //         <div className="">
            //             <div className="login-box-1">
            //                 <div className="login-snip signin-text p-5">
            //                     <input id="tab-2" type="radio" name="tab" className="sign-up" />
            //                     <label htmlFor="tab-2" className="text-dark tab">Change Email/Mobile</label>
            //                     <div className="p-3">
            //                         <ul role="tablist" className="nav bg-light nav-pills nav-fill mb-3">
            //                             <li className="nav-item"> <a data-toggle="pill" href="#mobile" className="nav-link border active">Change Mobile Number </a> </li>
            //                             <li className="nav-item"> <a data-toggle="pill" href="#email" className="nav-link border"> Change Email Id </a> </li>
            //                         </ul>
            //                     </div>
            //                     <div className="tab-content p-2 ">
            //                         <div id="mobile" className="register-form tab-pane fade show active">
            //                             <div className="group pt-3">
            //                                 <label htmlFor="inputLoginName">Mobile Number</label>
            //                                 <input id="user" type="text" onChange={this.mobilenumber} className="input" placeholder="Enter Your Mobile Number" />
            //                             </div>

            //                             <div className="otpField group pt-3" style={{ display: "none" }}>
            //                                 <p className="text-muted">Enter OTP</p>
            //                                 <input placeholder="Enter Mobile OTP" onChange={this.mobileotp} type="text" className="input m-2" />
            //                                 <input onChange={this.emailotp} placeholder="Enter Email OTP" type="text" className="input m-2" />

            //                                 <button onClick={this.editPDM} type="submit" className="btn btn-primary"  >Submit</button>
            //                             </div>
            //                             <div className="group mt-3">
            //                                 <button onClick={this.getCMOtp} type="submit" className="btn btn-primary otpButton"  >Get OTP</button>
            //                             </div>
            //                         </div>
            //                         <div id="email" className="register-form tab-pane fade">
            //                             <div className="group pt-3">
            //                                 <label htmlFor="inputLoginName">Email Id</label>
            //                                 <input id="user" type="text" onChange={this.email} className="input" placeholder="Enter Your Email Id" />
            //                             </div>

            //                             <div className="otpField group pt-3" style={{ display: "none" }}>
            //                                 <p className="text-muted">Enter OTP</p>
            //                                 <input placeholder="Enter Mobile OTP" onChange={this.mobileotp} type="text" className="input m-2" />
            //                                 <input onChange={this.emailotp} placeholder="Enter Email OTP" type="text" className="input m-2" />
            //                                 {/* <input id="newPassword" onChange={this.newpassword} placeholder="Create New Password" name="password" required="" type="password" className="input m-2" />
            //                                 <input id="confirmNewPassword" onChange={this.confirmpassword} placeholder="Confirm New Password" name="password" required="" type="password" className="input m-2" /> */}

            //                                 <button onClick={this.editPDE} type="submit" className="btn btn-primary">Submit</button>
            //                             </div>
            //                             <div className="group mt-3">
            //                                 <button onClick={this.getCEOtp} type="submit" className="btn btn-primary otpButton"  >Get OTP</button>
            //                             </div>
            //                         </div>

            //                     </div>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </div>
        )
    }
}

export default ChangeEmailMobile
