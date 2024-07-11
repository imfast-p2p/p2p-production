import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaAngleDoubleRight, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit, FaFolderPlus, FaDownload } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import openIt from '../../assets/AdminImg/openit.png'
import us from '../../assets/AdminImg/pro.png';
import editRole from '../../assets/editRole.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo2 from '../../assets/IFPL.jpg';

export class JournalDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offset: 0,
            orgtableData: [],
            perPage: 20,
            currentPage: 0,
            pageCount: "",

            getJeDetails: [],
            list: [],
            pdfBtn: false,
            resMsg: "",
            commMonth: "",
            finyear: "",
            commMonth: "",

            showLoader: false
        }
    }
    componentDidMount() {
        this.getJeDetails();
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
            getJeDetails: slice
        })
    }
    getJeDetails = () => {
        this.setState({ showLoader: true })
        fetch(BASEURL + `/misreports/getjedetails`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                jemonth: sessionStorage.getItem("jeMonth"),
            })
        }).then((response) => {
            console.log("Response:", response);
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success" || resdata.status == "SUCCESS") {
                    this.setState({ showLoader: false, list: resdata.msgdata })
                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        getJeDetails: slice
                    })
                    this.pdfBtnEnable()
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
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click();
                        this.setState({
                            getJeDetails: [],
                            orgtableData: []
                        }, () => {
                            console.log(resdata.message)
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    viewMoreDetails = (lists) => {
        console.log(lists)
        // var convertToString = JSON.stringify(lists)
        // sessionStorage.setItem("commLists", convertToString)
        // console.log(sessionStorage.getItem("commLists"))
        // window.location = "/commBreakdown";
    }
    pdfBtnEnable = (event) => {
        this.setState({ pdfBtn: true });
    }
    exportPDF = (param) => {
        console.log(param)
        if (param === "pdf") {
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
                const secondTitle = "Journal Entries Summary";
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
                const headers = [[
                    "TXN. Name",
                    "TXN. Amount",
                    "TXN. Reference No.",
                    "TXN. Date",
                    "Financial Year"]];
                const data = this.state.list.map(list => [
                    list.txnevent,
                    list.txnamount,
                    list.txnreference,
                    list.txndate,
                    list.txnfinyear]);
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
                doc.save("journal_details.pdf");
            };
        } else if (param === "csv") {
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
                const secondTitle = "Partner Earnings";
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
                const heading1 = "Financial Year: " + this.state.getDate;
                const title2 = secondTitle + '\n' + heading2 + '\n' + heading1;
                doc.setFontSize(13);
                doc.text(title2, marginLeft, secondTitleY);

                // Extract the data from your state or wherever you have it stored
                const reqNos = this.state.list;

                // Define your headers
                const headers2 = [
                    "TXN. Name",
                    "TXN. Amount",
                    "TXN. Reference No.",
                    "TXN. Date",
                    "Financial Year"
                ];

                // Create an array to hold the CSV rows
                let csvRows = [];

                // Push the headers as the first row
                csvRows.push(headers2.join(','));

                // Iterate through your data and format each row
                reqNos.forEach(list => {
                    const formattedRow = [
                        `"${list.txnevent}"`,
                        `"${parseFloat(list.txnamount).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}"`,
                        `"${list.txnreference}"`,
                        `"${list.txndate}"`,
                        `"${list.txnfinyear}"`,
                    ];
                    csvRows.push(formattedRow.join(','));
                });

                // Combine rows into a single string with line breaks
                const csvString = csvRows.join('\n');

                // Create a Blob object with the CSV string
                const blob = new Blob([csvString], { type: 'text/csv' });

                // Create a download link
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'journal_details.csv';

                // Append the link to the DOM and trigger the download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        }
    }
    reloadPage = () => {
        var msg = this.state.resMsg
        if (msg.includes("successfull")) {
            window.location.reload();
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
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc", marginTop: "-7px" }}>
                < SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-lg-5 col-md-8 col-sm-10' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/journalEntries">Journal Entries</Link>/ Journal Details</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="ProductDefRes3">
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "57px", width: "87%", marginTop: "-5px", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row '>
                        <div className="col-lg-8 col-sm-6 col-md-10" style={{ textAlign: "end" }}>
                            <p className="" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>
                                Journal Entries Details
                            </p>
                        </div>
                        <div className='col-lg-4 col-sm-6 col-md-8' style={{ textAlign: "end" }}>
                            {this.state.pdfBtn == true ?
                                <button className="btn btn-sm btn-success dropdown-toggle"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                    style={{ marginRight: "40px" }}
                                ><FaDownload />&nbsp;{t('Export')}</button>
                                : null}
                            &nbsp;
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-73px" }}>
                                <a class="dropdown-item" onClick={() => this.exportPDF("pdf")}>PDF</a>
                                <a class="dropdown-item" onClick={() => this.exportPDF("csv")}>CSV</a>
                            </div>
                        </div>
                    </div>

                    {/* New Design */}
                    <div className='row'>
                        {this.state.getJeDetails == "" ?
                            <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                    <p>No lists available.</p>
                                </div>
                            </div> :
                            <>
                                <div className='scrollbar' id="auditScroll" style={{ marginTop: "10px" }}>
                                    <div style={{
                                        whiteSpace: "nowrap"
                                    }} id='secondAuditScroll'>
                                        <div className='row font-weight-normal'
                                            style={{
                                                marginLeft: "25px",
                                                fontWeight: "800",
                                                fontSize: "15px",
                                                color: "rgba(5,54,82,1)",
                                                width: "95%"
                                            }}>
                                            <div className='col-lg-4 col-md-5 col-sm-8'>
                                                <p style={{ marginLeft: "25px", fontWeight: "600" }}>{t('TXN. Name')}</p>
                                            </div>
                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                <p style={{ fontWeight: "600" }}>{t('TXN. Amount')}</p>
                                            </div>
                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                <p style={{ fontWeight: "600" }}>{t('TXN. Reference No.')}</p>
                                            </div>
                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                <p style={{ fontWeight: "600", marginLeft: "30px" }}>{t('TXN. Date')}</p>
                                            </div>
                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                <p style={{ fontWeight: "600", marginLeft: "30px" }}>{t('Financial Year')}</p>
                                            </div>
                                        </div>
                                        <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                        {/* Lists */}
                                        <div className="scrollbar" style={{
                                            height: "300px",
                                            overflowY: 'auto',
                                            marginTop: "-16px"
                                        }}>
                                            {this.state.getJeDetails.map((lists, index) => {
                                                return (
                                                    <div className='col' key={index}>
                                                        <div className='card border-0' style={{ marginBottom: "-15.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                            <div className="row item-list align-items-center" style={{ paddingBottom: "5px", paddingTop: "5px" }}>
                                                                <div className="col-lg-4 col-md-6 col-sm-8" style={{ paddingLeft: "11px" }}>
                                                                    <p className="ml-4 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap" }}>{lists.txnevent}</p>
                                                                </div >
                                                                <div className="col-lg-2 col-md-5 col-sm-8">
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>₹ {parseFloat(lists.txnamount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div >
                                                                <div className="col-lg-2 col-md-5 col-sm-8">
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.txnreference}</p>
                                                                </div>
                                                                <div className="col-lg-2 col-md-5 col-sm-8">
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", marginLeft: "30px" }}>{lists.txndate}</p>
                                                                </div>
                                                                <div className="col-lg-2 col-md-5 col-sm-8" style={{ textAlign: "" }}>
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", marginLeft: "34px" }}>{lists.txnfinyear}</p>
                                                                </div>
                                                            </div >
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        &nbsp;
                                        <div className="row float-right mr-4">
                                            <div className='card border-0'>
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
                                </div>
                            </>}
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

export default withTranslation()(JournalDetails)