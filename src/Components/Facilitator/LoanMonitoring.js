import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import FacilitatorSidebar from '../../SidebarFiles/FacilitatorSidebar';
import { withTranslation } from 'react-i18next';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaAngleLeft, FaRegFileAlt, FaMoneyBill, FaDownload, FaFileAlt, FaEllipsisV } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css'
import Tooltip from "@material-ui/core/Tooltip";
import logo2 from '../assets/IFPL.jpg';
import { confirmAlert } from 'react-confirm-alert';
import SystemUserSidebar from '../SystemUser/SystemUserSidebar';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import openIt from '../assets/AdminImg/openit.png'
import batch from '../assets/batch.png';
import Loader from '../Loader/Loader';

export class LoanMonitoring extends Component {
    constructor(props) {
        super(props)
        //updated
        this.state = {
            borrowerid: "",
            fromdate: "",
            todate: "",
            borTxnList: [],
            bordetails: {},
            dtoday: "",
            dfrday: "",
            pdfBtn: false,
            loanrequestno: "",

            name: "",
            mobileno: "",
            gender: "",
            email: "",
            loanreqno: "",

            loanReqNum: "",

            offset: 0,
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            payPricipal: "",
            loandisbursementdate: "",
            amtoverdue: "",
            loanAccno: "",
            loanamt: "",
            daysoverdue: "",
            lastpaidon: "",
            borrowerLoanLists: {},

            loanMonTxnforPDF: [],
            selectedLoanDetails: {},
            interestoutstanding: "",
            b2lchargesoutstanding: "",
            p2pfeeschargesoutstanding: "",
            prpp: "",
            amtpaid: "",
            payBtn: true,
            showLoader: false,

        }
        this.fromdate = this.fromdate.bind(this);
        this.todate = this.todate.bind(this);
        this.getDueLoans = this.getDueLoans.bind(this);
        this.pdfBtnEnable = this.pdfBtnEnable.bind(this);
    }
    componentDidMount() {
        console.log(sessionStorage.getItem('token'));
        this.loadDate();
        this.getDueLoans()
        if (sessionStorage.getItem('pmDefault') === "0") {
            this.setState({ pmType: "pmSystemUser" }); // Update state using setState
        } else {
            this.setState({ pmType: "platformSysUser" }); // Update state using setState
        }
    }
    perPage = (event) => {
        this.setState({ perPage: event.target.value })
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
            borTxnList: slice
        })
    }

    fromdate(event) {
        this.setState({ fromdate: event.target.value })
    }
    todate(event) {
        this.setState({ todate: event.target.value })
    }

    pdfBtnEnable(event) {
        // const pdfBtn = !this.state.pdfBtn;
        this.setState({ pdfBtn: true });
    }
    loadDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var frday;

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        frday = yyyy + '-' + mm + '-' + '01';
        this.setState({ dtoday: today });
        this.setState({ todate: today })
        this.setState({ dfrday: frday });
        this.setState({ fromdate: frday })

    }

    getDueLoans() {
        fetch(BASEURL + '/lms/getdueloans', {
            method: 'get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    //For pdf docu
                    this.setState({ loanMonTxnforPDF: resdata.msgdata })

                    this.setState({ borTxnList: resdata.msgdata })
                    console.log(this.state.borTxnList)

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        borTxnList: slice
                    })
                    this.pdfBtnEnable()
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
            const logoWidth = 70; // Adjust the logo width as needed
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
            const secondTitle = "Loan Monitoring";
            const heading1 = "Name: " + sessionStorage.getItem('facName');
            const heading2 = "Date : From " + this.state.fromdate + " To " + this.state.todate;
            const title2 = secondTitle + '\n' + heading1 + '\n' + heading2;
            doc.setFontSize(13);
            doc.text(title2, marginLeft, secondTitleY);

            // Rest of the content, e.g., autoTable code
            const headers = [["Disbursed Date", "Account Number", "Amount Overdue", "Principal Outstanding"]];
            const data = this.state.loanMonTxnforPDF.map(list => [list.loandisbursementdate, list.loanaccountno, list.amtoverdue, list.principaloutstanding]);
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
            doc.save("report.pdf");
        };
    }

    getBorrowerProfileInfo = (lists) => {
        console.log(lists)
        this.setState({ borrowerLoanLists: lists }, () => {
            console.log(this.state.borrowerLoanLists)
        });
        sessionStorage.setItem("loanReq", lists.loanreqno);
        sessionStorage.setItem("loanAccNo", lists.loanaccountno);

        fetch(BASEURL + '/lsp/getborprofileinfo?loanreqnumber=' + lists.loanreqno, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    $('#mdetails').click();

                    this.setState({ name: resdata.msgdata[0].name })
                    this.setState({ mobileno: resdata.msgdata[0].mobile })
                    this.setState({ gender: resdata.msgdata[0].gender })
                    this.setState({ email: resdata.msgdata[0].email })


                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    payPrincipal = (event) => {
        const value = event.target.value
        this.setState({ payPricipal: value });
        if (value !== "") {
            this.setState({ payBtn: false })
        }
        else {
            this.setState({ payBtn: true })
        }
    }

    payEmi = () => {
        // const popup = window.confirm("Are you sure you want to pay the amount ?");
        // if (popup == true) {
        //     sessionStorage.setItem("amount", this.state.payPricipal);
        //     // Setting Manual Flag for paymentType.
        //     var paymenttype = 2; //2 for Borrower repayment ,4 for Facilitator Topup
        //     console.log(paymenttype);
        //     sessionStorage.setItem("paymentType", paymenttype)
        //     console.log(sessionStorage.getItem("paymentType"))
        //     window.location = "/payFacDues";
        // }
        sessionStorage.setItem("amount", this.state.payPricipal);
        // Setting Manual Flag for paymentType.
        var paymenttype = 2; //2 for Borrower repayment ,4 for Facilitator Topup
        console.log(paymenttype);
        sessionStorage.setItem("paymentType", paymenttype)
        console.log(sessionStorage.getItem("paymentType"))
        window.location = "/payFacDues";
    }

    repaybrkdown = () => {
        this.setState({ showLoader: true })
        fetch(BASEURL + '/lsp/getrepaymentbreakdown', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanaccountnumber: sessionStorage.getItem('loanAccNo'),
                amount: this.state.payPricipal
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS' || resdata.status == 'Success') {
                    this.setState({ showLoader: false })
                    console.log(resdata);
                    const brkdownlist = resdata.msgdata
                    console.log(brkdownlist)
                    // $("#modal12").click()
                    // $("#mdetailsmodal").modal('hide');
                    this.setState({
                        interestoutstanding: brkdownlist.interestoutstanding,
                        b2lchargesoutstanding: brkdownlist.b2lchargesoutstanding,
                        p2pfeeschargesoutstanding: brkdownlist.p2pfeeschargesoutstanding,
                        prpp: brkdownlist.prpp,
                        amtpaid: brkdownlist.amtpaid,
                    }, () => {
                        document.getElementById('repayBrkdwncard').style.display = 'block';
                    })
                } else {
                    this.setState({ showLoader: false })
                    $("#mdetailsmodal").modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",

                                onClick: () => {
                                    $("#mdetailsmodal").modal('show');
                                },
                            },
                        ],
                    });
                }
            })
    }
    closebrkdownmodal = () => {
        $("#exampleModalCenter22").modal('hide');
        $("#mdetailsmodal").modal('show');
    }
    clearInput = () => {
        this.setState({
            payPricipal: "",
            payBtn: true
        })
        document.getElementById('repayBrkdwncard').style.display = 'none';
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const { t } = this.props
        const { borrowerLoanLists } = this.state;
        // console.log(selectedLoanDetails)
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F4F7FC" }}>
                {pmType === "pmSystemUser" ?
                    <>{
                        this.state.showLoader && <Loader />
                    }<SystemUserSidebar />
                    </>
                    :
                    <>
                        {
                            this.state.showLoader && <Loader />
                        }
                        <FacilitatorSidebar />
                    </>
                }
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            {pmType === "pmSystemUser" ?
                                <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                    <Link to="/sysUserDashboard">Home</Link> / Loan Monitoring</p>
                                :
                                <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                    <Link to="/facilitatorDashboard">Home</Link> / Loan Monitoring</p>
                            }
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            {pmType === "pmSystemUser" ?
                                <button style={myStyle}>
                                    <Link to="/sysUserDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                        <span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                                :
                                <button style={myStyle}>
                                    <Link to="/facilitatorDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                        <span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                            }
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", marginTop: "-6px", width: "87.8%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div class="row" style={{ marginLeft: "50px", fontWeight: "600", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                        <div className='col-10'>
                            <div className="" style={{ marginLeft: "-15px" }}>Show &nbsp;<input type='number' name="number" value={this.state.perPage} style={{ width: "39px", height: "18px", paddingLleft: "4px", fontWeight: "600", fontSize: "14px" }} onChange={this.perPage} />&nbsp;Entries in a page</div>
                        </div>
                        <div className='col'>
                            {this.state.pdfBtn == true ?
                                <button className='text-white' onClick={() => this.exportPDF()} style={{ marginLeft: "-8px", height: "25px", width: "100px", border: "none", borderRadius: "2px", backgroundColor: "rgba(0,121,190,1)" }}><FaDownload />&nbsp;Export PDF</button>
                                : null}
                        </div>
                    </div>

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-10px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}>
                                            <FaFileAlt />&nbsp; {t('Loan Monitoring')} </a> </li>
                                    </ul>

                                </div>
                            </div>

                            {pmType === "pmSystemUser" ?
                                <>
                                    <div className='row' style={{ marginTop: "-10px" }}>
                                        <div className='col'>
                                            <div className='tab-content'>
                                                <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                                    {this.state.borTxnList == "" ?
                                                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                            <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                                <p>No lists available.</p>
                                                            </div>
                                                        </div> :
                                                        <>
                                                            <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                                <Table responsive>
                                                                    <Thead>
                                                                        <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Loan Account number')}</Th>
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Overdue Amount')}</Th>
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t("Overdue Days")}</Th>
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}></Th>

                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {this.state.borTxnList.map((lists, index) => (
                                                                            <Tr key={index} style={{
                                                                                marginBottom: "-10px", transition: 'none', cursor: 'default',
                                                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                            }}>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{lists.loanaccountno}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>₹ {(lists.amtoverdue).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{lists.daysoverdue}</Td>

                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>

                                                                                    <span className="dropup">

                                                                                        <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                            className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                        &nbsp;
                                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                            <a class="dropdown-item" onClick={this.getBorrowerProfileInfo.bind(this, lists)}>
                                                                                                More Details
                                                                                            </a>
                                                                                        </div>
                                                                                    </span>

                                                                                </Td>

                                                                            </Tr>
                                                                        ))}
                                                                    </Tbody>
                                                                </Table>
                                                                &nbsp;
                                                                {this.state.borTxnList.length >= 1 &&
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
                                    </div></> :
                                <>
                                    <div className='row' style={{ marginTop: "-10px" }}>
                                        <div className='col'>
                                            <div className='tab-content'>
                                                <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                                    {this.state.borTxnList == "" ?
                                                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                            <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                                <p>No lists available.</p>
                                                            </div>
                                                        </div> :
                                                        <>
                                                            <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                                <Table responsive>
                                                                    <Thead>
                                                                        <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Loan Account number')}</Th>
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Product ID')}</Th>
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t('Loan Amount')}</Th>
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t('Overdue Amount')}</Th>
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t("Overdue Days")}</Th>
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}></Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {this.state.borTxnList.map((lists, index) => (
                                                                            <Tr key={index} style={{
                                                                                marginBottom: "-10px", color: "rgba(5,54,82,1)", transition: 'none', cursor: 'default',
                                                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                            }}>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{lists.loanaccountno}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{lists.productid}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(lists.loanamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(lists.amtoverdue).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>{lists.daysoverdue}</Td>

                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>

                                                                                    <span className="dropup">

                                                                                        <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                            className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                        &nbsp;
                                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                            <a class="dropdown-item" onClick={this.getBorrowerProfileInfo.bind(this, lists)}>
                                                                                                More Details
                                                                                            </a>
                                                                                        </div>
                                                                                    </span>

                                                                                </Td>

                                                                            </Tr>
                                                                        ))}
                                                                    </Tbody>
                                                                </Table>
                                                                &nbsp;
                                                                {this.state.borTxnList.length >= 1 &&
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
                                </>}

                        </div>
                    </div>
                </div>
                {/* Modal More Details */}

                <button id='mdetails' style={{ display: "none", marginLeft: "67%" }} type="button" class="btn btn-info" data-toggle="modal" data-target=".bd-example-modal-lg">
                    Borrower Details
                </button>
                <div class="modal fade bd-example-modal-lg" id="mdetailsmodal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className='row'>
                                    <div className='col'>
                                        <p style={{ color: "rgba(5,54,82,1)" }}><FaRegFileAlt style={{ fontSize: "20px" }} />Details</p>
                                        <hr style={{ width: "70px", marginTop: "-10px" }} />

                                        <p style={{ color: "rgba(5,54,82,1)", fontSize: "14px", marginTop: "-10px" }}><span className="font-weight-bold">Borrower Details</span></p>
                                        <div className='card' style={{ cursor: "default", marginTop: "-10px" }}>

                                            <div className='row p-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <div className='row'>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Borrower Name</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0">{this.state.name}</p>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <div className='row'>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Gender</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0">{this.state.gender == "M" ? "Male" : <span>{this.state.gender == "F" ? "Female" : "Other"}</span>}</p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>


                                        {/* Updated */}
                                        <p className="font-weight-bold" style={{ color: "rgba(5,54,82,1)", fontSize: "14px", marginTop: "-10px" }}>Loan Details</p>
                                        <div className='card border-0' style={{ cursor: "default", marginTop: "-10px" }}>
                                            <div style={{ border: "1px solid rgb(0, 121, 191)", borderRadius: "5px" }}>
                                                <div className='row p-2'>
                                                    {Object.keys(borrowerLoanLists)
                                                        .filter(key =>
                                                            (key === "loanaccountno" ||
                                                                key === "productid" ||
                                                                key === "loandisbursementdate" ||
                                                                key === "interestrate" ||
                                                                key === "loanoutstanding" ||
                                                                key === "emiamt" ||
                                                                key === "loanamt" ||
                                                                key === "amtoverdue" ||
                                                                key === "daysoverdue" ||
                                                                key === "tenure" ||
                                                                key === "lastpaidon" ||
                                                                key === "totloanrepaid" ||
                                                                key === "currentloanlimit" ||
                                                                key === "principalrepaid" ||
                                                                key === "repaymentfrequencydesc" ||
                                                                key === "p2pfeeschargesoutstanding" ||
                                                                key === "p2pfeeschargescharged") &&
                                                            borrowerLoanLists[key] !== ""
                                                        )
                                                        .map((key, index) => {
                                                            let value = borrowerLoanLists[key];
                                                            if (key === "loandisbursementdate" && value) {
                                                                value = value.split("-").reverse().join("-")
                                                            }
                                                            if (key === "loanoutstanding" && value) {
                                                                value = `₹ ${parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                                                            }
                                                            if (key === "emiamt" && value) {
                                                                value = `₹ ${parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                                                            }
                                                            if (key === "loanamt" && value) {
                                                                value = `₹ ${parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                                                            }
                                                            if (key === "principalrepaid" && value) {
                                                                value = `₹ ${parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                                                            }
                                                            if (key === "totloanrepaid" && value) {
                                                                value = `₹ ${parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                                                            }
                                                            if (key === "amtoverdue" && value) {
                                                                value = `₹ ${parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                                                            }
                                                            if (key === "currentloanlimit" && value) {
                                                                value = `₹ ${parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                                                            }
                                                            if (key === "interestrate" && value) {
                                                                value = `${value * 100} % P.A.`;
                                                            }
                                                            if (key === "tenure") {
                                                                return null; // Skip 'tenure' because we'll handle it together with 'repaymentfrequencydesc' as two keys cannot be same at a time

                                                            }
                                                            if (key === "repaymentfrequencydesc") {
                                                                return (
                                                                    <div className='col-lg-6 col-sm-12' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }} key={index}>
                                                                        <div className='row'>
                                                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>
                                                                                    Tenure
                                                                                </p>
                                                                            </div>
                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                            </div>
                                                                            <div className='col-sm-6 col-md-6 col-lg-4'>
                                                                                <p className="mb-0">{borrowerLoanLists["tenure"]} {borrowerLoanLists["repaymentfrequencydesc"]}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            return (
                                                                <div className='col-lg-6 col-sm-12' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }} key={index}>
                                                                    <div className='row'>
                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                            <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>
                                                                                {key === "loanaccountno" ? "Loan Account Number" :
                                                                                    key === "productid" ? "Product ID" :
                                                                                        key === "loandisbursementdate" ? "Loan Disbursement Date" :
                                                                                            key === "interestrate" ? "Interest Rate" :
                                                                                                key === "loanoutstanding" ? "Loan Outstanding" :
                                                                                                    key === "emiamt" ? "EMI Amount" :
                                                                                                        key === "loanamt" ? "Loan Amount" :
                                                                                                            key === "amtoverdue" ? "Overdue Amount" :
                                                                                                                key === "daysoverdue" ? "Overdue Days" :
                                                                                                                    key === "lastpaidon" ? "Last Paid On" :
                                                                                                                        key === "totloanrepaid" ? "Total Loan Repaid" :
                                                                                                                            key === "currentloanlimit" ? "Current Loan Limit" :
                                                                                                                                key === "principalrepaid" ? "Principal Repaid" :
                                                                                                                                    key === "p2pfeeschargesoutstanding" ? "P2P Fees Charges Outstanding" :
                                                                                                                                        key === "p2pfeeschargescharged" ? "P2P Fees Charges Charged" : key}
                                                                            </p>
                                                                        </div>
                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                        </div>
                                                                        <div className='col-sm-6 col-md-6 col-lg-4'>
                                                                            <p className="mb-0">{value}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        </div>
                                        <div id="repayBrkdwncard" style={{ display: "none" }}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontSize: "14px", marginTop: "-10px" }}><span className="font-weight-bold">Repayment Breakdown</span></p>
                                            <div className='card' style={{ cursor: "default", marginTop: "-10px" }}>
                                                <div className='row p-2'>
                                                    <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        {this.state.interestoutstanding !== "" &&
                                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <div className='col-sm-5 col-md-5 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Interest Outstanding</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">₹ {parseFloat(this.state.interestoutstanding).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div>
                                                            </div>}
                                                        {this.state.b2lchargesoutstanding !== "" &&
                                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <div className='col-sm-5 col-md-5 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">B2L Charges Outstanding</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">₹ {parseFloat(this.state.b2lchargesoutstanding).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div>
                                                            </div>}
                                                        {this.state.p2pfeeschargesoutstanding !== "" &&
                                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <div className='col-sm-5 col-md-5 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">P2P Fee Charges Outstanding</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">₹ {parseFloat(this.state.p2pfeeschargesoutstanding).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div>
                                                            </div>}
                                                    </div>
                                                    <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        {this.state.prpp !== "" &&
                                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <div className='col-sm-5 col-md-5 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Principal Paid</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">₹ {parseFloat(this.state.prpp).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div>
                                                            </div>}
                                                        {this.state.amtpaid !== "" &&
                                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <div className='col-sm-5 col-md-5 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Amount Paid</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">₹ {parseFloat(this.state.amtpaid).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div>
                                                            </div>}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row '>
                                            <div className='col' style={{ textAlign: "center" }}>
                                                <input type="number" className="w-40 invest_amount" placeholder={t('Enteramount')} value={this.state.payPricipal} onChange={this.payPrincipal} />&nbsp;
                                                <button className="btn btn-sm" disabled={this.state.payBtn} style={{ backgroundColor: "rgb(0, 121, 191)", color: "white", marginTop: "-5px" }} onClick={this.payEmi}><FaMoneyBill />&nbsp;{t('Pay')}</button>&nbsp;

                                                <button type="button" disabled={this.state.payBtn} class="btn btn-sm" style={{ backgroundColor: "rgb(0, 121, 191)", color: "white", marginTop: "-5px", }} onClick={this.repaybrkdown}>Repayment Breakdown</button>
                                                <button type="button" class="btn btn-sm" style={{ backgroundColor: "rgb(0, 121, 191)", color: "white", marginTop: "-5px", marginLeft: "5px" }} onClick={this.clearInput} data-dismiss="modal">Close</button>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" id='modal12' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter22">
                    Repayment Breakdown Modal
                </button>
                <div class="modal fade" id="exampleModalCenter22" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-body">
                                <div className='row'>
                                    <div className='col'>
                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Repayment Breakdown Details</p>
                                        <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                        {this.state.interestoutstanding !== "" &&
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-6'>
                                                    <p className="mb-0 font-weight-bold">Interest Outstanding</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    <p className="mb-0">
                                                        ₹  {parseFloat(this.state.interestoutstanding).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
                                                </div>
                                            </div>}
                                        {this.state.b2lchargesoutstanding !== "" &&
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-6'>
                                                    <p className="mb-0 font-weight-bold">B2L Charges Outstanding</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    <p className="mb-0">
                                                        ₹  {parseFloat(this.state.b2lchargesoutstanding).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
                                                </div>
                                            </div>}
                                        {this.state.p2pfeeschargesoutstanding !== "" &&
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-6'>
                                                    <p className="mb-0 font-weight-bold">P2P Fee Charges Outstanding</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    <p className="mb-0">
                                                        ₹  {parseFloat(this.state.p2pfeeschargesoutstanding).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
                                                </div>
                                            </div>}
                                        {this.state.prpp !== "" &&
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-6'>
                                                    <p className="mb-0 font-weight-bold">Principal Paid</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    <p className="mb-0">
                                                        ₹  {parseFloat(this.state.prpp).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
                                                </div>
                                            </div>}
                                        {this.state.amtpaid !== "" &&
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-6'>
                                                    <p className="mb-0 font-weight-bold">Amount Paid</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    <p className="mb-0">₹ {parseFloat(this.state.amtpaid).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} </p>
                                                </div>
                                            </div>}
                                        <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col' style={{ textAlign: "center" }}>
                                        <button type="button" class="btn text-white btn-sm" onClick={this.closebrkdownmodal} style={{ backgroundColor: "rgb(136, 189, 72)" }} >Okay</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
export default withTranslation()(LoanMonitoring)
