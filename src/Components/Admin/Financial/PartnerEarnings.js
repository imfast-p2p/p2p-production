import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../AdminSidebar';
import $, { event } from 'jquery';
import { confirmAlert } from "react-confirm-alert";
import { withTranslation } from 'react-i18next';
import { FaAngleLeft, FaExclamationCircle, FaCaretSquareRight, FaCaretSquareLeft, FaDownload } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';
import openIt from '../../assets/AdminImg/openit.png';
import batch from '../../assets/batch.png';
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo2 from '../../assets/IFPL.jpg';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

var maxYear;
var minYear;
class PartnerEarnings extends Component {
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
                {
                    "servicename": "BONBOARD",
                    "serviceinfo": [
                        {
                            "borrowerid": "BOR-0000000001",
                            "txnamt": "250.00",
                            "facilitatorid": "FAC-0000000002",
                            "valuedate": "2023-11-02"
                        },
                    ]
                },
                {
                    "servicename": "LOANPROC",
                    "serviceinfo": [
                        {
                            "loanaccountnumber": "L0000000001",
                            "loanamt": "10000",
                            "facilitatorid": "FAC-0000000002",
                            "loandisbursementdate": "2023-11-02"
                        },
                    ]
                },
                {
                    "servicename": "LAPPASST",
                    "serviceinfo": [
                        {
                            "loanaccountnumber": "L0000000001",
                            "loanamt": "10000",
                            "facilitatorid": "FAC-0000000002",
                            "loandisbursementdate": "2023-11-02"
                        },
                    ]
                }
            ],
            commMonth: "",
            selectedServiceName: "",
            finyear: "",
            commMonth: "",
            partnerID: "",
            partnerName: "",

            minCommissionMonth: '',
            maxCommissionMonth: ''
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
        this.getAllpartnersCommissions()
        this.getAllPartnersList()
        this.getMonthMasterData()
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
    finyear = (event) => {
        this.setState({ finyear: event.target.value })
        this.getMinCommissionMonth();
        this.getMaxCommissionMonth();
    }
    commMonth = (event) => {
        this.setState({ commMonth: event.target.value })
        console.log(this.getMaxCommissionMonth())
        console.log(this.getMinCommissionMonth())
        console.log("Max Year" + maxYear)
        console.log("Min Year" + minYear)
    }
    partnerID = (event) => {
        this.setState({
            partnerID: event.target.value
        }, () => {
            console.log(this.state.partnerID)
        })
    }
    getMaxCommissionMonth() {
        if (this.state.finyear) {
            // Split the finyear string into start and end years
            const [startYear, endYear] = this.state.finyear.split('-');
            // Prepend "20" to the end year and return it as the maximum commission month
            maxYear = `20${endYear}-12`;
            console.log(maxYear)
            return maxYear;
        }
        return ""; // Return empty string if no financial year is selected
    }
    getMinCommissionMonth() {
        if (this.state.finyear) {
            // Split the finyear string into start and end years
            const [startYear, endYear] = this.state.finyear.split('-');
            minYear = `${startYear}-01`;
            console.log(minYear)
            return minYear;
        }
        return ""; // Return empty string if no financial year is selected
    }
    getAllpartnersCommissions = () => {
        console.log(this.state.partnerID)
        let finyear = "finyear=" + this.state.finyear;
        let commMonth = "commmonth=" + this.state.commMonth;
        let partnerID = "partnerid=" + this.state.partnerID;
        let params;

        if (this.state.finyear && this.state.partnerID == "" && this.state.commMonth == "") {
            params = finyear;
        }
        else if (this.state.finyear && this.state.commMonth) {
            params = finyear + '&' + commMonth;
        }
        else if (this.state.finyear && this.state.commMonth && this.state.partnerID !== "") {
            params = finyear + '&' + commMonth + '&' + partnerID;
        }
        else if (this.state.finyear && this.state.partnerID !== "") {
            params = finyear + '&' + partnerID;
        }
        else if (this.state.commMonth && this.state.partnerID !== "") {
            params = commMonth + '&' + partnerID;
        }
        else if (this.state.commMonth && this.state.partnerID == "" && this.state.finyear == "") {
            params = commMonth;
        }
        else if (this.state.partnerID !== "" && this.state.commMonth == "" && this.state.finyear == "") {
            params = partnerID;
        }
        else {
            params = ""
        }
        fetch(BASEURL + '/misreports/getallpartnerservicecommission?' + params, {
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
                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        partnerCommLists: slice
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
                        $("#commonModal").click()
                    }
                }
            })
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
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click()
                    }
                }
            })
    }
    getAllPartnersList = () => {
        fetch(BASEURL + '/usrmgmt/getallpartners', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ partnersList: resdata.msgdata })
                    console.log(this.state.partnersList)
                    //this.setState({partnerid:resdata.msgdata.partnerid})
                    resdata.msgdata.forEach(element => {
                        this.setState({ partnerName: element.partnername })
                    });
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
            const title2 = secondTitle + '\n' + heading2;
            doc.setFontSize(13);
            doc.text(title2, marginLeft, secondTitleY);

            // Rest of the content, e.g., autoTable code
            const headers = [[" Partner Name", "Service Name", "Financial year", "Commission Month", "Commission Earned"]];
            const data = this.state.partnerCommLists.map(list => [list.partnername,
            list.servicedesc,
            list.finyear,
            list.commmonth,
            list.commearned]);
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
            doc.save("PartnerEarnings.pdf");
        };
    }

    reloadPage = () => {
        var msg = this.state.resMsg
        if (msg.includes("successfull")) {
            window.location.reload();
        }
    }
    viewMoreDetails = (lists) => {
        console.log(lists)
        var convertToString = JSON.stringify(lists)
        sessionStorage.setItem("commLists", convertToString)
        console.log(sessionStorage.getItem("commLists"))
        window.location = "/commBreakdown";
        // this.setState({ commMonth: lists.commmonth })
        // $('#viewMoreDetailsModal').click()
        // this.getAllPartners(lists);
    }
    getAllPartners = (lists) => {
        fetch(BASEURL + '/usrmgmt/getallpartners', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success' || 'SUCCESS' || 'success') {
                    console.log(resdata);
                    this.setState({ partnerLists: resdata.msgdata })

                    console.log(lists.partnerid);
                    var Result = resdata.msgdata.filter((element) => element.partnerid == lists.partnerid);
                    console.log(Result);

                    // var servicesList = Result.forEach(element => {
                    //     console.log(element.services)
                    // });
                    // this.setState({ serviceLists: servicesList });
                    var servicesList = ["BONBOARD", "LOANPROC", "LAPPASST"]
                    this.setState({ serviceLists: servicesList });
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
    // capitalizeFirstLetter = (str) => {
    //     return str.charAt(0).toUpperCase() + str.slice(1);
    // }
    selectServiceName = (event) => {
        this.setState({ selectedServiceName: event.target.value });
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
        const { pmAdminType } = this.state;
        console.log(this.state.serviceLists)
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <AdminSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="BnavRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="BnavRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / Partner Earnings</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="BnavRes3">
                            <button style={myStyle}>
                                <Link to="/landing"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className='row '>
                        <div className="col-lg-7 col-sm-6 col-md-10" style={{ textAlign: "end" }}>
                            <p style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>
                                Partner Earnings
                            </p>
                        </div>
                        <div className='col-lg-5 col-sm-6 col-md-8' style={{ textAlign: "end" }}>
                            {this.state.pdfBtn == true ?
                                <button className="btn btn-sm btn-success float-right"
                                    style={{ marginRight: "38px", padding: "6px" }}
                                    onClick={() => this.exportPDF()}><FaDownload />&nbsp;{t('ExporttoPDF')}</button>
                                : null}
                        </div>
                    </div>

                    <div className='row' style={{ marginLeft: "30px", width: "95%" }}>
                        <div className='col-md-3 col-sm-4'>
                            <label htmlFor="" className="" style={{ fontSize: "14px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('Financial Year')}</label><br />
                            {this.state.monthMasterList && this.state.monthMasterList.length > 0 ?
                                <select id="yearSelect" className='form-select'
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
                        <div className='col-md-3 col-sm-4'>
                            <label htmlFor="date" className="" style={{ fontSize: "14px", marginLeft: "0px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('Commission Month')}</label><br />
                            <input type='month' className='form-control' onChange={this.commMonth}
                                style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",

                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px"
                                }}
                                min={this.getMinCommissionMonth()} // Set min attribute dynamically
                                max={this.getMaxCommissionMonth()} // Set max attribute dynamically
                                placeholder="YYYY-MM"
                            />
                        </div>
                        {pmAdminType === "0" ?
                            <div className='col-md-3 col-sm-4'>
                                <label htmlFor="" className="" style={{ fontSize: "14px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('Partner Name')}</label><br />
                                {this.state.partnersList && this.state.partnersList.length > 0 ?
                                    <select id="partnerSelect" className='form-select'
                                        defaultValue={this.state.partnerID} onChange={this.partnerID}
                                        style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px"
                                        }}>
                                        <option value="">Select Partner</option>
                                        {this.state.partnersList.map(partner => (
                                            <option key={partner.partnerid} value={partner.partnerid}>{partner.partnername}</option>
                                        ))}
                                    </select> : ""}
                            </div>
                            :
                            pmAdminType === "pmAdmin" ?
                                <div className='col-md-3 col-sm-4'>
                                    <label htmlFor="" className="" style={{ fontSize: "14px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('Partner Name')}</label><br />
                                    <input id="date" type="text" className='form-control'
                                        value={this.state.partnerName} disabled
                                        style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px"
                                        }} />
                                </div>
                                : ""}


                        <div className='col-md-3 col-sm-4' style={{ marginTop: '32px', textAlign: 'center' }}>
                            <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: "rgba(0,121,190,1)", width: "100%", padding: "6px" }} onClick={this.getAllpartnersCommissions}>{t('Apply')}</button>
                        </div>
                    </div>
                    {pmAdminType === "0" ? "" :
                        pmAdminType === "pmAdmin" ?
                            <p style={{ fontSize: "14px", marginLeft: "55px", fontWeight: "600", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                Partner Name :&nbsp;
                                <span style={{ fontSize: "14px", fontWeight: "500", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                    {this.state.partnerName}
                                </span>
                            </p> : ""}
                    {/* New Design */}
                    {this.state.financialList == "" ?
                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                            <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                <p>No lists available.</p>
                            </div>
                        </div> :
                        <>
                            {pmAdminType === "0" ?
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
                                            <div className='col-3'>
                                                <p style={{ marginLeft: "25px", fontWeight: "600" }}>{t('Partner Name')}</p>
                                            </div>
                                            <div className='col-3'>
                                                <p style={{ fontWeight: "600" }}>{t('Service Name')}</p>
                                            </div>
                                            <div className='col-1'>
                                                <p style={{ fontWeight: "600" }}>{t('Financial year')}</p>
                                            </div>
                                            <div className='col-2'>
                                                <p style={{ fontWeight: "600", marginLeft: "30px" }}>{t('Commission Month')}</p>
                                            </div>
                                            <div className='col-2'>
                                                <p style={{ fontWeight: "600", marginLeft: "30px" }}>{t('Commission Earned')}</p>
                                            </div>
                                        </div>
                                        <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                        {/* Lists */}
                                        <div className="scrollbar" style={{
                                            height: "320px",
                                            overflowY: 'auto',
                                            marginTop: "-25px"
                                        }}>
                                            {this.state.partnerCommLists.map((lists, index) => {
                                                return (
                                                    <div className='col' key={index}>
                                                        <div className='card border-0' style={{ marginBottom: "-15.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                            <div className="row item-list align-items-center">
                                                                <div className="col-3" style={{ paddingLeft: "11px" }}>
                                                                    <p className="ml-4 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.partnername}</p>
                                                                </div >
                                                                <div className="col-3">
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.servicedesc}</p>
                                                                </div >
                                                                <div className="col-1">
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.finyear}</p>
                                                                </div>
                                                                <div className="col-2">
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", marginLeft: "30px" }}>{lists.monthdesc}</p>
                                                                </div>
                                                                <div className="col-2" style={{ textAlign: "" }}>
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", marginLeft: "34px" }}>₹ {parseFloat(lists.commearned).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div>
                                                                <div className='col-1' style={{ textAlign: "end" }}>
                                                                    <img src={openIt} style={{ height: "29px" }}
                                                                        class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                    &nbsp;
                                                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-114px" }}>
                                                                        <a class="dropdown-item" onClick={this.viewMoreDetails.bind(this, lists)}>More Details</a>

                                                                    </div>
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
                                </div> :
                                pmAdminType === "pmAdmin" ?
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
                                                <div className='col-3'>
                                                    <p style={{ marginLeft: "25px", fontWeight: "600" }}>{t('Service Name')}</p>
                                                </div>
                                                <div className='col-2'>
                                                    <p style={{ fontWeight: "600" }}>{t('Financial year')}</p>
                                                </div>
                                                <div className='col-2'>
                                                    <p style={{ fontWeight: "600" }}>{t('Commission Month')}</p>
                                                </div>
                                                <div className='col-2'>
                                                    <p style={{ fontWeight: "600" }}>{t('Commission Earned')}</p>
                                                </div>
                                            </div>
                                            <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                            {/* Lists */}
                                            <div className="scrollbar" style={{
                                                height: "320px",
                                                overflowY: 'auto',
                                                marginTop: "-25px"
                                            }}>
                                                {this.state.partnerCommLists.map((lists, index) => {
                                                    return (
                                                        <div className='col' key={index}>
                                                            <div className='card border-0' style={{ marginBottom: "-15.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                <div className="row item-list align-items-center">
                                                                    <div className="col-3" style={{ paddingLeft: "11px" }}>
                                                                        <p className="ml-4 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.servicedesc}</p>
                                                                    </div >
                                                                    <div className="col-2">
                                                                        <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.finyear}</p>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.monthdesc}</p>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>₹ {parseFloat(lists.commearned).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                    </div>
                                                                    <div className='col-3' style={{ textAlign: "end" }}>
                                                                        <img src={openIt} style={{ height: "29px" }}
                                                                            class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                        &nbsp;
                                                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-114px" }}>
                                                                            <a class="dropdown-item" onClick={this.viewMoreDetails.bind(this, lists)}>More Details</a>
                                                                        </div>
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
                                    </div> : ""
                            }


                        </>}
                    {/* View More Details Modal */}
                    <button type="button" id='viewMoreDetailsModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter5">
                        View More Details
                    </button>
                    <div class="modal fade" id="exampleModalCenter5" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={batch} width="25px" />More Details</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2' style={{ marginTop: "-10px" }}>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500", marginBottom: "1px" }}>Commission Month</p>
                                                    <input className='form-control' type='text' value={this.state.commMonth} disabled />
                                                </div>
                                                <div className='col-6' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500" }}>Service</p>
                                                    <select className='form-select' onChange={this.selectServiceName} style={{ marginTop: "-15px" }}>
                                                        <option defaultValue="" style={{ textAlign: "center" }}>
                                                            --Select--
                                                        </option>
                                                        {
                                                            this.state.serviceLists.map((service, index) => (
                                                                <option key={index} value={service}>{service}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='row mb-2'>
                                                <button type="button" class="col btn text-white btn-sm" data-dismiss="modal"
                                                    style={{ backgroundColor: "rgb(136, 189, 72)", marginLeft: "14px", marginRight: "11px" }} onClick={this.viewPartnerServices}>Submit</button>&nbsp;
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <div className='row scrollbar' style={{ height: "260px" }}>

                                                        {this.state.getAllservicesInfo.map((serviceInfo, index) => {
                                                            return (
                                                                <div style={{ border: "1.5px dashed rgb(81,164,219)", borderRadius: "5px", marginBottom: "3px" }}>
                                                                    <p className="font-weight-bold" style={{ fontSize: "15px", marginBottom: "1px", fontFamily: "Poppins,sans-serif", color: "rgba(5,54,82,1)", fontWeight: "600" }}>
                                                                        Service Name : <span style={{ fontFamily: "Poppins,sans-serif", color: "rgba(5,54,82,1)", fontWeight: "500" }}>{serviceInfo.servicename}</span>
                                                                    </p>
                                                                    {serviceInfo.serviceinfo.map((obj, subIndex) => (
                                                                        <div key={subIndex}>
                                                                            <Table>
                                                                                <Thead>
                                                                                    <Tr className='pl-4 font-weight-normal' style={{
                                                                                        fontSize: "15px",
                                                                                        fontFamily: "'Poppins', sans-serif", color: "rgba(5,54,82,1)", paddingLeft: "6px"
                                                                                    }}>
                                                                                        {Object.keys(obj).map((key, index) => (
                                                                                            <Th key={index} style={{ fontSize: "14px", textAlign: "left", fontWeight: "600", marginTop: "5px" }}>
                                                                                                {key === "borrowerid" ? "Borrower ID" :
                                                                                                    key === "txnamt" ? "Txn. Amount" :
                                                                                                        key === "facilitatorid" ? "Facilitator ID" :
                                                                                                            key === "valuedate" ? "Date" :
                                                                                                                key === "loanaccountnumber" ? "Loan Account No." :
                                                                                                                    key === "loanamt" ? "Loan Amount" :
                                                                                                                        key === "loandisbursementdate" ? "Disbursement Date" : key
                                                                                                }</Th>
                                                                                        ))}
                                                                                    </Tr>
                                                                                </Thead>
                                                                                <Tbody>
                                                                                    <Tr style={{
                                                                                        fontSize: "14px", fontFamily: "'Poppins', sans-serif", color: "rgb(5, 54, 82)",
                                                                                        transition: 'none', cursor: 'default', backgroundColor: (subIndex % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                                    }}>
                                                                                        {Object.values(obj).map((value, index) => (
                                                                                            <Td key={index} style={{ textAlign: "left", fontWeight: "490", paddingTop: "12px" }}>{value}</Td>
                                                                                        ))}
                                                                                    </Tr>
                                                                                </Tbody>
                                                                            </Table>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                            )
                                                        })}

                                                    </div>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
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

export default withTranslation()(PartnerEarnings)
