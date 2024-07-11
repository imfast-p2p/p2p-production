import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import SimpleReactValidator from 'simple-react-validator';
import $, { event, type } from 'jquery';
import './Borrow.css';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from "react-confirm-alert";
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { FaInfoCircle, FaUserPlus, FaRegTrashAlt, FaAngleLeft, FaTimesCircle } from "react-icons/fa";
import editRole from '../assets/editRole.png';
import { BsInfoCircle } from "react-icons/bs";
import { Card, Container, Row, Col } from 'react-bootstrap';

var today;
var matchPassword;
var matchPassword2;
var convertednewPw = "";
var convertedcnfPw = "";

var convertednewPw1 = "";
var convertedcnfPw1 = "";
var newpass1 = "";
var cnfpassword1 = "";
// var showLoader=false;

var dataList = [];
export class FacRegister extends Component {
    //updated
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            mobilenumber: "",
            pannumber: '',
            otpm: '',
            otpe: '',
            dateofbirth: '',
            gender: '',
            utype: 2,
            name: '',
            loginpassword: '',
            changeLoginpassword: '',
            emailref: "",
            mobileref: "",

            userInfo: "",
            EncryData: "",
            EncryMsg: "",

            aggrement: "Lender Declaration.",
            policy: "",
            tnc: "LND-TNC",
            p2pPolicy: "P2P-POL",
            referenceId: sessionStorage.getItem('referenceID'),
            offlineReg: false,

            isPasswordShown: false,
            isPasswordShown2: false,
            isPasswordShown3: false,

            showLoader: false,
            invalidUsername: false,

            options: ['Lender', 'Borrower', 'Facilitator', 'Evaluator'],
            //member Form Data
            createdGrpName: "",
            createdGrpDesc: "",
            grpFullName: "",
            grpMobNo: "",
            grpEmailID: "",
            grpPinCode: "",
            grpStateCode: "",
            membergrpcategory: [],

            invalidEmail: false,
            invalidPan: false,
            invalidMnum: false,

            invalidPassword1: false,
            invalidPassword2: false,
            dobValid: false,
            resMsg: "",

