import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import dashboardIcon from '../assets/icon_dashboard.png';
import { FaAngleLeft, FaThumbsUp, } from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert';

class PaymentQRCodeLndDue extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            amt: sessionStorage.getItem('amount'),
            image: "",
            utype: '',
            upid: "",
            upiname: ""
        }
        this.getQRcode = this.getQRcode.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.getQRcode();
        } else {
            window.location = '/login'
        }

    }

    getQRcode() {

        fetch(BASEURL + '/lms/getpaymentqrcode', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                utype: 2,
                paymenttype: 1,
                amt: this.state.amt
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    // alert(resdata.message);
                    // document.getElementById("qrimage").innerHTML = resdata.msgdata.qrimg
                    this.setState({ image: resdata.msgdata.qrimg })
                    this.setState({ utype: resdata.msgdata.utype })
                    this.setState({ amt: resdata.msgdata.amt })
                    this.setState({ upid: resdata.msgdata.upid })
                    this.setState({ upiname: resdata.msgdata.upiname })
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
                                        // window.location.reload();
                                    },
                                },
                            ],
                        });
                    }                 
                }
            })

    }

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-10px", backgroundColor: "#F4F7FC" }}>
                <LenderSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-7' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/lenderdashboard">Home</Link> / <Link to="/payLndDues">Payment Gateway</Link> / Payment With QR Code</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>

                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/payLndDues" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", marginTop: "1px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />

                    {/* New Design */}
                    <div className="row d-flex justify-content-center" >
                        <div className="col-md-7">
                            <div className="card" style={{ width: "100%", cursor: "default", boxShadow: "5px 10px 18px #888888" }}>
                                <div className="credentials" style={{ padding: "10px 20px" }}>
                                    <div className='col-6' id='headingRef' style={{ marginLeft: "-7px" }}>
                                        <div className="two__image" style={{ paddingLeft: "10px" }}>
                                            <p className="text-white" style={{ paddingBottom: "2px", fontWeight: "600" }}>Pay With QR Code</p>
                                        </div>
                                    </div>

                                    <div className="row ">
                                        <div className='col-4'>
                                            {/* <div className='card'> */}
                                            {this.state.image ? <img src={`data:image/png;base64,${this.state.image}`} style={{ marginTop: "-15px", marginLeft: "-29px" }} /> : ''}

                                        </div>
                                        <div className='col-8'>
                                            <div className='row mt-3'>
                                                <div className="col" style={{ fontWeight: "bold", color: "#222C70", textAlign: "center", fontStyle: "Poppins,sans-serif" }}>
                                                    {
                                                        sessionStorage.getItem('userType') == 2 ?
                                                            <p>Lender Due</p> : <div></div>
                                                    }
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-5' style={{ color: "#222C70", fontWeight: "bold", fontStyle: "Poppins,sans-serif" }}>
                                                    <p>Amount</p></div>
                                                <div className='col-1' style={{ color: "#222C70", fontStyle: "Poppins,sans-serif" }}>
                                                    :
                                                </div>
                                                <div className='col-6' style={{ color: "#222C70", fontStyle: "Poppins,sans-serif" }}>
                                                    ₹{(this.state.amt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                </div>

                                            </div>
                                            <div className='row' style={{ marginTop: "-10px" }}>
                                                <div className='col-5' style={{ color: "#222C70", fontWeight: "bold", fontStyle: "Poppins,sans-serif" }}>
                                                    <p>UPI ID</p>
                                                </div>
                                                <div className='col-1' style={{ color: "#222C70", fontStyle: "Poppins,sans-serif" }}>
                                                    :
                                                </div>
                                                <div className='col-6' style={{ color: "#222C70", fontStyle: "Poppins,sans-serif" }}>
                                                    {this.state.upid}
                                                </div>
                                            </div>
                                            <div className='row' style={{ marginTop: "-10px" }}>
                                                <div className='col-5' style={{ color: "#222C70", fontWeight: "bold", fontStyle: "Poppins,sans-serif" }}>
                                                    <p>UPI Name</p>
                                                </div>
                                                <div className='col-1' style={{ color: "#222C70", fontStyle: "Poppins,sans-serif" }}>
                                                    :
                                                </div>
                                                <div className='col-6' style={{ color: "#222C70", fontStyle: "Poppins,sans-serif" }}>
                                                    {this.state.upiname}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' style={{ padding: "0px 10px 10px 0px", marginTop: "-10px" }}>
                                        <div className='col'>
                                            <Link to="/lenderdashboard">
                                                <button className=" btn btn-sm " style={{ float: "right", paddingRight: "15px", paddingLeft: "15px", borderRadius: "1px", backgroundColor: "rgb(136, 189, 72)", color: "white" }}>Close</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    
                    {/* <div className='row'>
                        <div className='col'></div>
                        <div className='col'>
                            {this.state.image ? <img src={`data:image/png;base64,${this.state.image}`} /> : ''}
                        </div>
                        <div className='col'></div>
                    </div>
                    <div className='row text-center' style={{ marginRight: "100px" }}>
                        <div >
                            {
                                sessionStorage.getItem('userType') == 2 ?
                                    <p style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "#222C70", fontWeight: "bold" }}>Lender Due</p> : <div></div>
                            }
                        </div>
                        <div >
                            <p style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "#222C70", fontWeight: "bold" }}>Amount: <span className='font-weight-normal '>₹{(this.state.amt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span></p>

                        </div>
                        <div >
                            <p style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "#222C70", fontWeight: "bold" }}>UPI ID: <span className='font-weight-normal '>{this.state.upid}</span></p>

                        </div>
                        <div >
                            <p style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "#222C70", fontWeight: "bold" }}>UPI Name: <span className='font-weight-normal '>{this.state.upiname}</span></p>

                        </div>

                    </div>
                    <div className='row' style={{ marginLeft: "90px" }}>
                        <div className='col'></div>
                        <div className='col'>
                            <Link to="/lenderdashboard">
                                <button className="btn btn-danger mr-2 ml-2">Close</button>
                            </Link>
                        </div>
                        <div className='col'></div>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default PaymentQRCodeLndDue
