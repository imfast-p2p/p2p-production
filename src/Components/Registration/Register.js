import { BorderAll } from '@material-ui/icons';
import collapseMotion from 'antd/lib/_util/motion';
import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';

var isSucess = "";
class Register extends Component {

    constructor(props) {
        super(props)
        //updated
        this.state = {
            reference_id: "",
            status: "",
            panInfo: {},
            errorMsg: "",
        }
        this.getUserPanInfo = this.getUserPanInfo.bind(this);
        this.onDigiResponse = this.onDigiResponse.bind(this);
    }

    componentDidMount() {
        var url = window.location;
        let params = new URLSearchParams(url.search);

        var routeParam = window.location.href
        console.log(window.location.href)

        const {
            host, hostname, href, origin, pathname, port, protocol, search
        } = window.location
        console.log(host)
        console.log(hostname)
        console.log(origin)
        console.log("Path Name " + pathname)

        if (params.has("status")) {
            if (params.get("status") === "Success") {
                if (params.has('reference_id')) {
                    this.setTimeout();
                    isSucess = "Success";
                } else {
                    isSucess = "Failure";
                    this.setState({ errorMsg: "Technical Error, Try after sometime." })
                }
            } else if (params.get("status") === "Failure") {
                isSucess = "Failure";
                this.setState({ errorMsg: params.get("msg") })
                setTimeout(() => { this.routeToLogin() }, 5000)
            }
        }
        // else if (pathname == "/lenderdashboard") {
        //     if (params.get("status") === "Success") {
        //         if (params.has('reference_id')) {
        //             this.setTimeout();
        //             isSucess = "Success";
        //         } else {
        //             isSucess = "Failure";
        //             this.setState({ errorMsg: "Technical Error, Try after sometime." })
        //         }
        //     } else if (params.get("status") === "Failure") {
        //         isSucess = "Failure";
        //         this.setState({ errorMsg: params.get("msg") })
        //         setTimeout(() => { this.routeToLogin() }, 5000)
        //     }
        // } else if (pathname == "/borrowerdashboard") {
        //     if (params.get("status") === "Success") {
        //         if (params.has('reference_id')) {
        //             this.setTimeout();
        //             isSucess = "Success";
        //         } else {
        //             isSucess = "Failure";
        //             this.setState({ errorMsg: "Technical Error, Try after sometime." })
        //         }
        //     } else if (params.get("status") === "Failure") {
        //         isSucess = "Failure";
        //         this.setState({ errorMsg: params.get("msg") })
        //         setTimeout(() => { this.routeToLogin() }, 5000)
        //     }
        // } else if (pathname == "/facilitatorDashboard") {
        //     if (params.get("status") === "Success") {
        //         if (params.has('reference_id')) {
        //             this.setTimeout();
        //             isSucess = "Success";
        //         } else {
        //             isSucess = "Failure";
        //             this.setState({ errorMsg: "Technical Error, Try after sometime." })
        //         }
        //     } else if (params.get("status") === "Failure") {
        //         isSucess = "Failure";
        //         this.setState({ errorMsg: params.get("msg") })
        //         setTimeout(() => { this.routeToLogin() }, 5000)
        //     }
        // }

    }
    routeToLogin = () => {
        window.location = "/login";
    }
    routeToRegister = () => {
        window.location = "/borrow"
    }
    routeToFacilitaatorOnboard = () => {
        window.location = "/onboardRegister"
    }

    setTimeout() {
        this.logoutTimeout = setInterval(this.onDigiResponse, 100);
    }

    onDigiResponse() {
        const urlParams = new URLSearchParams(window.location.search);
        this.setState({ reference_id: urlParams.get('reference_id') });
        sessionStorage.setItem('reference_id', urlParams.get('reference_id'));
        this.setState({ status: urlParams.get('status') });

        if (this.state.status == 'Success') {
            this.getUserPanInfo();
        }
    }

    getUserPanInfo() {
        fetch(BASEURL + '/verification/digilocker/getuserpaninfo', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refid: this.state.reference_id
            })

        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                console.log("method called!!!")
                const urlParams = new URLSearchParams(window.location.search);

