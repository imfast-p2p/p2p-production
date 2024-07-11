import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import { confirmAlert } from "react-confirm-alert";
import dashboardIcon from '../assets/icon_dashboard.png';
import { FaAngleLeft, FaMoneyBill } from "react-icons/fa";

export class LenderPreference extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            selectedPreference: [],
            preferenceNumberList: [],
        }
        this.getLPreference = this.getLPreference.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.getLPreference();
            sessionStorage.removeItem('prefNumber')
        } else {
            window.location = '/login'
        }

    }

    getLPreference() {
        fetch(BASEURL + '/lms/getlenderpreference', {
            method: 'get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }

        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    console.log();
                    var preferenceNumberList = [];
                    for (var i = 0; i < resdata.msgdata.length; i++) {
                        resdata.msgdata[i].forEach(element => {
                            console.log(element.preferencenumber);
                            preferenceNumberList.push(element.preferencenumber)

                        })
                        preferenceNumberList.pop(i + 1);
                        // resdata.msgdata[i].preferencenumber
                        console.log(resdata.msgdata[i]);
                        console.log(resdata.msgdata[i])
                    }
                    this.setState({ preferenceNumberList: preferenceNumberList });
                    console.log(preferenceNumberList)
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
    sendPreference = (preference) => {
        console.log(preference);
        sessionStorage.setItem("prefNumber", preference);
        window.location = "/getLenderPreferenceOptions";
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        console.log(this.state.preferenceNumberList);
        const myStyle = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "9px 0px 4px 0px",
            cursor: "pointer",
            fontSize: "12px",
            // height: "25px",
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
        }
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-10px", backgroundColor: "#f4f7fc" }}>
                <LenderSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ paddingLeft: "35px", marginBottom: "-20px" }}>
                        <div className="col-1">
                            <button style={{}} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-lg-4' style={{ marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/lenderdashboard">Home</Link> / Lender Preferences</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-lg-3 col-sm-12'>

                        </div>
                        <div className="col-lg-1 col-sm-2">
                            <button style={myStyle}>
                                <Link to="/lenderdashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col p-3">
                            <div className="row">
                                <div className="col">
                                    <ul className=" item-list align-items-center">
                                        <button className="dropdown btn btn-sm">
                                            <button className="btn btn-default dropdown-toggle border-dark" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                Select Preference
                                            </button>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                                                {
                                                    this.state.preferenceNumberList.map((preference, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div>
                                                                    <Link >
                                                                        <div lassName="dropdown-item" onClick={this.sendPreference.bind(this, preference)}>{preference == "1" ? "1st" : ""}</div>
                                                                    </Link>
                                                                    <Link >
                                                                        <div lassName="dropdown-item" onClick={this.sendPreference.bind(this, preference)}>{preference == "2" ? "2nd" : ""}</div>
                                                                    </Link>
                                                                    <Link >
                                                                        <div lassName="dropdown-item" onClick={this.sendPreference.bind(this, preference)}>{preference == "3" ? "3rd" : ""}</div>
                                                                    </Link>
                                                                </div>
                                                            </div>


                                                        )
                                                    })
                                                }

                                                <div>
                                                    <Link to="/getLenderPreferenceOptions">
                                                        <div lassName="dropdown-item">Add Preference</div>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <Link to="/getLenderPreferenceOptions">
                                                    <a className="dropdown-item" href="#">1st Preference</a>
                                                </Link>
                                                <Link to="/getLenderPreferenceOptions">
                                                    <a className="dropdown-item" href="#">2nd Preference</a>
                                                </Link>
                                                <Link to="/getLenderPreferenceOptions">
                                                    <a className="dropdown-item" href="#">3rd Preference</a>
                                                </Link>
                                            </div> */}
                                        </button>
                                    </ul >
                                </div >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LenderPreference
