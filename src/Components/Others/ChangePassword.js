import React, { Component } from 'react';
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { BASEURL } from '../assets/baseURL';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import SimpleReactValidator from 'simple-react-validator';
import Loader from '../Loader/Loader';
import { FaAngleLeft } from "react-icons/fa";

let user;

if (sessionStorage.getItem('userType') == 2) {
    user = "LND-";
} else if (sessionStorage.getItem('userType') == 3) {
    user = "BOR-";
} else if (sessionStorage.getItem('userType') == 4) {
    user = "FAC-";
} else if (sessionStorage.getItem('userType') == 5) {
    user = "EVL-";
} else if (sessionStorage.getItem('userType') == 1) {
    user = "SYSUSER-";
} else if (sessionStorage.getItem('userType') == 0) {
    user = "ADMIN-";
}
console.log(user);
var matchPassword = true;
var loginNameEncoded = "";
var convertednewPw = "";
var convertedcnfPw = "";
var convertedoldPw = "";

class ChangePassword extends Component {
    //updated
    constructor(props) {
        super(props)
        this.state = {
            user: '',
            usertype: "",
            loginname: sessionStorage.getItem('userID'),
            oldpassword: "",
            newpassword: "",
            confirmpassword: "",
            mobileotp: "",
            mobileotpref: "",
            isMobileOrEmail: false,

            Emobref: "",
            Eemailref: "",

            isPasswordShown: false,
            isPasswordShown2: false,
            isPasswordShown3: false,

            showLoader: false,
            matchPassword: true,
            constRespMsg: "",

            invalidPassword1: false,
            invalidPassword2: false,
            invalidPassword3: false,

            secretKey: ""
        }

        //this.loginname = this.loginname.bind(this);
        this.mobileotp = this.mobileotp.bind(this);
        this.oldpassword = this.oldpassword.bind(this);
        this.newpassword = this.newpassword.bind(this);
        this.confirmpassword = this.confirmpassword.bind(this);
        this.getCPOtp = this.getCPOtp.bind(this);
        this.validateCP = this.validateCP.bind(this);
        this.onEmailMobileLogin = this.onEmailMobileLogin.bind(this);
        this.validator = new SimpleReactValidator();
    }
    componentDidMount() {
        // $(".otpButton").click(function () {
        //     $(".otpField").show();
        // })
        console.log(this.state.user)

        // $('#chPwSubmitBtn').prop('disabled', true)
        matchPassword = true;
        $("#validateCPBtn").prop('disabled', true)

        // usertype: sessionStorage.getItem('userType')

        var convertUsername = btoa(this.state.loginname);
        console.log(convertUsername);
        this.setState({ loginname: convertUsername })

        this.setState({ secretKey: sessionStorage.getItem('secretKey') })
        console.log(this.state.secretKey)
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

    mobileotp = (mobileotp) => {
        this.setState({ mobileotp })
        $("#validateCPBtn").prop('disabled', false)
    }
    oldpassword(event) {
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        var eventInput = event.target.value;
        if (regex.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidPassword1: false })
            this.setState({ oldpassword: event.target.value })
        } else {
            this.setState({ invalidPassword1: true })
        }
    }
    newpassword(event) {
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        var eventInput = event.target.value;
        if (regex.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidPassword2: false })
            this.setState({ newpassword: event.target.value })
        } else {
            this.setState({ invalidPassword2: true })
        }
    }
    confirmpassword(event) {
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        var eventInput = event.target.value;
        if (regex.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidPassword3: false })
            this.setState({ confirmpassword: event.target.value })
        } else {
            this.setState({ invalidPassword3: true })
        }
    }

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
    validatePassword = (e) => {
        var { oldpassword, newpassword, confirmpassword } = this.state;

        if (oldpassword === newpassword) {
            this.setState({ matchPassword: true, constRespMsg: "Old password cannot match the new password ." },
                () => {
                    console.log(this.state.matchPassword);
                    console.log(this.state.constRespMsg);
                    this.getCPOtp();
                });
            console.log("first")
        } else if (newpassword !== confirmpassword) {
            this.setState({ matchPassword: true, constRespMsg: "New password is not matching confirm password." },
                () => {
                    console.log(this.state.matchPassword);
                    console.log(this.state.constRespMsg);
                    this.getCPOtp();
                });
            console.log("second")
        } else if (oldpassword === confirmpassword) {
            this.setState({ matchPassword: true, constRespMsg: "Old password cannot match the confirm password." },
                () => {
                    console.log(this.state.matchPassword);
                    console.log(this.state.constRespMsg);
                    this.getCPOtp();
                });
            console.log("third")
        } else if (!oldpassword || !newpassword || !confirmpassword) {
            this.setState({
                matchPassword: true,
                constRespMsg: "Please fill in all password fields."
            },
                () => {
                    console.log(this.state.matchPassword);
                    console.log(this.state.constRespMsg);
                    this.getCPOtp();
                });
            console.log("Please fill in all password fields.");
            return;
        } else {
            this.setState({
                matchPassword: false,
                oldpassword: oldpassword,
                newpassword: newpassword,
                confirmpassword: confirmpassword,
            }, () => {
                console.log(this.state.matchPassword);
                console.log(this.state.oldpassword, this.state.newpassword, this.state.confirmpassword);
                this.getCPOtp();
            });
            console.log('Form submitted:', this.state);
        }

    }
    getCPOtp = async (event) => {
        // $('.otpField').toggle();
        // $(".otpButton").toggle();
        console.log(this.state.matchPassword)
        if (this.state.matchPassword == true) {
            confirmAlert({
                message: this.state.constRespMsg,
                buttons: [
                    {
                        label: "Okay",
                        onClick: () => {

                        },
                    },
                ],
            });
        } else {
            console.log(this.state.oldpassword,
                this.state.newpassword,
                this.state.confirmpassword
            )
            console.log("success")

            var convertUsername = btoa(sessionStorage.getItem('loginNumber'));
            console.log(convertUsername);
            loginNameEncoded = convertUsername;
            console.log(loginNameEncoded)

            //Encryption
            var preLoginJson = JSON.stringify({
                loginname: loginNameEncoded
            })
            // convert json to string
            preLoginJson.toString();
            console.log(preLoginJson)
            var convertedEncrypt;

            console.log(this.state.secretKey)
            var encD1 = await this.encryptSecretKeyUsingAES(this.state.secretKey, preLoginJson);
            console.log(encD1);
            convertedEncrypt = JSON.stringify({
                encrypteddata: encD1
            })
            console.log(convertedEncrypt);

            var decryptData = await this.decryptSecretKeyUsingAES(this.state.secretKey, encD1);
            console.log(decryptData);
            this.setState({ showLoader: true })
            fetch(BASEURL + '/usrmgmt/getchangepasswordotp', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'isencrypted': 'true',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    encrypteddata: encD1
                })
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
                .then((resdata) => {
                    console.log(resdata);
                    if (resdata.status == 'Success') {
                        this.setState({ showLoader: false })
                        $('.otpField').show();
                        sessionStorage.setItem('mobRef', resdata.msgdata.mobileref);
                        sessionStorage.setItem('emailRef', resdata.msgdata.emailref);

                        this.setState({ Emobref: resdata.msgdata.mobileref })
                        this.setState({ Eemailref: resdata.msgdata.emailref })

                        var timeleft = 30;
                        var downloadTimer = setInterval(function () {
                            if (timeleft < 0) {
                                clearInterval(downloadTimer);
                                document.getElementById("countdown2").innerHTML = "Resend OTP";
                                $('#countdown').hide()
                                $('#countdown2').show()

                            } else {
                                document.getElementById("countdown").innerHTML = "Resend OTP in " + timeleft+"s";
                                $('#countdown2').hide()
                                $('#countdown').show()
                            }
                            timeleft -= 1;
                        }, 1000);
                        confirmAlert({
                            message: "An OTP is sent to registered mobile number",
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        $(".otpButton").hide();
                                    },
                                },
                            ],
                        });
                    }
                    else {
                        // alert("Issue: " + resdata.message);
                        this.setState({ showLoader: false })
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        // $('.otpField').toggle();
                                        // $(".otpButton").toggle();
                                        //window.location.reload()
                                    },
                                },
                            ],
                        });
                    }
                }).catch((error) => {
                    console.log(error);
                });
        }
    }
    // Encrypt/decrypt key
    encryptSecretKeyUsingAES = async (secretKey, json) => {
        console.log(secretKey, json)
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
    regenerateOTP = () => {
        fetch(BASEURL + '/usrmgmt/regenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                operationtype: 12,
                emailref: String(this.state.Eemailref),
                mobileref: String(this.state.Emobref),
                otpmode: "1"
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    // alert(resdata.message);
                    this.setState({ Emobref: resdata.msgdata.mobileref })
                    this.setState({ Eemailref: resdata.msgdata.emailref })

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
                            document.getElementById("countdown").innerHTML = "Resend OTP in " + timeleft+"s";
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

    validateCP = async (event) => {
        var convertNewpW = btoa(this.state.newpassword);
        var convertCnfpW = btoa(this.state.confirmpassword);
        var convertOldpW = btoa(this.state.oldpassword);
        console.log(convertNewpW, convertCnfpW, convertOldpW);
        convertednewPw = convertNewpW;
        convertedcnfPw = convertCnfpW;
        convertedoldPw = convertOldpW;

        console.log(loginNameEncoded)

        this.setState({ showLoader: true })
        //Encryption
        var preLoginJson = JSON.stringify({
            loginname: loginNameEncoded,
            mobileotp: parseInt(this.state.mobileotp),
            mobileref: parseInt(sessionStorage.getItem("mobRef")),
            newpassword: convertednewPw,
            confirmpassword: convertedcnfPw,
            oldpassword: convertedoldPw,
        })
        // convert json to string
        preLoginJson.toString();
        console.log(preLoginJson)
        var convertedEncrypt;

        console.log(this.state.secretKey)
        var encD1 = await this.encryptSecretKeyUsingAES(this.state.secretKey, preLoginJson);
        console.log(encD1);
        convertedEncrypt = JSON.stringify({
            encrypteddata: encD1
        })
        console.log(convertedEncrypt);

        var decryptData = await this.decryptSecretKeyUsingAES(this.state.secretKey, encD1);
        console.log(decryptData);
        fetch(BASEURL + '/usrmgmt/changepassword', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'isencrypted': 'true',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: convertedEncrypt
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    this.setState({ showLoader: false })
                    confirmAlert({
                        message: resdata.message+", Please logout and login again.",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    // sessionStorage.removeItem('status')
                                    // window.location = '/login';
                                    if (sessionStorage.getItem('userType') == 2) {
                                        window.location = "/lenderdashboard";
                                    } else if (sessionStorage.getItem('userType') == 3) {
                                        window.location = "/borrowerdashboard";
                                    } else if (sessionStorage.getItem('userType') == 4) {
                                        window.location = "/facilitatorDashboard";
                                    } else if (sessionStorage.getItem('userType') == 5) {
                                        window.location = "/evaluatorDashboard";
                                    } else if (sessionStorage.getItem('userType') == 1) {
                                        window.location = "/sysUserDashboard";
                                    } else if (sessionStorage.getItem('userType') == 0) {
                                        window.location = "/landing";
                                    }
                                },
                            },
                        ],
                    });

                }
                else {
                    // alert("Issue: " + resdata.message);
                    this.setState({ showLoader: false })
                    confirmAlert({
                        message: "Issue: " + resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location.reload()
                                },
                            },
                        ],
                    });
                }

            })
    }
    togglePasswordVisiblity = () => {
        const { isPasswordShown } = this.state;
        this.setState({ isPasswordShown: !isPasswordShown });
    };
    togglePasswordVisiblity2 = () => {
        const { isPasswordShown2 } = this.state;
        this.setState({ isPasswordShown2: !isPasswordShown2 });
    };
    togglePasswordVisiblity3 = () => {
        const { isPasswordShown3 } = this.state;
        this.setState({ isPasswordShown3: !isPasswordShown3 });
    };

    backFromChangePassword = () => {
        if (sessionStorage.getItem('userType') == 2) {
            window.location = "/lenderdashboard";
        } else if (sessionStorage.getItem('userType') == 3) {
            window.location = "/borrowerdashboard";
        } else if (sessionStorage.getItem('userType') == 4) {
            window.location = "/facilitatorDashboard";
        } else if (sessionStorage.getItem('userType') == 5) {
            window.location = "/evaluatorDashboard";
        } else if (sessionStorage.getItem('userType') == 1) {
            window.location = "/sysUserDashboard";
        } else if (sessionStorage.getItem('userType') == 0) {
            window.location = "/landing";
        } else {
            window.location = "/";
        }
    }
    render() {
        const { isPasswordShown } = this.state;
        const { isPasswordShown2 } = this.state;
        const { isPasswordShown3 } = this.state;


        var oPW = this.state.oldpassword;
        var nPW = this.state.newpassword;
        var cnPW = this.state.confirmpassword;

        // if (oPW && nPW && cnPW) {
        //     $('#chPwSubmitBtn').prop('disabled', false)
        // } else 
        // if (oPW == "" || nPW == "" || cnPW == "") {
        //     $('#chPwSubmitBtn').prop('disabled', true)
        // }
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
        var passwdMsg = '(One capital letter, one small letter, one number and one special character is compulsory, space not allowed).';
        return (
            <div style={{ paddingLeft: "24%", paddingRight: "24%", paddingTop: "5px" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <div className="container">
                    <div className="row d-flex justify-content-center" >
                        <div className="col-md-12 ">
                            <div className="card" style={{ width: "100%", cursor: "default", boxShadow: "5px 10px 18px #888888" }}>
                                <div className="credentials" style={{ padding: "10px 50px" }}>
                                    <div style={{ textAlign: "initial", marginBottom: "-34px", marginLeft: "-15px" }}>
                                        <button style={myStyle} onClick={this.backFromChangePassword}>
                                            <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                        </button>
                                    </div>


                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingTop: "15px", }}>
                                        <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                        <div>
                                            <h4 className="heading1" style={{ color: "#00264d" }}>
                                                Change Password
                                            </h4>
                                        </div>
                                        <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                    </div>
                                    <div className="row">
                                        <div className="col" id="chgpwd">
                                            <label className="u1" style={{ color: "#002640", fontWeight: "bold", fontSize: "18px" }}>
                                                Enter Old Password
                                            </label>
                                            <div style={{ marginTop: "-10px" }}>
                                                <input type={isPasswordShown ? "text" : "password"}
                                                    className="input"
                                                    name='old-password'
                                                    onChange={this.oldpassword} autoComplete="off"
                                                    style={{
                                                        height: "40px",
                                                        borderRadius: "5px",
                                                        backgroundColor: "whitesmoke"
                                                    }}
                                                    minLength={8}
                                                    maxLength={25}
                                                    placeholder="Enter Old Password"
                                                />
                                                {(this.state.invalidPassword1) ? <span className='text-danger'>Invalid Password</span> : ''}

                                                {this.validator.message('password', this.state.oldpassword, 'required|password|min:5|max:50', { className: 'text-danger' })}
                                                <i style={{ position: "absolute", right: "10px", top: "16px" }} className={`fa ${isPasswordShown ? "fa-eye" : "fa-eye-slash"} password-icon`}
                                                    onClick={this.togglePasswordVisiblity} />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col" id="chgpwd1">
                                            <label className="u1" style={{ color: "#002640", fontWeight: "bold", fontSize: "18px" }}>
                                                Enter New Password
                                            </label>
                                            <div style={{ marginTop: "-10px" }}>
                                                <input type={isPasswordShown2 ? "text" : "password"}
                                                    className="input"
                                                    name='password'
                                                    onChange={this.newpassword} autoComplete="off"
                                                    style={{
                                                        height: "40px",
                                                        borderRadius: "5px",
                                                        backgroundColor: "whitesmoke"
                                                    }}
                                                    minLength={4}
                                                    placeholder="Enter New Password"
                                                />
                                                {(this.state.invalidPassword2) ? <span className='text-danger'>Invalid Password</span> : ''}
                                                {this.validator.message('password', this.state.newpassword, 'required|password|min:5|max:50', { className: 'text-danger' })}
                                                <i style={{ position: "absolute", right: "10px", top: "16px" }} className={`fa ${isPasswordShown2 ? "fa-eye" : "fa-eye-slash"} password-icon`}
                                                    onClick={this.togglePasswordVisiblity2} />
                                            </div>
                                            <p style={{ fontSize: "13px", fontFamily: 'Poppins,sans-serif', color: 'GrayText' }}>{passwdMsg}</p>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col" id="chgpwd">
                                            <label className="u1" style={{ color: "#002640", fontWeight: "bold", fontSize: "18px" }}>
                                                Confirm Password
                                            </label>
                                            <div style={{ marginTop: "-10px" }}>
                                                <input type={isPasswordShown3 ? "text" : "password"}
                                                    className="input"
                                                    name='confirm-password'
                                                    onChange={this.confirmpassword} autoComplete="off"
                                                    style={{
                                                        height: "40px",
                                                        borderRadius: "5px",
                                                        backgroundColor: "whitesmoke"
                                                    }}
                                                    minLength={8}
                                                    maxLength={25}
                                                    placeholder="Confirm Password"
                                                />
                                                {(this.state.invalidPassword3) ? <span className='text-danger'>Invalid Password</span> : ''}
                                                {this.validator.message('password', this.state.confirmpassword, 'required|password|min:5|max:50', { className: 'text-danger' })}
                                                <i style={{ position: "absolute", right: "10px", top: "16px" }} className={`fa ${isPasswordShown3 ? "fa-eye" : "fa-eye-slash"} password-icon`}
                                                    onClick={this.togglePasswordVisiblity3} />

                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className=' col' style={{ paddingTop: "14px" }}>
                                            <button className="btn col otpButton text-white" id='chPwSubmitBtn' onClick={this.validatePassword} value="submit" style={{ backgroundColor: "#222C70" }}>Submit</button>
                                            <span>
                                                <p id="countdown" style={{ color: "grey" }}></p>
                                                <p id='countdown2' onClick={this.regenerateOTP} style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}></p>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="otpField row mb-3" style={{ display: "none" }}>
                                        <div className="col-6" id="chgpwd2">
                                            <label className="u1" style={{ color: "#00264d", fontWeight: "bold", fontSize: "18px", }}>
                                                Enter OTP
                                            </label>
                                            <div>
                                                <OtpInput
                                                    value={this.state.mobileotp}
                                                    onChange={this.mobileotp}
                                                    id="pswd"
                                                    numInputs={6}
                                                    separator={<span>-</span>}
                                                    inputStyle={{ width: "40px", height: "45px" }}
                                                    isInputNum
                                                />
                                            </div>

                                        </div>
                                        <div className="col-6" id="validateCP">
                                            <button className="btn col text-white" id="validateCPBtn" onClick={this.validateCP} value="submit" style={{ marginTop: "36px", backgroundColor: "#222C70" }}>Validate OTP</button>
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

export default ChangePassword
