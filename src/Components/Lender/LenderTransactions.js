import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import $ from 'jquery';
import './LenderTransaction.css'
import jsPDF from "jspdf";
import "jspdf-autotable";
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaExclamationCircle, FaCaretSquareRight, FaCaretSquareLeft, FaFileAlt, FaDownload, FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css';
import openIt from '../assets/AdminImg/openit.png';
import logo2 from '../assets/IFPL.jpg';
import { confirmAlert } from "react-confirm-alert";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

//updated
var inptPageNO = "1";

var fromDate = "";
var toDate = ""
class LenderTransactions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lenderid: "",
            fromdate: "",
            todate: "",
            lenTxnList: [],
            dtoday: "",
            dfrday: "",
            pdfBtn: false,

            offset: 0,
            perPage: 10,
            currentPage: 0,
            pageCount: "",
            inptPageNo: "1",
            error: "",

            lndTxnforPDF: [],
            lendertxnList: [],
            indextotpageno: "",
            indexcurrentpageno: "",
            totalRecords: "",
            arrowFlag1: false,
            arrowFlag2: false,
        }
        this.fromdate = this.fromdate.bind(this);
        this.todate = this.todate.bind(this);
        // this.LenderTxn = this.LenderTxn.bind(this);
        this.pdfBtnEnable = this.pdfBtnEnable.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            console.log(sessionStorage.getItem('token'));
            console.log(sessionStorage.getItem('userID'));
            this.loadDate();
        } else {
            window.location = '/login'
        }

    }
    perPage = (event) => {
        // this.setState({ perPage: event.target.value })
        this.lenderTxn()
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
            lendertxnList: slice
        })
    }
    fromdate = (event) => {
        // this.setState({ fromdate: event.target.value })
        console.log(event.target.value)
        const selectedFromDate = event.target.value;
        const selectedToDate = this.state.todate;

        if (this.isDifferenceWithinSixMonths(selectedFromDate, selectedToDate)) {
            fromDate = selectedFromDate;
            this.setState({ fromdate: selectedFromDate, error: '' });
            $("#txnBtn").prop('disabled', false);
        } else {
            fromDate = selectedFromDate;
            this.setState({
                fromdate: selectedFromDate,
                error: "Date ranges should not exceed 6 months.",
            });
            $("#txnBtn").prop('disabled', true);
        }
    }
    todate = (event) => {
        // this.setState({ todate: event.target.value })
        const selectedFromDate = this.state.fromdate;
        const selectedToDate = event.target.value;

        if (this.isDifferenceWithinSixMonths(selectedFromDate, selectedToDate)) {
            toDate = selectedToDate;
            this.setState({ todate: selectedToDate, error: '' });
            $("#txnBtn").prop('disabled', false);
        } else {
            toDate = selectedToDate;
            this.setState({
                todate: selectedToDate,
                error: "Date ranges should not exceed 6 months.",
            });
            $("#txnBtn").prop('disabled', true);

        }
    }

    isDifferenceWithinSixMonths = (fromDate, toDate) => {
        const sixMonthsInMilliseconds = 6 * 30 * 24 * 60 * 60 * 1000; // Approximate

        const difference = new Date(toDate) - new Date(fromDate);

        return difference <= sixMonthsInMilliseconds;
    };
    handleLeftArrowClick = () => {
        // Ensure inptPageNo doesn't go below 0
        if (this.state.inptPageNo > 0) {
            this.setState(prevState => {
                this.state.arrowFlag2 = true;
                const incrementedPageNo = parseInt(prevState.inptPageNo, 10) - 1;
                return { inptPageNo: incrementedPageNo.toString() };
            }, () => {
                console.log(this.state.inptPageNo);
                inptPageNO = this.state.inptPageNo;
                this.lenderTxn();
            });
        }
    }

    handleRightArrowClick = () => {
        this.setState(prevState => {
            this.state.arrowFlag1 = true;
            const incrementedPageNo = parseInt(prevState.inptPageNo, 10) + 1;
            return { inptPageNo: incrementedPageNo.toString() };
        }, () => {
            console.log(this.state.inptPageNo);
            inptPageNO = this.state.inptPageNo;
            this.lenderTxn();
        });

    }

    loadDate = () => {
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
        fromDate = frday;
        toDate = today;
        console.log(fromDate, toDate)


        this.lenderTxn()
    }
    lenderTxn = () => {
        console.log(fromDate, toDate)

        var Result = JSON.stringify({
            fromdate: fromDate.split(' ')[0],
            todate: toDate.split(' ')[0],
            indexpageno: inptPageNO,
            lenderid: sessionStorage.getItem('userID')
        })

        fetch(BASEURL + '/lms/getlenderrtxn', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: Result
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata);

                    this.setState({
                        indextotpageno: resdata.msgdata.totalpageno,
                        indexcurrentpageno: resdata.msgdata.currentpage,
                        lendertxnList: resdata.msgdata.lendertxndetails,
                        totalRecords: resdata.msgdata.totalrecords
                    })
                    var data = resdata.msgdata.lendertxndetails;
                    if (data) {
                        data.sort((a, b) => {
                            return new Date(b.txndate).getTime() - new Date(a.txndate).getTime()
                        })
                        console.log(data);
                        var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                        console.log(slice)

                        this.setState({
                            pageCount: Math.ceil(data.length / this.state.perPage),
                            orgtableData: data,
                            lendertxnList: slice
                        })
                    }
                } else {
                    if (this.state.arrowFlag1 === true) {
                        this.setState(prevState => ({
                            inptPageNo: parseInt(prevState.inptPageNo, 10) - 1,
                            arrowFlag1: false
                        }));
                    }
                    else if (this.state.arrowFlag2 === true) {
                        this.setState(prevState => ({
                            inptPageNo: parseInt(prevState.inptPageNo, 10) + 1,
                            arrowFlag2: false
                        }));
                    }

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
    pdfBtnEnable(event) {
        // const pdfBtn = !this.state.pdfBtn;
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
            const secondTitle = "Lender Transaction";
            const heading1 = "Name: " + sessionStorage.getItem('Lname') + `(${sessionStorage.getItem('userID')})`;
            const heading2 = "Date : From " + this.state.fromdate + " To " + this.state.todate;
            const title2 = secondTitle + '\n' + heading1 + '\n' + heading2;
            doc.setFontSize(13);
            doc.text(title2, marginLeft, secondTitleY);

            // Rest of the content, e.g., autoTable code
            const headers = [["Event", "Transaction Reference", "Txn Amt.", "Txn Date"]];
            const data = this.state.lndTxnforPDF.map(list => [list.event, list.txnref, list.txnamt, list.txndate]);
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

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
        const { t } = this.props;
        const myStyle = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-10px", backgroundColor: "#f4f7fc" }}>
                <LenderSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-lg-1 col-md-4 col-sm-4">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-lg-4' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/lenderdashboard">Home</Link> /My Transactions Details</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/lenderdashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <hr className="col-11" style={{ marginTop: "-1px", marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{ overflow: "auto", cursor: "default" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}>
                                            <FaFileAlt />&nbsp; {t('My Transactions Details')} </a> </li>
                                    </ul>
                                </div>
                            </div>
                            {/* Select Date */}
                            <div className='row' >
                                <div className='col-lg-3 col-md-3 col-sm-4 col-6 Fdate'>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('From Date *')}</p>

                                    <input className="form-control"
                                        defaultValue={this.state.dfrday}
                                        type='date'
                                        onChange={this.fromdate}
                                        style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            height: "34px",
                                            fontSize: "14px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px",
                                            // width: "160px",
                                        }} />
                                </div>
                                &nbsp;
                                <div className='col-lg-3 col-md-3 col-sm-4 col-6 Fdate' style={{ fontSize: "14px" }}>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('To Date *')}</p>

                                    <input className="form-control"
                                        defaultValue={this.state.dtoday}
                                        type='date'
                                        onChange={this.todate}
                                        style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            height: "34px",
                                            fontSize: "14px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px",
                                            // width: "160px",
                                        }} />
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6 Fdate" style={{ paddingTop: '23px' }}>
                                    <button type="button" className="btn btn-sm text-white" style={{
                                        backgroundColor: "rgb(0, 121, 191)",
                                        paddingTop: "6px", paddingBottom: "6px",
                                        paddingLeft: "47px", paddingRight: "47px"
                                    }}
                                        id='txnBtn'
                                        onClick={this.lenderTxn}>{t('Apply')}</button>
                                </div>
                            </div>
                            {this.state.error &&
                                <div className="row" >
                                    <div className="col">
                                        <p style={{ fontSize: "14px", marginLeft: "0px", color: 'red' }}><FaExclamationCircle />{this.state.error}</p>
                                    </div>
                                </div>
                            }
                            <div class="row" style={{ fontWeight: "600", fontSize: "12px", color: "rgba(5,54,82,1)" }}>
                                {/* <div class="pt-2 pb-3 pr-1">Show</div>
                                <div class="pt-2 pb-2">
                                    <select onChange={this.perPage} style={{ fontSize: "12px" }}>
                                        <option defaultValue="20">20</option>
                                        <option value="30">30</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                                <div class="pt-2 pb-3 pl-1 pr-4">Entries in a page</div> */}
                                <div className='col-lg-3'>
                                    <p style={{ paddingTop: "10px" }}>Current Page Number: <span style={{ fontWeight: "400" }}>{this.state.indexcurrentpageno}</span>
                                    </p>
                                </div>
                                <div className='col-lg-3'>
                                    <p style={{ paddingTop: "10px" }}>Total Records: <span style={{ fontWeight: "400" }}>{this.state.totalRecords}</span></p>
                                </div>
                                <div className='col-lg-3'>

                                </div>

                                <div className='col-3' style={{ textAlign: "end" }}>
                                    <FaCaretSquareLeft id='squareLeft' onClick={this.handleLeftArrowClick} />&nbsp;<span style={{ color: "rgb(40, 116, 166)" }}>{this.state.inptPageNo}</span>&nbsp;<FaCaretSquareRight id='squareRight' onClick={this.handleRightArrowClick} />
                                </div>
                            </div>
                            <div className='row' style={{ marginTop: "" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.lendertxnList == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No lists available.</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div style={{ whiteSpace: "nowrap" }} id=''>
                                                        <Table responsive>
                                                            <Thead>
                                                                <Tr style={{ fontSize: "14px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Date&Time')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('TransactionReference')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('TransactionType')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "end" }}>{t('Amount')}</Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {
                                                                    this.state.lendertxnList.map((loans, index) => {
                                                                        return (
                                                                            <Tr key={index} style={{ marginBottom: "-10px", color: "rgba(5,54,82,1)", transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                                {loans.txndate &&
                                                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>
                                                                                        {
                                                                                            (() => {
                                                                                                const date = new Date(loans.txndate);
                                                                                                // Format the date to DD-MM-YYYY
                                                                                                const formattedDate = date.toLocaleDateString('en-GB'); // 'en-GB' formats as DD/MM/YYYY
                                                                                                return formattedDate.replace(/\//g, '-'); // Replace '/' with '-'
                                                                                            })()
                                                                                        }
                                                                                    </Td>
                                                                                }
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>{loans.txnref == "null" ? "-" : loans.txnref}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>{loans.event}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px", textAlign: "end" }}>₹ {parseFloat(loans.txnamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}></Td>
                                                                            </Tr>
                                                                        )
                                                                    })
                                                                }
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.lendertxnList.length > 1 &&
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
            </div>
        )
    }
}

export default withTranslation()(LenderTransactions)