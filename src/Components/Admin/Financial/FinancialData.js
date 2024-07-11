import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../AdminSidebar';
import $ from 'jquery';
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

class FanancialData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            getType: "1",
            getDate: "",
            monthMasterList: [],
            financialList: [],
            headers: [],
            getMessage: "",

            pdfBtn: false,
            resMsg: "",
            selectMonthMaster: "Select"
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            // Add an event listener for the popstate event
            window.addEventListener('popstate', this.handlePopstate);
            // Manipulate the history to stay on the same page
            window.history.pushState(null, null, window.location.pathname);
        } else {
            window.location = '/login'
        }

    }
    componentWillUnmount() {
        // Clean up the event listener when the component is unmounted
        window.removeEventListener('popstate', this.handlePopstate);
    }
    handlePopstate = (event) => {
        // Prevent the default behavior of the back button
        event.preventDefault();
        // Manipulate the history to stay on the same page
        window.history.pushState(null, null, window.location.pathname);
    };
    financialType = (e) => {
        this.setState({
            getType: e.target.value
        })
        this.getMonthMasterData(e.target.value)
    }
    financialDate = (e) => {
        // var dateParse = e.target.value;
        // var data = dateParse.split(' ')[0];
        // console.log(data);
        if (e.target.value.includes("Select")) {
            this.setState({ getDate: "" })
            if (e.target.value == "2" || "3" || "4") {
                this.setState({ selectMonthMaster: "Select Month" })
            } else {
                this.setState({ selectMonthMaster: "Select" })
            }
        } else {
            this.setState({ getDate: e.target.value });
            if (e.target.value == "2" || "3" || "4") {
                this.setState({ selectMonthMaster: "Select Month" })
            } else {
                this.setState({ selectMonthMaster: "Select" })
            }
        }
    }
    getMonthMasterData = (getType) => {
        fetch(BASEURL + '/misreports/getmonthmasterdata?type=' + getType, {
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
    getFinancialData = () => {
        let getType = "type=" + this.state.getType;
        let getDate = "&date=" + this.state.getDate;

        let url = BASEURL + '/misreports/getfinancialdata?';
        let params = (this.state.getType ? getType : "") + (this.state.getDate ? getDate : "");
        fetch(url + params
            , {
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
                        headers: resdata.msgdata.headers,
                        getMessage: resdata.message
                    })
                    var financialList = resdata.msgdata.data;
                    const data = this.state.headers.map(arr =>
                        arr.includes("Gross Margin(%)")
                            ? `Gm Percent`
                            : arr
                    )
                    var headers = data;

                    const newData = [];
                    // Loop through each row in the original data
                    financialList.forEach(row => {
                        const newRow = [];
                        // Loop through each header to determine the order
                        headers.forEach(header => {
                            // Find the corresponding item in the row
                            const item = row.find(item => item.key.toLowerCase() === header.replace(/\s/g, '').toLowerCase());

                            // If item found, add it to the newRow
                            if (item) {
                                newRow.push(item);
                            } else {
                                // If item not found, add a placeholder object
                                newRow.push({ value: "", key: header.replace(/\s/g, '').toLowerCase() });
                            }
                        });

                        // Add the newRow to newData
                        newData.push(newRow);
                    });
                    this.setState({ financialList: newData });
                    console.log(this.state.financialList)
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
            const secondTitle = "Operational Revenue Report";
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

            // Rest of the content, e.g., autoTable code
            const headers = [this.state.headers];
            const data = this.state.financialList.map(arr => arr.map(item =>
                item.key === "revenue" || item.key.includes("grossmargin")||item.key.includes("revenueexpense")
                    ? `${parseFloat(item.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    : item.value
            ));
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
            doc.save("FinancialReport.pdf");
        };
    }
    reloadPage = () => {
        var msg = this.state.resMsg
        if (msg.includes("successfull")) {
            window.location.reload();
        }
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
                                <Link to="/landing">Home</Link> / Operational Revenue Report</p>
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
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>
                                Operational Revenue Report
                            </p>
                        </div>
                    </div>

                    {/* New Design */}
                    {/* Select Date */}
                    <div className='row' style={{ paddingLeft: "50px", marginBottom: "18px" }}>
                        <div className='col-3 Fdate' style={{ fontSize: "15px" }}>
                            <p htmlFor="date" style={{
                                fontWeight: "600",
                                fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                marginBottom: "5px",
                            }}
                            >{t('Type*')}</p>
                            <select className='form-select' style={{ height: "34px", border: "1px solid rgb(40, 116, 166)", color: "rgb(40, 116, 166)" }} onChange={this.financialType}>
                                <option defaultValue>Select Type</option>
                                <option value="2">Category-wise</option>
                                <option value="3">Category-wise, AccountHead-wise</option>
                                <option value="4">Monthwise</option>
                            </select>
                        </div>
                        <div className='col-lg-3 col-md-3 col-sm-4 col-6 Fdate' style={{ fontSize: "15px" }}>
                            <p htmlFor="date" style={{
                                fontWeight: "600",
                                fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                marginBottom: "5px",
                            }}
                            >{t('Financial Year*')}</p>
                            <select className='form-select' style={{
                                height: "34px",
                                border: "1px solid rgb(40, 116, 166)", color: "rgb(40, 116, 166)"
                            }} onChange={this.financialDate}>
                                <option defaultValue>{this.state.selectMonthMaster}</option>
                                {this.state.monthMasterList.map((master, index) => {
                                    return (
                                        <option value={master}>{master}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-lg-2 col-md-3 col-sm-4 col-6 Fdate" style={{ paddingTop: '23px' }}>
                            <button type="button" className="btn btn-sm text-white" style={{
                                backgroundColor: "rgb(0, 121, 191)",
                                paddingTop: "6px", paddingBottom: "6px",
                                paddingLeft: "47px", paddingRight: "47px"
                            }}
                                id='auditTrailBtn'
                                onClick={this.getFinancialData}>{t('Apply')}</button>
                        </div>
                        <div className="col-2" style={{ paddingTop: '23px' }}>
                            {this.state.pdfBtn == true ?
                                <button className="btn btn-sm btn-success float-right"
                                    style={{ marginRight: "50px", padding: "6px" }}
                                    onClick={() => this.exportPDF()}><FaDownload />&nbsp;{t('ExporttoPDF')}</button>
                                : null}

                        </div>
                    </div>
                    {this.state.error &&
                        <div className="row" style={{ paddingLeft: "50px" }}>
                            <div className="col">
                                <p style={{ fontSize: "14px", marginLeft: "0px", color: 'red' }}><FaExclamationCircle />{this.state.error}</p>
                            </div>
                        </div>
                    }
                    {this.state.financialList == "" ?
                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                            <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                <p>No lists available.</p>
                            </div>
                        </div> :
                        <>
                            <div className='scrollbar' id="auditScroll">
                                <div style={{
                                    whiteSpace: "nowrap"
                                }} id='secondAuditScroll'>
                                    <div className='row pl-4 font-weight-normal'
                                        style={{
                                            marginLeft: "40px",
                                            fontWeight: "800",
                                            fontSize: "15px",
                                            color: "rgba(5,54,82,1)",
                                        }}>
                                        {this.state.headers.map((header, index) => {
                                            return (
                                                <div className='col' key={index}>
                                                    <p style={{ marginLeft: "-15px", fontWeight: "600" }}>{header}</p>
                                                </div>
                                            )
                                        })}

                                    </div>
                                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                    {/* Lists */}
                                    <div className="scrollbar" style={{
                                        height: 400, overflow: 'auto',
                                        marginTop: "-25px"
                                    }}>
                                        {/*<div className={`col-${Math.floor(12 / this.state.headers.length)}`} style={{ paddingLeft: "20px" }} key={innerIndex}> */}
                                        {this.state.financialList.map((innerArray, index) => (
                                            <div className='col' key={index}>
                                                <div className='card border-0' style={{ marginBottom: "-15.7px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                    <div className="row item-list align-items-center">
                                                        {innerArray.map((item, innerIndex) => (
                                                            <div className={`col`} key={innerIndex}>
                                                                <p className="ml-4 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap" }}>
                                                                    {item.key == "revenue" ? `₹ ${parseFloat(item.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` :
                                                                        item.key.includes("grossmargin")||item.key.includes("revenueexpense") ? `₹ ${parseFloat(item.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : item.value}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
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

export default withTranslation()(FanancialData)
