import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import $ from 'jquery';
import EvaluatorSidebar from '../../SidebarFiles/EvaluatorSidebar';//updated
import { DIGIURL } from '../assets/baseURL';
import { confirmAlert } from "react-confirm-alert";
import { withTranslation } from 'react-i18next';
import {
    FaCheckCircle, FaAngleLeft, FaEdit, FaFileSignature,
    FaTimesCircle, FaFolderPlus, FaRegTrashAlt, FaMapMarkerAlt, FaHouseUser,
    FaUserEdit, FaRegFileVideo, FaRegSave, FaUserLock, FaFileDownload, FaFileUpload, FaEye
} from "react-icons/fa";
import dashboardIcon from '../assets/icon_dashboard.png';
import profile2 from '../assets/img1.png';
import Loader from '../Loader/Loader';
import EvalBankDetails from './EditEvaBankDetails';
// import EvalAddressDetails from './EditEvaAddressDetails';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import batch from '../assets/batch.png';
import * as BsIcons from "react-icons/bs";
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css';
import openIt from '../assets/AdminImg/openit.png';
import resetPw from '../assets/pwexpired.png';
import { talukFlagED } from '../assets/Constant'
import { TnC } from '../assets/Constant';
import step1 from '../assets/number-one.png';
import step2 from '../assets/number-2.png';
import step3 from '../assets/number-3.png';
import step4 from '../assets/number-four.png';
import Tooltip from "@material-ui/core/Tooltip";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { Card, Container, Row, Col } from 'react-bootstrap';
const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

const randomId = () =>
    Math.random()
        .toString(32)
        .slice(2)

var status;
var mpin;
var MPINStatusotp;
var MPINFlag;
var documentAdded = false;

var Interval;
var Interval2;

var dataList = [];
var poaDataList = [];
var extractedData;
var formDatas;
var formID;

