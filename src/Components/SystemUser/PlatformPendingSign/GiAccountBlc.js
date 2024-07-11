import React, { Component } from "react";
import $ from "jquery";
import { BASEURL } from "../../assets/baseURL";
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from "react-i18next";
import { FaEllipsisV, FaAngleLeft, FaDownload } from "react-icons/fa";
import { BsArrowRepeat } from "react-icons/bs";
import dashboardIcon from '../../assets/icon_dashboard.png'
import { Link } from 'react-router-dom';
import accept from '../../assets/accept.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo2 from '../../assets/IFPL.jpg';
import batch from '../../assets/batch.png';
import openIt from '../../assets/AdminImg/openit.png';
import Tooltip from "@material-ui/core/Tooltip";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
var presentYear;
export class GiAccountBlc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reqNos: [],
            acceptReqs: "",
            utype: "",
            reqNo: "",
            memmid: "",
            pos: "",

            offset: 0,
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",
            pdfBtn: false,

            monthMasterList: [],
            finyear: "",
            accHead: "",
            filterFinYear: ""
        };
    }
    componentDidMount() {
        this.getCurrentYearRange();
        $("#resetGlAccBtn").prop('disabled', true);
    }
    getCurrentYearRange = () => {
        const currentYear = new Date().getFullYear();
        const nextYear = (currentYear + 1).toString().slice(-2);
        var resultDate = `${currentYear}-${nextYear}`;
        presentYear = resultDate;
        this.setState({ filterFinYear: resultDate }, () => {
            this.getP2PGlAccountBalances()
        })
        return `${currentYear}-${nextYear}`;
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
            reqNos: slice
        })
    }
    getP2PGlAccountBalances = () => {
        fetch(BASEURL + "/usrmgmt/getp2pglaccountbalances?finyear=" + this.state.filterFinYear, {
            method: "Get",
            headers: {
                'Accept': "application/json",
                "Content-Type": "application/json",
                'Authorization': "Bearer " + sessionStorage.getItem("token"),
            },
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status == "success") {
                    console.log(resdata);

                    var list = resdata.msgdata;
                    console.log(resdata.msgdata)
                    // this.setState({ uploadedOVDLists: resdata.msgdata })
                    console.log(list)
                    list.sort((a, b) => {
                        return new Date(b.createdon).getTime() - new Date(a.createdon).getTime()
                    })
                    console.log(list);
                    this.setState({ reqNos: list })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        reqNos: slice
                    })
                    this.pdfBtnEnable();
                    this.getMonthMasterData();
                } else {
                    //alert("Issue: " + resdata.message);
                }
            });
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
            const secondTitle = "GL Account Balance";
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
            const reqNos = this.state.reqNos;

            // Define your headers
            const headers2 = [
                "Glam ID",
                "GL Code",
                "Account Head",
                "Credit Balance",
                "Debit Balance",
                "Net Balance"
            ];

            // Create an array to hold the CSV rows
            let csvRows = [];

            // Push the headers as the first row
            csvRows.push(headers2.join(','));

            // Iterate through your data and format each row
            reqNos.forEach(list => {
                const formattedRow = [
                    list.glamid,
                    list.glcode,
                    `"${list.accounthead}"`,
                    `"${parseFloat(list.crbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}"`,
                    `"${parseFloat(list.drbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}"`,
                    `"${parseFloat(list.netbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}"`,
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
            link.download = 'gl_account_data.csv';

            // Append the link to the DOM and trigger the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }

    viewMoreDetails = () => {
        $("#resetGlAccModal").click()
        this.getMonthMasterData()
    }
    filterFinYear = (event) => {
        this.setState({ filterFinYear: event.target.value }, () => {
            this.getP2PGlAccountBalances()
        })
    }
    finyear = (event) => {
        this.setState({ finyear: event.target.value })
        $("#resetGlAccBtn").prop('disabled', false);
    }
    getMonthMasterData = () => {
        fetch(BASEURL + '/misreports/getmonthmasterdata', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    this.setState({
                        monthMasterList: resdata.msgdata
                    })
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

                    }
                }
            })
    }
    resetGLAccountBalance = () => {
        fetch(BASEURL + '/lms/resetglaccountbalances?finyear=' + this.state.finyear, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success' || resdata.status === "SUCCESS") {
                    $("#exampleModalCenter29").modal('hide')
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    $("#exampleModalCenter29").modal('show')
                                }
                            }
                        ],
                        closeOnClickOutside: false,
                    })
                }
                else {
                    $("#exampleModalCenter29").modal('hide')
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                }
                            }
                        ],
                        closeOnClickOutside: false,
                    })
                }
            })
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
        const myStyle2 = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            cursor: "pointer",
            fontSize: "12px",
            // height: "25px",
            width: "185px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            padding: "7px 0px"
        }
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
                <SystemUserSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / GL Account Balance List</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="">
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            &nbsp; {t('GL Account Balance List')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className="row" style={{ marginTop: "-14px" }}>
                                <div className='col-lg-3 col-md-6 col-sm-12 mb-3'>
                                    {this.state.monthMasterList && this.state.monthMasterList.length > 0 &&
                                        <label htmlFor="" style={{ fontSize: "14px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                            {t('Financial Year')} : {presentYear}
                                        </label>
                                    }
                                    {this.state.monthMasterList && this.state.monthMasterList.length > 0 &&
                                        <select id="yearSelect" className='form-select'
                                            defaultValue={this.state.finyear} onChange={this.filterFinYear}
                                            style={{
                                                border: "1px solid rgba(40,116,166,1)",
                                                borderRadius: "5px",
                                                fontSize: "15px",
                                                color: "rgba(40,116,166,1)",
                                                paddingLeft: "10px",
                                                marginTop: "-8px"
                                            }}>
                                            <option value="">Select Year</option>
                                            {this.state.monthMasterList.map(master => (
                                                <option key={master} value={master}>{master}</option>
                                            ))}
                                        </select>
                                    }
                                </div>
                                {this.state.monthMasterList && this.state.monthMasterList.length > 0 &&
                                    <div className='col-lg-9 col-md-6 col-sm-12 mb-3' style={{ textAlign: "end", marginTop: "25px" }}>
                                        <button className="btn btn-sm text-white" onClick={this.viewMoreDetails}
                                            style={{ backgroundColor: "rgb(40, 116, 166)" }}
                                        >
                                            Financial Year Reset &nbsp;<BsArrowRepeat />
                                        </button>
                                        &nbsp;
                                        {this.state.pdfBtn &&
                                            <FaDownload onClick={() => this.exportPDF()}
                                                style={{ color: "darkcyan", cursor: "pointer" }}
                                                title="Export to CSV"
                                            />
                                        }
                                    </div>
                                }
                                {/* <div className='col-lg-1 col-md-12 col-sm-12 mb-3' style={{marginTop:"25px" }}>
                                    
                                </div> */}
                            </div>

                            <div className='row' style={{ marginTop: "5px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.reqNos == "" ?
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Glam ID')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('GL Code')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Account Head')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "end" }}>{t('Credit Balance')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "end" }}>{t('Debit Balance')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "end" }}>{t('Net Balance')}</Th>

                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.reqNos.map((lists, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.glamid}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.glcode}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.accounthead.length > 29 ? (
                                                                            <Tooltip title={lists.accounthead}>
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px", cursor: "pointer" }}>
                                                                                    {lists.accounthead.substring(0, 30) + ".."}
                                                                                </p>
                                                                            </Tooltip>
                                                                        ) : (
                                                                            <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px" }}>
                                                                                {lists.accounthead}
                                                                            </p>
                                                                        )}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "end", }}>{
                                                                            lists.crbalance == "null" ? <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px" }}>₹ 0.00</p> :
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px" }}>₹ {parseFloat(lists.crbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                        }</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "end", }}>{
                                                                            lists.drbalance == "null" ? <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px", marginLeft: "9px" }}>₹ 0.00</p> :
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px", marginLeft: "9px" }}>₹ {parseFloat(lists.drbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                        }</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "end", }}>{
                                                                            lists.netbalance == "null" ? <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px" }}>₹ 0.00</p> :
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px" }}>₹ {parseFloat(lists.netbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                        }</Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.reqNos.length > 1 &&
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


                    {/* <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-20px", marginTop: "0px" }}>
                        <div className='card' style={{ marginTop: "-10px" }}>
                            <div style={{ cursor: "default", color: "#222C70", marginBottom: "20px" }} >
                                <div className='row'>
                                    <div className='col-lg-8 col-md-10 col-sm-12' style={{ textAlign: "end", fontSize: "17px", fontWeight: "500" }}>
                                        <p style={{ marginRight: "33px" }}>GL Account Balance List</p>
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "-14px" }}>
                                    <div className='col-lg-3 col-md-3 col-sm-4'>
                                        {this.state.monthMasterList && this.state.monthMasterList.length > 0 &&
                                            <label htmlFor="" className="" style={{ fontSize: "14px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('Financial Year')} : {presentYear}</label>
                                        }
                                        {this.state.monthMasterList && this.state.monthMasterList.length > 0 ?
                                            <select id="yearSelect" className='form-select'
                                                defaultValue={this.state.finyear} onChange={this.filterFinYear}
                                                style={{
                                                    border: "1px solid rgba(40,116,166,1)",
                                                    borderRadius: "5px",
                                                    fontSize: "15px",
                                                    color: "rgba(40,116,166,1)",
                                                    paddingLeft: "10px",
                                                    marginTop: "-8px"
                                                }}>
                                                <option value="">Select Year</option>
                                                {this.state.monthMasterList.map(master => (
                                                    <option key={master} value={master}>{master}</option>
                                                ))}
                                            </select> : ""}
                                    </div>
                                    {this.state.monthMasterList && this.state.monthMasterList.length > 0 &&
                                        <div className='col-lg-9 col-md-3 col-sm-4' style={{ textAlign: "end" }}>
                                            <button className="btn btn-sm text-white" onClick={this.viewMoreDetails}
                                                style={{ backgroundColor: "rgb(40, 116, 166)", marginBottom: "-52px" }}
                                            >
                                                Financial Year Reset &nbsp;<BsArrowRepeat />
                                            </button>
                                        </div>
                                    }
                                </div>
                                <div className='row' style={{ marginTop: "3px" }}>
                                    <div className='col'>
                                        {this.state.reqNos == "" ?
                                            <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                    <p>No lists available.</p>
                                                </div>
                                            </div> :
                                            <>
                                                <div style={{
                                                    whiteSpace: "nowrap"
                                                }} id='secondAuditScroll'>
                                                    <div className='row font-weight-normal'
                                                        style={{
                                                            fontWeight: "800",
                                                            fontSize: "15px",
                                                            color: "rgba(5,54,82,1)",
                                                        }}>
                                                        <div className='col-lg-1 col-md-5 col-sm-8'>
                                                            <p style={{ marginLeft: "16px", fontWeight: "600" }}>{t('Glam ID')}</p>
                                                        </div>
                                                        <div className='col-lg-2 col-md-5 col-sm-8'>
                                                            <p style={{ fontWeight: "600", marginLeft: "10px" }}>{t('GL Code')}</p>
                                                        </div>
                                                        <div className='col-lg-3 col-md-5 col-sm-8'>
                                                            <p style={{ fontWeight: "600", marginLeft: "1px" }}>{t('Account Head')}</p>
                                                        </div>
                                                        <div className='col-lg-2 col-md-5 col-sm-8'>
                                                            <p style={{ fontWeight: "600", marginLeft: "-4px" }}>{t('Credit Balance')}</p>
                                                        </div>
                                                        <div className='col-lg-2 col-md-5 col-sm-8' style={{}}>
                                                            <p style={{ fontWeight: "600" }}>{t('Debit Balance')}</p>
                                                        </div>
                                                        <div className='col-lg-2 col-md-5 col-sm-8'>
                                                            <p style={{ fontWeight: "600", marginLeft: "-10px" }}>{t('Net Balance')}
                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                {this.state.pdfBtn == true ? <FaDownload onClick={() => this.exportPDF()}
                                                                    style={{ color: "darkcyan", cursor: "pointer" }}
                                                                    title="Export to CSV"
                                                                />
                                                                    : null}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <hr className="col-12" style={{ width: "96.5%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                                    <div className="" style={{
                                                        height: `${this.state.reqNos.length <= 5 ? "150px" : this.state.reqNos.length >= 10 && "300px"}`,
                                                        marginTop: "-16px"
                                                    }}>
                                                        {this.state.reqNos.map((lists, index) => {
                                                            return (
                                                                <div className='col card border-0' key={index} style={{ marginBottom: "-15px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                    <div className="row item-list align-items-center">
                                                                        <div className="col-lg-1 col-md-5 col-sm-8">
                                                                            <p className="p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px", textWrap: "wrap" }}>
                                                                                {lists.glamid}
                                                                            </p>
                                                                        </div >
                                                                        <div className="col-lg-2 col-md-5 col-sm-8">
                                                                            <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px" }}>{lists.glcode}</p>
                                                                        </div >
                                                                        <div className="col-lg-3 col-md-5 col-sm-8">
                                                                            {lists.accounthead.length > 29 ? (
                                                                                <Tooltip title={lists.accounthead}>
                                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px", cursor: "pointer" }}>
                                                                                        {lists.accounthead.substring(0, 30) + ".."}
                                                                                    </p>
                                                                                </Tooltip>
                                                                            ) : (
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px" }}>
                                                                                    {lists.accounthead}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-5 col-sm-8">
                                                                            {
                                                                                lists.crbalance == "null" ? <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px" }}>₹ 0.00</p> :
                                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px" }}>₹ {parseFloat(lists.crbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                            }
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-5 col-sm-8">
                                                                            {
                                                                                lists.drbalance == "null" ? <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px", marginLeft: "9px" }}>₹ 0.00</p> :
                                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px", marginLeft: "9px" }}>₹ {parseFloat(lists.drbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                            }
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-5 col-sm-8" style={{ textAlign: "" }}>
                                                                            {
                                                                                lists.netbalance == "null" ? <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px" }}>₹ 0.00</p> :
                                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "4px", marginTop: "4px" }}>₹ {parseFloat(lists.netbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                            }
                                                                        </div>
                                                                    </div >
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    &nbsp;
                                                    {this.state.reqNos.length > 1 &&
                                                        <div className="row float-right">
                                                            <div className='col'></div>
                                                            <div className='col'>
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
                                                        </div>}
                                                </div>
                                            </>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <button type="button" id="resetGlAccModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter29" style={{ display: "none" }}>
                        Reset GL Modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter29" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body" style={{ cursor: "default" }}>
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Financial Year Reset</p>
                                            <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500", marginBottom: "3px" }}>&nbsp;Select Financial Year *</p>
                                            {this.state.monthMasterList && this.state.monthMasterList.length > 0 ?
                                                <select id="yearSelect" className='form-select' ref={this.list0ref}
                                                    defaultValue={this.state.finyear} onChange={this.finyear}
                                                    style={{
                                                        border: "1px solid rgba(40,116,166,1)",
                                                        borderRadius: "5px",
                                                        fontSize: "15px",
                                                        color: "rgba(40,116,166,1)",
                                                        paddingLeft: "10px"
                                                    }}>
                                                    <option value="">Select Year</option>
                                                    {this.state.monthMasterList.map(master => (
                                                        <option key={master} value={master}>{master}</option>
                                                    ))}
                                                </select> : ""}
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <div className='row'>
                                        <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                            <button className='btn btn-sm text-white' id="resetGlAccBtn" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.resetGLAccountBalance}>Submit</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} data-dismiss="modal">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default withTranslation()(GiAccountBlc);