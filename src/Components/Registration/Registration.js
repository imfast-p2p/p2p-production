import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";
import { withTranslation } from 'react-i18next';
import $ from 'jquery'
import regImg from '../assets/Registration.png';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FaAngleLeft } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import Tooltip from "@material-ui/core/Tooltip";

export class Registration extends Component {

    userRegType = (event) => {
        if (event.target.value == "DIGI") {
            $("#digiAlertModal").click()
            // confirmAlert({
            //     message: "Make sure that Aadhar and PAN are linked to your Digilocker account.",
            //     buttons: [
            //         {
            //             label: "Agree",
            //             onClick: () => {
            //                 window.location = "/loginViaDigilocker"
            //             }
            //         },
            //         {
            //             label: "Cancel",
            //             onClick: () => {
            //                 window.location = "/login"
            //             }
            //         }
            //     ]
            // })
        } else if (event.target.value == "OFKYC") {
            $("#AxmlAlertModal").click();
        } else if (event.target.value == "AAQR") {
            $("#AqrAlertModal").click()
        }
    }

    routeDigilockerPage = (e) => {
        window.location = "/loginViaDigilocker"
    }
    routeAXmlPage = () => {
        window.location = "/offlineKyc";
    }
    routeAQrPage = () => {
        window.location = "/aadharQr";
    }
    RegnowAlert = () => {
        $("#RegnowAlertModal").click()
    }
    routeRnowPage = () => {
        window.location = "/manualRegistration";
    }
    routeToRegistration = () => {
        $("#registrationPage").click()
    }
    render() {//updated
        const { t } = this.props;
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
        var digiInfo = "Securely access and share your Aadhaar details instantly via Digilocker.";
        var adharXmlInfo = "Upload an offline Aadhaar XML file for secure, offline identity verification.";
        var aadharQrInfo = "Scan the Aadhaar QR code for quick and secure identity verification.";
        var regNowVLater = "Register now and complete the KYC verification at your convenience.";
        return (
            <Container fluid className="d-flex justify-content-center">
                <Row>
                    <Col>
                        <Card className="" style={{ marginLeft: "8px", paddingBottom: "10px", cursor: "default" }}>
                            <div style={{ textAlign: "initial", marginLeft: "5px" }}>
                                <button style={myStyle} onClick={this.routeToRegistration}>
                                    <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                </button>
                            </div>
                            <div className='mb-3' style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: "-10px",
                                paddingLeft: "20px",
                                paddingRight: "20px",
                            }}>
                                <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                <div>
                                    <h4 className="heading1" style={{ color: "#00264d", fontSize: "18px" }}>
                                        Choose Registration Option
                                    </h4>
                                </div>
                                <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                            </div>

