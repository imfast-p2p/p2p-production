import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
//import SimpleReactValidator from 'simple-react-validator';
import AdminSidebar from './AdminSidebar';
import SystemUserSidebar from '../SystemUser/SystemUserSidebar';
import $ from 'jquery';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaAngleLeft, FaFileUpload, FaDownload } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from "react-confirm-alert";

//updated

const dt = new DataTransfer();

const lenBorcsv = process.env.PUBLIC_URL + "/BulkRegistration.csv";
const facevlcsv = process.env.PUBLIC_URL + "/FacBulkRegistration.csv";

// var pmType = "";
export class BulkUploadUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            documentNumber: "",
            totalcount: "",
            successcount: "",
            failurecount: "",
            batchno: "",
            bulkRegList: [],

            pmType: "",
            isKYCRequired: "0"
        }
        this.uploadFile = this.uploadFile.bind(this);

    }
    componentDidMount = () => {
        // $('#uploadBulk').prop('disabled', true)
        $("#attachment").on('change', function (e) {
            for (var i = 0; i < this.files.length; i++) {
                let fileBloc = $('<span/>', { class: 'file-block' }),
                    fileName = $('<span/>', { class: 'name', text: this.files.item(i).name });
                fileBloc.append('<span class="file-delete"><span>+</span></span>')
                    .append(fileName);
                $("#filesList > #files-names").append(fileBloc);
            };

            for (let file of this.files) {
                dt.items.add(file);
            }
            this.files = dt.files;

            $('span.file-delete').click(function () {
                let name = $(this).next('span.name').text();
                $(this).parent().remove();
                for (let i = 0; i < dt.items.length; i++) {
                    if (name === dt.items[i].getAsFile().name) {
                        dt.items.remove(i);
                        $('#uploadBulk').hide()
                        continue;
                    }
                }
                document.getElementById('attachment').files = dt.files;
            });
        });

        if (sessionStorage.getItem('userType') === "0") {
            if (sessionStorage.getItem('sAdmin') === "1" && sessionStorage.getItem('pmDefault') === "1") {
                //Super Admin
                // pmType = "superAdmin";
                this.setState({ pmType: "superAdmin" })
            } else if (sessionStorage.getItem('pmDefault') === "0") {
                // pmType = "pmAdmin"
                this.setState({ pmType: "pmAdmin" })
            } else {
                // pmType = "0";
                this.setState({ pmType: "0" })
            }
        } else if (sessionStorage.getItem('userType') === "1") {
            if (sessionStorage.getItem('pmDefault') === "0") {
                this.setState({ pmType: "pmSystemUser" }); // Update state using setState
            } else {
                this.setState({ pmType: "platformSysUser" }); // Update state using setState
            }
        }
    }
    isVKYCRequired = (event) => {
        if (event.target.checked === true) {
            this.setState({ isKYCRequired: "1" })
        } else {
            this.setState({ isKYCRequired: "0" })
        }
    }
    uploadFile(event) {
        const formData = new FormData()
        var fileField = document.querySelector("input[type='file']");
        var body = JSON.stringify({
            "iskycrequired": this.state.isKYCRequired
        })

        formData.append("file", fileField.files[0]);
        formData.append("inputDetails", body);
        fetch(BASEURL + '/usrmgmt/bulkregistration', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: formData
        })
            .then(response => response.json())
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    this.setState({ totalcount: resdata.msgdata.totalcount });
                    this.setState({ successcount: resdata.msgdata.successcount });
                    this.setState({ failurecount: resdata.msgdata.failurecount });
                    this.setState({ batchno: resdata.msgdata.batchno });

                    alert('Request raised successfully')
                    $('#Launch').click();
                    // window.location='/landing'
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
                                        // window.location.reload();
                                    },
                                },
                            ],
                        });
                    }
                }

            })
            .catch(error => console.log(error)
            );
    }
    downloadCsv = () => {
        fetch(BASEURL + "/usrmgmt/bulkregistrationstatuscheck?batchno=" + this.state.batchno, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
                'Content-Type': 'application/pdf',
            },
            responseType: 'arraybuffer',
            dataType: 'blob'
        })
            .then(response => {
                return response.blob();
            })
            .then((response) => {
                console.log('Response:', response)
                var file = new Blob([(response)], { type: 'application/csv' });
                console.log(file);
                var fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                document.getElementsByClassName('PDFdoc')[0].src = fileURL + "#zoom=50";
            })
            .catch((error) => {
                console.log(error)
            })
    }
    checkNoofFiles = () => {
        var fileField = document.querySelector("input[id='attachment']").files.length;
        console.log(fileField);
        $('#uploadBulk').show()
        if (fileField > 1) {
            alert("Maximum 1 File Allowed");
            window.location.reload();
        }
    }
    lBtemplatecsv = (url) => {
        const fileName = url.split("/").pop();
        const aTag = document.createElement("a");
        aTag.href = url;
        aTag.setAttribute("download", fileName);
        document.body.appendChild(aTag);
        aTag.click();
        aTag.remove();
    }
    faEvltemplatecsv = (url) => {
        const fileName = url.split("/").pop();
        const aTag = document.createElement("a");
        aTag.href = url;
        aTag.setAttribute("download", fileName);
        document.body.appendChild(aTag);
        aTag.click();
        aTag.remove();
    }
    handleChange() {
        $('.text').toggle();
        $("#Pinfo").toggle();
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
        const { pmType } = this.state;
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                {sessionStorage.getItem('userType') === "0" ?
                    <AdminSidebar />
                    :
                    sessionStorage.getItem('userType') === "1" ?
                        <SystemUserSidebar /> : ""
                }
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                {pmType === "pmSystemUser" ?
                                    <Link to="/sysUserDashboard">Home</Link> :
                                    pmType === "pmAdmin" ?
                                        <Link to="/landing">Home</Link> :
                                        pmType === "0" ?
                                            <Link to="/landing">Home</Link> :
                                            <Link to="/landing">Home</Link>
                                }
                                / Bulk Registration</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col">
                            {pmType === "pmSystemUser" ?
                                <button style={myStyle}>
                                    <Link to="/sysUserDashboard">
                                        <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                        <span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                    </Link>
                                </button> :
                                pmType === "pmAdmin" ?
                                    <button style={myStyle}>
                                        <Link to="/landing">
                                            <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                            <span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                        </Link>
                                    </button> :
                                    pmType === "0" ?
                                        <button style={myStyle}>
                                            <Link to="/landing">
                                                <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                                <span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                            </Link>
                                        </button> :
                                        <button style={myStyle}>
                                            <Link to="/landing">
                                                <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                                <span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                            </Link>
                                        </button>
                            }

                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />

                    <div className='row'>
                        <div className='col-11' style={{ marginLeft: "50px" }}>
                            <div className='row'>
                                {pmType === "pmAdmin" ?
                                    <div className='col-5' style={{ color: "#222c70", fontSize: "14px", fontWeight: "500" }}>
                                        <p>Guidelines:</p>
                                        <p>1.For Facilitator registration, please use this &nbsp;
                                            <span className='templateLink' onClick={() => this.faEvltemplatecsv(facevlcsv)} style={{ cursor: "pointer" }}>template.<FaDownload />
                                            </span>
                                        </p>
                                        <p>{t('2.The template file can be modified in any commonly used spreadsheet program (e.g., Excel).')}</p>
                                        <p>{t('3.The edited file must be saved in a comma separated (CSV) format before it is uploaded.')}</p>

                                    </div> :
                                    pmType === "0" ?
                                        <div className='col-5' style={{ color: "#222c70", fontSize: "14px", fontWeight: "500" }}>
                                            <p>Guidelines:</p>
                                            <p>1.For Lender and Borrower registration, please use this &nbsp;
                                                <span className='templateLink' onClick={() => this.lBtemplatecsv(lenBorcsv)} style={{ cursor: "pointer" }}>template.<FaDownload />
                                                </span>
                                            </p>
                                            <p>2.For Facilitator registration, please use this &nbsp;
                                                <span className='templateLink' onClick={() => this.faEvltemplatecsv(facevlcsv)} style={{ cursor: "pointer" }}>template.<FaDownload />
                                                </span>
                                            </p>
                                            <p>{t('3.The template file can be modified in any commonly used spreadsheet program (e.g., Excel).')}</p>
                                            <p>{t('4.The edited file must be saved in a comma separated (CSV) format before it is uploaded.')}</p>
                                        </div> :
                                        pmType === "pmSystemUser" ?
                                            <div className='col-5' style={{ color: "#222c70", fontSize: "14px", fontWeight: "500" }}>
                                                <p>Guidelines:</p>
                                                <p>1.For Facilitator registration, please use this &nbsp;
                                                    <span className='templateLink' onClick={() => this.faEvltemplatecsv(facevlcsv)} style={{ cursor: "pointer" }}>template.<FaDownload />
                                                    </span>
                                                </p>
                                                <p>{t('2.The template file can be modified in any commonly used spreadsheet program (e.g., Excel).')}</p>
                                                <p>{t('3.The edited file must be saved in a comma separated (CSV) format before it is uploaded.')}</p>

                                            </div> :
                                            pmType === "platformSysUser" ?
                                                <div className='col-5' style={{ color: "#222c70", fontSize: "14px", fontWeight: "500" }}>
                                                    <p>Guidelines:</p>
                                                    <p>1.For Lender and Borrower registration, please use this &nbsp;
                                                        <span className='templateLink' onClick={() => this.lBtemplatecsv(lenBorcsv)} style={{ cursor: "pointer" }}>template.<FaDownload />
                                                        </span>
                                                    </p>
                                                    <p>2.For Facilitator registration, please use this &nbsp;
                                                        <span className='templateLink' onClick={() => this.faEvltemplatecsv(facevlcsv)} style={{ cursor: "pointer" }}>template.<FaDownload />
                                                        </span>
                                                    </p>
                                                    <p>{t('3.The template file can be modified in any commonly used spreadsheet program (e.g., Excel).')}</p>
                                                    <p>{t('4.The edited file must be saved in a comma separated (CSV) format before it is uploaded.')}</p>

                                                </div> : ""
                                }

                                <div className='col' style={{ paddingTop: "44px" }}>
                                    <div>
                                        <input type="checkbox" className="css-checkbox " name="check" onChange={this.isVKYCRequired}
                                            style={{ marginLeft: "10px", color: "rgba(5,54,82,1)", cursor: "pointer" }} />
                                        <span style={{ marginLeft: "15px", color: "rgb(40, 116, 166)", fontWeight: "bolder", fontSize: "13px", fontStyle: "Poppins" }}>&nbsp;KYC Verification Required</span>
                                    </div>
                                    <div style={{ border: "1.5px solid black", borderRadius: "5px", paddingTop: "10px", height: "fit-content", marginBottom: "10px" }}>
                                        <p class="text-center">
                                            <label for="attachment">
                                                <a type="button" role="button" className="btn btn-sm text-white" aria-disabled="false"
                                                    style={{ backgroundColor: "#222C70" }}><span style={{ fontFamily: "Poppins,sans-serif" }}><FaFileUpload />&nbsp;Choose File</span></a>
                                            </label>
                                            <input type="file" name="file[]" accept=".xlsx, .xls, .csv" id="attachment" onChange={this.checkNoofFiles.bind(this)}
                                                style={{ visibility: "hidden", position: "absolute" }} multiple />
                                        </p>
                                        <p id="bulk-files" style={{ textAlign: "center" }}>
                                            <span id="filesList">
                                                <span id="files-names"></span>
                                            </span>
                                        </p>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", display: "none" }} id="uploadBulk"
                                            onClick={this.uploadFile}>
                                            <FaFileUpload />&nbsp;Upload</button>
                                    </div>
                                </div>
                                <div className='col'></div>
                            </div>
                            {/* <div className='row mt-2'>
                                <div className='col' style={{ textAlign: "center" }}>
                                    <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", display: "none" }} id="uploadBulk"
                                        onClick={this.uploadFile}>
                                        <FaFileUpload />&nbsp;Upload</button>
                                </div>
                            </div> */}

                        </div>
                    </div>
                    {/* Modal */}
                    <button id='Launch' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Launch demo modal
                    </button>
                    <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p>Total count: {this.state.totalcount}</p>
                                            <p>Success: {this.state.successcount}</p>
                                            <p>Failure: {this.state.failurecount}</p>
                                            <p>Batch Number: {this.state.batchno}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <h6>Do you want to see the Details?</h6>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={this.downloadCsv}>Yes</button>
                                    <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={() => this.props.history.push('/landing')}>No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col'></div>
                        <div className='col'>
                            {/* <form className="form pt-3" action="/action_page.php">
                                <input type="file" id="file" accept='.csv' className="border text-dark ml-2 pr-5" />
                            </form>
                            <button class="btn btn-primary ml-3 mt-1" onClick={this.uploadFile} type="button">Upload</button> */}
                        </div>
                        <div className='col'></div>
                        <div style={{ display: "none" }}>
                            <iframe src="" className="PDFdoc" type="application/csv" style={{ overflow: "auto", height: "100vh", width: "100%" }}>
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default withTranslation()(BulkUploadUsers)
