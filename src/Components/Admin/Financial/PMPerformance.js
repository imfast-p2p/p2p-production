import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../AdminSidebar';
import SystemUserSidebar from '../../SystemUser/SystemUserSidebar';
import $, { event } from 'jquery';
import { confirmAlert } from "react-confirm-alert";
import { withTranslation } from 'react-i18next';
import { FaAngleLeft, FaDownload } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';
import openIt from '../../assets/AdminImg/openit.png';
import batch from '../../assets/batch.png';
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo2 from '../../assets/IFPL.jpg';
import * as FaIcons from "react-icons/fa";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

export class PMPerformance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrayData: [],
            pmType: "",

            orgtableData: [],
            offset: 0,
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            allLists: [],

            pdfBtn: false,
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            // Add an event listener for the popstate event
            window.addEventListener('popstate', this.handlePopstate);
            // Manipulate the history to stay on the same page
            window.history.pushState(null, null, window.location.pathname);

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
        } else {
            window.location = '/login'
        }
        this.getPMPerformance();
    }
    handlePageClick = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData();
        })
    }
    loadMoreData = () => {
        const data = this.state.orgtableData;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            arrayData: slice
        })
    }
    getPMPerformance = () => {
        fetch(BASEURL + '/lsp/getcurrentpmperformance', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'Success' || 'SUCCESS') {
                    console.log(resdata);
                    var data = resdata.msgdata
                    console.log(data)
                    if (data) {
                        this.setState({ allLists: resdata.msgdata })
                        this.setState({ arrayData: resdata.msgdata })
                        var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                        console.log(slice)

                        this.setState({
                            pageCount: Math.ceil(data.length / this.state.perPage),
                            orgtableData: data,
                            arrayData: slice
                        })
                        this.pdfBtnEnable()
                    }
                }
                else {
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
    }
    pdfBtnEnable = (event) => {
        this.setState({ pdfBtn: true });
    }
    exportPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const marginLeft = 40;
        const footerHeight = 20; // Height of the footer area
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(13);

        const title1 = "IMFAST Finfotech Private Limited";
        const title = title1;

        // Convert the local image to a data URL
        const img = new Image();
        img.src = logo2;
        img.onload = () => {
            const pageWidth = doc.internal.pageSize.getWidth();
            const logoWidth = 60; // Adjust the logo width as needed
            const pageHeight = doc.internal.pageSize.getHeight();
            const logoHeight = (img.height * logoWidth) / img.width; // Maintain the aspect ratio

            const logoX = marginLeft;
            const logoY = 40 - 30;
            doc.addImage(logo2, 'PNG', logoX, logoY, logoWidth, logoHeight);

            // Calculate the x coordinate for the text (beside the logo)
            const textX = logoX + logoWidth + 20; // Adjust the horizontal spacing between logo and text

            // Calculate the y coordinate for the text (align with the top of the logo)
            let textY = logoY;

            // Add the text to the PDF document
            const title1Spacing = 25;
            textY += title1Spacing;

            // Calculate the X coordinate to center the title1
            const titleWidth = doc.getTextWidth(title1);
            const titleX = (pageWidth - titleWidth) / 2;

            // Set the font style to bold by setting the 'fontWeight' option to 'bold'
            doc.setFont(undefined, 'bold');
            doc.text(title, titleX, textY);

            // Reset the font style to normal for other text
            doc.setFont(undefined, 'normal');

            const secondTitleY = logoY + logoHeight + 20; // Adjust vertical spacing as needed

            // Add the second title below the image
            const secondTitle = "Partner Performance";
            const now1 = new Date();
            const year1 = now1.getFullYear();
            const month1 = String(now1.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const day1 = String(now1.getDate()).padStart(2, '0');
            let hours1 = String(now1.getHours()).padStart(2, '0');
            const minutes1 = String(now1.getMinutes()).padStart(2, '0');
            const seconds1 = String(now1.getSeconds()).padStart(2, '0');

            let amOrPm1 = 'AM';

            if (hours1 >= 12) {
                amOrPm1 = 'PM';
                if (hours1 > 12) {
                    hours1 = String(hours1 - 12).padStart(2, '0');
                }
            }

            const formattedDateTime1 = `${year1}-${month1}-${day1}, ${hours1}:${minutes1}:${seconds1} ${amOrPm1}`;
            const heading2 = "Generated On: " + formattedDateTime1;
            const title2 = secondTitle + '\n' + heading2;
            doc.setFontSize(13);
            doc.text(title2, marginLeft, secondTitleY);

            // Rest of the content, e.g., autoTable code
            const headers = [["Partner Name",
                "Borrowers Onboarded",
                "Total Loan Accounts",
                "Total Disbursement Amount"]];
            const data = this.state.allLists && this.state.allLists.length > 0 &&
                this.state.allLists.map(list => [list.partnername,
                list.noofboronboarded,
                list.totnoofloanaccounts,
                list.totdisbursementamt]);
            console.log(data)
            let content = {
                startY: secondTitleY + 50, // Adjust vertical spacing as needed
                head: headers,
                body: data
            };
            doc.autoTable(content);

            // Footer content - Company Name and Timestamp
            const companyName = "IMFAST Finfotech Private Limited"; // Replace with your company name

            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const day = String(now.getDate()).padStart(2, '0');
            let hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            let amOrPm = 'AM';

            if (hours >= 12) {
                amOrPm = 'PM';
                if (hours > 12) {
                    hours = String(hours - 12).padStart(2, '0');
                }
            }

            const formattedDateTime = `${year}-${month}-${day}, ${hours}:${minutes}:${seconds} ${amOrPm}`;
            const timestamp = formattedDateTime; // Get the current date and time

            const footerText = `Generated by: ${companyName}, on: ${timestamp}`;
            const footerX = pageWidth / 2;
            const footerY = pageHeight - footerHeight - 1; // Adjust vertical position as needed
            doc.setFontSize(9);

            // Add page numbers manually
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginLeft, footerY, { align: "right" });
                doc.text(footerText, footerX, footerY, { align: "center" });
            }
            doc.save("Partnerperformance.pdf");
        };
    }
    handleChange() {
        $('.text').toggle();
        $("#Pinfo").toggle();
    }
    render() {
        const { t } = this.props
        const { pmAdminType } = this.state
        console.log(this.state.arrayData);
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
        const { pmType, arrayData } = this.state;
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                {sessionStorage.getItem('userType') === "0" ?
                    <AdminSidebar partnerName={this.state.partnerName} />
                    :
                    sessionStorage.getItem('userType') === "1" ?
                        <SystemUserSidebar /> : ""
                }
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="BnavRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="BnavRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                {pmType === "platformSysUser" ?
                                    <Link to="/sysUserDashboard">Home</Link> :
                                    pmType === "0" ?
                                        <Link to="/landing">Home</Link> :
                                        <Link to="/landing">Home</Link>
                                }
                                / Partner Performance</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="BnavRes3">
                            {pmType === "platformSysUser" ?
                                <button style={myStyle}>
                                    <Link to="/sysUserDashboard">
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
                    <div className='row '>
                        <div className="col-7">
                            <p className="d-flex justify-content-end" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>
                                {/* Partner Performance */}
                            </p>
                        </div>
                        <div className="col-5">
                            {this.state.pdfBtn == true ?
                                <button className="btn btn-sm btn-success float-right"
                                    style={{ marginRight: "38px", padding: "6px" }}
                                    onClick={() => this.exportPDF()}><FaDownload />&nbsp;{t('ExporttoPDF')}</button>
                                : null}
                        </div>
                    </div>

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-10px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            &nbsp; {t(' Partner Performance')} </a> </li>
                                    </ul>

                                </div>
                            </div>

                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {arrayData && arrayData.length === 0 ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No lists available.</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll1'>
                                                        <Table responsive>
                                                            <Thead>
                                                                <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Partner Name')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Borrowers Onboarded')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Total Loan Accounts')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Disbursement Amount')}</Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {arrayData.map((array, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{array.partnername}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{array.noofboronboarded}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{array.totnoofloanaccounts}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>₹ {array.totdisbursementamt}</Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {arrayData.length > 1 &&
                                                            <div className="row justify-content-end">
                                                                <div className='col-auto'>
                                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                                        <div style={{ marginTop: "-25px", marginLeft: "16px" }}>
                                                                            <ReactPaginate
                                                                                previousLabel={"<"}
                                                                                nextLabel={">"}
                                                                                breakLabel={"..."}
                                                                                breakClassName={"break-me"}
                                                                                pageCount={this.state.pageCount}
                                                                                onPageChange={this.handlePageClick}
                                                                                containerClassName={"pagination"}
                                                                                subContainerClassName={"pages pagination"}
                                                                                activeClassName={"active"}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>}
                                                    </div>
                                                </>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Common Alert */}
                    <button id='commonModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter21">
                    </button>
                    <div className="modal fade" id="exampleModalCenter21" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                {this.state.resMsg}
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.reloadPage}>Okay</button>
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

export default withTranslation()(PMPerformance)
