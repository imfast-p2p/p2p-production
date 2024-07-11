import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import FacilitatorSidebar from '../../../SidebarFiles/FacilitatorSidebar';
import { withTranslation } from 'react-i18next';
import SimpleReactValidator from 'simple-react-validator';
import {
    FaTimesCircle, FaCheckCircle, FaAngleLeft, FaAddressBook, FaRegFileVideo,
    FaFileSignature, FaRegUser, FaRegSave, FaMapMarkerAlt, FaHouseUser, FaRegFileAlt,
    FaCamera, FaEdit, FaUserEdit, FaFolderPlus, FaFileAlt, FaFileUpload
} from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import { confirmAlert } from "react-confirm-alert";
import batch from '../../assets/batch.png';
import verifi from '../../assets/img/Verification.png';
import cusboarding from '../../assets/img/CustomerOnboarding.png';
import './CustomerSupport.css';
import viewProfileimg from '../../assets/img1.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css'
import dueCollect from '../../assets/esAcc.png';
import openIt from '../../assets/AdminImg/openit.png';
import { talukFlagED } from '../../assets/Constant';
import cusOB2 from '../../assets/cusb2.png';
import regImg from '../../assets/Registration.png';
import step1 from '../../assets/number-one.png';
import step2 from '../../assets/number-2.png';
import step3 from '../../assets/number-3.png';
import Loader from '../../Loader/Loader';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
var globalStateList;
var pglobalStateList;
var confirmRefData;
var loanAccStatus;
var LoanStatus;
var LoanActSt = {};

var documentAdded = false;

var dataList = [];
var extractedData;
var formDatas;
var formID;

var poaDataList = [];
var pageTypePOA;
var poaDocumentFlag = false;
const dt = new DataTransfer();

export class CustomerSupport extends Component {
    constructor(props) {
        super(props)
        //updated
        this.state = {
            memmID: "",
            name: "",
            gender: "",
            dob: "",
            mobilenumber: "",
            email: "",
            pannumber: "",
            utype: 2,

            allMobileno: "",
            otp: "123456",

            addresstypedesc: "",
            status: 0,
            // Bank
            accounttype: "",
            accountifsc: "",
            accountno: "",
            accountvpa: "",
            branch: "",
            accountno2: "",

            confirmAccount: false,
            showLoader: false,

            UploadedID: "",
            uploadedImage: "",
            aadharImage: "",
            capturedImage: "",
            defaultImage: "",
            aadharID: "",
            image: true,
            photo: "",
            orderToDisplay: 1,
            isImageFound: false,
            viewImages: viewProfileimg,

            viewEditDisable: true,
            LPDisable: true,
            kycDisable: true,
            BDueDisable: true,
            BTncDisable: true,
            isActive: false,

            EncryptedData: "",
            encryptedDataFlag: false,

            borP2pDue: "100",
            grpInfo: [],

            // assistSaveProfileData
            accountinfo: {

            },
            primaryProfession: "",
            secondaryProfession: "",
            Profession: "",
            Account: "",
            YearsInResidence: "",
            YearsOfEarning: "",
            IncomeRangeGroup: "",
            ResidenceType: "",
            MaritalStatus: "",
            Relation: "",
            Dependents: "",
            Education: "",
            RelationName: "",
            LandHolding: "",
            Age: "",

            cnfmobileOtp: "",
            addressFlag: true,
            accountFlag: true,
            personalFlag: true,

            personalSubmit: true,
            addressSubmit: false,
            bankSubmit: false,

            refId: "",
            profileImage: viewProfileimg,
            imageFlag: true,

            emiAmt: "",
            TenureOffered: "",
            repaymentDesc: "",
            offeredAmt: "",
            riskRating: "",
            interestRate: "",

            profileType: 2,
            isActive: false,
            unapprovedOTp: "",
            assistSaveFlag: false,

            //Loan Processing
            loanOfferList: [],
            loanofferid: "",
            loanreqno: "",
            emailOtp: "",
            mobileOtp: "",
            otpRef: "",
            loanOfferDetails: [],
            loanStatus: "",
            LoanreqStatus: "",
            loanstats: "",

            showResultStat: false,
            fundstatus: "",
            fundPercent: "0.0 %",

            emailOtpDisp: "",
            mobileOtpDisp: "",
            loanaccountstatus: "",
            ProductID: "",
            RequestedAmt: "",

            //Due Collection
            assistBorrID: "",
            assistMmID: "",
            assistp2pDue: "",
            borrowerid: "",
            isMobileOrEmail: false,
            user: "",

            //kyc
            assistKycBorrId: "",
            Id: "",
            Id2: "",
            kycstatus: "",

            offset: 0,
            orgtableData: [],
            perPage: 5,
            currentPage: 0,
            pageCount: "",

            //flag for edit
            Personaliseditted: "false",
            accountIseditted: "false",
            PermanentaddressIseditted: "false",

            personalDetailsData: "",
            permananentDetailsData: "",
            accountDetailsData: "",

            emailAll: "",
            toggle: null,
            agreementSignedFlag: "",

            //
            BdueinvalidMnum: false,
            kycinvalidMnum: false,
            viewEditinvalidMnum: false,
            BTncinvalidMnum: false,

            BTnCMobileno: "",
            tncstatus: "",
            //OVD
            selectDocu: '',
            addOvddocu: '',
            ovdCode: '',
            ovdID: '',
            ovdPagetype: '',
            ovdPagetype: '',
            ovdMasterList: [],
            uploadedOVDLists: [],

            ovduserName: '',
            ovdDOB: '',
            ovdIDno: '',
            ovdGender: '',
            ovdAddress: '',
            OvdMnumber: "",
            OvdDataList: [],
            viewOvdDataList: [],

            OVDoffset: 0,
            OVDperPage: 5,
            OVDcurrentPage: 0,
            OVDpageCount: "",
            OVDovdList: [],
            OVDorgtableData: [],

            taluk: "",
            initialTaluk: "",
            ptaluk: "",
            pinitialTaluk: "",

            talukList: [],
            ptalukList: [],

            primaryProfValid: false,
            secondaProfValid: false,

            ovdCategoryFlag: false,
            formFieldLists: [],
            formCategory: "",
            formType: "",
            errorMessages: {},
            resMsg: "",

            //Taluk Flag
            talukFlag: talukFlagED,

            //Digilocker
            digiUtype: 2,

            addressOvdFormDetails: [],
            addressFormFieldLists: [],
            demoStates: [],
            demoDistricts: [],
            selectedStateCode: null,
            selectedDistrictCode: null,
            apiCalled: false,
            districtName: "",
            poaExtractedData: [],
            poaformCategory: "",
            poaformType: "",
            formOvdRefNo: "",
            permanentAddressStatus: "",
            presentAddressStatus: "",

            successfulUploads: [],
            selectedFiles: [],
            selectedFile: null,
            showTickIcon: false,
            normalOvdFlag: false,
            ovdFlagTrue: false,

            secondArray: [],
            addressType1: {},
            newaddrStatus: '',
            saveDraftPermAddressInfo: {},
            isAccountnoShown: false,

            talukName: "",
            talukApiCalled: false,
            talukLists: [],
            talukCode: "",

            invalidIfsc: false,
            isjlgFlag: "",
            loanReqStatus: [],

            //
            assistedName: "",
            assistedEmail: "",
        }
        this.validator = new SimpleReactValidator();
    }
    componentDidMount() {
        $('[data-dismiss=modal]').on('click', function (e) {
            $('#mobilegenerateOTP').find('input').val('');
            $('#showOtpInput').find('input').val('');
        })
        $('#Picon2').click(function () {
            $('#file3').click();
        })

        $("#digisubmit2").click(function () {
            $("#digiSubmit").click();
        })

        $('#bDueMobileValidation').prop('disabled', true)
        $('#submitProfDetailsOtp').prop('disabled', true)
        $('#kycMobileValidation').prop('disabled', true)

        $("#onBoardDigi").click(function () {
            $("#onbdigiSubmit").click()
        })

        $('.uploadOvdDocuSbtn').prop('disabled', true)
        $('#uploadFrontDocu').hide()
        $('#getFormDetailsNextBtn').prop('disabled', true);
        $("#submitFirstForm1").prop('disabled', true);
        $("#submitFirstForm").prop('disabled', true);
        $("#secondFormBtn").prop('disabled', true);
    }

    handleCheck = (event) => {
        const isActive = event.target.checked;
        this.setState({ isActive: isActive });
    }

