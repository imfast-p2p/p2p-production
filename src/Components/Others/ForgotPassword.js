import React, { Component } from 'react';
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { BASEURL } from '../assets/baseURL';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import SimpleReactValidator from 'simple-react-validator';
import { FaAngleLeft } from "react-icons/fa";
import JSEncrypt from 'jsencrypt';
import Loader from '../Loader/Loader';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { BsInfoCircle } from "react-icons/bs";

//updated
var matchPassword;
var loginNameEncoded = "";
var passwordEncoded = "";

var secretKey;
var refNo;
class ForgotPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loginname: '',
            mobileotp: 894448,
            mobileref: 1244149,
            password: "",
            cnfPassword: '',
            username: '',
            utype: 2,
            user: '',

            isPasswordShown: false,
            isPasswordShown2: false,
            isMobileOrEmail: false,

            invalidPassword1: false,
            invalidPassword2: false,

            publicKey: "",
            privateKey: "",

            secretKey: "",
            referenceNo: "",
            showLoader: false,
            getOtpBtn: true
        }

        this.loginname = this.loginname.bind(this);
        this.mobileotp = this.mobileotp.bind(this);
        this.password = this.password.bind(this);
        this.getFPOtp = this.getFPOtp.bind(this);
        this.validateFP = this.validateFP.bind(this);
        this.user = this.user.bind(this);
        this.validator = new SimpleReactValidator();
        this.enterKey = this.enterKey.bind(this);
        this.onEmailMobileLogin = this.onEmailMobileLogin.bind(this);
    }
    componentDidMount() {
        if (this.props.location.frompath == "login") {
            if (this.props.location && this.props.location.state && this.props.location.state.forgotPw) {
                var propsLocation = this.props.location.state.forgotPw;
                this.setState({ loginname: propsLocation.username }, () => {
                    this.setState({ getOtpBtn: false })
                })
                this.setState({ utype: propsLocation.usertype })
                console.log(propsLocation.username)
                let usePrefix = "";
                this.setState({ isMobileOrEmail: true })
                if (!this.state.isMobileOrEmail) {
                    if (propsLocation.usertype == 2) {
                        this.setState({ user: "LND-" })
                        usePrefix = this.state.user;
                    } else if (propsLocation.usertype == 3) {
                        this.setState({ user: "BOR-" })
                        usePrefix = this.state.user;
                    } else if (propsLocation.usertype == 4) {
                        this.setState({ user: "FAC-" })
                        usePrefix = this.state.user;
                    } else if (propsLocation.usertype == 5) {
                        this.setState({ user: "EVL-" })
                        usePrefix = this.state.user;
                    }
                } else if (this.state.loginname[0] == 0) {
                    if (propsLocation.usertype == 2) {
                        this.setState({ user: "LND-" })
                        usePrefix = this.state.user;
                    } else if (propsLocation.usertype == 3) {
                        this.setState({ user: "BOR-" })
                        usePrefix = this.state.user;
                    } else if (propsLocation.usertype == 4) {
                        this.setState({ user: "FAC-" })
                        usePrefix = this.state.user;
                    } else if (propsLocation.usertype == 5) {
                        this.setState({ user: "EVL-" })
                        usePrefix = this.state.user;
                    }
                } else if (this.state.loginname[0] in [6, 7, 8, 9]) {
                    usePrefix = ""
                    this.setState({ isMobileOrEmail: false })
                }
                return usePrefix;
            }
        }
        console.log(sessionStorage.getItem('secretReferenceno'),
            sessionStorage.getItem('secretKey'))
    }

    loginname(event) {
        //this.setState({ loginname: event.target.value.toUpperCase().trim() })
        this.setState({
            loginname: event.target.value,
        })
        if (event.target.value == "") {
            this.setState({ getOtpBtn: true })
        }
        else {
            this.setState({ getOtpBtn: false })
        }
    }
    mobileotp(event) {
        this.setState({ mobileotp: event.target.value })
    }
    password(event) {
        // this.setState({ password: event.target.value })
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        var eventInput = event.target.value;
        if (regex.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidPassword1: false })
            this.setState({ password: event.target.value })
        } else {
            this.setState({ invalidPassword1: true })
        }

        var password = document.getElementsByName('password')[0].value;
        var confirmPass = document.getElementsByName('confirm-password')[0].value;

        if (password != confirmPass) {
            matchPassword = true;
        } else if (password == confirmPass) {
            matchPassword = false;
        }

        console.log(matchPassword)

    }
    confirmPw = (e) => {
        // this.setState({ cnfPassword: e.target.value });
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        var eventInput = e.target.value;
        if (regex.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidPassword2: false })
            this.setState({ cnfPassword: e.target.value })
        } else {
            this.setState({ invalidPassword2: true })
        }
        var password = document.getElementsByName('password')[0].value;
        var confirmPass = document.getElementsByName('confirm-password')[0].value;

        if (password != confirmPass) {
            matchPassword = true;
        } else if (password == confirmPass) {
            matchPassword = false;
        }


        console.log(matchPassword)
    }
    user(event) {
        // this.setState({ utype: event.target.value });
        // console.log(event.target.value);
        if (event.target.value == "Lender") {
            this.setState({ user: "LND-" })
            this.setState({ utype: 2 });
            console.log(event.target.value)
        }
        else if (event.target.value == "Borrower") {
            this.setState({ user: "BOR-" })
            this.setState({ utype: 3 });
            console.log(event.target.value)

        }
        else if (event.target.value == "Facilitator") {
            this.setState({ user: "FAC-" })
            this.setState({ utype: 4 });
            console.log(event.target.value)

        }
        else if (event.target.value == "Evaluator") {
            this.setState({ user: "EVL-" })
            this.setState({ utype: 5 });
            console.log(event.target.value)

        }
    }
    enterKey(event) {
        if (event.keyCode === 13) {
            // alert('enter')
            //this.login(event);
        }
    }
    togglePasswordVisiblity = () => {
        const { isPasswordShown } = this.state;
        this.setState({ isPasswordShown: !isPasswordShown });
    };
    togglePasswordVisiblity2 = () => {
        const { isPasswordShown2 } = this.state;
        this.setState({ isPasswordShown2: !isPasswordShown2 });
    };
    getPrefix() {
        let userPrefix = "";
        if (!this.state.isMobileOrEmail) {
            userPrefix = this.state.user;
        } else if (this.state.loginname[0] == 0) {
            userPrefix = this.state.user;
        } else if (this.state.loginname[0] in [6, 7, 8, 9]) {
            userPrefix = ""
        }
        return userPrefix;
    }
    onEmailMobileLogin() {
        if (!isNaN(this.state.loginname)) {
            // mobile number
            this.setState({ isMobileOrEmail: true });
            // this.setState({ user: "" });
        } else if (this.state.loginname.indexOf('@') > -1) {
            // email
            this.setState({ isMobileOrEmail: true });
            // this.setState({ user: "" });
        } else {
            // pan
            this.setState({ isMobileOrEmail: false });
        }
        console.log(this.state.user);
    }
    getFPOtp(event) {
        // let usertype;

        // if (this.state.user == "LND-") {
        //     usertype = 2;
        // } else if (this.state.user == "BOR-") {
        //     usertype = 3;
        // }
        //console.log(usertype);

        //convert string to base64
        var convertUsername = btoa(this.state.loginname);
        console.log(convertUsername);
        loginNameEncoded = convertUsername;
        console.log(loginNameEncoded)
        fetch(BASEURL + '/usrmgmt/getforgotpasswordotp', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loginname: this.getPrefix() + loginNameEncoded,
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);

                if (resdata.status == 'Success') {
                    sessionStorage.setItem('mobRef', resdata.msgdata.mobileref);
                    this.setState({ mobileref: resdata.msgdata.mobileref });
                    this.setState({ emailref: resdata.msgdata.emailref });
                    var timeleft = 30;
                    var downloadTimer = setInterval(function () {
                        if (timeleft < 0) {
                            clearInterval(downloadTimer);
                            document.getElementById("countdown2").innerHTML = "Resend OTP";
                            $('#countdown').hide()
                            $('#countdown2').show()

                        } else {
                            document.getElementById("countdown").innerHTML = "Resend OTP in " + timeleft + "s";
                            $('#countdown2').hide()
                            $('#countdown').show()
                        }
                        timeleft -= 1;
                    }, 1000);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    $('.otpField').toggle();
                                    $(".otpButton").toggle();
                                },
                            },
                        ],
                    });
                }
                else {
                    // alert("Issue: " + resdata.message);
                    confirmAlert({
                        message: "Issue: " + resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    //window.location.reload()
                                },
                            },
                        ],
                    });
                }


            })
    }
    regenerateOTP = () => {
        fetch(BASEURL + '/usrmgmt/regenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operationtype: 2,
                emailref: this.state.emailref,
                mobileref: this.state.mobileref,
                otpmode: "3"
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    // alert(resdata.message);
                    this.setState({ mobileref: resdata.msgdata.mobileref });
                    this.setState({ emailref: resdata.msgdata.emailref });

                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                },
                            },
                        ],
                    });

                    var timeleft = 30;
                    var downloadTimer = setInterval(function () {
                        if (timeleft < 0) {
                            clearInterval(downloadTimer);
                            document.getElementById("countdown2").innerHTML = "Resend OTP";
                            $('#countdown').hide()
                            $('#countdown2').show()

                        } else {
                            document.getElementById("countdown").innerHTML = "Resend OTP in " + timeleft + "s";
                            $('#countdown2').hide()
                            $('#countdown').show()
                        }
                        timeleft -= 1;
                    }, 1000);


                }
                else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                },
                            },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // Encrypt/decrypt key
    encryptSecretKeyUsingAES = async (secretKey, json) => {
        try {
            // Generate a random salt
            const salt = crypto.getRandomValues(new Uint8Array(16));

            // Generate a random IV
            const iv = crypto.getRandomValues(new Uint8Array(16));

            // Derive a key using PBKDF2
            const importedSecretKey = await crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(secretKey),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            );

            const derivedKey = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: 65536,
                    hash: "SHA-1"
                },
                importedSecretKey,
                { name: "AES-CBC", length: 256 },
                true,
                ["encrypt"]
            );

            // Encrypt the JSON string using AES with CBC mode and PKCS5Padding (or PKCS7Padding)
            const encryptedTextBuffer = await crypto.subtle.encrypt(
                {
                    name: "AES-CBC",
                    iv: iv
                },
                derivedKey,
                new TextEncoder().encode(json)
            );

            // Combine salt, IV, and ciphertext
            const combinedDataBuffer = new Uint8Array([...salt, ...iv, ...new Uint8Array(encryptedTextBuffer)]);

            // Encode the combined data to Base64
            const combinedData = btoa(String.fromCharCode.apply(null, combinedDataBuffer));
            return combinedData;
        } catch (error) {
            console.error('Encryption Error:', error);
            return null;
        }
    }
    decryptSecretKeyUsingAES = async (secretKey, combinedData) => {
        // var combinedData = "xngG5wx04MEJr3hq80vsKldj8/BebrztHPxE0h60r6UJmBKPz2GSwzwSSW1u/hHQJPDFMXMHix/nIlVNsp05mncxD0GKw93E6v542rhLD+uklhOe5P6GBljmrjN3tBjn";
        try {
            // Decode the combined data from Base64
            const combinedDataBytes = Uint8Array.from(atob(combinedData), c => c.charCodeAt(0));

            // Extract salt, IV, and ciphertext from the combined data
            const saltBytes = combinedDataBytes.slice(0, 16);
            const ivBytes = combinedDataBytes.slice(16, 32);
            const encryptedTextBytes = combinedDataBytes.slice(32);

            // Derive the key using PBKDF2
            const importedSecretKey = await crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(secretKey),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            );

            const derivedKey = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: saltBytes,
                    iterations: 65536,
                    hash: "SHA-1"
                },
                importedSecretKey,
                { name: "AES-CBC", length: 256 },
                true,
                ["decrypt"]
            );

            // Decrypt the ciphertext using AES with CBC mode and PKCS5Padding (or PKCS7Padding)
            const decryptedTextBuffer = await crypto.subtle.decrypt(
                {
                    name: "AES-CBC",
                    iv: ivBytes
                },
                derivedKey,
                encryptedTextBytes
            );

            // Convert the decrypted buffer to string
            const decryptedText = new TextDecoder().decode(decryptedTextBuffer);
            return decryptedText;
        } catch (error) {
            console.error('Decryption Error:', error);
            return null;
        }
    }
    validateFP = async (event) => {
        if (matchPassword == true) {
            confirmAlert({
                message: "Password is Invalid.",
                buttons: [
                    {
                        label: "Okay",
                        onClick: () => {

                        },
                    },
                ],
            });
        } else {
            this.setState({ showLoader: true });
            var convertpwsrd = btoa(this.state.password);
            console.log(convertpwsrd);
            passwordEncoded = convertpwsrd;

            //Encryption
            console.log(refNo)
            console.log(sessionStorage.getItem('secretKey'), sessionStorage.getItem('secretReferenceno'))
            var preLoginJson = JSON.stringify({
                loginname: this.getPrefix() + loginNameEncoded,
                mobileotp: parseInt(this.state.mobileotp),
                mobileref: this.state.mobileref,
                password: passwordEncoded
            })
            // convert json to string
            preLoginJson.toString();
            console.log(preLoginJson)
            var convertedEncrypt;

            console.log(sessionStorage.getItem('secretReferenceno'))
            var encD1 = await this.encryptSecretKeyUsingAES(sessionStorage.getItem('secretKey'), preLoginJson);
            console.log(encD1);
            convertedEncrypt = JSON.stringify({
                encrypteddata: encD1,
                referenceno: sessionStorage.getItem('secretReferenceno')
            })

            console.log(convertedEncrypt);
            fetch(BASEURL + '/usrmgmt/validateforgotpassword', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'isencrypted': 'true'
                },
                body: convertedEncrypt
            }).then(response => {
                console.log('Response:', response)
                return response.json();
            })
                .then((resdata) => {
                    console.log(resdata);
                    if (resdata.status == 'Success') {
                        this.setState({ showLoader: false });
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        sessionStorage.removeItem('status')
                                        window.location = '/login';
                                    },
                                },
                            ],
                        });
                        // window.location = '/login';
                    }
                    else {
                        this.setState({ showLoader: false });
                        confirmAlert({
                            message: "Issue: " + resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        // $('.otpField').toggle();
                                        // $(".otpButton").toggle();
                                        //window.location.reload();
                                    },
                                },
                            ],
                        });
                    }


                })
        }
    }
    onSelectOption() {
        $('.otpField').toggle();
    }
    routeToRegistration = () => {
        $("#registrationPage").click()
    }
    render() {
        const { isPasswordShown } = this.state;
        const { isPasswordShown2 } = this.state;
        const { t } = this.props

        const myStyle = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "4px 2px",
            cursor: "pointer",
            fontSize: "12px",
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            marginLeft: "14px"
        }
        var userType;
        if (this.state.utype == 2) {
            userType = "Lender"
        } else if (this.state.utype == 3) {
            userType = "Borrower"
        } else if (this.state.utype == 4) {
            userType = "Facilitator"
        } else if (this.state.utype == 5) {
            userType = "Evaluator"
        }
        var passwdMsg = '(One capital letter, one small letter, one number and one special character is compulsory, space not allowed).';
        // return (
        //     <div style={{ paddingLeft: "24%", paddingRight: "24%", paddingTop: "5px" }}>
        //         {
        //             this.state.showLoader && <Loader />
        //         }
        //         <div className="container">
        //             <div className="row d-flex justify-content-center" >
        //                 <div className="col-md-12 ">
        //                     <div className="card" style={{ width: "100%", cursor: "default", boxShadow: "5px 10px 18px #888888" }}>
        //                         <div className="credentials" style={{ padding: "10px 50px" }}>
        //                             <div style={{ textAlign: "initial", marginBottom: "-34px", marginLeft: "-15px" }}>
        //                                 <button style={myStyle}>
        //                                     <Link to="/login">
        //                                         <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span>
        //                                     </Link>
        //                                 </button>
        //                             </div>
        //                             <div style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingTop: "15px", }}>
        //                                 <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
        //                                 <div>
        //                                     <h4 className="heading1" style={{ color: "#00264d" }}>
        //                                         Forgot Password
        //                                     </h4>
        //                                 </div>
        //                                 <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
        //                             </div>

        //                             <div className="row">
        //                                 <div className="col" id='fgpsw2'>
        //                                     <label className="u1" style={{ color: "#00264d", fontWeight: "bold", fontSize: "18px", }}>
        //                                         Username/Mobile
        //                                     </label>
        //                                     <div>
        //                                         <input type="text" className="input" id='one'
        //                                             onChange={this.loginname} onKeyPress={this.onEmailMobileLogin}
        //                                             value={this.state.loginname}
        //                                             autoComplete="off"
        //                                             style={{
        //                                                 height: "40px",
        //                                                 borderRadius: "5px",
        //                                                 backgroundColor: "whitesmoke",
        //                                                 marginTop: "-10px"
        //                                             }}
        //                                             placeholder="Enter Username/Mobile"
        //                                         />
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                             <div className="row">
        //                                 <div className='col' style={{ paddingTop: "14px" }}>
        //                                     <button className='btn col otpButton' disabled={this.state.getOtpBtn} onClick={this.getFPOtp} style={{ backgroundColor: "rgb(40, 116, 166)", color: "white" }}>Get OTP</button>
        //                                     <span id='showCountDown'>
        //                                         <p id="countdown" style={{ color: "grey" }}></p>
        //                                         <p id='countdown2' onClick={this.regenerateOTP} style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}></p>
        //                                     </span>
        //                                 </div>
        //                             </div>
        //                             <div className="row mb-2 otpField" style={{ display: "none" }}>
        //                                 <div className="col" id='fgpsw3'>
        //                                     <label className="u1" style={{ color: "#00264d", fontWeight: "bold", fontSize: "18px", }}>
        //                                         Enter OTP
        //                                     </label>
        //                                     <div>
        //                                         <input type="number" className="input"
        //                                             onChange={this.mobileotp} autoComplete="off"
        //                                             style={{
        //                                                 height: "40px",
        //                                                 borderRadius: "5px",
        //                                                 backgroundColor: "whitesmoke",
        //                                                 marginTop: "-10px"
        //                                             }}
        //                                             placeholder="Enter OTP"
        //                                             onInput={(e) => {
        //                                                 e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
        //                                             }}
        //                                         />
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                             <div className="row mb-2 otpField" style={{ display: "none" }}>
        //                                 <div className="col" id='fgpsw4'>
        //                                     <label className="u1" style={{ color: "#00264d", fontWeight: "bold", fontSize: "18px", }}>
        //                                         Enter New Password
        //                                     </label>
        //                                     <div>
        //                                         <input type={isPasswordShown ? "text" : "password"}
        //                                             className="input" id='three'
        //                                             onChange={this.password} autoComplete="off"
        //                                             name='password'
        //                                             style={{
        //                                                 height: "40px",
        //                                                 borderRadius: "5px",
        //                                                 backgroundColor: "whitesmoke",
        //                                                 marginTop: "-10px"
        //                                             }}
        //                                             minLength={4}
        //                                             placeholder="Enter New Password"
        //                                         />
        //                                         {(this.state.invalidPassword1) ? <span className='text-danger'>Invalid Password</span> : ''}
        //                                         {this.validator.message('password', this.state.password, 'required|password|min:5|max:50', { className: 'text-danger' })}
        //                                         <i style={{ position: "absolute", right: "10px", top: "16px" }} className={`fa ${isPasswordShown ? "fa-eye" : "fa-eye-slash"} password-icon`}
        //                                             onClick={this.togglePasswordVisiblity} />
        //                                     </div>
        //                                     <p style={{ fontSize: "13px", fontFamily: 'Poppins,sans-serif', color: 'GrayText' }}>{passwdMsg}</p>
        //                                 </div>
        //                             </div>
        //                             <div className="row otpField" style={{ display: "none" }}>
        //                                 <div className="col" id='fgpsw5'>
        //                                     <label className="u1" style={{ color: "#00264d", fontWeight: "bold", fontSize: "18px", }}>
        //                                         Confirm New Password
        //                                     </label>
        //                                     <div>
        //                                         <input type={isPasswordShown2 ? "text" : "password"} className="input"
        //                                             onChange={this.confirmPw} autoComplete="off"
        //                                             name='confirm-password' id='four'
        //                                             style={{
        //                                                 height: "40px",
        //                                                 borderRadius: "5px",
        //                                                 backgroundColor: "whitesmoke",
        //                                                 marginTop: "-10px"
        //                                             }}
        //                                             minLength={4}
        //                                             placeholder="Enter Confirm Password"
        //                                         />
        //                                         {(this.state.invalidPassword2) ? <span className='text-danger'>Invalid Password</span> : ''}
        //                                         {this.validator.message('password', this.state.password, 'required|password|min:5|max:50', { className: 'text-danger' })}
        //                                         <i style={{ position: "absolute", right: "10px", top: "16px" }} className={`fa ${isPasswordShown2 ? "fa-eye" : "fa-eye-slash"} password-icon`}
        //                                             onClick={this.togglePasswordVisiblity2} />
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                             <div className="row otpField" style={{ display: "none" }}>
        //                                 <div className="col" id='fgpsw6'>
        //                                     <button className='btn col' onClick={this.validateFP} style={{ marginTop: "10px", backgroundColor: "rgb(40, 116, 166)", color: "white" }}>Reset Password</button>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>

        // )
        return (
            <div className="row">
                {
                    this.state.showLoader && <Loader />
                }
                <Container fluid className="d-flex justify-content-center">
                    <Row>
                        <Col>
                            <Card className="" style={{ width: "500px", paddingBottom: "10px", cursor: "default" }}>
                                <div style={{ textAlign: "initial", marginLeft: "5px" }}>
                                    <button style={myStyle} onClick={this.routeToRegistration}>
                                        <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                    </button>
                                </div>
                                <div
                                    style={{
                                        display: "flex", flexDirection: "row",
                                        alignItems: "center",
                                        marginTop: "-10px",
                                        paddingLeft: "20px",
                                        paddingRight: "20px",
                                    }}
                                >
                                    <div
                                        style={{
                                            flex: 1,
                                            height: "3px",
                                            backgroundColor: "#004d99",
                                        }}
                                    />
                                    <div>
                                        <h4 className="heading1" style={{
                                            color: "#00264d",
                                            fontSize: "15px",
                                            fontFamily: "Poppins,sans-serif",
                                            fontWeight: "600"
                                        }}>
                                            Forgot Password
                                        </h4>
                                    </div>
                                    <div
                                        style={{
                                            flex: 1,
                                            height: "3px",
                                            backgroundColor: "#004d99",
                                        }}
                                    />
                                </div>
                                <div className="row mb-2" id='' style={{ padding: "0px 20px" }}>
                                    <div className="col">
                                        <label
                                            className="u1"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Username/Mobile *
                                        </label>
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                onChange={this.loginname} onKeyPress={this.onEmailMobileLogin}
                                                value={this.state.loginname}
                                                autoComplete="off"
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Enter Username/Mobile"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row" style={{ padding: "0px 20px" }}>
                                    <div className='col'>
                                        <button className="btn" style={{ width: "-webkit-fill-available", backgroundColor: "rgb(40, 116, 166)", color: "white" }} disabled={this.state.getOtpBtn} onClick={this.getFPOtp}>Get OTP</button>
                                        <span id='showCountDown'>
                                            <p id="countdown" style={{ color: "grey" }}></p>
                                            <p id='countdown2' onClick={this.regenerateOTP} style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}></p>
                                        </span>
                                    </div>
                                </div>
                                <div className="row mb-2 otpField" id='' style={{ padding: "0px 20px", display: "none" }}>
                                    <div className="col">
                                        <label
                                            className="u1"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Enter OTP *
                                        </label>
                                        <div>
                                            <input
                                                type="number"
                                                className="form-control"
                                                onChange={this.mobileotp} autoComplete="off"
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Enter OTP"
                                                onInput={(e) => {
                                                    e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2 otpField" id='' style={{ padding: "0px 20px", display: "none" }}>
                                    <div className="col">
                                        <label
                                            className="u1"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Enter Password *
                                        </label>
                                        <div>
                                            <input
                                                type={isPasswordShown ? "text" : "password"}
                                                className="form-control"
                                                onChange={this.password} autoComplete="off"
                                                name='password'
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                minLength={4}
                                                placeholder="Enter New Password"
                                            />
                                            {(this.state.invalidPassword1) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Password</span> : ''}
                                            {this.validator.message('password', this.state.password, 'required|password|min:5|max:50', { className: 'text-danger' })}
                                            <i style={{ position: "absolute", right: "10px", top: "16px" }} className={`fa ${isPasswordShown ? "fa-eye" : "fa-eye-slash"} password-icon`}
                                                onClick={this.togglePasswordVisiblity} />
                                        </div>
                                        <p style={{ fontSize: "13px", fontFamily: 'Poppins,sans-serif', color: 'GrayText' }}>{passwdMsg}</p>
                                    </div>
                                </div>
                                <div className="row mb-2 otpField" id='' style={{ padding: "0px 20px", display: "none" }}>
                                    <div className="col">
                                        <label
                                            className="u1"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Confirm Password *
                                        </label>
                                        <div>
                                            <input
                                                type={isPasswordShown2 ? "text" : "password"}
                                                className="form-control"
                                                onChange={this.confirmPw} autoComplete="off"
                                                name='confirm-password'
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                minLength={4}
                                                placeholder="Enter Confirm Password"
                                            />
                                            {(this.state.invalidPassword2) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Password</span> : ''}
                                            {this.validator.message('password', this.state.password, 'required|password|min:5|max:50', { className: 'text-danger' })}
                                            <i style={{ position: "absolute", right: "10px", top: "16px" }} className={`fa ${isPasswordShown2 ? "fa-eye" : "fa-eye-slash"} password-icon`}
                                                onClick={this.togglePasswordVisiblity2} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row otpField" id='' style={{ padding: "0px 20px", display: "none" }}>
                                    <div className="col">
                                        <button className='btn' onClick={this.validateFP} style={{ width: "-webkit-fill-available", marginTop: "10px", backgroundColor: "rgb(40, 116, 166)", color: "white" }}>Reset Password</button>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                {/* Route to Registration */}
                <Link to="/login"><button id='registrationPage' style={{ display: "none" }}>Registration
                </button></Link>
            </div>
        )
    }
}

export default withTranslation()(ForgotPassword)
