import React, { Component } from 'react';
import './AgreementSign.css';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import BorrowerSidebar from '../../SidebarFiles/BorrowerSidebar';
import $ from 'jquery';
import { FaAngleLeft, FaFolderPlus,FaDownload } from "react-icons/fa";
import dashboardIcon from '../assets/icon_dashboard.png';
import { withTranslation } from 'react-i18next';

export class viewSanctLetter extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            loanreqno: "",
            signCode: "",
            accountStatus: "",
            isActive: false,
            loanlistingno: "",

            docuResponse: "",
        }
        //this.rejectAgreement=this.rejectAgreement.bind(this);
    }

    handleCheck(event) {
        const isActive = event.target.checked;
        this.setState({ isActive: isActive });
    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.getSancLetter();
            console.log(sessionStorage.getItem('loanrequestnumber'));
            console.log(sessionStorage.getItem('loanlistingnumber'));
        } else {
            window.location = '/login'
        }
    }

    getSancLetter = (event) => {
        fetch(BASEURL + '/lms/viewloansanctionletter?loanreqno=' + sessionStorage.getItem('loanrequestnumber'), {
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
                this.setState({ docuResponse: response });
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
    setDocumentToDownload = () => {
        const url = window.URL.createObjectURL(this.state.docuResponse);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = "SanctionLetter.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
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
                <BorrowerSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/borrowerdashboard">Home</Link> / <Link to="/viewAllLoanRequests">View Loan Requests</Link> / Sanction Letter</p>
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
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold" }}>{t('Sanction Letter')}</p>
                        </div>
                    </div>
                    <div className='row' style={{ width: "96%", marginLeft: "20px", marginTop: "-16px" }}>
                        <div className='col'>
                            <div className='card' >
                                <iframe src="" className="PDFdoc" type="application/pdf" style={{ overflow: "auto", height: "100vh", width: "100%" }}>
                                </iframe>

                                <div className='row mb-2 mt-2 mr-1'>
                                    <div className='col' style={{textAlign:"end"}}>
                                        <button type="button" class="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setDocumentToDownload}><FaDownload/>&nbsp;Download</button>
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

export default withTranslation()(viewSanctLetter)