var txnStatus;
var authMode;
var pageTypePOA;
var poaDocumentFlag = false;
export class EvaluatorDetails extends Component {
    constructor() {
        super();
        this.state = {
            isAuthenticated: false,
            documentNumber: "",
            pdocsNum: "",

            memmid: "",
            addressDetails: [],
            addressDetails1: [],


            paddress1: "House/floor no, Appartment",
            paddress2: "street",
            landmark: "",
            pdistrict: '',
            pcity: '',
            pstate1: 'Choose state',
            ppincode: 'Enter Pin',
            ptaluk: "",

            address1: '',
            address2: '',
            address3: '',
            district: '',
            city: '',
            state: '',
            pincode: '',
            taluk: '',

            paccounttype: "",
            paccountifsc: "",
            paccountno: "",
            paccountvpa: "",
            pbranch: "",

            pgender: "",
            pmobile: "",
            pdob: "",
            pname: "",
            pemail: "",

            getattributes: [],
            Id: "",
            Id2: "",

            dynamicvpa: "",
            vpa: "",
            ifsccode: "",

            UploadedID: "",
            uploadedImage: "",
            aadharImage: "",
            capturedImage: "",
            defaultImage: "",
            aadharID: "",
            image: false,
            photo: "",
            orderToDisplay: 1,
            isImageFound: false,

            showLoader: false,

            isPanVerified: "",
            isAddressVerified: sessionStorage.getItem('SisAddressVerified'),
            isAccountVerified: sessionStorage.getItem('SisAccountVerified'),
            isVkycVerified: sessionStorage.getItem('SisVkycVerified'),
            isTnCSigned: sessionStorage.getItem('SistnCVerified'),

            VKYCLivImg: "",
            pdocsID: "",

            pdocsID: "",
            TnCdocumentFlag: false,
            setMPINFlag: false,
            MPINFlag: sessionStorage.getItem("SisTxnPinEnabled"),
            enterMPIN: "",
            confirmMPIN: "",
            MPINotp: "",
            MPINref: "",

            txnStatus: "",
            MPINStatusotp: "",
            MPINStatusref: "",

            invalidMpin: false,
            invalidcnfMpin: false,
            isPasswordShown: false,
            isPasswordShown2: false,

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

            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",
            ovdList: [],
            orgtableData: [],

            ovdCategoryFlag: false,
            formFieldLists: [],
            formCategory: "",
            formType: "",
            errorMessages: {},
            resMsg: "",

            authMode: "",
            checkStatus: "",

            //Taluk Flag
            talukFlag: talukFlagED,

            addressFormFieldLists: [

            ],
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
            permNewAddressStatus: "",
            presentAddressStatus: "",

            selectedFiles: [],
            successfulUploads: [],
            selectedFile: null,
            showTickIcon: false,
            showTickIcon2: false,
            ovdFlagTrue: false,

            viewImageLists: [],
            talukName: "",
            talukApiCalled: false,
            talukLists: [],
            talukCode: ""
        }
        this.documentNumber = this.documentNumber.bind(this);
        this.getKYC = this.getKYC.bind(this);
        this.getBankDetails = this.getBankDetails.bind(this);
        this.getDocumentDetails = this.getDocumentDetails.bind(this);
        this.selectRef1 = React.createRef();

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
            ovdList: slice
        })
    }
    documentNumber(event) {
        this.setState({ documentNumber: event.target.value })
    }
    handleCallback = (childData) => {
        this.setState({ isAddressVerified: childData })
        console.log(this.state.isAddressVerified);
    }
    handleCallback2 = (childData) => {
        this.setState({ isAccountVerified: childData })
        console.log(this.state.isAccountVerified);
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
                memmid: parseInt(sessionStorage.getItem('memmID')),
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ pname: resdata.msgdata.name })
                    this.setState({ pgender: resdata.msgdata.gender })
                    this.setState({ pdob: resdata.msgdata.dob })
                    this.setState({ pemail: resdata.msgdata.email })
                    this.setState({ pmobile: resdata.msgdata.mobile })
                    this.setState({ getattributes: resdata.msgdata.attributes })
                    this.setState({ dynamicvpa: resdata.msgdata.dynamicvpa })
                    this.setState({ vpa: resdata.msgdata.vpa })
                    this.setState({ ifsccode: resdata.msgdata.ifsccode })

                    sessionStorage.setItem("name", this.state.pname);
                    sessionStorage.setItem("E_Mobile", this.state.pmobile);
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
    }

    getAddressDetails = (event) => {
        fetch(BASEURL + '/usrmgmt/getaddressdetails', {
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
                    var responseAddress = resdata.msgdata;

                    const length = responseAddress.length;
                    console.log(length)
                    var pAddress = "";
                    var cAddress = "";
                    console.log(responseAddress)
                    responseAddress.forEach(element => {
                        console.log(element);
                        if (length == 1) {
                            console.log(element)
                            if (element.addresstype == 1) {
                                // this.setState({ addressDetails: resdata.msgdata[0] })
                                this.setState({
                                    paddress1: element.address1,
                                    paddress2: element.address2,
                                    landmark: element.address3,
                                    pdistrict: element.district,
                                    pcity: element.city,
                                    pstate1: element.state,
                                    ppincode: element.pincode,
                                    ptaluk: element.taluk,
                                    permanentAddressStatus: element.status,
                                    permNewAddressStatus: element.newaddrstatus
                                })
                                // setting "" in case of permanent address is not present
                                this.setState({ address1: "" })
                                this.setState({ address2: "" })
                                this.setState({ address3: "" })
                                this.setState({ district: "" })
                                this.setState({ city: "" })
                                this.setState({ state: "" })
                                this.setState({ pincode: "" })
                                this.setState({ taluk: "" })

                            } else if (element.addresstype == 2) {
                                // setting "" in case of present address is not present

                                this.setState({ paddress1: "" })
                                this.setState({ paddress2: "" })
                                this.setState({ landmark: "" })
                                this.setState({ pdistrict: "" })
                                this.setState({ pcity: "" })
                                this.setState({ pstate1: "" })
                                this.setState({ ppincode: "" })
                                this.setState({ ptaluk: "" })

                                // this.setState({ addressDetails1: resdata.msgdata[1] })
                                this.setState({
                                    address1: element.address1,
                                    address2: element.address2,
                                    address3: element.address3,
                                    district: element.district,
                                    city: element.city,
                                    state: element.state,
                                    pincode: element.pincode,
                                    taluk: element.taluk,
                                    presentAddressStatus: element.status
                                })
                            }
                        } else {
                            if (element.addresstype == 1) {
                                // this.setState({ addressDetails: resdata.msgdata[0] })
                                this.setState({
                                    paddress1: element.address1,
                                    paddress2: element.address2,
                                    landmark: element.address3,
                                    pdistrict: element.district,
                                    pcity: element.city,
                                    pstate1: element.state,
                                    ppincode: element.pincode,
                                    ptaluk: element.taluk,
                                    permanentAddressStatus: element.status,
                                    permNewAddressStatus: element.newaddrstatus
                                })

                                // setting "" in case of permanent address is not present
                                // this.setState({ address1: "" })
                                // this.setState({ address2: "" })
                                // this.setState({address3:"" })
                                // this.setState({ district: ""  })
                                // this.setState({ city: ""  })
                                // this.setState({ state: ""  })
                                // this.setState({ pincode: ""  })
                            } else if (element.addresstype == 2) {
                                // setting "" in case of present address is not present

                                // this.setState({ paddress1:"" })
                                // this.setState({ paddress2: "" })
                                // this.setState({landmark:""})
                                // this.setState({ pdistrict: ""})
                                // this.setState({ pcity: "" })
                                // this.setState({ pstate1: "" })
                                // this.setState({ ppincode: "" })

                                // this.setState({ addressDetails1: resdata.msgdata[1] })
                                this.setState({
                                    address1: element.address1,
                                    address2: element.address2,
                                    address3: element.address3,
                                    district: element.district,
                                    city: element.city,
                                    state: element.state,
                                    pincode: element.pincode,
                                    taluk: element.taluk,
                                    presentAddressStatus: element.status
                                })
                            }
                        }
                    });
                    console.log("pAddress");
                    console.log(pAddress);
                    console.log("cAddress");
                    console.log(cAddress);

                    console.log(this.state.paddress1)
                }
                // else {
                //     alert("Issue: " + resdata.message);
                // }
            })
    }
    preKyC = () => {
        var addressVerified = sessionStorage.getItem('isAddressVerified')
        console.log(addressVerified)
        if (addressVerified == 0) {
            confirmAlert({
                message: "Please update the Profile Photo and Address details before going for Digilocker verification.",
                buttons: [
                    {
                        label: "Submit",
                        onClick: () => {
                            this.getKYC();
                        }
                    },
                    {
                        label: "Cancel",
                        onClick: () => {
                            window.location.reload()
                        }
                    }
                ]
            })
        } else if (addressVerified == 1) {
            this.getKYC();
        }
    }
    alertKYC = () => {
        $("#VKYCAlertModal").click();
    }
    getKYC(event) {
        // if (this.state.aadharImage == "" || null) {
        //     confirmAlert({
        //         message: "Please add your profile picture and account details.",
        //         buttons: [
        //             {
        //                 label: "Okay",
        //                 onClick: () => {

        //                 }
        //             }
        //         ],
        //         closeOnClickOutside: false,
        //     })
        // } else {        }
        fetch(BASEURL + '/vf/createvkycrequest', {
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
                    this.setState({ Id: resdata.msgdata.vkycreqno });
                    // //this.setState.vkycreqno = resdata.msgdata.vkycreqno;
                    // //this.state.vkycreqno = resdata.msgdata.vkycreqno;
                    // sessionStorage.getItem('isAuthenticated',resdata.data.isAuthenticated)
                    console.log(this.state.Id);
                    $("#VKYCAlert2Modal").click();

                    alert(resdata.message);
                    Interval = setInterval(() => { this.getKYCStatus() }, 3000);
                    // this.getKYCStatus();

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

    // videoKycUpdateStatus = (event) => {
    //     var idbSupported = false;

    //     console.log("called");
    //     if (!indexedDB) {
    //         console.log("IndexedDB could not be found in this browser.");
    //     } else {
    //         const request = indexedDB.open("test", 1);
    //         idbSupported = true;
    //         if (idbSupported) {
    //             //var openRequest = indexedDB.open("test", 1);
    //             request.onupgradeneeded = function (e) {
    //                 console.log("Upgrading...");
    //                 var thisDB = e.target.result;
    //                 if (!thisDB.objectStoreNames.contains("messages")) {
    //                     thisDB.createObjectStore(
    //                         "messages",
    //                         { keyPath: "id", autoIncrement: true }
    //                     );
    //                 }
    //             };
    //         }

    //         request.onerror = function (event) {
    //             console.error("An error occured with IndexedDB");
    //             console.error(event);
    //         };

    //         request.onsuccess = function () {
    //             console.log("Databse opened successfully");
    //             const db = request.result;

    //             //1
    //             const transaction = db.transaction("messages");
    //             console.log("trans");


    //             //2
    //             const store = transaction.objectStore("messages");
    //             console.log("object store");


    //             //4
    //             const data = store.openCursor();
    //             console.log("cursor opened");


    //             //5
    //             data.onerror = function (event) {
    //                 console.err("error fetching data");
    //             };
    //             data.onsuccess = function (event) {
    //                 console.log("On Success");

    //                 let cursor = event.target.result;
    //                 if (cursor) {
    //                     let key = cursor.primaryKey;
    //                     let value = cursor.value;
    //                     console.log("received" + cursor.primaryKey + " " + cursor.value);

    //                     if (value.type === "VKYCREQ") {
    //                         clearInterval();
    //                         console.log("received");
    //                         confirmAlert({
    //                             message: "Agent has joined the call, do you wish to proceed ?",
    //                             buttons: [
    //                                 {
    //                                     label: "Ok",
    //                                     onClick: () => {
    //                                         sessionStorage.setItem(
    //                                             "kycToken",
    //                                             value.body.accessToken
    //                                         );
    //                                         sessionStorage.setItem(
    //                                             "sessionId",
    //                                             value.body.sessionId
    //                                         );
    //                                         sessionStorage.setItem(
    //                                             "participantId",
    //                                             value.body.participantId
    //                                         );
    //                                         console.log("Clear DB called");
    //                                         let request = indexedDB.open("test", 1);

    //                                         request.onerror = function (event) {
    //                                             console.error("An error occurred with IndexedDB");
    //                                             console.error(event);
    //                                         };
    //                                         request.onsuccess = function () {
    //                                             let dbs = request.result;
    //                                             // open a read/write db transaction, ready for clearing the data        
    //                                             var transaction = dbs.transaction(["messages"], "readwrite");
    //                                             // report on the success of the transaction completing, when everything is done        
    //                                             transaction.oncomplete = function (event) {
    //                                                 console.log("Transaction complete");
    //                                             };
    //                                             transaction.onerror = function (event) {
    //                                                 console.log("Transaction error");
    //                                             };
    //                                             // create an object store on the transaction        
    //                                             var objectStore = transaction.objectStore("messages");
    //                                             // Make a request to clear all the data out of the object store        
    //                                             var objectStoreRequest = objectStore.clear();
    //                                             objectStoreRequest.onsuccess = function (event) {
    //                                                 // report the success of our request          
    //                                                 console.log("cleared");
    //                                             };
    //                                         };
    //                                         window.location = "/customerJoin";
    //                                         //   var req = indexedDB.deleteDatabase("test");
    //                                         //   req.onsuccess = function() {
    //                                         //     console.log("Deleted database successfully");
    //                                         //   };
    //                                         //   req.onerror = function() {
    //                                         //     console.log("Couldn't delete database");
    //                                         //   };
    //                                         //   req.onblocked = function() {
    //                                         //     console.log(
    //                                         //       "Couldn't delete database due to the operation being blocked"
    //                                         //     );
    //                                         //   };
    //                                     },
    //                                 },
    //                                 {
    //                                     label: "Cancel",
    //                                     onClick: () => {
    //                                         console.log("Clear DB called");
    //                                         let request = indexedDB.open("test", 1);

    //                                         request.onerror = function (event) {
    //                                             console.error("An error occurred with IndexedDB");
    //                                             console.error(event);
    //                                         };
    //                                         request.onsuccess = function () {
    //                                             let dbs = request.result;
    //                                             // open a read/write db transaction, ready for clearing the data        
    //                                             var transaction = dbs.transaction(["messages"], "readwrite");
    //                                             // report on the success of the transaction completing, when everything is done        
    //                                             transaction.oncomplete = function (event) {
    //                                                 console.log("Transaction complete");
    //                                             };
    //                                             transaction.onerror = function (event) {
    //                                                 console.log("Transaction error");
    //                                             };
    //                                             // create an object store on the transaction        
    //                                             var objectStore = transaction.objectStore("messages");
    //                                             // Make a request to clear all the data out of the object store        
    //                                             var objectStoreRequest = objectStore.clear();
    //                                             objectStoreRequest.onsuccess = function (event) {
    //                                                 // report the success of our request          
    //                                                 console.log("cleared");
    //                                             };
    //                                         };
    //                                     },
    //                                 },
    //                             ],
    //                         });
    //                     } else {
    //                         console.log("received" + value.type);
    //                     }
    //                     //   if (cursor.value.body === "kyc is success") {
    //                     //     console.log("success");
    //                     //     sessionStorage.setItem("isKycStatus", 1);
    //                     //     //console.log(cursor.value);
    //                     //   } else {
    //                     //     sessionStorage.setItem("isKycStatus", 0);
    //                     //   }
    //                     cursor.continue();
    //                 } else {
    //                     console.log("not received");
    //                 }
    //                 console.log("nT ended")
    //             };


    //             //6
    //             transaction.oncomplete = function () {
    //                 db.close();
    //                 console.log("DB closed")
    //             }
    //             console.log("on success ended")

    //         }
    //         console.log("if condtn ended")

    //     }
    //     console.log("ended")
    // }

    getKYCStatus(event) {
        // console.log("timer");

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
                    //this.setState.vkycreqno = resdata.msgdata.vkycreqno;
                    //this.state.vkycreqno = resdata.msgdata.vkycreqno;
                    if (resdata.message != "VKYC session details") {
                        // this.interval = setInterval(() => this.getKYCStatus(), 10000);
                        // setInterval(this.getKYCStatus(), 10000);
                        //setTimeout(() => { this.getKYCStatus() }, 20000);
                    } else if (resdata.message == "VKYC session details") {
                        clearInterval(Interval);
                        confirmAlert({
                            message: "Agent has accepted the request, please proceed.",
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        sessionStorage.setItem("kycToken", this.state.Id2.accessToken);
                                        sessionStorage.setItem("sessionId", this.state.Id2.sessionId);
                                        sessionStorage.setItem("participantId", this.state.Id2.participantId);
                                        window.location = "/customerJoin";
                                        this.getUserStatusflag()
                                    }
                                }
                            ],
                            closeOnClickOutside: false,
                        })
                        // alert(resdata.message)
                    }
                    // else if (resdata.message == "VKYC session details") {
                    //     clearInterval(this.getKYCStatus());
                    // }
                    //alert(resdata.message + " " + "resdata.memmid")


                } else {
                    //alert("Issue: " + resdata.message);

                }
            })
    }

    getBankDetails(event) {
        fetch(BASEURL + '/usrmgmt/getaccountdetails', {
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
                    if (resdata.msgdata.accounttype == 1) {
                        this.setState({ paccounttype: "Savings Account" })
                    }
                    else if (resdata.msgdata.accounttype == 2) {
                        this.setState({ paccounttype: "Current Account" })
                    }
                    this.setState({ paccountno: resdata.msgdata.accountno })
                    this.setState({ paccountvpa: resdata.msgdata.accountvpa })
                    this.setState({ paccountifsc: resdata.msgdata.accountifsc })
                    this.setState({ pbranch: resdata.msgdata.branch })

                    sessionStorage.setItem('evlLaccno', resdata.msgdata.accountno)

                }
                // else {
                //     alert("Issue: " + resdata.message);
                // }
            })
    }

    getDocumentDetails(event) {
        fetch(BASEURL + '/usrmgmt/getdocumentdetails', {
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
                    this.setState({ pdocsNum: resdata.msgdata[0].docno })


                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    componentDidMount() {
        this.onSelectOption();
        console.log(sessionStorage.getItem("E_Mobile"));
        console.log(sessionStorage.getItem('memmID'));
        this.getPersonalDetails();
        this.getAddressDetails();
        // this.getBankDetails();
        this.getDocumentDetails();

        window.addEventListener('storage', this.handleStorageEvent);
        var imageFlag = sessionStorage.getItem('imageFlag');
        var boolValue = (imageFlag === "true");
        console.log(boolValue);

        if (sessionStorage.getItem('photoapiflag') === "true") {
            //this.getphotoDetails()
        }
        // Checking if the image is stored and displaying
        const storedImage = sessionStorage.getItem('aadharImage');
        if (storedImage) {
            const txt = storedImage
            const base64 = btoa(txt)
            console.log(base64)
            this.setState({
                image: boolValue,
                aadharImage: base64,
            }, () => { });
        }
        $("#digisubmit2").click(function () {
            $("#digiSubmit").click();
        })

        $("#EbtnAddressdetails").click(function () {
            $("#Eaddressdetails0").hide();
            $("#Eaddressdetails1").hide();
            $("#Eaddressdetails2").hide();
            $("#Eaddressdetails3").hide();
            $("#Eaddressdetails4").hide();
            $("#Eaddressdetails5").hide();
            $("#Eaddressdetails6").hide();
            $("#EbtnAddressdetails").hide();

            $("#Eaddressdetails7").show();
        })
        $("#EaddressdetailBtn").click(function () {
            $("#Eaddressdetails0").show();
            $("#Eaddressdetails1").show();
            $("#Eaddressdetails2").show();
            $("#Eaddressdetails3").show();
            $("#Eaddressdetails4").show();
            $("#Eaddressdetails5").show();
            $("#Eaddressdetails6").show();
            $("#EbtnAddressdetails").show();

            $("#Eaddressdetails7").hide();
        })

        $("#EbtnBankdetails").click(function () {
            $("#Ebankdetails0").hide();
            $("#Ebankdetails1").hide();
            $("#Ebankdetails2").hide();
            $("#Ebankdetails3").hide();
            $("#EbtnBankdetails").hide();

            $("#Ebankdetails4").show();

        })
        $("#EbankdetailBtn").click(function () {
            $("#Ebankdetails0").show();
            $("#Ebankdetails1").show();
            $("#Ebankdetails2").show();
            $("#Ebankdetails3").show();
            $("#EbtnBankdetails").show();

            $("#Ebankdetails4").hide();

        })
        this.getUserStatusflag2();
        this.getPdfDocumentDetails();
        if (sessionStorage.getItem("SisTxnPinEnabled") != "" || undefined) {
            this.setState({ setMPINFlag: true })
            MPINFlag = sessionStorage.getItem("SisTxnPinEnabled")
        }
        status = sessionStorage.getItem("SisTxnPinEnabled");
        this.setState({ checkStatus: status })
        console.log(status);

        $("#setTxnSubmitBtn").prop('disabled', true);
        $("#getOtpforMpin").prop('disabled', true);

        $('.uploadOvdDocuSbtn').prop('disabled', true)
        $('#uploadFrontDocu').hide()
        $('#getFormDetailsNextBtn').prop('disabled', true);
        $("#submitFirstForm1").prop('disabled', true);
        $("#submitFirstForm").prop('disabled', true);
        //$("#secondFormBtn").prop('disabled', true);
    }
    getUserStatusflag2 = (event) => {
        fetch(BASEURL + '/usrmgmt/getuserstatusflags', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
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

                    sessionStorage.setItem("SisTxnPinEnabled", resdata.msgdata['2fauthenabled'])
                    MPINFlag = sessionStorage.getItem("SisTxnPinEnabled");
                    status = sessionStorage.getItem("SisTxnPinEnabled");
                    this.setState({ checkStatus: status })

                    if (status === "1") {
                        $("#setMpinBtn2").show();
                        txnStatus = "1";
                        authMode = "1";
                    } else if (status == "2") {
                        $("#setMpinBtn2").show();

                        txnStatus = "1";
                        authMode = "2";
                    } else {
                        $("#setMpinBtn2").hide();
                        console.log(txnStatus)
                        txnStatus = "0";
                        authMode = "0";
                    }
                }
                else {
                    alert(resdata.message);
                }
            })
    }
    getUserStatusflag = (event) => {
        fetch(BASEURL + '/usrmgmt/getuserstatusflags', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata);
                    this.setState({ isVkycVerified: resdata.msgdata.isVkycVerified })

                    var isTnCsigned = resdata.msgdata.isTnCSigned;
                    console.log(isTnCsigned)
                    if (isTnCsigned === 1) {
                        clearInterval(Interval2);
                        $("#passwordExpModal").click();
                    } else if (isTnCsigned === 0) {
                        console.log("carry on")
                    }

                }
                else {
                    alert(resdata.message);
                }
            })
    }

    onSelectOption() {
        $('select').change(function () {
            if ($('select option:selected')) {
                $('.form').show();
            }
            else {
                $('.form').hide();
            }
        });
    }

    // uploadFile(event) {

    //     const formData = new FormData()
    //     var fileField = document.querySelector("input[type='file']");
    //     var body = JSON.stringify({
    //         doc_type: 2,
    //         doc_format: 2,
    //         doc_page: 1,
    //         doc_number: this.state.documentNumber
    //     })
    //     //formData.append('myFile', files)
    //     formData.append("file", fileField.files[0]);
    //     formData.append("fileInfo", body);

    //     fetch(BASEURL + '/usrmgmt/uploaddocument', {

    //         method: 'post',
    //         headers: {
    //             'Accept': 'application/json',

    //             'Authorization': "Bearer " + sessionStorage.getItem('token')
    //         },
    //         body: formData
    //     })
    //         .then(response => response.json())
    //         .then((resdata) => {

    //             console.log(resdata);
    //             if (resdata.status === 'SUCCESS') {
    //                 alert(resdata.message);
    //                 console.log(resdata);
    //             } else {
    //                 alert("Issue: " + resdata.message);
    //             }
    //         })
    //         .catch(error => console.log(error)
    //         );
    // }
    retriggerTnCSigning = () => {
        fetch(BASEURL + '/usrmgmt/retriggertncsigninglink', {
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
                                        Interval2 = setInterval(() => { this.getUserStatusflag() }, 5000);
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
    Logout = () => {
        window.location = "/login";
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    changeType1 = () => {
        sessionStorage.setItem("changeType", "1")
        window.location = "/changeEmailMobile"
    }
    changeType2 = () => {
        sessionStorage.setItem("changeType", "2")
        window.location = "/changeEmailMobile"
    }
    getPdfDocumentDetails = (event) => {
        fetch(BASEURL + '/usrmgmt/getdocumentdetails', {
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
                    var responseData = resdata.msgdata;
                    console.log(responseData);

                    var userType;
                    var docuType;
                    var addDocuId;
                    var addDocLocation;
                    var addDocName;

                    responseData.find(ele => {
                        userType = ele.utype;
                        docuType = ele.doctype;
                        addDocuId = ele.id;
                        addDocLocation = ele.doclocation;
                        addDocName = ele.docname;
                        console.log(userType, docuType)

                        if (userType == 5 && docuType == 7) {
                            console.log("Evaluator")

                            console.log(userType, docuType)
                            console.log(addDocuId, addDocLocation, addDocName)

                            this.setState({ pdocsNum: addDocName })
                            this.setState({ pdocsID: addDocuId })
                            console.log(this.state.pdocsNum, this.state.pdocsID);
                            this.setState({ TnCdocumentFlag: true })
                        }
                        //  else if (userType == 5 && docuType == 10) {
                        //     console.log(userType, docuType)
                        //     console.log(addDocuId, addDocLocation, addDocName)

                        //     this.setState({ pdocsNum: addDocName })
                        //     this.setState({ pdocsID: addDocuId })
                        //     console.log(this.state.pdocsNum, this.state.pdocsID);
                        // }
                        this.setState({ viewImageLists: responseData })
                        $("#downloadTnCid").prop('disabled', true)
                    })
                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    // setDocumentToDownload = () => {
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

    //                 const url = window.URL.createObjectURL(resdata);
    //                 const a = document.createElement('a');
    //                 a.style.display = 'none';
    //                 a.href = url;
    //                 // the filename you want
    //                 a.download = docuName;
    //                 document.body.appendChild(a);
    //                 a.click();
    //                 window.URL.revokeObjectURL(url);
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
    viewDocument = () => {
        var pDocsId = this.state.pdocsID
        var memmid = sessionStorage.getItem('memmID')
        var docuName = this.state.pdocsNum;
        console.log(this.state.pdocsID)

        var TnCDocuFlag = this.state.TnCdocumentFlag;
        console.log(TnCDocuFlag)
        if (TnCDocuFlag == true) {
            fetch(BASEURL + `/usrmgmt/getdocument?id=${pDocsId}` + `&memmid=${memmid}`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
            }).then((Response) => Response.blob())
                .then((resdata) => {
                    console.log(resdata)
                    console.log('Response:', resdata)
                    $("#launchColl").click();
                    console.log('Response:', resdata)
                    var collFile = new Blob([(resdata)], { type: 'application/pdf' });
                    console.log(collFile);
                    var collfileURL = URL.createObjectURL(collFile);
                    console.log(collfileURL);
                    document.getElementsByClassName('PDFdoc')[0].src = collfileURL + "#zoom=100";
                })
        } else {
            confirmAlert({
                message: "Document not available.",
                buttons: [
                    {
                        label: "Okay",
                        onClick: () => {

                        }
                    }
                ],
            })
        }
    }
    viewPOAImage = (list) => {
        var pDocsId = list.id
        var memmid = sessionStorage.getItem('memmID')
        var docuName = this.state.pdocsNum;
        console.log(this.state.pdocsID)
        fetch(BASEURL + `/usrmgmt/getdocument?id=${pDocsId}` + `&memmid=${memmid}`, {
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

    //MPIN
    enterMPIN = (e) => {
        this.setState({ enterMPIN: e.target.value })
        // switch (e.target.name) {
        //     case "enterPin": (e.target.value !== document.getElementsByName('confirm-pin')[0].value)
        //         ? $('#getOtpforMpin').prop('disabled', true)
        //         : $('#getOtpforMpin').prop('disabled', false)
        //         break;
        //     case "confirm-pin": (e.target.value !== document.getElementsByName('enterPin')[0].value)
        //         ? $('#getOtpforMpin').prop('disabled', true)
        //         : $('#getOtpforMpin').prop('disabled', false)
        //         break;
        //     default:
        //         break;
        // }
        var enterPin = document.getElementsByName('enterPin')[0].value;
        var confirmPin = document.getElementsByName('confirm-pin')[0].value;
        if (enterPin == confirmPin) {
            $('#getOtpforMpin').prop('disabled', false)
        } else if (enterPin != confirmPin) {
            $('#getOtpforMpin').prop('disabled', true)
        }
        var enterMPINValid = /^[0-9]{6}$/;
        var eventmInput = e.target.value;
        if (enterMPINValid.test(eventmInput)) {
            console.log("passed")
            this.setState({ invalidMpin: false })
            //$('#getOtpforMpin').prop('disabled', false)
            this.setState({ enterMPIN: e.target.value })
        } else {
            this.setState({ invalidMpin: true })
            //$('#getOtpforMpin').prop('disabled', true)
        }
    }
    confirmMPIN = (e) => {
        this.setState({ confirmMPIN: e.target.value })
        // switch (e.target.name) {
        //     case "enterPin": (e.target.value !== document.getElementsByName('confirm-pin')[0].value)
        //         ? $('#getOtpforMpin').prop('disabled', true)
        //         : $('#getOtpforMpin').prop('disabled', false)
        //         break;
        //     case "confirm-pin": (e.target.value !== document.getElementsByName('enterPin')[0].value)
        //         ? $('#getOtpforMpin').prop('disabled', true)
        //         : $('#getOtpforMpin').prop('disabled', false)
        //         break;
        //     default:
        //         break;
        // }
        var enterPin = document.getElementsByName('enterPin')[0].value;
        var confirmPin = document.getElementsByName('confirm-pin')[0].value;
        if (enterPin == confirmPin) {
            $('#getOtpforMpin').prop('disabled', false)
        } else if (enterPin != confirmPin) {
            $('#getOtpforMpin').prop('disabled', true)
        }
        var entercnfMPINValid = /^[0-9]{6}$/;
        var eventmInput = e.target.value;
        if (entercnfMPINValid.test(eventmInput)) {
            console.log("passed")
            this.setState({ invalidcnfMpin: false })
            //$('#getOtpforMpin').prop('disabled', false)
            this.setState({ confirmMPIN: e.target.value })
        } else {
            this.setState({ invalidcnfMpin: true })
            //$('#getOtpforMpin').prop('disabled', true)
        }
    }
    MPINotp = (e) => {
        this.setState({ MPINotp: e.target.value })
    }

    enableSetMpin = () => {
        $("#setMpinBtn").hide()
        $("#pinmgmtField").hide()
        $("#viewSetMpinFields").show()
        //this.getTransactionPinOtp();
    }
    backTxnPin = () => {
        $("#setMpinBtn").show()
        $("#pinmgmtField").show()
        $("#viewSetMpinFields").hide()

        $("#getMPINOtp").show()
        $("#mpinMOTP").hide()
        let txninput1 = document.getElementById('enterPin');
        let txninput2 = document.getElementById('confirmPin');
        let txninput3 = document.getElementById('mobileOtp');
        txninput1.value = "";
        txninput2.value = "";
        txninput3.value = "";
    }
    canceltransactionPin = () => {
        $("#setMpinBtn").show()
        $("#pinmgmtField").show()
        $("#viewSetMpinFields").hide()

        $("#getMPINOtp").show()
        $("#mpinMOTP").hide()
        let txninput1 = document.getElementById('enterPin');
        let txninput2 = document.getElementById('confirmPin');
        let txninput3 = document.getElementById('mobileOtp');
        txninput1.value = "";
        txninput2.value = "";
        txninput3.value = "";
        //window.location.reload()
    }
    getTransactionPinOtp = () => {
        fetch(BASEURL + '/usrmgmt/settransactionpin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    var mpin = resdata.msgdata.mobileref;
                    if (mpin) {
                        console.log(resdata.msgdata.mobileref)
                        this.setState({ MPINref: resdata.msgdata.mobileref })
                    }

                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    $("#getMPINOtp").hide();
                                    $("#mpinMOTP").show();
                                }
                            }
                        ],
                    })
                } else {
                    confirmAlert({
                        message: "Failure, Please Try again Later.",
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
    settransactionPin = () => {
        fetch(BASEURL + '/usrmgmt/settransactionpin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                pin: this.state.enterMPIN,
                confirmpin: this.state.confirmMPIN,
                mobileotp: this.state.MPINotp,
                mobileref: this.state.MPINref
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                confirmAlert({
                    message: resdata.message,
                    buttons: [
                        {
                            label: "Okay",
                            onClick: () => {
                                window.location.reload();
                                //window.location = "/lenderdashboard"
                            }
                        }
                    ],
                })

            })
    }
    getAuthMode = (event) => {
        console.log(event.target.checked)
        status = event.target.checked;
        this.setState(prevState => ({
            checkStatus: prevState.checkStatus === "1" ? " 0" : "1"
        }));
        if (status === true) {
            $("#setMpinBtn2").show();
            // this.setState({ txnStatus: "1" })
            // console.log(this.state.txnStatus)
        } else if (status === false) {
            $("#setMpinBtn2").hide();
            txnStatus = "0";
            authMode = "0";
            this.getTxnStatusOtp()
            console.log(txnStatus)
        }
    }
    pinType = (event) => {
        console.log(event.target.value);
        status = event.target.value;
        if (status === "1") {
            //Pin based
            txnStatus = "1";
            authMode = "1";
            this.getTxnStatusOtp();
        } else if (status === "2") {
            //Otp based
            txnStatus = "1";
            authMode = "2";
            this.getTxnStatusOtp();
        }
    }
    getTxnStatusOtp = (status) => {
        fetch(BASEURL + '/usrmgmt/settransactionpinstatus', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                status: txnStatus,
                authmode: authMode,
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    mpin = resdata.msgdata.mobileref;

                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    $("#mpinStatusModal").click()
                                }
                            }
                        ],
                    })
                } else {
                    confirmAlert({
                        message: "Failure, Please Try again Later.",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                }
                            }
                        ],

                    })
                }

            }).catch((error) => {
                console.log(error)
            })

    }
    MPINStatusotp = (e) => {
        MPINStatusotp = e.target.value
    }
    setTransactionpinStatus = () => {
        fetch(BASEURL + '/usrmgmt/settransactionpinstatus', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                status: txnStatus,
                mobileotp: MPINStatusotp,
                mobileref: mpin,
                authmode: authMode
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success") {
                    alert(resdata.message)
                    this.getUserStatusflag2();
                    let input1 = document.getElementById('setTxnStatusBtn');
                    input1.value = "";
                } else {
                    alert(resdata.message);
                    window.location.reload()
                }
            })
    }

    ovdViewBtn = () => {
        this.getovdMasterlist()
        $("#OvdModal").click()
    }

    //Document Section
    getFormDetails = () => {
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
                        console.log(this.state.formFieldLists, prefilledValues, this.state.pdob)
                    });


                    if (poaDocumentFlag === true) {
                        $("#uploadOvdDocFirst").hide();
                        $("#submitOvdFirst").show();
                        // $("#poaModal").click();
                    } else {
                        $("#`uploadOvdDocID`").hide();
                        $("#submitOvdID").show()
                        // $("#OvdModal").click();
                    }
                } else {

                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getPoaDetails = (params) => {
        if (params === "ovd") {
            this.setState({ ovdFlagTrue: true })
        } else if (params === "poa") {
            this.setState({ ovdFlagTrue: false })
        }
        this.getovdMasterlist()
        $("#poaModal").click()
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
                } else {

                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    canceSaveFormTxnData = () => {
        this.setState({ formFieldLists: [] })
        $("#uploadOvdDocFirst").show();
        $("#submitOvdFirst").hide();
    }
    cancelPoaFormTxnSubmit = () => {
        this.setState({ addressFormFieldLists: [] })
        $("#submitOvdFirst").show();
        $("#addressFormFields").hide();
    }
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
                            pattern={element.regex}
                            required={element.required}
                            value={value}
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
                            pattern={element.regex}
                            required={element.required}
                            value={value}
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
                            pattern={element.regex}
                            required={element.required}
                            value={value}
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
                    return (
                        <div key={element.field} className="col-6 mb-2">
                            <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                            <select
                                name={element.field}
                                className="form-select"
                                value={value}
                                onChange={(e) => { this.handleSelectChange(e, element, index) }}
                            >
                                <option value="">{element.placeholder}</option>
                                {this.state.demoStates.map((state) => (
                                    <option key={state.statecode} value={state.statename}>
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
            case "date":
                return (
                    <div key={element.field} className="col-6 mb-2" style={{ fontSize: "14px" }}>
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p><input
                            type="date" className="form-control"
                            name={element.name}
                            value={value}
                            onChange={(e) => { this.handleSelectChange(e, element, index) }} />
                    </div>
                );
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
    // handleSelectChange = (e, element, index) => {
    //     const { target, value } = e.target;
    //     console.log(value)
    //     // Update selected state code when State select is changed
    //     if (element.field === 'State') {
    //         this.setState({
    //             stateName: value,
    //             apiCalled: false,
    //             demoDistricts: [],
    //             talukLists: [],
    //             selectedStateCode: '',
    //             selectedDistrictCode: ''
    //         });
    //         var states = this.state.demoStates;
    //         console.log(states);
    //         states.forEach(element => {
    //             if (element.statename == value) {
    //                 console.log(element.statename)
    //                 this.setState({ selectedStateCode: element.statecode }, () => {
    //                     console.log(this.state.selectedStateCode, element.statecode)
    //                 })
    //             }
    //         })
    //     } else if (element.field === 'District') {
    //         this.setState({
    //             districtName: value,
    //             apiCalled: false,
    //             talukApiCalled: false,
    //             talukLists: [],
    //             selectedDistrictCode: ''
    //         });
    //         var districts = this.state.demoDistricts;
    //         districts.forEach(element => {
    //             if (element.distname == value) {
    //                 console.log(element.distname)
    //                 this.setState({ selectedDistrictCode: element.distid }, () => {
    //                     console.log(this.state.selectedDistrictCode, element.distid)
    //                 })
    //             }
    //         })
    //     } else if (element.field === 'Taluk') {
    //         this.setState({ talukName: value });
    //         var taluks = this.state.talukLists;
    //         taluks.forEach(element => {
    //             if (element.talukname == value) {
    //                 console.log(element.talukname)
    //                 this.setState({ talukCode: element.talukid }, () => {
    //                     console.log(this.state.talukCode, element.talukid)
    //                 })
    //             }
    //         })
    //     }
    //     // Add logic for other fields as needed
    //     console.log(element.label, element.datatype, element.regex);
    //     const Regex = element.regex;

    //     let errorMessage = "";
    //     if (Regex) {
    //         const pattern = new RegExp(Regex);
    //         if (!pattern.test(value)) {
    //             console.log(`Invalid input for ${element.field}.`);
    //             errorMessage = `Invalid input for ${element.field}.`;
    //             $("#submitBtn").prop('disabled', true);
    //         } else {
    //             const updatedDataList = [...poaDataList];
    //             updatedDataList[index] = value;
    //             console.log(updatedDataList);

    //             const updatedExtractedData = updatedDataList.map((val, idx) => {
    //                 const item = this.state.addressFormFieldLists[idx];
    //                 return {
    //                     field: item.field,
    //                     value: val || "",
    //                 };
    //                 // const extractedItem = {
    //                 //     field: item.field,
    //                 //     value: val || "",
    //                 // };
    //                 // if (item.field === 'State') {
    //                 //     extractedItem.statecode = this.state.selectedStateCode;
    //                 // }
    //                 // if (item.field === 'District') {
    //                 //     extractedItem.districtcode = this.state.selectedDistrictCode;
    //                 // }
    //                 // return extractedItem;
    //             });
    //             console.log(updatedExtractedData);
    //             poaDataList = updatedDataList;
    //             this.setState({
    //                 poaExtractedData: updatedExtractedData,
    //             });
    //         }
    //     }
    //     const errorMessages = { ...this.state.errorMessages };
    //     errorMessages[element.label] = errorMessage;

    //     this.setState({ errorMessages });
    //     const allFieldsSelected = this.state.poaExtractedData.every(field => {
    //         if (field.value !== undefined && field.value.trim() !== "") {
    //             return true; // Field is selected
    //         } else {
    //             return false; // Field is not selected
    //         }
    //     });
    //     // Set the disabled state based on the condition
    //     if (allFieldsSelected) {
    //         $("#secondFormBtn").prop('disabled', false); // Enable the button
    //     } else {
    //         $("#secondFormBtn").prop('disabled', true); // Disable the button
    //     }
    // }
    handleSelectChange = (e, element, index) => {
        const value = e.target.value;
        console.log(`Value changed for field: ${element.field}, New value: ${value}`);

        const updatedAddressFormFieldLists = [...this.state.addressFormFieldLists];
        updatedAddressFormFieldLists[index] = {
            ...updatedAddressFormFieldLists[index],
            value: value
        };

        console.log('Updated addressFormFieldLists:', updatedAddressFormFieldLists);

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
        console.log(this.state.poaExtractedData, updatedAddressFormFieldLists)

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

        const allFieldsSelected = updatedAddressFormFieldLists.every(field => field.value !== undefined && field.value.trim() !== "");
        console.log('All fields selected:', allFieldsSelected);
        // if (allFieldsSelected) {
        //     $("#secondFormBtn").prop('disabled', false);
        // } else {
        //     $("#secondFormBtn").prop('disabled', true);
        // }
    }
    poaFormTxnDataSubmit = () => {
        var result = JSON.stringify({
            ovdinfo: {
                category: this.state.formCategory,
                type: this.state.formType,
                majorid: this.state.formOvdRefNo,
                formdata: {
                    formfields: extractedData
                }
            },
            addressinfo: {
                category: this.state.poaformCategory,
                type: this.state.poaformType,
                majorid: this.state.formOvdRefNo,
                formdata: {
                    formfields: this.state.poaExtractedData
                }
            }
        })
        console.log(result)
        fetch(BASEURL + '/usrmgmt/v2/setformtxndata', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: result
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    $("#exampleModalCenter29").modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getAddressDetails()
                                }
                            }
                        ],
                    })
                    // this.setState({
                    //     formFieldLists: this.state.formFieldLists.map(item => ({ ...item, value: '' })),
                    //     errorMessages: {},
                    // });

                } else {
                    $("#exampleModalCenter29").modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    $("#exampleModalCenter29").modal('show');
                                }
                            }
                        ],
                    })

                    this.setState({
                        formFieldLists: this.state.formFieldLists.map(item => ({ ...item, value: '' })),
                        errorMessages: {},
                    });

                }

            })
    }
    getPrefilledValue = (field) => {
        switch (field) {
            case "Name":
                return this.state.pname;
            case "DOB":
                return this.state.pdob;
            case "Email":
                return this.state.pemail;
            case "Address":
                return this.state.paddress1;
            case "address1":
                return this.state.paddress1;
            case "address2":
                return this.state.paddress2;
            case "address3":
                return this.state.landmark;
            case "Gender":
                return this.state.pgender;

            case "Address Line 1":
                return this.state.paddress1;
            case "Address Line 2":
                return this.state.paddress2;
            case "Address Line 3":
                return this.state.landmark;
            case "City":
                return this.state.pcity;
            case "Pin Code":
                return this.state.ppincode;
            case "State":
                return this.state.pstate1;
            // case "District":
            //     return this.state.pdistrict;
            // case "Taluk":
            //     return this.state.ptaluk;
            default:
                return "";
        }
    };
    renderFormElement = (element, index) => {
        const value = this.state.formFieldLists[index]?.value || "";
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
                            placeholder={element.placeholder}
                            value={value}
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field) }}
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
                            placeholder={element.placeholder}
                            value={value}
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field) }}
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
                            placeholder={element.placeholder}
                            value={value}
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field) }}
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
                        <div className='row'>
                            {element.values.map((option) => (
                                <div key={option.value} className='col-5'>
                                    <input
                                        type="radio"
                                        name={element.name}
                                        value={option.label}
                                        checked={value === option.label}
                                        // checked={option.selected}
                                        onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field) }}
                                    />
                                    <p style={{ fontWeight: "500", color: "rgba(5,54,82,1)" }}>{option.label}</p>
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
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field) }}
                        >
                            {element.values.map((option) => (
                                <option key={option.value} value={option.value}>
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
                            value={value}
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
                            value={value}
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field) }}
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
                // valueList.push()
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

                $("#submitBtn").prop('disabled', false);
            }
        }
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

            // Check if all fields are filled after the state update
            const allFieldsFilled = this.state.formFieldLists.every(field => field.value.trim() !== "");

            if (allFieldsFilled) {
                $("#submitFirstForm1").prop('disabled', false); // Enable the button
                $("#submitFirstForm").prop('disabled', false);
            } else {
                $("#submitFirstForm1").prop('disabled', true); // Disable the button
                $("#submitFirstForm").prop('disabled', true);
            }
        });
    }
    setFormTxndata = () => {
        //majorid: sessionStorage.getItem('loanReqNo'),
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
                majorid: this.state.formOvdRefNo,
                formdata: {
                    formfields: extractedData
                }
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    $("#exampleModalCenter29").modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getUploadedOvds()
                                    window.location = "/evaluatorDetails"
                                }
                            }
                        ],
                    })
                } else {
                    $("#exampleModalCenter29").modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    $("#exampleModalCenter29").modal('show');
                                }
                            }
                        ],
                    })
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
        $(".viewOVDfields").show();
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
                    this.setState({ ovdList: list })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        ovdList: slice
                    })
                } else {
                    alert(resdata.message);
                }
            })
    }
    getPdfDocumentDetails = (event) => {
        fetch(BASEURL + '/usrmgmt/getdocumentdetails', {
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
                    var responseData = resdata.msgdata;
                    console.log(responseData);

                    var userType;
                    var docuType;
                    var addDocuId;
                    var addDocLocation;
                    var addDocName;

                    responseData.find(ele => {
                        userType = ele.utype;
                        docuType = ele.doctype;
                        addDocuId = ele.id;
                        addDocLocation = ele.doclocation;
                        addDocName = ele.docname;
                        console.log(userType, docuType)

                        if (userType == 5 && docuType == 7) {
                            console.log("Evaluator")

                            console.log(userType, docuType)
                            console.log(addDocuId, addDocLocation, addDocName)

                            this.setState({ pdocsNum: addDocName })
                            this.setState({ pdocsID: addDocuId })
                            console.log(this.state.pdocsNum, this.state.pdocsID);
                            this.setState({ TnCdocumentFlag: true })
                        }
                        this.setState({ viewImageLists: responseData })
                        $("#downloadTnCid").prop('disabled', true)
                    })
                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    setDocumentToDownload = () => {
        var pDocsId = this.state.pdocsID
        var memmid = sessionStorage.getItem('memmID')
        var docuName = this.state.pdocsNum;
        console.log(this.state.pdocsID)

        var TnCDocuFlag = this.state.TnCdocumentFlag;
        console.log(TnCDocuFlag)
        if (TnCDocuFlag == true) {
            fetch(BASEURL + `/usrmgmt/getdocument?id=${pDocsId}` + `&memmid=${memmid}`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
            }).then((Response) => Response.blob())
                .then((resdata) => {
                    console.log(resdata)
                    console.log('Response:', resdata)

                    const url = window.URL.createObjectURL(resdata);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    // the filename you want
                    a.download = docuName;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
        } else {
            confirmAlert({
                message: "Document not available.",
                buttons: [
                    {
                        label: "Okay",
                        onClick: () => {

                        }
                    }
                ],
            })
        }

    }
    viewDocument = () => {
        var pDocsId = this.state.pdocsID
        var memmid = sessionStorage.getItem('memmID')
        var docuName = this.state.pdocsNum;
        console.log(this.state.pdocsID)

        var TnCDocuFlag = this.state.TnCdocumentFlag;
        console.log(TnCDocuFlag)
        if (TnCDocuFlag == true) {
            fetch(BASEURL + `/usrmgmt/getdocument?id=${pDocsId}` + `&memmid=${memmid}`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
            }).then((Response) => Response.blob())
                .then((resdata) => {
                    console.log(resdata)
                    console.log('Response:', resdata)
                    $("#launchColl").click();
                    console.log('Response:', resdata)
                    var collFile = new Blob([(resdata)], { type: 'application/pdf' });
                    console.log(collFile);
                    var collfileURL = URL.createObjectURL(collFile);
                    console.log(collfileURL);
                    document.getElementsByClassName('PDFdoc')[0].src = collfileURL + "#zoom=100";
                })
        } else {
            confirmAlert({
                message: "Document not available.",
                buttons: [
                    {
                        label: "Okay",
                        onClick: () => {

                        }
                    }
                ],
            })
        }
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
        if (e.target.value == "ELCBILL") {
            this.setState({ ovdCategoryFlag: true })
        } else {
            this.setState({ ovdCategoryFlag: false })
        }
        $("#uploadDocumentField").show()

    }
    // addOvdMnumber=(e)=>{
    //     this.setState({ OvdMnumber: e.target.value })
    // }
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
        // const ovdformData = new FormData()
        // var ovdfileField = document.querySelector("input[type='file']");
        // console.log(ovdfileField)

        // var bodyData = JSON.stringify({
        //     ovdcode: this.state.selectDocu,
        //     mobileno: this.state.pmobile,
        //     pagetype: this.state.ovdPagetype
        // })
        // ovdformData.append("ovdImage", ovdfileField.files[0]);
        // ovdformData.append("ovdInfo", bodyData);

        // var qrfileField;
        // if (poaDocumentFlag === true) {
        //     if (pageTypePOA === "1") {
        //         qrfileField = document.getElementById("attachment10");
        //     } else if (pageTypePOA === "2") {
        //         qrfileField = document.getElementById("attachment11");
        //     }
        // } else {
        //     qrfileField = document.getElementById("attachment1");
        // }

        // if (poaDocumentFlag === true) {
        //     if (pageTypePOA === "1") {
        //         formData.append("ovdimage", qrfileField.files[0]);
        //     } else if (pageTypePOA === "2") {
        //         formData.append("ovdimage", qrfileField.files[0]);
        //     }
        // } else {
        //     formData.append("ovdimage", qrfileField.files[0]);
        // }
        // formData.append("ovdinfo", bodyData);
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
                mobileno: this.state.pmobile,
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
            if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                // Handle success
                console.log(resdata);
                this.setState({
                    formOvdRefNo: resdata.msgdata.ovdrefno,
                });
                console.log(resdata.msgdata.ovdrefno, this.state.formOvdRefNo)
                $('#uploadFrontDocu').hide()
                $('#getFormDetailsNextBtn').prop('disabled', false);
            } else {
                // Handle failure
                $('#getFormDetailsNextBtn').prop('disabled', true);
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
                $("#exampleModalCenter2").modal('hide');
                // confirmAlert({
                //     message: resdata.message,
                //     buttons: [
                //         {
                //             label: "Okay",
                //             onClick: () => {
                //                 this.getUploadedOvds();
                //                 $("#uploadOvdDocID").show();
                //                 $("#submitOvdID").hide()
                //             }
                //         }
                //     ],
                // })
            } else {
                console.log("here")
                alert(resdata.message);
                // $("#uploadOvdDocID").show();
                // $("#submitOvdID").hide()

                // confirmAlert({
                //     message: resdata.message,
                //     buttons: [
                //         {
                //             label: "Okay",
                //             onClick: () => {
                //                 $("#uploadOvdDocID").show();
                //                 $("#submitOvdID").hide()
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
        // var PageIdType;
        // var RefNumber;
        this.setState({ OvdDataList: ovddata })
        this.setState({ OvdCodeforDelete: ovdcode })
        $("#deleteUpldOvdmodal").click()

        // ovddata.map((pageType, index) => {
        //     return (
        //         PageIdType = pageType.pagetype,
        //         RefNumber=pageType.refno
        //     )
        // })
        // console.log(PageIdType,RefNumber,ovdcode);
        //this.deleteUpldedOvd(PageIdType,RefNumber,ovdcode)
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
                                $(this.selectRef1.current).val('');
                                this.setState({
                                    OvdCodeforDelete: "",
                                    refno: ""
                                })
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
                                $(this.selectRef1.current).val('');
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

        // var PageType;
        // var OvdData;
        // OvdData = ovddata.map((pageType, index) => {
        //     return PageType = pageType.pagetype;
        // })
        // console.log(PageType);
        // this.viewGetuploadedovdimage(mobileno, ovdcode, PageType)
        // mobileNo = mobileno;
        // ovdCode = ovdcode;
        // pagetype = PageType;
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

                // console.log('Response:', resdata)
                // var collFile = new Blob([(resdata)], { type: 'application/image' });
                // console.log(collFile);
                // var collfileURL = URL.createObjectURL(collFile);
                // console.log(collfileURL);
                //document.getElementsByClassName('PDFdoc')[0].src = imageUrl + "#zoom=100";
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
    componentWillUnmount() {
        clearInterval(this.state.interval);
        window.removeEventListener('storage', this.handleStorageEvent);
    }
    handleStorageEvent = () => {
        // Check if photoapiflag is true
        if (sessionStorage.getItem('photoapiflag') === "true") {
            // this.getphotoDetails();
            sessionStorage.setItem('photoapiflag', "false"); // Reset flag
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
    render() {
        const { t } = this.props
        const digiURL = BASEURL + "/verification/digilocker/makedigilockercall";

        const { isPasswordShown } = this.state;
        const { isPasswordShown2 } = this.state;
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
        var isTnCSigned = this.state.isTnCSigned;
        var accountDetails = this.state.isAccountVerified;
        var kycVerification = this.state.isVkycVerified;
        var personalDetails = this.state.isAddressVerified;

        var ePIN = this.state.enterMPIN;
        var CfPIN = this.state.confirmMPIN;
        var PinOTP = this.state.MPINotp;
        if (ePIN == "" || CfPIN == "" || PinOTP == "") {
            $('#setTxnSubmitBtn').prop('disabled', true)
        } else {
            $('#setTxnSubmitBtn').prop('disabled', false)
        }

        var test;
        if (ePIN == "" || CfPIN == "") {
            $('#getOtpforMpin').prop('disabled', true)
        }

        var sDocu = this.state.selectDocu;
        var upldDocu = documentAdded;
        var pgType = this.state.ovdPagetype;
        if (sDocu == "" || upldDocu == "" || pgType == "") {
            $('.uploadOvdDocuSbtn').prop('disabled', true)
        } else {
            $('.uploadOvdDocuSbtn').prop('disabled', false)
        }
        const { permanentAddressStatus, permNewAddressStatus } = this.state;
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F4F7FC" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <EvaluatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id="BnavRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="BnavRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/evaluatorDashboard">Home</Link> / Profile Details</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="BnavRes3">
                            <button style={myStyle}>
                                <Link to="/evaluatorDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "4px" }} />
                    <div className='row ' style={{ marginTop: "-15px" }}>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "16px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>{t('View Profile')}</p>
                        </div>
                    </div>
                    {/* New Design */}
                    <Row style={{ marginTop: "-27px" }}>
                        <Col>
                            <Card className="" style={{ width: "963px", marginLeft: "50px", paddingBottom: "10px", cursor: "default", color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                <div className='row'>
                                    <div className='col'>
                                        <div className='' id='EvlpersonalCard' style={{
                                            borderRadius: "16px", backgroundColor: "rgba(240,249,255,1)",
                                            position: "relative", zIndex: "1", cursor: "default", height: "fit-content"
                                        }}>
                                            <div className='row item-list align-items-center'>
                                                <div >
                                                    <div className="row">
                                                        <div className='col-2' id="imgCol">
                                                            {this.state.image ?
                                                                <img src={`data:image/png;base64,${this.state.aadharImage}`}
                                                                    style={{
                                                                        width: "100px", height: "100px", overflow: "hidden",
                                                                        borderRadius: "20% 20% 0 0", marginLeft: "20px"
                                                                    }}
                                                                    id="profileImage" /> : <img src={profile2}
                                                                        style={{
                                                                            width: "100px", height: "100px", overflow: "hidden",
                                                                            borderRadius: "20% 20% 0 0", marginLeft: "20px"
                                                                        }}
                                                                        id="profileImage" />}
                                                        </div>
                                                        <div className='col-lg-10 col-md-5 col-sm-6' id="Evldetail1Col">
                                                            <div className='row'>
                                                                <p style={{ fontWeight: "bold", fontSize: "14px", color: "RGBA(5,54,82,1)", marginLeft: "18px" }}>{this.state.pname}</p>
                                                                <div className='col'>
                                                                    <div className='col-md-12 col-sm-12'>
                                                                        <p style={{ fontSize: "14px" }}>
                                                                            <span style={{ fontWeight: "bold" }}>Email </span>
                                                                            <span style={{ fontWeight: "bold" }} >:</span>&nbsp;{this.state.pemail}&nbsp;
                                                                            <FaEdit style={{ color: "RGBA(5,54,82,1)", cursor: "pointer" }} title="Edit Email ID" onClick={this.changeType1} />
                                                                        </p>
                                                                    </div>
                                                                    <div className='col-md-12 col-sm-12'>
                                                                        <p style={{ fontSize: "14px" }}>
                                                                            <span style={{ fontWeight: "bold" }}>Gender </span>
                                                                            <span style={{ fontWeight: "bold" }}>:</span>&nbsp;
                                                                            {this.state.pgender === "M" ? "Male" : this.state.pgender === "O" ? "Other" : this.state.pgender === "F" && "Female"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className='col'>
                                                                    <div className='col-md-12 col-sm-12'>
                                                                        <p style={{ fontSize: "14px" }}>
                                                                            <span style={{ fontWeight: "bold" }}>Contact </span>
                                                                            <span style={{ fontWeight: "bold" }}>:</span>&nbsp;{this.state.pmobile}&nbsp;&nbsp;&nbsp;
                                                                            <FaEdit style={{ color: "RGBA(5,54,82,1)", cursor: "pointer" }} title="Edit Mobile Number" onClick={this.changeType2} />
                                                                        </p>
                                                                    </div>
                                                                    <div className='col-md-12 col-sm-12'>
                                                                        <p style={{ fontSize: "14px" }}>
                                                                            <span style={{ fontWeight: "bold" }}>Date Of Birth </span>
                                                                            <span style={{ fontWeight: "bold" }}>:</span>&nbsp;{this.state.pdob && this.state.pdob.split(' ')[0].split('-').reverse().join('-')}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='row' style={{ marginTop: "-8px" }} >
                                                        {accountDetails == 1 && (kycVerification == 1 || kycVerification == 9) && personalDetails == 1 && isTnCSigned == 1 ?
                                                            <div className='col-lg-6 col-md-8 col-sm-12' style={{ paddingLeft: "33px" }}>
                                                                <p className="downloadTnc" id='downloadTnCid' style={{ cursor: "pointer", fontWeight: "500", fontSize: "14px", marginRight: "12px" }} onClick={this.viewDocument}>
                                                                    Download {TnC} <FaFileDownload style={{ marginTop: "-4px" }} />
                                                                </p>
                                                            </div> :
                                                            accountDetails == 1 && (kycVerification == 1 || kycVerification == 9) && personalDetails == 1 && isTnCSigned == 0 &&
                                                            <div className='col-lg-6 col-md-8 col-sm-12' style={{ paddingLeft: "33px" }}>
                                                                <p style={{ color: "#222c70", fontWeight: "400", fontSize: "14px" }} onClick={this.retriggerTnCSigning}>
                                                                    Request for {TnC} Signing* &nbsp; <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079bf" }}><FaFileSignature />&nbsp;{TnC} Sign</button>
                                                                </p>
                                                            </div>
                                                        }
                                                    </div>
                                                    {/* {accountDetails == 1 && (kycVerification == 1 || kycVerification == 9) && personalDetails == 1 && isTnCSigned == 0 ?
                                                    <div className='row' style={{ marginTop: "-20px" }}>
                                                        <div className='col' style={{ paddingLeft: "33px" }}>
                                                            <p style={{ color: "#222c70", fontWeight: "400", fontSize: "14px" }} onClick={this.retriggerTnCSigning}>
                                                                Request for T&C Signing* &nbsp; <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079bf" }}><FaFileSignature />&nbsp;T&C Sign</button>
                                                            </p>
                                                        </div>
                                                    </div> : null}

                                                <span>{accountDetails == 1 && (kycVerification == 1 || kycVerification == 9) && personalDetails == 1 && isTnCSigned == 1 ?
                                                    <div className='row' style={{ marginTop: "-20px" }}>
                                                        <div className='col' style={{ paddingLeft: "33px" }}>
                                                            <p className="downloadTnc" id='downloadTnCid' style={{ cursor: "pointer", fontWeight: "500", fontSize: "14px" }} onClick={this.viewDocument}>
                                                                Download {TnC} &nbsp; <FaFileDownload style={{ marginTop: "-4px" }} />
                                                            </p>
                                                        </div>
                                                    </div> : null}</span> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row' style={{ marginTop: "10px" }}>
                                    <div className='col'>
                                        <ul role="tablist" className="nav nav-pills nav-fill mb-3">
                                            <li className="nav-item"> <a data-toggle="pill" href="#address-details" className="nav-link active detailsTab"
                                                onClick={this.getAddressDetails} style={{ textAlign: "initial" }}> {t('Address Details')} </a> </li>
                                            <li className="nav-item"> <a data-toggle="pill" href="#bank-details" className="nav-link detailsTab"
                                                onClick={this.getBankDetails}> {t('Bank Details')} </a> </li>
                                            <li className="nav-item"> <a data-toggle="pill" href="#kyc-documents" className="nav-link detailsTab"
                                                style={{ textAlign: "center" }} onClick={this.getDocumentDetails}>Verification</a> </li>
                                            <li className="nav-item"> <a data-toggle="pill" id='detailsTab' href="#ovd-documents" className="nav-link detailsTab"
                                                style={{ textAlign: "center" }} onClick={this.getUploadedOvds}>Documents</a> </li>
                                            {
                                                this.state.setMPINFlag == true ?
                                                    <li className="nav-item"> <a data-toggle="pill" href="#set-pin" className="nav-link detailsTab"
                                                        style={{ textAlign: "end" }} >PIN Management</a> </li>
                                                    : ""
                                            }
                                        </ul>
                                        <hr style={{ marginTop: "-8px" }} />
                                    </div>
                                </div>
                                <div className='row' style={{
                                    marginTop: "-10px", overflowX: "scroll",
                                    flexDirection: "row", flexWrap: "nowrap",
                                    borderRadius: "36px"
                                }}>
                                    <div className='col'>
                                        <div className='tab-content' style={{ backgroundColor: "rgb(240, 249, 255)" }}>
                                            <div id="address-details" className="register-form tab-pane fade show active" style={{ padding: '30px', cursor: "default" }}>
                                                <div className="row" style={{ marginTop: "-15px" }}>
                                                    <div className='col-lg-10 col-md-6 col-sm-5' id='Eaddressdetails0' style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                        <FaMapMarkerAlt style={{ marginTop: "-6px" }} />&nbsp;<span>Address Info</span>
                                                        <hr style={{ marginTop: "1px" }} />
                                                    </div>
                                                    <div className='col-lg-2 col-md-6 col-sm-4' style={{ textAlign: "end" }}>
                                                        <button className='btn btn-sm'
                                                            // id="EbtnAddressdetails"
                                                            style={{ border: "2px solid RGBA(5,54,82,1)", marginTop: "-8px" }}
                                                            onClick={() => this.getPoaDetails("poa")}
                                                        >
                                                            <FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* <div className="form-row" id='Eaddressdetails1'>
                                                <div className='col-4' id='headinglndwl'>
                                                    <div className="two__image" style={{ paddingLeft: "20px", marginLeft: "-10px" }}>
                                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Present Address</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {this.state.address1 == "" && this.state.address2 == "" && this.state.address3 == "" && this.state.city == "" ? null :
                                                <div className='row' id='Eaddressdetails2' style={{ marginTop: "-10px" }}>
                                                    <div className='col-sm-2 col-md-3 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Address Line 1</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.address1}</p>
                                                    </div>

                                                    <div className='col-sm-2 col-md-3 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Address Line 2</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.address2}</p>
                                                    </div>

                                                    <div className='col-sm-2 col-md-3 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Landmark</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.address3}</p>
                                                    </div>
                                                    <div className='col-sm-2 col-md-3 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>City</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.city}</p>
                                                    </div>
                                                </div>
                                            }
                                            {this.state.taluk == "" && this.state.district == "" && this.state.state == "" && this.state.pincode == "" ? null :
                                                <div className='row' id='Eaddressdetails3'>
                                                    {this.state.talukFlag !== "p2p" ?
                                                        <div className='col-sm-2 col-md-3 col-lg-3'>
                                                            <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Taluk</p>
                                                            <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.taluk}</p>
                                                        </div>
                                                        :
                                                        ""
                                                    }
                                                    <div className='col-sm-2 col-md-3 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>District</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.district}</p>
                                                    </div>
                                                    <div className='col-sm-2 col-md-3 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>State</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.state}</p>

                                                    </div>
                                                    <div className='col-sm-2 col-md-3 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>PIN Code</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.pincode}</p>
                                                    </div>
                                                </div>
                                            } */}

                                                <div className="form-row" id='Eaddressdetails4'>
                                                    <div className='col-4' id='headinglndwl'>
                                                        <div className="two__image" style={{ paddingLeft: "20px", marginLeft: "-10px" }}>
                                                            <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Permanent Address</p>
                                                        </div>
                                                    </div>
                                                    <div className='col' style={{ marginLeft: "-78px", color: "RGBA(5,54,82,1)" }}>
                                                        {(permanentAddressStatus === 0 && permNewAddressStatus === 0) ? "Address verification under process." :
                                                            ((permanentAddressStatus === 1 || permanentAddressStatus === 9) && (permNewAddressStatus === 1 || permNewAddressStatus === 9)) ? <FaCheckCircle style={{ color: "green" }} /> :
                                                                ((permanentAddressStatus === 1 || permanentAddressStatus === 9) && permNewAddressStatus === 0) ? "The uploaded address is currently undergoing verification." :
                                                                    ((permanentAddressStatus === 1 || permanentAddressStatus === 9) && permNewAddressStatus === 2) ? <span><FaCheckCircle style={{ color: "green" }} />&nbsp; <span style={{ color: "orange" }}>The uploaded address details have been rejected, you can prefer old address.</span></span> :
                                                                        (permanentAddressStatus === 2 && permNewAddressStatus === 2) && <span style={{ color: "orange" }}>The uploaded address details have been rejected.</span>
                                                        }
                                                    </div>
                                                </div>
                                                {this.state.paddress1 == "" && this.state.paddress2 == "" && this.state.pstate1 == "" && this.state.pcity == "" ? "Permanent Address are empty, Please add permanent address details from edit button." :
                                                    <div className='row' id='Eaddressdetails5' style={{ marginTop: "-10px" }}>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Address</p>
                                                            <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.paddress1}, {this.state.paddress2}, {this.state.landmark}</p>
                                                        </div>
                                                        <div className='col-sm-4 col-md-6 col-lg-3'>
                                                            <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>State</p>
                                                            <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.pstate1}</p>
                                                        </div>
                                                        <div className='col-sm-4 col-md-6 col-lg-3'>
                                                            <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>District</p>
                                                            <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.pdistrict}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {this.state.ptaluk == "" && this.state.pdistrict == "" && this.state.landmark == "" && this.state.ppincode == "" ? null :
                                                    <div className='row' id='Eaddressdetails6'>
                                                        <div className='col-sm-2 col-md-3 col-lg-2'>
                                                            <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Taluk</p>
                                                            <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.ptaluk}</p>
                                                        </div>
                                                        <div className='col-sm-4 col-md-6 col-lg-2'>
                                                            <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>City</p>
                                                            <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.pcity}</p>
                                                        </div>
                                                        <div className='col-sm-4 col-md-6 col-lg-2'>
                                                            <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>PIN Code</p>
                                                            <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.ppincode}</p>
                                                        </div>
                                                    </div>
                                                }

                                                <div className='row' id='Eaddressdetails7' style={{ display: "none", marginTop: "-14px" }}>
                                                    <button style={myStyle2} id="EaddressdetailBtn">
                                                        <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                                    </button>
                                                    {/* <EvalAddressDetails parentCallback={this.handleCallback} /> */}
                                                </div>
                                            </div>

                                            <div id="bank-details" className=" register-form tab-pane fade" style={{ padding: '30px', cursor: "default" }}>
                                                <div className="row" style={{ marginTop: "-15px" }}>
                                                    <div className='col-11' id="Ebankdetails1" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                        <FaHouseUser style={{ marginTop: "-6px" }} />&nbsp;<span>Bank Info</span>
                                                        <hr style={{ marginTop: "1px" }} />
                                                    </div>
                                                    <div className='col-1'>
                                                        <button className='btn btn-sm' id="EbtnBankdetails" style={{ border: "2px solid RGBA(5,54,82,1)", marginTop: "-8px" }}><FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span></button>
                                                    </div>
                                                </div>
                                                <div className='row' id="Ebankdetails0">
                                                    <div className='float-left'>
                                                        {this.state.isAccountVerified == 0 ? <p><FaTimesCircle style={{ color: "grey" }} />&nbsp;Account Not Verified</p> :
                                                            <span>{this.state.isAccountVerified == 1 ?
                                                                <p><FaCheckCircle style={{ color: "green" }} />&nbsp;Account Verified</p> :
                                                                <p><FaTimesCircle style={{ color: "grey" }} />&nbsp;Account Not Verified</p>}</span>}
                                                    </div>
                                                </div>
                                                <div className='row' id="Ebankdetails2">
                                                    <div className='col-sm-6 col-md-6 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Account Type</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.paccounttype}</p>

                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Account Number</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.paccountno}</p>

                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>IFSC</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.paccountifsc}</p>

                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>UPI ID</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.paccountvpa}</p>
                                                    </div>
                                                </div>

                                                <div className='row' id="Ebankdetails3">
                                                    <div className='col-sm-6 col-md-6 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Branch</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.pbranch}</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>{t('ESCROW Account number')}</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.vpa == "" ? "-" : this.state.vpa}</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>{t('ESCROW UPI ID')}</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.dynamicvpa == "" ? "-" : this.state.dynamicvpa}</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-3'>
                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>{t('ESCROW IFSC Code')}</p>
                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.ifsccode == "" ? "-" : this.state.ifsccode}</p>
                                                    </div>
                                                </div>

                                                <div className='row' id='Ebankdetails4' style={{ display: "none", marginTop: "-4px" }}>
                                                    <button style={myStyle2} id="EbankdetailBtn">
                                                        <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                                    </button>
                                                    <EvalBankDetails parentCallback={this.handleCallback2} />
                                                </div>

                                            </div>
                                            <div id="kyc-documents" className=" register-form tab-pane fade" style={{ padding: '30px', cursor: "default" }}>
                                                {/* <div className="row">
                                                <div className='col-10' style={{ fontFamily: "Poppins", fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                    <FaUserEdit style={{ marginTop: "-6px" }} />&nbsp;<span>KYC Verification</span>
                                                    <hr style={{ marginTop: "1px" }} />
                                                </div>
                                                <div className='col-2'>
                                                    <button style={myStyle2} id="" onClick={this.viewovdFields}>
                                                        <span style={{ textDecoration: "none", color: "white" }}>OVD</span>
                                                    </button>
                                                </div>
                                            </div> */}
                                                <div className="form-group">
                                                    {this.state.isVkycVerified == 0 ? <div className='pt-2'>

                                                        {/* <form name="DigiForm" id="DigiForm" action={digiURL} method="GET" >
                                                        <input type="radio" className="form-check-input" name="u_type" value={sessionStorage.getItem("userType")} style={{ display: "none" }} defaultChecked />
                                                        <input type="number" className="input" name="mobile_no" id="mobile_no" placeholder="Enter Mobile Number" style={{ display: "none" }} value={sessionStorage.getItem("E_Mobile")} />
                                                        <input type="submit" name="submit" value="Verify with Digilocker *" id="digiSubmit" className="btn pl-3 pr-3 pb-2 ml-3 mt-4 mb-2" style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", display: "none" }} />
                                                    </form> */}

                                                        <div className="row" style={{ fontSize: "16px" }}>
                                                            <div className="col" style={{ textAlign: "center" }}>
                                                                <p className="text-primary"><FaTimesCircle style={{ color: "grey" }} />&nbsp;Your KYC is not verified.</p>
                                                            </div>
                                                        </div>
                                                        <div className='row' style={{ fontSize: "14px" }}>
                                                            <div className="col" style={{ textAlign: "center" }}>
                                                                <button type="button" className="btn" id="digisubmit4"
                                                                    style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", borderRadius: "10px" }} onClick={this.alertKYC}>Initiate VKYC Request *</button>
                                                                {/* &nbsp;

                                                            <button type="button" className="btn" id="" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample"
                                                                style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", borderRadius: "10px", paddingLeft: "35px", paddingRight: "35px" }} onClick={this.viewovdFields}>Document Verification</button> */}
                                                            </div>
                                                        </div>
                                                        <div className='row' style={{ fontSize: "16px" }}>
                                                            <div className="col" style={{ textAlign: "center" }}>
                                                                <p className="text-primary">*Note: The Video KYC {`(VKYC)`} is a required verification process to activate your account. Your request will be queued. Based on the availability, authorized staff member will connect with you to carry out verification.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        : <span>{this.state.isVkycVerified == 1 ? <div><FaCheckCircle style={{ color: "green" }} />KYC Verified</div> :
                                                            <p className="text-primary"><FaTimesCircle style={{ color: "grey" }} />&nbsp;Your KYC is not verified.</p>}</span>
                                                    }
                                                </div>
                                            </div>
                                            <div id="ovd-documents" className=" register-form tab-pane fade" style={{ padding: '20px', cursor: "default" }}>
                                                <div className="form-group">
                                                    <div>
                                                        <div className='row' style={{ marginTop: "-15px" }}>
                                                            <div className='col-10' style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                                <FaUserEdit style={{ marginTop: "-6px" }} />&nbsp;<span>Documents</span>
                                                                <hr style={{ marginTop: "1px" }} />
                                                            </div>
                                                            <div className='col-2' style={{ textAlign: "end", display: "none" }}>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm text-white"
                                                                    onClick={() => this.getPoaDetails("ovd")}
                                                                    style={{
                                                                        backgroundColor: "#0079bf",
                                                                        paddingLeft: "10px", paddingRight: "10px"
                                                                    }}>
                                                                    <FaFolderPlus />
                                                                    &nbsp;
                                                                    {t("Upload OVD")}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="accordion accordion-flush" id="accordionFlushExample">
                                                        <div className="row mb-2">
                                                            <div className="col">
                                                                <div class="accordion-item" style={{ border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                                    <div class="accordion-header" id="flush-headingThree">
                                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(5, 54, 82)", fontWeight: "600" }}
                                                                            data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                                                            OVD Documents List
                                                                        </button>
                                                                    </div>
                                                                    <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                                                        <div class="accordion-body">
                                                                            <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)" }}>
                                                                                <div className='col-2'>
                                                                                    <p style={{ fontWeight: "600", marginLeft: "14px" }}>{t('OVD Code')}</p>
                                                                                </div>
                                                                                <div className='col-2'>
                                                                                    <p style={{ fontWeight: "600" }}>{t('Mobile No.')}</p>
                                                                                </div>
                                                                                <div className='col-2'>
                                                                                    <p style={{ fontWeight: "600" }}>{t('Created On')}</p>
                                                                                </div>
                                                                                <div className='col-2'>
                                                                                    <p style={{ fontWeight: "600" }}>{t('Status')}</p>
                                                                                </div>
                                                                                <div className='col-2'>
                                                                                    <p style={{ fontWeight: "600" }}>{t('Reviewed by')}</p>
                                                                                </div>
                                                                                <div className='col-2'>
                                                                                    <p style={{ fontWeight: "600", marginLeft: "-30px" }}>{t('Reject Reason')}</p>
                                                                                </div>
                                                                            </div>
                                                                            <hr className="col-12" style={{ width: "96.5%", marginTop: "-10px" }} />
                                                                            <>
                                                                                {
                                                                                    this.state.ovdList == "" ?
                                                                                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                                                            <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                                                                <p>No Requests Available !</p>
                                                                                            </div>
                                                                                        </div> : <>

                                                                                            {
                                                                                                this.state.ovdList.map((Lists, index) => {
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
                                                                                                                            <p style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px", marginLeft: "-5px" }}>{Lists.createdon && Lists.createdon.split("-").reverse().join("-")}</p>
                                                                                                                        </div>
                                                                                                                        <div className="col-2">
                                                                                                                            <p className="" style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>{Lists.status == 0 ? "Not Verified" : <span>{Lists.status == 1 ? "Approved" : <span>{Lists.status == 2 ? "Rejected" : ""}</span>}</span>}</p>
                                                                                                                        </div>
                                                                                                                        <div className="col-2">
                                                                                                                            <p className="" style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>{Lists.reviewedby ? Lists.reviewedby : "-"}</p>
                                                                                                                        </div>
                                                                                                                        <div className="col-1" style={{ textAlign: "" }}>
                                                                                                                            <p className="" style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px", marginLeft: "-25px" }}>{Lists.rejectreason ? Lists.rejectreason : "-"}&nbsp;
                                                                                                                                {/* <span onClick={this.deleteOvdModal} style={{ cursor: "pointer" }}><FaRegTrashAlt style={{ color: "grey" }} /></span> */}
                                                                                                                            </p>
                                                                                                                        </div>
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
                                                                                                            pageCount={this.state.pageCount}
                                                                                                            onPageChange={this.handlePageClick}
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
                                                                <div class="accordion-item" style={{ border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                                    <div class="accordion-header" id="flush-headingTwo">
                                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(5, 54, 82)", fontWeight: "600" }}
                                                                            data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                                                            Uploaded Documents                                                                    </button>
                                                                    </div>
                                                                    <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                                                        <div class="accordion-body">
                                                                            <>
                                                                                <div className='row'>
                                                                                    {this.state.viewImageLists && this.state.viewImageLists.map((list, index) => {
                                                                                        return (
                                                                                            <div className='col-lg-3 col-md-6 col-sm-12 mb-2' key={index}>
                                                                                                <button type="button" className="btn"
                                                                                                    style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", borderRadius: "10px" }}
                                                                                                    onClick={this.viewPOAImage.bind(this, list)}>
                                                                                                    <FaEye style={{ marginTop: "-4px" }} />&nbsp;
                                                                                                    <Tooltip title={list.docname}>
                                                                                                        <span>
                                                                                                            {typeof list.docname === 'string'
                                                                                                                ? list.docname.substring(0, 10) + ".."
                                                                                                                : ''}
                                                                                                        </span>
                                                                                                    </Tooltip>
                                                                                                </button>
                                                                                            </div>
                                                                                        )
                                                                                    })}

                                                                                </div>
                                                                            </>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="set-pin" className=" register-form tab-pane fade" style={{ padding: '20px', cursor: "default" }}>
                                                <>
                                                    {MPINFlag == "1" ?
                                                        <>
                                                            <div className='row' id='pinmgmtField'>
                                                                <div className='col'>
                                                                    <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)", fontSize: "18px" }}><FaUserLock />&nbsp;Pin Management</p>
                                                                    <hr style={{ marginTop: "-14px" }} />
                                                                </div>
                                                            </div>
                                                            <div id='setMpinBtn' className='row'>
                                                                <div className='col-4'>
                                                                    <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)", fontSize: "16px" }}>Enable/Disable PIN &nbsp;
                                                                        {/* <BootstrapSwitchButton
                                                                        checked={status == "1" ? true : false}
                                                                        onlabel='Enable'
                                                                        offlabel='Disable'
                                                                        onstyle="primary"
                                                                        offstyle="secondary"
                                                                        width={90}
                                                                        height={20}
                                                                        borderRadius={30}
                                                                        onChange={this.getAuthMode.bind(this, status)}
                                                                    /> */}
                                                                        <div class="form-check form-switch">
                                                                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
                                                                                checked={this.state.checkStatus === "1" || this.state.checkStatus === "2"}
                                                                                onChange={this.getAuthMode} />
                                                                            <label class="form-check-label" for="flexSwitchCheckDefault">
                                                                            </label>
                                                                        </div>
                                                                    </p>

                                                                </div>
                                                                <div className='col-4' id='setMpinBtn2' style={{ display: "none" }}>
                                                                    <p style={{
                                                                        color: "#00264d",
                                                                        fontWeight: "bold",
                                                                        fontSize: "16px"
                                                                    }}>Set Transaction based on</p>
                                                                    <div className='row' onChange={this.pinType}>
                                                                        <div className="col" style={{ color: "#00264d" }}>
                                                                            <input
                                                                                className="radio"
                                                                                type="radio"
                                                                                id="pinBased"
                                                                                name="radio"
                                                                                value="1"
                                                                            />
                                                                            PIN based
                                                                        </div>
                                                                        <div className="col" style={{ color: "#00264d" }}>
                                                                            <input
                                                                                className="radio"
                                                                                type="radio"
                                                                                id="otpBased"
                                                                                name="radio"
                                                                                value="2"
                                                                            />
                                                                            OTP based
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='col-4'>
                                                                    <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)", fontSize: "16px" }}>Change Transaction PIN &nbsp;<BsIcons.BsFillCaretDownSquareFill onClick={this.enableSetMpin} style={{ cursor: "pointer" }} /></p>
                                                                    {/* <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079bf" }} >Set Transaction PIN</button> */}
                                                                </div>
                                                            </div>
                                                            <div id='viewSetMpinFields' style={{ display: "none" }}>
                                                                <div className="row">
                                                                    <div className='col-9' style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                                        <FaUserEdit style={{ marginTop: "-6px" }} />&nbsp;<span>Change PIN</span>
                                                                        <hr style={{ marginTop: "1px" }} />
                                                                    </div>
                                                                    <div className='col-3' style={{ textAlign: "end" }}>
                                                                        <button className='btn btn-sm text-white' id='setTxnSubmitBtn' style={{ backgroundColor: "rgb(136, 189, 72)", marginTop: "-8px" }}
                                                                            onClick={this.settransactionPin}><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Submit</span></button>
                                                                        &nbsp;
                                                                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", marginTop: "-8px" }}
                                                                            onClick={this.canceltransactionPin}><span>Cancel</span></button>
                                                                    </div>
                                                                </div>

                                                                <div className='row'>
                                                                    <div className='col-4' id='mPIN'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Enter PIN</p>
                                                                        <input type={isPasswordShown ? "text" : "password"} name='enterPin' id='enterPin' className="form-control" onChange={this.enterMPIN}
                                                                            style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                                            placeholder="Enter Pin" />
                                                                        <span className={`fa ${isPasswordShown ? "fa-eye errspan" : "fa-eye-slash errspan"}`}
                                                                            onClick={this.togglePasswordVisiblity} ></span>
                                                                        {(this.state.invalidMpin) ? <span className='text-danger'>Invalid PIN</span> : ''}
                                                                    </div>
                                                                    <div className='col-4' id='cnfMPIN'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Confirm PIN</p>
                                                                        <input type={isPasswordShown2 ? "text" : "password"} name='confirm-pin' id='confirmPin' className="form-control" onChange={this.confirmMPIN}
                                                                            style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                                            placeholder="Confirm Pin" />
                                                                        <span className={`fa ${isPasswordShown2 ? "fa-eye errspan" : "fa-eye-slash errspan"}`}
                                                                            onClick={this.togglePasswordVisiblity2} ></span>
                                                                        {(this.state.invalidcnfMpin) ? <span className='text-danger'>Invalid PIN</span> : ''}
                                                                    </div>
                                                                    <div className='col-2' style={{ paddingTop: "40px" }} id='getMPINOtp'>
                                                                        <button className='btn btn-sm text-white' id='getOtpforMpin' style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                                            onClick={this.getTransactionPinOtp}><span>Get OTP</span></button>
                                                                    </div>
                                                                    <div className='col-4' style={{ display: "none" }} id='mpinMOTP'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Mobile OTP</p>
                                                                        <input type="number" className="form-control" id='mobileOtp' onChange={this.MPINotp}
                                                                            style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                                            placeholder="Enter Mobile OTP" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        :
                                                        <>{MPINFlag == "2" ?
                                                            <>
                                                                <div className='row'>
                                                                    <div className='col'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)", fontSize: "18px" }}><FaUserLock />&nbsp;Pin Management</p>
                                                                        <hr style={{ marginTop: "-14px" }} />
                                                                    </div>
                                                                </div>
                                                                <div id='setMpinBtn' className='row'>
                                                                    <div className='col-4'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)", fontSize: "16px" }}>Enable/Disable PIN &nbsp;
                                                                            {/* <BootstrapSwitchButton
                                                                            checked={status == "1" ? true : false}
                                                                            onlabel='Enable'
                                                                            offlabel='Disable'
                                                                            onstyle="primary"
                                                                            offstyle="secondary"
                                                                            width={90}
                                                                            height={20}
                                                                            borderRadius={30}
                                                                            onChange={this.getAuthMode.bind(this, status)}
                                                                        /> */}
                                                                            <div class="form-check form-switch">
                                                                                <input class="form-check-input" type="checkbox" role="switch"
                                                                                    checked={this.state.checkStatus === "1" || this.state.checkStatus === "2"}
                                                                                    id="flexSwitchCheckDefault" onChange={this.getAuthMode} />
                                                                                <label class="form-check-label" for="flexSwitchCheckDefault">
                                                                                </label>
                                                                            </div>
                                                                        </p>

                                                                    </div>
                                                                    <div className='col-4' id='setMpinBtn2' style={{ display: "none" }}>
                                                                        <p style={{
                                                                            color: "#00264d",
                                                                            fontWeight: "bold",
                                                                            fontSize: "16px"
                                                                        }}>Set Transaction based on</p>
                                                                        <div className='row' onChange={this.pinType}>
                                                                            <div className="col" style={{ color: "#00264d" }}>
                                                                                <input
                                                                                    className="radio"
                                                                                    type="radio"
                                                                                    id="pinBased"
                                                                                    name="radio"
                                                                                    value="1"
                                                                                />
                                                                                PIN based
                                                                            </div>
                                                                            <div className="col" style={{ color: "#00264d" }}>
                                                                                <input
                                                                                    className="radio"
                                                                                    type="radio"
                                                                                    id="otpBased"
                                                                                    name="radio"
                                                                                    value="2"
                                                                                />
                                                                                OTP based
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-4'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)", fontSize: "16px" }}>Set Transaction PIN &nbsp;<BsIcons.BsFillCaretDownSquareFill onClick={this.enableSetMpin} style={{ cursor: "pointer" }} /></p>
                                                                        {/* <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079bf" }} >Set Transaction PIN</button> */}
                                                                    </div>
                                                                </div>
                                                                <div id='viewSetMpinFields' style={{ display: "none" }}>
                                                                    <div className="row">
                                                                        <div className='col-9' style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                                            <FaUserEdit style={{ marginTop: "-6px" }} />&nbsp;<span>Set PIN</span>
                                                                            <hr style={{ marginTop: "1px" }} />
                                                                        </div>
                                                                        <div className='col-3' style={{ textAlign: "end" }}>
                                                                            <button className='btn btn-sm text-white' id='setTxnSubmitBtn' style={{ backgroundColor: "rgb(136, 189, 72)", marginTop: "-8px" }}
                                                                                onClick={this.settransactionPin}><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Submit</span></button>
                                                                            &nbsp;
                                                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", marginTop: "-8px" }}
                                                                                onClick={this.canceltransactionPin}><span>Cancel</span></button>
                                                                        </div>
                                                                    </div>

                                                                    <div className='row'>
                                                                        <div className='col-4' id='mPIN'>
                                                                            <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Enter PIN</p>
                                                                            <input type={isPasswordShown ? "text" : "password"} name='enterPin' id='enterPin' className="form-control" onChange={this.enterMPIN}
                                                                                style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                                                placeholder="Enter Pin" />
                                                                            <span className={`fa ${isPasswordShown ? "fa-eye errspan" : "fa-eye-slash errspan"}`}
                                                                                onClick={this.togglePasswordVisiblity} ></span>
                                                                            {(this.state.invalidMpin) ? <span className='text-danger'>Invalid PIN</span> : ''}
                                                                        </div>
                                                                        <div className='col-4' id='cnfMPIN'>
                                                                            <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Confirm PIN</p>
                                                                            <input type={isPasswordShown2 ? "text" : "password"} name='confirm-pin' id='confirmPin' className="form-control" onChange={this.confirmMPIN}
                                                                                style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                                                placeholder="Confirm Pin" />
                                                                            <span className={`fa ${isPasswordShown2 ? "fa-eye errspan" : "fa-eye-slash errspan"}`}
                                                                                onClick={this.togglePasswordVisiblity2} ></span>
                                                                            {(this.state.invalidcnfMpin) ? <span className='text-danger'>Invalid PIN</span> : ''}
                                                                        </div>
                                                                        <div className='col-2' style={{ paddingTop: "40px" }} id='getMPINOtp'>
                                                                            <button className='btn btn-sm text-white' id='getOtpforMpin' style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                                                onClick={this.getTransactionPinOtp}><span>Get OTP</span></button>
                                                                        </div>
                                                                        <div className='col-4' style={{ display: "none" }} id='mpinMOTP'>
                                                                            <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Mobile OTP</p>
                                                                            <input type="number" className="form-control" id='mobileOtp' onChange={this.MPINotp}
                                                                                style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                                                placeholder="Enter Mobile OTP" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </> :
                                                            <>
                                                                <div className="row">
                                                                    <div className='col-9' style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                                                        <FaUserEdit style={{ marginTop: "-6px" }} />&nbsp;<span>Set PIN</span>
                                                                        <hr style={{ marginTop: "1px" }} />
                                                                    </div>
                                                                    <div className='col-3' style={{ textAlign: "end" }}>
                                                                        <button className='btn btn-sm text-white' id='setTxnSubmitBtn' style={{ backgroundColor: "rgb(136, 189, 72)", marginTop: "-8px" }}
                                                                            onClick={this.settransactionPin}><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Submit</span></button>
                                                                        &nbsp;
                                                                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", marginTop: "-8px" }}
                                                                        ><span>Cancel</span></button>
                                                                    </div>
                                                                </div>

                                                                <div className='row'>
                                                                    <div className='col-4' id='mPIN'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Enter PIN</p>
                                                                        <input type={isPasswordShown ? "text" : "password"} name='enterPin' id='enterPin' className="form-control" onChange={this.enterMPIN}
                                                                            style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                                            placeholder="Enter Pin" />
                                                                        <span className={`fa ${isPasswordShown ? "fa-eye errspan" : "fa-eye-slash errspan"}`}
                                                                            onClick={this.togglePasswordVisiblity} ></span>
                                                                        {(this.state.invalidMpin) ? <span className='text-danger'>Invalid PIN</span> : ''}
                                                                    </div>
                                                                    <div className='col-4' id='cnfMPIN'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Confirm PIN</p>
                                                                        <input type={isPasswordShown2 ? "text" : "password"} name='confirm-pin' id='confirmPin' className="form-control" onChange={this.confirmMPIN}
                                                                            style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                                            placeholder="Confirm Pin" />
                                                                        <span className={`fa ${isPasswordShown2 ? "fa-eye errspan" : "fa-eye-slash errspan"}`}
                                                                            onClick={this.togglePasswordVisiblity2} ></span>
                                                                        {(this.state.invalidcnfMpin) ? <span className='text-danger'>Invalid PIN</span> : ''}
                                                                    </div>
                                                                    <div className='col-2' style={{ paddingTop: "40px" }} id='getMPINOtp'>
                                                                        <button className='btn btn-sm text-white' id='getOtpforMpin' style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                                            onClick={this.getTransactionPinOtp}><span>Get OTP</span></button>
                                                                    </div>
                                                                    <div className='col-4' style={{ display: "none" }} id='mpinMOTP'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Mobile OTP</p>
                                                                        <input type="number" className="form-control" id='mobileOtp' onChange={this.MPINotp}
                                                                            style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                                            placeholder="Enter Mobile OTP" />
                                                                    </div>
                                                                </div>
                                                            </>}

                                                        </>
                                                    }
                                                </>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    {/* <div className="container-fluid row" style={{ paddingLeft: "86px", marginTop: "-33px" }}>
                        <div className='card' id='EvlcardC'>

                        </div>
                    </div> */}

                    {/* POA */}
                    <button type="button" id="poaModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter29" style={{ display: "none" }}>
                        POA modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter29" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content" id='uploadOvdDocFirst'>
                                <div class="modal-body" style={{ cursor: "default" }}>
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Please Provide The Required Documents</p>
                                            <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
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
                                            <button className='btn btn-sm text-white' id='getFormDetailsNextBtn' style={{ backgroundColor: "rgb(136, 189, 72)", paddingLeft: "15px", paddingRight: "15px" }} onClick={this.getFormDetails}>Next</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-content" id='submitOvdFirst' style={{ display: "none" }}>
                                <div class="modal-body" style={{ cursor: "default" }}>
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Please Fill The Form</p>
                                            <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
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
                                            {this.state.ovdFlagTrue === true ?
                                                <button className='btn btn-sm text-white' id='submitFirstForm1' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setFormTxndata}>Submit</button>
                                                : <button className='btn btn-sm text-white' id='submitFirstForm' style={{ backgroundColor: "rgb(136, 189, 72)", paddingLeft: "15px", paddingRight: "15px" }} onClick={this.getAddressFormDetails}>Next</button>
                                            }&nbsp;
                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", paddingLeft: "15px", paddingRight: "15px" }} onClick={this.canceSaveFormTxnData}>Back</button>
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
                                            <button className='btn btn-sm text-white' id="secondFormBtn" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.poaFormTxnDataSubmit}>Submit</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} onClick={this.cancelPoaFormTxnSubmit}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* VKYC Alert */}
                    <button type="button" id='VKYCAlertModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        VKYC Alert
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
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
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getKYC}>Proceed</button>
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
                    {/* Pdf preview */}
                    <button type="button" id='launchColl' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>

                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <iframe src="" className="PDFdoc" type="application/pdf" style={{ overflow: "auto", height: "100vh", width: "100%" }}>

                                </iframe>
                                <div className='pt-2' style={{ textAlign: "end", paddingRight: "15px" }}>
                                    {/* <button type="button" class="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setDocumentToDownload}>Download</button>
                                    &nbsp; */}
                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MPINStatus Modal */}
                    <button id='mpinStatusModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter6">
                    </button>
                    <div className="modal fade" id="exampleModalCenter6" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" id='theModalContent' style={{ marginLeft: "" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Transaction Status</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div style={{ display: "" }} className="col">
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile OTP</p>
                                                    <input className='form-control' type='number' placeholder='Enter OTP' id='setTxnStatusBtn' onChange={this.MPINStatusotp}
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
                                            <button type="button" class="btn text-white btn-sm"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} data-dismiss="modal" onClick={this.setTransactionpinStatus}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* delete OVD UI */}
                    <button type="button" id="deleteUpldOvdmodal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3" style={{ display: "none" }}>
                        delete OVD modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
                                            <select className='form-select' style={{ marginTop: "-10px" }} ref={this.selectRef1} onChange={this.ovdDelPageType}>
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
                    <button type="button" id="viewUpldOvdmodal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter4" style={{ display: "none" }}>
                        view OVD modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter4" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLongTitle" style={{ color: "#00264d" }}>View OVD Image</h5>
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

                    {/* Password expiry */}
                    <button type="button" id='passwordExpModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter13">
                        Password expiry modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter13" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header" style={{ marginBottom: "-20px" }}>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <dvi class="modal-body" style={{ marginBottom: "-20px" }}>
                                    <img src={resetPw} style={{ width: "80px" }} />
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>
                                        You have become privilege customer. please Logout and Login to access all the features.
                                    </p>
                                </dvi>
                                <div class="modal-footer">
                                    <button type="button" class="btn text-white"
                                        style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.Logout}>
                                        Okay
                                    </button>
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
                </div>
            </div >
        )
    }
}

export default withTranslation()(EvaluatorDetails)