            entityFlag: false,
            isentity: "0",
            entityname: "",
            entityaddr: "",
            gstn: "",
            cin: "",
            entitytype: "",
            pincode: "",
            entitypan: "",
            entityData: {}
        }

        this.email = this.email.bind(this);
        this.pannumber = this.pannumber.bind(this);
        this.otpm = this.otpm.bind(this);
        this.otpe = this.otpe.bind(this);
        this.dateofbirth = this.dateofbirth.bind(this);
        this.gender = this.gender.bind(this);
        this.utype = this.utype.bind(this);
        this.name = this.name.bind(this);
        this.loginpassword = this.loginpassword.bind(this);
        this.register = this.register.bind(this);
        this.otp = this.otp.bind(this);
        this.emailref = this.emailref.bind(this);
        this.mobileref = this.mobileref.bind(this);
        this.validator = new SimpleReactValidator();
        this.selectRef = React.createRef();
    }

    email(event) {
        var emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var eventInput = event.target.value;
        if (emailCheck.test(eventInput)) {
            console.log("passed");
            this.setState({ invalidEmail: false })
            this.setState({ email: event.target.value })
            // $('#checkbox').prop('disabled', false)

        } else {
            console.log('failed');
            this.setState({ invalidEmail: true })
        }
    }
    mobileNumber = (event) => {
        this.setState({ mobilenumber: eventInput });
        var eventInput = event.target.value;
        var mobileValid = /^[6-9]\d{9}$/;

        if (mobileValid.test(eventInput)) {
            console.log("passed");
            this.setState({ invalidMnum: false });
            this.setState({ mobilenumber: eventInput });
            // $('#checkbox').prop('disabled', false);
        } else {
            this.setState({ invalidMnum: true });
        }
    }
    pannumber(event) {
        var regex = /[A-Za-z]{3}[Pp]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]{1}$/;
        var eventInput = event.target.value;
        if (regex.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidPan: false })
            this.setState({ pannumber: event.target.value.toUpperCase().trim() })
        } else {
            this.setState({ invalidPan: true })
        }
    }
    otpm(event) {
        this.setState({ otpm: event.target.value })
    }
    otpe(event) {
        this.setState({ otpe: event.target.value })
    }
    dateofbirth(event) {
        this.setState({ dateofbirth: event.target.value })
        console.log(event.target.value)

        const enteredDateOfBirth = event.target.value;
        const today = new Date();
        const enteredDate = new Date(enteredDateOfBirth);

        // Calculate age
        const age = today.getFullYear() - enteredDate.getFullYear();
        const monthDiff = today.getMonth() - enteredDate.getMonth();

        // If the birth month has not occurred yet this year, or if the birth month is in the future
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < enteredDate.getDate())) {
            this.setState({ dateofbirth: enteredDateOfBirth, age: age - 1 });
        } else {
            this.setState({ dateofbirth: enteredDateOfBirth, age });
        }

        // Check if the age is greater than or equal to 18
        if (age < 18) {
            this.setState({ dobValid: true })
            console.log("You must be 18 years or older.");
        } else {
            this.setState({ dobValid: false })
            console.log("Executed success.")
        }
        // today = new Date(event.target.value);
        // var dd = today.getDate();
        // var mm = today.getMonth() + 1; //January is 0!
        // var yyyy = today.getFullYear();
        // if (dd < 10) {
        //     dd = '0' + dd;
        // }
        // if (mm < 10) {
        //     mm = '0' + mm;
        // }

        // today = dd + '-' + mm + '-' + yyyy;
        // console.log(today)
    }
    gender(event) {
        this.setState({ gender: event.target.value });
        console.log(event.target.value);
    }

    utype(event) {
        // this.setState({ utype: event.target.value });
        // console.log(event.target.value);
        if (event.target.value == "Lender") {
            this.setState({ utype: 2 });
            this.setState({ aggrement: "Lender Declaration." })
            this.setState({ tnc: "LND-TNC" })
            this.setState({ policy: "" })
            $(".JlGroupField").hide();
        }
        else if (event.target.value == "Borrower") {
            this.setState({ utype: 3 });
            this.setState({ aggrement: "Borrower Declaration." })
            this.setState({ tnc: "BOR-TNC" })
            // $(".JlGroupField").show();
        }
        else if (event.target.value == "Facilitator") {
            this.setState({ utype: 4 });
            this.setState({ aggrement: "Facilitator Declaration." })
            this.setState({ tnc: "FAC-TNC" })
            $(".JlGroupField").hide();
        }
        else if (event.target.value == "Evaluator") {
            this.setState({ utype: 5 });
            this.setState({ aggrement: "Evaluator Declaration." })
            this.setState({ tnc: "EVL-TNC" })
            $(".JlGroupField").hide();
        }

    }
    //     if (!(charCode >= 65 && charCode <= 90) && // A-Z
    //     !(charCode >= 97 && charCode <= 122) && // a-z
    //     !(charCode >= 48 && charCode <= 57) && // 0-9
    //     charCode !== 95 && // underscore
    //     charCode !== 46 && //dot
    //     charCode !== 32) { // space
    //     isValid = false;
    //     break;
    // }
    // if (!(charCode >= 65 && charCode <= 90) && // A-Z
    //     !(charCode >= 97 && charCode <= 122) && // a-z
    //     charCode !== 95 && // underscore
    //     charCode !== 46 && //dot
    //     charCode !== 32) { // space

    //     isValid = false;
    //     break;
    // }
    name(event) {
        var username = event.target.value;
        var isValid = true;
        this.setState({ name: username });
        for (var i = 0; i < username.length; i++) {
            var charCode = username.charCodeAt(i);

            if (!(charCode >= 65 && charCode <= 90) && // A-Z
                !(charCode >= 97 && charCode <= 122) && // a-z
                !(charCode >= 48 && charCode <= 57) && // 0-9
                charCode !== 32) { // space
                isValid = false;
                break;
            }
        }
        if (isValid) {
            this.setState({
                name: username,
                invalidUsername: false
            });
        } else {
            this.setState({
                invalidUsername: true
            });
        }
    }
    loginpassword(event) {
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        var eventInput = event.target.value;
        if (regex.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidPassword1: false })
            this.setState({ loginpassword: event.target.value });
        } else {
            this.setState({ invalidPassword1: true })
        }
        var newpass = document.getElementsByName('newpassword')[0].value;
        var cnfpassword = document.getElementsByName('cnfpassword')[0].value;
        if (newpass == cnfpassword) {
            matchPassword = true;
            $('#sig').prop('disabled', false)
        } else {
            matchPassword = false;
            $('#sig').prop('disabled', true)
        }
    }
    changeLoginpassword = (event) => {
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        var eventInput = event.target.value;
        if (regex.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidPassword2: false })
            this.setState({ changeLoginpassword: event.target.value });
        } else {
            this.setState({ invalidPassword2: true })
        }

        newpass1 = document.getElementsByName('newpassword')[0].value;
        cnfpassword1 = document.getElementsByName('cnfpassword')[0].value;
        if (newpass1 == cnfpassword1) {
            matchPassword = true;
            $('#sig').prop('disabled', false)
        } else {
            matchPassword = false;
            $('#sig').prop('disabled', true)
        }
    }
    mobileref(event) {
        this.setState({ mobileref: event.target.value })
    }
    emailref(event) {
        this.setState({ emailref: event.target.value })
    }
    componentDidMount() {
        if (this.props.location.frompath == "aadhaarQR") {
            var propsLocation1 = this.props.location.state.aadhaarQR;
            this.setState({ mobilenumber: propsLocation1.mobile })

            this.setState({ utype: propsLocation1.usertype })

            if (propsLocation1.usertype == 2) {
                this.setState({ aggrement: "Lender Declaration." })
                this.setState({ tnc: "LND-TNC" })
            }
            else if (propsLocation1.usertype == 3) {
                this.setState({ aggrement: "Borrower Declaration." })
                this.setState({ tnc: "BOR-TNC" })

            }
            else if (propsLocation1.usertype == 4) {
                this.setState({ aggrement: "Facilitator Declaration." })
                this.setState({ tnc: "FAC-TNC" })

            }
            else if (propsLocation1.usertype == 5) {
                this.setState({ aggrement: "Evaluator Declaration." })
                this.setState({ tnc: "EVL-TNC" })
            }
        } else if (this.props.location.frompath == "aadhaarXml") {
            var propsLocation2 = this.props.location.state.aadhaarXml;
            this.setState({ mobilenumber: propsLocation2.mobile })

            this.setState({ utype: propsLocation2.usertype })

            if (propsLocation2.usertype == 2) {
                this.setState({ aggrement: "Lender Declaration." })
                this.setState({ tnc: "LND-TNC" })
            }
            else if (propsLocation2.usertype == 3) {
                this.setState({ aggrement: "Borrower Declaration." })
                this.setState({ tnc: "BOR-TNC" })

            }
            // else if (propsLocation2.usertype == 4) {
            //     this.setState({ aggrement: "Facilitator Declaration." })
            //     this.setState({ tnc: "FAC-TNC" })

            // }
            // else if (propsLocation2.usertype == 5) {
            //     this.setState({ aggrement: "Evaluator Agreement." })
            //     this.setState({ tnc: "EVL-TNC" })
            // }
        }
        this.getOfflineKYC();
        // this.getTandC()
        $("#checkbox").click(function () {
            if ($(this).is(":checked")) {
                $("#sendOTP").show();
            } else {
                $("#sendOTP").hide();
            }
        })

        $("#agree").click(function () {
            $("#checkbox").click(function () {
                $(this).is(":checked")
            })
        })

        // $('#checkbox').prop('disabled', true)

        if (this.state.name != "") {
            // $('#checkbox').prop('disabled', false)
        }
        matchPassword = true;

        $("#grpCheckbox").click(function () {
            if ($(this).is(":checked")) {
                $("#grpName").show();
                console.log("True")
            } else {
                $("#grpName").hide();
                console.error('False');
            }
        })

        $("#memberLists").hide()

        if (sessionStorage.getItem('registrationData')) {
            console.log(sessionStorage.getItem('registrationData'));
            var data = sessionStorage.getItem('registrationData');
            var parsedData = JSON.parse(data);
            console.log(parsedData)
            this.setState({
                isentity: "1",
                entityData: parsedData,
                entityFlag: true
            })
        }
    }
    componentWillUnmount() {
        sessionStorage.removeItem('registrationData')
        this.setState({
            isentity: "",
            entityData: {},
            entityFlag: false
        });
    }
    getOfflineKYC = () => {
        fetch(BASEURL + `/verification/offlinekyc/getkycinfo?refid=${this.state.referenceId}`, {
            method: "GET",

        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === "Success") {
                    this.setState({ gender: resdata.msgdata.gender })
                    this.setState({ dateofbirth: resdata.msgdata.dob })
                    this.setState({ name: resdata.msgdata.name })
                    this.setState({ offlineReg: true });

                    if (this.state.gender == "M") {
                        $("#ml").prop("checked", true);
                    } else if (this.state.gender == "F") {
                        $("#fl").prop("checked", true);
                    } else if (this.state.gender == "O") {
                        $("#ot").prop("checked", true);
                    }


                } else {
                    //alert(resdata.message);
                }
            }).catch(error => console.log(error)
            );
    }
    otp(event) {
        if (this.state.dobValid == true) {
            this.setState({ resMsg: "Please enter valid date of birth." })
            $("#commonModal").click();
        } else {
            $('#sig').prop('disabled', true)
            $('#mobile').prop('disabled', true)
            $('#email').prop('disabled', true)
            // $('#checkbox').prop('disabled', true)

            document.getElementById("mobile").style.backgroundColor = "rgb(227, 225, 225)";
            document.getElementById("email").style.backgroundColor = "rgb(227, 225, 225)";

            fetch(BASEURL + '/usrmgmt/v2/generateotp', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...(this.state.email && { email: this.state.email }),
                    mobilenumber: this.state.mobilenumber,
                    utype: parseInt(this.state.utype),
                    pan: this.state.pannumber
                })
            }).then((Response) => Response.json())
                .then((resdata) => {
                    console.log(resdata);
                    if (resdata.status == 'Success') {
                        // alert(resdata.message);
                        this.setState({ mobileref: resdata.msgdata.mobileref });
                        this.setState({ emailref: resdata.msgdata.emailref });

                        var userInfo = resdata.msgdata.userinfo;
                        console.log(userInfo)
                        this.setState({ userInfo: userInfo })

                        $("#sendOTP").hide()


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

                        if (userInfo) {
                            var emailID = resdata.msgdata.userinfo.emailid;
                            var mobileNo = resdata.msgdata.userinfo.mobilenumber;
                            var encryname = resdata.msgdata.userinfo.name;
                            var encryPAN = resdata.msgdata.userinfo.pan;
                            console.log(emailID, mobileNo, encryname, encryPAN)

                            this.setState({ encryptedName: encryname })
                            this.setState({ encryptedemailid: emailID })
                            this.setState({ encryptedMobileno: mobileNo })
                            this.setState({ encryptedPan: encryPAN })

                            var encryData = resdata.msgdata.userinfo.encrydata;
                            console.log(encryData);
                            this.setState({ EncryData: encryData })
                            console.log(resdata.msgdata.userinfo.encrydata)

                            var encryMsg = resdata.msgdata.userinfo.msg;
                            console.log(encryMsg);
                            this.setState({ EncryMsg: encryMsg })
                            console.log(this.state.EncryMsg)
                            console.log(resdata.msgdata.userinfo.msg)

                            confirmAlert({
                                message: resdata.message,
                                buttons: [
                                    {
                                        label: "Okay",
                                        onClick: () => {
                                            $("#hidemobileEmail").hide();
                                            $('.otpField').show();
                                            $(".encryMsg").show();
                                            $("#hidePassword").hide();
                                            $("#sig").show();
                                            $('#sig').prop('disabled', false)
                                        },
                                    },
                                ],
                            });

                        } else {
                            $("#hidePassword").show();
                            confirmAlert({
                                message: resdata.message,
                                buttons: [
                                    {
                                        label: "Okay",
                                        onClick: () => {
                                            $('.otpField').show();
                                            $("#sig").show();
                                        },
                                    },
                                ],
                            });
                        }
                    }
                    else {
                        $('#mobile').prop('disabled', false)
                        $('#email').prop('disabled', false)

                        document.getElementById("mobile").style.backgroundColor = "white";
                        document.getElementById("email").style.backgroundColor = "white";
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
        }
    }
    regenerateOTP = () => {
        fetch(BASEURL + '/usrmgmt/regenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operationtype: 1,
                ...(this.state.emailref && { emailref: String(this.state.emailref) }),
                mobileref: String(this.state.mobileref),
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
    formatDate(date) {

        var d = date.split("-");
        return [d[2], d[0], d[1]].join('-');
    }

    register = (event) => {

        // if (this.validator.allValid()) {
        //     // alert('You submitted the form and stuff!');
        // } else {
        //     this.validator.showMessages();
        //     this.forceUpdate();
        //     return;
        // }

        // var today = new Date();
        // var nowyear = today.getFullYear();
        // var nowmonth = today.getMonth();
        // var nowday = today.getDate();
        // var b = document.getElementById('dob').value;

        // var birth = new Date(b);

        // var birthyear = birth.getFullYear();
        // var birthmonth = birth.getMonth();
        // var birthday = birth.getDate();

        // var age = nowyear - birthyear;
        // var age_month = nowmonth - birthmonth;
        // var age_day = nowday - birthday;


        // if (age > 100) {
        //     alert("Age cannot be more than 100 Years.Please enter valid age")
        //     return false;
        // }
        // else if (age_month < 0 || (age_month == 0 && age_day < 0)) {
        //     age = parseInt(age) - 1;
        //     return false;

        // }
        // else if ((age == 18 && age_month <= 0 && age_day <= 0) || age < 18) {
        //     alert("Age should be more than 18 years.Please enter a valid Date of Birth");
        //     return false;
        // } else if(age<100) { 

        //}
        var convertNewpW = btoa(this.state.loginpassword);
        var convertCnfpW = btoa(this.state.changeLoginpassword);
        console.log(convertNewpW, convertCnfpW);
        convertednewPw = convertNewpW;
        convertedcnfPw = convertCnfpW;

        if (convertednewPw === convertedcnfPw) {
            console.log("password matched")
            // $('#sig').prop('disabled', false)
            if (this.state.userInfo) {
                var selfReg = JSON.stringify({
                    ...(this.state.email && { email: this.state.email }),
                    mobilenumber: this.state.mobilenumber,
                    pannumber: this.state.pannumber,
                    otpm: parseInt(this.state.otpm),
                    ...(this.state.otpe && { otpe: parseInt(this.state.otpe) }),
                    dateofbirth: this.state.dateofbirth,
                    gender: this.state.gender,
                    utype: parseInt(this.state.utype),
                    name: this.state.name,
                    mobileref: parseInt(this.state.mobileref),
                    ...(this.state.emailref && { emailref: parseInt(this.state.emailref) }),
                    additional_data: { "key": "value" },
                    regmode: 1,
                    refid: "",
                    encrydata: this.state.EncryData,
                    ...((this.state.isentity) && { isentity: this.state.isentity }),
                    ...(this.state.entityFlag && {
                        ...((this.state.entityData) && { entityinfo: this.state.entityData })
                    })
                })
                var offlineKYCReg = JSON.stringify({
                    ...(this.state.email && { email: this.state.email }),
                    mobilenumber: this.state.mobilenumber,
                    pannumber: this.state.pannumber,
                    otpm: parseInt(this.state.otpm),
                    ...(this.state.otpe && { otpe: parseInt(this.state.otpe) }),
                    dateofbirth: this.state.dateofbirth,
                    gender: this.state.gender,
                    utype: parseInt(this.state.utype),
                    name: this.state.name,
                    mobileref: parseInt(this.state.mobileref),
                    ...(this.state.emailref && { emailref: parseInt(this.state.emailref) }),
                    additional_data: { "key": "value" },
                    regmode: 3,
                    refid: this.state.referenceId,
                    encrydata: this.state.EncryData,
                    ...((this.state.isentity) && { isentity: this.state.isentity }),
                    ...(this.state.entityFlag && {
                        ...((this.state.entityData) && { entityinfo: this.state.entityData })
                    })
                })
            } else {
                var selfReg = JSON.stringify({
                    ...(this.state.email && { email: this.state.email }),
                    mobilenumber: this.state.mobilenumber,
                    pannumber: this.state.pannumber,
                    otpm: parseInt(this.state.otpm),
                    ...(this.state.otpe && { otpe: parseInt(this.state.otpe) }),
                    dateofbirth: this.state.dateofbirth,
                    gender: this.state.gender,
                    utype: parseInt(this.state.utype),
                    name: this.state.name,
                    loginpassword: convertednewPw,
                    mobileref: parseInt(this.state.mobileref),
                    ...(this.state.emailref && { emailref: parseInt(this.state.emailref) }),
                    additional_data: { "key": "value" },
                    regmode: 1,
                    refid: "",
                    ...((this.state.isentity) && { isentity: this.state.isentity }),
                    ...(this.state.entityFlag && {
                        ...((this.state.entityData) && { entityinfo: this.state.entityData })
                    })
                })
                var offlineKYCReg = JSON.stringify({
                    ...(this.state.email && { email: this.state.email }),
                    mobilenumber: this.state.mobilenumber,
                    pannumber: this.state.pannumber,
                    otpm: parseInt(this.state.otpm),
                    ...(this.state.otpe && { otpe: parseInt(this.state.otpe) }),
                    dateofbirth: this.state.dateofbirth,
                    gender: this.state.gender,
                    utype: parseInt(this.state.utype),
                    name: this.state.name,
                    loginpassword: convertednewPw,
                    mobileref: parseInt(this.state.mobileref),
                    ...(this.state.emailref && { emailref: parseInt(this.state.emailref) }),
                    additional_data: { "key": "value" },
                    regmode: 3,
                    refid: this.state.referenceId,
                    ...((this.state.isentity) && { isentity: this.state.isentity }),
                    ...(this.state.entityFlag && {
                        ...((this.state.entityData) && { entityinfo: this.state.entityData })
                    })
                })
            }
        }
        console.log(selfReg)
        console.log(offlineKYCReg)

        var bodyData;
        bodyData = this.state.offlineReg == true ? offlineKYCReg : selfReg
        fetch(BASEURL + '/usrmgmt/registeruser', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: bodyData
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    //alert("User registration successfully completed ")
                    confirmAlert({
                        message: "User registration successfully completed",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    // window.location = "/ThankYou";
                                    $("#thankYoupage").click()
                                    sessionStorage.setItem('login', resdata.msgdata.login);
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });

                } else {
                    //alert(resdata.message);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }

            })
            .catch((error) => {
                console.log(error)
            })

    }

    getTandC = (event) => {
        console.log(this.state.tnc)
        if (this.state.tnc == "LND-TNC") {
            this.getLndTnc()
        } else if (this.state.tnc == "BOR-TNC") {
            this.getBorrTnc()
        } else if (this.state.tnc == "FAC-TNC") {
            this.getFacTnc()
        } else if (this.state.tnc == "EVL-TNC") {
            this.getEvlTnc()
        }
    }
    getP2pPolicy = (event) => {
        // this.setState({p2pPolicy:"P2P-POL"})
        console.log(this.state.p2pPolicy)
        this.setState({ showLoader: true })
        fetch(BASEURL + `/usrmgmt/getplatformdocinfo?docid=${this.state.p2pPolicy}`, {
            method: "GET",
        })
            .then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === "Success") {
                    this.setState({ showLoader: false })

                    console.log(resdata)
                    console.log(resdata.msgdata.docdata)

                    var Id = resdata.msgdata.docid;
                    console.log(Id)
                    var pdocData = resdata.msgdata.docdata;
                    if (Id == "P2P-POL") {
                        // let decoded = window.atob(resdata.msgdata.docdata)
                        // console.log(decoded)
                        // this.setState({ policy: decoded })
                        // console.log(this.state.policy)
                        var puri = `data:${resdata.msgdata.doctype};base64,` + pdocData;
                        document.getElementsByClassName('PDFdoc5')[0].src = puri + "#zoom=75";
                        $("#launchColl").click()
                    }
                } else {
                    this.setState({ showLoader: false })
                }
            })
    }
    getLndTnc = (event) => {
        this.setState({ showLoader: true })
        fetch(BASEURL + `/usrmgmt/getplatformdocinfo?docid=${this.state.tnc}`, {
            method: "GET",
        })
            .then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === "Success") {
                    this.setState({ showLoader: false })

                    console.log(resdata)
                    console.log(resdata.msgdata.docdata)

                    var Id = resdata.msgdata.docid;
                    console.log(Id)
                    var docData = resdata.msgdata.docdata;
                    if (Id == "LND-TNC") {
                        // let decoded = window.atob(resdata.msgdata.docdata)
                        // console.log(decoded)
                        // this.setState({ policy: decoded })
                        // console.log(this.state.policy)
                        var uri = `data:${resdata.msgdata.doctype};base64,` + docData;
                        document.getElementsByClassName('PDFdoc3')[0].src = uri + "#zoom=75";
                        // $("#Launch2").click(function () {

                        // })
                        $("#Launch").click()
                    }
                } else {
                    this.setState({ showLoader: false })
                }
            })
    }
    getBorrTnc = (event) => {
        this.setState({ showLoader: true })

        fetch(BASEURL + `/usrmgmt/getplatformdocinfo?docid=${this.state.tnc}`, {
            method: "GET",
        })
            .then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === "Success") {
                    this.setState({ showLoader: false })

                    console.log(resdata)
                    console.log(resdata.msgdata.docdata)

                    var Id = resdata.msgdata.docid;
                    console.log(Id)
                    var docData = resdata.msgdata.docdata;
                    if (Id == "BOR-TNC") {
                        console.log('Response:', docData)

                        var uri = `data:${resdata.msgdata.doctype};base64,` + docData;
                        document.getElementsByClassName('PDFdoc')[0].src = uri + "#zoom=90";
                        $("#Launch").click()

                    }
                } else {
                    this.setState({ showLoader: false })
                }
            })
    }
    getFacTnc = (event) => {
        fetch(BASEURL + `/usrmgmt/getplatformdocinfo?docid=${this.state.tnc}`, {
            method: "GET",
        })
            .then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === "Success") {
                    console.log(resdata)
                    console.log(resdata.msgdata.docdata)

                    var Id = resdata.msgdata.docid;
                    console.log(Id)
                    var docData = resdata.msgdata.docdata;
                    if (Id == "FAC-TNC") {
                        // let decoded2 = window.atob(resdata.msgdata.docdata)
                        // console.log(decoded2)
                        // this.setState({ policy: decoded2 })
                        // console.log(this.state.policy)

                        var uri = `data:${resdata.msgdata.doctype};base64,` + docData;
                        document.getElementsByClassName('PDFdoc4')[0].src = uri + "#zoom=75";
                        $("#Launch").click()
                    }
                }
            })
    }
    getEvlTnc = (event) => {
        fetch(BASEURL + `/usrmgmt/getplatformdocinfo?docid=${this.state.tnc}`, {
            method: "GET",
        })
            .then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === "Success") {
                    console.log(resdata)
                    console.log(resdata.msgdata.docdata)

                    var Id = resdata.msgdata.docid;
                    console.log(Id)
                    var docData = resdata.msgdata.docdata;
                    if (Id == "EVL-TNC") {
                        var uri = `data:${resdata.msgdata.doctype};base64,` + docData;
                        document.getElementsByClassName('PDFdoc2')[0].src = uri + "#zoom=90";
                        $("#Launch").click()
                    }
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
    }
    togglePasswordVisiblity3 = () => {
        const { isPasswordShown3 } = this.state;
        this.setState({ isPasswordShown3: !isPasswordShown3 });
    }
    handleUTypeChange = (e) => {
        this.setState({ utype: e.target.value });
    };

    createGroup = () => {
        $("#setJLGModal").click();
    }
    creategroupName = (e) => {
        this.setState({ createdGrpName: e.target.value })
    }
    creategroupDescription = (e) => {
        this.setState({ createdGrpDesc: e.target.value })
    }
    addMember = (e) => {
        $(".addMemberForm").show();
        $("#memberLists").hide();

    }
    // Group Form Data
    grpFullName = (e) => {
        this.setState({ grpFullName: e.target.value })
    }
    grpMobNo = (e) => {
        this.setState({ grpMobNo: e.target.value })

    }
    grpEmailID = (e) => {
        this.setState({ grpEmailID: e.target.value })

    }
    grpPinCode = (e) => {
        this.setState({ grpPinCode: e.target.value })

    }
    grpStateCode = (e) => {
        this.setState({ grpStateCode: e.target.value })

    }
    createMember = () => {
        var firstJson = {};
        firstJson = {
            fullname: this.state.grpFullName,
            mobileno: this.state.grpMobNo,
            emailid: this.state.grpEmailID,
            pincode: parseInt(this.state.grpPinCode),
            statecode: this.state.grpStateCode
        }
        console.log(firstJson)
        dataList.push(firstJson)
        console.log(dataList)

        this.setState({ membergrpcategory: dataList })
        this.multipleMemberList();

        $(".addMemberForm").hide();
        $("#memberLists").show();

        document.getElementById('fullName').value = '';
        document.getElementById('mobNo').value = '';
        document.getElementById('emailID').value = '';
        document.getElementById('pinCode').value = '';
        document.getElementById('stateCode').value = 'Select';
    }
    multipleMemberList = () => {
        console.log(dataList);
        console.log(this.state.membergrpcategory)
    }
    deleteMember = (index) => {
        var updatedCategories = dataList.filter((_, i) => i !== index);
        dataList = updatedCategories;
        this.setState({ membergrpcategory: updatedCategories });
        console.log(this.state.membergrpcategory)
    }
    cancelCreateMember = () => {
        $(".addMemberForm").hide();
        $("#memberLists").show();

        document.getElementById('fullName').value = '';
        document.getElementById('mobNo').value = '';
        document.getElementById('emailID').value = '';
        document.getElementById('pinCode').value = '';
        document.getElementById('stateCode').value = 'Select';
    }
    setJlGReg = () => {
        fetch(BASEURL + '/usrmgmt/jlg/groupregistration', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                groupname: this.state.createdGrpName,
                groupdesc: this.state.createdGrpDesc,
                memberslist: this.state.membergrpcategory,
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
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

                } else {
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
            .catch(err => {
                console.log(err.message)
            })
    }
    routeToRegistration = () => {
        if (this.state.isentity == "1") {
            $("#entityPage").click()
        } else {
            $("#registrationPage").click()
        }
    }
    openModal = () => {
        $('#infoModal').click();
    };

    closeModal = () => {
        $('#infoModal').modal('hide');
    };
    render() {
        const { t } = this.props
        const { isPasswordShown } = this.state;
        const { isPasswordShown2 } = this.state;
        const { isPasswordShown3 } = this.state;
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

        // const uniqueOptions = [...new Set(this.state.options)];
        const { options, isentity } = this.state;
        const filteredOptions = isentity === "1"
            ? options.filter(option => option === 'Lender' || option === 'Borrower')
            : options;

        const uniqueOptions = [...new Set(filteredOptions)];
        let count = this.state.membergrpcategory.length;
        console.log(this.state.membergrpcategory)

        console.log(this.state.name);
        var userNameMsg = '(Name can contain uppercase letters, lowercase letters, spaces and numbers(0-9))';
        var passwdMsg = '(One capital letter, one small letter, one number and one special character is compulsory, space not allowed).';
        const { showLoader } = this.state;
        return (
            <div className="row">
                {
                    showLoader && <Loader />
                }

                {/* T&C Policy */}
                <button id='Launch' type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg" style={{ display: "none" }}>
                    Launch demo modal
                </button>
                <div className="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Declaration</h5>
                            </div>
                            {this.state.utype == 2 ?
                                <div className="modal-body">
                                    <iframe src="" className="PDFdoc3" type="text/plain" style={{ overflow: "auto", height: "85vh", width: "100%" }}>

                                    </iframe>
                                </div> :
                                <div className="modal-body">
                                    {this.state.utype == 3 ?
                                        <div>
                                            <iframe src="" className="PDFdoc" type="text/plain" style={{ overflow: "auto", height: "85vh", width: "100%" }}>

                                            </iframe>
                                        </div> :
                                        <div>
                                            {this.state.utype == 4 ?
                                                <div>
                                                    <iframe src="" className="PDFdoc4" type="text/plain" style={{ overflow: "auto", height: "85vh", width: "100%" }}>

                                                    </iframe>
                                                </div> :
                                                <div>
                                                    {this.state.utype == 5 ?
                                                        <div>
                                                            <iframe src="" className="PDFdoc2" type="text/plain" style={{ overflow: "auto", height: "85vh", width: "100%" }}>

                                                            </iframe>
                                                        </div> :
                                                        <div>

                                                        </div>}
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>}
                            <div className="modal-footer">
                                <button id='agree' type="button" className="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} data-dismiss="modal">Agree</button>
                                &nbsp;
                                <button id='disagree' type="button" class="btn text-white btn-sm" style={{ backgroundColor: "#0079BF" }} data-dismiss="modal">Disagree</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/*P2p-pol*/}
                <button id='launchColl' type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg2" style={{ display: "none" }}>
                    Launch demo modal
                </button>
                <div className="modal fade bd-example-modal-lg2" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel2" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Terms and Conditions</h5>
                            </div>
                            <div className="modal-body">
                                <div className='row'>
                                    <div className='col' >
                                        <iframe src="" className="PDFdoc5" type="text/plain" style={{ overflow: "auto", height: "85vh", width: "100%" }}>

                                        </iframe>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button id='agree' type="button" className="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} data-dismiss="modal">Agree</button>
                                &nbsp;
                                <button id='disagree' type="button" class="btn text-white btn-sm" style={{ backgroundColor: "#0079BF" }} data-dismiss="modal">Disagree</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Modal */}
                <button
                    id='infoModal'
                    type='button'
                    className='btn btn-primary'
                    data-toggle='modal'
                    data-target='.bd-example-modal'
                    style={{ display: 'none' }}
                >
                    Small modal
                </button>
                <div className='modal fade bd-example-modal' tabIndex='-1' role='dialog' aria-labelledby='mySmallModalLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content' style={{ height: "600px", fontSize: "14px" }}>
                            <div className='modal-body' style={{ overflow: "scroll" }} id='secondAuditScroll12'>
                                <div >
                                    <FaTimesCircle type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ color: "rgb(5, 54, 82)" }} onClick={this.closeModal} />
                                </div>
                                <p className='risk-rating-header' style={{ color: "rgb(0, 38, 77)", fontSize: "15px" }}>Registration Process :</p>
                                <ul className='timeline'>
                                    <li className='timeline-item'>
                                        <span className='timeline-label'>PAN Verification:</span>
                                        <span className='timeline-description'>Authenticate using Permanent Account Number (PAN).</span>
                                    </li>
                                    <li className='timeline-item'>
                                        <span className='timeline-label'>Mobile Verification:</span>
                                        <span className='timeline-description'>Confirm identity through a mobile number verification process.</span>
                                    </li>
                                    <li className='timeline-item'>
                                        <span className='timeline-label'>Email Verification (Optional):</span>
                                        <span className='timeline-description'>Additional verification step for email confirmation.</span>
                                    </li>
                                    <li className='timeline-item'>
                                        <span className='timeline-label'>Set Password and Login:</span>
                                        <span className='timeline-description'>Create a secure password to complete registration and log in.</span>
                                    </li>
                                </ul>
                                <p className='risk-rating-header' style={{ color: "rgb(0, 38, 77)", fontSize: "15px" }}>After Login :</p>
                                <ul className='timeline'>
                                    <li className='timeline-item'>
                                        <span className='timeline-label'>Add Your Profile Photo and Personal Details:</span>
                                        <span className='timeline-description'>Personalize your profile with a photo and complete personal information.</span>
                                    </li>
                                    <li className='timeline-item'>
                                        <span className='timeline-label'>Add Bank Details:</span>
                                        <span className='timeline-description'>Provide bank account information for financial transactions.</span>
                                    </li>
                                    <li className='timeline-item'>
                                        <span className='timeline-label'>Add Address Details (OVD):</span>
                                        <span className='timeline-description'>Submit Officially Valid Document (OVD) for address verification.</span>
                                    </li>
                                    <li className='timeline-item'>
                                        <span className='timeline-label'>Nominee Details (for Lender):</span>
                                        <span className='timeline-description'>Add nominee information for lender accounts.</span>
                                    </li>
                                    <li className='timeline-item'>
                                        <span className='timeline-label'>KYC Verification:</span>
                                        <span className='timeline-description'>Complete Know Your Customer (KYC) verification to comply with regulatory requirements.</span>
                                    </li>
                                </ul>
                                <hr style={{ backgroundColor: 'rgba(5,54,82,1)' }} />
                                <div className='row'>
                                    <div className='col' style={{ textAlign: 'center' }}>
                                        <button
                                            type='button'
                                            className='btn text-white btn-sm'
                                            data-dismiss='modal'
                                            style={{ backgroundColor: 'rgb(136, 189, 72)' }}
                                            onClick={this.closeModal}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <Container fluid className="d-flex justify-content-center">
                    <Row>
                        <Col>
                            <Card className="" style={{ maxWidth: "700px", marginLeft: "8px", paddingBottom: "10px", cursor: "default" }}>
                                <div className='row' >
                                    <div className='col' style={{ marginLeft: "8px" }}>
                                        <button style={myStyle} onClick={this.routeToRegistration}>
                                            <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                        </button>
                                    </div>
                                    <div className='col' style={{ textAlign: "end", marginRight: "20px" }}>
                                        {this.state.isentity === "0" &&
                                            <FaInfoCircle style={{ color: "rgb(136, 189, 72)", fontSize: "20px", marginLeft: "10px", cursor: "pointer" }} onClick={this.openModal} />
                                        }
                                    </div>

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
                                            Registration
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
                                <div
                                    className="heading2"
                                    style={{
                                        textAlign: "center",
                                        paddingTop: "10px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <label style={{
                                        color: "#00264d",
                                        fontFamily: "Poppins,sans-serif",
                                        fontWeight: "500",
                                        fontSize: "14px",
                                        fontWeight: "600"
                                    }}>
                                        Register As
                                    </label>{" "}
                                    &nbsp;
                                    <select
                                        ref={this.selectRef}
                                        className="form-select"
                                        onChange={this.utype}
                                        value={this.state.utype}
                                        style={{
                                            border: "1px solid rgb(0, 121, 191)",
                                            borderRadius: "5px",
                                            backgroundColor: "whitesmoke",
                                            width: "250px",
                                            marginTop: "-10px",
                                            fontFamily: "Poppins,sans-serif"
                                        }}
                                    >
                                        {this.state.utype ? (
                                            userType && (
                                                <option key={userType} value={userType} style={{ color: "#00264d" }}>
                                                    {userType}
                                                </option>
                                            )
                                        ) : (
                                            <option defaultValue="" style={{ color: "#00264d", textAlign: "center" }} >
                                                --Select--
                                            </option>
                                        )}
                                        {uniqueOptions.map(option => (
                                            option !== userType && (
                                                <option key={option} value={option} style={{ color: "#00264d" }}>
                                                    {option}
                                                </option>
                                            )
                                        ))}
                                    </select>
                                </div>
                                <div className="row" style={{ padding: "0px 20px" }}>
                                    <div className="col-lg-6 col-sm-6 col-md-6">
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
                                            {`${this.state.isentity === "1" ? 'Contact Name *' : 'Name *'}`}
                                        </label>
                                        <div>
                                            {this.state.name ? <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                onChange={this.name}
                                                value={this.state.name}
                                                autoComplete="off"
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Enter Your Name"
                                            /> :
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="name"
                                                    onChange={this.name}
                                                    value={this.state.name}
                                                    autoComplete="off"
                                                    style={{
                                                        borderRadius: "5px",
                                                        backgroundColor: "whitesmoke",
                                                        marginTop: "-10px",
                                                        border: "1px solid rgb(0, 121, 191)",
                                                        color: "#00264d",
                                                    }}
                                                    placeholder="Enter Your Name"
                                                />}

                                            {this.validator.message('name', this.state.name, 'required|name', { className: 'text-danger' })}
                                        </div>
                                        {(this.state.invalidUsername) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Username</span> : ''}
                                        <p style={{ fontSize: "13px", fontFamily: 'Poppins,sans-serif', color: 'GrayText' }}>{userNameMsg}</p>
                                    </div>
                                    <div className="col-lg-6 col-sm-6 col-md-6">
                                        <label
                                            className="u2"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Date of Birth *
                                        </label>
                                        <div>
                                            {this.state.dateofbirth ? <input
                                                type="date"
                                                className="form-control"
                                                id="dob"
                                                onChange={this.dateofbirth}
                                                value={this.state.dateofbirth}
                                                autoComplete="off"
                                                data-date-format="YYYY MM DD"
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                            /> :
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="dob"
                                                    onChange={this.dateofbirth}
                                                    autoComplete="off"
                                                    placeholder="YYYY-MM-DD"
                                                    style={{
                                                        borderRadius: "5px",
                                                        backgroundColor: "whitesmoke",
                                                        marginTop: "-10px",
                                                        border: "1px solid rgb(0, 121, 191)",
                                                        color: "#00264d",
                                                    }}
                                                />}
                                        </div>
                                        {(this.state.dobValid) ? <span className='text-danger'>Please enter a valid date of birth.</span> : ''}
                                    </div>
                                </div>
                                <div className="row mb-1" style={{ padding: "0px 20px" }}>
                                    <div className="col-lg-6 col-sm-6 col-md-6 group">
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
                                            Gender *
                                        </label>
                                        <div className="row" onChange={this.gender} style={{ marginTop: "-8px" }}>
                                            <div className="col" style={{ fontSize: "14px", color: "#00264d" }}>
                                                <input
                                                    className="radio"
                                                    type="radio"
                                                    id="ml"
                                                    name="radio"
                                                    value="M"
                                                />
                                                Male
                                            </div>
                                            <div className="col" style={{ fontSize: "14px", color: "#00264d" }}>
                                                <input
                                                    className="radio"
                                                    type="radio"
                                                    id="fl"
                                                    name="radio"
                                                    value="F"
                                                />
                                                Female
                                            </div>
                                            <div className="col" style={{ fontSize: "14px", color: "#00264d" }}>
                                                <input
                                                    className="radio"
                                                    type="radio"
                                                    id="ot"
                                                    name="radio"
                                                    value="O"
                                                />
                                                Others
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-sm-6 col-md-6 group">
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
                                            {t("PAN")} *
                                        </label>
                                        &nbsp;
                                        {/* <span style={{color:"green"}}>Your Pan is verified</span> */}

                                        <input
                                            type={isPasswordShown ? "text" : "password"}
                                            className="form-control pannumber"
                                            id="pannum"
                                            onChange={this.pannumber}
                                            minLength={10}
                                            maxLength={10}
                                            autoComplete="off"
                                            style={{
                                                borderRadius: "5px",
                                                backgroundColor: "whitesmoke",
                                                marginTop: "-10px",
                                                border: "1px solid rgb(0, 121, 191)",
                                                color: "#00264d",
                                            }}
                                            placeholder="Enter PAN"
                                        />
                                        {(this.state.invalidPan) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid PAN</span> : ''}

                                        {this.validator.message('pannumber', this.state.pannumber, 'required|pannumber|min:8|10|max:14',
                                            { className: 'text-danger' })}
                                        <i style={{ position: "absolute", right: "10px", top: "14px" }} className={`fa ${isPasswordShown ? "fa-eye" : "fa-eye-slash"}`}

                                            onClick={this.togglePasswordVisiblity} />
                                    </div>
                                </div>
                                <div className="row" id='hidemobileEmail' style={{ padding: "0px 20px" }}>
                                    <div className="col-lg-6 col-sm-6 col-md-6">
                                        <label
                                            className="u5"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Mobile Number *
                                        </label>
                                        <div>
                                            <input
                                                type='number'
                                                className='form-control'
                                                id="mobile"
                                                value={this.state.mobilenumber}
                                                onChange={this.mobileNumber}
                                                minLength={10}
                                                maxLength={10}
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Enter Mobile Number"
                                            />

                                            {this.validator.message('mobilenumber', this.state.mobilenumber, 'required|mobilenumber|min:10|max:10', { className: 'text-danger' })}
                                            {(this.state.invalidMnum) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Mobile Number</span> : ''}

                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-sm-6 col-md-6">
                                        <label
                                            className="u6"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            {`${this.state.isentity === "1" ? 'Email-ID *' : 'Email-ID(Optional)'}`}
                                        </label>
                                        <div>
                                            <input
                                                type="email"
                                                className="form-control"
                                                onChange={this.email}
                                                autoComplete="off"
                                                id="email"
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Enter EmailID"
                                            />
                                            {this.validator.message('email', this.state.email, 'required|email', { className: 'text-danger' })}
                                            {(this.state.invalidEmail) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Email ID</span> : ''}
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-2" style={{ color: "#004080", padding: "0px 20px" }}>
                                    <div className="col-10">
                                        <input type="checkbox" name="terms" id="checkbox" />  I Agree to the <a id='privacyPolicy2' onClick={this.getP2pPolicy}>Terms of Use</a> of the Platform
                                        &nbsp;
                                        {/* <a id='privacyPolicy' onClick={this.getP2pPolicy}>Privacy Policy</a>&nbsp; */}
                                        and <a id='Launch2' onClick={this.getTandC}>{this.state.aggrement}</a>

                                    </div>
                                    <div className="col otpButton">
                                        <button
                                            className="button"
                                            id="sendOTP"
                                            value="Send OTP"
                                            onClick={this.otp}
                                            style={{
                                                display: "none",
                                                color: "#00aaff",
                                                backgroundColor: "whitesmoke",
                                                borderColor: "#00aaff",
                                                borderRadius: "10px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Send OTP
                                        </button>
                                        <span id='showCountDown'>
                                            <p id="countdown" style={{ color: "grey" }}></p>
                                            <p id='countdown2' onClick={this.regenerateOTP} style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}></p>
                                        </span>
                                    </div>

                                </div>
                                <div className="otpField row mb-1" style={{ display: "none", padding: "0px 20px" }}>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <label
                                            className="u8"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Mobile OTP *
                                        </label>
                                        <div>
                                            <input
                                                type="number"
                                                className="form-control"
                                                onChange={this.otpm}
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Enter Mobile OTP"
                                                onInput={(e) => {
                                                    e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                }}
                                            />

                                        </div>
                                    </div>
                                    {/* Conditionally render the Email OTP field only if email is present */}
                                    {this.state.email && (
                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                            <label
                                                className="u7"
                                                style={{
                                                    color: "#00264d",
                                                    fontFamily: "Poppins, sans-serif",
                                                    fontWeight: "600",
                                                    fontSize: "14px"
                                                }}
                                            >
                                                Email OTP *
                                            </label>
                                            <div>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    onChange={this.otpe}
                                                    style={{
                                                        borderRadius: "5px",
                                                        backgroundColor: "whitesmoke",
                                                        marginTop: "-10px",
                                                        border: "1px solid rgb(0, 121, 191)",
                                                        color: "#00264d",
                                                    }}
                                                    placeholder="Enter Email OTP"
                                                    onInput={(e) => {
                                                        e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className='row mb-1 encryMsg' style={{
                                    color: "#004080", display: "none",
                                    // color: "#00264d",
                                    fontFamily: "Poppins,sans-serif",
                                    fontSize: "14px", padding: "0px 20px"
                                }}>
                                    <div className='col-lg-3 col-md-3 col-sm-3'>
                                        <p className='font-weight-bold'>Name</p>
                                        <p className='maginTopforenData'>{this.state.encryptedName}</p>
                                    </div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <p className='font-weight-bold'>Email ID</p>
                                        <p className='maginTopforenData'>{this.state.encryptedemailid}</p>
                                    </div>
                                    <div className='col-lg-3 col-md-3 col-sm-3'>
                                        <p className='font-weight-bold'>Mobile number</p>
                                        <p className='maginTopforenData'>{this.state.encryptedMobileno}</p>
                                    </div>
                                    <div className='col-lg-2 col-sm-3 col-md-2'>
                                        <p className='font-weight-bold'>PAN</p>
                                        <p className='maginTopforenData'>{this.state.encryptedPan}</p>
                                    </div>

                                </div>
                                <div className='row mb-1 encryMsg' id='encryMsg' style={{ color: "#004080", display: "none", padding: "0px 20px" }}>
                                    <div className='col-lg-12 col-md-12 col-sm-12'>
                                        <p>{this.state.EncryMsg}</p>
                                    </div>
                                </div>
                                <div className="row" id='hidePassword' style={{ display: "none", padding: "0px 20px" }}>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <label
                                            className="u9"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Password *
                                        </label>
                                        <div>
                                            <input
                                                type={isPasswordShown2 ? "text" : "password"}
                                                className="form-control"
                                                name='newpassword'
                                                onChange={this.loginpassword}
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Create Password"
                                            />
                                            {(this.state.invalidPassword1) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Password</span> : ''}
                                            {this.validator.message('loginpassword', this.state.loginpassword, 'required|loginpassword|min:4|max:15', { className: 'text-danger' })}
                                            <i style={{ position: "absolute", right: "10px", top: "16px" }} className={`fa ${isPasswordShown2 ? "fa-eye" : "fa-eye-slash"}`} onClick={this.togglePasswordVisiblity2} />
                                        </div>
                                        <p style={{ fontSize: "13px", fontFamily: 'Poppins,sans-serif', color: 'GrayText' }}>{passwdMsg}</p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <label
                                            className="u10"
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
                                                type={isPasswordShown3 ? "text" : "password"}
                                                className="form-control"
                                                name='cnfpassword'
                                                onChange={this.changeLoginpassword}
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Re-Enter Password"
                                            />
                                            {(this.state.invalidPassword2 || matchPassword2 == false) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Password</span> : ''}
                                            {/* {(matchPassword2 == false) ? <span className='text-danger'>Invalid Password</span> : ''} */}
                                            {this.validator.message('loginpassword', this.state.changeLoginpassword, 'required|loginpassword|min:4|max:15', { className: 'text-danger' })}
                                            <i style={{ position: "absolute", right: "10px", top: "16px" }} className={`fa ${isPasswordShown3 ? "fa-eye" : "fa-eye-slash"}`} onClick={this.togglePasswordVisiblity3} />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="row" style={{ padding: "0px 20px" }}>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <button className="btn" style={{ display: "none", backgroundColor: "#0079bf", color: "white" }} id="sig" onClick={this.register}>Sign Up</button>
                                    </div>
                                </div> */}
                                <div className="row" style={{ padding: "0px 20px" }}>
                                    <button className="btn" style={{ display: "none", backgroundColor: "#0079bf", color: "white" }} id="sig" onClick={this.register}>Sign Up</button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                <div className="container">
                    <div className="row d-flex justify-content-center pl-3 pr-3" >
                        <div className="col-md-10 ">

                        </div>
                        {/* Route to Registration */}
                        <Link to="/registration"><button id='registrationPage' style={{ display: "none" }}>Registration
                        </button></Link>
                        {/* Route to Registration */}
                        <Link to="/enitityReg"><button id='entityPage' style={{ display: "none" }}>Registration
                        </button></Link>
                        {/* Route to Thank You page */}
                        <Link to="/thankyou"><button id='thankYoupage' style={{ display: "none" }}>Refresh
                        </button></Link>

                        {/* Set Jlg registration */}
                        <button type="button" id='setJLGModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg12">
                            Create JLG registration
                        </button>
                        <div class="modal fade bd-example-modal-lg12" id="exampleModalCenter12" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className='row'>
                                            <div className='col' style={{}}>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Create JLG Regisration</p>
                                                <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                <div className='row mb-2'>
                                                    <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <p style={{ fontWeight: "500" }}>Group Name</p>
                                                        <input type="text" class="form-control" onChange={this.creategroupName}
                                                            placeholder="Group Name" style={{
                                                                height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px",
                                                                backgroundColor: "whitesmoke"
                                                            }} />
                                                    </div>
                                                    <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <p style={{ fontWeight: "500" }}>Group Description</p>
                                                        <input type="text" class="form-control" maxLength={6} onChange={this.creategroupDescription}
                                                            placeholder="Group Description" style={{
                                                                height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px",
                                                                backgroundColor: "whitesmoke"
                                                            }} />
                                                    </div>
                                                </div>
                                                <div className='row mb-2'>
                                                    <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <p style={{ fontWeight: "500" }}>Add Members &nbsp;
                                                            <FaUserPlus onClick={this.addMember} className="downloadTnc" style={{ cursor: "pointer", fontSize: "large", marginTop: "-6px" }} />
                                                            &nbsp;
                                                            {count > 0 &&
                                                                <span style={{ fontWeight: "500", marginLeft: "20px" }}>Total Members: <span style={{ fontWeight: "400" }}>{count}</span></span>
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Members */}

                                                {
                                                    this.state.membergrpcategory.length > 0 ?
                                                        <div className='' id='memberLists' style={{}}>
                                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <div className='col-2'>
                                                                    <p style={{ fontWeight: "600", marginLeft: "10px" }}>{t('Name')}</p>
                                                                </div>
                                                                <div className='col-3' style={{ textAlign: "end" }}>
                                                                    <p style={{ fontWeight: "600" }}>{t('Mobile Number')}</p>
                                                                </div>
                                                                <div className='col-3'>
                                                                    <p style={{ fontWeight: "600" }}>{t('Email ID')}</p>
                                                                </div>
                                                                <div className='col-2'>
                                                                    <p style={{ fontWeight: "600", marginLeft: "-13px" }}>{t('State')}</p>
                                                                </div>
                                                                <div className='col-2'>
                                                                    <p style={{ fontWeight: "600", marginLeft: "-4px" }}>{t('Pincode')}</p>
                                                                </div>
                                                            </div>
                                                            <hr className="col-12" style={{ width: "96%", marginTop: "-10px" }} />

                                                            <div className="" style={{ marginTop: "-15px" }}>
                                                                {
                                                                    this.state.membergrpcategory.map((lists, index) => {
                                                                        return (
                                                                            <div key={index}>
                                                                                <div className='card border-0' style={{ cursor: 'default', color: "rgba(5,54,82,1)", marginBottom: '5px', marginTop: '1px', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                                    <div className="row item-list align-items-center" style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                                                                                        <div className='col-3'>
                                                                                            <p style={{ marginTop: "12px", marginLeft: "5px" }}>{lists.fullname}</p>
                                                                                        </div>
                                                                                        <div className='col-2'>
                                                                                            <p style={{ marginTop: "12px", marginLeft: "-5px" }}>{lists.mobileno}</p>
                                                                                        </div>
                                                                                        <div className='col-3'>
                                                                                            <p style={{ marginTop: "12px" }}>{lists.emailid}</p>
                                                                                        </div>
                                                                                        <div className='col-2'>
                                                                                            <p style={{ marginTop: "12px", marginLeft: "-8px" }}>{lists.statecode == "KA" ? "Karnataka" :
                                                                                                <span>{lists.statecode == "AP" ? "Andhra Pradesh" :
                                                                                                    <span>{lists.statecode == "UP" ? "Uttar Pradesh" : ""}</span>}</span>}</p>
                                                                                        </div>
                                                                                        <div className='col-2'>
                                                                                            <p style={{ marginTop: "12px" }}>{lists.pincode} &nbsp;
                                                                                                <FaRegTrashAlt style={{ color: "chocolate", cursor: "pointer", marginTop: "-6px" }}
                                                                                                    title='Delete Member'
                                                                                                    onClick={this.deleteMember.bind(this, index)} /></p>
                                                                                        </div>

                                                                                    </div >
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    )
                                                                }
                                                            </div>
                                                        </div>

                                                        :
                                                        <div className="empty-message"></div>
                                                }

                                                {/* New Form */}
                                                <div className='addMemberForm' style={{ display: "none" }}>
                                                    <div className='row mb-2'>
                                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                            <p style={{ fontWeight: "500" }}>Full Name</p>
                                                            <input type="text" id='fullName' class="form-control" onChange={this.grpFullName}
                                                                placeholder="Product Name" style={{
                                                                    height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px",
                                                                    backgroundColor: "whitesmoke"
                                                                }} />
                                                        </div>
                                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                            <p style={{ fontWeight: "500" }}>Mobile Number</p>
                                                            <input type="number" id='mobNo' class="form-control" onChange={this.grpMobNo}
                                                                placeholder="Mobile Number" style={{
                                                                    height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px",
                                                                    backgroundColor: "whitesmoke"
                                                                }} />
                                                        </div>
                                                    </div>
                                                    <div className='row mb-2'>
                                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                            <p style={{ fontWeight: "500" }}>Email ID</p>
                                                            <input type="text" id='emailID' class="form-control" onChange={this.grpEmailID}
                                                                placeholder="Email ID" style={{
                                                                    height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px",
                                                                    backgroundColor: "whitesmoke"
                                                                }} />
                                                        </div>
                                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                            <p style={{ fontWeight: "500" }}>PinCode</p>
                                                            <input type="text" id='pinCode' class="form-control" onChange={this.grpPinCode}
                                                                placeholder="PIN Code" style={{
                                                                    height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px",
                                                                    backgroundColor: "whitesmoke"
                                                                }} />
                                                        </div>
                                                    </div>

                                                    <div className='row mb-2'>
                                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                            <p style={{ fontWeight: "500" }}>State</p>
                                                            <select className='form-select' id='stateCode' onChange={this.grpStateCode} style={{
                                                                height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px",
                                                                backgroundColor: "whitesmoke"
                                                            }} >
                                                                <option defaultValue>Select</option>
                                                                <option value="AP">Andhra Pradesh</option>
                                                                <option value="UP">Uttar Pradesh</option>
                                                                <option value="KA">karnataka</option>
                                                            </select>
                                                        </div>
                                                        <div className='col'>
                                                            <button type="button" class="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", marginTop: "27px", padding: "8px 49px" }}
                                                                onClick={this.createMember}><FaUserPlus style={{ marginTop: "-5px" }} />&nbsp;Add Member</button>&nbsp;
                                                            <button type="button" class="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", marginTop: "27px", padding: "8px 61px" }}
                                                                onClick={this.cancelCreateMember}>Cancel</button>
                                                        </div>
                                                    </div>

                                                </div>

                                                <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col' style={{ textAlign: "center" }}>
                                                <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                    disabled={this.state.membergrpcategory.length <= 0} onClick={this.setJlGReg}>Create</button>&nbsp;
                                                <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} >Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
                                            style={{ backgroundColor: "rgb(136, 189, 72)" }}>Okay</button>
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

export default withTranslation()(FacRegister)