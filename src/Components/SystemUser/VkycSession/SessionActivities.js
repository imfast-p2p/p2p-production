import React, { Component } from "react";
import $, { event } from "jquery";
import { BASEURL } from "../../assets/baseURL";
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from "react-i18next";
import { FaSearch, FaAngleLeft, FaFileDownload } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png'
import { Link } from 'react-router-dom';
import accept from '../../assets/accept.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css'
import { confirmAlert } from "react-confirm-alert";
import openIt from '../../assets/AdminImg/openit.png';
import Loader from '../../Loader/Loader'

var activityNames = "";
export class SessionActivities extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activityList: [],
            acceptReqs: "",
            utype: "",
            accepted: "",
            fromdate: "",
            todate: "",
            dtoday: "",
            dfrday: "",

            activityData: {},
            imageData: {},
            sessionId: "",
            showLoader: false,
        };
    }
    componentDidMount() {
        this.getKycSessionActivities();
    }
    accepted = (event) => {
        this.setState({ accepted: event.target.value });
    }
    getKycSessionActivities = () => {
        fetch(BASEURL + '/vf/getvkycsessionactivities?sessionid=' + sessionStorage.getItem('vkycSessionID'), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    this.setState({ sessionId: resdata.msgdata.sessionid })
                    this.setState({ activityList: resdata.msgdata.activitylist });
                } else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click();
                }

            }).catch((error) => {
                console.log(error)
            })
    }
    getvkycActivitiyDetails = (details) => {
        activityNames = details;
        if (details === "SESSIONVIDEO") {
            this.setState({ activityData: {} });
            this.setState({ imageData: {} });
        } else {
            fetch(BASEURL + '/vf/getvkycactivitydetails?sessionid=' + this.state.sessionId + "&activitycode=" + details, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                }
            }).then(response => {
                console.log('Response:', response)
                return response.json();
            })
                .then((resdata) => {
                    console.log(resdata);
                    if (resdata.status == 'SUCCESS') {
                        this.setState({ activityData: resdata.msgdata.activitydata });
                        if (details === "FACEREG") {
                            this.setState({ imageData: resdata.msgdata.imagedata });
                            console.log(this.state.imageData, resdata.msgdata.imagedata)
                        }
                    } else {
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click();
                    }

                }).catch((error) => {
                    console.log(error)
                })
        }
    }
    sessionVideo = () => {
        this.setState({ showLoader: true })
        fetch(BASEURL + '/vf/getvkycsessionvideo?sessionid=' + this.state.sessionId, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response)
                return response.blob(); // Use response.text() for non-JSON data
            })
            .then(async (videoUrl) => {
                console.log(videoUrl)
                this.setState({ showLoader: false })

                // Create a link element and trigger a click to start the download
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(videoUrl);
                link.download = 'session_Video.mp4';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                this.setState({ showLoader: false })
                console.error('Error downloading video:', error);
                this.setState({ resMsg: error.message || "Error downloading video" });
                $("#commonModal").click();
            });
    };
    viewImage = (value) => {
        const dataUrl = `data:image/png;base64,${value}`;
        document.getElementsByClassName('PDFdoc')[0].src = dataUrl + "#zoom=100";
        $("#launchColl").click();
    }
    reloadPage = () => {
        var msg = this.state.resMsg;
        if (msg.includes('No records found')) {
            window.location = "/kycSessionList"
        } else {

        }
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <SystemUserSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="kyCNav1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="kyCNav2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/kycSessionList">VKYC Session Audit</Link> / Session Activities</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="kyCNav3">
                            <button style={myStyle}>
                                <Link to="/kycSessionList" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className="tab-content">
                        <div className="register-form">
                            <div className='' >
                                <div className="card" style={{ marginLeft: "50px", cursor: 'default', width: "92%", backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf" }}>
                                    <div className='row'>
                                        <div className='col-4' id='headingRef'>
                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>KYC Session Activities</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row pl-2 pr-2'>
                                        <div className='col'>
                                            <div className='container-fluid row' style={{ marginTop: "-20px", marginTop: "0px" }}>
                                                <div class="accordion accordion-flush" id="accordionFlushExample">
                                                    {this.state.activityList.map((details, index) => {
                                                        return (
                                                            <div className="row mb-2" key={index}>
                                                                <div className="col">
                                                                    <div class="accordion-item" style={{ backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                                        <div class="accordion-header" id={`flush-heading${index + 1}`}>
                                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" onClick={this.getvkycActivitiyDetails.bind(this, details)}
                                                                                style={{ color: "rgb(34, 44, 112)", fontWeight: "bold", fontSize: "14px" }}
                                                                                data-bs-target={`#flush-collapse${index + 1}`} aria-expanded="false" aria-controls={`flush-collapse${index + 1}`}>
                                                                                {details}
                                                                            </button>
                                                                        </div>
                                                                        <div id={`flush-collapse${index + 1}`} class="accordion-collapse collapse" aria-labelledby={`flush-heading${index + 1}`} data-bs-parent="#accordionFlushExample">
                                                                            <div class="accordion-body">
                                                                                <div className="form-row">
                                                                                    <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                                        <div className='row pr-2' >
                                                                                            {/* GEOLOCATION */}
                                                                                            {activityNames == "GEOLOC" ?
                                                                                                <>
                                                                                                    <div className='row'>
                                                                                                        <div className='col-4' id='headingRef'>
                                                                                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Activity Data</p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        {Object.keys(this.state.activityData).map((activityId) => {
                                                                                                            const activity = this.state.activityData[activityId];
                                                                                                            return (
                                                                                                                <div key={activityId} style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                                                    {activity.payload.results.map((result, index) => (
                                                                                                                        <div key={index} style={{ marginTop: "-10px" }}>
                                                                                                                            <p className="font-weight-bold">Formatted Address : <span style={{ fontWeight: "500" }}>{result.formatted_address}</span></p>
                                                                                                                            {/* <p className="font-weight-bold">Place ID: <span style={{fontWeight:"500"}}>{result.place_id}</span></p> */}
                                                                                                                            <p className="font-weight-bold" style={{ textDecoration: "underline" }}>Location</p>
                                                                                                                            <div className="row">
                                                                                                                                <div className="col-6">
                                                                                                                                    <div className="row">
                                                                                                                                        <div className="col-3">
                                                                                                                                            <p className="font-weight-bold">Longitude</p>
                                                                                                                                        </div>
                                                                                                                                        <div className="col-1">
                                                                                                                                            <p>:</p>
                                                                                                                                        </div>
                                                                                                                                        <div className="col-6">
                                                                                                                                            <p>{result.geometry.location.lng}</p>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div className="col-6">
                                                                                                                                    <div className="row">
                                                                                                                                        <div className="col-3">
                                                                                                                                            <p className="font-weight-bold">Latitude</p>
                                                                                                                                        </div>
                                                                                                                                        <div className="col-1">
                                                                                                                                            <p>:</p>
                                                                                                                                        </div>
                                                                                                                                        <div className="col-6">
                                                                                                                                            <p>{result.geometry.location.lat}</p>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    ))}
                                                                                                                </div>
                                                                                                            );
                                                                                                        })}
                                                                                                    </div>
                                                                                                </>
                                                                                                :
                                                                                                <>{activityNames == "IPFETCH" ? <>
                                                                                                    <div className='row'>
                                                                                                        <div className='col-4' id='headingRef'>
                                                                                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Activity Data</p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        {Object.keys(this.state.activityData).map((activityId) => {
                                                                                                            const activity = this.state.activityData[activityId];
                                                                                                            return (
                                                                                                                <div key={activityId} style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                                                    {/* Render payload data */}
                                                                                                                    <div className="row">
                                                                                                                        <div className="col-6">
                                                                                                                            <div className="row">
                                                                                                                                <div className="col-3">
                                                                                                                                    <p className="font-weight-bold">Country</p>
                                                                                                                                </div>
                                                                                                                                <div className="col-1">
                                                                                                                                    <p>:</p>
                                                                                                                                </div>
                                                                                                                                <div className="col-6">
                                                                                                                                    <p>{activity.payload.country_name}</p>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6">
                                                                                                                            <div className="row">
                                                                                                                                <div className="col-3">
                                                                                                                                    <p className="font-weight-bold">City</p>
                                                                                                                                </div>
                                                                                                                                <div className="col-1">
                                                                                                                                    <p>:</p>
                                                                                                                                </div>
                                                                                                                                <div className="col-6">
                                                                                                                                    <p>{activity.payload.city}</p>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="row">
                                                                                                                        <div className="col-6">
                                                                                                                            <div className="row">
                                                                                                                                <div className="col-3">
                                                                                                                                    <p className="font-weight-bold">IP</p>
                                                                                                                                </div>
                                                                                                                                <div className="col-1">
                                                                                                                                    <p>:</p>
                                                                                                                                </div>
                                                                                                                                <div className="col-6">
                                                                                                                                    <p>{activity.payload.ip}</p>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6">
                                                                                                                            <div className="row">
                                                                                                                                <div className="col-3">
                                                                                                                                    <p className="font-weight-bold">Region</p>
                                                                                                                                </div>
                                                                                                                                <div className="col-1">
                                                                                                                                    <p>:</p>
                                                                                                                                </div>
                                                                                                                                <div className="col-6">
                                                                                                                                    <p>{activity.payload.region}</p>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="row">
                                                                                                                        <div className="col-6">
                                                                                                                            <div className="row">
                                                                                                                                <div className="col-3">
                                                                                                                                    <p className="font-weight-bold">Latitude</p>
                                                                                                                                </div>
                                                                                                                                <div className="col-1">
                                                                                                                                    <p>:</p>
                                                                                                                                </div>
                                                                                                                                <div className="col-6">
                                                                                                                                    <p>{activity.payload.latitude}</p>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6">
                                                                                                                            <div className="row">
                                                                                                                                <div className="col-3">
                                                                                                                                    <p className="font-weight-bold">Postal Code</p>
                                                                                                                                </div>
                                                                                                                                <div className="col-1">
                                                                                                                                    <p>:</p>
                                                                                                                                </div>
                                                                                                                                <div className="col-6">
                                                                                                                                    <p>{activity.payload.postal}</p>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <p className="font-weight-bold" style={{ fontSize: "15px", textDecoration: "underline" }}>Time Zone</p>
                                                                                                                    <div className="row" >
                                                                                                                        {Object.entries(activity.payload.time_zone).map(([key, value], index) => (
                                                                                                                            <div className="col-6" key={index}>
                                                                                                                                <div className="row">
                                                                                                                                    <div className="col-4">
                                                                                                                                        <p className="font-weight-bold">{key == "offset" ? "Offset" :
                                                                                                                                            <span>{key == "name" ? "Name" :
                                                                                                                                                <span>{key == "abbr" ? "Abbr" :
                                                                                                                                                    <span>{key == "current_time" ? "Current Time" :
                                                                                                                                                        <span>{key == "is_dst" ? "Is Dst" : key}</span>}</span>}</span>}</span>}</p>
                                                                                                                                    </div>
                                                                                                                                    <div className="col-1">
                                                                                                                                        <p>:</p>
                                                                                                                                    </div>
                                                                                                                                    <div className="col-6">
                                                                                                                                        <p>{value}</p>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>

                                                                                                                        ))}
                                                                                                                    </div>
                                                                                                                    <p className="font-weight-bold" style={{ fontSize: "15px", textDecoration: "underline" }}>ASN</p>
                                                                                                                    <div className="row">
                                                                                                                        {Object.entries(activity.payload.asn).map(([key, value], index) => (
                                                                                                                            <div className="col-6" key={index}>
                                                                                                                                <div className="row">
                                                                                                                                    <div className="col-4">
                                                                                                                                        <p className="font-weight-bold">{key == "route" ? "Route" :
                                                                                                                                            <span>{key == "domain" ? "Domain" :
                                                                                                                                                <span>{key == "name" ? "Name" :
                                                                                                                                                    <span>{key == "type" ? "Type" :
                                                                                                                                                        <span>{key == "asn" ? "ASN" : key}</span>}</span>}</span>}</span>}</p>
                                                                                                                                    </div>
                                                                                                                                    <div className="col-1">
                                                                                                                                        <p>:</p>
                                                                                                                                    </div>
                                                                                                                                    <div className="col-6">
                                                                                                                                        <p>{value}</p>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>))}
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            );
                                                                                                        })}
                                                                                                    </div>
                                                                                                </>
                                                                                                    :
                                                                                                    <>{activityNames == "FACEREG" ? <>
                                                                                                        {/* <div className='row'>
                                                                                                            <div className='col-4' id='headingRef'>
                                                                                                                <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Activity Data</p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div> */}
                                                                                                        <div className='row pr-2' >
                                                                                                            {Object.entries(this.state.imageData).map(([key, value]) => (
                                                                                                                <>
                                                                                                                    <div className='row'>
                                                                                                                        <div className='col-4' id='headingRef'>
                                                                                                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Image Data</p>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className='col-sm-6 col-md-5 col-lg-4' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                                                        <img src={`data:image/jpeg;base64,${value}`}
                                                                                                                            style={{ width: "100%", height: "auto", overflow: "hidden" }}
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                </>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    </>
                                                                                                        :
                                                                                                        <>{activityNames == "MATCHHEAD" ?
                                                                                                            <>
                                                                                                                <div className='row'>
                                                                                                                    <div className='col-4' id='headingRef'>
                                                                                                                        <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                                                            <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Activity Data</p>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className='row pr-2' >
                                                                                                                    {this.state.activityData.payload.map((activityId) => {
                                                                                                                        return (
                                                                                                                            <div key={index} style={{ color: "#222c70", fontSize: "14px", marginBottom: "10px" }} className="col-6">
                                                                                                                                <div className="row">
                                                                                                                                    <div className="col-3">
                                                                                                                                        <p className="font-weight-bold">Pose</p>
                                                                                                                                    </div>
                                                                                                                                    <div className="col-1">
                                                                                                                                        <p>:</p>
                                                                                                                                    </div>
                                                                                                                                    <div className="col-6">
                                                                                                                                        <p>{activityId.result.pose}</p>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div className="row" style={{ marginTop: "-10px" }}>
                                                                                                                                    <div className="col-3">
                                                                                                                                        <p className="font-weight-bold">Match</p>
                                                                                                                                    </div>
                                                                                                                                    <div className="col-1">
                                                                                                                                        <p>:</p>
                                                                                                                                    </div>
                                                                                                                                    <div className="col-6">
                                                                                                                                        <p>{activityId.result.response.success == true ? "Success" : "Failed"}</p>
                                                                                                                                    </div>
                                                                                                                                </div>

                                                                                                                                <div className="row" key={index}>
                                                                                                                                    {activityId.frames.map((image, index) => {
                                                                                                                                        if (index === 0) {
                                                                                                                                            return (
                                                                                                                                                <div className="col-sm-6 col-md-5 col-lg-8" key={index} style={{ marginBottom: "10px" }}>
                                                                                                                                                    <img
                                                                                                                                                        src={`${image}`}
                                                                                                                                                        style={{ width: "100%", height: "auto", overflow: "hidden" }}
                                                                                                                                                        alt={`Image ${index}`}
                                                                                                                                                    />
                                                                                                                                                </div>
                                                                                                                                            );
                                                                                                                                        }
                                                                                                                                        return null;
                                                                                                                                    })}
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        )
                                                                                                                    })}
                                                                                                                </div>
                                                                                                            </>
                                                                                                            :
                                                                                                            <>{activityNames == "PANREC" ?
                                                                                                                <>
                                                                                                                    <div className='row'>
                                                                                                                        <div className='col-4' id='headingRef'>
                                                                                                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Activity Data</p>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    {Object.keys(this.state.activityData).map((activityId) => {
                                                                                                                        const activity = this.state.activityData[activityId];
                                                                                                                        return (
                                                                                                                            <div key={activityId} style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                                                                <p className="font-weight-bold">Success:<span style={{ fontWeight: "500" }}>{activity.payload.result.success == true ? "Yes" : "No"}</span></p>
                                                                                                                            </div>
                                                                                                                        );
                                                                                                                    })}
                                                                                                                </> :
                                                                                                                <>{activityNames == "SESSIONVIDEO" ? <>
                                                                                                                    <div className="row">
                                                                                                                        <div className="col" style={{ textAlign: "center" }}>
                                                                                                                            <button type="button" className="btn"
                                                                                                                                style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", borderRadius: "10px" }}
                                                                                                                                onClick={this.sessionVideo}>
                                                                                                                                <FaFileDownload style={{ marginTop: "-4px" }} />&nbsp;Download Session Video</button>
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                </> : ""}</>}</>}</>}</>}</>}

                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pdf preview */}
                    <button type="button" id='launchColl' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>

                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <iframe src="" className="PDFdoc" type="application/pdf" style={{ overflow: "auto", height: "100vh", paddingTop: "20px", paddingLeft: "60px" }}>

                                </iframe>
                                <div className='pt-2 pb-2' style={{ textAlign: "end", paddingRight: "15px" }}>
                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
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
                                <dvi class="modal-body">
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>{this.state.resMsg}</p>
                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                </dvi>
                                <div class="modal-footer" style={{ marginTop: "-28px" }}>
                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.reloadPage}>Okay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(SessionActivities);
