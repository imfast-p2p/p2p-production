import React, { Component } from 'react';
import '../../Borrower/AgreementSign.css';
import { Link } from 'react-router-dom';
import { BASEURL } from '../../assets/baseURL';
import FacilitatorSidebar from '../../../SidebarFiles/FacilitatorSidebar';
import $ from 'jquery';
import { FaAngleLeft, FaFolderPlus } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { withTranslation } from 'react-i18next';
import batch from '../../assets/batch.png';

export class AssistSignAgreement extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            loanreqno: "",
            signCode: "",
            accountStatus: "",
            isActive: false,
            loanlistingno: "",
            mobileOtp: "",
            emailOtp: "",
            txnID: ""
        }
        this.getAgreement = this.getAgreement.bind(this);
        this.signAgreement = this.signAgreement.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.getLoanAccountStatus = this.getLoanAccountStatus.bind(this);
    }

    handleCheck(event) {
        const isActive = event.target.checked;
        this.setState({ isActive: isActive });
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.getAgreement();
            this.getLoanAccountStatus();
            console.log(sessionStorage.getItem('loanrequestnumber'));
            console.log(sessionStorage.getItem('loanlistingnumber'));
        } else {
            window.location = '/login'
        }
    }
    getAgreement(event) {
        fetch(BASEURL + '/lms/borr/getloanagreement?loanreqno=' + sessionStorage.getItem('loanrequestnumber')+ "&action=generate", {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
            },
            responseType: 'arraybuffer',
            dataType: 'blob'
        })
            .then(response => {
                return response.blob();
            })
            .then((response) => {
                console.log('Response:', response)
                var file = new Blob([(response)], { type: 'application/pdf' });
                console.log(file);
                var fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                document.getElementsByClassName('PDFdoc')[0].src = fileURL + "#zoom=100";
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getLoanAccountStatus(event) {
        fetch(BASEURL + '/lsp/getloanaccountstatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanlistingno: sessionStorage.getItem('loanlistingnumber')
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ accountStatus: resdata.msgdata });
                    // this.state.accountStatus.loanstatusid = "";
                    console.log(resdata.msgdata.loanstatusid)
                    console.log(resdata.msgdata.loandocumentationstatus)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    postSignAgreement = () => {
        fetch(BASEURL + '/lsp/assistedoperationsgenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                borrowerid: sessionStorage.getItem("assistBorrowerID"),
                operationtype: "8",
                loanrequestnumber: sessionStorage.getItem('loanrequestnumber'),
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    alert(resdata.message)
                    $("#signAgreeModal").click()
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
                    this.setState({ otpRef: resdata.msgdata.otpref })
                } else {
                    alert(resdata.message)
                }
            }).catch((error) => {
                console.log(error)
            })
    }
    regenerateOtp = () => {
        fetch(BASEURL + '/usrmgmt/regenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                operationtype: 8,
                mobileref: String(this.state.otpRef),
                emailref: String(this.state.otpRef),
                otpmode: "1"
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    // alert(resdata.message);
                    this.setState({ otpRef: resdata.msgdata.mobileref })

                    alert(resdata.message)

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
                    alert(resdata.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    mobileOtp = (e) => {
        this.setState({ mobileOtp: e.target.value })
    }
    emailOtp = (e) => {
        this.setState({ emailOtp: e.target.value })
    }
    signAgreement = () => {
        fetch(BASEURL + '/lms/borr/signloanagreement', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: sessionStorage.getItem('loanrequestnumber'),
                mobileotp: this.state.mobileOtp,
                otpref: String(this.state.otpRef),
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        }).then((resdata) => {
            console.log(resdata);
            if (resdata.status == 'SUCCESS') {
                console.log(resdata);
                alert(resdata.message)
                window.location.reload();
            } else {
                alert(resdata.message)
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    resendEsignLink = () => {
        fetch(BASEURL + '/lms/resendsigninglink', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanaccountno: sessionStorage.getItem('loanrequestnumber')
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                alert(resdata.message);
                this.setState({ txnID: resdata.msgdata.transid });
            })
            .catch((error) => {
                console.log(error)
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#f4f7fc" }}>
                <FacilitatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/facilitatorDashboard">Home</Link> / <Link to="/customer">Customer Support</Link> / Agreement Sign</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="">
                            <button style={myStyle}>
                                <Link to="/customer" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold" }}>{t('Agreement Sign')}</p>
                        </div>
                    </div>
                    <div className='row' style={{ width: "96%", marginLeft: "20px", marginTop: "-16px" }}>
                        <div className='col'>
                            <div className='card' >
                                <iframe src="" className="PDFdoc" type="application/pdf" style={{ overflow: "auto", height: "100vh", width: "100%" }}>
                                </iframe>
                                <div className='row pl-2'>
                                    <div className='col mb-2 mt-2'>
                                        {this.state.accountStatus.loanstatusid == 0 && this.state.accountStatus.loandocumentationstatus == 1 ?
                                            <div></div> : <div>
                                                {this.state.accountStatus.loanstatusid == 0 && this.state.accountStatus.loandocumentationstatus == 1 ?
                                                    <div></div>
                                                    :
                                                    <div>
                                                        {this.state.accountStatus.loanstatusid == 0 && this.state.accountStatus.loandocumentationstatus == 2 ?
                                                            <button className="btn btn-sm text-white" style={{ backgroundColor: "#007bff" }} onClick={this.resendEsignLink}>Re-send Signing Link</button> :
                                                            <div>
                                                                <div className="form-check">
                                                                    <input type="checkbox" className="form-check-input" onChange={this.handleCheck} id="exampleCheck1" />
                                                                    <label className="form-check-label h6" for="exampleCheck1">I agree with the terms and conditions of the loan</label>
                                                                </div>
                                                                <button type="button" className="btn btn-sm text-white" disabled={!this.state.isActive}
                                                                    data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.postSignAgreement} >Accept</button>
                                                                &nbsp;
                                                                <button type="button" className="btn btn-sm text-white" disabled={!this.state.isActive}
                                                                    data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                            </div>}
                                                    </div>
                                                }

                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Sign Agreement Modal */}
                    <button id='signAgreeModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                    </button>
                    <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" id='theModalContent' style={{ marginLeft: "" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Enter OTP</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                {/* <div style={{ display: "" }} className="col-6">
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Email OTP</p>
                                                    <input className='form-control' type='number' placeholder='Enter OTP' onChange={this.emailOtp}
                                                        autoComplete='off' style={{ marginTop: "-10px" }} />
                                                </div> */}

                                                <div style={{ display: "" }} className="col">
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile OTP</p>
                                                    <input className='form-control' type='number' placeholder='Enter OTP' onChange={this.mobileOtp}
                                                        onInput={(e) => {
                                                            e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                        }}
                                                        autoComplete='off' style={{ marginTop: "-10px" }} />
                                                </div>
                                            </div>
                                            <div className='row mt-2'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <p id="countdown" style={{ color: "grey" }}></p>
                                                    <p id='countdown2' onClick={this.regenerateOtp} style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}></p>
                                                </div>
                                            </div>

                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.signAgreement}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
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

export default withTranslation()(AssistSignAgreement)
