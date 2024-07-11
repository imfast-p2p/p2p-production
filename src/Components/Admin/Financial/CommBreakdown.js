import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../AdminSidebar';
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
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import Loader from '../../Loader/Loader';

class CommBreakdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            partnerCommLists: [],
            offset: 0,
            perPage: 20,
            currentPage: 0,
            pageCount: "",

            pdfBtn: false,
            resMsg: "",
            pmAdminType: "",

            serviceLists: [],
            getAllservicesInfo: [

            ],
            commMonth: "",
            selectedServiceName: "",
            finyear: "",
            partnerID: "",
            partnerName: "",
            partnerLists: [],
            selectedCommSumType: "",
            showLoader: false,
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            // Add an event listener for the popstate event
            window.addEventListener('popstate', this.handlePopstate);
            // Manipulate the history to stay on the same page
            window.history.pushState(null, null, window.location.pathname);

            if (sessionStorage.getItem('sAdmin') === "1" && sessionStorage.getItem('pmDefault') === "1") {
                //Super Admin
                this.setState({ pmAdminType: "superAdmin" })
            } else if (sessionStorage.getItem('pmDefault') === "0") {
                this.setState({ pmAdminType: "pmAdmin" })
            } else {
                this.setState({ pmAdminType: "0" })
            }
        } else {
            window.location = '/login'
        }

        console.log(sessionStorage.getItem("commLists"))
        var jsonObject = JSON.parse(sessionStorage.getItem("commLists"));
        console.log(jsonObject);
        this.setState({
            commMonth: jsonObject.commmonth,
        })
        // var commmonth = jsonObject.commmonth;
        // commmonth += "-01";
        // console.log(commmonth)
        // var ptID = jsonObject.partnerid
        // this.getPartnerComissionBreakdown(commmonth, ptID)
        // pmID = jsonObject.partnerid;
        // console.log(pmID)
        // this.setState({ pmID: jsonObject.partnerid }, () => {
        //     console.log(this.state.pmID);
        // });

        this.setState({
            commMonth: jsonObject.commmonth,
            partnerID: jsonObject.partnerid,
            partnerName: jsonObject.partnername
        }, () => {
            this.getAllPartners(jsonObject.partnerid);
            this.getPartnerComissionBreakdown()
        })
    }
    componentWillUnmount() {
        // Clean up the event listener when the component is unmounted
        window.removeEventListener('popstate', this.handlePopstate);
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
            partnerCommLists: slice
        })
    }
    handlePopstate = (event) => {
        // Prevent the default behavior of the back button
        event.preventDefault();
        // Manipulate the history to stay on the same page
        window.history.pushState(null, null, window.location.pathname);
    };
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
            const secondTitle = "Commission Breakdown";
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
            let startY = secondTitleY + 30; // Initial Y position for content

            // Loop over services
            this.state.getAllservicesInfo.forEach((serviceInfo, index) => {
                // Calculate Y position for this service
                startY += 20; // Add spacing between services

                // Service Name
                doc.setFontSize(13);
                const serviceName = `Service Name: ${this.state.serviceLists.find(element => element.serviceid === serviceInfo.servicename)?.servicedescription || 'Unknown'}`;
                doc.text(serviceName, marginLeft, startY);

                // Table headers
                const headers = Object.keys(serviceInfo.serviceinfo[0]).map(key => {
                    switch (key) {
                        case "borrowerid":
                            return "Borrower ID";
                        case "txnamt":
                            return "Transaction Amount";
                        case "facilitatorid":
                            return "Facilitator ID";
                        case "valuedate":
                            return "Date";
                        case "loanaccountnumber":
                            return "Loan Account No.";
                        case "loanamt":
                            return "Loan Amount";
                        case "loandisbursementdate":
                            return "Disbursement Date";
                        default:
                            return key;
                    }
                });

                // Table data
                const data = serviceInfo.serviceinfo.map(obj => Object.values(obj));

                // Generate table
                doc.autoTable({
                    startY: startY + 10,
                    head: [headers],
                    body: data,
                    styles: { halign: 'left', fontSize: 10 },
                    margin: { left: marginLeft, right: marginLeft }
                });

                // Update startY for the next service
                startY = doc.autoTableEndPosY() + 30; // Update startY for the next service
            });

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

            const formattedDateTime = `${year} - ${month} - ${day}, ${hours}: ${minutes}: ${seconds} ${amOrPm}`;
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
            doc.save("CommissionBreakdown.pdf");
        };
    }
    reloadPage = () => {
        var msg = this.state.resMsg
        if (msg.includes("successfull")) {
            window.location.reload();
        }
    }
    getAllPartners = (partnerid) => {
        // console.log(this.state.partnerID)
        fetch(BASEURL + '/usrmgmt/getallpartners', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success' || resdata.status == 'SUCCESS' || resdata.status == 'success') {
                    console.log(resdata);
                    this.setState({ partnerLists: resdata.msgdata })

                    console.log(partnerid, resdata.msgdata);
                    var Result = resdata.msgdata.filter((element) => element.partnerid == partnerid);
                    console.log(Result);

                    var servicesList = Result.forEach(element => {
                        console.log(element.services)
                        this.setState({ serviceLists: element.services });
                    });

                    // var servicesList = ["BONBOARD", "LOANPROC", "LAPPASST"]
                    // this.setState({ serviceLists: servicesList });
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
            .catch((error) => {
                console.log(error)
            })
    }
    selectcommMonth = (event) => {
        this.setState({ commMonth: event.target.value });
    }
    selectServiceName = (event) => {
        this.setState({ selectedServiceName: event.target.value });
    }
    selectPartner = (event) => {
        this.setState({ partnerID: event.target.value });
    }
    selectCommSummary = (event) => {
        this.setState({ selectedCommSumType: event.target.value })
    }
    getPartnerComissionBreakdown = () => {
        console.log(this.state.partnerID, this.state.selectedCommSumType)
        var result;
        if (this.state.selectedServiceName === "" && this.state.partnerID === "") {
            result = JSON.stringify({
                commonth: this.state.commMonth,
                pmid: this.state.partnerID,
                ...(this.state.selectedCommSumType && { type: this.state.selectedCommSumType })
            })
        } else if (this.state.selectedServiceName !== "" && this.state.partnerID === "") {
            result = JSON.stringify({
                commonth: this.state.commMonth,
                pmid: this.state.partnerID,
                service: this.state.selectedServiceName,
                ...(this.state.selectedCommSumType && { type: this.state.selectedCommSumType })
            })
        } else if (this.state.selectedServiceName === "" && this.state.partnerID !== "") {
            result = JSON.stringify({
                commonth: this.state.commMonth,
                pmid: this.state.partnerID,
                ...(this.state.selectedCommSumType && { type: this.state.selectedCommSumType })
            })
        } else if (this.state.selectedServiceName !== "" && this.state.partnerID !== "") {
            result = JSON.stringify({
                commonth: this.state.commMonth,
                service: this.state.selectedServiceName,
                pmid: this.state.partnerID,
                ...(this.state.selectedCommSumType && { type: this.state.selectedCommSumType })
            })
        }
        console.log(result)
        this.setState({ showLoader: true })
        fetch(BASEURL + '/misreports/getpartnercommissionbreakdown', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: result
        })
            .then(response => {
                console.log('Response:', response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'SUCCESS' || resdata.status == 'Success' || resdata.status == 'success') {
                    this.setState({ getAllservicesInfo: resdata.msgdata })
                    this.setState({ showLoader: false })
                    this.pdfBtnEnable()
                } else {
                    alert(resdata.message);
                }

            })
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
        console.log(this.state.serviceLists);
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <AdminSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="BnavRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="BnavRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/partnerEarnings">Partner Earnings</Link> / Commission Breakdown</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-2'>

                        </div>
                        <div className="col" id="BnavRes3">
                            <button style={myStyle}>
                                <Link to="/partnerEarnings"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className='row '>
                        <div className="col-7">
                            <p className="d-flex justify-content-end" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>
                                Commission Breakdown
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


                    <div className='row' style={{ marginLeft: "30px", width: "95%" }}>
                        <div className='col'>
                            <label htmlFor="" className="" style={{ fontSize: "14px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('Commission Month *')}</label><br />
                            {/* <input className='form-control' type='text' value={this.state.commMonth} disabled /> */}
                            <input type='month' className='form-control' value={this.state.commMonth}
                                onChange={this.selectcommMonth}
                                style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",

                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px"
                                }} />
                        </div>
                        <div className='col'>
                            <label htmlFor="" className="" style={{ fontSize: "14px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('Partner Name')}</label><br />
                            <select className='form-select' onChange={this.selectPartner}
                                style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px"
                                }}>
                                {this.state.partnerID ? (
                                    <option value="" disabled>
                                        {this.state.partnerName}
                                    </option>
                                ) : (
                                    <>
                                        <option value="">--Select--</option>
                                        {this.state.partnerLists.map((service, index) => (
                                            <option key={index} value={service.partnerid}>{service.partnername}</option>
                                        ))}
                                    </>
                                )}

                            </select>
                        </div>
                        <div className='col'>
                            <label htmlFor="" className="" style={{ fontSize: "14px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('Services')}</label><br />
                            <select className='form-select' onChange={this.selectServiceName}
                                style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px"
                                }}>
                                <option defaultValue="" style={{ textAlign: "center" }}>
                                    --Select--
                                </option>
                                {
                                    this.state.serviceLists.map((service, index) => (
                                        <option key={index} value={service.serviceid}>{service.servicedescription}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='col'>
                            <label htmlFor="" className="" style={{ fontSize: "14px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('Commission Type')}</label><br />
                            <select className='form-select' onChange={this.selectCommSummary}
                                style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px"
                                }}>
                                <option defaultValue="" style={{ textAlign: "center" }}>
                                    --Select--
                                </option>
                                <option value="1">Commission summary</option>
                                <option value="2">Commission details</option>
                            </select>
                        </div>
                        <div className='col' style={{ marginTop: '32px', textAlign: 'center' }}>
                            <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: "rgba(0,121,190,1)", width: "100%", padding: "6px" }} onClick={this.getPartnerComissionBreakdown}>{t('Apply')}</button>
                        </div>
                    </div>

                    {/* New Design */}
                    {this.state.getAllservicesInfo == "" ?
                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                            <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                <p>No lists available.</p>
                            </div>
                        </div> :
                        <>
                            <div className='scrollbar' id="auditScroll" style={{ marginTop: "10px", marginLeft: "45px", width: "92.5%" }}>
                                <div style={{
                                    whiteSpace: "nowrap"
                                }} id='secondAuditScroll'>
                                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                    {/* Lists */}
                                    <div className="scrollbar" style={{
                                        height: "320px",
                                        overflowY: "scroll", scrollbarWidth: "thin"
                                    }}>
                                        {this.state.getAllservicesInfo.map((serviceInfo, index) => {
                                            return (
                                                <div style={{ borderRadius: "5px", marginBottom: "3px" }}>
                                                    <p className="font-weight-bold" style={{ fontSize: "15px", marginBottom: "1px", fontFamily: "Poppins,sans-serif", color: "rgba(5,54,82,1)", fontWeight: "600" }}>
                                                        Service Name : <span style={{ fontFamily: "Poppins,sans-serif", color: "rgba(5,54,82,1)", fontWeight: "500" }}>
                                                            {this.state.serviceLists.map(element => {
                                                                if (element.serviceid === serviceInfo.servicename) {
                                                                    return element.servicedescription;
                                                                }
                                                                return null;
                                                            })}
                                                        </span>
                                                    </p>
                                                    <div className='scrollBar1' key={index} style={{ height: "200px", overflowY: "scroll", scrollbarWidth: "thin" }}>
                                                        <Table>
                                                            <Thead>
                                                                <Tr className='pl-4 font-weight-normal' style={{
                                                                    fontSize: "15px",
                                                                    fontFamily: "'Poppins', sans-serif", color: "rgba(5,54,82,1)", paddingLeft: "6px"
                                                                }}>
                                                                    {Object.keys(serviceInfo.serviceinfo[0]).map((key, index) => (
                                                                        <Th key={index} style={{ fontSize: "14px", textAlign: "left", fontWeight: "600", marginTop: "5px" }}>
                                                                            {key === "borrowerid" ? "Borrower ID" :
                                                                                key === "facilitatorcount" ? "Facilitator Count" :
                                                                                    key === "pmid" ? "PM ID" :
                                                                                        key === "tottxnamount" ? "Total Transaction Amount" :
                                                                                            key === "txnamt" ? "Transaction Amount" :
                                                                                                key === "facilitatorid" ? "Facilitator ID" :
                                                                                                    key === "valuedate" ? "Date" :
                                                                                                        key === "loanaccountnumber" ? "Loan Account No." :
                                                                                                            key === "loanamt" ? "Loan Amount" :
                                                                                                                key === "loandisbursementdate" ? "Disbursement Date" : key
                                                                            }
                                                                        </Th>
                                                                    ))}
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {serviceInfo.serviceinfo.map((obj, subIndex) => (
                                                                    <Tr key={subIndex} style={{
                                                                        fontSize: "14px", fontFamily: "'Poppins', sans-serif", color: "rgb(5, 54, 82)",
                                                                        transition: 'none', cursor: 'default', backgroundColor: (subIndex % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        {Object.values(obj).map((value, index) => (
                                                                            <Td key={index} style={{ textAlign: "left", fontWeight: "490", paddingTop: "12px" }}>{value}</Td>
                                                                        ))}
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                    </div>
                                                </div>

                                            )
                                        })}
                                    </div>
                                    {/* &nbsp;
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
                                    </div> */}
                                </div>
                            </div>
                        </>}

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

export default withTranslation()(CommBreakdown)
