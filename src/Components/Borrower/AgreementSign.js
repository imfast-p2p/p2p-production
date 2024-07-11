import React, { Component } from 'react';
import './AgreementSign.css';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import BorrowerSidebar from '../../SidebarFiles/BorrowerSidebar';
import $ from 'jquery';
import { FaAngleLeft, FaFolderPlus } from "react-icons/fa";
import dashboardIcon from '../assets/icon_dashboard.png';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from "react-confirm-alert";

var metaData = ""
export class AgreementSign extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            loanreqno: "",
            signCode: "",
            accountStatus: "",
            isActive: false,
            loanlistingno: "",
            metaData: ""
        }
        this.getAgreement = this.getAgreement.bind(this);
        this.signAgreement = this.signAgreement.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.getLoanAccountStatus = this.getLoanAccountStatus.bind(this);
        //this.rejectAgreement=this.rejectAgreement.bind(this);
    }

    handleCheck(event) {
        const isActive = event.target.checked;
        this.setState({ isActive: isActive });
    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.getAgreement();
            this.getLoanAccountStatus();
            // this.signAgreement();
            console.log(sessionStorage.getItem('loanrequestnumber'));
            console.log(sessionStorage.getItem('loanlistingnumber'));
        } else {
            window.location = '/login'
        }
    }
    getAgreement(event) {
        fetch(BASEURL + '/lms/borr/getloanagreement?loanreqno=' + sessionStorage.getItem('loanrequestnumber') + "&action=generate", {
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
                document.getElementsByClassName('PDFdoc')[0].src = fileURL + "#zoom=80";
            })
            .catch((error) => {
                console.log(error)
            })
    }

    signAgreement(event) {
        this.setState({ showLoader: true })
        fetch(BASEURL + '/lms/borr/signloanagreement', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: sessionStorage.getItem('loanrequestnumber')
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS' || resdata.status == 'Success' || resdata.status == 'success') {
                    console.log(resdata);
                    //alert(resdata.message);

                    if (resdata.msgdata && resdata.msgdata['META_DATA']) {
                        metaData = resdata.msgdata['META_DATA'];
                        console.log(metaData);
                        // this.submitForm()
                        // var ddeData=JSON.stringify({
                        //     ddeResp:metaData
                        // })
                        sessionStorage.setItem("dde_data", metaData);
                        this.setState({ showLoader: false })
                        window.location = "/ddeSign";
                    } else {
                        this.setState({
                            signCode: resdata.message,
                            showLoader: false
                        });
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        window.location = "/viewAllLoanRequests"
                                    },
                                },
                            ],
                        });
                    }
                } else {
                    this.setState({ showLoader: false })
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
    submitForm = () => {
        // Create a hidden form dynamically
        const form = $('<form>')
            .attr('action', 'https://ilpuat.finfotech.co.in/lms/borr/signloanagreement/inapp')
            .attr('method', 'post');

        // Add input field to the form
        $('<input>')
            .attr('type', 'text')
            .attr('id', 'META_DATA')
            .attr('name', 'META_DATA')
            .val(metaData) // Assuming metaData is a prop passed to the component
            .appendTo(form);

        // form.appendTo('body').submit();

        const iframe = $('<iframe>')
            .css('display', 'none'); // Hide the iframe

        form.appendTo(iframe);
        iframe.appendTo('body');
        form.submit();
    };
    // signAgreement(event) {
    //     fetch(BASEURL + '/lms/borr/signloanagreement', {
    //         method: 'post',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': "Bearer " + sessionStorage.getItem('token')
    //         },
    //         body: JSON.stringify({
    //             loanreqno: sessionStorage.getItem('loanrequestnumber')
    //         })
    //     }).then((Response) => {
    //         const contentType = Response.headers.get('content-type');
    //         if (contentType && contentType.includes('application/json')) {
    //             return Response.json();
    //         } else {
    //             return Response.text();
    //         }
    //     })
    //         .then((resdata) => {
    //             this.setState({ setHtmlResponse: resdata });

    //             document.forms[0].submit();
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }
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
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata);
                    this.setState({ accountStatus: resdata.msgdata });
                    // this.state.accountStatus.loanstatusid = "";
                    console.log(resdata.msgdata.loanstatusid)
                    console.log(resdata.msgdata.loandocumentationstatus)
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
                                    },
                                },
                            ],
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    resendEsignLink = () => {
        this.setState({ showLoader: true })
        fetch(BASEURL + '/lms/resendsigninglink', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanaccountno: sessionStorage.getItem('loanlistingnumber')
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata);
                    //alert(resdata.message);
                    this.setState({
                        txnID: resdata.msgdata.transid,
                        showLoader: false
                    });
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location = "/viewAllLoanRequests"
                                },
                            },
                        ],
                    });

                } else {
                    this.setState({ showLoader: false })
                }

            })
            .catch((error) => {
                console.log(error)
            })
    }
    // initialDisbursement(event) {

    //     fetch(BASEURL + '/lsp/initiateloandisbursement', {
    //         method: 'post',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': "Bearer " + sessionStorage.getItem('token')
    //         },
    //         body: JSON.stringify({
    //             loanlistingno: sessionStorage.getItem('loanlistingnumber')
    //         })
    //     }).then((Response) => {
    //         return Response.json();
    //     })
    //         .then((resdata) => {
    //             if (resdata.status == 'Success') {
    //                 console.log(resdata);
    //                 alert("Loan disbursement initiated. Please check your account after sometime");
    //                 window.location="/viewAllLoanRequests"
    //             } else {
    //                 alert("Issue: " + resdata.message);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }
    // rejectAgreement(){

    //     if(window.confirm("Are you Sure to Reject Loan Agreement?")){
    //         window.confirm('Rejected successfully Redirecting to All loanRequests')
    //         window.location='/viewAllLoanRequests'
    //     }else{
    //         window.confirm("Canceled successfully")
    //         window.location.reload()
    //     }
    // }

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
        // const { setHtmlResponse } = this.state
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#f4f7fc" }}>
                <BorrowerSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/borrowerdashboard">Home</Link> / <Link to="/viewAllLoanRequests">View Loan Requests</Link> / Agreement Sign</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="">
                            <button style={myStyle}>
                                <Link to="/viewAllLoanRequests" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
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
                                                    // <input type="button" className="btn btn-success m-5" value="Disburse Money" onClick={this.initialDisbursement} style={{ borderRadius: "50px" }} />
                                                    :
                                                    <div>
                                                        {this.state.accountStatus.loanstatusid == 0 && this.state.accountStatus.loandocumentationstatus == 2 ?
                                                            <button className="btn btn-sm text-white" style={{ backgroundColor: "#007bff" }} onClick={this.resendEsignLink}>Re-send Signing Link</button> :
                                                            <div>
                                                                <div className="form-check">
                                                                    <input type="checkbox" className="form-check-input" onChange={this.handleCheck} id="exampleCheck1" />
                                                                    <label className="form-check-label h6" for="exampleCheck1">I agree with the terms and conditions of the loan</label>
                                                                </div>
                                                                <input type="button" className="btn text-white m-5 " disabled={!this.state.isActive} value="Accept" onClick={this.signAgreement} style={{ backgroundColor: "rgb(136, 189, 72)" }} />

                                                                {/* <button className="btn btn-danger m-1" value="Reject" disabled={!this.state.isActive} style={{ borderRadius: "50px" }} onClick={this.rejectAgreement}>
                                            Reject
                                        </button> */}
                                                            </div>}
                                                        {/* <input type="button" className="btn btn-danger m-1" value="Reject" disabled={this.state.isActive} style={{ borderRadius: "50px" }} /> */}
                                                    </div>
                                                }

                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <iframe src="" className="PDFdoc2" type="application/pdf" style={{ overflow: "auto", height: "100vh", width: "100%" }}>
                        <div dangerouslySetInnerHTML={{ __html: setHtmlResponse }} />
                    </iframe> */}
                    {/* <div className="row">
                        <div className="col"></div>
                        <div className="col"> */}

                    {/* {this.state.signMessage.loanstatusid == "0" && this.state.signMessage.loandocumentationstatus == "1" ? */}

                    {/* </div>
                        <div className="col"></div>
                    </div> */}

                    {/* <div dangerouslySetInnerHTML={{ __html: decryptedData }} /> */}
                </div>
            </div>
        )
    }
}

export default withTranslation()(AgreementSign)