    handleViewChange = (e) => {
        console.log(e.target.files);
        this.setState({ viewImages: URL.createObjectURL(e.target.files[0]) })
    }
    //digilocker
    mobileno = (event) => {
        this.setState({ mobilenumber: event.target.value })
    }
    OTP = (event) => {
        this.setState({ otp: event.target.value })
    }
    userRegType = (event) => {
        if (event.target.value == "DIGI") {
            $("#digiAlertModal").click()
        }
        else if (event.target.value == "REGNOW") {
            window.location = "/onboardRegister";
        } else if (event.target.value == "OFKYC") {
            window.location = "/onboardOfflineAadhar";
        } else if (event.target.value == "AAQR") {
            window.location = "/onboardAadharQR";
        }
    }
    routeDigilockerPage = (e) => {
        $("#digiModal").click();
    }
    allMobileno = (event) => {
        //this.setState({ allMobileno: event.target.value })

        var mobileValid = /^[6-9][0-9]{9}$/;
        var eventmInput = event.target.value;
        if (mobileValid.test(eventmInput)) {
            console.log("passed")
            this.setState({ viewEditinvalidMnum: false })
            $('#submitProfDetailsOtp').prop('disabled', false)
            this.setState({ allMobileno: event.target.value })
        } else {
            this.setState({ viewEditinvalidMnum: true })
            $('#submitProfDetailsOtp').prop('disabled', true)
        }
    }
    profileType = (e) => {
        const profileType = e.target.checked;
        if (profileType == true) {
            this.setState({ profileType: 1 })
        } else if (profileType == false) {
            this.setState({ profileType: 2 })
        }
        console.log(e.target.checked, this.state.profileType)
        // const isActive = e.target.checked;
        // this.setState({ isActive: isActive });
    }
    assistGetProfileDetails = () => {
        fetch(BASEURL + '/usrmgmt/assistedgetprofiledetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                referenceid: "",
                mobileno: this.state.allMobileno,
                emailid: "",
                profiletype: this.state.profileType,
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                console.log(resdata.message)

                if (resdata.message == "No personal details available") {
                    alert(resdata.message);
                    $('#exampleModalCenter2').modal('toggle');
                    $("#view").show()
                    this.getGroupInfo()
                    this.setState({ viewEditDisable: false })
                }
                else if (resdata.status == 'Success') {
                    this.setState({
                        memmID: resdata.msgdata.memmid,
                        assistedEmail: resdata.msgdata.emailid
                    })
                    var resId = resdata.msgdata.referenceid;
                    var mobileRef = resdata.msgdata.mobileref;
                    //alert(resdata.message)
                    console.log(resdata.message)
                    this.setState({ assistedProfMbRef: mobileRef })

                    if (this.state.profileType == 2) {
                        //Approved Data
                        //alert(resdata.message)
                        this.setState({ assistedProfMbRef: mobileRef })
                        $("#submitProfileDetails").show();
                        $("#submitProfDetailsOtp").hide();
                        $("#mobilegenerateOTP").hide();
                        $("#showOtpInput").show();
                        console.log(resdata.message)
                        var timeleft = 30;
                        var downloadTimer = setInterval(function () {
                            if (timeleft < 0) {
                                clearInterval(downloadTimer);
                                document.getElementById("Viewcountdown2").innerHTML = "Resend OTP";
                                $('#Viewcountdown').hide()
                                $('#Viewcountdown2').show()

                            } else {
                                document.getElementById("Viewcountdown").innerHTML = "Resend OTP in " + timeleft;
                                $('#Viewcountdown2').hide()
                                $('#Viewcountdown').show()
                            }
                            timeleft -= 1;
                        }, 1000);
                    } else if (this.state.profileType == 1) {
                        if (mobileRef) {
                            //alert(resdata.message)
                            this.setState({ assistedProfMbRef: mobileRef })
                            $("#submitProfileDetails").show();
                            $("#submitProfDetailsOtp").hide();
                            $("#mobilegenerateOTP").hide();
                            $("#showUnapprovedOtp").show();
                            console.log(resdata.message)

                            var timeleft = 30;
                            var downloadTimer = setInterval(function () {
                                if (timeleft < 0) {
                                    clearInterval(downloadTimer);
                                    document.getElementById("ViewUncountdown2").innerHTML = "Resend OTP";
                                    $('#ViewUncountdown').hide()
                                    $('#ViewUncountdown2').show()

                                } else {
                                    document.getElementById("ViewUncountdown").innerHTML = "Resend OTP in " + timeleft;
                                    $('#ViewUncountdown2').hide()
                                    $('#ViewUncountdown').show()
                                }
                                timeleft -= 1;
                            }, 1000);
                        } else {
                            $('#exampleModalCenter2').modal('toggle');
                            //alert(resdata.message)
                            $("#view").show()
                            this.getGroupInfo()
                            this.setState({ viewEditDisable: false })

                            var emailId = resdata.msgdata.emailid;
                            this.setState({ emailAll: emailId })

                            //unApproved Data
                            this.assistedGetUploadedDocImg(resId)
                            // Display data
                            var msgData1 = resdata.msgdata;
                            var profileInfo1 = msgData1.profileinfo;
                            var accountInfo1 = profileInfo1.accountinfo;
                            var personalInfo1 = profileInfo1.personalinfo;
                            var permanentInfo1 = profileInfo1.permanentaddressinfo;

                            //Personal information
                            console.log(msgData1)
                            console.log(profileInfo1)
                            console.log(accountInfo1)
                            console.log(personalInfo1)

                            if (personalInfo1 == "" || "undefined") {
                                this.setState({ Personaliseditted: "false" })
                            }
                            var personalEditvalue;
                            if (personalInfo1) {
                                const length = personalInfo1.length;
                                console.log('length:' + length)
                                personalInfo1.forEach(element => {
                                    console.log('element:' + element)

                                    if (element.attributetype == "Account") {
                                        this.setState({ Account: element.attributevalue })
                                        console.log('Account: ' + this.state.Account)
                                    } else if (element.attributetype == "Dependents") {
                                        this.setState({ Dependents: element.attributevalue })
                                        console.log('Dependents: ' + this.state.Dependents)
                                    } else if (element.attributetype == "Profession") {
                                        this.setState({ Profession: element.attributevalue })
                                        console.log('Profession: ' + this.state.Profession)
                                    } else if (element.attributetype == "Primary Profession") {
                                        this.setState({ primaryProfession: element.attributevalue })
                                        console.log('primaryProfession: ' + this.state.primaryProfession)
                                    } else if (element.attributetype == "Secondary Profession") {
                                        this.setState({ secondaryProfession: element.attributevalue })
                                        console.log('secondaryProfession: ' + this.state.secondaryProfession)
                                    } else if (element.attributetype == "Income Range Group") {
                                        this.setState({ IncomeRangeGroup: element.attributevalue })
                                        console.log('Income Range Group: ' + this.state.IncomeRangeGroup)
                                    } else if (element.attributetype == "Marital Status") {
                                        this.setState({ MaritalStatus: element.attributevalue })
                                        console.log('Marital Status: ' + this.state.MaritalStatus)
                                    } else if (element.attributetype == "Residence Type") {
                                        this.setState({ ResidenceType: element.attributevalue })
                                        console.log('Residence Type: ' + this.state.ResidenceType)
                                    } else if (element.attributetype == "Relation Reference Name") {
                                        this.setState({ RelationName: element.attributevalue })
                                        console.log('Relation Name:' + this.state.RelationName)
                                    } else if (element.attributetype == "Relationship") {
                                        this.setState({ Relation: element.attributevalue })
                                        console.log('Relation: ' + this.state.Relation)
                                    } else if (element.attributetype == "Land Holding") {
                                        this.setState({ LandHolding: element.attributevalue })
                                        console.log('Land Holding: ' + this.state.LandHolding)
                                    } else if (element.attributetype == "Age") {
                                        this.setState({ Age: element.attributevalue })
                                        console.log('Age: ' + this.state.Age)
                                    } else if (element.attributetype == "Years In Residence") {
                                        this.setState({ YearsInResidence: element.attributevalue })
                                        console.log('Years In Residence: ' + this.state.YearsInResidence)
                                    } else if (element.attributetype == "Years Of Earning") {
                                        this.setState({ YearsOfEarning: element.attributevalue })
                                        console.log('Years Of Earning: ' + this.state.YearsOfEarning)
                                    } else if (element.attributetype == "Education") {
                                        this.setState({ Education: element.attributevalue })
                                        console.log('Education: ' + this.state.Education)
                                    } else if (element.iseditted) {
                                        this.setState({ Personaliseditted: element.iseditted })
                                        console.log(element.iseditted)
                                        console.log(this.state.Personaliseditted)
                                        personalEditvalue = element.iseditted
                                    }
                                })
                            } else if (personalEditvalue == "" || "undefined") {
                                this.setState({ Personaliseditted: "false" })
                                console.log(this.state.Personaliseditted)
                            } else {
                                this.setState({ Personaliseditted: personalEditvalue })
                            }
                            console.log(this.state.Personaliseditted)


                            if (permanentInfo1 == "" || "undefined") {
                                this.setState({ PermanentaddressIseditted: "false" })
                            }
                            var permanentValueofIseditted;
                            if (permanentInfo1) {
                                console.log(permanentInfo1)
                                this.setState({ PermanentaddressIseditted: permanentInfo1.iseditted })
                                if (permanentInfo1.addrtype === 1) {
                                    this.setState({
                                        addressType1: permanentInfo1,
                                    });
                                } else {
                                    console.log("Address type is not 1");
                                    // Handle the case when addrtype is not 1
                                }

                                // var parsedData = JSON.parse(permanentInfo1);
                                // console.log(parsedData);
                                if (permanentInfo1.addressinfo) {
                                    this.setState({
                                        addressOvdFormDetails: [permanentInfo1],
                                        saveDraftPermAddressInfo: permanentInfo1,
                                        newaddrStatus: permanentInfo1.addressinfo.newaddrstatus,
                                        selectDocu: permanentInfo1.ovdinfo.type
                                    })
                                }
                                console.log(permanentInfo1.iseditted)
                                permanentValueofIseditted = permanentInfo1.iseditted;
                            } else if (permanentValueofIseditted == "" || "undefined") {
                                this.setState({ PermanentaddressIseditted: "false" })
                            } else {
                                this.setState({ PermanentaddressIseditted: "" })
                            }
                            console.log(this.state.PermanentaddressIseditted)
                            // this.setState({ addressOvdFormDetails:})
                            var accountIsEdittedValue;
                            if (accountInfo1 == "" || "undefined") {
                                this.setState({ accountIseditted: "false" })
                            }
                            if (accountInfo1) {
                                this.setState({ accountifsc: accountInfo1.accountifsc })
                                this.setState({ accountno: accountInfo1.accountno })
                                this.setState({ accounttype: accountInfo1.accounttype })
                                this.setState({ accountvpa: accountInfo1.accountvpa })
                                this.setState({ branch: accountInfo1.branch })
                                this.setState({ accountno2: accountInfo1.accountno })

                                console.log(accountInfo1.iseditted)
                                accountIsEdittedValue = accountInfo1.iseditted;
                                this.setState({ accountIseditted: accountIsEdittedValue })
                            }
                            console.log(this.state.accountIseditted)
                            console.log(accountInfo1)
                            console.log(permanentInfo1)
                            //present

                            this.getBorrowerUserInfo()
                        }
                    }
                } else {
                    alert(resdata.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
        // }
    }
    unapprovedOTp = (e) => {
        this.setState({ unapprovedOTp: e.target.value })
    }
    assistedapprovedCall = () => {
        fetch(BASEURL + '/usrmgmt/assistedgetprofiledetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                referenceid: "",
                mobileno: this.state.allMobileno,
                emailid: "",
                profiletype: this.state.profileType,
                mobileref: String(this.state.assistedProfMbRef),
                mobileotp: this.state.unapprovedOTp
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    this.setState({
                        memmID: resdata.msgdata.memmid,
                        assistedEmail: resdata.msgdata.emailid
                    })
                    var resId = resdata.msgdata.referenceid;

                    var emailId = resdata.msgdata.emailid;
                    this.setState({ emailAll: emailId })

                    var encrypteddata = resdata.msgdata.encrypteddata;
                    if (encrypteddata) {
                        this.setState({ EncryptedData: encrypteddata })
                        this.setState({ encryptedDataFlag: true })
                    }
                    //alert(resdata.message)
                    $('#exampleModalCenter2').modal('toggle');
                    //alert(resdata.message)
                    // confirmAlert({
                    //     message: resdata.message,
                    //     buttons: [
                    //         {
                    //             label: "OK",
                    //             onClick: () => {
                    //                 $("#view").show()
                    //                 this.getGroupInfo()
                    //                 this.setState({ viewEditDisable: false })
                    //             },
                    //         },
                    //     ],
                    //     closeOnClickOutside: false,
                    // });
                    $("#view").show()
                    this.getGroupInfo()
                    this.setState({ viewEditDisable: false })
                    this.assistedGetUploadedDocImg(resId)
                    var imageData = resdata.msgdata.profileinfo.imageinfo;
                    console.log(imageData)
                    var imageID;
                    var imageSource;
                    if (imageData) {
                        imageID = imageData.id;
                        imageSource = imageData.imagesource;
                        this.getPhotoDetails(imageID, imageSource)
                    }

                    var msgData = resdata.msgdata;
                    var profileInfo = msgData.profileinfo;
                    var accountInfo2 = profileInfo.accountinfo;
                    var personalInfo = profileInfo.personalinfo;
                    var permanentInfo2 = profileInfo.permanentaddressinfo;

                    console.log(msgData)
                    console.log(profileInfo)
                    console.log(accountInfo2)
                    console.log(personalInfo)

                    if (personalInfo == "" || "undefined") {
                        this.setState({ Personaliseditted: "false" })
                    }

                    var personalEditted;
                    if (personalInfo) {
                        const length = personalInfo.length;
                        console.log('length:' + length)
                        personalInfo.forEach(element => {
                            console.log('element:' + element)
                            if (element.attributetype == "Account") {
                                this.setState({ Account: element.attributevalue })
                                console.log('Account: ' + this.state.Account)
                            } else if (element.attributetype == "Dependents") {
                                this.setState({ Dependents: element.attributevalue })
                                console.log('Dependents: ' + this.state.Dependents)
                            } else if (element.attributetype == "Profession") {
                                this.setState({ Profession: element.attributevalue })
                                console.log('Profession: ' + this.state.Profession)
                            } else if (element.attributetype == "Primary Profession") {
                                this.setState({ primaryProfession: element.attributevalue })
                                console.log('primaryProfession: ' + this.state.primaryProfession)
                            } else if (element.attributetype == "Secondary Profession") {
                                this.setState({ secondaryProfession: element.attributevalue })
                                console.log('secondaryProfession: ' + this.state.secondaryProfession)
                            } else if (element.attributetype == "Income Range Group") {
                                this.setState({ IncomeRangeGroup: element.attributevalue })
                                console.log('Income Range Group: ' + this.state.IncomeRangeGroup)
                            } else if (element.attributetype == "Marital Status") {
                                this.setState({ MaritalStatus: element.attributevalue })
                                console.log('Marital Status: ' + this.state.MaritalStatus)
                            } else if (element.attributetype == "Residence Type") {
                                this.setState({ ResidenceType: element.attributevalue })
                                console.log('Residence Type: ' + this.state.ResidenceType)
                            } else if (element.attributetype == "Relation Reference Name") {
                                this.setState({ RelationName: element.attributevalue })
                                console.log('Relation Name:' + this.state.RelationName)
                            } else if (element.attributetype == "Relationship") {
                                this.setState({ Relation: element.attributevalue })
                                console.log('Relation: ' + this.state.Relation)
                            } else if (element.attributetype == "Land Holding") {
                                this.setState({ LandHolding: element.attributevalue })
                                console.log('Land Holding: ' + this.state.LandHolding)
                            } else if (element.attributetype == "Age") {
                                this.setState({ Age: element.attributevalue })
                                console.log('Age: ' + this.state.Age)
                            } else if (element.attributetype == "Years In Residence") {
                                this.setState({ YearsInResidence: element.attributevalue })
                                console.log('Years In Residence: ' + this.state.YearsInResidence)
                            } else if (element.attributetype == "Years Of Earning") {
                                this.setState({ YearsOfEarning: element.attributevalue })
                                console.log('Years Of Earning: ' + this.state.YearsOfEarning)
                            } else if (element.attributetype == "Education") {
                                this.setState({ Education: element.attributevalue })
                                console.log('Education: ' + this.state.Education)
                            } else if (element.iseditted) {
                                this.setState({ Personaliseditted: element.iseditted })
                                console.log(element.iseditted)
                                personalEditted = element.iseditted
                            }
                        })
                    } else if (personalEditted == "" || "undefined") {
                        this.setState({ Personaliseditted: "false" })
                        console.log(this.state.Personaliseditted)
                    } else {
                        this.setState({ Personaliseditted: personalEditted })
                    }
                    console.log(this.state.Personaliseditted)
                    // if (personalEditted == "" || "undefined") {
                    //     this.setState({ Personaliseditted: "false" })
                    // }

                    if (permanentInfo2 == "" || "undefined") {
                        this.setState({ PermanentaddressIseditted: "false" })
                    }
                    var permanentaddIseditted;
                    if (permanentInfo2) {
                        console.log(permanentInfo2)

                        this.setState({ PermanentaddressIseditted: permanentInfo2.iseditted });
                        console.log(this.state.PermanentaddressIseditted)
                        permanentaddIseditted = permanentInfo2.iseditted;
                        if (permanentInfo2.address1) {
                            console.log(permanentInfo2.address1)
                            if (permanentInfo2.addrtype === 1) {
                                this.setState({
                                    addressType1: permanentInfo2,
                                });
                            } else {
                                console.log("Address type is not 1");
                                // Handle the case when addrtype is not 1
                            }
                        }

                        // var parsedData = JSON.parse(permanentInfo2);
                        // console.log(parsedData);
                        if (permanentInfo2.addressinfo) {
                            this.setState({
                                addressOvdFormDetails: [permanentInfo2],
                                saveDraftPermAddressInfo: permanentInfo2,
                                newaddrStatus: permanentInfo2.addressinfo.newaddrstatus,
                                selectDocu: permanentInfo2.ovdinfo.type
                            })
                        }
                    } else {
                        this.setState({ PermanentaddressIseditted: "" })
                    }
                    console.log(this.state.PermanentaddressIseditted)
                    // this.setState({addressOvdFormDetails:})
                    var accountisEditted;
                    if (accountInfo2 == "" || "undefined") {
                        this.setState({ accountIseditted: "false" })
                    }

                    if (accountInfo2) {
                        this.setState({ accountifsc: accountInfo2.accountifsc })
                        this.setState({ accountno: accountInfo2.accountno })
                        this.setState({ accounttype: accountInfo2.accounttype })
                        this.setState({ accountvpa: accountInfo2.accountvpa })
                        this.setState({ branch: accountInfo2.branch })
                        this.setState({ accountno2: accountInfo2.accountno })

                        this.setState({ accountIseditted: accountInfo2.iseditted });
                        console.log(this.state.accountIseditted)

                        accountisEditted = accountInfo2.iseditted;
                        this.setState({ accountIseditted: accountisEditted })
                        if (accountisEditted == "" || "undefined") {
                            this.setState({ accountIseditted: "false" })
                        }
                    }
                    console.log(this.state.accountIseditted)
                    // if (accountInfo2 == "" || "undefined") {
                    //     this.setState({ accountIseditted: "false" })
                    // }

                    console.log(personalInfo)
                    console.log(permanentInfo2)
                    console.log(accountInfo2)

                    this.setState({ personalDetailsData: personalInfo })
                    this.setState({ permananentDetailsData: permanentInfo2 })
                    this.setState({ accountDetailsData: accountInfo2 })
                    this.getBorrowerUserInfo()
                } else {
                    alert(resdata.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getPhotoDetails = (id, imagesource) => {
        var memmid = sessionStorage.getItem("memmID")
        fetch(BASEURL + '/usrmgmt/getphotodetails?id=' + id + '&memmid=' + this.state.memmID, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    console.log(resdata);

                    var responseImage = resdata.msgdata;
                    console.log(responseImage);
                    var typeOfImage = responseImage.imagesource;
                    console.log(typeOfImage);
                    this.setState({
                        profileImage: resdata.msgdata.image
                    })
                    console.log(this.state.profileImage);
                    // const str = 'UPLD';
                    // if (typeOfImage.includes("VKYCLIV")) {
                    //     this.setState({
                    //         profileImage: resdata.msgdata.image
                    //     })
                    // } else if (typeOfImage.includes("UPLD")) {
                    //     this.setState({
                    //         profileImage: resdata.msgdata.image
                    //     })
                    // }
                    // else if (typeOfImage.includes("ID")) {
                    //     this.setState({
                    //         profileImage: resdata.msgdata.image
                    //     })
                    // }
                }
            }).catch = (e) => {
                alert(e);
            }
    }
    assistedGetUploadedDocImg = (resId) => {
        fetch(BASEURL + '/usrmgmt/assistedgetuploaddocumentorphoto', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                referenceid: resId,
                mobileno: this.state.allMobileno,
                emailid: ""
            })
        })
            .then(response => response.json())
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    //alert(resdata.message)
                    var imageorDocData = resdata.msgdata.imageordocdetails;
                    console.log(imageorDocData)
                    var imageInfo;
                    var data = "";
                    var imageData = "";
                    imageorDocData.forEach(element => {
                        console.log(element);
                        data = element.imageinfo;
                        imageData = element.image;
                        this.setState({
                            profileImage: imageData
                        })
                        console.log(data);
                        console.log(imageData);

                    })
                    this.setState({ imageFlag: true })

                } else {
                    //alert(resdata.message);
                    this.setState({ imageFlag: false })
                }

            })
            .catch(error => console.log(error)
            );
    }
    personalSubmit = () => {
        this.setState({ personalSubmit: true })
        $("#personalSubmit").show()
        $("#EditPersonalbtn").show()
        $("#savepersonalDetBtn").show()

        $("#addressSubmitPermanent").hide()
        $("#EditAddressbtn").hide()
        $("#saveAddressDetBtn").hide()

        $("#addressSubmitPresent").hide()
        $("#saveAddressPresentDetBtn").hide()

        $("#bankSubmit").hide()
        $("#EditBankbtn").hide()
        $("#saveBankDetBtn").hide()
    }
    addressSubmit = () => {
        this.setState({ addressSubmit: true })
        $("#personalSubmit").hide()
        $("#EditPersonalbtn").hide()
        $("#savepersonalDetBtn").hide()

        $("#addressSubmitPermanent").show()
        $("#EditAddressbtn").show()
        $("#saveAddressDetBtn").show()

        $("#addressSubmitPresent").hide()
        $("#saveAddressPresentDetBtn").hide()

        $("#bankSubmit").hide()
        $("#EditBankbtn").hide()
        $("#saveBankDetBtn").hide()
    }
    bankSubmit = () => {
        this.setState({ bankSubmit: true })
        $("#personalSubmit").hide()
        $("#EditPersonalbtn").hide()
        $("#savepersonalDetBtn").hide()

        $("#addressSubmitPermanent").hide()
        $("#EditAddressbtn").hide()
        $("#saveAddressDetBtn").hide()

        $("#addressSubmitPresent").hide()
        $("#saveAddressPresentDetBtn").hide()

        $("#bankSubmit").show()
        $("#EditBankbtn").show()
        $("#saveBankDetBtn").show()
    }

    viewEditPtab = () => {
        $("#viewEditModal").click()
    }
    ViewregenerateOTP = () => {
        fetch(BASEURL + '/usrmgmt/regenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                operationtype: 11,
                mobileref: String(this.state.assistedProfMbRef),
                emailref: String(this.state.assistedProfMbRef),
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
                    this.setState({ assistedProfMbRef: resdata.msgdata.mobileref });

                    alert(resdata.message)
                    // confirmAlert({
                    //     message: resdata.message,
                    //     buttons: [
                    //         {
                    //             label: "OK",
                    //             onClick: () => {
                    //             },
                    //         },
                    //     ],
                    // });
                    var timeleft = 30;
                    var downloadTimer = setInterval(function () {
                        if (timeleft < 0) {
                            clearInterval(downloadTimer);
                            document.getElementById("Viewcountdown2").innerHTML = "Resend OTP";
                            $('#Viewcountdown').hide()
                            $('#Viewcountdown2').show()

                        } else {
                            document.getElementById("Viewcountdown").innerHTML = "Resend OTP in " + timeleft;
                            $('#Viewcountdown2').hide()
                            $('#Viewcountdown').show()
                        }
                        timeleft -= 1;
                    }, 1000);
                }
                else {
                    alert(resdata.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    ViewUnappregenerateOTP2 = () => {
        fetch(BASEURL + '/usrmgmt/regenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                operationtype: 10,
                mobileref: String(this.state.assistedProfMbRef),
                emailref: String(this.state.assistedProfMbRef),
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
                    this.setState({ assistedProfMbRef: resdata.msgdata.mobileref });

                    alert(resdata.message)
                    var timeleft = 30;
                    var downloadTimer = setInterval(function () {
                        if (timeleft < 0) {
                            clearInterval(downloadTimer);
                            document.getElementById("ViewUncountdown2").innerHTML = "Resend OTP";
                            $('#ViewUncountdown').hide()
                            $('#ViewUncountdown2').show()

                        } else {
                            document.getElementById("ViewUncountdown").innerHTML = "Resend OTP in " + timeleft;
                            $('#ViewUncountdown2').hide()
                            $('#ViewUncountdown').show()
                        }
                        timeleft -= 1;
                    }, 1000);
                }
                else {
                    alert(resdata.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // LP Details
    LPMobileno = (event) => {
        this.setState({ allMobileno: event.target.value })
    }

    handlePageClick = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData();
        })
    }
    loadMoreData = () => {
        const data = this.state.orgtableData;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            loanOfferList: slice
        })
    }
    LPviewtab = () => {
        //$("#LoanProcessModal").click()
        fetch(BASEURL + '/lsp/assistedgetloanrequests', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanstatus: "1",
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    this.setState({ showLoader: false })
                    console.log(resdata.msgdata);
                    $("#LoanProcessing").show()

                    this.setState({
                        loanOfferList: resdata.msgdata.map((pdata) => {
                            pdata.showResults = false;
                            return pdata;
                        })
                    })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        loanOfferList: slice
                    })
                }
                else {
                    this.setState({ showLoader: false })
                    alert(resdata.message);
                }
            }).catch((error) => {
                console.log(error)
            })

    }
    loanOffers = (emiamt,
        tenureoffered,
        repaymentfrequencydesc,
        loanstatus,
        offeredamt,
        loanreqno,
        index,
        loanaccountstatus,
        borrowerid,
        productid,
        requestedamt) => {
        // $("#content").toggle()
        const listofLoan = this.state.loanOfferList;
        listofLoan[index].showDetails = !listofLoan[index].showDetails;
        this.setState({ loanOfferList: listofLoan })
        console.log(this.state.loanOfferList)

        console.log(emiamt,
            tenureoffered,
            repaymentfrequencydesc,
            loanstatus,
            offeredamt,
            loanreqno,
            loanaccountstatus,
            borrowerid,
            productid,
            requestedamt)
        this.setState({ loanStatus: loanstatus });
        this.setState({ LoanreqStatus: loanstatus })
        console.log(this.state.LoanreqStatus)
        loanAccStatus = loanaccountstatus;
        LoanStatus = loanstatus;
        this.setState({ loanreqno: loanreqno })
        this.setState({ borrowerid: borrowerid })
        this.setState({ ProductID: productid })
        this.setState({ RequestedAmt: requestedamt })
        sessionStorage.setItem("assistBorrowerID", borrowerid)
        this.loanOffers2(loanreqno);
    }
    handleToggle = (loan,
        emiamt,
        tenureoffered,
        repaymentfrequencydesc,
        loanstatus,
        offeredamt,
        loanreqno,
        index,
        loanaccountstatus,
        borrowerid,
        productid,
        requestedamt,
        isjlg) => {
        if (this.state.toggle === loan) {
            // setToggle(null);
            this.setState({ toggle: null });
            return false
        }
        //    setToggle(id)
        this.setState({ toggle: loan })

        console.log(emiamt,
            tenureoffered,
            repaymentfrequencydesc,
            loanstatus,
            offeredamt,
            loanreqno,
            loanaccountstatus,
            borrowerid,
            productid,
            requestedamt)
        console.log("isJLG", isjlg)
        this.setState({ isjlgFlag: isjlg });
        this.setState({ loanStatus: loanstatus });
        this.setState({ LoanreqStatus: loanstatus })
        console.log(this.state.LoanreqStatus)
        loanAccStatus = loanaccountstatus;
        LoanStatus = loanstatus;
        this.setState({ loanreqno: loanreqno })
        this.setState({ borrowerid: borrowerid })
        this.setState({ ProductID: productid })
        this.setState({ RequestedAmt: requestedamt })
        sessionStorage.setItem("assistBorrowerID", borrowerid)
        this.loanOffers2(loanreqno);

    }
    // Permanent Address Info

    // district = (event) => {
    //     this.setState({ district: event.target.value, intialDistrict: "Select Districts" })
    //     ////console.log(event.target.value);
    //     if (event.target.value === "Select District") {
    //         this.setState({ district: "No Districts" });
    //         var defaultList = [];
    //         defaultList.push("No Districts");
    //         this.setState({ districtList: defaultList, district: "No Districts", });
    //     } else {
    //         // this.setState({ district: "" });
    //         if (this.state.talukFlag !== "p2p") {
    //             this.state.districtList
    //                 .filter((e) => e.distid == event.target.value)
    //                 .map(() => {
    //                     this.getTalukList(event.target.value);
    //                 })
    //         }
    //     }
    //     this.setState({ PermanentaddressIseditted: "true" })

    // }
    // getTalukList = (districtCode) => {
    //     fetch(BASEURL + '/usrmgmt/gettaluklist?districtid=' + districtCode, {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': "Bearer " + sessionStorage.getItem('token')
    //         }
    //     }).then((Response) => Response.json())
    //         .then((resdata) => {
    //             if (resdata.status === 'Success') {
    //                 this.setState({ talukList: resdata.msgdata.taluklist })
    //             }
    //             else {

    //             }
    //         })
    // }

    // Bank Info
    accounttype = (event) => {
        this.setState({ accounttype: event.target.value })
        this.setState({ accountIseditted: "true" })
    }
    accountifsc = (event) => {
        this.setState({ accountifsc: event.target.value })

        var match = /^[A-Z]{4}[0][A-Z0-9]{6}$/;
        var ifscNo = event.target.value;
        if (match.test(ifscNo)) {
            this.setState({
                accountifsc: ifscNo,
                invalidIfsc: false
            })
            console.log("passed")
        } else {
            this.setState({ invalidIfsc: true })
            return false;
        }
        this.setState({ accountIseditted: "true" })
    }
    accountno = (event) => {
        this.setState({ accountno: event.target.value })
        this.setState({ accountIseditted: "true" })
    }
    accountno2 = (event) => {
        switch (event.target.name) {
            case "confirm-account": (event.target.value !== document.getElementsByName('account')[0].value) ?
                this.setState({ confirmAccount: true }) : this.setState({ confirmAccount: false })
                break;

            default:
                break;
        }
        this.setState({ accountno2: event.target.value })
        this.setState({ accountIseditted: "true" })
    }
    accountvpa = (event) => {
        this.setState({ accountvpa: event.target.value })
        this.setState({ accountIseditted: "true" })
    }
    branch = (event) => {
        this.setState({ branch: event.target.value })
        this.setState({ accountIseditted: "true" })
    }
    getGroupInfo() {
        fetch(BASEURL + '/configuration/getgroupinfo', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                groupnames: ["BORROWER"]

            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({ grpInfo: resdata.data.BORROWER })
                }
                else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    primaryProfession = (event) => {
        // this.setState({ primaryProfession: event.target.value })
        const newPrimaryProfession = event.target.value;
        if (newPrimaryProfession === this.state.secondaryProfession) {
            console.log("Primary and secondary professions should not match.");
            this.setState({ primaryProfValid: true });
        } else {
            this.setState({ primaryProfValid: false });
            this.setState({ primaryProfession: newPrimaryProfession });
        }
        this.setState({ Personaliseditted: "true" })
    }
    secondaryProfession = (event) => {
        // this.setState({ secondaryProfession: event.target.value })
        const newSecondaryProfession = event.target.value;
        if (newSecondaryProfession === this.state.primaryProfession) {
            console.log("Primary and secondary professions should not match.");
            this.setState({ secondaProfValid: true });
        } else {
            this.setState({ secondaProfValid: false });
            this.setState({ secondaryProfession: newSecondaryProfession });
        }
        this.setState({ Personaliseditted: "true" })
    }
    Profession = (event) => {
        this.setState({ Profession: event.target.value })
        this.setState({ Personaliseditted: "true" })
    }
    Account = (event) => {
        this.setState({ Account: event.target.value })
        this.setState({ Personaliseditted: "true" })
    }
    YearsInResidence = (event) => {
        this.setState({ YearsInResidence: event.target.value })
        this.setState({ Personaliseditted: "true" })
    }
    YearsOfEarning = (event) => {
        this.setState({ YearsOfEarning: event.target.value })
        this.setState({ Personaliseditted: "true" })
    }
    IncomeRangeGroup = (event) => {
        this.setState({ IncomeRangeGroup: event.target.value })
        this.setState({ Personaliseditted: "true" })
    }
    ResidenceType = (event) => {
        this.setState({ ResidenceType: event.target.value })
        this.setState({ Personaliseditted: "true" })
    }
    MaritalStatus = (event) => {
        this.setState({ MaritalStatus: event.target.value })
        this.setState({ Personaliseditted: "true" })
    }
    Relation = (event) => {
        this.setState({ Relation: event.target.value.slice(0, -3) })
        this.setState({ Personaliseditted: "true" })
    }
    Dependents = (event) => {
        this.setState({ Dependents: event.target.value })
        this.setState({ Personaliseditted: "true" })
    }
    Education = (event) => {
        this.setState({ Education: event.target.value })
        this.setState({ Personaliseditted: "true" })
    }
    RelationName = (event) => {
        this.setState({ RelationName: event.target.value })
        this.setState({ Personaliseditted: "true" })
    }
    LandHolding = (event) => {
        this.setState({ LandHolding: event.target.value })
        this.setState({ Personaliseditted: "true" })
    }
    Age = (event) => {
        this.setState({ Age: event.target.value })
        this.setState({ Personaliseditted: "true" })
    }
    assistedSaveDataFinal = (event) => {
        // if (this.state.state1.length != 2) {

        // } else {
        //     this.state.talukList.forEach(ele2 => {
        //         if (ele2.talukname == this.state.taluk) {
        //             data.taluk = ele2.talukname;
        //         }
        //     })
        // }

        var updatedExtractedData = this.state.formFieldLists.map(obj => ({ field: obj.field, value: obj.value }));
        console.log(updatedExtractedData)
        var poaExtData = this.state.addressFormFieldLists.map(obj => ({ field: obj.field, value: obj.value }));
        console.log(poaExtData)

        var personalDetailsData = this.state.personalDetailsData;
        var permananentDetailsData = this.state.permananentDetailsData;
        var accountDetailsData = this.state.accountDetailsData;
        console.log(personalDetailsData, permananentDetailsData, accountDetailsData)
        var personalData = {
            mobileno: this.state.allMobileno,
            emailid: this.state.emailAll,
        }
        //  if (this.state.Personaliseditted === "true" || (personalDetailsData && personalDetailsData.length > 0)) {

        if (this.state.Personaliseditted === "true" || (personalDetailsData && personalDetailsData.length > 0)) {
            const attributes = [
                { "attributetype": "Primary Profession", "attributetypeid": "BAT01", "attributeid": "A", "attributevalue": this.state.primaryProfession },
                { "attributetype": "Income Range Group", "attributetypeid": "BAT02", "attributeid": "A", "attributevalue": this.state.IncomeRangeGroup },
                { "attributetype": "Education", "attributetypeid": "BAT03", "attributeid": "A", "attributevalue": this.state.Education },
                { "attributetype": "Residence Type", "attributetypeid": "BAT04", "attributeid": "A", "attributevalue": this.state.ResidenceType },
                { "attributetype": "Account", "attributetypeid": "BAT05", "attributeid": "A", "attributevalue": this.state.Account },
                { "attributetype": "Marital Status", "attributetypeid": "BAT06", "attributeid": "B", "attributevalue": this.state.MaritalStatus },
                { "attributetype": "Relationship", "attributetypeid": "BAT07", "attributeid": "B", "attributevalue": this.state.Relation },
                { "attributetype": "Relation Reference Name", "attributetypeid": "BAT08", "attributeid": "A", "attributevalue": this.state.RelationName },
                { "attributetype": "Land Holding", "attributetypeid": "BAT09", "attributeid": "A", "attributevalue": this.state.LandHolding },
                { "attributetype": "Age", "attributetypeid": "BAT10", "attributeid": "A", "attributevalue": this.state.Age },
                { "attributetype": "Dependents", "attributetypeid": "BAT11", "attributeid": "A", "attributevalue": this.state.Dependents },
                { "attributetype": "Years In Residence", "attributetypeid": "BAT12", "attributeid": "A", "attributevalue": this.state.YearsInResidence },
                { "attributetype": "Years Of Earning", "attributetypeid": "BAT13", "attributeid": "A", "attributevalue": this.state.YearsOfEarning },
                { "attributetype": "Secondary Profession", "attributetypeid": "BAT14", "attributeid": "A", "attributevalue": this.state.secondaryProfession },
                { "iseditted": this.state.Personaliseditted }
            ]
            personalData.personalinfo = {
                attributes,
            };
        }

        var permanentPOAaddress = {
            ovdinfo: {
                category: this.state.formCategory,
                type: this.state.formType,
                majorid: this.state.formOvdRefNo,
                formdata: {
                    formfields: updatedExtractedData
                }
            },
            addressinfo: {
                category: this.state.poaformCategory,
                type: this.state.poaformType,
                majorid: this.state.formOvdRefNo,
                formdata: {
                    formfields: poaExtData
                }
            },
            iseditted: this.state.PermanentaddressIseditted
        }
        if (this.state.PermanentaddressIseditted === "true" || (permananentDetailsData && permananentDetailsData.length > 0)) {
            if (permanentPOAaddress.ovdinfo.category === "") {
                personalData.permanentaddressinfo = this.state.saveDraftPermAddressInfo;
            } else {
                personalData.permanentaddressinfo = permanentPOAaddress;
            }
        }

        // Add accountinfo if condition is true
        if (this.state.accountIseditted === "true" || (this.state.accountDetailsData && Object.keys(this.state.accountDetailsData).length > 0)) {
            personalData.accountinfo = {
                accountno: this.state.accountno,
                accountifsc: this.state.accountifsc,
                accountvpa: this.state.accountvpa,
                accounttype: parseInt(this.state.accounttype),
                branch: this.state.branch,
                iseditted: this.state.accountIseditted,
            };
        }
        const withencryptData = this.state.encryptedDataFlag ? JSON.stringify({ ...personalData, encrypteddata: this.state.EncryptedData }) : JSON.stringify({ personalData });
        const withoutencryptData = JSON.stringify({ ...personalData })
            ;

        // let data = {};
        var assistSavedata;
        assistSavedata = this.state.encryptedDataFlag == true ? withencryptData : withoutencryptData;
        console.log(assistSavedata)
        this.setState({ showLoader: true })
        fetch(BASEURL + '/usrmgmt/assistedsaveprofiledetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: assistSavedata
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({ showLoader: false })
                    console.log(resdata);
                    var refId = resdata.msgData.referenceid;
                    console.log(refId);
                    this.setState({ refId: resdata.msgData.referenceid })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => {
                                    this.setState({ assistSaveFlag: true })
                                }
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                } else {
                    this.setState({ showLoader: false })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => {

                                }
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }
            })
    }
    showEditPersonalDetails = () => {
        this.setState({ Personaliseditted: "true" })
    }
    showEditAddressDetails = () => {
        this.setState({ PermanentaddressIseditted: "true" })
        $("#permanentAddress").show();
        $("#addressSubmitPermanent").show()
    }
    showEditBankDetails = () => {
        this.setState({ accountIseditted: "true" })
    }
    assistProfDiscard = (e) => {
        var input_before = this.state.RelationName
        //$('#profession').val($('#profession').data(this.state.Profession));
        // relationName
        $("input[name='relationName']").val(input_before);
    }
    discardChanges=()=>{
        window.location="/facilitatorDashboard"
    }
    assistedSubmitProfileDetails = (refId) => {
        //$("#cnfProfileModal").click()
        //var referenceID=this.state.refId
        this.setState({ showLoader: true })
        fetch(BASEURL + "/usrmgmt/assistedsubmitprofiledetails", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                referenceid: String(this.state.refId),
                mobileno: this.state.allMobileno
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success") {
                    this.setState({ showLoader: false })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => {
                                    $("#cnfProfileModal").click();
                                    console.log(resdata.msgdata)
                                    var msgData = resdata.msgdata;
                                    this.setState({ cnfRefId: msgData.referenceid })
                                    this.setState({ cnfMobileRef: msgData.mobileref })
                                    this.setState({ cnfProfileHash: msgData.profilehash })

                                    var timeleft = 30;
                                    var downloadTimer = setInterval(function () {
                                        if (timeleft < 0) {
                                            clearInterval(downloadTimer);
                                            document.getElementById("ConfirmSubmitcountdown2").innerHTML = "Resend OTP";
                                            $('#ConfirmSubmitcountdown').hide()
                                            $('#ConfirmSubmitcountdown2').show()

                                        } else {
                                            document.getElementById("ConfirmSubmitcountdown").innerHTML = "Resend OTP in " + timeleft;
                                            $('#ConfirmSubmitcountdown2').hide()
                                            $('#ConfirmSubmitcountdown').show()

                                        }
                                        timeleft -= 1;
                                    }, 1000);
                                }
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                } else {
                    //alert(resdata.message)
                    this.setState({ showLoader: false })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => {

                                }
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }
            })
    }
    ConfirmSubmitregenerateOTP = () => {
        fetch(BASEURL + '/usrmgmt/regenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                operationtype: 6,
                mobileref: String(this.state.cnfMobileRef),
                emailref: String(this.state.cnfMobileRef),
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
                    this.setState({ cnfMobileRef: resdata.msgdata.mobileref });

                    alert(resdata.message)
                    var timeleft = 30;
                    var downloadTimer = setInterval(function () {
                        if (timeleft < 0) {
                            clearInterval(downloadTimer);
                            document.getElementById("ConfirmSubmitcountdown2").innerHTML = "Resend OTP";
                            $('#ConfirmSubmitcountdown').hide()
                            $('#ConfirmSubmitcountdown2').show()

                        } else {
                            document.getElementById("ConfirmSubmitcountdown").innerHTML = "Resend OTP in " + timeleft;
                            $('#ConfirmSubmitcountdown2').hide()
                            $('#ConfirmSubmitcountdown').show()

                        }
                        timeleft -= 1;
                    }, 1000);
                }
                else {
                    alert(resdata.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    cnfProfileOTP = (event) => {
        this.setState({ cnfmobileOtp: event.target.value })
    }
    assistConfirmDetails = () => {
        this.setState({ showLoader: true })
        fetch(BASEURL + "/usrmgmt/assistedconfirmprofiledetails", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                referenceid: this.state.cnfRefId,
                mobileotp: this.state.cnfmobileOtp,
                mobileref: String(this.state.cnfMobileRef),
                profilehash: this.state.cnfProfileHash
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success") {
                    console.log("called here")
                    this.setState({ showLoader: false })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => {
                                    window.location.reload()
                                }
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                } else {
                    //alert(resdata.message)
                    console.log("called there")
                    this.setState({ showLoader: false })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => {

                                }
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }
            })
    }
    assistedUploadImageDocu = (e) => {
        var imgData = new FormData()
        var fileField = document.getElementById("file3");
        // docinfo: {
        //     doc_type_cv_id: 1,
        //     doc_format_cv_id: 1,
        //     doc_page: 1,
        //     doc_number: "1234"
        // },
        var body = JSON.stringify({
            basicinfo: {
                mobileno: this.state.allMobileno,
                emailid: "",
            },
            imageinfo: {
                image_type_cv_id: 1
            }

        })
        imgData.append("file", fileField.files[0]);
        imgData.append("fileInfo", body);

        fetch(BASEURL + '/usrmgmt/assisteduploaddocumentorphoto', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: imgData
        })
            .then(response => response.json())
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    //alert(resdata.message)

                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => {
                                    this.setState({ imageFlag: false })
                                }
                            },
                        ],
                        closeOnClickOutside: false,
                    });

                    this.setState({ profileImage: URL.createObjectURL(fileField.files[0]) })


                } else {
                    //alert("Issue: " + resdata.message);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => {

                                }
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }

            })
            .catch(error => console.log(error)
            );
    }
    loanOffers2 = (loanreqno) => {
        fetch(BASEURL + '/lsp/getloanoffers', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: loanreqno
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ loanofferid: resdata.msgdata[0].offerid });
                    this.setState({ emiAmt: resdata.msgdata[0].emiamt });
                    this.setState({ TenureOffered: resdata.msgdata[0].tenure });
                    this.setState({ repaymentDesc: resdata.msgdata[0].tenuredesc });
                    this.setState({ offeredAmt: resdata.msgdata[0].loanamtoffered });
                    this.setState({ riskRating: resdata.msgdata[0].riskrating });
                    this.setState({ interestRate: resdata.msgdata[0].interestrate });

                    this.setState({ loanOfferDetails: resdata.msgdata[0] });
                    var loanreq = resdata.msgdata[0].loanreqno;
                    this.loanFundingStat(loanreq)


                    if (this.state.loanOfferDetails.loanreqstatus == 1) {
                        this.setState({ loanStatus: "Active" })
                    }
                    else if (this.state.loanOfferDetails.loanreqstatus == 2) {
                        this.setState({ loanStatus: "Offer Generated" })
                    }
                    else if (this.state.loanOfferDetails.loanreqstatus == 3) {
                        this.setState({ loanStatus: "Offer Accepted" })
                    }
                    else if (this.state.loanOfferDetails.loanreqstatus == 4) {
                        this.setState({ loanStatus: "Rejected" })
                    }
                    else if (this.state.loanOfferDetails.loanreqstatus == 5) {
                        this.setState({ loanStatus: "Withdrawn" })
                    }

                    sessionStorage.setItem("loanrequestnumber", this.state.loanOfferDetails.loanreqno)

                } else {

                }
            })
    }
    getloanaccountStatus = (loanlistingNo) => {
        fetch(BASEURL + '/lsp/getloanaccountstatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanlistingno: loanlistingNo
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    var loandocumentationstatus = resdata.msgdata.loandocumentationstatus;
                    console.log(loandocumentationstatus);

                    LoanActSt = resdata.msgdata;
                    console.log(LoanActSt)

                    this.setState({ agreementSignedFlag: loandocumentationstatus })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    acceptOffer = () => {
        fetch(BASEURL + '/lsp/assistedoperationsgenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                borrowerid: this.state.borrowerid,
                operationtype: "7",
                loanrequestnumber: this.state.loanreqno,
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS' || resdata.status == 'Success') {
                    console.log(resdata);
                    $("#exampleModalCenter3").modal('hide')
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => {
                                    console.log(this.state.loanreqno)
                                    $("#acceptOfferModal").click()
                                    this.setState({ otpRef: resdata.msgdata.otpref })

                                    var timeleft = 30;
                                    var downloadTimer = setInterval(function () {
                                        if (timeleft < 0) {
                                            clearInterval(downloadTimer);
                                            document.getElementById("acOffercountdown2").innerHTML = "Resend OTP";
                                            $('#acOffercountdown').hide()
                                            $('#acOffercountdown2').show()

                                        } else {
                                            document.getElementById("acOffercountdown").innerHTML = "Resend OTP in " + timeleft;
                                            $('#acOffercountdown2').hide()
                                            $('#acOffercountdown').show()
                                        }
                                        timeleft -= 1;
                                    }, 1000);
                                }
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                } else {
                    $("#exampleModalCenter3").modal('hide')
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => {

                                }
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }
            }).catch((error) => {
                console.log(error)
            })
    }
    acceptOfferregenerateOTP = () => {
        fetch(BASEURL + '/usrmgmt/regenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                operationtype: 7,
                mobileref: this.state.otpRef,
                emailref: this.state.otpRef,
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
                    this.setState({ otpRef: resdata.msgdata.mobileref });
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => {
                                    var timeleft = 30;
                                    var downloadTimer = setInterval(function () {
                                        if (timeleft < 0) {
                                            clearInterval(downloadTimer);
                                            document.getElementById("acOffercountdown2").innerHTML = "Resend OTP";
                                            $('#acOffercountdown').hide()
                                            $('#acOffercountdown2').show()

                                        } else {
                                            document.getElementById("acOffercountdown").innerHTML = "Resend OTP in " + timeleft;
                                            $('#acOffercountdown2').hide()
                                            $('#acOffercountdown').show()
                                        }
                                        timeleft -= 1;
                                    }, 1000);
                                }
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }
                else {
                    $("#exampleModalCenter3").modal('hide')
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => {

                                }
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
    enterLPOTP = (event) => {
        this.setState({ emailOtp: event.target.value })
    }
    enterLPOTP2 = (event) => {
        this.setState({ mobileOtp: event.target.value })
    }
    acceptOfferOTP = () => {
        console.log(this.state.otpRef)
        fetch(BASEURL + '/lsp/acceptloanoffer', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: this.state.loanreqno,
                loanofferid: this.state.loanofferid,
                mobileotp: this.state.mobileOtp,
                otpref: String(this.state.otpRef),
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    alert(resdata.message)
                    console.log(this.state.loanreqno)
                    window.location.reload()
                } else {
                    alert(resdata.message)
                }
            }).catch((error) => {
                console.log(error)
            })
    }
    //accept Funding
    loanFundingStat = (loanreq) => {
        fetch(BASEURL + '/lsp/getloanfundingstatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: loanreq
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    sessionStorage.setItem('loanlistingnumber', resdata.msgdata.loanlistingno);
                    sessionStorage.setItem('loanrequestnumber', this.state.loanreqno);
                    console.log('Funding percent:', resdata.msgdata.fundingperc);
                    //sessionStorage.setItem('loanrequestnumber', resdata.msgdata.loanreqno);

                    // console.log(sessionStorage.getItem('loanlistingnumber'))
                    const fundP = resdata.msgdata.fundingperc + "%";
                    const fundPer = fundP.replace(" ", "0");
                    this.setState({ showResultStat: true });
                    this.setState({ fundstatus: resdata.status });
                    this.setState({ fundPercent: fundPer });
                    this.setState({ loanstats: resdata.msgdata.loanstatus });
                    // this.setState({ loantenure: resdata.msgdata.tenure });
                    // this.setState({ riskrating: resdata.msgdata.riskrating });
                    // this.setState({ loanlistingdays: resdata.msgdata.listingperioddays })
                    console.log(resdata.msgdata.loanstatus)

                    var loanlistingNo = resdata.msgdata.loanlistingno
                    this.getloanaccountStatus(loanlistingNo)

                } else {
                    //alert(resdata.message)
                    this.setState({ loanstats: "" });
                }
            })
    }
    acceptFunding = () => {
        fetch(BASEURL + '/lsp/triggerloanacceptancereq', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: this.state.loanreqno,
                borrowerid: this.state.borrowerid
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    console.log(resdata.message);
                    $("#loanAcceptModal").click();
                    // this.setState({ acceptFundisDisable: true })
                    // var otpField = prompt("Loan acceptance request raised successfully. Please enter OTP:");
                    // if (otpField == null || otpField == "") {
                    //     alert("Loan Offer Generation get cancelled");
                    //     // window.location.reload()
                    // } else {
                    //     this.state.otp = otpField;
                    //     // window.location.reload()
                    //     this.verifyLoan();
                    // }
                } else {
                    confirmAlert({
                        message: "Issue: " + resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => { },
                            },
                        ],
                    });
                }
            }).catch(error => console.log(error)
            );
    }
    loanAcceptanceOtp = (e) => {
        this.setState({ otp: e.target.value })
    }
    verifyLoan = () => {
        console.log(this.state.otp, this.state.loanreqno, this.state.borrowerid)
        fetch(BASEURL + '/lsp/verifyLoanAcceptanceRequest', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: this.state.loanreqno,
                borrowerid: this.state.borrowerid,
                otp: this.state.otp
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    console.log(resdata.message);
                    window.location = "/assistSignAgreement";
                    sessionStorage.setItem('loanrequestnumber', this.state.loanreqno);
                } else {
                    confirmAlert({
                        message: "Issue: " + resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => { },
                            },
                        ],
                    });
                }
            })
    }
    withdrawLoanRequest(event) {
        fetch(BASEURL + '/lsp/withdrawloanrequest', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: this.state.loanreqno
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    confirmAlert({
                        message: "Withdraw Request Successfull",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => { window.location.reload() },
                            },
                        ],
                    });


                } else {
                    alert("Issue: " + resdata.message);
                    window.location.reload();
                }
            })

    }
    preDisbursement = () => {
        fetch(BASEURL + '/lsp/assistedoperationsgenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                borrowerid: this.state.borrowerid,
                operationtype: "9",
                loanrequestnumber: this.state.loanreqno,
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    alert(resdata.message)
                    console.log(this.state.loanreqno)
                    $("#disburseModal").click();
                    this.setState({ otpRef: resdata.msgdata.otpref })

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

                } else {
                    alert(resdata.message)
                }
            }).catch((error) => {
                console.log(error)
            })
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
                operationtype: 9,
                mobileref: String(this.state.otpRef),
                emailref: String(this.state.otpRef),
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
                    this.setState({ otpRef: resdata.msgdata.mobileref });

                    alert(resdata.message)

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
                    alert(resdata.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    emailOtpDisp = (e) => {
        this.setState({ emailOtpDisp: e.target.value })
    }
    mobileOtpDisp = (e) => {
        this.setState({ mobileOtpDisp: e.target.value })
    }
    initialDisbursement = () => {
        fetch(BASEURL + '/lsp/initiateloandisbursement', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanlistingno: sessionStorage.getItem('loanlistingnumber'),
                mobileotp: this.state.mobileOtpDisp,
                otpref: String(this.state.otpRef)
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    confirmAlert({
                        message: "Loan disbursement initiated. Please check your account after sometime",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location.reload()
                                },
                            },
                        ],
                    });
                } else {
                    alert(resdata.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    //Due collection
    BDueMobileno = (event) => {
        // this.setState({ borrowerid: event.target.value })
        var mobileValid = /^[6-9][0-9]{9}$/;
        var eventmInput = event.target.value;
        if (mobileValid.test(eventmInput)) {
            console.log("passed")
            this.setState({ BdueinvalidMnum: false })
            $('#bDueMobileValidation').prop('disabled', false)
            this.setState({ borrowerid: event.target.value })
        } else {
            this.setState({ BdueinvalidMnum: true })
            $('#bDueMobileValidation').prop('disabled', true)
        }
    }
    BDueviewtab = () => {
        $("#BDueModal").click()
        $("#LoanProcessing").hide()
    }
    commonTask = () => {
        $("#LoanProcessing").hide()
    }
    BTncviewtab = () => {
        $("#BTncModal").click()
        $("#LoanProcessing").hide()
    }
    onEmailMobileLogin = () => {
        if (!isNaN(this.state.borrowerid)) {
            // mobile number
            this.setState({ isMobileOrEmail: true });
            // this.setState({ user: "" });
        } else if (this.state.borrowerid.indexOf('@') > -1) {
            // email
            this.setState({ isMobileOrEmail: true });
            // this.setState({ user: "" });
        } else {
            // pan
            this.setState({ isMobileOrEmail: false });
        }
        console.log(this.state.user);
    }

    getPrefix() {
        let userPrefix = "";
        if (!this.state.isMobileOrEmail) {
            userPrefix = this.state.user;
        } else if (this.state.borrowerid[0] == 0) {
            userPrefix = this.state.user;
        } else if (this.state.borrowerid[0] in [6, 7, 8, 9]) {
            userPrefix = ""
        }
        return userPrefix;
    }
    borrowerid(event) {
        this.setState({ borrowerid: event.target.value })
    }
    getUserBasicInfo = () => {
        fetch(BASEURL + '/lsp/getuserbasicinfo', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                userid: this.getPrefix() + this.state.borrowerid,
                usertype: "3"
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    this.setState({
                        assistBorrID: resdata.msgdata.borrowerid,

                    })
                    this.setState({ assistMmID: resdata.msgdata.mmid })
                    this.setState({ assistp2pDue: resdata.msgdata.p2pdue })
                    sessionStorage.setItem("userMemmid", resdata.msgdata.mmid)
                    $("#BDueCollect").show()
                    this.setState({ BDueDisable: false });
                    $("#LoanProcessing").hide()
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
            .catch(error => console.log(error)
            );

    }
    payDue = () => {
        sessionStorage.setItem("amount", this.state.assistp2pDue);
        var paymenttype = 3;
        console.log(paymenttype);
        sessionStorage.setItem("paymentType", paymenttype)
        window.location = "/payFacDues";
    }

    //kyc
    kycMobileno = (event) => {
        //this.setState({ allMobileno: event.target.value })
        var mobileValid = /^[6-9][0-9]{9}$/;
        var eventmInput = event.target.value;
        if (mobileValid.test(eventmInput)) {
            console.log("passed")
            this.setState({ kycinvalidMnum: false })
            $('#kycMobileValidation').prop('disabled', false)
            this.setState({ allMobileno: event.target.value })
        } else {
            this.setState({ kycinvalidMnum: true })
            $('#kycMobileValidation').prop('disabled', true)
        }
    }
    kycviewtab = () => {
        $("#kycVerifyModal").click()
    }
    getkycBasiuUserInfo = () => {
        fetch(BASEURL + '/lsp/getuserbasicinfo', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                userid: this.state.allMobileno,
                usertype: "3"
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    this.setState({ assistKycBorrId: resdata.msgdata.borrowerid })
                    this.setState({ kycstatus: resdata.msgdata.kycstatus })
                    console.log(resdata.msgdata.borrowerid);
                    console.log(this.state.assistKycBorrId)
                    this.setState({ kycBorrowername: resdata.msgdata.borrowername })

                    $("#KYCVerify").show()
                    this.setState({ kycDisable: false })
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
            .catch(error => console.log(error)
            );
    }
    alertKYC = () => {
        $("#VKYCAlertModal").click();
    }
    // alertKYC = () => {
    //     $("#VKYCAlertModal").click();
    // }
    vkyc = () => {
        fetch(BASEURL + '/vf/createvkycrequest?userid=' + this.state.assistKycBorrId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },

        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    this.setState({ Id: resdata.msgdata.vkycreqno });
                    console.log(this.state.Id);
                    //alert(resdata.message);
                    $("#VKYCAlert2Modal").click();
                    setInterval(() => { this.getKYCStatus() }, 3000);

                } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                }
                            }
                        ],
                        closeOnClickOutside: false,
                    })
                }
            })
    }
    getKYCStatus(event) {
        fetch(BASEURL + '/vf/getvkycrequeststatus?vkycreqno=' + this.state.Id + '&usermode=CUST', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },

        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ Id2: resdata.msgdata });
                    console.log(this.state.Id2)
                    if (resdata.message != "VKYC session details") {
                        setTimeout(() => { this.getKYCStatus() }, 20000);
                    }
                    else if (resdata.message == "VKYC session details") {
                        clearInterval(this.getKYCStatus());
                        sessionStorage.setItem("kycToken", this.state.Id2.accessToken);
                        sessionStorage.setItem("sessionId", this.state.Id2.sessionId);
                        sessionStorage.setItem("participantId", this.state.Id2.participantId);
                        window.location = "/customerJoin";
                    }
                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    getAgreement(loanaccountno) {
        fetch(BASEURL + '/lms/borr/getloanagreement?loanreqno=' + sessionStorage.getItem('loanrequestnumber') + "&action=view", {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
            },
            responseType: 'arraybuffer',
            dataType: 'blob'
        })
            .then(response => {
                return response.blob();
            })
            .then((response) => {
                $("#loanAgreementPDFModal").click();
                console.log('Response:', response)
                var file = new Blob([(response)], { type: 'application/pdf' });
                console.log(file);
                var fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                document.getElementsByClassName('PDFdoc')[0].src = fileURL + "#zoom=100";
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getBorStatement = (loanaccountno, loanamt, loanstatusid) => {
        console.log(loanaccountno);
        console.log(loanamt);

        sessionStorage.setItem("loanaccountno", loanaccountno);
        sessionStorage.setItem("loanamt", loanamt);
        sessionStorage.setItem("loanstatusid", loanstatusid);

        window.location = "/assistViewStmt";

    }
    getRepaySchedule = (loanaccountno, loanamt, loanstatusid) => {
        sessionStorage.setItem("loanaccountno", loanaccountno);
        window.location = "/assistrepaySchedule";
    }

    //Document Section
    getFormDetails = () => {
        this.setState({ showLoader: true })
        fetch(BASEURL + '/lsp/getformdetails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                category: this.state.ovdCategoryFlag === true ? "POA" : "POA",
                type: this.state.selectDocu
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    this.setState({ showLoader: false })
                    console.log(resdata.msgdata);
                    this.setState({
                        formDetailList: resdata.msgdata
                    })
                    console.log(this.state.formDetailList);
                    var Datas;

                    var activityID;
                    var category;
                    var type;
                    var isverificationrequired;
                    var status;
                    formDatas = this.state.formDetailList.map((form) => {
                        Datas = form.formdata.formfields;
                        console.log(Datas);

                        formID = form.formid;
                        activityID = form.activityid;
                        category = form.category;
                        type = form.type;
                        isverificationrequired = form.isverificationrequired;
                        status = form.status;
                        this.setState({ formFieldLists: Datas })
                        this.setState({ formCategory: form.category });
                        this.setState({ formType: form.type });

                        const prefilledValues = this.state.formFieldLists.map((item) => {
                            let value = this.getPrefilledValue(item.field);
                            if (item.datatype === 'date') {
                                value = value.split(' ')[0]; // Strip the time part for date values
                            }
                            // Special handling for Gender field
                            if (item.field === 'Gender') {
                                value = value === 'M' ? 'Male' : value === 'F' ? 'Female' : value === 'O' ? 'Others' : value;
                            }
                            return {
                                ...item,
                                value: value || ""
                            };
                        });

                        this.setState({ formFieldLists: prefilledValues });
                        console.log(this.state.formFieldLists, prefilledValues)
                    });

                    if (poaDocumentFlag === true) {
                        $("#uploadOvdDocFirst").hide();
                        $("#submitOvdFirst").show();
                        // $("#poaModal").click();
                    } else {
                        $("#uploadOvdDocID1").hide();
                        $("#submitOvdID1").show();
                        // $("#OvdModal").click();
                    }
                    //&& this.state.newaddrStatus !== 0
                    if (this.state.PermanentaddressIseditted === "true") {
                        console.log("executed")
                        $("#poaModal").click();
                        $("#uploadOvdDocFirst").hide();
                        $("#submitOvdFirst").show();
                        $("#addressFormFields").hide()
                        var firstArray;
                        firstArray = this.state.addressOvdFormDetails;
                        var secondArray = resdata.msgdata;
                        //from both array find out ovd type and filter the formfields
                        // Iterate over the second array
                        secondArray.forEach((secondItem) => {
                            // Check if the type is DL
                            if (secondItem.type !== "ADDRESSUPDATE") {
                                // Find the matching item in the first array
                                const matchingItem = this.state.addressOvdFormDetails.find((firstItem) => {
                                    return firstItem.ovdinfo.type !== "ADDRESSUPDATE";
                                });

                                // If a matching item is found
                                if (matchingItem) {
                                    // Iterate over the formfields of both items
                                    secondItem.formdata.formfields.forEach((secondField) => {
                                        matchingItem.ovdinfo.formdata.formfields.forEach((firstField) => {
                                            // Check if the field names match
                                            if (firstField.field === secondField.field) {
                                                // Update the value in the second array
                                                secondField.value = firstField.value;
                                            }
                                        });
                                    });
                                }
                            }
                        });

                        formDatas = secondArray.map((form) => {
                            Datas = form.formdata.formfields;
                            console.log(Datas);

                            formID = form.formid;
                            activityID = form.activityid;
                            category = form.category;
                            type = form.type;
                            isverificationrequired = form.isverificationrequired;
                            status = form.status;
                            this.setState({ formFieldLists: Datas })
                            this.setState({ formCategory: form.category });
                            this.setState({ formType: form.type });
                        });
                        console.log(this.state.formFieldLists)
                    }
                } else {
                    this.setState({ showLoader: false })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getPoaDetails = (params) => {
        //check whether ovd and poa address is editted or saved
        //this.getFormDetails()
        if (this.state.PermanentaddressIseditted === "true") {
            this.getFormDetails()
        } else {
            if (params === "ovd") {
                this.setState({ ovdFlagTrue: true })
            } else if (params === "poa") {
                this.setState({ ovdFlagTrue: false })
            }
            this.getovdMasterlist()
            $("#poaModal").click()
        }
    }
    getAddressFormDetails = () => {
        fetch(BASEURL + '/lsp/getformdetails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                category: "POA",
                type: "ADDRESSUPDATE"
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS' || 'Success') {
                    $("#submitOvdFirst").hide();
                    $("#addressFormFields").show();
                    console.log(resdata.msgdata);
                    var responseData = resdata.msgdata;
                    var Datas;

                    var activityID;
                    var category;
                    var type;
                    var isverificationrequired;
                    var status;
                    formDatas = responseData.map((form) => {
                        Datas = form.formdata.formfields;
                        console.log(Datas);

                        activityID = form.activityid;
                        category = form.category;
                        type = form.type;
                        isverificationrequired = form.isverificationrequired;
                        status = form.status;
                        this.setState({ addressFormFieldLists: Datas })
                        this.setState({ poaformCategory: form.category });
                        this.setState({ poaformType: form.type });

                        const addressPrefilledValues = this.state.addressFormFieldLists.map((item) => {
                            let value = this.getPrefilledValue(item.field);
                            if (item.datatype === 'date') {
                                value = value.split(' ')[0]; // Strip the time part for date values
                            }
                            return {
                                ...item,
                                value: value || ""
                            };
                        });
                        this.setState({ addressFormFieldLists: addressPrefilledValues });
                        console.log(this.state.addressFormFieldLists, addressPrefilledValues)
                    });
                    if (this.state.PermanentaddressIseditted === "true") {
                        var firstArray;
                        firstArray = this.state.addressOvdFormDetails;
                        var secondArray = resdata.msgdata;
                        //from both array find out ovd type and filter the formfields
                        // Iterate over the second array
                        secondArray.forEach((secondItem) => {
                            // Check if the type is DL
                            if (secondItem.type === "ADDRESSUPDATE") {
                                // Find the matching item in the first array
                                const matchingItem = this.state.addressOvdFormDetails.find((firstItem) => {
                                    return firstItem.addressinfo.type === "ADDRESSUPDATE";
                                });

                                // If a matching item is found
                                if (matchingItem) {
                                    // Iterate over the formfields of both items
                                    secondItem.formdata.formfields.forEach((secondField) => {
                                        matchingItem.addressinfo.formdata.formfields.forEach((firstField) => {
                                            // Check if the field names match
                                            if (firstField.field === secondField.field) {
                                                // Update the value in the second array
                                                secondField.value = firstField.value;
                                            }
                                        });
                                    });
                                }
                            }
                        });
                        formDatas = secondArray.map((form) => {
                            Datas = form.formdata.formfields;
                            console.log(Datas);

                            activityID = form.activityid;
                            category = form.category;
                            type = form.type;
                            isverificationrequired = form.isverificationrequired;
                            status = form.status;
                            this.setState({ addressFormFieldLists: Datas })
                            this.setState({ poaformCategory: form.category });
                            this.setState({ poaformType: form.type });
                        });
                    }
                } else {

                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    savePoaForms = () => {
        this.setState({ PermanentaddressIseditted: "true" })
    }
    canceSaveFormTxnData = () => {
        $("#uploadOvdDocFirst").show();
        $("#submitOvdFirst").hide();
    }
    cancelPoaFormTxnSubmit = () => {
        $("#submitOvdFirst").show();
        $("#addressFormFields").hide();
    }
    getPrefilledValue = (field) => {
        switch (field) {
            case "Name":
                return this.state.assistedName;
            case "Email":
                return this.state.assistedEmail;
            case "Address":
                return this.state.addressType1.address1;
            case "address1":
                return this.state.addressType1.address1;
            case "address2":
                return this.state.addressType1.address2;
            case "address3":
                return this.state.addressType1.address3;

            case "Address Line 1":
                return this.state.addressType1.address1;
            case "Address Line 2":
                return this.state.addressType1.address2;
            case "Address Line 3":
                return this.state.addressType1.address3;
            case "City":
                return this.state.addressType1.city;
            case "Pin Code":
                return this.state.addressType1.pincode;
            case "State":
                return this.state.addressType1.state;
            // case "District":
            //     return this.state.addressType1.district;
            // case "Taluk":
            //     return this.state.addressType1.taluk;
            default:
                return "";
        }
    };
    renderDemoFormElement = (element, index) => {
        const value = this.state.addressFormFieldLists[index]?.value || "";
        switch (element.datatype) {
            case "text":
                return (
                    <div key={element.field} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <input
                            style={{ border: "1px solid rgb(0, 121, 190)" }}
                            type={element.type}
                            name={element.field}
                            className="form-control"
                            placeholder={element.placeholder}
                            maxLength={element.maxlength}
                            minLength={element.minlength}
                            // pattern={element.regex}
                            value={this.state.profileType === 1 ? value : element.value}
                            onChange={(e) => { this.handleSelectChange(e, element, index) }}
                        />
                        {this.state.errorMessages[element.label] && (
                            <div style={{ color: "red" }}>{this.state.errorMessages[element.label]}</div>
                        )}
                    </div>
                );
            case "numeric":
                return (
                    <div key={element.field} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <input
                            style={{ border: "1px solid rgb(0, 121, 190)" }}
                            type={element.type}
                            name={element.field}
                            className="form-control"
                            placeholder={element.placeholder}
                            maxLength={element.maxlength}
                            minLength={element.minlength}
                            // pattern={element.regex}
                            required={element.required}
                            value={this.state.profileType === 1 ? value : element.value}
                            onChange={(e) => { this.handleSelectChange(e, element, index) }}
                        />
                        {this.state.errorMessages[element.label] && (
                            <div style={{ color: "red" }}>{this.state.errorMessages[element.label]}</div>
                        )}
                    </div>
                );
            case "number":
                return (
                    <div key={element.field} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <input
                            style={{ border: "1px solid rgb(0, 121, 190)" }}
                            type={element.type}
                            name={element.field}
                            className="form-control"
                            placeholder={element.placeholder}
                            // pattern={element.regex}
                            required={element.required}
                            value={this.state.profileType === 1 ? value : element.value}
                            onChange={(e) => { this.handleSelectChange(e, element, index) }}
                        />
                        {this.state.errorMessages[element.label] && (
                            <div style={{ color: "red" }}>{this.state.errorMessages[element.label]}</div>
                        )}
                    </div>
                );
            case "select":
                if (element.field === 'State') {
                    // Fetch state data if loadevent is defined and apiCalled is false
                    if (element.loadevent && element.loadevent.url && !this.state.apiCalled) {
                        const fullUrl = `${BASEURL}${element.loadevent.url}`;
                        fetch(fullUrl, {
                            method: element.loadevent.method,
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer " + sessionStorage.getItem('token')
                            },
                        })
                            .then(response => response.json())
                            .then(data => {
                                // Assuming the response data is an array of states
                                this.setState({ demoStates: data.msgdata, apiCalled: true });
                            })
                            .catch(error => {
                                console.error('Error fetching state data:', error);
                            });
                    }
                    //selected={state.statename === element.value}
                    return (
                        <div key={element.field} className="col-6 mb-2">
                            <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                            <select
                                name={element.field}
                                className="form-select"
                                value={this.state.profileType === 1 ? value : element.value}
                                onChange={(e) => { this.handleSelectChange(e, element, index) }}
                            >
                                <option value="">{element.placeholder}</option>
                                {this.state.demoStates.map((state) => (
                                    <option key={state.statecode} value={state.statename} selected={state.statename === element.value}>
                                        {state.statename}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                } else if (element.field === 'District') {
                    // Fetch district data if state is selected and district data is not fetched yet
                    // if (this.state.selectedStateCode && !this.state.apiCalled) {
                    //     const districtElement = this.state.addressFormFieldLists.find(el => el.field === 'District');
                    //     if (districtElement && districtElement.loadevent && districtElement.loadevent.url) {
                    //         const fullUrl = `${BASEURL}${districtElement.loadevent.url}${this.state.selectedStateCode}`;
                    //         fetch(fullUrl, {
                    //             method: districtElement.loadevent.method,
                    //             headers: {
                    //                 'Accept': 'application/json',
                    //                 'Content-Type': 'application/json',
                    //                 'Authorization': "Bearer " + sessionStorage.getItem('token')
                    //             },
                    //         })
                    //             .then(response => response.json())
                    //             .then(data => {
                    //                 // Assuming the response data is an array of districts
                    //                 this.setState({ demoDistricts: data.msgdata.distlist, apiCalled: true });
                    //             })
                    //             .catch(error => {
                    //                 console.error('Error fetching district data:', error);
                    //             });
                    //     }
                    // }
                    const prefilledState = this.getPrefilledValue('State');
                    if (prefilledState && !this.state.districtApiCalled) {
                        this.fetchDistrictData(prefilledState);
                    } else if (this.state.selectedStateCode && !this.state.districtApiCalled) {
                        this.fetchDistrictData(this.state.selectedStateCode);
                    }
                    return (
                        <div key={element.field} className="col-6 mb-2">
                            <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                            <select
                                name={element.field}
                                className="form-select"
                                onChange={(e) => { this.handleSelectChange(e, element, index) }}
                            >
                                <option value="">{element.placeholder}</option>
                                {this.state.demoDistricts.map((district) => (
                                    <option key={district.districtcode} value={district.distname}>
                                        {district.distname}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                } else if (element.field === 'Taluk') {
                    // Fetch taluk data if district is selected and taluk data is not fetched yet
                    if (this.state.selectedDistrictCode && !this.state.talukApiCalled) {
                        const talukElement = this.state.addressFormFieldLists.find(el => el.field === 'Taluk');
                        if (talukElement && talukElement.loadevent && talukElement.loadevent.url) {
                            const fullUrl = `${BASEURL}${talukElement.loadevent.url}${this.state.selectedDistrictCode}`;
                            fetch(fullUrl, {
                                method: talukElement.loadevent.method,
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                                },
                            })
                                .then(response => response.json())
                                .then(data => {
                                    // Assuming the response data is an array of taluks
                                    this.setState({ talukLists: data.msgdata.taluklist, talukApiCalled: true });
                                })
                                .catch(error => {
                                    console.error('Error fetching taluk data:', error);
                                });
                        }
                    }
                    return (
                        <div key={element.field} className="col-6 mb-2">
                            <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                            <select
                                name={element.field}
                                className="form-select"
                                onChange={(e) => { this.handleSelectChange(e, element, index) }}
                            >
                                <option value="">{element.placeholder}</option>
                                {this.state.talukLists.map((taluk) => (
                                    <option key={taluk.talukcode} value={taluk.talukcode}>
                                        {taluk.talukname}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }
                // Other cases for different fields can be added here
                return null;
            default:
                return null;
        }
    }
    fetchDistrictData = (stateNameOrCode) => {
        const selectedState = this.state.demoStates.find(state => state.statename === stateNameOrCode || state.statecode === stateNameOrCode);
        console.log(stateNameOrCode, selectedState)

        if (selectedState) {
            const stateCode = selectedState.statecode;
            const districtElement = this.state.addressFormFieldLists.find(el => el.field === 'District');
            if (districtElement && districtElement.loadevent && districtElement.loadevent.url) {
                const fullUrl = `${BASEURL}${districtElement.loadevent.url}${stateCode}`;
                fetch(fullUrl, {
                    method: districtElement.loadevent.method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + sessionStorage.getItem('token')
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        this.setState({ demoDistricts: data.msgdata.distlist, districtApiCalled: true });
                    })
                    .catch(error => {
                        console.error('Error fetching district data:', error);
                    });
            }
        }
    };
    handleSelectChange = (e, element, index) => {
        const { value } = e.target;
        console.log(value)

        const updatedAddressFormFieldLists = [...this.state.addressFormFieldLists];
        // updatedAddressFormFieldLists[index].value = value;
        updatedAddressFormFieldLists[index] = {
            ...updatedAddressFormFieldLists[index],
            value: value
        };
        // this.setState({ addressFormFieldLists: updatedAddressFormFieldLists });
        console.log(this.state.addressFormFieldLists)
        // Update selected state code when State select is changed
        if (element.field === 'State') {
            this.setState({
                stateName: value,
                apiCalled: false,
                demoDistricts: [],
                talukLists: [],
                selectedStateCode: '',
                selectedDistrictCode: '',
                addressFormFieldLists: updatedAddressFormFieldLists
            }, () => {
                const states = this.state.demoStates;
                console.log('Available states:', states);
                states.forEach(state => {
                    if (state.statename === value) {
                        console.log(`Selected state code for ${value}: ${state.statecode}`);
                        this.setState({ selectedStateCode: state.statecode });
                        this.fetchDistrictData(state.statecode);
                    }
                });
            });
        } else if (element.field === 'District') {
            this.setState({
                districtName: value,
                apiCalled: false,
                talukApiCalled: false,
                talukLists: [],
                selectedDistrictCode: '',
                addressFormFieldLists: updatedAddressFormFieldLists
            }, () => {
                const districts = this.state.demoDistricts;
                console.log('Available districts:', districts);
                districts.forEach(district => {
                    if (district.distname === value) {
                        console.log(`Selected district code for ${value}: ${district.distid}`);
                        this.setState({ selectedDistrictCode: district.distid });
                    }
                });
            });
        } else if (element.field === 'Taluk') {
            this.setState({
                talukName: value,
                addressFormFieldLists: updatedAddressFormFieldLists
            }, () => {
                const taluks = this.state.talukLists;
                console.log('Available taluks:', taluks);
                taluks.forEach(taluk => {
                    if (taluk.talukname === value) {
                        console.log(`Selected taluk code for ${value}: ${taluk.talukid}`);
                        this.setState({ talukCode: taluk.talukid });
                    }
                });
            });
        } else {
            this.setState({
                addressFormFieldLists: updatedAddressFormFieldLists,
            });
        }
        // Add logic for other fields as needed
        // console.log(element.label, element.datatype, element.regex);
        // var Regex = element.regex;

        // let errorMessage = "";
        // if (Regex) {
        //     var pattern = new RegExp(Regex);
        //     if (!pattern.test(value)) {
        //         console.log(`Invalid input for ${element.field}.`);
        //         errorMessage = `Invalid input for ${element.field}.`;
        //         $("#submitBtn").prop('disabled', true);
        //     } else {
        //         var updatedDataList = [...poaDataList];
        //         updatedDataList[index] = value;
        //         console.log(updatedDataList);

        //         var updatedExtractedData = updatedDataList.map((val, idx) => {
        //             var item = this.state.addressFormFieldLists[idx];
        //             return {
        //                 field: item.field,
        //                 value: val || "",
        //             };
        //             // const extractedItem = {
        //             //     field: item.field,
        //             //     value: val || "",
        //             // };
        //             // if (item.field === 'State') {
        //             //     extractedItem.statecode = this.state.selectedStateCode;
        //             // }
        //             // if (item.field === 'District') {
        //             //     extractedItem.districtcode = this.state.selectedDistrictCode;
        //             // }
        //             // return extractedItem;
        //         });
        //         console.log(updatedExtractedData);

        //         poaDataList = updatedDataList;
        //         this.setState({
        //             poaExtractedData: updatedExtractedData,
        //         });

        //         // this.setState(prevState => ({
        //         //     formFieldLists: prevState.formFieldLists.map((item, i) =>
        //         //         i === index ? { field: item.field, value: item.value } : item
        //         //     )
        //         // }));
        //         // console.log(this.state.formFieldLists)
        //         // extractedData = this.state.formFieldLists
        //     }
        // }
        // var errorMessages = { ...this.state.errorMessages };
        // errorMessages[element.label] = errorMessage;

        // console.log(this.state.addressFormFieldLists)
        // this.setState({ errorMessages });
        // const allFieldsSelected = this.state.poaExtractedData.every(field => {
        //     if (field.value !== undefined && field.value.trim() !== "") {
        //         return true; // Field is selected
        //     } else {
        //         return false; // Field is not selected
        //     }
        // });
        var poaData = updatedAddressFormFieldLists;
        var poaExtData2 = poaData
            .filter(item => item.value !== undefined && item.value !== "")  // Filter out items without a value or with an empty value
            .map((item, i) => ({
                field: item.field,
                value: item.value
            }));
        this.setState({
            poaExtractedData: poaExtData2
        }, () => {
            console.log(this.state.poaExtractedData, poaExtData2);
        });
        // Validate input
        const regex = new RegExp(element.regex);
        const errorMessage = regex.test(value) ? "" : `Invalid input for ${element.field}.`;

        const errorMessages = { ...this.state.errorMessages, [element.label]: errorMessage };
        console.log('Updated error messages:', errorMessages);
        this.setState({ errorMessages });


        // Set the disabled state based on the condition
        // if (allFieldsSelected) {
        //     $("#secondFormBtn").prop('disabled', false); // Enable the button
        // } else {
        //     $("#secondFormBtn").prop('disabled', true); // Disable the button
        // }
    }
    renderFormElement = (element, index) => {
        const value = this.state.formFieldLists[index]?.value || this.getPrefilledValue(element.field) || "";
        switch (element.datatype) {
            case "text":
                return (
                    <div key={element.datatype} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <input className="form-control"
                            style={{ border: "1px solid rgb(0, 121, 190)" }}
                            maxLength={element.maxlength}
                            minLength={element.minlength}
                            name={element.label}
                            type={element.datatype}
                            value={this.state.profileType === 1 ? value : element.value}
                            placeholder={element.placeholder}
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field, element.value) }}
                        />
                        {this.state.errorMessages[element.label] && (
                            <div style={{ color: "red" }}>{this.state.errorMessages[element.label]}</div>
                        )}
                    </div>
                );
            case "numeric":
                return (
                    <div key={element.datatype} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <input className="form-control"
                            style={{ border: "1px solid rgb(0, 121, 190)" }}
                            maxLength={element.maxlength}
                            minLength={element.minlength}
                            name={element.label}
                            type={element.datatype}
                            value={this.state.profileType === 1 ? value : element.value}
                            placeholder={element.placeholder}
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field, element.value) }}
                        />
                        {this.state.errorMessages[element.label] && (
                            <div style={{ color: "red" }}>{this.state.errorMessages[element.label]}</div>
                        )}
                    </div>
                );
            case "number":
                return (
                    <div key={element.datatype} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <input className="form-control"
                            style={{ border: "1px solid rgb(0, 121, 190)" }}
                            maxLength={element.maxlength}
                            minLength={element.minlength}
                            name={element.label}
                            type={element.datatype}
                            value={this.state.profileType === 1 ? value : element.value}
                            placeholder={element.placeholder}
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field, element.value) }}
                        />
                        {this.state.errorMessages[element.label] && (
                            <div style={{ color: "red" }}>{this.state.errorMessages[element.label]}</div>
                        )}
                    </div>
                );
            case "radio-group":
                return (
                    <div key={element.datatype} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <div className='row' style={{ marginTop: "-7px" }}>
                            {element.values.map((option) => (
                                <div key={option.value} className='col-5'>
                                    <input
                                        type="radio"
                                        name={element.name}
                                        value={option.label}
                                        checked={element.value === option.label}
                                        // checked={option.selected}
                                        onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field, element.value) }}
                                    />
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>{option.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "select":
                return (
                    <div key={element.datatype} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <select name={element.name} className="form-select"
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field, element.value) }}
                        >
                            <option defaultValue>Select an option</option>
                            {element.values.map((option) => (
                                <option key={option.value} value={option.value} selected={option.value === element.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            case "textarea":
                return (
                    <div key={element.datatype} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <textarea
                            className="form-control"
                            name={element.name}
                            rows={element.rows}
                            value={this.state.profileType === 1 ? value : element.value}
                        ></textarea>
                    </div>
                );
            case "checkbox-group":
                return (
                    <div key={element.datatype} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <div className='row'>
                            {element.values.map((option) => (
                                <div key={option.value} className='col-4'>
                                    <input
                                        type="checkbox"
                                        name={element.name}
                                        value={option.value}
                                    />
                                    <label>{option.label}</label>
                                </div>
                            ))}
                        </div>

                    </div>
                );
            case "date":
                return (
                    <div key={element.datatype} className="form-group col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <input
                            type="date" className="form-control"
                            name={element.name}
                            value={this.state.profileType === 1 ? value : element.value}
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field, element.value) }}
                        />
                    </div>
                );

            default:
                return null;
        }
    }
    dynFormData = (e, index, label, datatype, regex, field) => {
        console.log(label, datatype, regex);
        const { name, value } = e.target;
        const Regex = regex;

        let errorMessage = "";
        if (Regex) {
            const pattern = new RegExp(Regex);
            if (!pattern.test(value)) {
                console.log(`Invalid input for ${field}.`);
                errorMessage = `Invalid input for ${field}.`;

                $("#submitBtn").prop('disabled', true);
            } else {
                // dataList[index] = e.target.value;
                // console.log(dataList);

                // const valueList = [];
                // console.log(dataList);
                // valueList.push();
                // console.log(this.state.formFieldLists)
                // extractedData = this.state.formFieldLists.map((item, index) => {
                //     var Values;
                //     if (typeof dataList[index] == "undefined") {
                //         Values = "";
                //         console.log("executed1");
                //     } else {
                //         Values = dataList[index];
                //         console.log("executed2");
                //     }

                //     return {
                //         field: item.field,
                //         value: Values
                //     };
                // });
                // console.log(extractedData)
                // this.setState(prevState => ({
                //     formFieldLists: prevState.formFieldLists.map((item, i) =>
                //         i === index ? { field: item.field, value: item.value } : item
                //     )
                // }));
                // console.log(this.state.formFieldLists)
                // extractedData = this.state.formFieldLists
                // this.setState({ formFieldLists: extractedData })
                // console.log(extractedData)

                $("#submitBtn").prop('disabled', false);
            }
        }
        // const errorMessages = { ...this.state.errorMessages, [label]: errorMessage };

        // this.state.formFieldLists[index].value = value;

        // this.setState({
        //     formFieldLists: [...this.state.formFieldLists],
        //     errorMessages,
        // });

        //new changes
        const formFieldLists = [...this.state.formFieldLists];
        formFieldLists[index].value = value;

        const errorMessages = { ...this.state.errorMessages, [label]: errorMessage };

        this.setState({
            formFieldLists,
            errorMessages,
        }, () => {
            // Generate the extractedData array based on formFieldLists
            extractedData = this.state.formFieldLists.map((item, i) => ({
                field: item.field,
                value: item.value || ""
            }));
            console.log(extractedData);

            // Update the state with the extractedData
            this.setState({ extractedData });
        });
    }
    setFormTxndata = () => {
        //majorid: sessionStorage.getItem('loanReqNo'),
        var updatedExtractedData = extractedData.map(obj => ({ field: obj.field, value: obj.value }));
        console.log(updatedExtractedData)
        fetch(BASEURL + '/usrmgmt/setformtxndata', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                category: this.state.formCategory,
                type: this.state.formType,
                majorid: formID,
                formdata: {
                    formfields: updatedExtractedData
                }
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    $("#exampleModalCenter2").modal('hide');

                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                    console.log(resdata.msgdata.loanreqno)

                    this.setState({
                        formFieldLists: this.state.formFieldLists.map(item => ({ ...item, value: '' })),
                        errorMessages: {},
                    });

                } else {
                    $("#exampleModalCenter2").modal('hide');
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()

                    this.setState({
                        formFieldLists: this.state.formFieldLists.map(item => ({ ...item, value: '' })),
                        errorMessages: {},
                    });

                }

            })
    }
    reloadPage = () => {
        if (this.state.resMsg.includes("Form transaction details updated")) {
            window.location.reload();
        } else if (this.state.resMsg.includes("successfull")) {
            window.location.reload();
        }
    }
    viewovdFields = () => {
        this.getUploadedOvds();
    }
    OVDhandlePageClick = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.OVDperPage;
        this.setState({
            OVDcurrentPage: selectedPage,
            OVDoffset: offset
        }, () => {
            this.OVDloadMoreData();
        })
    }
    OVDloadMoreData = () => {
        const data = this.state.OVDorgtableData;
        const slice = data.slice(this.state.OVDoffset, this.state.OVDoffset + this.state.OVDperPage)
        this.setState({
            OVDpageCount: Math.ceil(data.length / this.state.OVDperPage),
            OVDovdList: slice
        })
    }
    getovdMasterlist = () => {
        fetch(BASEURL + '/usrmgmt/getovdmasterlist', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            method: 'Get',
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    this.setState({ ovdMasterList: resdata.msgdata })
                } else {
                    alert(resdata.message);
                }
            })
    }
    getUploadedOvds = () => {
        fetch(BASEURL + '/usrmgmt/getuploadedovds', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            method: 'Get',
        }).then((Response) => Response.json())
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    var list = resdata.msgdata;
                    console.log(resdata.msgdata)
                    // this.setState({ uploadedOVDLists: resdata.msgdata })
                    console.log(list)
                    list.sort((a, b) => {
                        return new Date(b.createdon).getTime() - new Date(a.createdon).getTime()
                    })
                    console.log(list);
                    this.setState({ OVDovdList: list })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.OVDoffset, this.state.OVDoffset + this.state.OVDperPage)
                    console.log(slice)

                    this.setState({
                        OVDpageCount: Math.ceil(data.length / this.state.OVDperPage),
                        OVDorgtableData: data,
                        OVDovdList: slice
                    })
                } else {
                    alert(resdata.message);
                }
            })
    }
    ovdViewBtn = () => {
        this.getovdMasterlist()
        $("#OvdModal").click()
    }
    selectOvdDocument = (e) => {
        this.setState({ selectDocu: e.target.value })
        console.log(e.target.value)
        this.state.ovdMasterList
            .filter((event) => event.ovdcode == e.target.value)
            .map((prdt, index) => {
                this.setState({ ovdID: prdt.ovdid })
            })
        console.log(this.state.ovdID)
        $("#uploadDocumentField").show()
    }
    addOvdMnumber = (e) => {
        this.setState({ OvdMnumber: e.target.value })
        // var bodyData = JSON.stringify({
        //     ovdcode: this.state.selectDocu,
        //     mobileno: this.state.OvdMnumber,
        //     pagetype: this.state.ovdPagetype,
        //     borrowerid: this.state.assistKycBorrId
        // })
    }
    getBorrowerUserInfo = () => {
        fetch(BASEURL + '/lsp/getuserbasicinfo', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                userid: this.state.allMobileno,
                usertype: "3"
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    this.setState({
                        assistBorrID: resdata.msgdata.borrowerid,
                        assistedName: resdata.msgdata.borrowername,
                    })
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
            .catch(error => console.log(error)
            );
    }
    addOvdDocu = (e) => {
        this.setState({ addOvddocu: e.target.value })
        documentAdded = true;
        if (documentAdded) {
            $(".OvdPageType").show();
        } else {
            $(".OvdPageType").hide();
        }
    }
    addPoaOvdDocu = (e) => {
        documentAdded = true;
        poaDocumentFlag = true;
        //frontPage
        pageTypePOA = "1";
        this.setState({ ovdPagetype: "1" })

        var file1 = e.target.files[0];
        // var allowedExtensions = /(\.pdf)$/i;

        if (file1.name) {
            this.setState({ selectedFile: file1 });
            var dt = new ClipboardEvent("").clipboardData || new DataTransfer();
            var existingFilesCount = $("#filesList > #files-names > .file-block").length;

            if (existingFilesCount + e.target.files.length > 2) {
                alert("Maximum 2 Documents Allowed.");
                e.target.value = '';
                return;
            }
            for (var i = 0; i < e.target.files.length; i++) {
                let fileBloc = $('<span/>', { class: 'file-block' }),
                    fileName = $('<span/>', { class: 'name', text: e.target.files.item(i).name });
                // fileName.css('max-width', '178px');
                fileBloc.append('<span class="file-delete"><span>+</span></span>')
                    .append(fileName);
                $("#filesList > #files-names").append(fileBloc);

                dt.items.add(e.target.files[i]);
            }
            this.files = dt.files;
            console.log("Number of files recorded:", $("#filesList > #files-names > .file-block").length);
            $("#files-names").on('click', '.file-delete', (e) => {
                let name = $(e.currentTarget).next('span.name').text();
                $(e.currentTarget).parent().remove();
                // Remove the file from dt.items array
                for (let i = 0; i < dt.items.length; i++) {
                    if (name === dt.items[i].getAsFile().name) {
                        dt.items.remove(i);
                        break; // Exit the loop after removing the file
                    }
                }
                // Update the input files to match the updated dt.files array
                document.getElementById('attachment10').files = dt.files;

                // Update the displayed upload status if needed
                // $("#uploadAct").text($("#uploadAct").text().replace("Uploaded", "Upload"));

                // Update the selectedFiles array in state
                let updatedSelectedFiles = this.state.selectedFiles.filter(file => file.name !== name);
                this.setState({ selectedFiles: updatedSelectedFiles });

                let updatedSuccessfulUploads = this.state.successfulUploads.filter(index => index !== i);
                this.setState({ successfulUploads: updatedSuccessfulUploads });
                $('#uploadFrontDocu').hide()
                $('#getFormDetailsNextBtn').prop('disabled', true);
                $('#backPageFieldBtn').prop('disabled', true);
                $(".backPageMenu").find("button, input").prop("disabled", true);
            });
            // Get the current selected files array from state
            let selectedFiles = [...this.state.selectedFiles];

            // Add the new selected files to the array
            selectedFiles.push(...Array.from(e.target.files));

            // Set the updated selected files array in state
            this.setState({ selectedFiles });
            // Reset the showTickIcon state to false when adding a new file
            this.setState({ showTickIcon: false });
            // $("#submitBtn").prop('disabled', false);
            console.log($("#filesList > #files-names > .file-block").length)
            if ($("#filesList > #files-names > .file-block").length >= 1) {
                $('#uploadFrontDocu').show()
            } else {
                $('#uploadFrontDocu').hide()
            }
        } else {
            e.target.value = '';
            this.setState({ selectedFile: null });
        }
    }
    ovdPageType = (e) => {
        this.setState({ ovdPagetype: e.target.value })
    }
    uploadOvdDocu = async () => {
        var formData = new FormData();

        let successfulUpload = [...this.state.successfulUploads]; // Track the number of successful uploads
        this.state.selectedFiles.forEach(file => {
            formData.append("ovdimage", file);
        });
        console.log("Selected files for upload:", this.state.selectedFiles);

        for (var i = 0; i < this.state.selectedFiles.length; i++) {
            formData = new FormData(); // Create a new formData object for each file
            let bodyData = JSON.stringify({
                ovdcode: this.state.selectDocu,
                mobileno: this.state.allMobileno,
                borrowerid: this.state.assistBorrID,
                pagetype: i === 0 ? this.state.ovdPagetype : "2" // Set pagetype to 2 from the second iteration onwards
            });
            formData.append("ovdimage", this.state.selectedFiles[i]);
            formData.append("ovdinfo", bodyData);
            this.setState({ showLoader: true })
            try {
                await this.imageUpload(formData);
                successfulUpload.push(i);
                if (successfulUpload.length === this.state.selectedFiles.length) {
                    // All files uploaded successfully
                    if (poaDocumentFlag === true) {
                        $('#getFormDetailsNextBtn').prop('disabled', false);
                    } else {
                        // $("#exampleModalCenter2").modal('hide');
                    }
                }
                this.setState({ showTickIcon: true });
                this.setState({ showLoader: false })
            } catch (error) {
                console.log(error);
            }
        }
        this.setState({ successfulUploads: successfulUpload });
    }
    imageUpload = async (formData) => {
        try {
            const response = await fetch(BASEURL + '/usrmgmt/uploadovd', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: formData
            });
            const resdata = await response.json();
            console.log(resdata);
            if (resdata.status === 'Success' || 'SUCCESS') {
                // Handle success
                console.log(resdata);
                this.setState({
                    formOvdRefNo: resdata.msgdata.ovdrefno,
                });
                console.log(resdata.msgdata.ovdrefno, this.state.formOvdRefNo)
                $('#uploadFrontDocu').hide()
            } else {
                // Handle failure
                alert(resdata.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    ovdCode = (e) => {
        this.setState({ ovdCode: e.target.value })
    }
    ovduserName = (e) => {
        this.setState({ ovduserName: e.target.value })
    }
    ovdDOB = (e) => {
        this.setState({ ovdDOB: e.target.value })
    }
    ovdIDno = (e) => {
        this.setState({ ovdIDno: e.target.value })
    }
    ovdIssueDate = (e) => {
        this.setState({ ovdIssueDate: e.target.value })
    }
    ovdAddress = (e) => {
        this.setState({ ovdAddress: e.target.value })
    }
    submitOVD = () => {
        fetch(BASEURL + '/usrmgmt/submitovd', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                ovdcode: this.state.selectDocu,
                ovdid: this.state.ovdPagetype,
                ovddata: {
                    name: this.state.ovduserName,
                    dob: this.state.ovdDOB,
                    votid: this.state.ovdIDno,
                    issueddate: this.state.ovdIssueDate,
                    address: this.state.ovdAddress
                }
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        }).then((resdata) => {
            console.log(resdata);
            if (resdata.status == "Success") {
                alert(resdata.message);
                this.getUploadedOvds();
                $("#uploadOvdDocID").show();
                $("#submitOvdID").hide()
                $("#exampleModalCenterO2").modal('hide');
                // confirmAlert({
                //     message: resdata.message,
                //     buttons: [
                //         {
                //             label: "Okay",
                //             onClick: () => {
                //                 this.getUploadedOvds()
                //             }
                //         }
                //     ],
                // })
            } else {
                console.log("here");
                alert(resdata.message);
                // confirmAlert({
                //     message: resdata.message,
                //     buttons: [
                //         {
                //             label: "Okay",
                //             onClick: () => {

                //             }
                //         }
                //     ],
                // })
            }
        })
    }
    cancelSubmitOVD = () => {
        $("#uploadOvdDocID").show();
        $("#submitOvdID").hide()
    }
    deleteOvdModal = (ovddata, ovdcode) => {
        this.setState({ OvdDataList: ovddata })
        this.setState({ OvdCodeforDelete: ovdcode })
        $("#deleteUpldOvdmodal").click()
    }
    ovdDelPageType = (e) => {
        this.setState({ delPageType: e.target.value });
        this.state.OvdDataList.filter((event) => event.pagetype == e.target.value).map((event) => {
            this.setState({ RefNumber: event.refno })
        })
    }
    deleteUpldedOvd = () => {
        fetch(BASEURL + '/usrmgmt/deleteuploadedovd', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                ovdcode: this.state.OvdCodeforDelete,
                pagetype: this.state.delPageType,
                refno: this.state.RefNumber
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        }).then((resdata) => {
            console.log(resdata);
            if (resdata.status == "Success") {
                confirmAlert({
                    message: resdata.message,
                    buttons: [
                        {
                            label: "Okay",
                            onClick: () => {
                                this.getUploadedOvds()
                            }
                        }
                    ],
                })
            } else {
                console.log("here")
                confirmAlert({
                    message: resdata.message,
                    buttons: [
                        {
                            label: "Okay",
                            onClick: () => {

                            }
                        }
                    ],
                })
            }

        })
    }
    userDetails = (ovdimglist,
        mobileno,
        ovdcode,
        ovddata) => {
        console.log(ovdimglist, mobileno, ovdcode, ovddata);

        this.setState({ viewOvdDataList: ovddata })
        this.setState({ viewOvdCode: ovdcode })
        this.setState({ viewMobileno: mobileno })
        $("#viewUpldOvdmodal").click()
    }
    viewOVDPageType = (e) => {
        this.setState({ viewPageType: e.target.value });
    }
    viewGetuploadedovdimage = () => {
        fetch(BASEURL + '/usrmgmt/getuploadedovdimage?mobileno=' + this.state.viewMobileno + "&ovdcode=" + this.state.viewOvdCode + "&pagetype=" + this.state.viewPageType, {
            method: 'Get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then((Response) => Response.blob())
            .then((resdata) => {
                console.log(resdata);
                $("#launchCollOVD").click();
                const imageUrl = URL.createObjectURL(resdata);
                const imageElement = document.createElement("img");
                imageElement.src = imageUrl;
                const container = document.getElementById("image-container");
                container.appendChild(imageElement);
            })
    }
    downloadUploadedovdimage = () => {
        fetch(BASEURL + '/usrmgmt/getuploadedovdimage?mobileno=' + this.state.viewMobileno + "&ovdcode=" + this.state.viewOvdCode + "&pagetype=" + this.state.viewPageType, {
            method: 'Get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then((Response) => Response.blob())
            .then((resdata) => {
                console.log(resdata);

                const url = window.URL.createObjectURL(resdata);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // the filename you want
                a.download = this.state.viewOvdCode + ".jpg";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
    }
    clearOVDImage = () => {
        $('#image-container img').last().remove();
    }
    getSancLetter = (event) => {
        fetch(BASEURL + '/lms/viewloansanctionletter?loanreqno=' + this.state.loanreqno, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
            },
            responseType: 'arraybuffer',
            dataType: 'blob'
        })
            .then(response => {
                return response.blob();
            })
            .then((response) => {
                console.log('Response:', response)
                $("#loanAgreementPDFModal").click();
                this.setState({ docuResponse: response });
                var file = new Blob([(response)], { type: 'application/pdf' });
                console.log(file);
                var fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                document.getElementsByClassName('PDFdoc')[0].src = fileURL + "#zoom=80";
            })
            .catch((error) => {
                console.log(error)
            })
    }
    //T&C signing
    BTnCMobileno = (event) => {
        this.setState({ BTnCMobileno: event.target.value });
    }
    getBorTnCBasicInfo = () => {
        fetch(BASEURL + '/lsp/getuserbasicinfo', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                userid: this.state.BTnCMobileno,
                usertype: "3"
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    this.setState({ assistKycBorrId: resdata.msgdata.borrowerid })
                    this.setState({ kycstatus: resdata.msgdata.kycstatus })
                    console.log(resdata.msgdata.borrowerid);
                    console.log(this.state.assistKycBorrId)
                    this.setState({ kycBorrowername: resdata.msgdata.borrowername })
                    this.setState({ tncstatus: resdata.msgdata.tncstatus })

                    console.log(this.state.tncBorrowerName)
                    $("#BTnc").show()
                    this.setState({ BTncDisable: false })
                    $("#LoanProcessing").hide()
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
            .catch(error => console.log(error)
            );
    }

    retriggerTnCSigning = () => {
        fetch(BASEURL + '/usrmgmt/retriggertncsigninglink?borrowerid=' + this.state.assistKycBorrId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    if (resdata.message.includes("Signing already completed")) {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {

                                    }
                                }
                            ],
                            closeOnClickOutside: false,
                        })
                    } else {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                    }
                                }
                            ],
                            closeOnClickOutside: false,
                        })
                    }

                }
                else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                }
                            }
                        ],
                        closeOnClickOutside: false,
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
    }
    // viewDocument = () => {
    //     var pDocsId = this.state.pdocsID
    //     var memmid = sessionStorage.getItem('memmID')
    //     var docuName = this.state.pdocsNum;
    //     console.log(this.state.pdocsID)

    //     var TnCDocuFlag = this.state.TnCdocumentFlag;
    //     console.log(TnCDocuFlag)
    //     if (TnCDocuFlag == true) {
    //         fetch(BASEURL + `/usrmgmt/getdocument?id=${pDocsId}` + `&memmid=${memmid}`, {
    //             method: 'get',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': "Bearer " + sessionStorage.getItem('token')
    //             },
    //         }).then((Response) => Response.blob())
    //             .then((resdata) => {
    //                 console.log(resdata)
    //                 console.log('Response:', resdata)
    //                 $("#launchTncdocu").click();
    //                 console.log('Response:', resdata)
    //                 var collFile = new Blob([(resdata)], { type: 'application/pdf' });
    //                 console.log(collFile);
    //                 var collfileURL = URL.createObjectURL(collFile);
    //                 console.log(collfileURL);
    //                 document.getElementsByClassName('PDFdoc2')[0].src = collfileURL + "#zoom=100";
    //             })
    //     } else {
    //         confirmAlert({
    //             message: "Document not available.",
    //             buttons: [
    //                 {
    //                     label: "Okay",
    //                     onClick: () => {

    //                     }
    //                 }
    //             ],
    //         })
    //     }
    // }
    togglePasswordVisiblity = () => {
        const { isAccountnoShown } = this.state;
        this.setState({ isAccountnoShown: !isAccountnoShown });
    };
    //Change
    getLoanRequestDetails = (loanreqno) => {
        fetch(BASEURL + '/lsp/getloanrequeststatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: loanreqno
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({
                        loanReqStatus: resdata.msgdata.loanconsentsignerinfo,
                    })
                } else {

                    console.log(resdata.message)
                }
            })
    }
    viewLoanReqDocu = () => {
        fetch(BASEURL + '/lms/borr/getloanagreement?loanreqno=' + this.state.loanreqno + "&doctype=2", {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
            },
            responseType: 'arraybuffer',
            dataType: 'blob'
        })
            .then(response => {
                return response.blob();
            })
            .then((response) => {
                console.log('Response:', response)
                var file = new Blob([(response)], { type: 'application/pdf' });
                console.log(file);
                var fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                document.getElementsByClassName('PDFdoc51')[0].src = fileURL + "#zoom=50";
                $("#launchColl1").click();
            })
            .catch((error) => {
                console.log(error)
            })
    }
    grpDetails = () => {
        this.getLoanRequestDetails(this.state.loanreqno);
        $('#ViewGroupdetails').click();
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const digiURL = BASEURL + "/verification/digilocker/makedigilockercall";
        const { t } = this.props
        const { isAccountnoShown } = this.state;
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
        const myStyle2 = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "4px 2px",
            cursor: "pointer",
            fontSize: "14px",
            height: "24px",
            width: "65px",
            border: "none",
            backgroundColor: "rgb(40, 116, 166)",
            borderRadius: "5px",
            marginLeft: "14px"
        }
        const Results = () => (
            <div>
                <div className='col'>
                    <div className="row">
                        <div className='col-12' style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70" }}>
                            <p><FaRegUser style={{ marginTop: "-6px" }} />&nbsp;Loan Offer Acceptance</p>
                            <hr style={{ marginTop: "-14px" }} />
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: "-26px" }}>
                        <div className='col'>
                            <div className='card p-2' style={{ cursor: "default" }}>
                                {LoanStatus == 1 ?
                                    <div>
                                        <div className='row mb-2'>
                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                <div className='row'>
                                                    <div className='col-7'>
                                                        <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Requested Amount</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold">:</p>
                                                    </div>
                                                    <div className='col-3'>
                                                        <p className="mb-0" style={{ width: "80px" }}>₹ {this.state.RequestedAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                <div className='row'>
                                                    <div className='col-5'>
                                                        <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Product ID</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold">:</p>
                                                    </div>
                                                    <div className='col-5'>
                                                        <p className="mb-0" style={{ width: "80px" }}>{this.state.ProductID}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                <div className='row'>
                                                    <div className='col-7'>
                                                        <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Status</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold">:</p>
                                                    </div>
                                                    <div className='col-3'>
                                                        <p className="mb-0" style={{ width: "max-content" }}>{this.state.loanStatus == 1 ? "Active(Loan Request Raised)" : ""}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col' style={{ textAlign: "end", paddingTop: "15px" }}>
                                                <button className='btn text-white btn-sm' style={{ backgroundColor: "#0079BF" }} onClick={this.withdrawLoanRequest}>Withdraw Request</button>
                                            </div>
                                        </div>
                                    </div> :
                                    <div className='row mb-2'>
                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                            <div className='row'>
                                                <div className='col-7'>
                                                    <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Loan Amount Offered</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-3'>
                                                    <p className="mb-0" style={{ width: "80px" }}>₹{this.state.offeredAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-7'>
                                                    <p className="mb-0 font-weight-bold">EMI</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-3'>
                                                    <p className="mb-0" style={{ width: "80px" }}>₹{this.state.emiAmt == "" ? "-" : this.state.emiAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-7'>
                                                    <p className="mb-0 font-weight-bold">Interest</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-3'>
                                                    <p className="mb-0" style={{ width: "80px" }}>{this.state.interestRate} P.A.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                            <div className='row'>
                                                <div className='col-5'>
                                                    <p className="mb-0 font-weight-bold">Tenure</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-5'>
                                                    <p className="mb-0">{this.state.TenureOffered}&nbsp;{this.state.repaymentDesc == "Daily" ? "Days" : <span>
                                                        {this.state.repaymentDesc == "Monthly" ? "Months" : <span>{this.state.repaymentDesc == "Weekly" ? "Weeks" : ""}</span>}</span>}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-5'>
                                                    <p className="mb-0 font-weight-bold">Risk Rating</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-5'>
                                                    <p className="mb-0">{this.state.riskRating}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-5'>
                                                    <p className="mb-0 font-weight-bold">Status</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-5'>
                                                    <p className="mb-0" style={{ width: "110px" }}>{this.state.loanStatus}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    loanAccStatus == 1 ?
                                        <>
                                            <div className='row' style={{ fontSize: "14px" }}>
                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                    <div className='row'>
                                                        <div className='col-7'>
                                                            <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Product ID</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-3'>
                                                            <p className="mb-0" style={{ width: "80px" }}>{this.state.ProductID}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-7'>
                                                            <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Loan Account Number</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-3'>
                                                            <p className="mb-0" style={{ width: "80px" }}>{LoanActSt.loanaccountno}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-7'>
                                                            <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Loan Disbursed On</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-3'>
                                                            <p className="mb-0" style={{ width: "80px" }}>
                                                                {LoanActSt.loandisbursementdate ? LoanActSt.loandisbursementdate.split("-").reverse().join("-") : "-"}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-7'>
                                                            <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Last Repayment Date</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-3'>
                                                            <p className="mb-0" style={{ width: "80px" }}>
                                                                {LoanActSt.lastrepaymentdate ? LoanActSt.lastrepaymentdate.split("-").reverse().join("-") : "-"}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-7'>
                                                            <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Amount Overdue</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-3'>
                                                            <p className="mb-0" style={{ width: "80px" }}>₹{parseFloat(LoanActSt.amtoverdue).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-7'>
                                                            <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Virtual Account Number</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-3'>
                                                            <p className="mb-0" style={{ width: "80px" }}>{LoanActSt.vpa}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>

                                                    <div className='row'>
                                                        <div className='col-5'>
                                                            <p className="mb-0 font-weight-bold">P2P Charges Outstanding</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-5'>
                                                            <p className="mb-0" style={{ width: "110px" }}>₹{parseFloat(LoanActSt.p2pfeeschargesoutstanding).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-5'>
                                                            <p className="mb-0 font-weight-bold">Loan Outstanding</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-5'>
                                                            <p className="mb-0" style={{ width: "110px" }}>₹{parseFloat(LoanActSt.loanoutstanding).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-5'>
                                                            <p className="mb-0 font-weight-bold">Principal Outstanding</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-5'>
                                                            <p className="mb-0" style={{ width: "110px" }}>₹{parseFloat(LoanActSt.principaloutstanding).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className='col-5'>
                                                            <p className="mb-0 font-weight-bold">Loan Account UPI ID</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-5'>
                                                            <p className="mb-0" style={{ width: "110px" }}>{LoanActSt.dynamicvpa}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-5'>
                                                            <p className="mb-0 font-weight-bold">IFSC Code</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-5'>
                                                            <p className="mb-0" style={{ width: "110px" }}>{LoanActSt.ifsccode == "" ? "-" : LoanActSt.ifsccode}</p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end", marginRight: "10px", marginBottom: "10px" }}>
                                                    <button className="btn btn-info mt-2 " style={{ backgroundColor: "rgba(5,54,82,1)", fontSize: "14px" }} onClick={this.getAgreement.bind(this, LoanActSt.loanaccountno)}>View Agreement</button>
                                                    <button className="btn btn-info mt-2 " style={{ marginLeft: "5px", backgroundColor: "rgba(5,54,82,1)", fontSize: "14px" }} onClick={this.getBorStatement.bind(this, LoanActSt.loanaccountno, LoanActSt.loanamt, LoanActSt.loanstatusid)}>View Statement</button>
                                                    <button className="btn btn-info mt-2" style={{ marginLeft: "5px", backgroundColor: "rgba(5,54,82,1)", fontSize: "14px" }} onClick={this.getRepaySchedule.bind(this, LoanActSt.loanaccountno, LoanActSt.loanstatusid)}>Repayment Schedule</button>
                                                </div>
                                            </div>
                                        </> : ""
                                }
                                <div className='row'>
                                    <div className='col-4'>
                                        {/* this.state.loanOfferDetails.loanreqstatus == 3 */}
                                        <span>{LoanStatus == 3 ?
                                            <span>
                                                <p className="text-uppercase" style={{ color: "rgba(5,54,82,1)" }}>{t('FundingStatus')}</p>
                                                <div className="progress mb-3" style={{ marginTop: "-10px" }}>
                                                    <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: this.state.fundPercent }}
                                                        aria-valuenow='80' aria-valuemin='100' aria-valuemax='100'>
                                                        {this.state.fundPercent}
                                                    </div>
                                                </div>
                                                {/* {this.state.loanstats == 4 || this.state.loanstats == 8 ? "" :
                                                    <>
                                                        <p className="text-uppercase" style={{ color: "rgba(5,54,82,1)" }}>{t('FundingStatus')}</p>
                                                        <div className="progress mb-3" style={{ marginTop: "-10px" }}>
                                                            <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: this.state.fundPercent }}
                                                                aria-valuenow='80' aria-valuemin='100' aria-valuemax='100'>
                                                                {this.state.fundPercent}
                                                            </div>
                                                        </div>
                                                    </>
                                                } */}
                                            </span> : null}
                                        </span>
                                    </div>
                                    <div className='col' style={{ textAlign: "end", paddingTop: "15px" }}>
                                        {this.state.isjlgFlag == 1 ?
                                            <span>
                                                <button type="button" class="btn text-white btn-sm" style={{ backgroundColor: "rgba(5,54,82,1)" }} onClick={this.grpDetails} >Group details</button>
                                                <button type="button" class="btn text-white btn-sm" style={{ marginLeft: "5px", backgroundColor: "rgba(5,54,82,1)" }} onClick={this.viewLoanReqDocu} >Consent Document</button>
                                                &nbsp;</span>
                                            : null}
                                        {this.state.LoanreqStatus == 2 ?
                                            <span>
                                                <button type="button" class="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.acceptOffer}>Accept Offer</button>
                                                &nbsp;
                                                <button className='btn text-white btn-sm' style={{ backgroundColor: "#0079BF" }} onClick={this.getSancLetter}>Sanction Letter</button>
                                                &nbsp;
                                                <button className='btn text-white btn-sm' style={{ backgroundColor: "#0079BF" }} onClick={this.withdrawLoanRequest}>Withdraw Request</button>
                                            </span>
                                            :
                                            null}

                                        {this.state.loanstats == 3 ?
                                            <span>
                                                <button type="button" class="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.acceptFunding}>Accept Funding</button>
                                                &nbsp;
                                                <button className='btn text-white btn-sm' style={{ backgroundColor: "#0079BF" }} onClick={this.getSancLetter}>Sanction Letter</button>
                                                &nbsp;
                                                <button className='btn text-white btn-sm' style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                            </span>
                                            :
                                            null}

                                        {this.state.loanstats == 4 ?
                                            <span>
                                                {this.state.agreementSignedFlag == "1" ?
                                                    <>
                                                        <span><FaCheckCircle style={{ color: "rgb(136, 189, 72)" }} /> &nbsp;</span>
                                                        <Link to="/assistSignAgreement">
                                                            <button className='btn text-white btn-sm' style={{ backgroundColor: "rgb(136, 189, 72)" }}>
                                                                <FaRegFileAlt />View Agreement
                                                            </button>
                                                        </Link>
                                                        {/* &nbsp;
                                                        <button className='btn text-white btn-sm' style={{ backgroundColor: "#0079BF" }} onClick={this.preDisbursement}>Disburse Money</button> */}
                                                    </> :
                                                    <Link to="/assistSignAgreement">
                                                        <button className='btn text-white btn-sm' style={{ backgroundColor: "rgb(136, 189, 72)" }}>
                                                            <FaFileSignature />Sign Agreement
                                                        </button>
                                                    </Link>
                                                }
                                            </span> : null}
                                        {(this.state.loanOfferDetails.loanreqstatus == 3 && this.state.loanstats == 1) ?
                                            <button className='btn text-white btn-sm' style={{ backgroundColor: "#0079BF" }} onClick={this.withdrawLoanRequest}>Withdraw Request</button>
                                            : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        console.log(this.state.Personaliseditted,
            this.state.PermanentaddressIseditted,
            this.state.accountIseditted)

        var addressType1 = {}
        addressType1 = this.state.addressType1;
        console.log(this.state.addressOvdFormDetails)
        var noteAcc = "Accounts must be personally owned. Money will be forfeited if found to belong to someone else.";
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#f4f7fc" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <FacilitatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/facilitatorDashboard">Home</Link> / Assisted Services</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/facilitatorDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    {/* new Design */}
                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-4' id='headingCust'>
                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600", fontSize: "15px" }}>Assisted Services</p>
                            </div>
                        </div>
                    </div>
                    <div class="container" style={{ width: "94%" }}>
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <ul class="nav nav-pills flex-column" id="myTab" role="tablist" style={{ textAlign: "center", fontSize: "15px", fontFamily: "Poppins,sans-serif" }}>
                                    <li class="nav-item mb-2">
                                        <a class="nav-link active" id="register-tab" data-toggle="tab"
                                            href="#profile" role="tab" aria-controls="profile" aria-selected="false" value="3"><img src={cusOB2} style={{ width: "30px", fontSize: "14px" }} />Customer Onboarding</a>
                                    </li>
                                    <li class="nav-item mb-2" onClick={this.state.viewEditDisable == false ? () => { } : this.viewEditPtab}>
                                        <a class="nav-link " id="viewEditP-tab" data-toggle="tab"
                                            href="#view" role="tab" aria-controls="view" aria-selected="false" value="3"><FaAddressBook />View/ Edit Personal Details</a>
                                    </li>
                                    <li class="nav-item mb-2" onClick={this.state.kycDisable == false ? () => { } : this.kycviewtab}>
                                        <a class="nav-link" id="KYCVerify-tab" data-toggle="tab"
                                            href="#KYCVerify" role="tab" aria-controls="KYCVerify" aria-selected="false" value="3"><img src={verifi} style={{ width: "21px" }} />KYC Verification</a>
                                    </li>
                                    <li class="nav-item mb-2" onClick={this.LPviewtab}>
                                        <a class="nav-link" id="LoanProcessing-tab" data-toggle="tab"
                                            href="#LoanProcessing" role="tab" aria-controls="LoanProcessing" aria-selected="false" value="3"><img src={cusboarding} style={{ width: "21px" }} />Assisted Loans</a>
                                    </li>
                                    <li class="nav-item mb-2" onClick={this.state.BDueDisable == false ? this.commonTask : this.BDueviewtab}>
                                        <a class="nav-link" id="BDueCollect-tab" data-toggle="tab"
                                            href="#BDueCollect" role="tab" aria-controls="BDueCollect" aria-selected="false" value="3"><img src={dueCollect} style={{ width: "30px" }} />Due Collection</a>
                                    </li>
                                    <li class="nav-item" onClick={this.state.BTncDisable == false ? this.commonTask : this.BTncviewtab}>
                                        <a class="nav-link" id="BTnc-tab" data-toggle="tab"
                                            href="#BTnc" role="tab" aria-controls="BTnc" aria-selected="false" value="3"><FaFileAlt style={{ width: "30px" }} />T&C Signing</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-md-8">
                                <div class="tab-content" id="myTabContent" style={{ marginTop: "-15px", marginLeft: "-20px" }}>
                                    <div class="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="register-tab">
                                        <div className="card" style={{ cursor: "default", fontSize: "14px" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className='mb-3' style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingTop: "15px", }}>
                                                    <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                                    <div>
                                                        <h4 className="heading1" style={{ color: "#222C70", fontSize: "15px" }}>
                                                            Choose Registration Option
                                                        </h4>
                                                    </div>
                                                    <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                                </div>

                                                <div className='row mb-4' onClick={this.userRegType} style={{ color: "#222C70", fontWeight: "bold" }}>
                                                    <div className="col-6">
                                                        <div className="form-check" title='Service unavailable'>
                                                            <p className="form-check-label mr-4">
                                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="OFKYC" disabled />
                                                                <span style={{ color: 'gray' }}>
                                                                    {t("With Offline Aadhaar")}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="form-check">
                                                            <p className="form-check-label mr-1">
                                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="AAQR" />{t("With Aadhaar QR")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row mb-4' onClick={this.userRegType} style={{ color: "#222C70", fontWeight: "bold" }}>
                                                    <div className="col-6">
                                                        <div className="form-check">
                                                            <p className="form-check-label mr-4">
                                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="DIGI" />{t("With DigiLocker")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="form-check">
                                                            <p className="form-check-label mr-4">
                                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="REGNOW" />{t("Register Now, Verify Later")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row mb-2' style={{ marginTop: "-20px" }}>
                                                    <div className='col' style={{ textAlign: "center" }}>
                                                        <div className="form-check">
                                                            <img src={regImg} width="25%" height="25%" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade show" id="view" role="tabpanel" aria-labelledby="viewEditP-tab" style={{ display: "none" }}>
                                        <div className="card" style={{ cursor: "default", fontSize: "14px" }}>
                                            <div className="card-header border-1 bg-white">

                                                <div className='row' style={{ marginTop: "-18px" }}>
                                                    <div className='col'>
                                                        <ul role="tablist" className="nav nav-pills nav-fill mb-3">
                                                            <li className="nav-item" onClick={this.personalSubmit}> <a data-toggle="pill" href="#per-tab" className="nav-link active detailsTab viewTab"
                                                                style={{ textAlign: "initial" }}>
                                                                Personal Details</a></li>
                                                            <li className="nav-item" onClick={this.addressSubmit}> <a data-toggle="pill" href="#perAdd-tab" className="nav-link detailsTab viewTab"
                                                            >Address Details</a></li>
                                                            <li className="nav-item" onClick={this.bankSubmit}> <a data-toggle="pill" href="#perBnk-tab" className="nav-link detailsTab viewTab"
                                                            >Bank Details</a></li>
                                                            {/* <li className="nav-item"> <a data-toggle="pill" href="#perPhoto-tab" className="nav-link detailsTab viewTab"
                                                                style={{ textAlign: "end" }}><FaTimesCircle style={{ color: "grey" }} />&nbsp;Photo</a></li> */}
                                                        </ul>
                                                        <hr style={{ marginTop: "-35px" }} />
                                                    </div>
                                                </div>
                                                <div className='row' style={{ marginTop: "-23px" }}>
                                                    <div className='col'>
                                                        <div className='card tab-content' style={{ boxShadow: "rgb(255 255 240 / 10%) 0px 30px 60px -12px inset, rgb(0 0 0 / 30%) 0px 18px 36px -18px inset", backgroundColor: "white" }}>
                                                            <div id="per-tab" className="card-header register-form tab-pane fade show active" style={{ padding: '14px', cursor: "default" }}>
                                                                <div className="row">
                                                                    <div className='col' style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                                        <p><FaRegUser style={{ marginTop: "-6px" }} />&nbsp;Personal Info</p>
                                                                        <hr style={{ marginTop: "-14px" }} />
                                                                    </div>

                                                                </div>
                                                                <div className='row'>
                                                                    <div className='col'></div>
                                                                    <div className='col-3' style={{ textAlign: "center" }}>
                                                                        <div>
                                                                            {this.state.imageFlag == true ?
                                                                                <img src={`data:image/png;base64,${this.state.profileImage}`} style={{ width: "101px", height: "100px", border: "10px solid white", borderRadius: "20px" }} className="rounded-circle " id="profileImage" /> :

                                                                                <img src={`data:image/png;base64,${this.state.profileImage}`} style={{ width: "101px", height: "100px", border: "10px solid white", borderRadius: "20px" }} className="rounded-circle " id="profileImage" />}
                                                                            {/* <img src={this.state.viewImages} style={{ width: "101px", height: "100px", border: "10px solid white", borderRadius: "20px" }} /> */}
                                                                        </div>
                                                                        &nbsp;
                                                                        <input type="file" id="file3" name="img" accept="image/*" style={{ display: "none" }} onChange={this.assistedUploadImageDocu} />
                                                                        <a id="Picon2">
                                                                            <FaCamera style={{ color: "#0074bf", marginLeft: "67px", marginTop: "-46px", cursor: "pointer" }} onChange={this.assistedUploadImageDocu} />
                                                                        </a>
                                                                    </div>
                                                                    <div className='col'></div>
                                                                </div>
                                                                {this.state.Personaliseditted == "false" && this.state.personalDetailsData == "" || undefined || null ?
                                                                    <div className='row mb-2'>
                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                            <p htmlFor="user" className="label cusSupportEdit" style={{ fontWeight: "bold", cursor: "pointer" }} onClick={this.showEditPersonalDetails}>Add Personal Details &nbsp; <FaEdit /></p>
                                                                        </div>
                                                                    </div> :
                                                                    <>
                                                                        <div className='row mb-2'>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Primary Profession</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Primary Profession" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.primaryProfession}>
                                                                                                    {this.state.primaryProfession ? <option>{this.state.primaryProfession}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>{attributeoptions.attributevalue} </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                                {(this.state.primaryProfValid) ? <span className='text-danger'>Primary and secondary professions should not match.</span> : ''}

                                                                            </div>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Secondary Profession</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Secondary Profession" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.secondaryProfession}>
                                                                                                    {this.state.secondaryProfession ? <option>{this.state.secondaryProfession}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>{attributeoptions.attributevalue} </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                                {(this.state.secondaProfValid) ? <span className='text-danger'>Primary and secondary professions should not match.</span> : ''}

                                                                            </div>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Residence Type</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Residence Type" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.ResidenceType}>
                                                                                                    {this.state.ResidenceType ? <option>{this.state.ResidenceType}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>{attributeoptions.attributevalue} </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </div>

                                                                        </div>
                                                                        <div className='row mb-2'>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Education</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Education" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.Education}>
                                                                                                    {this.state.Education ? <option>{this.state.Education}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>{attributeoptions.attributevalue} </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </div>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Income Range Group</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Income Range Group" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.IncomeRangeGroup}>
                                                                                                    {this.state.IncomeRangeGroup ? <option>{this.state.IncomeRangeGroup}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>{attributeoptions.attributevalue} </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </div>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Marital Status</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Marital Status" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.MaritalStatus}>
                                                                                                    {this.state.MaritalStatus ? <option>{this.state.MaritalStatus}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>{attributeoptions.attributevalue} </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </div>

                                                                        </div>
                                                                        <div className='row mb-2' >
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Account Type</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Account" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.Account}>
                                                                                                    {this.state.Account ? <option>{this.state.Account}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>{attributeoptions.attributevalue} </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </div>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Relationship</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Relationship" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.Relation}>
                                                                                                    {this.state.Relation ? <option>{this.state.Relation == this.state.Relation + " Of" ? this.state.Relation.trim("Of") : this.state.Relation + " Of"}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>
                                                                                                                    {attributeoptions.attributevalue == attributeoptions.attributevalue + " " + "Of" ? attributeoptions.attributevalue : attributeoptions.attributevalue + " " + "Of"}
                                                                                                                </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </div>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Relation Reference Name</p>
                                                                                <input className='form-control' type='text' id='relationName' name='relationName' placeholder='Enter Relation Name' style={{ marginTop: "-14px", height: "38px" }} onChange={this.RelationName}
                                                                                    value={this.state.RelationName} />

                                                                            </div>

                                                                        </div>
                                                                        <div className='row mb-2' >
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Land Holding</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Land Holding" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.LandHolding}>
                                                                                                    {this.state.LandHolding ? <option>{this.state.LandHolding}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>{attributeoptions.attributevalue} </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </div>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Age</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Age" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.Age}>
                                                                                                    {this.state.Age ? <option>{this.state.Age}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>{attributeoptions.attributevalue} </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </div>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Dependents</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Dependents" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.Dependents}>
                                                                                                    {this.state.Dependents ? <option>{this.state.Dependents}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>{attributeoptions.attributevalue} </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </div>

                                                                        </div>
                                                                        <div className='row mb-2' >
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Years In Residence</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Years In Residence" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.YearsInResidence}>
                                                                                                    {this.state.YearsInResidence ? <option>{this.state.YearsInResidence}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>{attributeoptions.attributevalue} </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </div>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Years Of Earning</p>
                                                                                {this.state.grpInfo.map((borrower, index) => {
                                                                                    return (
                                                                                        <div key={index} >
                                                                                            {borrower.attributename == "Years Of Earning" ?
                                                                                                <select className="form-select" style={{ marginTop: "-13px", color: "RGBA(5,54,82,1)" }} onChange={this.YearsOfEarning}>
                                                                                                    {this.state.YearsOfEarning ? <option>{this.state.YearsOfEarning}</option> : <option defaultValue>----Please Select----</option>}
                                                                                                    {
                                                                                                        borrower.attributeoptions.map((attributeoptions, subIndex) => {
                                                                                                            return (
                                                                                                                <option key={subIndex} style={{ color: "GrayText" }}>{attributeoptions.attributevalue} </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                                : null}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                }
                                                            </div>
                                                            <div id="perAdd-tab" className="card-header register-form tab-pane fade" style={{ padding: '14px', cursor: "default" }}>
                                                                <div className="row">
                                                                    <div className='col-lg-3 col-md-6 col-sm-4' style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                                        <p><FaMapMarkerAlt style={{ marginTop: "-6px" }} />&nbsp;Address Info</p>
                                                                        <hr style={{ marginTop: "-14px" }} />
                                                                    </div>
                                                                    <div className='col-lg-7 col-md-10 col-sm-12' style={{ color: "RGBA(5,54,82,1)", fontSize: "14px" }}>
                                                                        {(addressType1.status === 0 && addressType1.newaddrstatus === 0) ? "Address verification under process." :
                                                                            ((addressType1.status === 1 || addressType1.status === 9) && (addressType1.newaddrstatus === 1 || addressType1.newaddrstatus === 9)) ? <FaCheckCircle style={{ color: "green" }} /> :
                                                                                ((addressType1.status === 1 || addressType1.status === 9) && addressType1.newaddrstatus === 0) ? "Uploaded address is under verification." :
                                                                                    ((addressType1.status === 1 || addressType1.status === 9) && addressType1.newaddrstatus === 2) ? <span>Recent uploaded address rejected, prefer old address.</span> :
                                                                                        (addressType1.status === 2 && addressType1.newaddrstatus === 2) && "Uploaded address details rejected."
                                                                        }
                                                                    </div>
                                                                    {addressType1.newaddrstatus === 0 ? "" :
                                                                        <div className='col-lg-2 col-md-4 col-sm-4'>
                                                                            <div className="row" style={{ marginTop: "-4px" }}>
                                                                                <div className='col-lg-2 col-md-6 col-sm-4'>
                                                                                    <button className='btn btn-sm'
                                                                                        style={{ border: "2px solid RGBA(5,54,82,1)", marginTop: "-8px" }}
                                                                                        onClick={() => this.getPoaDetails("poa")}
                                                                                    ><FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span></button>
                                                                                </div>
                                                                            </div>
                                                                        </div>}
                                                                </div>
                                                                {Object.keys(addressType1).length !== 0 &&
                                                                    <>
                                                                        <div className='row' id='addressdetails5' style={{ marginTop: "-10px" }}>
                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Address</p>
                                                                                <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{addressType1.address1}, {addressType1.address2}, {addressType1.address3}</p>
                                                                            </div>
                                                                            <div className='col-sm-4 col-md-6 col-lg-3'>
                                                                                <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>State</p>
                                                                                <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{addressType1.state}</p>
                                                                            </div>
                                                                            <div className='col-sm-4 col-md-6 col-lg-3'>
                                                                                <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>District</p>
                                                                                <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{addressType1.district}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row' id='addressdetails6'>
                                                                            <div className='col-sm-4 col-md-6 col-lg-3'>
                                                                                <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>City</p>
                                                                                <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{addressType1.city}</p>
                                                                            </div>
                                                                            <div className='col-sm-4 col-md-6 col-lg-3'>
                                                                                <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>PIN Code</p>
                                                                                <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{addressType1.pincode}</p>
                                                                            </div>
                                                                            <div className='col-sm-4 col-md-6 col-lg-3'>
                                                                                <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Taluk</p>
                                                                                <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{addressType1.taluk}</p>
                                                                            </div>
                                                                        </div>
                                                                    </>}

                                                                {this.state.PermanentaddressIseditted == "false" && this.state.permananentDetailsData == "" || undefined || null ?
                                                                    <div className='row mb-2'>
                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                            <p htmlFor="user" className="label cusSupportEdit" style={{ fontWeight: "bold", cursor: "pointer" }} onClick={this.getPoaDetails} >Add Address Details &nbsp; <FaEdit /></p>
                                                                        </div>
                                                                    </div> :
                                                                    <>
                                                                        <div id='permanentAddress'>
                                                                            {this.state.addressOvdFormDetails && this.state.addressOvdFormDetails.length > 0 &&
                                                                                <>
                                                                                    <div className='row' style={{ marginTop: "-20px" }}>
                                                                                        <div className='col-sm-6 col-md-8 col-lg-12'>
                                                                                            {this.state.addressOvdFormDetails.map((form, subIndex) => {
                                                                                                return (
                                                                                                    <div className='row p-1' key={subIndex}>
                                                                                                        <p style={{ fontWeight: "bold", color: "rgba(5,54,82,1)", fontSize: "14px", marginLeft: "2px" }}>{form.addressinfo.type === "ADDRESSUPDATE" ? "Address Details" : "OVD Details"}</p>
                                                                                                        {form.addressinfo.formdata && form.addressinfo.formdata.formfields && form.addressinfo.formdata.formfields.map((formData, index) => {
                                                                                                            return (
                                                                                                                <div className='col-lg-3 col-md-6 col-sm-8' key={index} style={{ color: "rgba(5,54,82,1)", fontSize: "14px", marginTop: "-13px" }}>
                                                                                                                    <p style={{ fontWeight: "bold" }}>{formData.field}</p>
                                                                                                                    <p style={{ marginTop: "-15px" }}>{formData.value}</p>
                                                                                                                </div>
                                                                                                            )
                                                                                                        })}
                                                                                                    </div>
                                                                                                )
                                                                                            })}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='row' style={{ marginTop: "-20px" }}>
                                                                                        <div className='col-sm-6 col-md-8 col-lg-12'>
                                                                                            {this.state.addressOvdFormDetails.map((form, subIndex) => {
                                                                                                return (
                                                                                                    <div className='row p-1' key={subIndex}>
                                                                                                        <p style={{ fontWeight: "bold", color: "rgba(5,54,82,1)", fontSize: "14px", marginLeft: "2px" }}>{form.ovdinfo.type === "ADDRESSUPDATE" ? "Address Details" : "OVD Details"}</p>
                                                                                                        {form.ovdinfo.formdata && form.ovdinfo.formdata.formfields && form.ovdinfo.formdata.formfields.map((formData, index) => {
                                                                                                            return (
                                                                                                                <div className='col-lg-3 col-md-6 col-sm-8' key={index} style={{ color: "rgba(5,54,82,1)", fontSize: "14px", marginTop: "-13px" }}>
                                                                                                                    <p style={{ fontWeight: "bold" }}>{formData.field}</p>
                                                                                                                    <p style={{ marginTop: "-15px" }}>{formData.value}</p>
                                                                                                                </div>
                                                                                                            )
                                                                                                        })}
                                                                                                    </div>
                                                                                                )
                                                                                            })}
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            }

                                                                            {this.state.talukFlag !== "p2p" ?
                                                                                <div className='row mb-2'>
                                                                                    <div className='col-sm-12 col-md-6 col-lg-6'>
                                                                                        <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Taluk</p>
                                                                                        <select className='form-select' style={{ marginTop: "-14px", color: "RGBA(5,54,82,1)" }} onChange={this.talukName}>
                                                                                            {this.state.taluk ? <option>{this.state.initialTaluk}</option> : <option defaultValue>Select Taluk</option>}
                                                                                            {this.state.talukList.map((taluk, index) => {
                                                                                                return (
                                                                                                    <option key={index} value={taluk.talukname} style={{ color: "GrayText" }}>{taluk.talukname}</option>
                                                                                                )
                                                                                            })
                                                                                            }
                                                                                        </select>
                                                                                    </div>
                                                                                </div> : ""}
                                                                        </div>
                                                                    </>}
                                                            </div>
                                                            <div id="perBnk-tab" className="card-header register-form tab-pane fade" style={{ padding: '14px', cursor: "default" }}>
                                                                <div className="row">
                                                                    <div className='col' style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                                        <p><FaHouseUser style={{ marginTop: "-6px" }} />&nbsp;Bank Info</p>
                                                                        <hr style={{ marginTop: "-14px" }} />
                                                                    </div>
                                                                </div>
                                                                {this.state.accountIseditted == "false" && this.state.accountDetailsData == "" || undefined || null ?
                                                                    <div className='row mb-2'>
                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                            <p htmlFor="user" className="label cusSupportEdit" style={{ fontWeight: "bold", cursor: "pointer" }} onClick={this.showEditBankDetails}>Add Bank Details &nbsp; <FaEdit /></p>
                                                                        </div>
                                                                    </div> :
                                                                    <>
                                                                        <div className='row'>
                                                                            <p style={{ fontFamily: "Poppins,sans-serif", color: "RGBA(5,54,82,1)", marginTop: "-10px" }}>{`Note: ${noteAcc}`}</p>
                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Account Type</p>
                                                                                <select className='form-select' style={{ marginTop: "-14px", color: "RGBA(5,54,82,1)" }} onChange={this.accounttype}>
                                                                                    {this.state.accounttype ? <option>{this.state.accounttype === 1 ? "Savings Account" : ""}</option> : <option defaultValue>Select Account Type</option>}
                                                                                    <option value="1">Savings Account</option>
                                                                                    {/* <option value="2">Current Account</option> */}
                                                                                </select>
                                                                            </div>
                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Account Number</p>
                                                                                <input type={isAccountnoShown ? "number" : "password"} className='form-control' placeholder='Enter Account Number' style={{ height: "38px", marginTop: "-14px" }}
                                                                                    onChange={this.accountno} autoComplete="off" name='account' value={this.state.accountno} />
                                                                                <i style={{ position: "relative", cursor: "pointer", left: "226px", bottom: "48px" }} id="bankToggle" className={`fa ${isAccountnoShown ? "fa-eye" : "fa-eye-slash"}`}
                                                                                    onClick={this.togglePasswordVisiblity} />
                                                                            </div>
                                                                        </div>
                                                                        <div className='row' style={{ marginTop: "-48px" }}>
                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Confirm Account Number</p>
                                                                                <input type='number' placeholder='Confirm Account Number' style={{ height: "38px", marginTop: "-14px" }}
                                                                                    onChange={this.accountno2} autoComplete="off" name='confirm-account'
                                                                                    className={(this.state.confirmAccount) ? 'error' : "form-control"} value={this.state.accountno2} />
                                                                                <br />
                                                                                {(this.state.confirmAccount) ? <span className='text-danger mb-2'>Account number does not match</span> : ''}
                                                                            </div>
                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>IFSC</p>
                                                                                <input className='form-control' type='text' placeholder='Enter IFSC' style={{ height: "38px", marginTop: "-14px" }}
                                                                                    onChange={this.accountifsc} autoComplete="off" value={this.state.accountifsc} />
                                                                                {(this.state.invalidIfsc) ? <span className='text-danger'>Invalid IFSC Code</span> : ''}
                                                                            </div>
                                                                        </div>
                                                                        <div className='row mb-2' style={{ marginTop: "-8px" }}>
                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>UPI ID</p>
                                                                                <input className='form-control' type='text' placeholder='Enter UPI ID' style={{ height: "38px", marginTop: "-14px" }}
                                                                                    onChange={this.accountvpa} autoComplete="off" value={this.state.accountvpa} />
                                                                            </div>
                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Branch</p>
                                                                                <input className='form-control' type='text' placeholder='Enter Branch' style={{ height: "38px", marginTop: "-14px" }}
                                                                                    onChange={this.branch} autoComplete="off" value={this.state.branch} />
                                                                            </div>
                                                                        </div>
                                                                    </>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    {this.state.assistSaveFlag == false &&
                                                        this.state.Personaliseditted == "false" &&
                                                        this.state.PermanentaddressIseditted == "false" &&
                                                        this.state.accountIseditted == "false" ?
                                                        null :
                                                        <div className='col' style={{ textAlign: "end" }}>
                                                            {this.state.assistSaveFlag == false ?
                                                                <button className='btn btn-sm' style={{ backgroundColor: "rgb(136, 189, 72)", color: "white", marginTop: "-8px" }}
                                                                    onClick={this.assistedSaveDataFinal}
                                                                ><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Save</span></button>
                                                                :
                                                                <button className='btn btn-sm' style={{ backgroundColor: "rgb(136, 189, 72)", color: "white", marginTop: "-8px" }}
                                                                    onClick={this.assistedSubmitProfileDetails}
                                                                ><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Submit</span></button>
                                                            }
                                                            &nbsp;
                                                            <button className='btn btn-sm' onClick={this.discardChanges} style={{ backgroundColor: "#0079BF", color: "white", marginTop: "-8px" }}
                                                            ><span>Discard</span>
                                                            </button>
                                                        </div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade show" id="KYCVerify" role="tabpanel" aria-labelledby="KYCVerify-tab" style={{ display: "none", fontSize: "14px" }}>
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className="row">
                                                    <div className='col-10' style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                        <FaUserEdit style={{ marginTop: "-6px" }} />&nbsp;<span>Verification</span>
                                                        <hr style={{ marginTop: "1px" }} />
                                                    </div>
                                                    {/* <div className='col-2'>
                                                        <button style={myStyle2} id="" onClick={this.viewovdFields}>
                                                            <span style={{ textDecoration: "none", color: "white" }}>OVD</span>
                                                        </button>
                                                    </div> */}
                                                </div>
                                                <div className='row'>
                                                    <div className='col-10'>
                                                        <div className='card pt-2 pl-2 pr-2' style={{ borderRadius: "10px", marginTop: "-3px", marginBottom: "0px", backgroundColor: "rgb(208, 234, 247)", color: "#222c70", border: "0px", cursor: "default" }}>
                                                            <div class="row">
                                                                <div className='col-4'>
                                                                    <p className='card-title' style={{ fontWeight: "500" }}>{t('Borrower ID')}</p>
                                                                </div>
                                                                <div className='col-1'>:</div>
                                                                <div className='col'>
                                                                    <p style={{ fontWeight: "400" }}>{this.state.assistKycBorrId}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row' style={{ marginTop: "-10px" }}>
                                                                <div className='col-4'>
                                                                    <p className='card-title' style={{ fontWeight: "500" }}>{t('Borrower Name')}</p>
                                                                </div>
                                                                <div className='col-1'>:</div>
                                                                <div className='col'>
                                                                    <p style={{ fontWeight: "400" }}>{this.state.kycBorrowername}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row' style={{ paddingLeft: "5px", paddingBottom: "5px" }}>
                                                                {this.state.kycstatus == 0 || this.state.kycstatus == 9 ?
                                                                    <div className='col'>
                                                                        <div className="row" style={{ fontSize: "16px" }}>
                                                                            <div className="col" style={{ textAlign: "" }}>
                                                                                <p className="text-primary"><FaTimesCircle style={{ color: "grey" }} />&nbsp;Your KYC is not verified.</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row' style={{ fontSize: "14px" }}>
                                                                            <div className="col" style={{ textAlign: "" }}>

                                                                                <button type="button" className="btn" id="digisubmit4"
                                                                                    style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", borderRadius: "10px" }} onClick={this.alertKYC}>Initiate VKYC Request *</button>
                                                                                &nbsp;

                                                                                {/* <button type="button" className="btn" id="" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample"
                                                                                    style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", borderRadius: "10px" }} onClick={this.viewovdFields}>Document Verification</button> */}
                                                                            </div>
                                                                        </div>
                                                                    </div> :
                                                                    <span>{this.state.kycstatus == 1 || this.state.kycstatus == 9 ? <div style={{ textAlign: "" }}>
                                                                        <FaCheckCircle style={{ color: "green" }} />KYC Verified
                                                                    </div> :
                                                                        <p className="text-primary"><FaTimesCircle style={{ color: "grey" }} />&nbsp;Your KYC is not verified.</p>}</span>}
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className='col-3'></div>
                                                </div>
                                                <div className='collapse viewOVDfields mt-2' id="collapseExample" >
                                                    <div className='row'>
                                                        <div className='col-10' style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                            <FaUserEdit style={{ marginTop: "-6px" }} />&nbsp;<span>OVD Documents</span>
                                                            <hr style={{ marginTop: "1px" }} />
                                                        </div>
                                                        <div className='col-2'>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm text-white"
                                                                onClick={this.ovdViewBtn}
                                                                style={{
                                                                    backgroundColor: "#0079bf",
                                                                    marginLeft: "-24px"
                                                                }}>
                                                                <FaFolderPlus />
                                                                &nbsp;
                                                                {t("Upload OVD")}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)" }}>
                                                        <div className='col-2'>
                                                            <p style={{ fontWeight: "600" }}>{t('OVD Code')}</p>
                                                        </div>
                                                        <div className='col-2'>
                                                            <p style={{ fontWeight: "600" }}>{t('Mobile No.')}</p>
                                                        </div>
                                                        <div className='col-2'>
                                                            <p style={{ fontWeight: "600", width: "100px" }}>{t('Created On')}</p>
                                                        </div>
                                                        <div className='col-3'>
                                                            <p style={{ fontWeight: "600" }}>{t('Status')}</p>
                                                        </div>
                                                        <div className='col-3'>
                                                            <p style={{ fontWeight: "600", marginLeft: "-55px" }}>{t('Reviewed by')}</p>
                                                        </div>
                                                        {/* <div className='col-2'>
                                                            <p style={{ fontWeight: "600", marginLeft: "-30px" }}>{t('Reject Reason')}</p>
                                                        </div> */}
                                                    </div>
                                                    <hr className="col-12" style={{ width: "96.5%", marginTop: "-10px" }} />
                                                    <>
                                                        {
                                                            this.state.OVDovdList == "" ?
                                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                                    <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                                        <p>No Requests Available !</p>
                                                                    </div>
                                                                </div> : <>

                                                                    {
                                                                        this.state.OVDovdList.map((Lists, index) => {
                                                                            return (
                                                                                <div className='row' style={{ marginTop: "-20px" }}>
                                                                                    <div className='col' key={index}>
                                                                                        <div className='card border-0' style={{ transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', marginLeft: "1px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                                            <div className="row item-list align-items-center">
                                                                                                <div className="col-2" style={{ paddingLeft: "20px" }}>
                                                                                                    <p className="p-0" style={{ fontSize: "17px", fontWeight: "490", marginTop: "15px", marginLeft: "10px" }}>{Lists.ovdcode}</p>
                                                                                                </div >
                                                                                                <div className="col-2">
                                                                                                    <p style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>{Lists.mobileno}</p>
                                                                                                </div >
                                                                                                <div className="col-2">
                                                                                                    <p style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px", marginLeft: "-5px" }}>{Lists.createdon}</p>
                                                                                                </div>
                                                                                                <div className="col-2">
                                                                                                    <p className="" style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>{Lists.status == 0 ? "Not Verified" : <span>{Lists.status == 1 ? "Approved" : <span>{Lists.status == 2 ? "Rejected" : ""}</span>}</span>}</p>
                                                                                                </div>
                                                                                                <div className="col-3">
                                                                                                    <p className="" style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>{Lists.reviewedby ? Lists.reviewedby : "-"}</p>
                                                                                                </div>
                                                                                                {/* <div className="col-1" style={{ textAlign: "" }}>
                                                                                                    <p className="" style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px", marginLeft: "-25px" }}>{Lists.rejectreason ? Lists.rejectreason : "-"}&nbsp;
                                             
                                                                                                    </p>
                                                                                                </div> */}
                                                                                                <div className='col-1'>
                                                                                                    <span class="dropup">
                                                                                                        <img src={openIt} style={{ height: "35px" }}
                                                                                                            class="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                                        &nbsp;
                                                                                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                                            <a class="dropdown-item" onClick={this.userDetails.bind(this, Lists.ovdimglist, Lists.mobileno, Lists.ovdcode, Lists.ovddata)} >View OVD Image</a>
                                                                                                            <a class="dropdown-item" onClick={this.deleteOvdModal.bind(this, Lists.ovddata, Lists.ovdcode)}>Delete OVD</a>
                                                                                                        </div>
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div >
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }

                                                                    <div className="row">
                                                                        <div className='col'></div>
                                                                        <div className='col'>
                                                                            <div className='card border-0' style={{ height: "40px", cursor: "default" }}>
                                                                                <ReactPaginate
                                                                                    previousLabel={"<"}
                                                                                    nextLabel={">"}
                                                                                    breakLabel={"..."}
                                                                                    breakClassName={"break-me"}
                                                                                    pageCount={this.state.OVDpageCount}
                                                                                    onPageChange={this.OVDhandlePageClick}
                                                                                    containerClassName={"pagination Customer"}
                                                                                    subContainerClassName={"pages pagination"}
                                                                                    activeClassName={"active"}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                        }
                                                    </>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade show" id="LoanProcessing" role="tabpanel" aria-labelledby="LoanProcessing-tab" style={{ display: "none", fontSize: "14px" }}>
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                {/* Heading of entities */}
                                                <div className='row' style={{ fontWeight: "600", color: "#222c70" }}>
                                                    <div className='col-3' >
                                                        <p style={{ marginLeft: "5px" }}>Request Number</p>
                                                    </div>
                                                    <div className='col-3'>
                                                        <p >Borrower Name</p>
                                                    </div>
                                                    <div className='col-3' style={{ textAlign: "center" }}>
                                                        <p>Request Amount</p>
                                                    </div>
                                                    <div className='col-3'>
                                                        <p style={{ marginLeft: "-21px" }}>Request Date</p>
                                                    </div>
                                                </div>
                                                <hr className="col-12" style={{ width: "95%", marginTop: "-6px" }} />
                                                {/* lists */}
                                                <div className='row mb-2' id='container' style={{ marginTop: "-20px" }}>
                                                    <div className='col-12' id='header'>
                                                        {
                                                            this.state.loanOfferList.map((loan, index) => {
                                                                return (
                                                                    <div key={index}>
                                                                        {loan.loanaccountstatus == "1" || "0" || "" ?
                                                                            <div className='row' >
                                                                                <div className='col'>
                                                                                    <div className='card border-0' href="javascript:;" style={{ cursor: "default", marginBottom: "-10px", border: "1px solid rgba(40,116,166,1)", borderRadius: "5px" }}>
                                                                                        <div className="row item-list align-items-center" style={{ color: "rgba(5,54,82,1)", paddingTop: "10px" }}>
                                                                                            <div className="col-3">
                                                                                                <p style={{ fontWeight: "490", marginLeft: "5px" }}>{loan.loanreqno}</p>
                                                                                            </div>
                                                                                            <div className="col-3">
                                                                                                <p style={{ fontWeight: "490" }}>{loan.name}</p>
                                                                                            </div>
                                                                                            <div className="col-3" style={{ textAlign: "end" }}>
                                                                                                <p style={{ fontWeight: "490", marginRight: "20px" }}>₹{loan.requestedamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                                                            </div>
                                                                                            <div className="col-1">
                                                                                                <p style={{ fontWeight: "490", width: "100px", marginLeft: "-20px" }}>{loan.loanrequestdate && loan.loanrequestdate.split("-").reverse().join("-")}</p>
                                                                                            </div >
                                                                                            <div class="col-2" style={{ cursor: "pointer" }}>
                                                                                                <button className='btn btn-sm text-white' onClick={() => this.handleToggle(loan, loan.emiamt, loan.tenureoffered, loan.repaymentfrequencydesc, loan.loanstatus, loan.offeredamt,
                                                                                                    loan.loanreqno, index, loan.loanaccountstatus, loan.borrowerid, loan.productid, loan.requestedamt, loan.isjlg)}
                                                                                                    style={{ backgroundColor: "rgb(0, 121, 191)", marginLeft: "23px" }}>View</button>

                                                                                            </div>
                                                                                            {/* <div class="col-2" style={{ cursor: "pointer" }}>
                                                                                                <button className='btn btn-sm text-white' onClick={this.loanOffers.bind(this, loan.emiamt, loan.tenureoffered, loan.repaymentfrequencydesc, loan.loanstatus, loan.offeredamt,
                                                                                                    loan.loanreqno, index, loan.loanaccountstatus, loan.borrowerid, loan.productid, loan.requestedamt)}
                                                                                                    style={{ backgroundColor: "rgb(0, 121, 191)", marginLeft: "23px" }}>View</button>
                                                                                            </div> */}
                                                                                        </div >
                                                                                        {(loan === this.state.toggle) ?
                                                                                            <div style={{ border: "1px solid rgba(40,116,166,1)", borderRadius: "5px" }}>
                                                                                                <div className='row'>
                                                                                                    <Results />
                                                                                                </div>
                                                                                            </div> : ''}

                                                                                        {/* <div className={`${loan.showDetails ? "" : "d-none"}`} style={{ border: "1px solid rgba(40,116,166,1)", borderRadius: "5px" }}>
                                                                                            <div className='row'>
                                                                                                <Results />
                                                                                            </div>
                                                                                        </div> */}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            : null}
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row float-right">
                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                        <ReactPaginate
                                                            previousLabel={"<"}
                                                            nextLabel={">"}
                                                            breakLabel={"..."}
                                                            breakClassName={"break-me"}
                                                            pageCount={this.state.pageCount}
                                                            onPageChange={this.handlePageClick}
                                                            containerClassName={"pagination Customer"}
                                                            subContainerClassName={"pages pagination"}
                                                            activeClassName={"active"}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade show" id="BDueCollect" role="tabpanel" aria-labelledby="BDueCollect-tab" style={{ display: "none", fontSize: "14px" }}>
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">

                                                <div className='row'>
                                                    <div className='col'></div>
                                                    {this.state.assistp2pDue <= 0 ?
                                                        <div className='col-4'>
                                                            <div className='card' id='myWalletCard1' style={{ borderRadius: "10px", marginTop: "-3px", marginBottom: "0px", backgroundColor: "rgb(208, 234, 247)", color: "#222c70", border: "0px", cursor: "default" }}>
                                                                <div class="row card-body">
                                                                    <div className='col pl-4'>
                                                                        <p className='card-title' style={{ fontWeight: "500" }}>{t('No Dues available.')}</p>
                                                                        {/* <p style={{ fontWeight: "400", marginTop: "-10px" }}>₹{(this.state.assistp2pDue).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> :
                                                        <div className='col-8'>
                                                            <div className='card' id='myWalletCard1' style={{ borderRadius: "10px", marginTop: "-3px", marginBottom: "0px", backgroundColor: "rgb(208, 234, 247)", color: "#222c70", border: "0px", cursor: "default" }}>
                                                                <div class="row card-body">
                                                                    <div className='col-7 pl-4'>
                                                                        <p className='card-title' style={{ fontWeight: "500" }}>{t('Borrower Due')}</p>
                                                                        <p style={{ fontWeight: "400", marginTop: "-10px" }}>₹{(this.state.assistp2pDue).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                    </div>
                                                                    <div className='col' style={{ paddingTop: "10px" }}>
                                                                        <button className='btn text-white' style={{ backgroundColor: "#0074bf" }} onClick={this.payDue}>Pay Due</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>}

                                                    <div className='col'></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade show" id="BTnc" role="tabpanel" aria-labelledby="BTnc-tab" style={{ display: "none", fontSize: "14px" }}>
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className="row">
                                                    <div className='col-10' style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                        <FaUserEdit style={{ marginTop: "-6px" }} />&nbsp;<span>T&C Signing Status</span>
                                                        <hr style={{ marginTop: "1px" }} />
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-10'>
                                                        <div className='card pt-2 pl-2 pr-2' style={{ borderRadius: "10px", marginTop: "-3px", marginBottom: "0px", backgroundColor: "rgb(208, 234, 247)", color: "#222c70", border: "0px", cursor: "default" }}>
                                                            <div class="row">
                                                                <div className='col-4'>
                                                                    <p className='card-title' style={{ fontWeight: "500" }}>{t('Borrower ID')}</p>
                                                                </div>
                                                                <div className='col-1'>:</div>
                                                                <div className='col'>
                                                                    <p style={{ fontWeight: "400" }}>{this.state.assistKycBorrId}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row' style={{ marginTop: "-10px" }}>
                                                                <div className='col-4'>
                                                                    <p className='card-title' style={{ fontWeight: "500" }}>{t('Borrower Name')}</p>
                                                                </div>
                                                                <div className='col-1'>:</div>
                                                                <div className='col'>
                                                                    <p style={{ fontWeight: "400" }}>{this.state.kycBorrowername}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row' style={{ paddingLeft: "5px", paddingBottom: "5px" }}>
                                                                {this.state.tncstatus == 0 ?
                                                                    <div className='col'>
                                                                        <div className="row" style={{ fontSize: "16px" }}>
                                                                            <div className="col" style={{ textAlign: "" }}>
                                                                                <p className="text-primary"><FaTimesCircle style={{ color: "grey" }} />&nbsp;Your T&C is not signed.</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row' style={{ fontSize: "14px" }}>
                                                                            <div className="col" style={{ textAlign: "" }}>
                                                                                <p style={{ color: "#222c70", fontWeight: "400", fontSize: "14px" }} onClick={this.retriggerTnCSigning}>
                                                                                    Request for T&C Signing* &nbsp; <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079bf" }}><FaFileSignature />&nbsp;T&C Sign</button>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div> :
                                                                    <span>{
                                                                        this.state.kycstatus == 1 || this.state.kycstatus == 9 && this.state.tncstatus == 1 ?
                                                                            <p className="text-primary"><FaCheckCircle style={{ color: "green" }} />&nbsp;Your T&C is signed.</p>
                                                                            : ""
                                                                    }</span>
                                                                }
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className='col-3'></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* view full details Modal */}
                            <button type="button" id='ViewGroupdetails' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter51">
                                View Full Details Modal
                            </button>
                            <div class="modal fade" id="exampleModalCenter51" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <FaFileAlt style={{ color: "rgba(5,54,82,1)" }} /> <span style={{ color: "rgba(5,54,82,1)", fontWeight: "500", fontSize: "14px", marginBottom: "4px" }}>Signer Status</span>

                                                    <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                        <Table responsive>
                                                            <Thead>
                                                                <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Name')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Signing Status')}</Th>

                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.loanReqStatus.map((lists, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.signername}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>
                                                                            {lists.signedstatus === 0 ? "Pending" : lists.signedstatus === 1 ? "Completed" : ""}
                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="modal-footer">

                                            <button id='disagree' type="button" class="btn text-white btn-sm" style={{ backgroundColor: "#0079BF" }} data-dismiss="modal">Close</button>
                                        </div>



                                    </div>
                                </div>
                            </div>
                            {/* Pdf preview */}
                            <button type="button" id='launchColl1' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg51">Large modal</button>

                            <div class="modal fade bd-example-modal-lg51" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <iframe src="" className="PDFdoc51" type="application/pdf" style={{ overflow: "auto", height: "100vh", width: "100%" }}>

                                        </iframe>
                                        <div className='pt-2' style={{ textAlign: "end", paddingRight: "15px" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* POA */}
                            <button type="button" id="poaModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter29" style={{ display: "none" }}>
                                POA modal
                            </button>
                            <div class="modal fade" data-backdrop="static" id="exampleModalCenter29" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content" id='uploadOvdDocFirst'>
                                        <div class="modal-body" style={{ cursor: "default" }}>
                                            <div className='row'>
                                                <div className='col-10'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Please Provide The Required Documents</p>
                                                    <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
                                                </div>
                                                <div className='col'>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "#0079bf", fontWeight: "500" }}>Step &nbsp;<img src={step1} width="20px" style={{ marginLeft: "1px", marginTop: "-3px" }} /></p>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col">
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Select Document *</p>
                                                    <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.selectOvdDocument}>
                                                        <option defaultValue>Select</option>
                                                        {this.state.ovdMasterList.map((list, index) => {
                                                            return (
                                                                <option key={index} style={{ color: "GrayText" }} value={list.ovdcode}>
                                                                    {list.ovddesc}
                                                                </option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className='row mb-2' id="uploadDocumentField" style={{ display: "none" }}>
                                                <div className='col-12'>
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500", marginBottom: "4px" }}>{`Upload Document(Front/ Back Page)`} *</p>
                                                    <div style={{ border: "1.5px solid black", borderRadius: "5px", paddingTop: "10px", height: "fit-content", marginBottom: "10px" }}>
                                                        <p class="text-center">
                                                            <label for="attachment10">
                                                                <a type="button" role="button" className="btn btn-sm text-white" aria-disabled="false"
                                                                    style={{ backgroundColor: "#222C70" }}><span style={{ fontFamily: "Poppins,sans-serif" }}><FaFileUpload />&nbsp;Choose Document File</span></a>
                                                            </label>
                                                            <input type="file" name="file[]" accept=".pdf,image/*" id="attachment10" onChange={this.addPoaOvdDocu}
                                                                style={{ visibility: "hidden", position: "absolute" }} />
                                                        </p>
                                                        <p id="bulk-files" style={{ textAlign: "center", marginTop: "-10px" }}>
                                                            <span id="filesList">
                                                                <span id="files-names">
                                                                    {this.state.selectedFiles.map((file, index) => (
                                                                        <span key={index}>
                                                                            {this.state.successfulUploads.includes(index) && this.state.showTickIcon && <FaCheckCircle style={{ color: "green" }} />}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div style={{ textAlign: "center" }}>
                                                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", display: "none" }} id="uploadFrontDocu"
                                                            onClick={this.uploadOvdDocu}>
                                                            <FaFileUpload />&nbsp;Upload</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='row OvdPageType' style={{ display: "none" }}>
                                                <div className='col'>
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Page Type</p>
                                                    <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.ovdPageType}>
                                                        <option defaultValue>Select</option>
                                                        <option value="1">Front Page</option>
                                                        <option value="2">Back Page</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <button className='btn btn-sm text-white' id='getFormDetailsNextBtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getFormDetails}>Next</button>
                                                    &nbsp;
                                                    <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-content" id='submitOvdFirst' style={{ display: "none" }}>
                                        <div class="modal-body" style={{ cursor: "default" }}>
                                            <div className='row'>
                                                <div className='col-10'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Please Fill The Form</p>
                                                    <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
                                                </div>
                                                <div className='col'>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "#0079bf", fontWeight: "500" }}>Step &nbsp;<img src={step2} width="20px" style={{ marginLeft: "1px", marginTop: "-3px" }} /></p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                {this.state.formFieldLists != "" ?
                                                    <>
                                                        {this.state.formFieldLists.map((element, index) => this.renderFormElement(element, index)
                                                        )}
                                                    </>

                                                    : ""}
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getAddressFormDetails}>Next</button>
                                                    &nbsp;
                                                    <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} onClick={this.canceSaveFormTxnData}>Back</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-content" id='addressFormFields' style={{ display: "none" }}>
                                        <div class="modal-body" style={{ cursor: "default" }}>
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "#0079bf", fontWeight: "500" }}>Step &nbsp;<img src={step3} width="20px" style={{ marginLeft: "1px", marginTop: "-3px" }} /></p>
                                                </div>
                                                <div className='col'>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="row">
                                                {this.state.addressFormFieldLists !== "" &&
                                                    <>
                                                        {this.state.addressFormFieldLists.map((element, index) => this.renderDemoFormElement(element, index))}
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <div className='row'>
                                                <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                                    <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.savePoaForms}>Save</button>
                                                    &nbsp;
                                                    <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} onClick={this.cancelPoaFormTxnSubmit}>Back</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* VKYC Alert */}
                            <button type="button" id='VKYCAlertModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCentervkyc">
                                VKYC Alert
                            </button>
                            <div class="modal fade" id="exampleModalCentervkyc" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <div className='row'>
                                                <div className='col' style={{}}>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>
                                                        {/* <img src={editRole} width="25px" /> */}
                                                        <FaRegFileVideo />Instructions</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                    <div className='row mb-2'>
                                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                            <p>Follow the instructions regarding camera, mic and location access as they appear on the next screen.</p>
                                                            <p>1. Keep your PAN Card handy for the Video KYC session.</p>
                                                            <p>2. Be in a well-lit surrounding.</p>
                                                            <p>3. Ensure there is no background noise and disturbance.</p>
                                                            <p>4. Verification session will be recorded</p>
                                                        </div>
                                                    </div>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.vkyc}>Proceed</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Dismiss</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* VKYC Alert2 */}
                            <button type="button" id='VKYCAlert2Modal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCentervk1">
                                VKYC Alert2
                            </button>
                            <div class="modal fade" id="exampleModalCentervk1" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <div className='row'>
                                                <div className='col' style={{}}>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>
                                                        {/* <img src={editRole} width="25px" /> */}
                                                        <FaRegFileVideo />Instructions</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                    <div className='row mb-2'>
                                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "15px", fontWeight: "600" }}>
                                                            <p>Video KYC request initiated with Request number : {this.state.Id}, Please wait for the Agent to accept the request. </p>
                                                        </div>
                                                    </div>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.KYCProceed}>Proceed</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* View/Edit Modal */}
                            <button id='viewEditModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2">
                            </button>
                            <div className="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Get Personal Details</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                    <span id='mobilegenerateOTP'>
                                                        <div className='mb-2'>
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile Number</p>
                                                            <input className='form-control' type='number' placeholder='Enter Mobile Number' onChange={this.allMobileno}
                                                                onPaste={this.allMobileno}
                                                                autoComplete='off' style={{ marginTop: "-15px" }} />
                                                            {(this.state.viewEditinvalidMnum) ? <span className='text-danger'>Invalid Mobile number</span> : ''}
                                                        </div>
                                                        <div className='mb-2'>
                                                            <div className='col' style={{ marginLeft: "10px" }}>
                                                                <input type="checkbox" className="form-check-input" onChange={this.profileType} id="profileTypeCheckbox" />
                                                                <p className="form-check-label h6" for="exampleCheck1" style={{ color: "rgba(5,54,82,1)" }}>Do you want to edit previously saved draft ?</p>
                                                            </div>

                                                            {/* <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Profile Type</p>
                                                            <select className='form-select' style={{ marginTop: "-15px" }} onChange={this.profileType}>
                                                                <option defaultValue>Select Profile Type</option>
                                                                <option value="2">Approved</option>
                                                                <option value="1">Unapproved</option>
                                                            </select> */}
                                                        </div>
                                                    </span>
                                                    <div id='showOtpInput' style={{ display: "none" }}>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Enter Mobile OTP</p>
                                                        <input className='form-control' type='number' placeholder='Enter OTP' onChange={this.unapprovedOTp}
                                                            onInput={(e) => {
                                                                e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                            }}
                                                            autoComplete='off' style={{ marginTop: "-10px" }} />
                                                        <div className='mt-2' style={{ textAlign: "end" }}>
                                                            <p id="Viewcountdown" style={{ color: "grey" }}></p>
                                                            <p id='Viewcountdown2' onClick={this.ViewregenerateOTP}
                                                                style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div id='showUnapprovedOtp' style={{ display: "none" }}>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Enter Mobile OTP</p>
                                                        <input className='form-control' type='number' placeholder='Enter OTP' onChange={this.unapprovedOTp}
                                                            onInput={(e) => {
                                                                e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                            }}
                                                            autoComplete='off' style={{ marginTop: "-10px" }} />
                                                        <div className='mt-2' style={{ textAlign: "end" }}>
                                                            <p id="ViewUncountdown" style={{ color: "grey" }}></p>
                                                            <p id='ViewUncountdown2' onClick={this.ViewUnappregenerateOTP2}
                                                                style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <button type="button" class="btn text-white btn-sm" id='submitProfileDetails'
                                                        style={{ backgroundColor: "rgb(136, 189, 72)", display: "none" }} onClick={this.assistedapprovedCall}>Submit</button>

                                                    <button type="button" class="btn text-white btn-sm" id='submitProfDetailsOtp'
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.assistGetProfileDetails}>Submit</button>

                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Cnf Profile Details */}
                            <button id='cnfProfileModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter10">
                                Cnf Modal
                            </button>
                            <div className="modal fade" id="exampleModalCenter10" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Assist Confirm Profile Details</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                    <div>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Enter OTP</p>
                                                        <input className='form-control' type='number' placeholder='Enter OTP' onChange={this.cnfProfileOTP}
                                                            onInput={(e) => {
                                                                e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                            }}
                                                            autoComplete='off' style={{ marginTop: "-10px" }} />

                                                        <div className='mt-2' style={{ textAlign: "end" }}>
                                                            <p id="ConfirmSubmitcountdown" style={{ color: "grey" }}></p>
                                                            <p id='ConfirmSubmitcountdown2' onClick={this.ConfirmSubmitregenerateOTP}
                                                                style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {/* <p id="asscountdown" style={{ color: "grey" }}></p>
                                                    <p id='asscountdown2' onClick={this.assistedSubmitProfileDetails} style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}></p> */}

                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" id='enableCnfSubmit'
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.assistConfirmDetails}>Submit</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* KYC Verification Modal */}
                            <button id='kycVerifyModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter4">
                            </button>
                            <div className="modal fade" id="exampleModalCenter4" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Get Kyc details</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                    <span id='kycmobilegenerateOTP'>
                                                        <div className='mb-2'>
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile Number</p>
                                                            <input className='form-control' type='number' placeholder='Enter Mobile Number' onChange={this.kycMobileno}
                                                                autoComplete='off' style={{ marginTop: "-15px" }} />
                                                            {(this.state.kycinvalidMnum) ? <span className='text-danger'>Invalid Mobile number</span> : ''}
                                                        </div>

                                                    </span>

                                                    {/* <div id='kycshowOtpInput' style={{ display: "none" }}>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Enter OTP</p>
                                                        <input className='form-control' type='number' placeholder='Enter OTP' onChange={this.enterkycOTP}
                                                            autoComplete='off' style={{ marginTop: "-10px" }} />
                                                    </div> */}

                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" id='kycMobileValidation'
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getkycBasiuUserInfo}>Submit</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Accept Offer Modal */}
                            <button id='acceptOfferModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3">
                            </button>
                            <div className="modal fade" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content" id='theModalContent' style={{ marginLeft: "" }}>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Accept Offer</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                    <div className='row'>
                                                        {/* <div style={{ display: "" }} className="col">
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Email OTP</p>
                                                            <input className='form-control' type='number' placeholder='Enter OTP' onChange={this.enterLPOTP}
                                                                autoComplete='off' style={{ marginTop: "-10px" }} />
                                                        </div> */}

                                                        <div style={{ display: "" }} className="col">
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile OTP</p>
                                                            <input className='form-control' type='number' placeholder='Enter OTP' onChange={this.enterLPOTP2}
                                                                onInput={(e) => {
                                                                    e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                                }}
                                                                autoComplete='off' style={{ marginTop: "-10px" }} />
                                                            <div className='mt-2' style={{ textAlign: "end" }}>
                                                                <p id="acOffercountdown" style={{ color: "grey" }}></p>
                                                                <p id='acOffercountdown2' onClick={this.acceptOfferregenerateOTP}
                                                                    style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    {/* <button type="button" class="btn text-white btn-sm" id='LPgetOTPBtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getLPOtp}>Get OTP</button> */}

                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.acceptOfferOTP}>Submit</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* BDue Modal */}
                            <button id='BDueModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter5">
                            </button>
                            <div className="modal fade" id="exampleModalCenter5" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Due Collection</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                    <span id='BDuemobilegenerateOTP'>
                                                        <div className='mb-2'>
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile Number</p>
                                                            <input className='form-control' type='number' placeholder='Enter Mobile Number' onChange={this.BDueMobileno}
                                                                autoComplete='off' style={{ marginTop: "-15px" }} />
                                                            {(this.state.BdueinvalidMnum) ? <span className='text-danger'>Invalid Mobile number</span> : ''}
                                                        </div>
                                                    </span>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    {/* <button type="button" class="btn text-white btn-sm" id='BDuegetOTPBtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getBDueOtp}>Get OTP</button> */}

                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" id='bDueMobileValidation'
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getUserBasicInfo}>Submit</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Loan Disburse Modal */}
                            <button id='disburseModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter6">
                            </button>
                            <div className="modal fade" id="exampleModalCenter6" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content" id='theModalContent' style={{ marginLeft: "" }}>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Loan Disbursement</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                    <div className='row'>
                                                        {/* <div style={{ display: "" }} className="col-6">
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Email OTP</p>
                                                            <input className='form-control' type='number' placeholder='Enter OTP' onChange={this.emailOtpDisp}
                                                                autoComplete='off' style={{ marginTop: "-10px" }} />
                                                        </div> */}

                                                        <div style={{ display: "" }} className="col">
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile OTP</p>
                                                            <input className='form-control' type='number' placeholder='Enter OTP' onChange={this.mobileOtpDisp}
                                                                onInput={(e) => {
                                                                    e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                                }}
                                                                autoComplete='off' style={{ marginTop: "-10px" }} />
                                                        </div>
                                                    </div>
                                                    <div className='row mt-2'>
                                                        <div className='col' style={{ textAlign: "end" }}>
                                                            <p id="countdown" style={{ color: "grey" }}></p>
                                                            <p id='countdown2' onClick={this.regenerateOTP} style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }}></p>
                                                        </div>
                                                    </div>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' id='loanAcceptInputButtons' style={{ textAlign: "end" }}>
                                                    {/* <button type="button" class="btn text-white btn-sm" id='LPgetOTPBtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getLPOtp}>Get OTP</button> */}

                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.initialDisbursement}>Submit</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* BTnc Modal */}
                            <button id='BTncModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter7">
                            </button>
                            <div className="modal fade" id="exampleModalCenter7" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle7" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />T&C Signing Status</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                    <span id='BDuemobilegenerateOTP'>
                                                        <div className='mb-2'>
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile Number</p>
                                                            <input className='form-control' type='number' placeholder='Enter Mobile Number' onChange={this.BTnCMobileno}
                                                                autoComplete='off' style={{ marginTop: "-15px" }} />
                                                            {(this.state.BTncinvalidMnum) ? <span className='text-danger'>Invalid Mobile number</span> : ''}
                                                        </div>
                                                    </span>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" id='bTncMobileValidation'
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getBorTnCBasicInfo}>Submit</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Accept Funding Modal */}
                            <button id='loanAcceptModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter16">
                            </button>
                            <div className="modal fade" id="exampleModalCenter16" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content" id='theModalContent' style={{ marginLeft: "" }}>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Loan acceptance request raised successfully. Please enter OTP:</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                    <div className='row'>
                                                        <div style={{ display: "" }} className="col">
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile OTP</p>
                                                            <input className='form-control' type='number' placeholder='Enter OTP' id='loanAcceptInput' onChange={this.loanAcceptanceOtp}
                                                                onInput={(e) => {
                                                                    e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                                }}
                                                                autoComplete='off' style={{ marginTop: "-10px" }} />
                                                        </div>
                                                    </div>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' id='loanAcceptInputButtons' style={{ textAlign: "end" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.verifyLoan}>Submit</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} >Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*loan Agreement Pdf preview */}
                            <button type="button" id='loanAgreementPDFModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>

                            <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <iframe src="" className="PDFdoc" type="application/pdf" style={{ overflow: "auto", height: "100vh", width: "100%" }}>

                                        </iframe>
                                        <div className='pt-2' style={{ textAlign: "end", paddingRight: "15px" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(0, 121, 191)" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* OVD Documents */}
                            {/* OVD UI */}
                            {/* <button type="button" id="OvdModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenterO2" style={{ display: "none" }}>
                                OVD modal
                            </button>
                            <div class="modal fade" data-backdrop="static" id="exampleModalCenterO2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content" id='uploadOvdDocID'>
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLongTitle" style={{ color: "#00264d" }}>Please provide the required documents</h5>
                                        </div>
                                        <div class="modal-body">
                                            <div className="row mb-3" >
                                                <div className="col">
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Select Document</p>
                                                    <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.selectOvdDocument}>
                                                        <option defaultValue>Select</option>
                                                        {this.state.ovdMasterList.map((list, index) => {
                                                            return (
                                                                <option key={index} style={{ color: "GrayText" }} value={list.ovdcode}>
                                                                    {list.ovddesc}
                                                                </option>
                                                            )
                                                        })}

                                                    </select>
                                                </div>
                                            </div>
                                            <div className='row mb-3'>
                                                <div className='col'>
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500", marginBottom: "10px" }}>Mobile Number</p>
                                                    <input className="form-control" type='number' placeholder="Enter mobile number" style={{ marginTop: "-5px" }} onChange={this.addOvdMnumber} />
                                                </div>
                                            </div>
                                            <div className='row mb-3'>
                                                <div className='col'>
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500", marginBottom: "10px" }}>Upload Document</p>
                                                    <input type='file' style={{ marginTop: "-5px" }} accept=".pdf,image/*" id="attachment" onChange={this.addOvdDocu} />
                                                </div>
                                            </div>
                                            <div className='row OvdPageType' style={{ display: "none" }}>
                                                <div className='col'>
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Page Type</p>
                                                    <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.ovdPageType}>
                                                        <option defaultValue>Select</option>
                                                        <option value="1">Front Page</option>
                                                        <option value="2">Back Page</option>
                                                    </select>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="modal-footer">
                                            <div className='row'>
                                                <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                                    <button className='btn btn-sm text-white uploadOvdDocuSbtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.uploadOvdDocu}>Submit</button>
                                                    &nbsp;
                                                    <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="modal-content" id='submitOvdID' style={{ display: "none" }}>
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLongTitle" style={{ color: "#00264d" }}>Submit OVD</h5>
                                        </div>
                                        <div class="modal-body">
                                            <div className="row">
                                                {this.state.formFieldLists != "" ?
                                                    <>
                                                        {this.state.formFieldLists.map((element, index) => this.renderFormElement(element, index))}
                                                    </>
                                                    : ""}
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <div className='row'>
                                                <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                                    <button className='btn btn-sm text-white submitOvdDocuSbtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setFormTxndata}>Submit</button>
                                                    &nbsp;
                                                    <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} onClick={this.cancelSubmitOVD}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            {/* delete OVD UI */}
                            <button type="button" id="deleteUpldOvdmodal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenterO3" style={{ display: "none" }}>
                                delete OVD modal
                            </button>
                            <div class="modal fade" data-backdrop="static" id="exampleModalCenterO3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLongTitle" style={{ color: "#00264d" }}>Delete Uploaded OVD</h5>
                                        </div>
                                        <div class="modal-body">
                                            {/* <div className="row mb-3" >
                                            <div className="col">
                                                <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Select OVD Type</p>
                                                <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.ovdIdType}>
                                                    <option defaultValue>Select</option>
                                                    <option value="1">DL</option>
                                                    <option value="2">VOTID</option>
                                                </select>
                                            </div>
                                        </div> */}

                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Page Type</p>
                                                    <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.ovdDelPageType}>
                                                        <option defaultValue>Select</option>
                                                        {this.state.OvdDataList.map((pageType, index) => {
                                                            return (
                                                                <option key={index} value={pageType.pagetype}>{pageType.pagetype == "1" ? "Front Page" : "Back Page"}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="modal-footer">
                                            <div className='row'>
                                                <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                                    <button className='btn btn-sm text-white delUpldSubmBtn' data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.deleteUpldedOvd}>Submit</button>
                                                    &nbsp;
                                                    <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* view OVD UI */}
                            <button type="button" id="viewUpldOvdmodal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenterO4" style={{ display: "none" }}>
                                view OVD modal
                            </button>
                            <div class="modal fade" data-backdrop="static" id="exampleModalCenterO4" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLongTitle" style={{ color: "#00264d" }}>View OVD Image</h5>
                                        </div>
                                        <div class="modal-body">

                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Page Type</p>
                                                    <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.viewOVDPageType}>
                                                        <option defaultValue>Select</option>
                                                        {this.state.viewOvdDataList.map((pageType, index) => {
                                                            return (
                                                                <option key={index} value={pageType.pagetype}>{pageType.pagetype == "1" ? "Front Page" : "Back Page"}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="modal-footer">
                                            <div className='row'>
                                                <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                                    <button className='btn btn-sm text-white delUpldSubmBtn' data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.viewGetuploadedovdimage}>Submit</button>
                                                    &nbsp;
                                                    <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* OVD image view*/}
                            <button type="button" id='launchCollOVD' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg2">Large modal</button>

                            <div class="modal fade bd-example-modal-lg2" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <div id='image-container' style={{ textAlign: "center" }}></div>

                                        {/* <iframe src="" className="PDFdoc" type="image" style={{ overflow: "auto", height: "100vh", width: "100%" }}>

                                    </iframe> */}
                                        <div className='pt-2' style={{ textAlign: "end", paddingRight: "15px" }}>
                                            <button type="button" class="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.downloadUploadedovdimage}>Download</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onClick={this.clearOVDImage}>Close</button>
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

                            {/* Digilocker */}
                            <button id='digiAlertModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2DG">
                            </button>
                            <div className="modal fade" id="exampleModalCenter2DG" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>

                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                        Make sure that Aadhar and PAN are linked to your Digilocker account.
                                                    </p>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.routeDigilockerPage}>Agree</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "#0079bf" }}>Cancel</button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DigiLocker Modal */}
                            <button type="button" id='digiModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                                launch digiModal
                            </button>
                            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div class="modal-dialog modal-dialog-centered" role="document" style={{ width: "300px" }}>
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Registration with DigiLocker</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                    <div>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile Number</p>
                                                        <input className='form-control' type='number' placeholder='Enter Mobile Number' onChange={this.mobileno}
                                                            autoComplete='off' style={{ marginTop: "-10px" }} />
                                                    </div>
                                                    <form name="DigiForm" id="DigiForm" action={digiURL} method="GET" >
                                                        <input type="radio" className="form-check-input" name="u_type" value={this.state.digiUtype} style={{ display: "none" }} defaultChecked />
                                                        <input type="number" className="input" name="mobile_no" id="mobile_no" placeholder="Enter Mobile Number" style={{ display: "none" }} value={this.state.mobilenumber} />
                                                        <input type="submit" name="submit" value="Verify with DigiLocker *" id="onbdigiSubmit" className="btn pl-3 pr-3 pb-2 ml-3 mt-4 mb-2" style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", display: "none" }} />
                                                    </form>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} id="onBoardDigi">Submit</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default withTranslation()(CustomerSupport)