                            <div className='row mb-4' onClick={this.userRegType} style={{ color: "#00264d", fontWeight: "bold", padding: "0px 20px", fontSize: "15px" }}>
                                <div className="col">
                                    <div className="form-check">
                                        <p className="form-check-label mr-4" style={{ width: '111%' }}>
                                            <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="DIGI" />{t("With Digilocker")}
                                            &nbsp;<Tooltip title={digiInfo} arrow>
                                                <span><BsInfoCircle /></span>
                                            </Tooltip>
                                        </p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-check" title='Service unavailable'>
                                        <p className="form-check-label mr-4" style={{ width: '111%' }}>
                                            <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="OFKYC" disabled />
                                            <span style={{ color: 'gray' }}>
                                                {t("With Offline Aadhaar")}
                                            </span>&nbsp;
                                            <Tooltip title={adharXmlInfo} arrow>
                                                <span><BsInfoCircle /></span>
                                            </Tooltip>
                                        </p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-check">
                                        <p className="form-check-label mr-1" style={{ width: '111%' }}>
                                            <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="AAQR" />{t("With Aadhaar QR")}
                                            &nbsp;<Tooltip title={aadharQrInfo} arrow>
                                                <span><BsInfoCircle /></span>
                                            </Tooltip>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='row mb-2'>
                                <div className='col' style={{ textAlign: "center" }}>
                                    <div className="form-check">
                                        <img src={regImg} width="15%" height="30%" />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2" style={{ color: "#00264d", fontWeight: "bold", padding: "0px 20px", fontSize: "15px" }}>
                                <div className="form-check">
                                    <div className="form-check">
                                        <p className="form-check-label mr-4">
                                            <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" onClick={this.RegnowAlert} />
                                            {t("Register Now, Verify Later")} &nbsp;
                                            <Tooltip title={regNowVLater} arrow>
                                                <span><BsInfoCircle /></span>
                                            </Tooltip>
                                        </p>
                                    </div>
                                    {/* <p><Link to="/manualRegistration">Register Now, Verify Later</Link></p> */}
                                </div>
                            </div>
                        </Card>
                        <div style={{ paddingLeft: "18%", paddingRight: "18%", paddingTop: "5%" }}>
                            {/* <div className="container">
                                <div className="row d-flex justify-content-center" >
                                    <div className="col-md-12 ">
                                        <div className="card" style={{ width: "100%", cursor: "default", boxShadow: "5px 10px 18px #888888" }}>
                                            <div className="credentials" style={{ padding: "10px 50px" }}>
                                                <div className='mb-3' style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingTop: "15px", }}>
                                                    <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                                    <div>
                                                        <h4 className="heading1" style={{ color: "#00264d" }}>
                                                            Choose Registration Option
                                                        </h4>
                                                    </div>
                                                    <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                                </div>

                                                <div className='row mb-4' onClick={this.userRegType} style={{ color: "#00264d", fontWeight: "bold" }}>
                                                    <div className="col">
                                                        <div className="form-check">
                                                            <p className="form-check-label mr-4" style={{ width: '111%' }}>
                                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="DIGI" />{t("With Digilocker")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-check" title='Service unavailable'>
                                                            <p className="form-check-label mr-4" style={{ width: '111%' }}>
                                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="OFKYC" disabled />
                                                                <span style={{ color: 'gray' }}>
                                                                    {t("With Offline Aadhaar")}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-check">
                                                            <p className="form-check-label mr-1" style={{ width: '111%' }}>
                                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="AAQR" />{t("With Aadhaar QR")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row mb-2'>
                                                    <div className='col' style={{ textAlign: "center" }}>
                                                        <div className="form-check">
                                                            <img src={regImg} width="30%" height="30%" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mb-2" style={{ color: "#00264d", fontWeight: "bold" }}>
                                                    <div className="form-check">
                                                        <div className="form-check">
                                                            <p className="form-check-label mr-4">
                                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" onClick={this.RegnowAlert} />
                                                                {t("Register Now, Verify Later")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            {/*  Modal */}
                            <button id='digiAlertModal' type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-sm" style={{ display: "none" }}>Small modal</button>
                            <div class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-sm">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                Make sure that Aadhaar and PAN are linked to your Digilocker account.
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.routeDigilockerPage}>Okay</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "#0079bf" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <button id='digiAlertModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                            </button>
                            <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                Make sure that Aadhaar and PAN are linked to your Digilocker account.
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.routeDigilockerPage}>Okay</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "#0079bf" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* Adhar XML Modal */}
                            <button id='AxmlAlertModal' type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-sm2" style={{ display: "none" }}>Small modal</button>
                            <div class="modal fade bd-example-modal-sm2" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-sm">
                                    <div className="modal-content" >
                                        <div className="modal-body">
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                Make sure that Aadhaar Xml file is downloaded.
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.routeAXmlPage}>Okay</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "#0079bf" }}>Cancel</button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <button id='AxmlAlertModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2">
                            </button>
                            <div className="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content" >
                                        <div className="modal-body">
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                Make sure that Aadhaar Xml file is downloaded.
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.routeAXmlPage}>Okay</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "#0079bf" }}>Cancel</button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            {/* Adhar QR Modal */}
                            <button id='AqrAlertModal' type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-sm3" style={{ display: "none" }}>Small modal</button>
                            <div class="modal fade bd-example-modal-sm3" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-sm">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                Make sure that Aadhaar QR image is downloaded.
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.routeAQrPage}>Okay</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "#0079bf" }}>Cancel</button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <button id='AqrAlertModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3">
                            </button>
                            <div className="modal fade" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                Make sure that Aadhaar QR image is downloaded.
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.routeAQrPage}>Okay</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "#0079bf" }}>Cancel</button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* RegisterNowVlater Modal */}
                            <button id='RegnowAlertModal' type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-sm4" style={{ display: "none" }}>Small modal</button>
                            <div class="modal fade bd-example-modal-sm4" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-sm">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                After Register Now Verify Later process,complete the KYC Verification with the registered username and password.
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.routeRnowPage}>Okay</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "#0079bf" }}>Cancel</button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <button id='RegnowAlertModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter4">
                            </button>
                            <div className="modal fade" id="exampleModalCenter4" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                After Register Now Verify Later process,complete the KYC Verification with the registered username and password.
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.routeRnowPage}>Okay</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "#0079bf" }}>Cancel</button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div className="card p-5" style={{ marginTop: '7%', cursor: "default" }} id="reg">
                    <h5 className='text-light' style={{ textAlign: "center" }}>Choose Registration Option</h5>
                    <hr />
                    <button className="btn btn-lg btn-success mb-2 Edit" id='btnEdit1' onClick={this.manualRegistration}><span className='spanReg'>Register Now, Verify Later</span></button>
                    <button className="btn btn-lg btn-success mb-2 Edit" id='btnEdit2' onClick={this.registerWDigilocker}><span className='spanReg'>Register With Digilocker</span></button>
                    <button className="btn btn-lg btn-success mb-2 Edit" id='btnEdit3' onClick={this.registerOfflineKyc}><span className='spanReg'>Register With Offline KYC</span></button>
                    <button className="btn btn-lg btn-success Edit" id='btnEdit4' onClick={this.registerAadharQR}><span className='spanReg'>Register With Aadhar QR</span></button>
                </div> */}

                            {/* Route to Registration */}
                            <Link to="/selectRegistration"><button id='registrationPage' style={{ display: "none" }}>Registration
                            </button></Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default withTranslation()(Registration);