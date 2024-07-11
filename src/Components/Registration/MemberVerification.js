import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import SimpleReactValidator from 'simple-react-validator';
import $ from 'jquery';
import './Borrow.css';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from "react-confirm-alert";
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';
import {
    FaCheckCircle, FaTimesCircle, FaAngleLeft, FaFileDownload, FaRegUser, FaFileSignature,
    FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit, FaRegFileVideo, FaFolderPlus,
    FaRegTrashAlt, FaUserLock, FaRegSave, FaFileAlt, FaFileUpload,
    FaEye
} from "react-icons/fa";
import editRole from '../assets/editRole.png';
import { BsInfoCircle } from "react-icons/bs";
import { Card, Container, Row, Col } from 'react-bootstrap';

var Interval;
export class MemberVerification extends Component {
    //updated
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            Id: "",
            Id2: "",

            encrypteddata: "",
            mobileOtp: "",
            mobileRef: "",
            emailOtp: "",
            emailRef: "",
            countdown: 4 * 60,
            countDownFlag: false,
            percentage: 100,
            resMsg: ''
        }
        this.interval = null;
    }
    componentDidMount() {
        // // Step 1: Encode the data and generate the URL
        // const encrypteddata1 = "IA5a8UOfaeHXOUFMWYxryUoC+RVt8gOXlVQxNvz0LGen7T4uBk1RGwtYM3KvOpBGVLvJgKdAd+wOFCLtYR7z64eiQcYbULvKcBh5F7dQ7W8=";
        // const encodedData = encodeURIComponent(encrypteddata1);
        // const dataurl = `https://localhost:3000?encrypteddata=${encodedData}`;
        // console.log("Generated URL:", dataurl);

        // // Simulate navigating to the URL (for testing purposes, replace the current URL with the generated one)
        // window.history.pushState({}, '', dataurl);

        // Step 2: Extract the encrypteddata parameter
        const url = window.location.href;
        // const url = "https://ilpuat.finfotech.co.in/memberVerification?encrypteddata=uRYcTFHBkZPBqzylN1EMd1BmyFzExATB2yiYqhrIHf6Wu/0SNkGzoHYPWx+0ZEqMGqoGk4PMI9UW54Zo7MZkZbyNm2jRrHddJ71muE73+RA="
        const urlParams = new URLSearchParams(new URL(url).search);
        let encrypteddata = urlParams.get('encrypteddata');
        console.log("Extracted Encrypted Data:", encrypteddata);

        // Replace spaces with '+'
        encrypteddata = encrypteddata.replace(/ /g, '+');

        // Step 3: Decode the extracted data
        const decodedData = decodeURIComponent(encrypteddata);
        console.log("Decoded Data:", decodedData);
        this.setState({ encrypteddata: decodedData });
        this.generateMemberOtp(decodedData);
    }
    generateMemberOtp = (encrypteddata) => {
        this.setState({ showLoader: true })
        fetch(BASEURL + '/usrmgmt/generateentitymemberotp', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                encrypteddata: encrypteddata
            })
        })
            .then(response => response.json())
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    this.setState({
                        showLoader: false,
                        mobileRef: resdata.msgdata.mobileref,
                        emailRef: resdata.msgdata.emailref
                    })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {

                                    // var timeleft = 30;
                                    // var downloadTimer = setInterval(function () {
                                    //     if (timeleft < 0) {
                                    //         clearInterval(downloadTimer);
                                    //         document.getElementById("countdown2").innerHTML = "Resend OTP";
                                    //         $('#countdown').hide()
                                    //         $('#countdown2').show()

                                    //     } else {
                                    //         document.getElementById("countdown").innerHTML = "Resend OTP in " + timeleft + "s";
                                    //         $('#countdown2').hide()
                                    //         $('#countdown').show()
                                    //     }
                                    //     timeleft -= 1;
                                    // }, 1000);
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                } else {
                    this.setState({ showLoader: false })
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
            })
            .catch((error) => {
                this.setState({
                    showLoader: false
                })
                console.log(error);
            });
    }
    setEntityMemberOtpVerification = () => {
        this.setState({ showLoader: true })
        fetch(BASEURL + '/usrmgmt/entitymemberotpverification', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                encrypteddata: this.state.encrypteddata,
                mobileotp: this.state.mobileOtp,
                mobileref: this.state.mobileRef,
                ...(this.state.emailOtp && { emailotp: this.state.emailOtp }),
                ...(this.state.emailRef && { emailref: this.state.emailRef }),
            })
        })
            .then(response => response.json())
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    this.setState({ showLoader: false })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    $("#VKYCAlertModal").click()
                                    this.setState({ resMsg: resdata.message })
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                } else {
                    this.setState({ showLoader: false })
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
            })
            .catch((error) => {
                console.log(error);
            });
    }
    refreshPage = () => {
        //window.location = "/login"
    }
    mobileOtp = (event) => {
        this.setState({ mobileOtp: event.target.value })
    }
    emailOtp = (event) => {
        this.setState({ emailOtp: event.target.value })
    }
    getKYC = () => {
        this.setState({ showLoader: true })
        const encodedEncryptedData = encodeURIComponent(this.state.encrypteddata);
        fetch(BASEURL + '/vf/entitymembervkycreq?encrypteddata=' + encodedEncryptedData, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
            },

        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    //console.log(resdata);
                    this.setState({
                        Id: resdata.msgdata.vkycreqno,
                        showLoader: false
                    });
                    $("#VKYCAlert2Modal").click();

                    //alert(resdata.message);
                    Interval = setInterval(() => { this.getKYCStatus() }, 3000);
                } else {
                    this.setState({ showLoader: false })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                }
                            }
                        ],
                        closeOnClickOutside: false,
                    })
                }
            }).catch(error => console.log(error)
            );
    }
    getKYCStatus = () => {
        // console.log("timer");
        fetch(BASEURL + '/vf/getvkycrequeststatus?vkycreqno=' + this.state.Id + '&usermode=CUST', {
            method: 'get',
            headers: {
                'Accept': 'application/json'
            },

        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ Id2: resdata.msgdata });
                    console.log(this.state.Id2)
                    //this.setState.vkycreqno = resdata.msgdata.vkycreqno;
                    //this.state.vkycreqno = resdata.msgdata.vkycreqno;
                    // var x;
                    if (resdata.message != "VKYC session details") {
                        // this.interval = setInterval(() => this.getKYCStatus(), 10000);
                        // x=setInterval(() => { this.getKYCStatus() }, 10000);
                    }
                    else if (resdata.message == "VKYC session details") {
                        clearInterval(Interval);
                        clearInterval(this.interval);
                        this.setState({ resMsg: '' })
                        $("#exampleModalCentervk1").modal('hide');
                        // clearInterval(x);
                        // alert("Agent has joined, please proceed.");
                        confirmAlert({
                            message: "Agent has accepted the request, please proceed.",
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        sessionStorage.setItem("kycToken", resdata.msgdata.accessToken);
                                        sessionStorage.setItem("sessionId", resdata.msgdata.sessionId);
                                        sessionStorage.setItem("participantId", resdata.msgdata.participantId);
                                        console.log("executed This...")
                                        window.location = "/customerJoin";
                                    }
                                }
                            ],
                            closeOnClickOutside: false,
                        })

                    }
                    // alert(resdata.message + " " +"resdata.memmid")
                    console.log(resdata.message)
                } else {
                    //alert("Issue: " + resdata.message);

                }
            })
    }
    startCountdown = () => {
        this.setState({ countDownFlag: true }, () => {
            console.log('executed', this.state.countDownFlag)

            const totalTime = this.state.countdown;
            this.interval = setInterval(() => {
                this.setState((prevState) => {
                    if (prevState.countdown > 0) {
                        const newCountdown = prevState.countdown - 1;
                        return {
                            countdown: newCountdown,
                            percentage: (newCountdown / totalTime) * 100
                        };
                    } else {
                        clearInterval(this.interval);
                        return { countdown: 0, percentage: 0 };
                    }
                });
            }, 1000);
        })
    };

    formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    render() {
        const { t } = this.props
        const { showLoader } = this.state;
        const { countdown, percentage } = this.state;
        const timerStyle = {
            background: `conic-gradient(rgb(0, 121, 191) ${percentage}%, rgb(136, 189, 72) ${percentage}% 100%)`
        };
        return (
            <div className="row" style={{ marginTop: "80px" }}>
                {
                    showLoader && <Loader />
                }
                <Container fluid className="d-flex justify-content-center">
                    <Row>
                        <Col>
                            <Card className="" style={{ width: "400px", marginLeft: "8px", paddingBottom: "10px", cursor: "default", color: "rgba(5,54,82,1)" }}>
                                {this.state.resMsg ?
                                    <div >
                                        <p style={{ fontWeight: "bold", marginLeft: "20px" }}>{this.state.resMsg}</p>
                                    </div>
                                    :
                                    <div>
                                        <p style={{ fontWeight: "bold", marginLeft: "20px" }}><FaEdit />&nbsp;Enter OTP For Verification</p>
                                        <div className="row" style={{ padding: "0px 20px" }}>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <label
                                                    className="u8"
                                                    style={{
                                                        color: "#00264d",
                                                        fontFamily: "Poppins,sans-serif",
                                                        fontWeight: "500",
                                                        fontSize: "14px",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    Mobile OTP *
                                                </label>
                                                <div>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        onChange={this.mobileOtp}
                                                        style={{
                                                            borderRadius: "5px",
                                                            backgroundColor: "whitesmoke",
                                                            marginTop: "-10px",
                                                            border: "1px solid rgb(0, 121, 191)",
                                                            color: "#00264d",
                                                        }}
                                                        placeholder="Enter Mobile OTP"
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                        {this.state.emailRef &&
                                            <div className="row" style={{ padding: "0px 20px" }}>
                                                <div className="col-lg-12 col-md-6 col-sm-6">
                                                    <label
                                                        className="u7"
                                                        style={{
                                                            color: "#00264d",
                                                            fontFamily: "Poppins, sans-serif",
                                                            fontWeight: "600",
                                                            fontSize: "14px"
                                                        }}
                                                    >
                                                        Email OTP *
                                                    </label>
                                                    <div>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            onChange={this.emailOtp}
                                                            style={{
                                                                borderRadius: "5px",
                                                                backgroundColor: "whitesmoke",
                                                                marginTop: "-10px",
                                                                border: "1px solid rgb(0, 121, 191)",
                                                                color: "#00264d",
                                                            }}
                                                            placeholder="Enter Email OTP"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {/* <span id='showCountDown'>
                                            <p id="countdown" style={{ color: "grey", paddingLeft: "20px" }}></p>
                                            <p id='countdown2' onClick={this.generateMemberOtp} style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline", paddingLeft: "20px" }}></p>
                                        </span> */}
                                        <div className="row mt-2" style={{ padding: "0px 20px", textAlign: "end" }}>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <button className='btn btn-sm text-white'
                                                    style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                    onClick={this.setEntityMemberOtpVerification}>Submit</button>
                                                &nbsp;
                                                <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} onClick={this.refreshPage}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Card>
                        </Col>
                    </Row>
                </Container>


                {/* VKYC Alert */}
                <button type="button" id='VKYCAlertModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                    VKYC Alert
                </button>
                <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-body">
                                <div className='row'>
                                    <div className='col' style={{}}>
                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>
                                            {/* <img src={editRole} width="25px" /> */}
                                            <FaRegFileVideo />Instructions</p>
                                        <hr style={{ width: "50px", marginTop: "-10px" }} />
                                        <div className='row mb-2'>
                                            <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <p>Follow the instructions regarding camera, mic and location access as they appear on the next screen.</p>
                                                <p>1. Keep your PAN Card handy for the Video KYC session.</p>
                                                <p>2. Be in a well-lit surrounding.</p>
                                                <p>3. Ensure there is no background noise and disturbance.</p>
                                                <p>4. Verification session will be recorded</p>
                                            </div>
                                        </div>
                                        <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col' style={{ textAlign: "center" }}>
                                        <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getKYC}>Proceed</button>
                                        &nbsp;
                                        <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Dismiss</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* VKYC Alert2 */}
                <button type="button" id='VKYCAlert2Modal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCentervk1">
                    VKYC Alert2
                </button>
                <div class="modal fade" id="exampleModalCentervk1" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            {!this.state.countDownFlag ?
                                (<div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>
                                                {/* <img src={editRole} width="25px" /> */}
                                                <FaRegFileVideo />Instructions</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px", fontWeight: "600" }}>
                                                    <p>Video KYC request initiated with Request number : {this.state.Id}, Please wait for the Agent to accept the request. </p>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.startCountdown}>Proceed</button>
                                        </div>
                                    </div>
                                </div>)
                                :
                                (
                                    <div class="modal-body" style={{ textAlign: "-webkit-center" }}>
                                        <div className="countdown-timer" style={timerStyle}>
                                            <div className="countdown-timer-inner">
                                                <div className="countdown-timer-time">
                                                    {this.formatTime(countdown)}
                                                </div>
                                            </div>
                                        </div>
                                        <p style={{ color: "rgb(5, 54, 82)", fontSize: "15px" }}>Please wait while an agent accepts your request.</p>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default withTranslation()(MemberVerification)
