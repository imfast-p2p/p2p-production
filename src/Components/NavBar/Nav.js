import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logoP2P2.png';
import logo2 from '../assets/jlgIcon/idlpJLG.png';
import * as BsIcons from "react-icons/bs";
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import i18n from "i18next";
import { FaLanguage } from "react-icons/fa";
import { BASEURL } from '../assets/baseURL';
import profile from '../assets/profile_icon2.png';
import profile2 from '../assets/img1.png';
import { FaCamera } from "react-icons/fa";
import * as serviceWorker from "../../serviceWorker";
import langIcon from '../assets/langIcon2.png';
import { confirmAlert } from 'react-confirm-alert';
import './Nav.css'; // Optional: Custom CSS for additional styling

//updated
class NavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: true,
            pname: "Name",
            pemail: "Email ID",
        }
        this.events = [
            "load",
            "mousemove",
            "mousedown",
            "click",
            "scroll",
            "keypress"
        ];
        this.logout = this.logout.bind(this);
        this.logoutClick = this.logoutClick.bind(this);
        this.resetTimeout = this.resetTimeout.bind(this);
        this.getPersonalDetails = this.getPersonalDetails.bind(this);

        for (var i in this.events) {
            window.addEventListener(this.events[i], this.resetTimeout);
        }
        this.setTimeout();
    }
    clearTime() {
        if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
    }
    setTimeout() {
        this.logoutTimeout = setTimeout(this.logout, 3600 * 1000);
    }
    resetTimeout() {
        this.clearTime();
        this.setTimeout();
    }
    logOutApi = () => {
        document.getElementById('navbarCollapse').classList.remove('show');
        confirmAlert({
            message: "Are you sure you want to Logout ?",
            buttons: [
                {
                    label: "Okay",
                    onClick: () => {

                        fetch(BASEURL + '/usrmgmt/logout', {
                            headers: {
                                'Authorization': "Bearer " + sessionStorage.getItem('token')
                            }
                        }).then((Response) => {
                            return Response.json();
                        }).then((resdata) => {
                            if (resdata.status == 'Success') {
                                console.log(resdata);
                                window.location = '/login';
                                serviceWorker.unregister();
                                sessionStorage.removeItem('status')
                                sessionStorage.clear() //clears the sessionStorage 
                                sessionStorage.clear();
                                console.log(sessionStorage)
                                this.setState({ isLoggedIn: false });
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

                },
                {
                    label: "Cancel",
                    onClick: () => {

                    }
                }
            ],
            closeOnClickOutside: false,
        });
        // confirmAlert({
        //     customUI: ({ onClose }) => {
        //         return (
        //             <div className='custom-ui'>
        //                 <p>Are you sure you want to Logout?</p>
        //                 <button
        //                     className='custom-button custom-ok-btn'
        //                     onClick={() => {
        //                         // Your logout logic here
        //                         onClose();
        //                     }}
        //                 >
        //                     Okay
        //                 </button>
        //                 <button
        //                     className='custom-button custom-cancel-btn'
        //                     onClick={onClose}
        //                 >
        //                     Cancel
        //                 </button>
        //             </div>
        //         );
        //     },
        //     closeOnClickOutside: false,
        // });
    }
    logout(e) {
        this.clearTime();

        window.location = '/login';

        sessionStorage.removeItem('status')
        sessionStorage.clear();

        console.log("Sending a logout request to the API...");
        this.setState({ isLoggedIn: false });
    }
    logoutClick(e) {
        // this.clearTime();
        document.getElementById('navbarCollapse').classList.remove('show')
        confirmAlert({
            message: "Are you sure you want to Logout ?",
            buttons: [
                {
                    label: "Okay",
                    onClick: () => {
                        window.location = '/login';
                        serviceWorker.unregister();
                        sessionStorage.removeItem('status')
                        sessionStorage.clear() //clears the sessionStorage 
                        sessionStorage.clear();
                        console.log(sessionStorage)
                        this.setState({ isLoggedIn: false });
                    }

                },
                {
                    label: "Cancel",
                    onClick: () => {

                    }
                }
            ],
            closeOnClickOutside: false,
        });

    }
    submenu() {
        $('.sub').toggle();
    }
    getPersonalDetails(event) {
        fetch(BASEURL + '/usrmgmt/getpersonaldetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                memmid: parseInt(sessionStorage.getItem('memmID'))
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ pname: resdata.msgdata.name })
                    this.setState({ pemail: resdata.msgdata.email })


                }

            })
    }
    changeType = () => {
        sessionStorage.setItem("changeType", "3")
        window.location = "/changeEmailMobile"
    }
    faqPage = () => {
        window.location = "https://dlp.imfast.in/faqs/"
    }
    render() {
        const { t } = this.props
        const changeLanguage = (lng) => {
            i18n.changeLanguage(lng);
            const BiWorld = ({ width = 24, height = 24 }) => (
                <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-globe" viewBox="0 0 16 16">
                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
                </svg>
            )
        };
        console.log(sessionStorage.getItem("pmID"))
        var pmId = sessionStorage.getItem("pmID");
        console.log(typeof (pmId));
        return (
            <nav className="navbar navbar-expand-md navbar-light fixed-top" style={{ backgroundColor: "RGB(237, 235, 235)", height: "50px" }}>
                <div className="container-fluid font-weight-bold">
                    <a className="navbar-brand">
                        <img src={logo} className="navbar-brand-img" style={{ height: '37px', width: '40px', borderRadius: "16px" }} alt="..." />
                    </a>
                    {
                        typeof sessionStorage.getItem("pmID") === "string" && sessionStorage.getItem("pmID") === "2" &&
                        <a className="navbar-brand" href="#">
                            <img src={logo2} className="navbar-brand-img" style={{ height: '40px', width: '45px', borderRadius: "16px" }} alt="Logo" />
                        </a>
                    }
                    <div className="navbar-brand text-primary" href="#">{t('P2PL')}</div>

                    <button type="button" className="btn navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse" style={{ marginTop: "-14px" }}>
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarCollapse" style={{ backgroundColor: "RGB(237, 235, 235)", margin: "-12px -16px 0px -16px", textAlign: "center" }}>

                        <ul className="navbar-nav ml-auto" style={{ marginTop: "7px" }}>
                            {!this.props.loginStatus && this.state.isLoggedIn ?
                                <li className="nav-item" style={{ marginTop: "10px" }} >
                                    <Link
                                        to="/emiCalc"
                                        className="nav-link text-dark"
                                        onClick={() => document.getElementById('navbarCollapse').classList.remove('show')}
                                    >
                                        {t('EMI Calculator')}
                                    </Link>
                                </li> : ""}

                            {!this.props.loginStatus && this.state.isLoggedIn ?
                                <li className="nav-item" style={{ marginTop: "10px", cursor: "pointer" }}
                                    onClick={this.faqPage}
                                >

                                    {/* <Link
                                        to="/faq"
                                        className="nav-link text-dark"
                                        onClick={() => document.getElementById('navbarCollapse').classList.remove('show')}
                                    >
                                        {t('FAQ')}
                                    </Link> */}
                                    <a className="nav-link text-dark">{t('FAQ')}</a>
                                </li> : ""}

                            {!this.props.loginStatus && this.state.isLoggedIn ?
                                <li className="nav-item" style={{ marginTop: "10px" }}>
                                    <Link
                                        to="/contact"
                                        className="nav-link text-dark"
                                        onClick={() => document.getElementById('navbarCollapse').classList.remove('show')}
                                    >
                                        {t('ContactUs')}
                                    </Link>
                                </li> : ""}


                            <li className="nav-item nav-link dropdown mt-2" style={{ listStyleType: "none" }}>
                                {/* <button className="dropdown btn btn-sm"> */}
                                <button className="btn btn-default " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false" style={{ marginTop: '-11px' }}>
                                    <img src={langIcon} style={{ height: "25px", width: "25px" }} />
                                    {/* <b className=''> <FaLanguage style={{ height: "32px", width: "32px" }} /></b> */}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                                    <li className="dropdown-item" onClick={() => {
                                        changeLanguage("hi");
                                        document.getElementById('navbarCollapse').classList.remove('show')
                                    }}>हिन्दी</li>
                                    <li className="dropdown-item" onClick={() => {
                                        changeLanguage("bn");
                                        document.getElementById('navbarCollapse').classList.remove('show')
                                    }}>বাংলা</li>
                                    <li className="dropdown-item" onClick={() => {
                                        changeLanguage("en");
                                        document.getElementById('navbarCollapse').classList.remove('show')
                                    }}>English</li>
                                    <li className="dropdown-item" onClick={() => {
                                        changeLanguage("as");
                                        document.getElementById('navbarCollapse').classList.remove('show')
                                    }}>অসমীয়া</li>

                                </ul>
                                {/* </button> */}
                            </li>
                            {!this.props.loginStatus && this.state.isLoggedIn ?
                                <li>
                                    < Link to="/login">
                                        <button className="btn btn-success mr-2" type="button" style={{ borderRadius: "30px", marginTop: "5px" }}
                                            onClick={() => document.getElementById('navbarCollapse').classList.remove('show')}>{t('login')}</button>
                                    </Link>
                                    <Link to="/selectRegistration">
                                        <button className="btn btn-primary" type="button" style={{ borderRadius: "30px", marginTop: "5px" }}
                                            onClick={() => document.getElementById('navbarCollapse').classList.remove('show')}>{t('Register Now')}</button>
                                    </Link>
                                </li> :


                                <div className="navbar-nav" style={{ marginTop: "10px" }}>
                                    {/* Settings Dropdown */}
                                    <div className="nav-item dropdown" style={{ padding: "0px 10px 0px 10px" }}>
                                        <button className="btn btn-sm btn-default dropdown-toggle" type="button" id="settingsDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <BsIcons.BsFillGearFill className="icon text-dark" style={{ width: "20", height: "20" }} />
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="settingsDropdown" style={{ margin: "auto" }}>
                                            <Link to="/changePassword" className="dropdown-item" onClick={() => document.getElementById('navbarCollapse').classList.remove('show')}>{t('ChangePassword')}</Link>
                                            <button className="dropdown-item" onClick={this.changeType}>{t('ChangeE/M')}</button>
                                        </div>
                                    </div>

                                    {/* Profile Dropdown */}
                                    <div className="nav-item dropdown" style={{ padding: "0px 10px 0px 10px", marginTop: "-5px" }}>
                                        <button className="btn btn-sm btn-default dropdown-toggle" id="profileDropdown" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img src={profile} width="35" height="35" className="rounded-circle" alt="Profile" />
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                                            <button className="dropdown-item font-weight-bold" onClick={this.logOutApi}>{t('Log Out')}</button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </ul>

                    </div>
                </div>
            </nav >
        )


        // return (
        //     <nav className="navbar navbar-expand-md navbar-light fixed-top custom-navbar" style={{ backgroundColor: "RGB(237, 235, 235)" }}>
        //         <a className="navbar-brand" href="#">
        //             <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-top" />
        //             P2PL
        //         </a>
        //         <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        //             <span className="navbar-toggler-icon"></span>
        //         </button>
        //         <div className="collapse navbar-collapse" id="navbarNav">
        //             <ul className="navbar-nav ml-auto">
        //                 <li className="nav-item">
        //                     <a className="nav-link" href="#">EMI Calculator</a>
        //                 </li>
        //                 <li className="nav-item">
        //                     <a className="nav-link" href="#">FAQ</a>
        //                 </li>
        //                 <li className="nav-item">
        //                     <a className="nav-link" href="#">Contact Us</a>
        //                 </li>
        //             </ul>
        //             <ul className="navbar-nav">
        //                 <li className="nav-item">
        //                     <button className='btn btn-sm btn-success text-white'>Login</button>
        //                 </li>
        //                 <li className="nav-item">
        //                     <button className='btn btn-sm btn-primary text-white'>Register Now</button>
        //                 </li>
        //             </ul>
        //         </div>
        //     </nav>
        // )
    }
}

export default withTranslation()(NavBar)

class Submenu extends Component {
    render() {
        return (
            <ul className="">
                <li className="">
                    <Link to="/changePassword">
                        <a href="#">
                            <p className="text-dark border-bottom sub">Change Password</p>
                        </a>
                    </Link>
                </li>
                <li className="">
                    <a href="#">
                        <p className="text-dark border-bottom sub">Preferences</p>
                    </a>
                </li>
            </ul>
        )
    }
}