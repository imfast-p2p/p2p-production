import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import { withTranslation } from 'react-i18next';

export class LoginViaDigilocker extends Component {
    constructor(props) {
        super(props)
//updated
        this.state = {
            mobile_no: "",
            u_type: "2",
            refid: "",
            reference_id: "",
            status: "",
        }
        this.mobile_no = this.mobile_no.bind(this);
        this.u_type = this.u_type.bind(this);
        this.makeDigiCall = this.makeDigiCall.bind(this);
        // this.getIssuedDocuments = this.getIssuedDocuments.bind(this);
    }
    componentDidMount(){
        sessionStorage.setItem('DigiUserType',this.state.u_type)
        // const urlParams = setTimeout(window.location.href,100);
        // console.log(urlParams)
    }

    mobile_no(event) {
        this.setState({ mobile_no: event.target.value })
        sessionStorage.setItem('DigimobileNumber',event.target.value)
    }

    u_type(event) {
        this.setState({ u_type: event.target.value })
        sessionStorage.setItem('DigiUserType',event.target.value)
    }

    makeDigiCall() {
        fetch(BASEURL + '/verification/digilocker/makedigilockercall?mobile_no=' + this.state.mobile_no + '&u_type=' + this.state.u_type
        , {
            method: 'get'

        }).then((Response) => {
            return Response;
        // })
        //     .then((resdata) => {
                // if (resdata.status == 'Success') {
                    // alert(resdata.message);
                    
                    
                // }
                // else {
                //     alert("issue: " + resdata.message);
                // }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    setTimeout() {
       // this.logoutTimeout = setTimeout(this.onDigiResponse,100);
    }

    render() {
        const digiURL = BASEURL + "/verification/digilocker/makedigilockercall";

        const {t} = this.props
        
        return (
            <div className="row">
                <div className="login col-md-6 mx-auto p-0">
                    <div className="">
                        <div className="login-box-1">
                            <div className="login-snip signin-text p-5">
                                <input id="tab-2" type="radio" name="tab" className="sign-up" />
                                    <label htmlFor="tab-2" className="tab" style={{color:"rgb(5, 54, 82)"}}>{t("Welcome")}</label>
                                        <div className="login-space">
                                            <div className="sign-up-form">
                                                <div className="row">
                                                    <div className="login">
                                                        
                                                        {/* Form */}
                                                        <form action={digiURL} method="GET">
                                                            <div className="group">
                                                                <label htmlFor="login" className="label" style={{color:"rgb(5, 54, 82)"}}>{t("Register")}</label>
                                                                    <div className="d-flex">
                                                                        <div className="row"  onChange={this.u_type}>
                                                                            <div className="col-sm-3 col-md-3 col-lg-3">
                                                                                <div className="form-check">
                                                                                    <label className="form-check-label mr-2" style={{color:"rgb(5, 54, 82)"}}>
                                                                                        <input type="radio" className="form-check-input" name="u_type" value="2" defaultChecked />{t("Lender")}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-sm-3 col-md-3 col-lg-3">
                                                                                <div className="form-check">
                                                                                    <label className="form-check-label mr-2" style={{color:"rgb(5, 54, 82)"}}>
                                                                                        <input type="radio" className="form-check-input" name="u_type" value="3" />{t("Borrower")}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-sm-3 col-md-3 col-lg-3">
                                                                                <div className="form-check">
                                                                                    <label className="form-check-label mr-2" style={{color:"rgb(5, 54, 82)"}}>
                                                                                        <input type="radio" className="form-check-input" name="u_type" value="4" />{t("Facilitator")}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-sm-3 col-md-3 col-lg-3">
                                                                                <div className="form-check">
                                                                                    <label className="form-check-label" style={{color:"rgb(5, 54, 82)"}}>
                                                                                        <input type="radio" className="form-check-input" name="u_type" value="5" />{t("Evaluator")}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                            </div>
                                                            <div className="group" >
                                                                <h5 className="label mt-3 mb-4" style={{ fontSize: '15px',color:"rgb(5, 54, 82)" }}>{t("Enter_mobile_no")}</h5>
                                                            </div>
                                                            <div className="group">
                                                                <label className="label" style={{ color:"rgb(5, 54, 82)" }}>{t("Mobile")}</label>
                                                                <input type="number" className="input" name="mobile_no" id="mobile_no" placeholder="Enter Mobile Number" onChange={this.mobile_no} />
                                                            </div>
                                                            {/* <div className="group">
                                                                <label className="label">User Type </label>
                                                                <input type="number" className="input" name="u_type" id="u_type" placeholder="Enter User Type" onChange={this.u_type} />
                                                            </div> */}
                                                            <div className="group">
                                                                <input type="submit" onClick={this.onDigiResponse} className="button" value="Submit" />
                                                            </div>
                                                        </form>

                                                        <div className="group" style={{color:"rgb(5, 54, 82)"}}>
                                                            <a href="https://accounts.digitallocker.gov.in/" className="label mt-3 mb-4" >{t("sign_up")}</a>
                                                        </div>
                                                        {/* <div className="group">
                                                            <Link to="/login">
                                                                <a href="#" className="label mt-3 mb-4">{t("loginP2P")}</a>
                                                            </Link>
                                                        </div> */}
                                                        {/* <div className="row">
                                                            <div className="col-2"></div>
                                                            <div className="col-8 ml-5">
                                                            <button className="btn btn-primary m-3" onClick={() => changeLanguage("hi")}>Hindi</button>
                                                            <button className="btn btn-primary" onClick={() => changeLanguage("en")}>English</button> */}
                                                            {/* <div>{t("localization_testing")}</div> */}
                                                            {/* </div>
                                                            <div className="col-2"></div>
                                                        </div> */}
                                            </div>
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

export default withTranslation() (LoginViaDigilocker)

// getDigiCode() {
    //     $('.otpField').toggle();
    //     $(".otpButton").toggle();
    //     fetch(DIGIURL + '/oauth2/1/code', {
    //         method: 'post',
    //         // mode: 'cors', 
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Access-Control-Allow-Origin': 'https://api.digitallocker.gov.in/',
    //             "Access-Control-Allow-Credentials": "false",
    //         },
    //         body: JSON.stringify({
    //             "response_type": "device_code",
    //             "client_id": "8F9D5F8A",
    //             "dl_mobile": this.state.usermobile
    //         })
    //     }).then(response => {
    //         console.log('Response:', response)
    //         return response.json();
    //     })
    //         .then((resdata) => {
    //             console.log(resdata);
    //             //if (resdata.status == 'Success') {
    //             alert("OTP sent successfully")
    //             this.setState({ devicecode: resdata.device_code })
    //             //window.location.reload();
    //             // } else {
    //             //     alert("Issue: " + resdata.message);
    //             // }
    //         })

    // }

    // getDigiToken() {
    //     fetch(DIGIURL + '/oauth2/1/token', {
    //         method: 'post',
    //         // mode: 'cors', 
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Access-Control-Allow-Origin': 'https://api.digitallocker.gov.in/',
    //             "Access-Control-Allow-Credentials": "false",
    //         },
    //         body: JSON.stringify({
    //             "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
    //             "device_code": this.state.devicecode,
    //             "client_id": "8F9D5F8A",
    //             "dl_otp": this.state.otp
    //         })
    //     }).then(response => {
    //         console.log('Response:', response)
    //         return response.json();
    //     })
    //         .then((resdata) => {
    //             console.log(resdata);
    //             //if (resdata.status == 'Success') 
    //             //{
    //             this.setState({ accesstoken: resdata.access_token })
    //             this.getIssuedDocuments();
    //             //window.location.reload();
    //             // } else {
    //             //     alert("Issue: " + resdata.message);
    //             // }
    //         })
    // }

    // getIssuedDocuments() {
    //     fetch(DIGIURL + '/oauth2/2/files/issued', {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Access-Control-Allow-Origin': 'https://api.digitallocker.gov.in/',
    //             "Access-Control-Allow-Credentials": "false",
    //             'Authorization': "Bearer " + this.state.accesstoken
    //         }
    //     }).then(response => {
    //         console.log('Response:', response)
    //         return response.json();
    //     }).then((resdata) => {
    //         console.log(resdata);
    //         // if (resdata.status == 'Success') {
    //         //  window.location.reload();
    //         // if (resdata.doctype == "PANCR") {
    //         //     if (resdata.uri != null) {
    //         //         this.getDataInXML(this.state.uriData);
    //         //     }
    //         //     else {
    //         //         console.log(this.state.uriData = "empty");
    //         //     }
    //         // }
    //         this.setState({
    //             documents: resdata.items.map((data) => {

    //                 if (data.doctype == "ADHAR") {
    //                     this.setState({ uriData: data.uri });
    //                     console.log(this.state.uriData);

    //                     // if (this.state.uriData != null) {
    //                     this.getDataInXML(this.state.uriData);
    //                     // }
    //                     // else {
    //                     //     console.log(this.state.uriData = "empty");
    //                     // }

    //                 }

    //             })
    //         })
    //         // } else {
    //         //     alert("Issue: " + resdata.message);
    //         // }
    //     })
    // }



    // getDataInXML(uridata) {
    //     //this.setState({ uriData: uridata });
    //     // console.log("UriData assign:"+ uriData)
    //     console.log("UriData passed:" + uridata)
    //     fetch(DIGIURL + '/oauth2/1/xml/' + uridata, {
    //         headers: {
    //             'Accept': 'application/xml',
    //             'Content-Type': 'application/xml',
    //             'Access-Control-Allow-Origin': 'https://api.digitallocker.gov.in/',
    //             "Access-Control-Allow-Credentials": "false",
    //             'Authorization': "Bearer " + this.state.accesstoken
    //         }
    //     }).then(response => {
    //         console.log('Response:', response)
    //         return response;
    //     }).then((resdata) => {
    //         console.log(resdata);
    //         this.setState({ xmlData: resdata })
    //         console.log(this.state.xmlData);
    //         let data = JSON.stringify(resdata)
    //         console.log("results", data);

    //         parseString(this.state.xmlData, (err, results) => {
    //             let data = JSON.stringify(results)
    //             console.log("results", data);
    //         });

    //     })
    // }

