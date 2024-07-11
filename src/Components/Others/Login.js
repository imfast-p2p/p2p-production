import React, { Component } from 'react';
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { BASEURL } from '../assets/baseURL';
import SimpleReactValidator from 'simple-react-validator';
//import BorrowerDetails from './BorrowerDetails';
import { Link } from 'react-router-dom';
import image from '../assets/security-system.gif';
import './Login.css';
import { withTranslation } from 'react-i18next';
import OtpInput from 'react-otp-input';
import im from "../assets/Login-img.png";
import $ from 'jquery';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import Loader from '../Loader/Loader';
import {
    FaMoneyBillAlt,
    FaMoneyCheck,
    FaServer,
    FaTasks,
    FaUserCog,
    FaUserPlus,
    FaArrowLeft,
    FaAngleLeft
} from 'react-icons/fa';
import logo from '../assets/logoP2P2.png';
import logo2 from '../assets/jlgIcon/idlpJLG.png';
import { BsInfoCircle } from "react-icons/bs";
import { Card, Container, Row, Col } from 'react-bootstrap';
//updated
var encodeUsername;
var encodeUserpassword;
var myTimeout;

var secretKey;
var refNo;

var publicKey;
var privateKey;

var downloadTimer;
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAuthenticated: false,
            username: sessionStorage.getItem('username'),
            user: 'LND-',
            userpassword: '',
            usertype: '',
            accesstoken: '',
            mobileotp: "",
            mobileotpref: "",
            loginmode: 2,
            isMobileOrEmail: false,
            isPasswordShown: false,
            kycVerified: 0,
            isEmailOTP: false,
            isAccountVerified: 0,
            isLogin: "false",

            preaccessToken: "",
            preuserType: "",
            postaccessToken: "",

            AvailableUserTypes: ["2", "3"],
            finalaccessToken: "",
            finaluserType: "",
            FinalLoginType: "",

            publicKey: "",
            privateKey: "",

            secretKey: "",
            referenceNo: "",

            showLoader: false,

            withOtpFlag: "0",
        }

        this.username = this.username.bind(this);
        this.user = this.user.bind(this);
        this.userpassword = this.userpassword.bind(this);
        this.mobileotp = this.mobileotp.bind(this);
        this.login = this.login.bind(this);
        this.OTPlogin = this.OTPlogin.bind(this);
        this.enterKey = this.enterKey.bind(this);
        this.validator = new SimpleReactValidator();
        this.getLoginOTP = this.getLoginOTP.bind(this);
        this.sysusername = this.sysusername.bind(this);
        this.onEmailMobileLogin = this.onEmailMobileLogin.bind(this);
        //this.onSystemLogin = this.onSystemLogin.bind(this);
    }
    componentDidMount() {
        if (sessionStorage.getItem("status")) {
            sessionStorage.removeItem('status');
            sessionStorage.clear()
            sessionStorage.clear();
            console.log(sessionStorage)
        }
        // this.generateKeyPair();
        this.generateRSAKeyPair()
        // this.generateKey();
        sessionStorage.getItem('username')
        $("#otpreq").click(function () {
            $("#otpPsw").show();
            $("#passw").hide();

        })
        $("#passreq").click(function () {
            $("#otpPsw").hide();
            $("#passw").show();
        })
        // this.setState({ showLoader: true })

        // Add an event listener for the popstate event
        window.addEventListener('popstate', this.handlePopstate);
        // Manipulate the history to stay on the same page
        window.history.pushState(null, null, window.location.pathname);

        document.addEventListener('keydown', this.handleKeyDown);
    }
    componentWillUnmount() {
        // Clean up the event listener when the component is unmounted
        window.removeEventListener('popstate', this.handlePopstate);
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    handleKeyDown = (event) => {
        // Check if the key combination is Ctrl+O
        if (event.ctrlKey && event.key === 'o') {
            // Prevent the default action
            event.preventDefault();
            console.log('Ctrl+O is disabled in this component.');
        }
    };

    handlePopstate = (event) => {
        // Prevent the default behavior of the back button
        event.preventDefault();
        // Manipulate the history to stay on the same page
        window.history.pushState(null, null, window.location.pathname);
    };

    generateRSAKeyPair = () => {
        const encrypt = new JSEncrypt({ default_key_size: 2048 });
        encrypt.getKey();

        const publicKey1 = encrypt.getPublicKey();
        const privateKey1 = encrypt.getPrivateKey();
        console.log(publicKey1,
            privateKey1)

        const publicKeyContent = publicKey1.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\r\n/g, '');
        const privateKeyContent = privateKey1.replace(/-----BEGIN RSA PRIVATE KEY-----|-----END RSA PRIVATE KEY-----|\r\n/g, '');

        var finalPublicKey = publicKeyContent.replace(/\n/g, '');
        var finalPrivateKey = privateKeyContent.replace(/\n/g, '');
        publicKey = finalPublicKey;
        privateKey = privateKey1;

        console.log(finalPublicKey, finalPrivateKey);

        // Count the number of bits in the public key & private key
        // const publicKeyBits = this.countBits(atob(publicKey));
        // console.log('Public Key Size (bits):', publicKeyBits);

        // const privateKeyBits = this.countBits(atob(finalPrivateKey));
        // console.log('Private Key Size (bits):', privateKeyBits);
        // We convert the Base64 encoded public and private keys to binary data.
        //We then count the number of bytes and multiply by 8 to get the number of bits.
        //Finally, we log the number of bits in both the public and private keys.

        this.generateSecretKey()
    };
    // countBits = (base64String) => {
    //     return base64String.length * 8;
    // };
    // generateKey = async () => {
    //     try {
    //         const keyPair = await window.crypto.subtle.generateKey(
    //             {
    //                 name: 'RSA-OAEP',
    //                 modulusLength: 2048,
    //                 publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    //                 hash: { name: 'SHA-512' },
    //             },
    //             true,
    //             ['encrypt', 'decrypt']
    //         );

    //         const publicKey1 = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
    //         const privateKey1 = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    //         const publicKeyPem = `-----BEGIN PUBLIC KEY-----${btoa(String.fromCharCode(...new Uint8Array(publicKey1)))}-----END PUBLIC KEY-----`;
    //         const privateKeyPem = `-----BEGIN PRIVATE KEY-----${btoa(String.fromCharCode(...new Uint8Array(privateKey1)))}-----END PRIVATE KEY-----`;

    //         console.log('Public Key:\n', publicKeyPem);
    //         console.log('Private Key:\n', privateKeyPem);

    //         const publicKeyContent = publicKeyPem.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\r\n/g, '');
    //         const privateKeyContent = privateKeyPem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\r\n/g, '');

    //         publicKey = publicKeyContent;
    //         privateKey = privateKeyPem;

    //         console.log(publicKeyContent, privateKeyPem);
    //         this.generateSecretKey()
    //     } catch (error) {
    //         console.error('Error decrypting secret key:', error);
    //         console.log('Error details:', error.message, error.stack);
    //     }
    // };
    generateSecretKey = async () => {
        try {
            this.setState({ showLoader: true });
            const response = await fetch(BASEURL + '/usrmgmt/getkey', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    publickey: publicKey,
                })
            });

            console.log('Response:', response);

            const resdata = await response.json();
            console.log(resdata);

            if (resdata.status === "success" || resdata.status === "Success" || resdata.status === "SUCCESS") {
                const secretkey = resdata.msgdata.secretkey;
                const refno = resdata.msgdata.referenceno;

                sessionStorage.setItem('secretReferenceno', resdata.msgdata.referenceno)
                // var decodedSecKey=atob(secretKey)
                // Decrypt the session key
                try {
                    const origSessionKey = await this.decryptSessionKey(secretkey, privateKey);
                    console.log('Decrypted Session Key:', origSessionKey);

                    sessionStorage.setItem('secretKey', origSessionKey)
                    // Perform actions with decrypted values
                    secretKey = origSessionKey;
                    refNo = refno;
                    this.setState({ referenceNo: resdata.msgdata.referenceno })
                    console.log(secretKey, refNo);
                } catch (error) {
                    console.error('Decryption Error:', error);
                }
            }

            this.setState({ showLoader: false });
        } catch (error) {
            console.error('Error:', error);
            this.setState({ showLoader: false });
        }
    }
    decryptSessionKey = async (encryptedSessionKey, privateKey) => {
        try {
            const decrypt = new JSEncrypt();
            decrypt.setPrivateKey(privateKey);

            // Decrypt the encrypted session key
            const decryptedSessionKey = decrypt.decrypt(encryptedSessionKey);

            return decryptedSessionKey;
        } catch (error) {
            console.error(error);
            return '';
        }
    }
    onEmailMobileLogin() {
        if (!isNaN(this.state.username)) {
            // mobile number
            this.setState({ isMobileOrEmail: true });
            // this.setState({ user: "" });
        } else if (this.state.username.indexOf('@') > -1) {
            // email
            this.setState({ isMobileOrEmail: true });
            // this.setState({ user: "" });
        } else {
            // pan
            this.setState({ isMobileOrEmail: false });
        }
        console.log(this.state.user);
    }
    username(event) {
        this.setState({ username: event.target.value.toUpperCase().trim() })
    }
    sysusername(event) {
        this.setState({ username: event.target.value })
    }
    user(event) {
        //this.setState({ user: event.target.value })
        //console.log(event.target.value)
        if (event.target.value == "LND-") {
            this.setState({ user: "LND-" })
            this.setState({ usertype: 2 });
            console.log(this.state.usertype)
        } else if (event.target.value == "BOR-") {
            this.setState({ user: "BOR-" })
            this.setState({ usertype: 3 });
            console.log(this.state.usertype)
        } else if (event.target.value == "FAC-") {
            this.setState({ user: "FAC-" })
            this.setState({ usertype: 4 });
            console.log(this.state.usertype)
        } else if (event.target.value == "EVL-") {
            this.setState({ user: "EVL-" })
            this.setState({ usertype: 5 });
            console.log(this.state.usertype)
        }
        else if (event.target.value == "ADMIN-") {
            this.setState({ user: "" })
            this.setState({ usertype: 0 });
            console.log(this.state.usertype)
        }
        else if (event.target.value == "SYSUSER-") {
            this.setState({ user: "" })
            this.setState({ usertype: 1 });
            console.log(this.state.usertype)

        }

    }
    userpassword(event) {
        this.setState({ userpassword: event.target.value })
    }
    mobileotp = (mobileotp) => {
        this.setState({ mobileotp }, () => {
            if (mobileotp.length === 6) {
                this.handleOtpComplete();
            }
        });
    }
    handleOtpComplete = () => {
        // Function to be called after entering the 6th digit
        console.log('OTP complete:', this.state.mobileotp);
        // Add your function logic here
        this.OTPlogin()
    };
    getPrefix() {
        let userPrefix = "";
        if (!this.state.isMobileOrEmail) {
            userPrefix = this.state.user;
        } else if (this.state.username[0] == 0) {
            userPrefix = this.state.user;
        } else if (this.state.username[0] in [6, 7, 8, 9]) {
            userPrefix = ""
        }
        return userPrefix;
    }
    preloginName = (e) => {
        let str = e.target.value;
        let result = str.replace(/\s/g, '');
        console.log(result);
        encodeUsername = btoa(result);
        console.log(encodeUsername);
        this.setState({ username: encodeUsername })
        //this.setState({ username: e.target.value })
    }
    preloginpassword = (e) => {
        encodeUserpassword = btoa(e.target.value);
        console.log(encodeUserpassword);
        this.setState({ userpassword: encodeUserpassword })
        //this.setState({ userpassword: e.target.value })
    }
    // Encrypt/decrypt key
    encrypt = async (plainText, secretKey) => {
        try {
            // Generate a random salt
            const salt = crypto.getRandomValues(new Uint8Array(16));

            // Derive a key from the password using PBKDF2
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(plainText),
                { name: 'PBKDF2' },
                false,
                ['deriveBits', 'deriveKey']
            );

            const derivedKey = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt,
                    iterations: 65536,
                    hash: 'SHA-1',
                },
                keyMaterial,
                { name: 'AES-CBC', length: 256 },
                true,
                ['encrypt', 'decrypt']
            );

            // Generate a random IV
            const iv = crypto.getRandomValues(new Uint8Array(16));

            // Convert the secretKey to bytes
            const secretKeyBytes = new TextEncoder().encode(secretKey);

            // Encrypt the secretKey using AES-CBC
            const encryptedText = await crypto.subtle.encrypt(
                {
                    name: 'AES-CBC',
                    iv,
                },
                derivedKey,
                secretKeyBytes
            );

            // Combine salt, iv, and ciphertext
            const combinedData = new Uint8Array([...salt, ...iv, ...new Uint8Array(encryptedText)]);

            // Convert the combined data to base64
            const base64String = btoa(String.fromCharCode.apply(null, combinedData));

            return base64String;
        } catch (error) {
            console.error(error);
        }
        return null;
    };
    testEncodeUPw = () => {
        console.log(refNo)
        console.log(this.state.secretKey, secretKey)
        var preLoginJson = JSON.stringify({
            username: this.state.username,
            userpassword: this.state.userpassword,
        })
        // convert json to string
        preLoginJson.toString();
        console.log(preLoginJson)
        var base64Encoded;
        var convertedEncrypt;

        var encryptedData1 = this.encryptSecretKeyUsingAES(secretKey, preLoginJson)
        console.log(encryptedData1)
        convertedEncrypt = JSON.stringify({
            encrypteddata: encryptedData1,
            referenceno: refNo
        })

        var decryptData = this.decryptAESUsingSecretKey(secretKey, encryptedData1);
        console.log(decryptData);
    }
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
    preLogin = async () => {
        this.setState({ showLoader: true })
        console.log(refNo)
        console.log(this.state.secretKey, secretKey)
        var preLoginJson = JSON.stringify({
            username: this.state.username,
            userpassword: this.state.userpassword
        })
        // convert json to string
        preLoginJson.toString();
        console.log(preLoginJson)
        var base64Encoded;
        var convertedEncrypt;

        console.log(this.state.referenceNo)
        var encD1 = await this.encryptSecretKeyUsingAES(secretKey, preLoginJson);
        console.log(encD1);
        convertedEncrypt = JSON.stringify({
            encrypteddata: encD1,
            referenceno: this.state.referenceNo
        })
        console.log(convertedEncrypt);

        // var decryptData = this.decryptAESUsingSecretKey(secretKey, encryptedData1);
        var decryptData = await this.decryptSecretKeyUsingAES(secretKey, encD1);
        console.log(decryptData);
        fetch(BASEURL + '/usrmgmt/p2pusers/v2/login', {
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
                    this.setState({ showLoader: false })

                    //2FA
                    var Data = {};
                    //  Data = {
                    //     "otpref": 234564,
                    // }
                    if (resdata.data.otpref) {
                        sessionStorage.setItem('otpRef', resdata.data.otpref);
                        sessionStorage.setItem('memmID', resdata.data.memmid);
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        $("#otpPsw").show();
                                        this.setState({ withOtpFlag: "1" })
                                        $("#preLoginName").hide();

                                        var timeleft = 30;
                                        downloadTimer = setInterval(function () {
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
                                    },
                                },
                            ],
                        });
                    } else {
                        var preAccessToken = resdata.data.accessToken;
                        var preUsertType = resdata.data.usertype
                        this.setState({ preaccessToken: preAccessToken })
                        this.setState({ preuserType: preUsertType })
                        if (resdata.data.isentity) {
                            sessionStorage.setItem('isEntity', resdata.data.isentity);
                        }
                        sessionStorage.setItem('token', this.state.preaccessToken);

                        this.state.kycVerified = resdata.data.flags.isVkycVerified;
                        sessionStorage.setItem('isKycStatus', this.state.kycVerified);
                        console.log("kycVerified" + resdata.data.flags.isVkycVerified);

                        this.state.isAccountVerified = resdata.data.flags.isAccountVerified;
                        sessionStorage.setItem('isAccountVerified', this.state.isAccountVerified);
                        console.log('isAccountVerified' + resdata.data.flags.isAccountVerified)
                        sessionStorage.setItem('userID', resdata.data.userName);
                        sessionStorage.setItem('userType', resdata.data.logintype);
                        sessionStorage.setItem('memmID', resdata.data.memmid);

                        sessionStorage.setItem('isTncsigned', resdata.data.flags.isTnCSigned);
                        sessionStorage.setItem('isAddressVerified', resdata.data.flags.isAddressVerified);
                        sessionStorage.setItem('isReferenceVerified', resdata.data.flags.isReferenceVerified);

                        var lastLoginTime = resdata.data.lastlogintime;
                        if (lastLoginTime !== undefined && lastLoginTime !== null && lastLoginTime !== '') {
                            sessionStorage.setItem('lastLoginTime', resdata.data.lastlogintime);
                        }

                        var enforceData = {
                            enforcePasswd: resdata.data.enforceresetpassword,
                            enforcePassMsg: resdata.data.enforceresetpasswordmsg
                        }

                        var pmInfo = resdata.data.pminfo;
                        var roles = resdata.data.roles;
                        sessionStorage.setItem('isRoles', roles);

                        this.setState({ isLogin: "true" })
                        sessionStorage.setItem('isLogin', this.state.isLogin);

                        if (pmInfo.pmid) {
                            sessionStorage.setItem("pmID", pmInfo.pmid)
                        }
                        clearInterval(downloadTimer);

                        var av = resdata.data.availableusertypes;
                        var loginType = resdata.data.logintype;
                        if (resdata.data.availableusertypes) {
                            this.setState({ AvailableUserTypes: av })
                            console.log(av)
                            console.log(this.state.AvailableUserTypes)
                            $("#preLoginName").hide()
                            $("#mulUserTypes").show()

                            this.setState({ withOtpFlag: "2" })
                        } else if (resdata.data.logintype == 2) {
                            this.getUserStatusflag(preAccessToken)
                            this.props.loginCallback(true);
                            sessionStorage.setItem('status', resdata.status);
                            //this.props.history.push('/lenderdashboard');
                            this.props.history.push({
                                pathname: '/lenderdashboard',
                                frompath: 'login',
                                state: {
                                    enforcePassData: enforceData
                                }
                            });

                        } else if (resdata.data.logintype == 3) {
                            this.getUserStatusflag(preAccessToken)
                            this.props.loginCallback(true);
                            sessionStorage.setItem('status', resdata.status);
                            //this.props.history.push('/borrowerdashboard');
                            this.props.history.push({
                                pathname: '/borrowerdashboard',
                                frompath: 'login',
                                state: {
                                    enforcePassData: enforceData
                                }
                            });

                        } else if (resdata.data.logintype == 4) {
                            this.getUserStatusflag(preAccessToken)
                            this.props.loginCallback(true);
                            sessionStorage.setItem('status', resdata.status);
                            //this.props.history.push('/facilitatorDashboard');
                            this.props.history.push({
                                pathname: '/facilitatorDashboard',
                                frompath: 'login',
                                state: {
                                    enforcePassData: enforceData
                                }
                            });

                        } else if (resdata.data.logintype == 5) {
                            this.getUserStatusflag(preAccessToken)
                            this.props.loginCallback(true);
                            sessionStorage.setItem('status', resdata.status);
                            //this.props.history.push('/evaluatorDashboard');
                            this.props.history.push({
                                pathname: '/evaluatorDashboard',
                                frompath: 'login',
                                state: {
                                    enforcePassData: enforceData
                                }
                            });

                        } else if (resdata.data.logintype == 0) {
                            if (resdata.data.sadmin || pmInfo.default) {
                                if (resdata.data.sadmin) {
                                    sessionStorage.setItem("sAdmin", resdata.data.sadmin);
                                    sessionStorage.setItem("ismaintenanceOn", resdata.data.ismaintenancemodeon)
                                }
                                if (pmInfo.default) {
                                    sessionStorage.setItem("pmDefault", pmInfo.default);
                                }
                                if (pmInfo.pmid) {
                                    sessionStorage.setItem("pmID", pmInfo.pmid)
                                }
                            }

                            this.getUserStatusflag(preAccessToken)
                            this.props.loginCallback(true);
                            sessionStorage.setItem('status', resdata.status);
                            this.props.history.push({
                                pathname: '/landing',
                                frompath: 'login',
                                state: {
                                    enforcePassData: enforceData
                                }
                            });
                            console.log("executed")
                        } else if (resdata.data.logintype == 1) {
                            if (pmInfo.default) {
                                if (pmInfo.default) {
                                    sessionStorage.setItem("pmDefault", pmInfo.default);
                                }
                                if (pmInfo.pmid) {
                                    sessionStorage.setItem("pmID", pmInfo.pmid)
                                }
                            }

                            this.getUserStatusflag(preAccessToken)
                            this.props.loginCallback(true);
                            sessionStorage.setItem('status', resdata.status);
                            //this.props.history.push('/sysUserDashboard');
                            this.props.history.push({
                                pathname: '/sysUserDashboard',
                                frompath: 'login',
                                state: {
                                    enforcePassData: enforceData
                                }
                            });
                        }
                    }
                } else if (resdata.message === "Invalid reference number") {
                    this.setState({ showLoader: false })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.generateRSAKeyPair()
                                },
                            },
                        ],
                    });
                } else {
                    this.setState({ showLoader: false })
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
        //this.normalLogin()
    }
    availabeUser = (list) => {
        // $("#otpPsw").show();
        // $("#mulUserTypes").hide();
        console.log(list)
        this.setState({ FinalLoginType: list })
        this.FinalLogin(list)
    }
    FinalLogin = async (list) => {
        var preLoginJson = JSON.stringify({
            accesstoken: this.state.preaccessToken,
            usertype: parseInt(list),
        })
        // convert json to string
        preLoginJson.toString();
        console.log(preLoginJson)
        var base64Encoded;
        var convertedEncrypt;

        console.log(this.state.referenceNo)
        var encD1 = await this.encryptSecretKeyUsingAES(secretKey, preLoginJson);
        console.log(encD1);
        convertedEncrypt = JSON.stringify({
            encrypteddata: encD1,
            referenceno: this.state.referenceNo
        })
        console.log(convertedEncrypt);
        fetch(BASEURL + '/usrmgmt/p2pusers/v2/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: convertedEncrypt
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {

                    //2FA
                    var Data = {};
                    // Data = {
                    //     "otpref": 234564,
                    // }
                    if (resdata.data.otpref) {
                        console.log(resdata.data.otpref)
                        sessionStorage.setItem('otpRef', resdata.data.otpref);
                        sessionStorage.setItem('memmID', resdata.data.memmid);
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        $("#otpPsw").show();
                                        this.setState({ withOtpFlag: "2" })
                                        $("#mulUserTypes").hide();

                                        var timeleft = 30;
                                        downloadTimer = setInterval(function () {
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
                                    },
                                },
                            ],
                        });

                    } else {
                        this.setState({ postaccessToken: resdata.data.accessToken })
                        if (resdata.data.isentity) {
                            sessionStorage.setItem('isEntity', resdata.data.isentity);
                        }
                        sessionStorage.setItem('token', this.state.postaccessToken);
                        this.state.kycVerified = resdata.data.flags.isVkycVerified;
                        sessionStorage.setItem('isKycStatus', this.state.kycVerified);
                        console.log("kycVerified" + resdata.data.flags.isVkycVerified);

                        this.state.isAccountVerified = resdata.data.flags.isAccountVerified;
                        sessionStorage.setItem('isAccountVerified', this.state.isAccountVerified);
                        console.log('isAccountVerified' + resdata.data.flags.isAccountVerified)
                        sessionStorage.setItem('userID', resdata.data.userName);
                        sessionStorage.setItem('userType', resdata.data.logintype);
                        sessionStorage.setItem('memmID', resdata.data.memmid);
                        sessionStorage.setItem('status', resdata.status);
                        sessionStorage.setItem('isTncsigned', resdata.data.flags.isTnCSigned);
                        sessionStorage.setItem('isAddressVerified', resdata.data.flags.isAddressVerified);
                        sessionStorage.setItem('isReferenceVerified', resdata.data.flags.isReferenceVerified);

                        var lastLoginTime = resdata.data.lastlogintime;
                        if (lastLoginTime !== undefined && lastLoginTime !== null && lastLoginTime !== '') {
                            sessionStorage.setItem('lastLoginTime', resdata.data.lastlogintime);
                        }

                        // enforce pw
                        var enforcePasswd = resdata.data.enforceresetpassword;
                        var enforcePassMsg = resdata.data.enforceresetpasswordmsg;

                        var enforceData = {
                            enforcePasswd: resdata.data.enforceresetpassword,
                            enforcePassMsg: resdata.data.enforceresetpasswordmsg
                        }
                        var pmInfo = resdata.data.pminfo;
                        var roles = resdata.data.roles;
                        sessionStorage.setItem('isRoles', roles);

                        if (pmInfo.pmid) {
                            sessionStorage.setItem("pmID", pmInfo.pmid)
                        }
                        clearInterval(downloadTimer);

                        this.getUserStatusflag(this.state.postaccessToken)
                        this.setState({ isLogin: "true" })
                        sessionStorage.setItem('isLogin', this.state.isLogin);
                        this.props.loginCallback(true);
                        if (resdata.data.logintype == 2) {
                            //this.props.history.push('/lenderdashboard');
                            this.props.history.push({
                                pathname: '/lenderdashboard',
                                frompath: 'login',
                                state: {
                                    enforcePassData: enforceData
                                }
                            });

                        } else if (resdata.data.logintype == 3) {
                            //this.props.history.push('/borrowerdashboard');
                            this.props.history.push({
                                pathname: '/borrowerdashboard',
                                frompath: 'login',
                                state: {
                                    enforcePassData: enforceData
                                }
                            });
                        } else if (resdata.data.logintype == 4) {
                            //this.props.history.push('/facilitatorDashboard');
                            this.props.history.push({
                                pathname: '/facilitatorDashboard',
                                frompath: 'login',
                                state: {
                                    enforcePassData: enforceData
                                }
                            });
                        } else if (resdata.data.logintype == 5) {
                            //this.props.history.push('/evaluatorDashboard');
                            this.props.history.push({
                                pathname: '/evaluatorDashboard',
                                frompath: 'login',
                                state: {
                                    enforcePassData: enforceData
                                }
                            });
                        } else if (resdata.data.logintype == 0) {
                            //this.props.history.push('/landing');
                            if (resdata.data.sadmin || pmInfo.default) {
                                if (resdata.data.sadmin) {
                                    sessionStorage.setItem("sAdmin", resdata.data.sadmin);
                                    sessionStorage.setItem("ismaintenanceOn", resdata.data.ismaintenancemodeon)
                                }
                                if (pmInfo.default) {
                                    sessionStorage.setItem("pmDefault", pmInfo.default);
                                }
                                if (pmInfo.pmid) {
                                    sessionStorage.setItem("pmID", pmInfo.pmid)
                                }
                            }
                            this.props.history.push({
                                pathname: '/landing',
                                frompath: 'login',
                                state: {
                                    enforcePassData: enforceData
                                }
                            });
                        } else if (resdata.data.logintype == 1) {
                            //this.props.history.push('/sysUserDashboard');
                            if (pmInfo.default) {
                                if (pmInfo.default) {
                                    sessionStorage.setItem("pmDefault", pmInfo.default);
                                }
                                if (pmInfo.pmid) {
                                    sessionStorage.setItem("pmID", pmInfo.pmid)
                                }
                            }
                            this.props.history.push({
                                pathname: '/sysUserDashboard',
                                frompath: 'login',
                                state: {
                                    enforcePassData: enforceData
                                }
                            });
                        }
                    }
                }
                else {
                    if (resdata.code.includes("010L")) {
                        console.log("first")
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        // window.location = "/forgotPassword";
                                        var usernameAtob = atob(this.state.username)
                                        console.log(usernameAtob)
                                        let loginData = {
                                            username: usernameAtob,
                                            usertype: this.state.usertype
                                        }
                                        this.props.history.push({
                                            pathname: '/forgotPassword',
                                            frompath: 'login',
                                            state: {
                                                forgotPw: loginData
                                            }
                                        })
                                    },
                                    className: "ml-5 margin-auto"
                                },
                            ],
                        });
                    } else if (resdata.message === "Invalid reference number") {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        this.generateRSAKeyPair()
                                    },
                                },
                            ],
                        });
                    } else {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => { },
                                    className: "ml-5 margin-auto"
                                },
                            ],
                        });
                    }
                }
            })
    }
    backLogin = () => {
        $("#preLoginName").show()
        $("#mulUserTypes").hide()
    }
    otpBackLogin = () => {
        if (this.state.withOtpFlag === "1") {
            $("#preLoginName").show();
            $("#otpPsw").hide();
        } else if (this.state.withOtpFlag === "2") {
            $("#mulUserTypes").show();
            $("#otpPsw").hide();
        }
    }
    login(event) {

        if (this.validator.allValid()) {
            // alert('You submitted the form and stuff!');
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            return;
        }
        console.log('After validator');

        fetch(BASEURL + '/usrmgmt/p2pusers/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.getPrefix() + this.state.username,
                userpassword: this.state.userpassword,
                usertype: this.state.usertype
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {

                    this.props.loginCallback(true);
                    this.state.accesstoken = resdata.data.accessToken;
                    sessionStorage.setItem('token', this.state.accesstoken);
                    var token = this.state.accesstoken;
                    this.getUserStatusflag(token)
                    console.log(resdata.data.accessToken);

                    this.state.kycVerified = resdata.data.flags.isVkycVerified;
                    sessionStorage.setItem('isKycStatus', this.state.kycVerified);
                    console.log("kycVerified" + resdata.data.flags.isVkycVerified);

                    this.state.isAccountVerified = resdata.data.flags.isAccountVerified;
                    sessionStorage.setItem('isAccountVerified', this.state.isAccountVerified);
                    console.log('isAccountVerified' + resdata.data.flags.isAccountVerified)
                    // sessionStorage.setItem('userID', this.state.user + this.state.username);
                    // sessionStorage.setItem('userID', this.state.user + this.state.username);

                    sessionStorage.setItem('userID', resdata.data.userName);
                    sessionStorage.setItem('userType', resdata.data.logintype);
                    sessionStorage.setItem('memmID', resdata.data.memmid);
                    sessionStorage.setItem('status', resdata.status);
                    sessionStorage.setItem('isTncsigned', resdata.data.flags.isTnCSigned);
                    sessionStorage.setItem('isAddressVerified', resdata.data.flags.isAddressVerified);
                    sessionStorage.setItem('isReferenceVerified', resdata.data.flags.isReferenceVerified);

                    sessionStorage.setItem('username', this.state.username);

                    this.setState({ isLogin: "true" })
                    sessionStorage.setItem('isLogin', this.state.isLogin);

                    console.log(sessionStorage.getItem('userType'))
                    this.setState({ username: resdata.data.userName })

                    var enforcePasswd = resdata.data.enforceresetpassword;
                    var enforcePassMsg = resdata.data.enforceresetpasswordmsg;
                    if (resdata.data.enforceresetpassword && resdata.data.enforceresetpasswordmsg) {
                        sessionStorage.setItem('enforcesetPwd', enforcePasswd);
                        sessionStorage.setItem('enforcesetPwMsg', enforcePassMsg);
                    } else {

                    }

                    var lastLoginTime = resdata.data.lastlogintime;
                    if (lastLoginTime !== undefined && lastLoginTime !== null && lastLoginTime !== '') {
                        sessionStorage.setItem('lastLoginTime', resdata.data.lastlogintime);
                    }
                    //user-type
                    if (this.state.usertype == 3) {
                        this.props.history.push('/borrowerdashboard');
                        // window.location = "/borrowerdashboard";
                    }

                    else if (this.state.usertype == 2) {
                        this.props.history.push('/lenderdashboard');
                        // window.location = "/lenderdashboard";
                    }

                    else if (this.state.usertype == 4) {
                        this.props.history.push('/facilitatorDashboard');
                        // window.location = "/borrowerdashboard";
                    }

                    else if (this.state.usertype == 5) {
                        this.props.history.push('/evaluatorDashboard');
                        // window.location = "/lenderdashboard";
                    }

                    else if (this.state.usertype == 0) {
                        this.props.history.push('/landing');
                        // window.location = "/lenderdashboard";
                    }
                    else if (this.state.usertype == 1) {
                        this.props.history.push('/sysUserDashboard');
                        // window.location = "/lenderdashboard";
                    }

                }
                else {
                    // alert("Issue: " + resdata.message);

                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => { },
                                className: "ml-5 margin-auto"
                            },
                        ],
                    });

                }

            })
    }
    getUserStatusflag = (token) => {
        fetch(BASEURL + '/usrmgmt/getuserstatusflags', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata);

                    sessionStorage.setItem("SisPanVerified", resdata.msgdata.isPanVerified)
                    sessionStorage.setItem("SisAddressVerified", resdata.msgdata.isAddressVerified)
                    sessionStorage.setItem("SisAccountVerified", resdata.msgdata.isAccountVerified)
                    sessionStorage.setItem("SisVkycVerified", resdata.msgdata.isVkycVerified)
                    sessionStorage.setItem("SistnCVerified", resdata.msgdata.isTnCSigned)
                    sessionStorage.setItem("SisRefVerified", resdata.msgdata.isReferenceVerified)

                    // sessionStorage.setItem("SisTxnPinEnabled", resdata.msgdata.isTxnPinEnabled)
                    sessionStorage.setItem("SisTxnPinEnabled", resdata.msgdata["2fauthenabled"])
                    console.log(sessionStorage.getItem("SisTxnPinEnabled"));
                }
                else {
                    //alert(resdata.message);
                }
            })
    }
    OTPlogin = async (event) => {
        // var otpmobileBody = JSON.stringify({
        //     username: this.getPrefix() + this.state.username,
        //     mobileotp: parseInt(this.state.mobileotp),
        //     mobileotpref: parseInt(sessionStorage.getItem("mobileRef")),
        //     loginmode: 2,
        //     usertype: this.state.usertype
        // })

        // var otpemailBody = JSON.stringify({
        //     username: this.getPrefix() + this.state.username,
        //     emailotp: parseInt(this.state.mobileotp),
        //     emailotpref: parseInt(sessionStorage.getItem("emailRef")),
        //     loginmode: 2,
        //     usertype: this.state.usertype
        // })
        //var jsonBody = this.state.isEmailOTP ? otpemailBody : otpmobileBody;
        var preLoginJson = JSON.stringify({
            otp: parseInt(this.state.mobileotp),
            otpref: parseInt(sessionStorage.getItem('otpRef')),
            memmid: parseInt(sessionStorage.getItem('memmID'))
        })
        // convert json to string
        preLoginJson.toString();
        console.log(preLoginJson)
        var convertedEncrypt;

        console.log(this.state.referenceNo)
        var encD1 = await this.encryptSecretKeyUsingAES(secretKey, preLoginJson);
        console.log(encD1);
        convertedEncrypt = JSON.stringify({
            encrypteddata: encD1,
            referenceno: this.state.referenceNo
        })
        console.log(convertedEncrypt);

        fetch(BASEURL + '/usrmgmt/p2pusers/v2/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: convertedEncrypt
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    this.setState({ postaccessToken: resdata.data.accessToken })
                    if (resdata.data.isentity) {
                        sessionStorage.setItem('isEntity', resdata.data.isentity);
                    }
                    sessionStorage.setItem('token', this.state.postaccessToken);
                    this.state.kycVerified = resdata.data.flags.isVkycVerified;
                    sessionStorage.setItem('isKycStatus', this.state.kycVerified);
                    console.log("kycVerified" + resdata.data.flags.isVkycVerified);

                    this.state.isAccountVerified = resdata.data.flags.isAccountVerified;
                    sessionStorage.setItem('isAccountVerified', this.state.isAccountVerified);
                    console.log('isAccountVerified' + resdata.data.flags.isAccountVerified)
                    sessionStorage.setItem('userID', resdata.data.userName);
                    sessionStorage.setItem('userType', resdata.data.logintype);
                    sessionStorage.setItem('memmID', resdata.data.memmid);
                    sessionStorage.setItem('status', resdata.status);
                    sessionStorage.setItem('isTncsigned', resdata.data.flags.isTnCSigned);
                    sessionStorage.setItem('isAddressVerified', resdata.data.flags.isAddressVerified);
                    sessionStorage.setItem('isReferenceVerified', resdata.data.flags.isReferenceVerified);

                    var lastLoginTime = resdata.data.lastlogintime;
                    if (lastLoginTime !== undefined && lastLoginTime !== null && lastLoginTime !== '') {
                        sessionStorage.setItem('lastLoginTime', resdata.data.lastlogintime);
                    }

                    // enforce pw
                    var enforcePasswd = resdata.data.enforceresetpassword;
                    var enforcePassMsg = resdata.data.enforceresetpasswordmsg;
                    // if (resdata.data.enforceresetpassword && resdata.data.enforceresetpasswordmsg) {
                    //     sessionStorage.setItem('enforcesetPwd', enforcePasswd);
                    //     sessionStorage.setItem('enforcesetPwMsg', enforcePassMsg);
                    // }
                    var enforceData = {
                        enforcePasswd: resdata.data.enforceresetpassword,
                        enforcePassMsg: resdata.data.enforceresetpasswordmsg
                    }
                    var pmInfo = resdata.data.pminfo;
                    var roles = resdata.data.roles;
                    sessionStorage.setItem('isRoles', roles);

                    if (pmInfo.pmid) {
                        sessionStorage.setItem("pmID", pmInfo.pmid)
                    }
                    clearInterval(downloadTimer);

                    this.getUserStatusflag(this.state.postaccessToken)
                    this.setState({ isLogin: "true" })
                    sessionStorage.setItem('isLogin', this.state.isLogin);
                    this.props.loginCallback(true);
                    if (resdata.data.logintype == 2) {
                        //this.props.history.push('/lenderdashboard');
                        this.props.history.push({
                            pathname: '/lenderdashboard',
                            frompath: 'login',
                            state: {
                                enforcePassData: enforceData
                            }
                        });

                    } else if (resdata.data.logintype == 3) {
                        //this.props.history.push('/borrowerdashboard');
                        this.props.history.push({
                            pathname: '/borrowerdashboard',
                            frompath: 'login',
                            state: {
                                enforcePassData: enforceData
                            }
                        });
                    } else if (resdata.data.logintype == 4) {
                        //this.props.history.push('/facilitatorDashboard');
                        this.props.history.push({
                            pathname: '/facilitatorDashboard',
                            frompath: 'login',
                            state: {
                                enforcePassData: enforceData
                            }
                        });
                    } else if (resdata.data.logintype == 5) {
                        //this.props.history.push('/evaluatorDashboard');
                        this.props.history.push({
                            pathname: '/evaluatorDashboard',
                            frompath: 'login',
                            state: {
                                enforcePassData: enforceData
                            }
                        });
                    } else if (resdata.data.logintype == 0) {
                        //this.props.history.push('/landing');
                        if (resdata.data.sadmin || pmInfo.default) {
                            if (resdata.data.sadmin) {
                                sessionStorage.setItem("sAdmin", resdata.data.sadmin);
                                sessionStorage.setItem("ismaintenanceOn", resdata.data.ismaintenancemodeon)
                            }
                            if (pmInfo.default) {
                                sessionStorage.setItem("pmDefault", pmInfo.default);
                            }
                            if (pmInfo.pmid) {
                                sessionStorage.setItem("pmID", pmInfo.pmid)
                            }
                        }
                        this.props.history.push({
                            pathname: '/landing',
                            frompath: 'login',
                            state: {
                                enforcePassData: enforceData
                            }
                        });
                    } else if (resdata.data.logintype == 1) {
                        //this.props.history.push('/sysUserDashboard');
                        if (pmInfo.default) {
                            if (pmInfo.default) {
                                sessionStorage.setItem("pmDefault", pmInfo.default);
                            }
                            if (pmInfo.pmid) {
                                sessionStorage.setItem("pmID", pmInfo.pmid)
                            }
                        }
                        this.props.history.push({
                            pathname: '/sysUserDashboard',
                            frompath: 'login',
                            state: {
                                enforcePassData: enforceData
                            }
                        });
                    }
                }
                else {
                    if (resdata.code === "010L") {
                        console.log("first")
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        // window.location = "/forgotPassword";
                                        var usernameAtob = atob(this.state.username)
                                        console.log(usernameAtob)
                                        let loginData = {
                                            username: usernameAtob,
                                            usertype: this.state.usertype
                                        }
                                        this.props.history.push({
                                            pathname: '/forgotPassword',
                                            frompath: 'login',
                                            state: {
                                                forgotPw: loginData
                                            }
                                        })
                                    },
                                    className: "ml-5 margin-auto"
                                },
                            ],
                        });
                    } else if (resdata.message === "Invalid reference number") {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        this.generateRSAKeyPair()
                                    },
                                },
                            ],
                        });
                    }
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => { },
                                className: "ml-5 margin-auto"
                            },
                        ],
                    });
                }
            })
    }
    getLoginOTP(event) {
        fetch(BASEURL + '/usrmgmt/getloginotp', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loginname: this.getPrefix() + this.state.username,
                utype: this.state.usertype
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    alert(resdata.message);
                    if (resdata.msgdata.mobileref) {
                        console.log("Getting  mobile reference");
                        sessionStorage.setItem('mobileRef', resdata.msgdata.mobileref);

                        var timeleft = 30;
                        downloadTimer = setInterval(function () {
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
                    else if (resdata.msgdata.emailref) {
                        console.log("Getting  email reference");
                        sessionStorage.setItem('emailRef', resdata.msgdata.emailref);
                        this.setState({ isEmailOTP: true });

                        var timeleft = 30;
                        downloadTimer = setInterval(function () {
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
                } else {
                    $("#otpPsw").hide();
                    $("#passw").show();
                    alert(resdata.message)
                    //window.location.reload();
                }


            })
    }
    regenerateOTP = () => {
        // operationtype: 18,
        fetch(BASEURL + '/usrmgmt/regenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operationtype: 3,
                mobileref: parseInt(sessionStorage.getItem('otpRef')),
                emailref: parseInt(sessionStorage.getItem('otpRef')),
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
                    sessionStorage.setItem('otpRef', resdata.msgdata.mobileref)

                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    var timeleft = 30;
                                    downloadTimer = setInterval(function () {
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
                                },
                            },
                        ],
                    });
                }
                else {
                    alert(resdata.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    enterKey(event) {
        if (event.keyCode === 13) {
            // alert('enter')
            // this.login(event);
            this.preLogin(event);
        }
    }
    togglePasswordVisiblity = () => {
        const { isPasswordShown } = this.state;
        this.setState({ isPasswordShown: !isPasswordShown });
    };
    forgotPassword = () => {
        // var usernameAtob = atob(this.state.username)
        // console.log(usernameAtob)
        // let loginData = {
        //     username: usernameAtob,
        //     usertype: this.state.usertype
        // }
        // this.props.history.push({
        //     pathname: '/forgotPassword',
        //     frompath: 'forgotPw',
        //     state: {
        //         forgotPw: loginData
        //     }
        // })
        if (this.state.username && this.state.username.trim() !== "") { // Check if username is not an empty string
            var usernameAtob = atob(this.state.username);
            let loginData = {
                username: usernameAtob,
                usertype: this.state.usertype
            };
            this.props.history.push({
                pathname: '/forgotPassword',
                frompath: 'login',
                state: {
                    forgotPw: loginData
                }
            });
        } else {
            this.props.history.push({
                pathname: '/forgotPassword',
                frompath: 'login',
            });
        }
    }
    render() {
        const { isPasswordShown } = this.state;
        const { t } = this.props;
        return (
            <div className="row">
                {
                    this.state.showLoader && <Loader />
                }
                <Container fluid className="d-flex justify-content-center">
                    <Row>
                        <Col>
                            <Card className="" style={{ maxWidth: "700px", marginLeft: "8px", cursor: "default" }}>
                                <div className="row">
                                    <div className="col-lg-6 col-sm-12 col-md-12" style={{ padding: "0px 20px", marginTop: "-10px" }}>
                                        <Card style={{ cursor: "default", backgroundColor: " #008ae6", boxSizing: "border-box" }}>
                                            <p
                                                className="head1"
                                                style={{

                                                    color: "white",
                                                    fontWeight: "bold",
                                                    fontFamily: "Calibri",
                                                    paddingTop: "70px",
                                                    paddingLeft: "5px",
                                                    paddingRight: "2px",
                                                    fontSize: "25px",
                                                }}
                                            >{t('Fast & Simple Loan Process')}

                                            </p>
                                            <p
                                                className="head2"
                                                style={{
                                                    color: "whitesmoke",
                                                    fontFamily: "calibri",
                                                    paddingLeft: "5px",
                                                    paddingRight: "2px",
                                                }}
                                            >{t('The process of getting the Perfect Loan is not that difficult as you have thought!')}

                                                <br />{t('Go Ahead!')}
                                            </p>
                                            <img
                                                src={im}
                                                className="img-fluid"
                                                alt="im"
                                                style={{
                                                    width: "100%",
                                                    backgroundColor: " #008ae6",
                                                }}
                                            />
                                        </Card>
                                    </div>
                                    <div className="col-lg-6 col-sm-12 col-md-12" style={{ padding: "10px 50px 0px 30px" }}>
                                        <div className="" style={{ textAlign: "center" }}>
                                            <h5 id='' style={{ fontWeight: "bold", color: "#222C70" }}>{t('Welcome To P2PL')}</h5>
                                        </div>
                                        <br />
                                        {/* <div id='preLoginName'>
                                            <p className='loginName2' style={{
                                                color: "#222C70",
                                                marginBottom: "1px",
                                                fontWeight: "bold", fontSize: "13px"
                                            }}>{t('login')} *</p>
                                            <input type='text' className='form-control mb-2' placeholder={t('Enter mobile number / email')} onChange={this.preloginName}
                                                style={{
                                                    borderRadius: "5px", borderWidth: "2px", color: "#222C70", borderColor: "#99d6ff"
                                                }} />

                                            <p className='' style={{
                                                color: "#222C70",
                                                marginBottom: "1px",
                                                fontWeight: "bold", fontSize: "13px"
                                            }}>{t('password')} *</p>
                                            <input type={isPasswordShown ? "text" : "password"} className='form-control mb-4' placeholder={t('Enter_Password')}
                                                onKeyDown={this.enterKey}
                                                onChange={this.preloginpassword}
                                                style={{
                                                    height: "40px",
                                                    borderRadius: "5px", borderWidth: "2px", color: "#222C70", borderColor: "#99d6ff"
                                                }} />
                                            <i style={{ position: "relative", right: "50px", cursor: "pointer" }} className={`fa ${isPasswordShown ? "fa-eye" : "fa-eye-slash"}`}
                                                onClick={this.togglePasswordVisiblity} />
                                        </div> */}
                                        <div id='preLoginName'>
                                            <p className='loginName2' style={{
                                                color: "#222C70",
                                                marginBottom: "1px",
                                                fontWeight: "bold",
                                                fontSize: "13px"
                                            }}>{t('login')} *</p>
                                            <div style={{ position: "relative" }}>
                                                <input type='text' className='form-control mb-2' placeholder={t('Enter mobile number / email')} onChange={this.preloginName}
                                                    style={{
                                                        borderRadius: "5px",
                                                        borderWidth: "2px",
                                                        color: "#222C70",
                                                        borderColor: "#99d6ff"
                                                    }} />
                                            </div>

                                            <p style={{
                                                color: "#222C70",
                                                marginBottom: "1px",
                                                fontWeight: "bold",
                                                fontSize: "13px"
                                            }}>{t('password')} *</p>
                                            <div style={{ position: "relative" }}>
                                                <input type={isPasswordShown ? "text" : "password"} className='form-control mb-4' placeholder={t('Enter Password')}
                                                    onKeyDown={this.enterKey}
                                                    onChange={this.preloginpassword}
                                                    style={{
                                                        height: "40px",
                                                        borderRadius: "5px",
                                                        borderWidth: "2px",
                                                        color: "#222C70",
                                                        borderColor: "#99d6ff"
                                                    }} />
                                                <i style={{
                                                    position: "absolute",
                                                    right: "10px",
                                                    top: "37%",
                                                    transform: "translateY(-50%)",
                                                    cursor: "pointer"
                                                }} className={`fa ${isPasswordShown ? "fa-eye" : "fa-eye-slash"}`}
                                                    onClick={this.togglePasswordVisiblity} />
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn"
                                                onClick={this.preLogin}
                                                style={{
                                                    color: "white",
                                                    backgroundColor: "#0079BF",
                                                    width: "100%", // Set button width to 100% of the container
                                                    marginTop: "10px" // Optional: Add margin for spacing
                                                }}>
                                                {t('Submit')}
                                            </button>

                                            <p className="paragraph" style={{ fontWeight: "bolder", textAlign: "center" }}>
                                                <span id='forgotPassw' onClick={this.forgotPassword} style={{ fontSize: "14px", cursor: "pointer", color: "#0079BF" }}>
                                                    {t('Forgot_Password?')}
                                                    {/* <Link to="/forgotPassword" style={{ paddingLeft: "120px", fontSize: "14px" }}></Link> */}
                                                </span>
                                            </p>
                                        </div>

                                        <div className='row' id='mulUserTypes' style={{ display: "none" }}>
                                            <p style={{ textAlign: "center" }}><img src={logo} className="navbar-brand-img" style={{ height: '55px', width: '60px' }} alt="..." /></p>
                                            <h5 style={{ fontWeight: "bold", color: "#222C70", textAlign: "center" }}>{t('SelectUType')}</h5>

                                            <div className='row' style={{ backgroundColor: "rgb(227, 227, 227)" }}>
                                                {this.state.AvailableUserTypes.map((list, index) => {
                                                    return (
                                                        <div className='col-lg-6 col-sm-4 col-md-4'>
                                                            {/* <input type="radio" name="example1" id="radioIcon" /> */}
                                                            <div className='card userTypeIcon'
                                                                id={
                                                                    (() => {
                                                                        if (list == 2)
                                                                            return "Lender"
                                                                        else if (list == 3)
                                                                            return "Borrower"
                                                                        else if (list == 4)
                                                                            return "Facilitator"
                                                                        else if (list == 5)
                                                                            return "Evaluator"
                                                                        else if (list == 1)
                                                                            return "SystemUser"
                                                                        else if (list == 0)
                                                                            return "Admin"
                                                                    })()
                                                                }
                                                                key={index} value={list} onClick={this.availabeUser.bind(this, list, index)}
                                                                style={{
                                                                    textAlign: "center", paddingTop: "10px", border: "1.5px solid #0079bf"
                                                                }}>
                                                                <p>
                                                                    {list == 2 ? <FaMoneyBillAlt style={{ fontSize: "25px" }} /> :
                                                                        <span>{list == 3 ? <FaMoneyCheck style={{ fontSize: "25px" }} /> :
                                                                            <span>{list == 4 ? <FaServer style={{ fontSize: "25px" }} /> :
                                                                                <span>{list == 5 ? <FaTasks style={{ fontSize: "25px" }} /> :
                                                                                    <span>{list == 0 ? <FaUserCog style={{ fontSize: "25px" }} /> :
                                                                                        <span>{list == 1 ? <FaUserPlus style={{ fontSize: "25px" }} /> : ""}</span>}</span>}</span>}</span>}</span>}
                                                                </p>
                                                                <p style={{ marginTop: "-10px", fontWeight: "500" }}>
                                                                    {list == 2 ? <>{t('Lender')}</> :
                                                                        <span>{list == 3 ? <>{t('Borrower')}</> :
                                                                            <span>{list == 4 ? <> {t('Facilitator')}</> :
                                                                                <span>{list == 5 ? <>{t('Evaluator')}</> :
                                                                                    <span>{list == 1 ? <>{t('SystemUser')}</> :
                                                                                        <span>{list == 0 ? <>{t('Admin')}</> : ""}</span>}</span>}</span>}</span>}</span>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <span style={{ cursor: "pointer", fontWeight: "bold", fontSize: "14px" }} id="backBtnLogin" onClick={this.backLogin}><FaArrowLeft />&nbsp;{t('Back')}</span>&nbsp;
                                                    {/* <button className='btn text-white' style={{ backgroundColor: "#0079bf", padding: "0px 50px", borderRadius: "30px" }} onClick={this.FinalLogin}>Continue</button> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row" id="otpPsw" style={{ display: "none" }}>
                                            <p style={{ fontWeight: "bold", color: "#222C70", textAlign: "" }}>{t('OTP')}</p>
                                            {/* <div className='col d-flex justify-content-center align-items-center'> */}
                                            <OtpInput
                                                value={this.state.mobileotp}
                                                onChange={this.mobileotp}
                                                id="pswd"
                                                numInputs={6}
                                                separator={<span>-</span>}
                                                inputStyle={{ width: "40px", height: "40px" }}
                                                isInputNum
                                            />
                                            {/* </div> */}
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <p id="countdown" style={{ color: "grey" }}></p>
                                                    <p id='countdown2' style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }} onClick={this.regenerateOTP}></p>
                                                </div>
                                            </div>
                                            {/* <div className='row'>
                                    <div className='col' style={{ textAlign: "center" }}>
                                        <button
                                            type="submit"
                                            className="btn" onClick={this.OTPlogin}
                                            style={{ float: "center", width: "325px", color: "white", backgroundColor: "#0079BF" }}>
                                            {t('Submit')}
                                        </button>
                                    </div>
                                </div> */}
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <span style={{ cursor: "pointer", fontWeight: "bold", fontSize: "14px" }} id="backBtnLogin" onClick={this.otpBackLogin}><FaArrowLeft />&nbsp;{t('Back')}</span>&nbsp;
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default withTranslation()(Login)