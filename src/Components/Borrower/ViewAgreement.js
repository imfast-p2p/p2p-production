import React, { Component } from 'react';
import './AgreementSign.css';
import { BASEURL } from '../assets/baseURL';
import BorrowerSidebar from '../../SidebarFiles/BorrowerSidebar';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import dashboardIcon from '../assets/icon_dashboard.png';
import { FaAngleLeft} from "react-icons/fa";

export class ViewAgreement extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            loanreqno: ""
            // signCode: "",
            // accountStatus: "",
            // isActive: false,
            // loanlistingno: ""
        }
        this.getAgreement = this.getAgreement.bind(this);
        // this.signAgreement = this.signAgreement.bind(this);
        // this.handleCheck = this.handleCheck.bind(this);
        // this.getLoanAccountStatus = this.getLoanAccountStatus.bind(this);
    }

    // handleCheck(event) {
    //     const isActive = event.target.checked;
    //     this.setState({ isActive: isActive });
    // }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.getAgreement();
            // this.getLoanAccountStatus();
            // this.signAgreement();
            console.log(sessionStorage.getItem('loanrequestnumber'));
            console.log(sessionStorage.getItem('loanlistingnumber'));
        } else {
            window.location = '/login'
        }
    }

    getAgreement(event) {
        fetch(BASEURL + '/lms/borr/getloanagreement?loanreqno=' + sessionStorage.getItem('loanrequestnumber')+ "&action=view", {
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
                document.getElementsByClassName('PDFdoc')[0].src = fileURL + "#zoom=50";
            })
            .catch((error) => {
                console.log(error)
            })
    }

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
    //         return Response.json();
    //     })
    //         .then((resdata) => {

    //             console.log(resdata);
    //             alert(resdata.message);
    //             this.setState({ signCode: resdata.message });
    //             // this.setState({ signMessage: resdata.message });

    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }

    // getLoanAccountStatus(event) {

    //     fetch(BASEURL + '/lsp/getloanaccountstatus', {
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
    //             if (resdata.status == 'SUCCESS') {
    //                 console.log(resdata);
    //                 this.setState({ accountStatus: resdata.msgdata });
    //                 // this.state.accountStatus.loanstatusid = "";
    //                 console.log(resdata.msgdata.loanstatusid)
    //                 console.log(resdata.msgdata.loandocumentationstatus)
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }

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
    //                 alert("Loan disbursement request raised successfully");
    //             } else {
    //                 alert("Issue: " + resdata.message);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px" }}>
                <BorrowerSidebar />
                <div className="main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/borrowerdashboard">Home</Link> / <Link to="/ViewAllLoans">View Loan Requests</Link> / View Agreement</p>
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
                    <iframe src="" className="PDFdoc" type="application/pdf" style={{ overflow: "auto", height: "100vh", width: "100%" }}>
                    </iframe>

                </div>
            </div>
        )
    }
}

export default ViewAgreement