                const status = urlParams.get("status");
                console.log(status);
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata.message);
                    // alert(resdata.message);
                    // if (sessionStorage.getItem("facName") != ""||null||undefined) {
                    //     setTimeout(() => { this.routeToFacilitaatorOnboard() }, 5000)
                    //     this.setState({ panInfo: resdata.msgdata })
                    //     sessionStorage.setItem('username', resdata.msgdata.username);
                    //     sessionStorage.setItem('dob', resdata.msgdata.dob);
                    //     sessionStorage.setItem('pan', resdata.msgdata.pan);
                    //     sessionStorage.setItem('mobileno', resdata.msgdata.mobileno);
                    //     sessionStorage.setItem('referenceNo', resdata.msgdata.refno);
                    //     sessionStorage.setItem('Digi_gender', resdata.msgdata.gender)
                    // } else {
                    //     setTimeout(() => { this.routeToRegister() }, 5000)
                    //     this.setState({ panInfo: resdata.msgdata })
                    //     sessionStorage.setItem('username', resdata.msgdata.username);
                    //     sessionStorage.setItem('dob', resdata.msgdata.dob);
                    //     sessionStorage.setItem('pan', resdata.msgdata.pan);
                    //     sessionStorage.setItem('mobileno', resdata.msgdata.mobileno);
                    //     sessionStorage.setItem('referenceNo', resdata.msgdata.refno);
                    //     sessionStorage.setItem('Digi_gender', resdata.msgdata.gender)
                    // }

                    setTimeout(() => { this.routeToRegister() }, 5000)
                    this.setState({ panInfo: resdata.msgdata })
                    sessionStorage.setItem('username', resdata.msgdata.username);
                    sessionStorage.setItem('dob', resdata.msgdata.dob);
                    sessionStorage.setItem('pan', resdata.msgdata.pan);
                    sessionStorage.setItem('mobileno', resdata.msgdata.mobileno);
                    sessionStorage.setItem('referenceNo', resdata.msgdata.refno);
                    sessionStorage.setItem('Digi_gender', resdata.msgdata.gender)

                    // window.location = "/borrow";
                    // this.setState({ panInfo: resdata.msgdata })
                    // sessionStorage.setItem('username', resdata.msgdata.username);
                    // sessionStorage.setItem('dob', resdata.msgdata.dob);
                    // sessionStorage.setItem('pan', resdata.msgdata.pan);
                    // sessionStorage.setItem('mobileno', resdata.msgdata.mobileno);
                    // sessionStorage.setItem('referenceNo', resdata.msgdata.refno);
                    // sessionStorage.setItem('Digi_gender', resdata.msgdata.gender)
                }

                else {
                    alert("issue: " + resdata.message);
                    this.setState({ errorMsg: resdata.message })
                    // const errorURl = new URLSearchParams(window.location.href);
                    // const decodedComponent = decodeURIComponent(errorURl);
                    // document.write(decodedComponent);
                    // console.log(document.write(decodedComponent));


                }
            })
    }
    render() {
        if (isSucess == "Success") {
            console.log("called Success ")
            return (
                <div style={{ paddingLeft: "18%", paddingRight: "18%", paddingTop: "5%" }}>
                    <div className="container">
                        <div className="row d-flex justify-content-center" >
                            <div className="col-md-12 ">
                                <div className="card" style={{ width: "100%", cursor: "default", boxShadow: "5px 10px 18px #888888" }}>
                                    <div className="credentials" >
                                        <div className='mb-3' style={{ paddingTop: "15px", }}>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center", color: "#00264d" }}>
                                                    <h4 className="heading">
                                                        Sit back and relax.
                                                    </h4>
                                                    <h4>
                                                        You will be redirected to continue registration
                                                    </h4>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                // <div className="reg mx-auto w-50" style={{ marginTop: '12%' }}>
                //     <div className="group mt-4" style={{ background: "white", textAlign: "center", border: "2px solid black" }}>
                //         <p>Sit back & relax.</p>
                //         <p >You are redirecting to registration screen.</p>
                //     </div>
                // </div>
            )
        } else {
            console.log("called Failure ")
            return (
                <div style={{ paddingLeft: "18%", paddingRight: "18%", paddingTop: "5%" }}>
                    <div className="container">
                        <div className="row d-flex justify-content-center" >
                            <div className="col-md-12 ">
                                <div className="card" style={{ width: "100%", cursor: "default", boxShadow: "5px 10px 18px #888888" }}>
                                    <div className="credentials" >
                                        <div className='mb-3' style={{ paddingTop: "15px", }}>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center", color: "#00264d" }}>
                                                    <h4 className="heading1">
                                                        {this.state.errorMsg}
                                                    </h4>
                                                    <h4>
                                                        Use the alternate method to register.
                                                    </h4>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                // <div className="reg mx-auto w-50" style={{ marginTop: '12%' }}>
                //     <div className="group mt-4" style={{ background: "white", textAlign: "center", border: "2px solid black" }}>
                //         <p ></p>
                //     </div>
                // </div>
            )
        }


    }
}

export default Register