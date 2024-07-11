import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import { Link } from 'react-router-dom';
import BorrowerSidebar from '../../SidebarFiles/BorrowerSidebar';
import $ from 'jquery';
import './BorrowerTransactions.css';
// import './BorrowerTransections.css';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { withTranslation } from 'react-i18next';
import { FaFileAlt, FaExclamationCircle, FaAngleDoubleDown, FaDownload, FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';
import './Pagination.css'
import Loader from '../Loader/Loader';
import logo2 from '../assets/IFPL.jpg';
import { confirmAlert } from "react-confirm-alert";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

class BorrowerTransactions extends Component {

    constructor(props) {
        super(props)

        this.state = {
            borrowerid: "",
            fromdate: "",
            todate: "",
            borTxnList: [],
            dtoday: "",
            dfrday: "",
            pdfBtn: false,

            offset: 0,
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",
            showLoader: false,

            borTxnforPDF: []
        }
        this.fromdate = this.fromdate.bind(this);
        this.todate = this.todate.bind(this);
        this.borrowerTxn = this.borrowerTxn.bind(this);
        this.pdfBtnEnable = this.pdfBtnEnable.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.setState({ showLoader: true })
            console.log(sessionStorage.getItem('token'));
            console.log(sessionStorage.getItem('userID'));
            this.loadDate();
            this.borrowerTList()
        } else {
            window.location = '/login'
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
    borrowerTList = (event) => {
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

        fetch(BASEURL + '/lsp/getborrowertxn', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                borrowerid: sessionStorage.getItem('userID'),
                fromdate: frday,
                todate: today
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status.toLowerCase() === ('success')) {
                    this.setState({ showLoader: false })
                    this.setState({ borTxnList: resdata.msgdata })

                    //For pdf docu
                    this.setState({ borTxnforPDF: resdata.msgdata })
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
                } else {
                    this.setState({ showLoader: false })
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
    }

    borrowerTxn(event) {
        fetch(BASEURL + '/lsp/getborrowertxn', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                borrowerid: sessionStorage.getItem('userID'),
                fromdate: this.state.fromdate,
                todate: this.state.todate
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status.toLowerCase() === ('success')) {
                    this.setState({ showLoader: false })
                    this.setState({ borTxnList: resdata.msgdata })
                    //For pdf docu
                    this.setState({ borTxnforPDF: resdata.msgdata })
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
                } else {
                    alert("Issue: " + resdata.message);
                }
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
            const secondTitle = "Borrower Transaction";
            const heading1 = "Name: " + sessionStorage.getItem('Bname') + `(${sessionStorage.getItem('userID')})`;
            const heading2 = "Date : From " + this.state.fromdate + " To " + this.state.todate;
            const title2 = secondTitle + '\n' + heading1 + '\n' + heading2;
            doc.setFontSize(13);
            doc.text(title2, marginLeft, secondTitleY);

            // Rest of the content, e.g., autoTable code
            const headers = [["Transaction Type", "Transaction Reference", "Txn Amt.", "Txn Date"]];
            const data = this.state.borTxnforPDF.map(list => [list.event, list.txnref, list.txnamt, list.txndate]);
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
            doc.save("BorrowerTransaction.pdf");
        };




        // const headers = [["Date & Time", "Transaction Reference", "Transaction Type", "Amount"]];

        // const data = this.state.borTxnList.map(list => [list.txndate, list.txnref, list.event, list.txnamt]);
        // const headers = [["Transaction Type", "Transaction Reference", "TXN Amt", "TXN Date"]];
        // const data = this.state.borTxnList.map(list => [list.event, list.txnref, list.txnamt, list.txndate]);

        // let content = {
        //     startY: 100,
        //     head: headers,
        //     body: data

        // };

        // Add the logo to the PDF document
        // const logoWidth = 20;
        // const logoHeight = 20;
        // doc.addImage(logo, 'PNG', marginLeft, 10, logoWidth, logoHeight);

        // doc.text(title, marginLeft + logoWidth + 10, 40);
        // doc.autoTable(content);
        // doc.save("report.pdf");

        // doc.addImage(logo, 'PNG',marginLeft, 1, 20, 20,2)
        // doc.text(title, marginLeft, 40);
        // doc.autoTable(content);
        // doc.save("report.pdf")
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F4F7FC" }}>
                <BorrowerSidebar />
                <div className="main-content " id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' style={{ marginLeft: "40px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/borrowerdashboard">Home</Link> / Borrower Transactions</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/borrowerdashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    {/* <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold" }}>{t('Borrower Transactions Details')}</p>
                        </div>
                    </div> */}
                    {/* Select Date */}
                    {/* <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-md-3 col-sm-6 col-lg-3'>
                            <label htmlFor="date" className="label" style={{ fontFamily: "Poppins,sans-serif", fontSize: "14px", marginLeft: "0px", color: "rgba(5,54,82,1)" }}>{t('From Date *')}</label><br />
                            <input id="Fdate" type="date"
                                defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    width: "240px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px"
                                }} />
                        </div>
                        <div className='col-md-3 col-sm-6 col-lg-3' style={{ fontSize: "15px" }}>
                            <label htmlFor="date" className="label" style={{ fontFamily: "Poppins,sans-serif", fontSize: "14px", marginLeft: "0px", color: "rgba(5,54,82,1)" }}>{t('To Date *')}</label><br />
                            <input id="Tdate" type="date"
                                defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    width: "240px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    marginTop: "3px",
                                    paddingLeft: "10px"
                                }} />
                        </div>
                        <div className='col-md-3 col-sm-6 col-lg-2' style={{ paddingTop: '30px' }}>
                            <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: "rgba(0,121,190,1)", width: "100px", }} onClick={this.borrowerTxn}>{t('Apply')}</button>
                        </div>
                        <div className="col-md-3 col-sm-6 col-lg-2" style={{ paddingTop: '30px' }}>
                            {this.state.pdfBtn == true ?
                                <button className="btn btn-sm btn-success float-right"
                                    // style={{ marginRight: "50px" }}
                                    onClick={() => this.exportPDF()}><FaDownload />&nbsp;{t('ExporttoPDF')}</button>
                                : null}
                        </div>
                    </div>
                    <div class="d-flex flex-row" style={{ marginLeft: "50px", fontWeight: "600", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                        <div class="pt-2 pb-3 pr-1">Show</div>
                        <div class="pt-2 pb-2"><input type='number' name="number" value={this.state.perPage} style={{ width: "39px", height: "18px", paddingLleft: "4px", fontWeight: "600", fontSize: "14px" }} onChange={this.perPage} /></div>
                        <div class="pt-2 pb-3 pl-1">Entries in a page</div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px" }} />

                    <div className='row pl-4 font-weight-normal' style={{ marginLeft: "15px", width: "96%", fontSize: "15px", color: "rgba(5,54,82,1)" }}>
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
                                                <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Date&Time')}</Th>
                                                <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Transaction Reference')}</Th>
                                                <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t("TransactionType")}</Th>
                                                <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t("Amount")}</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {this.state.borTxnList.map((loans, index) => (
                                                <Tr key={index} style={{
                                                    color: "rgba(5,54,82,1)",
                                                    marginBottom: "-10px", transition: 'none', cursor: 'default',
                                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                }}>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{loans.txndate.split("-").reverse().join("-")}</Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{loans.txnref}</Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{loans.event}</Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>
                                                        ₹{parseFloat(loans.txnamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                    &nbsp;
                                    {this.state.borTxnList.length > 0 &&
                                        <div className="row float-right">
                                            <div className='card border-0'>
                                                <ReactPaginate
                                                    previousLabel={"<"}
                                                    nextLabel={">"}
                                                    breakLabel={"..."}
                                                    breakClassName={"break-me"}
                                                    pageCount={this.state.pageCount}
                                                    // marginPagesDisplayed={1}
                                                    // pageRangeDisplayed={5}
                                                    onPageChange={this.handlePageClick}
                                                    containerClassName={"pagination"}
                                                    subContainerClassName={"pages pagination"}
                                                    activeClassName={"active"}
                                                />
                                            </div>
                                        </div>}
                                </div>
                            </>}
                    </div> */}

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}>
                                            <FaFileAlt />&nbsp; {t('Borrower Transactions Details')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            {/* Select Date */}
                            <div className='row' style={{marginTop:"-10px"}} >
                                <div className='col-lg-3 col-md-3 col-sm-4 col-6 Fdate'>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('From Date *')}</p>

                                    <input id="Fdate" type="date"className="form-control"
                                        defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            width: "240px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px"
                                        }} />
                                </div>
                                &nbsp;
                                <div className='col-lg-3 col-md-3 col-sm-4 col-6 Fdate' style={{ fontSize: "15px" }}>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('To Date *')}</p>

                                    <input id="Tdate" type="date"className="form-control"
                                        defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            width: "240px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px"
                                        }} />
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6 Fdate" style={{ paddingTop: '25px' }}>
                                    <button type="button" className="btn btn-sm text-white" style={{
                                        backgroundColor: "rgb(0, 121, 191)",
                                        paddingTop: "6px", paddingBottom: "6px",
                                        paddingLeft: "47px", paddingRight: "47px"
                                    }}
                                        id='txnBtn'
                                        onClick={this.borrowerTxn}>{t('Apply')}</button>
                                </div>
                                <div className="col-md-3 col-sm-6 col-lg-2" style={{ paddingTop: '25px' }}>
                                    {this.state.pdfBtn == true ?
                                        <button className="btn btn-sm btn-success"
                                            style={{  paddingTop: "6px", paddingBottom: "6px",
                                                paddingLeft: "20px", paddingRight: "20px" }}
                                            onClick={() => this.exportPDF()}><FaDownload />&nbsp;{t('ExporttoPDF')}</button>
                                        : null}
                                </div>
                            </div>
                            {this.state.error &&
                                <div className="row" >
                                    <div className="col">
                                        <p style={{ fontSize: "14px", marginLeft: "0px", color: 'red' }}><FaExclamationCircle />{this.state.error}</p>
                                    </div>
                                </div>
                            }

                            <div className='row' style={{ marginTop: "5px" }}>
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
                                                    <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll1'>
                                                        <Table responsive>
                                                            <Thead>
                                                                <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Date&Time')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('TransactionReference')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('TransactionType')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Amount')}</Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {
                                                                    this.state.borTxnList.map((loans, index) => {
                                                                        return (
                                                                            <Tr key={index} style={{ marginBottom: "-10px", transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>

                                                                                <Td style={{ fontSize: "15px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>{loans.txndate.split("-").reverse().join("-")}
                                                                                </Td>

                                                                                <Td style={{ fontSize: "15px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>{loans.txnref == "null" ? "-" : loans.txnref}</Td>
                                                                                <Td style={{ fontSize: "15px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>{loans.event}</Td>
                                                                                <Td style={{ fontSize: "15px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>₹ {parseFloat(loans.txnamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                            </Tr>
                                                                        )
                                                                    })
                                                                }
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.borTxnList.length > 0 &&
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

                </div>
            </div >
        )
    }
}

export default withTranslation()(BorrowerTransactions)