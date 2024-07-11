import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RangeStepInput } from 'react-range-step-input';
import { BASEURL } from '../assets/baseURL';
import BorrowerSidebar from '../../SidebarFiles/BorrowerSidebar';
import $ from 'jquery';
import SimpleReactValidator from 'simple-react-validator';
import { confirmAlert } from "react-confirm-alert";
import i18n from "i18next";
import { withTranslation } from 'react-i18next';
import dashboardIcon from '../assets/icon_dashboard.png';
import { FaAngleLeft, FaThumbsUp, FaRegEdit, FaRegFileAlt, FaCheckCircle, FaTimesCircle, FaRegTrashAlt, FaRegUser, FaUserPlus } from "react-icons/fa";
import { BsInfoCircle, BsArrowRepeat } from "react-icons/bs";
import './LoanRequest.css';
import batch from '../assets/batch.png';
import editRole from '../assets/editRole.png';
import Loader from '../Loader/Loader';
import ConsentModal from './ConsentModal';
import { talukFlagED } from '../assets/Constant';
import step1 from '../assets/number-one.png';
import step2 from '../assets/number-2.png';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
const dt = new DataTransfer();
var array1 = [];
var list;
var consentData;
var consentID;
var consentType;
var consentStatus;

var formDatas;
var dataList = [];
var jsonForm;
var isCollReq;

var extractedData;
var isStmtReq = "0";
var isDsbToSuppReq = "0"
var firstarray = [];
var documentsuploaded = "0";
class LoanRequest extends Component {
    constructor() {
        super();
        this.state = {
            borrowerid: "",
            productid: "",
            loanamtrequested: "",
            loanpurpose: "",
            noofrepayments: "",
            repaymentfrequency: "1",
            documentsuploaded: "0",
            facilitatorid: "",
            aaid: "",
            value: 25,
            productList: [],
            minloan: "",
            maxloan: "",
            minterm: "",
            maxterm: "",
            reptext: "",
            loanPurposeDetails: [],
            getattributes: [],

            documentNumber: "",
            cibil: "",
            uploadedFiles: "",
            file: "",

            // Collateral
            collateralDocList: [],
            isCollateralId: "",
            collDataLists: [],

            collateralUploaded: false,

            docuStatus: "",

            consentMode: "",
            consentOtp: "",
            consentMRef: "",
            consentData: "",

            dynamicFormFlag: "0",
            formDetailList: [],
            formFieldLists: [],

            formCategory: "",
            formType: "",

            errorMessages: {},
            isTextDisabled: true,
            validationError: "",
            validationErrorAmt: "",
            selectedFile: null,


            // jlg members
            dropdownText: 'Select Group',
            selectedCount: 0,
            selectedIndexes: [],

            encryptData: "",
            mobileRef: "",
            mobileOTP: "",

            productName: "",
            loanPurpose: "",

            showPopover: null,
            loanPurposeGroupList: [],
            groupList: [],
            groupID: "",
            finalProductList: [],
            showLoader: false,
            unCheck: false,
            showModal: false,

            //Taluk Flag
            talukFlag: talukFlagED,
            selectedFiles: [],

            officeDistList: [],
            officeDistListCalled: false,
            officeDistListFirst: [],
            distcode: '',
            distcodeForList1: '',
            officeDistListSecond: [],
            officeid: '',

            supplierLists: [],
            selectedSupplier: "",
            supplierName: "",
            collateralndFormSaved: "",
            commonSupplierName: "",

            //Add References
            refName: "",
            refMobileno: "",
            refEmail: "",
            refMembers: [],
            errors: {
                refMobileno: "",
                refEmail: "",
            },
            maxReferences: 2,
            isJLGLoan: "0"
        }
        this.borrowerid = this.borrowerid.bind(this);
        this.loanamtrequested = this.loanamtrequested.bind(this);
        this.loanpurpose = this.loanpurpose.bind(this);
        this.noofrepayments = this.noofrepayments.bind(this);
        this.repaymentfrequency = this.repaymentfrequency.bind(this);
        this.facilitatorid = this.facilitatorid.bind(this);
        this.aaid = this.aaid.bind(this);
        this.loanRequest = this.loanRequest.bind(this);
        this.value = this.value.bind(this);
        this.getProductList = this.getProductList.bind(this);
        this.getLoanPurpose = this.getLoanPurpose.bind(this);
        this.validator = new SimpleReactValidator();
        this.getPersonalDetails = this.getPersonalDetails.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.addMembers = this.addMembers.bind(this);
        this.delNewMember = this.delNewMember.bind(this);
        this.setRefMembers = this.setRefMembers.bind(this);
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            if (sessionStorage.getItem("Bp2pDue") <= 0.00) {
                console.log(sessionStorage.getItem('token'));
                console.log(sessionStorage.getItem('userID'));
                this.loanPurposeGroupDetails();

                // this.getAvailableProduct();

                // this.getProductList();
                this.getPersonalDetails();
                this.getGroupInfo()

                $("#submitBtn").prop('disabled', true);
                $("#chkPassport").click(function () {
                    if ($(this).is(":checked")) {
                        $("#dvPassport").hide();
                        $('#uploadBtn').show();
                    } else {
                        $("#dvPassport").show();
                        $('#uploadBtn').hide();
                    }
                });
                $("#chkPassport").prop('disabled', true);
                $("#uploadBtn").prop('disabled', true);
                $("#otpSubmitBtn").prop('disabled', true)
            } else {
                confirmAlert({
                    message: "Please clear Platform Due.",
                    buttons: [
                        {
                            label: "Okay",
                            onClick: () => {
                                // $("#borDashboard").click()

                                // this.getProductList();
                                // this.getPersonalDetails();
                                // this.getGroupInfo()

                                // $("#submitBtn").prop('disabled', true);
                                window.location = "/borrowerdashboard";
                            }
                        }
                    ],
                    closeOnClickOutside: false,
                })
                console.log(sessionStorage.getItem('token'));
                console.log(sessionStorage.getItem('userID'));
            }
        } else {
            window.location = '/login'
        }
        this.setState({ loanamtrequested: this.state.minloan })
        this.setState({ noofrepayments: this.state.minterm })
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
                    this.setState({ getattributes: resdata.msgdata.attributes });
                    $('#Launch').click();
                }
                else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    borrowerid(event) {
        this.setState({ borrowerid: event.target.value })
    }
    loanPurposeGroupDetails = () => {
        fetch(BASEURL + '/lms/getloanpurposegroup', {
            method: 'GET',
            headers: {

                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Response:', response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({ loanPurposeGroupList: resdata.msgdata })
                } else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
    }
    loanpurposeGroup = (event) => {
        console.log(event.target.value);
        this.setState({ purposeGroup: event.target.value })
        this.loanPurposeFirst(event.target.value);
        $("#loanCategory").hide();
        $("#hiddenField").hide();

        this.setState({ unCheck: false })
        $(".selectedPurpose").prop("checked", false);
    }
    loanPurposeFirst = (purposeGroup) => {
        fetch(BASEURL + '/lms/getloanpurpose?loanpurposegroup=' + purposeGroup, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({ loanPurposeDetails: resdata.msgdata });
                    $("#loanPurposeID").show();
                } else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                    $("#loanPurposeID").hide();
                    this.setState({ loanPurposeDetails: [] });
                }
            }).catch(err => {
                console.log(err.message)
            })
    }
    selectedLoanPurpose = (event) => {
        this.setState({ unCheck: true });
        this.setState({ loanpurpose: event.target.value });
        console.log(this.state.loanPurposeDetails);
        this.state.loanPurposeDetails.filter((e) => e.loanpurposeid == event.target.value)
            .map((prdt, index) => {
                this.setState({ loanPurpose: prdt.loanpurpose });
                console.log(prdt.loanpurpose)
            })
        console.log(this.state.loanPurpose);
        this.getAvailableProduct(event.target.value);
        $(".selectedProduct").prop("checked", false);
    }
    getAvailableProduct = (loanpurpose) => {
        fetch(BASEURL + '/lsp/getavailableproductsofloanpurpose?loanpurposeid=' + loanpurpose, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata);
                    firstarray = resdata.msgdata;

                    this.getProductList();
                } else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click();
                    $("#loanCategory").hide()
                    $("#hiddenField").hide();
                }
            }).catch(err => {
                console.log(err.message)
            })
    }
    getProductList = () => {
        console.log(firstarray)

        fetch(BASEURL + '/lsp/getloanproductlist', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    var responseList = resdata.msgdata;
                    this.setState({
                        repaymentfrequency: responseList.repaymentfrequency,
                        minloan: responseList.minloanamount,
                        maxloan: responseList.maxloanamount,
                        minterm: responseList.minnoofrepayments,
                        maxterm: responseList.maxnoofrepayments,
                        reptext: responseList.repaymentfrequencydesc,
                        productName: responseList.prodname
                    })
                    console.log(firstarray)
                    var firstArray = firstarray;
                    var secondArray = resdata.msgdata;
                    console.log(firstArray, secondArray);
                    var newArray = secondArray.filter(item =>
                        firstArray.some(
                            firstItem => firstItem && item && item.prodid === firstItem.productid
                        )
                    );
                    console.log(newArray);
                    this.setState({ finalProductList: newArray });

                    $("#loanCategory").show()
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
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click()
                        $("#loanCategory").hide()
                        $("#hiddenField").hide();
                        this.setState({ finalProductList: [] });
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    productid = (event, isstmtrequired, prodid, disbursetosupplier, collateralrequired) => {
        $("#hiddenField").show();
        console.log(isstmtrequired, disbursetosupplier, collateralrequired);
        var stmtVar = isstmtrequired;
        var disbToSupp = disbursetosupplier;
        var isCollateralReq = collateralrequired;
        isStmtReq = stmtVar;
        isDsbToSuppReq = disbToSupp;
        if (isStmtReq == "0") {
            //Disable the Stmt Upload
            $("#chkPassport").prop('disabled', true);
            $("#uploadBtn").prop('disabled', true);
            $("#submitBtn").prop('disabled', false);
            console.log("Execu1")
        } else if (isStmtReq == "1") {
            //Enable the Stmt Upload
            $("#chkPassport").prop('disabled', false);
            $("#uploadBtn").prop('disabled', false);
            console.log("Execu2")
        }

        if (isDsbToSuppReq == "0") {
            $("#isDisbSupplierReq").hide()
        } else if (isDsbToSuppReq == "1") {
            this.getSuppliersList()
            $("#isDisbSupplierReq").show()
        }
        this.setState({ productid: event.target.value })
        console.log(event.target.value)
        this.state.finalProductList
            .filter((e) => e.prodid == event.target.value)
            .map((prdt, index) => {
                this.setState({
                    repaymentfrequency: prdt.repaymentfrequency,
                    minloan: prdt.minloanamount,
                    maxloan: prdt.maxloanamount,
                    minterm: prdt.minnoofrepayments,
                    maxterm: prdt.maxnoofrepayments,
                    reptext: prdt.repaymentfrequencydesc,
                    productName: prdt.prodname
                })
                // this.getLoanPurpose(event.target.value);
            })
        console.log("repayment " + this.state.repaymentfrequency)
        console.log("Min Loan " + this.state.minloan)
        console.log("Max Loan " + this.state.maxloan)

        //this.getFormDetails(event.target.value);

        if (isCollateralReq === "1") {
            isCollReq = "1";
            this.getFormDetails(event.target.value);
            $("#submitBtn").prop('disabled', true);
        } else {
            this.setState({ formFieldLists: [] });
            isCollReq = "0";
        }
    }
    checkLoanEligibility = () => {
        fetch(BASEURL + '/lsp/getloaneligibility?productid=' + this.state.productid, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata.message);
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                } else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getFormDetails = (event) => {
        fetch(BASEURL + '/lsp/getformdetails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                category: "LOAN",
                type: event
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
                    var formID;
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
                        console.log(this.state.formFieldLists)
                        $("#finalSubmitBtn").prop('disabled', true)
                    })
                } else {
                    $("#finalSubmitBtn").prop('disabled', false)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    cibil = (event) => {
        this.setState({ cibil: event.target.value })
    }
    loanamtrequested(event) {
        // this.setState({ loanamtrequested: event.target.value })
        console.log(this.state.loanpurpose)

        var newAmt = parseInt(event.target.value);
        var { minloan, maxloan } = this.state;

        if (newAmt < minloan || newAmt > maxloan) {
            this.setState({ validationErrorAmt: `Amount must be between ${minloan} and ${maxloan}` });
        } else {
            this.setState({ validationErrorAmt: null, loanamtrequested: newAmt });
        }
        console.log(this.state.loanamtrequested)
    }
    loanpurpose(event) {
        this.setState({ loanpurpose: event.target.value })
        console.log(event.target.value);
        var details;
        this.state.loanPurposeDetails.forEach((e) => {
            details = e.details;
            console.log(details);
            details.filter((data) => data.loanpurposeid == event.target.value)
                .map((prdt, index) => {
                    this.setState({ loanPurpose: prdt.loanpurpose })
                })
        })

    }

    noofrepayments(event) {
        // this.setState({ noofrepayments: event.target.value })
        var newTenure = parseInt(event.target.value);
        var { minterm, maxterm, reptext } = this.state;

        if (newTenure < minterm || newTenure > maxterm) {
            this.setState({ validationError: `Tenure must be between ${minterm} and ${maxterm} ${reptext}` });
        } else {
            this.setState({ validationError: null, noofrepayments: newTenure });
        }
        console.log(this.state.noofrepayments)

    }
    repaymentfrequency(event) {
        this.setState({ repaymentfrequency: event.target.value })
    }
    documentsuploaded = () => {
        this.setState({ docuStatus: "1" })
        this.setState({ documentsuploaded: "1" });
        documentsuploaded = "1";
        console.log(documentsuploaded);
    }
    facilitatorid(event) {
        this.setState({ facilitatorid: event.target.value })
    }

    aaid(event) {
        this.setState({ aaid: event.target.value })
        $("#submitBtn").prop('disabled', false);
    }

    value(event) {
        this.setState({ value: event.target.value })
    }
    uploadDocument = () => {
        $("#bankStmtModal").click();
    }
    //disbursetosupplier
    validateTenure() {
        const { noofrepayments, minterm, maxterm } = this.state;
        if (noofrepayments < minterm || noofrepayments > maxterm) {
            return <p className="text-danger">Tenure must be between {minterm} and {maxterm}</p>;
        }
        return null; // No error message
    }
    getCollateral = () => {
        console.log(this.state.productid)
        fetch(BASEURL + `/lsp/getloancollateraldoclist?productid=${this.state.productid}`, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Response:', response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({ collateralDocList: resdata.msgdata })
                    $("#collateralModal").click();
                } else {
                    alert("Issue: " + resdata.message);
                    $("#collateralModal").click();
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    checkCollateral = (colldocrefid, index) => {
        this.setState({ collateralUploaded: true })
        var collID = colldocrefid;
        console.log(collID);

        var collDocdata = document.querySelector(`input[id='collFile${index}']`).files;
        console.log(collDocdata)
        var collfileField = document.querySelector(`input[id='collFile${index}']`).files.length;
        console.log("Length of CollDocuments " + collfileField)

        var object = { collID, collDocdata, collfileField }
        // var id=document.querySelector("input[id='collFile']").name;
        array1[index] = object;
        console.log(array1)

        this.setState({ collDataLists: array1 })
    }
    async uploadCallCollateral() {
        try {
            var list = this.state.collDataLists;
            console.log(list);

            // Variable to track if all uploads are successful
            let allUploadsSuccessful = true;

            for (var i = 0; i < list.length; i++) {
                // Create a new FormData instance for each file
                var collData = new FormData();

                var collbody = JSON.stringify({
                    loanreqno: sessionStorage.getItem('loanReqNo'),
                    colldocrefid: list[i].collID,
                });

                // Assuming each list[i] contains the document data in 'collDocdata'
                collData.append("file", list[i].collDocdata[i]);
                collData.append("fileInfo", collbody);

                // Wait for each upload to complete before proceeding to the next
                var data = await this.uploadCollateral(collData);
                console.log(data);

                // Check the response status of each upload
                if (!data || data.status !== 'Success') {
                    allUploadsSuccessful = false;
                    break;  // Stop processing further if an upload fails
                }
            }

            // Once all uploads are completed and successful, call setFormTxndata
            if (allUploadsSuccessful && isCollReq === "1") {
                this.setFormTxndata();
            }

        } catch (error) {
            console.error("Error during document upload:", error);
        }
    }
    uploadCollateral = async (collData) => {
        try {
            const response = await fetch(BASEURL + '/lsp/uploadloancollateraldoc', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: collData
            });

            const resdata = await response.json();
            console.log(resdata);

            if (resdata.status === 'Success') {
                confirmAlert({
                    message: resdata.message,
                    buttons: [
                        {
                            label: "Okay",
                            onClick: () => { /* Do nothing */ }
                        }
                    ],
                    closeOnClickOutside: false,
                });
            } else {
                confirmAlert({
                    message: resdata.message,
                    buttons: [
                        {
                            label: "Okay",
                            onClick: () => { /* Do nothing */ }
                        }
                    ],
                    closeOnClickOutside: false,
                });
            }

            return resdata;  // Return the response data to the caller

        } catch (error) {
            console.error("Error during the fetch operation:", error);
            return null;  // Return null in case of an error
        }
    }



    //updated functions
    checkNoofFiles(e) {
        var file1 = e.target.files[0];
        var allowedExtensions = /(\.pdf)$/i;

        if (allowedExtensions.exec(file1.name)) {
            this.setState({ selectedFile: file1 });

            //old code
            // this.setState({ docuStatus: "1" })
            // this.setState({ file: URL.createObjectURL(e.target.files[0]) })
            // var file = e.target.files[0];
            // console.log(file);

            // var data = document.querySelector("input[id='attachment']").files;
            // console.log(data)
            // var fileField = document.querySelector("input[id='attachment']").files.length;
            // console.log(fileField);
            // // $('#Launch2').click();
            // if (fileField > 3) {
            //     alert("Maximum 3 Statements Allowed");
            //     e.target.value = '';
            //     this.setState({ selectedFile: null });
            //     return;
            // } else {
            //     // $("#submitBtn").prop('disabled', false);
            // }
            var dt = new ClipboardEvent("").clipboardData || new DataTransfer();
            var existingFilesCount = $("#filesList > #files-names > .file-block").length;

            if (existingFilesCount + e.target.files.length > 3) {
                alert("Maximum 3 Statements Allowed");
                e.target.value = '';
                return;
            }
            for (var i = 0; i < e.target.files.length; i++) {
                let fileBloc = $('<span/>', { class: 'file-block' }),
                    fileName = $('<span/>', { class: 'name', text: e.target.files.item(i).name });
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
                document.getElementById('attachment').files = dt.files;

                // Update the displayed upload status if needed
                $("#uploadAct").text($("#uploadAct").text().replace("Uploaded", "Upload"));

                // Update the selectedFiles array in state
                let updatedSelectedFiles = this.state.selectedFiles.filter(file => file.name !== name);
                this.setState({ selectedFiles: updatedSelectedFiles });
            });
            // Get the current selected files array from state
            let selectedFiles = [...this.state.selectedFiles];

            // Add the new selected files to the array
            selectedFiles.push(...Array.from(e.target.files));

            // Set the updated selected files array in state
            this.setState({ selectedFiles });
            $("#submitBtn").prop('disabled', false);
        } else {
            // alert('Please upload a PDF file');
            $("#exampleModalCenter3").modal('hide');

            confirmAlert({
                message: "Please upload a PDF file.",
                buttons: [
                    {
                        label: "Okay",
                        onClick: () => {
                            $("#bankStmtModal").click();
                        }
                    }
                ],
                closeOnClickOutside: false,
            })

            e.target.value = '';
            this.setState({ selectedFile: null });
        }
    }
    uploadFile = async (event) => {
        var body = JSON.stringify({
            stmt_type: 1,
            stmt_format: 1,
            stmt_page: 1,
            loan_req_num: sessionStorage.getItem('loanReqNo')
        })
        var formData = new FormData()
        // var data = document.querySelector("input[id='attachment']").files;
        // console.log(data)
        // var fileField = document.querySelector("input[id='attachment']").files.length;
        // console.log(fileField)
        // var array = [];
        // for (var i = 0; i < fileField; i++) {
        //     array.push(data[i]);
        //     // formData.append("stmt", data.files[i])
        // }
        // console.log(array)
        // this.setState({ uploadedFiles: array.length });
        let successfulUploads = 0; // Track the number of successful uploads
        this.state.selectedFiles.forEach(file => {
            formData.append("stmt", file);
        });
        console.log("Selected files for upload:", this.state.selectedFiles);
        formData.append("stmtinfo", body);
        for (var i = 0; i < this.state.selectedFiles.length; i++) {
            formData = new FormData(); // Create a new formData object for each file
            formData.append("stmt", this.state.selectedFiles[i]);
            formData.append("stmtinfo", body);
            try {
                await this.statementUpload(formData);
                successfulUploads++;
                if (successfulUploads === this.state.selectedFiles.length) {
                    // All files uploaded successfully
                    if (this.state.collateralUploaded == true) {
                        this.uploadCallCollateral();
                        console.log("collateral Uploaded")
                    } else {
                        if (isCollReq == "1") {
                            this.setFormTxndata();
                        } else {
                            window.location = '/viewAllLoanRequests'
                            console.log("routed to loan request")
                        }
                        //this.setFormTxndata();
                    }
                }
            } catch (error) {
                console.log(error);
                // Handle upload error
            }
        }
        // for (var i = 0; i < array.length; i++) {
        //     formData = new FormData(); // Create a new formData object for each file
        //     formData.append("stmt", array[i]);
        //     formData.append("stmtinfo", body);
        //     try {
        //         await this.statementUpload(formData);
        //         successfulUploads++;
        //         if (successfulUploads === array.length) {
        //             // All files uploaded successfully
        //             if (this.state.collateralUploaded == true) {
        //                 this.uploadCallCollateral();
        //                 console.log("collateral Uploaded")
        //             } else {
        //                 if (CROPLoan == "CROP") {
        //                     this.setFormTxndata();
        //                 } else {
        //                     window.location = '/viewAllLoanRequests'
        //                     console.log("routed to loan request")
        //                 }
        //                 //this.setFormTxndata();
        //             }
        //         }
        //     } catch (error) {
        //         console.log(error);
        //         // Handle upload error
        //     }
        // }
    }
    statementUpload = async (formData) => {
        try {
            const response = await fetch(BASEURL + '/usrmgmt/uploadstatement', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: formData
            });
            const resdata = await response.json();
            console.log(resdata);
            if (resdata.status === 'Success') {
                // Handle success
                console.log(resdata);
                // if (this.state.collateralUploaded == true) {
                //     this.uploadCallCollateral();
                //     console.log("collateral Uploaded")
                // } else {
                //     if (CROPLoan == "CROP") {
                //         this.setFormTxndata();
                //     } else {
                //         window.location = '/viewAllLoanRequests'
                //         console.log("routed to loan request")
                //     }
                // }
            } else {
                // Handle failure
                alert(resdata.message);
            }
        } catch (error) {
            console.log(error);
        }
        // fetch(BASEURL + '/usrmgmt/uploadstatement', {
        //     method: 'post',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Authorization': "Bearer " + sessionStorage.getItem('token')
        //     },
        //     body: formData
        // })
        //     .then(response => response.json())
        //     .then((resdata) => {
        //         console.log(resdata);
        //         if (resdata.status == 'Success') {
        //             console.log(resdata);
        //             //alert(resdata.message)
        //             //window.location = '/viewAllLoanRequests'

        //             if (this.state.collateralUploaded == true) {
        //                 this.uploadCallCollateral();
        //                 console.log("collateral Uploaded")
        //             } else {
        //                 if (CROPLoan == "CROP") {
        //                     this.setFormTxndata();
        //                 } else {
        //                     //window.location = '/viewAllLoanRequests'
        //                     //console.log("routed to loan request")

        //                 }
        //                 //this.setFormTxndata();
        //             }
        //         } else {
        //             alert("Issue: " + resdata.message); //undefined
        //         }

        //     })
        //     .catch(error => console.log(error)
        //     );
    }
    //Consent
    getGroupInfo() {
        fetch(BASEURL + '/configuration/getgroupinfo', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                groupnames: ["CONSENT-DATA"]
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    //this.setState({ grpInfo: resdata.data.CONSENT-DATA })
                    var GroupInfo = resdata.data["CONSENT-DATA"];
                    console.log(GroupInfo);

                    GroupInfo.forEach(element => {
                        console.log(element);
                        console.log(element.attributename)
                        console.log(element.attributeoptions)
                        if (element.attributename == "RAISELOANREQ") {
                            console.log(element.attributeoptions);
                            var mapattriOpt = element.attributeoptions;
                            console.log(mapattriOpt);
                            mapattriOpt.map((options, index) => {
                                consentData = options.consentdata;
                                consentID = options.consentid;
                                consentType = options.consenttype;
                                consentStatus = options.status;

                                this.setState({ consentData: options.consentdata })
                                console.log(consentData, consentID, consentType, consentStatus)
                            })

                            console.log(consentData, consentID, consentType, consentStatus)
                        }
                    })
                    this.setState({ consentData: consentData });
                    console.log(this.state.consentData);
                } else {
                    alert(resdata.message);
                }
            })
    }
    consentLRQmodal = () => {
        if (sessionStorage.getItem("SisVkycVerified") == 0) {
            $("#raiseLoanAlertModal").click();
        } else {
            if (this.state.loanamtrequested === "") {
                confirmAlert({
                    message: "Amount can not be empty, please enter the amount.",
                    buttons: [
                        {
                            label: "Okay",
                            onClick: () => {

                            }
                        }
                    ],
                    closeOnClickOutside: false,
                })
            } else if (this.state.noofrepayments === "") {
                confirmAlert({
                    message: "Tenure can not be empty, please enter the tenure.",
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
                //$("#consentModal").click();
                this.setState({ showModal: true });
            }
        }
    }
    changeConsentType = (e) => {
        const consentType = e.target.checked;
        if (consentType == true) {
            this.setState({ consentMode: "1" });
        } else if (consentType == false) {
            this.setState({ consentMode: "" });
        }
        console.log(e.target.checked, this.state.consentMode);
    }
    setuserConsent = (value) => {
        fetch(BASEURL + '/usrmgmt/setuserconsent', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                consenttype: consentType,
                consentmode: value,
                consentdata: this.state.consentData,
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status == "Success") {
                    $("#loanRequestModal").click()
                } else {
                    alert(resdata.message);
                }
                // if (resdata.status === 'Success') {
                //     console.log(resdata.message)
                //     this.loanRequest()
                // } else {
                //     alert(resdata.message);
                // }
            })
    }
    loanRequest(loanpur) {
        //this.setState({ loanpurpose: loanpur })
        this.setState({ showModal: false });
        if (this.validator.allValid()) {

        } else {
            this.validator.showMessages();
            // rerender to show messages for the first time
            // you can use the autoForceUpdate option to do this automatically`
            this.forceUpdate();
            return;
        }
        console.log(this.state.loanpurpose);
        console.log(this.state.jlgID)
        let commonData = {
            borrowerid: sessionStorage.getItem('userID'),
            productid: this.state.productid,
            loanamtrequested: parseInt(this.state.loanamtrequested),
            loanpurpose: parseInt(this.state.loanpurpose),
            noofrepayments: parseInt(this.state.noofrepayments),
            repaymentfrequency: parseInt(this.state.repaymentfrequency),
            facilitatorid: this.state.facilitatorid,
            aaid: this.state.aaid
        };
        if (isStmtReq == "1" && this.state.cibil != "") {
            commonData.documentsuploaded = parseInt(documentsuploaded);
            commonData.cibilscore = this.state.cibil;
            if (this.state.jlgID && this.state.jlgID.trim() !== "") {
                commonData.jlgid = this.state.jlgID;
            }
        } else if (isStmtReq == "0" && this.state.cibil != "") {
            commonData.documentsuploaded = parseInt(documentsuploaded);
            commonData.cibilscore = this.state.cibil;
            if (this.state.jlgID && this.state.jlgID.trim() !== "") {
                commonData.jlgid = this.state.jlgID;
            }
        } else if (isStmtReq == "1" && this.state.cibil == "") {
            commonData.documentsuploaded = parseInt(documentsuploaded);
            if (this.state.jlgID && this.state.jlgID.trim() !== "") {
                console.log(this.state.jlgID)
                commonData.jlgid = this.state.jlgID;
            }
        } else if (isStmtReq == "0" && this.state.cibil == "") {
            commonData.documentsuploaded = parseInt(documentsuploaded);
            if (this.state.jlgID && this.state.jlgID.trim() !== "") {
                console.log(this.state.jlgID)
                commonData.jlgid = this.state.jlgID;
            }
        }
        if (this.state.officeid) {
            commonData.officeid = this.state.officeid
        }
        if (this.state.selectedSupplier) {
            commonData.supplierid = this.state.selectedSupplier
        }
        let jsonBody = JSON.stringify(commonData);
        // if (document.getElementById("attachment").value == "") {
        //     alert("You need to upload statements");
        //     //window.location.reload();
        //     return false;

        // } else
        this.setState({ showLoader: true })
        fetch(BASEURL + '/lsp/borrwerloanreq', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: jsonBody
        }).then(response => {
            return response.json();
        })//updated
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'SUCCESS') {
                    this.setState({ showLoader: false })
                    console.log(resdata.msgdata.encryptdata,
                        resdata.msgdata.mobileref);
                    this.setState({
                        encryptData: resdata.msgdata.encryptdata,
                        mobileRef: resdata.msgdata.mobileref
                    })
                    $("#loanRequestModal").hide();
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    $("#approveLoan").click();
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
                            }
                        ],
                        closeOnClickOutside: false,
                    })

                } else {
                    this.setState({ showLoader: false })
                    alert(resdata.message);
                    //window.location.reload()
                }

            })

    }
    mobileOTP = (e) => {
        this.setState({ mobileOTP: e.target.value })
        if (e.target.value.length === 6) {
            $("#otpSubmitBtn").prop('disabled', false)
        } else {
            $("#otpSubmitBtn").prop('disabled', true)
        }
    }
    loanRequestFinal = () => {
        this.setState({ showLoader: true })
        fetch(BASEURL + '/lsp/borrwerloanreq', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                encryptdata: this.state.encryptData,
                mobileref: parseInt(this.state.mobileRef),
                mobileotp: parseInt(this.state.mobileOTP)
            })
        }).then(response => {
            return response.json();
        })//updated
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'SUCCESS') {
                    $("#exampleModalCenter11").hide();
                    sessionStorage.setItem('loanReqNo', resdata.msgdata.loanreqno);
                    console.log(sessionStorage.getItem('loanReqNo'))

                    this.setState({ showLoader: false })
                    var popupFlag = false;
                    confirmAlert({
                        message: "Loan request number is " + resdata.msgdata.loanreqno + ".",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    popupFlag = true;
                                    if (isStmtReq == "0") {
                                        if (this.state.isJLGLoan === "0") {
                                            this.setRefMembers()
                                        }
                                        if (isCollReq == "1") {
                                            this.setFormTxndata();
                                        } else {
                                            window.location = '/viewAllLoanRequests';
                                        }
                                    } else if (isStmtReq == "1") {
                                        if (this.state.isJLGLoan === "0") {
                                            this.setRefMembers()
                                        }
                                        if (popupFlag == true && documentsuploaded == "1") {
                                            this.uploadFile();
                                        } else {
                                            //window.location.reload();
                                            if (isCollReq == "1") {
                                                this.setFormTxndata();
                                            }
                                            //this.setFormTxndata();
                                        }
                                    }
                                }
                            }
                        ],
                        closeOnClickOutside: false,
                    })
                    console.log(resdata.msgdata.loanreqno)
                } else {
                    $("#exampleModalCenter11").hide();
                    this.setState({ showLoader: false });
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
    }
    getLoanPurpose(produid) {
        this.setState({ productid: produid })
        const urlDash = BASEURL + '/lsp/getloanpurpose?productid=' + produid
        fetch(urlDash, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Response:', response)
                return response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ loanPurposeDetails: resdata.msgdata })
                } else {
                    alert(resdata.message);
                }
            })

    }

    onChange(e) {
        this.setState({ value: e.target.value });
        var x = document.getElementById("rValue");
        var y = document.getElementById("slider2");
        console.log(y.value)
        x.value = y.value;
        this.setState({ loanamtrequested: x.value });
        // this.state.loanamtrequested = x.value;
    }

    onTenure(e) {
        this.setState({ value: e.target.value });
        var p = document.getElementById("rpay");
        var q = document.getElementById("sliderM");
        p.value = q.value;
        this.setState({ noofrepayments: p.value });
        // this.state.noofrepayments = p.value;
    }
    renderFormElement = (element, index) => {
        switch (element.datatype) {
            case "text":
                return (
                    <div key={element.datatype} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label}</p>
                        <input className="form-control"
                            style={{ border: "1px solid rgb(0, 121, 190)" }}
                            maxLength={element.maxlength}
                            minLength={element.minlength}
                            name={element.label}
                            type={element.datatype}
                            placeholder={element.placeholder}
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
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label}</p>
                        <input className="form-control"
                            style={{ border: "1px solid rgb(0, 121, 190)" }}
                            maxLength={element.maxlength}
                            minLength={element.minlength}
                            name={element.label}
                            type={element.datatype}
                            placeholder={element.placeholder}
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
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label}</p>
                        <input className="form-control"
                            style={{ border: "1px solid rgb(0, 121, 190)" }}
                            maxLength={element.maxlength}
                            minLength={element.minlength}
                            name={element.label}
                            type={element.datatype}
                            placeholder={element.placeholder}
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
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label}</p>
                        <div className='row'>
                            {element.values.map((option) => (
                                <div key={option.value} className='col-5'>
                                    <input
                                        type="radio"
                                        name={element.name}
                                        value={option.value}
                                    //checked={option.selected}
                                    // checked={option.selected}
                                    />
                                    <label>{option.label}</label>
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
                            <option defaultValue>Select an option</option>
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
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label}</p>
                        <textarea
                            className="form-control"
                            name={element.name}
                            rows={element.rows}
                        ></textarea>
                    </div>
                );
            case "checkbox-group":
                return (
                    <div key={element.datatype} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label}</p>
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
                    <div key={element.datatype} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label}</p>
                        <input
                            type="date"
                            name={element.name}
                        />
                    </div>
                );

            default:
                return null;
        }
    }
    dynFormData = (e, index, label, datatype, regex, field) => {
        // console.log(label, datatype, regex);
        const { name, value } = e.target;
        const Regex = regex;

        let errorMessage = "";
        if (Regex) {
            const pattern = new RegExp(Regex);
            if (!pattern.test(value)) {
                console.log(`Invalid input for ${field}.`);
                errorMessage = `Invalid input for ${field}.`;

                $("#finalSubmitBtn").prop('disabled', true);
            } else {
                dataList[index] = e.target.value;
                console.log(dataList);

                const valueList = [];
                console.log(dataList);
                valueList.push()
                // extractedData = this.state.formFieldLists.map((item, index) => ({
                //     field: item.field,
                //     value: item.value
                // }));
                extractedData = this.state.formFieldLists.map((item, index) => {
                    var Values;
                    if (typeof dataList[index] == "undefined") {
                        Values = "";
                        console.log("executed1");
                    } else {
                        Values = dataList[index];
                        console.log("executed2");
                    }

                    return {
                        field: item.field,
                        value: Values
                    };
                });
                console.log(extractedData)
                // jsonForm=extractedData;
                // console.log(jsonForm);

                $("#finalSubmitBtn").prop('disabled', false);
            }
        }
        const errorMessages = { ...this.state.errorMessages, [label]: errorMessage };

        this.state.formFieldLists[index].value = value;

        this.setState({
            formFieldLists: [...this.state.formFieldLists],
            errorMessages,
        });

        const supplier = extractedData.find(item => item.field === "Select Supplier Name");
        if (supplier) {
            this.setState({
                commonSupplierName: supplier.value,
                supplierName: supplier.value
            }, () => {
                this.state.supplierLists
                    .filter((e) => e.suppliername == supplier.value)
                    .map((prdt, index) => {
                        this.setState({
                            selectedSupplier: prdt.supplierid,
                        })
                    })
            });
            console.log(supplier.value)
        }
    }
    changeDynFormFlag = (e) => {
        this.setState({ dynamicFormFlag: "1" })
        console.log(dataList);

        const valueList = [];
        console.log(dataList);
        valueList.push()
        jsonForm = this.state.formFieldLists;
        jsonForm.map((list, index) => {
            var Values;
            if (typeof dataList[index] == "undefined") {
                Values = "";
                console.log("executed1")
            } else {
                Values = dataList[index];
                console.log("executed2")
            }
            list.value = Values;
            return {
                access: list.access,
                subtype: list.subtype,
                maxlength: list.maxlength,
                name: list.name,
                className: list.className,
                label: list.label,
                placeholder: list.placeholder,
                type: list.type,
                required: list.required,
            }
        })
        console.log(jsonForm)
    }
    setFormTxndata = () => {
        this.setState({ showLoader: true })
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
                majorid: sessionStorage.getItem('loanReqNo'),
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
                    this.setState({ showLoader: false })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location = '/viewAllLoanRequests'
                                }
                            }
                        ],
                        closeOnClickOutside: false,
                    })
                    console.log(resdata.msgdata.loanreqno)
                } else {
                    this.setState({ showLoader: false })
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }

            })
    }
    cancelRequest = () => {
        $("#commonModal").click();
        this.setState({
            cancelFlag: true
        })
    }
    confirmCancelRequest = () => {
        //Do you want to cancel the loan request?
        $("#exampleModalCenter21").modal('hide')
        confirmAlert({
            message: "New Loan Request Cancelled",
            buttons: [
                {
                    label: "Okay",
                    onClick: () => {
                        window.location = "/borrowerdashboard"
                    }
                }
            ],
            closeOnClickOutside: false,
        })
    }
    //Consent
    getConsentGroupInfo() {
        fetch(BASEURL + '/configuration/getgroupinfo', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                groupnames: ["CONSENT-DATA"]
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    //this.setState({ grpInfo: resdata.data.CONSENT-DATA })
                    var GroupInfo = resdata.data["CONSENT-DATA"];
                    console.log(GroupInfo);

                    GroupInfo.forEach(element => {
                        console.log(element);
                        console.log(element.attributename)
                        console.log(element.attributeoptions)
                        if (element.attributename == "LNOFFRACCPT") {
                            console.log(element.attributeoptions);
                            var mapattriOpt = element.attributeoptions;
                            console.log(mapattriOpt);
                            mapattriOpt.map((options, index) => {
                                consentData = options.consentdata;
                                consentID = options.consentid;
                                consentType = options.consenttype;
                                consentStatus = options.status;

                                this.setState({ consentData: options.consentdata })
                                console.log(consentData, consentID, consentType, consentStatus)
                            })

                            console.log(consentData, consentID, consentType, consentStatus)
                        }
                    })
                } else {
                    alert(resdata.message);
                }
            })
    }
    // JLG Logics
    checkGrpCheckBox = (e) => {
        console.log(e.target.checked);
        var check = e.target.checked;
        if (check == true) {
            this.getGrouplist();
            $("#jlgDrpdown").show();
            this.setState({ isJLGLoan: "1" });
            console.log("True")
        } else if (check == false) {
            $("#jlgDrpdown").hide();
            this.setState({ isJLGLoan: "0" });
            console.error('False');
        }
    }
    getGrouplist = () => {
        fetch(BASEURL + "/usrmgmt/jlg/getgrouplist", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success") {
                    this.setState({ groupList: resdata.msgdata });
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
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click();
                        $("#jlgDrpdown").hide();
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    handleCheckboxChange = (index) => {
        const selectedIndexes = [...this.state.selectedIndexes];
        const indexPosition = selectedIndexes.indexOf(index);

        if (indexPosition !== -1) {
            selectedIndexes.splice(indexPosition, 1);
        } else {
            selectedIndexes.push(index);
        }

        const updatedSelectedCount = selectedIndexes.length;

        this.setState({
            selectedCount: updatedSelectedCount,
            selectedIndexes,
            dropdownText: `(${updatedSelectedCount} Member) selected`,
        });
    }
    groupSelection = (event) => {
        console.log(event.target.value);
        this.setState({ jlgID: event.target.value });
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
                operationtype: 17,
                mobileref: this.state.mobileRef,
                emailref: this.state.mobileRef,
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
                    this.setState({ mobileRef: resdata.msgdata.mobileref })

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

    //office
    officeDistList = () => {
        // this.getOfficeDistrict()
        if (!this.state.officeDistListCalled) {
            this.getOfficeDistrict()
                .then(responseData => {
                    console.log("Response data:", responseData);
                    this.setState({
                        officeDistListFirst: responseData,
                        officeDistListCalled: true // Set the flag to true after calling the API
                    });
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    }
    officeDistList1 = (e) => {
        const distCode = e.target.value;
        this.setState({
            distcode: distCode,
            distcodeForList1: distCode
        });
        document.getElementById('list2').style.display = 'none';

        this.setState({
            officeDistListSecond: [],
        });

        if (distCode !== '') {
            document.getElementById('list2').style.display = 'block';
            this.getOfficeDistrict(distCode)
                .then(responseData => {
                    console.log("Response data:", responseData);
                    this.setState({ officeDistListSecond: responseData })
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
        console.log('executed');
    }
    officeDistList2 = (e) => {
        const officeId = e.target.value;
        this.setState({
            officeid: officeId
        })
    }
    getOfficeDistrict = (distcode) => {
        return new Promise((resolve, reject) => {
            let distCode = "districtcode=" + distcode;
            let params;

            if (distCode !== undefined) {
                params = distCode;
            }
            console.log('Executing getOfficedistList');
            console.log(params);
            fetch(BASEURL + '/usrmgmt/getofficelist/district?' + `${distcode !== undefined ? params : ''}`, {
                // fetch(BASEURL + '/usrmgmt/getofficelist/district', {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((resdata) => {
                    console.log('API Response:', resdata);
                    if (resdata.status === 'Success') {
                        console.log('Inside office district list');
                        this.setState({ officeDistList: resdata.msgdata });
                        resolve(resdata.msgdata); // Resolve with the response data
                    } else {
                        reject(new Error("Issue: " + resdata.message)); // Reject with an error
                    }
                })
                .catch((error) => {
                    console.log('Error fetching office list:', error);
                    reject(error);
                });
        });
    }
    getSuppliersList = () => {
        fetch(BASEURL + "/lms/getsupplierlist", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success" || resdata.status == "SUCCESS") {
                    this.setState({ supplierLists: resdata.msgdata })
                    // $("#submitBtn").prop('disabled', true);
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
                        this.setState({ resMsg: resdata.message })
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    selectedSupplier = (event) => {
        console.log(event.target.value)
        // $("#submitBtn").prop('disabled', false);
        this.setState({ selectedSupplier: event.target.value })
        this.state.supplierLists
            .filter((e) => e.supplierid == event.target.value)
            .map((prdt, index) => {
                this.setState({
                    supplierName: prdt.suppliername,
                })
            })
    }
    formEnablePage = () => {
        $("#uploadInvoiceFirst").hide();
        $("#uploadDynamicForm").show();
    }
    saveInvoiceandForm = () => {
        $("#exampleModalCenter2222").modal('hide');
        $("#uploadInvoiceFirst").hide();
        $("#uploadDynamicForm").show();
        this.setState({ collateralndFormSaved: "1" })
    }
    cancelInvoice = () => {
        extractedData = [];
        $("#uploadInvoiceFirst").show();
        $("#uploadDynamicForm").hide();
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    handlePopoverToggle = (productId) => {
        this.setState((prevState) => ({
            showPopover: productId,
        }));
        console.log(this.state.showPopover, productId)
    };

    //References
    handleInputChange(e) {
        if (!e.target) {
            console.error('Event target is null');
            return;
        }
        const { name, value } = e.target;
        let errors = this.state.errors;

        switch (name) {
            case 'refEmail':
                errors.refEmail =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                        ? ''
                        : 'Email is not valid!';
                break;
            case 'refMobileno':
                errors.refMobileno =
                    /^\d{10}$/.test(value)
                        ? ''
                        : 'Mobile number must be 10 digits!';
                break;
            default:
                break;
        }

        this.setState({ errors, [name]: value });
        console.log(`Changing ${e.target.name} to:`, e.target.value);
        this.setState({ [e.target.name]: e.target.value });
    }
    addMembers() {
        const { refName, refMobileno, refEmail, refMembers } = this.state;
        const refMember = { refname: refName, refmobile: refMobileno };

        if (refEmail) {
            refMember.refemail = refEmail;
        }
        // Check if any field is empty before adding
        if (!refName || !refMobileno) {
            console.error('All fields are required');
            return;
        }

        this.setState({
            refMembers: [...refMembers, refMember],
            refName: '',
            refMobileno: '',
            refEmail: '',
        }, () => {
            console.log('New member added:', refMember);
            console.log('Updated refMembers array:', this.state.refMembers);
        });
    }
    delNewMember(index) {
        const refMembers = [...this.state.refMembers];
        refMembers.splice(index, 1);
        this.setState({ refMembers }, () => {
            console.log(`Member at index ${index} deleted`);
            console.log('Updated newMembers array:', this.state.refMembers);
        });
    }
    saveRefDetails = (event) => {
        event.preventDefault();
    }
    setRefMembers = (event) => {
        const { refMembers } = this.state;

        fetch(BASEURL + '/lsp/setreferencesforloanrequest', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanrequestnumber: sessionStorage.getItem('loanReqNo'),
                referenceinfo: refMembers,
            })
        })
            .then(response => response.json())
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    // $(".bd-example-modal-lg188").modal('hide')
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
                } else {
                    // $(".bd-example-modal-lg188").modal('hide')

                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    openRefModal = () => {
        $("#refModal").click();
    }
    closeRefModal = () => {
        this.setState({
            refName: '',
            refMobileno: '',
            refEmail: '',
            errors: {
                refMobileno: '',
                refEmail: '',
            },
            refMembers: []
        })
    }
    render() {
        const { t } = this.props
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
        const { errorMessages } = this.state;
        var dropdownItems = this.state.groupList;
        console.log(this.state.documentsuploaded);
        console.log(documentsuploaded);

        const { showModal } = this.state;
        const { dropdownText, showPopover, productList, finalProductList, errors, maxReferences } = this.state;
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F4F7FC" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <BorrowerSidebar />
                <ConsentModal showModal={showModal} consentData2={this.state.consentData} setuserConsent2={this.setuserConsent} />

                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px", paddingLeft: "35px" }}>
                        <div className="col-lg-1 col-sm-2">
                            <button style={{}} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-lg-4 col-sm-2' style={{ marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/borrowerdashboard">Home</Link> / Raise Loan Request</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-lg-3'>

                        </div>
                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/borrowerdashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-14px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <hr className="col-11" style={{ marginLeft: "50px", marginTop: "11px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row ' style={{ marginTop: "-14px" }}>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "16px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>{t('NewLoanRequest')}</p>
                        </div>
                    </div>

                    {/* Route to dashboard*/}
                    <Link to="/borrowerdashboard"><button id='borDashboard' style={{ display: "none" }}>Refresh
                    </button></Link>

                    {/* New Design */}
                    <button id='Launch' style={{ display: "none", marginLeft: "67%" }} type="button" class="btn btn-info" data-toggle="modal" data-target=".bd-example-modal-lg">
                        Borrower Details
                    </button>
                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", paddingLeft: "8px" }}><img src={batch} style={{ width: "26px" }} /> &nbsp;User Personal Details</p>
                                            <hr style={{ width: "70px", marginTop: "-6px" }} />
                                        </div>
                                    </div>

                                    <div className='row mb-2' style={{ marginTop: "-10px" }}>
                                        <div className='col'>
                                            <p className="font-weight-bold" style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>Profile Details</p>
                                            <div style={{ border: "1px solid rgb(0, 121, 191)", borderRadius: "5px", marginTop: "-10px" }}>
                                                <div className='row p-2'>
                                                    {
                                                        this.state.getattributes.map((attribute, index) => {
                                                            return (
                                                                <div className='col-lg-6 col-sm-12' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }} key={index}>
                                                                    <div className='row'>
                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                            <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>{attribute.attributetype}</p>
                                                                        </div>
                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                        </div>
                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <p className="font-weight-bold" style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>Do you want to update your profile?</p>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn btn-sm text-white" data-dismiss="modal" style={{ paddingLeft: "20px", paddingRight: "20px", backgroundColor: "rgb(0, 121, 191)" }}
                                                onClick={() => this.props.history.push('/borrowerDetails')}>Yes</button>
                                            &nbsp;
                                            <button type="button" class="btn btn-sm btn-secondary text-white" data-dismiss="modal"
                                                style={{ paddingLeft: "20px", paddingRight: "20px" }}>No</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Purpose group */}
                    <div className="row">
                        <div className="col-11">
                            <p className="ml-5" style={{ color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}>Select Loan Category *</p>
                            <div className="card ml-5" style={{ cursor: "default", marginTop: "-10px" }}>
                                <div className='scrollbar' style={{ cursor: "default", overflowX: "hidden", height: (this.state.loanPurposeGroupList.length > 3 ? "133px" : "50px") }} >
                                    <div className='row pl-2 pr-2'>
                                        {
                                            this.state.loanPurposeGroupList.map((puposeGroup, index) => {
                                                return (
                                                    <div className='col-lg-4 col-md-6 col-sm-12' key={index}>
                                                        <div className='card pl-3' style={{ paddingBottom: "5px", marginTop: "4px", fontSize: "14px", border: "1px solid rgba(0,121,190,1)", marginBottom: "0px", cursor: "default", color: "rgb(5, 54, 82)" }}>
                                                            <div className='form-check mt-2'>
                                                                <input className='form-check-input' type='radio'
                                                                    name="exampleRadios12" id="exampleRadios12"
                                                                    onChange={this.loanpurposeGroup} key={index} value={puposeGroup.loanpurgrp} style={{ color: "rgba(5,54,82,1)" }} defaultValue />
                                                                <span>{puposeGroup.loanpurgrpdesc}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Loan Purpose UI */}
                    <div className="row" id='loanPurposeID' style={{ display: "none" }}>
                        <div className="col-11">
                            <p className="ml-5" style={{ color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}>Select Loan Purpose *</p>
                            <div className="card ml-5" style={{ cursor: "default", marginTop: "-10px" }}>
                                <div className='scrollbar' style={{ cursor: "default", overflowX: "hidden", height: (this.state.loanPurposeDetails.length > 3 ? "150px" : "50px") }} >
                                    <div className='row pl-2 pr-2'>
                                        {this.state.loanPurposeDetails.map((purposeDetails, index) => {
                                            return (
                                                <div className='col-lg-4 col-md-6 col-sm-12' key={index}>
                                                    <div className='card pl-3' style={{ paddingBottom: "5px", marginTop: "4px", fontSize: "14px", border: "1px solid rgba(0,121,190,1)", marginBottom: "0px", cursor: "default", color: "rgb(5, 54, 82)" }}>
                                                        <div className='form-check mt-2'>
                                                            <input className='form-check-input' type='radio'
                                                                name="exampleRadios" id="exampleRadios"
                                                                onChange={this.selectedLoanPurpose}
                                                                key={index}
                                                                value={purposeDetails.loanpurposeid}
                                                                style={{ color: "rgba(5,54,82,1)" }} defaultValue />
                                                            <span>{purposeDetails.loanpurpose}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Loan Category */}
                    <div className="row" id='loanCategory' style={{ display: "none" }}>
                        <div className="col-11">
                            <div className='row' style={{ marginRight: "-63px" }}>
                                <div className='col'>
                                    <p className="ml-5" style={{ color: "rgb(5, 54, 82)", fontWeight: "600", fontSize: "14px" }}>Select Loan Product *</p>
                                </div>
                                <div className='col' style={{ textAlign: "end" }}>
                                    <p className='assignWkflw' style={{ cursor: "pointer", fontWeight: "500", fontSize: "14px" }}>
                                        <span onClick={this.checkLoanEligibility}><FaRegEdit />&nbsp;Check Loan Eligibility</span></p>
                                </div>
                            </div>
                            <div className='card ml-5' style={{ marginTop: '-10px', position: 'relative' }} onClick={() => this.handlePopoverToggle(null)}>
                                <div className='scrollbar' style={{ cursor: 'default', overflowX: 'hidden', height: (finalProductList.length > 3 || showPopover ? "206px" : "50px") }}>
                                    <div className='row pl-2 pr-2'>
                                        {finalProductList.map((product, index) => (
                                            <div className='col-lg-4 col-md-6 col-sm-12' key={index}>
                                                <div className='card pl-3'
                                                    style={{
                                                        height: `${showPopover === product.prodid ? '' : ''}`,
                                                        border: '1px solid rgba(0,121,190,1)',
                                                        marginBottom: '0px',
                                                        marginTop: "4px",
                                                        cursor: 'default',
                                                        position: 'relative',
                                                        color: "rgb(5, 54, 82)",
                                                        paddingBottom: "5px", fontSize: "14px"
                                                    }}
                                                    onMouseOver={() => this.handlePopoverToggle(product.prodid)}
                                                >
                                                    <div className='form-check mt-2'>
                                                        <input
                                                            className='form-check-input selectedProduct'
                                                            type='radio'
                                                            name='exampleRadios1'
                                                            id={`exampleRadios${index}`}
                                                            onChange={(event) => {
                                                                this.productid(event, product.isstmtrequired, product.prodid, product.disbursetosupplier, product.collateralrequired);
                                                            }}
                                                            key={index}
                                                            value={product.prodid}
                                                            style={{ color: 'rgba(5,54,82,1)' }}
                                                        />
                                                        <span>{product.prodname}</span>
                                                    </div>
                                                    {showPopover === product.prodid ?
                                                        <hr class="col-11" style={{ marginTop: "7px", width: "80.6%", backgroundColor: "rgb(4, 78, 160)", marginBottom: "1px" }} />
                                                        : ''}

                                                    {showPopover === product.prodid && (
                                                        <div>
                                                            <div className='row mt-2' style={{ fontSize: "14px" }}>
                                                                <div className='col-lg-4 col-md-4 col-sm-12' style={{ fontWeight: "500" }}>{`Amount`}</div>
                                                                <div className='col-lg-1 col-md-1 col-sm-12'>:</div>
                                                                <div className='col-lg-6 col-md-7 col-sm-12'>
                                                                    {`₹ ${parseFloat(product.minloanamount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}&nbsp;{`-`}<br />&nbsp;{`₹ ${parseFloat(product.maxloanamount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                                                                </div>
                                                            </div>
                                                            <div className='row' style={{ fontSize: "14px" }}>
                                                                <div className='col-lg-4 col-md-4 col-sm-12' style={{ fontWeight: "500" }}>{`Interest`}</div>
                                                                <div className='col-lg-1 col-md-1 col-sm-12'>:</div>
                                                                <div className='col-lg-6 col-md-7 col-sm-12'>{`${parseFloat(product.mininterestrate).toFixed(2)}%`}&nbsp;{`-`}&nbsp;{`${parseFloat(product.maxinterestrate).toFixed(2)}%`}</div>
                                                            </div>
                                                            <div className='row' style={{ fontSize: "14px" }}>
                                                                <div className='col-lg-4 col-md-4 col-sm-12' style={{ fontWeight: "500" }}>{`Tenure`}</div>
                                                                <div className='col-lg-1 col-md-1 col-sm-12'>:</div>
                                                                <div className='col-lg-6 col-md-7 col-sm-12'>{`${product.minnoofrepayments}`}&nbsp;{`-`}&nbsp;{`${product.maxnoofrepayments}`}{`(${product.repaymentfrequencydesc})`}</div>
                                                            </div>
                                                            <div className='row' style={{ fontSize: "14px" }}>
                                                                <div className='col-lg-4 col-md-4 col-sm-12' style={{ fontWeight: "500", display: "flex" }}>Statements</div>
                                                                <div className='col-lg-1 col-md-1 col-sm-12'>:</div>
                                                                <div className='col-lg-6 col-md-7 col-sm-12'>{product.isstmtrequired == 1 ? "Required" : <span style={{ color: "grey" }}>Not Required</span>}</div>
                                                            </div>
                                                            <div className='row' style={{ fontSize: "14px" }}>
                                                                <div className='col-lg-4 col-md-4 col-sm-12' style={{ fontWeight: "500", display: "flex" }}>Suppliers</div>
                                                                <div className='col-lg-1 col-md-1 col-sm-12'>:</div>
                                                                <div className='col-lg-6 col-md-7 col-sm-12'>{product.disbursetosupplier == "1" ? "Required" : <span style={{ color: "grey" }}>Not Required</span>}</div>
                                                            </div>
                                                            {/* <div className='row' style={{ fontSize: "14px" }}>
                                                                <div className='col-lg-4 col-md-4 col-sm-12' style={{ fontWeight: "500", display: "flex" }}>Supplier Invoice</div>
                                                                <div className='col-lg-1 col-md-1 col-sm-12'>:</div>
                                                                <div className='col-lg-6 col-md-7 col-sm-12'>{product.collateralrequired == "1" ? "Required" : <span style={{ color: "grey" }}>Not Required</span>}</div>
                                                            </div> */}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div id='hiddenField' style={{ display: "none", marginTop: "-10px" }}>
                        {/* Loan Amount and Tenure */}
                        <div className='row' style={{ padding: "0px 47px" }}>
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <p htmlFor="loanAmount" className="label" style={{ color: "rgba(5,54,82,1)", fontWeight: "600", marginBottom: "5px", fontSize: "14px" }}>{t('Enter Loan Amount *')}</p>
                                <div class="input-group mb-3" style={{ border: "1px solid rgb(0, 121, 190) ", borderRadius: "5px" }}>
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1" style={{ backgroundColor: "white", zIndex: "2", border: "1px solid rgb(0, 121, 190)" }}>₹</span>
                                    </div>
                                    <input id="rValue" type="number"
                                        onChange={this.loanamtrequested} class="form-control"
                                        // placeholder={` ${this.state.minloan}`}
                                        placeholder=' Enter amount'
                                        aria-label="Username" aria-describedby="basic-addon1" />
                                </div>
                                <p style={{ fontSize: "12px" }}><BsInfoCircle />You Can Apply For An Amount Between</p>

                                <RangeStepInput id="slider2" className="input" style={{ backgroundColor: "rgb(0, 121, 190)", marginTop: "-12px" }}
                                    min={this.state.minloan} max={this.state.maxloan} step={100}
                                    onChange={this.onChange.bind(this)} value={this.state.loanamtrequested}
                                />
                                <div className='row' style={{ fontSize: "14px" }}>
                                    <div className='col'>
                                        <p>Min ₹ {parseFloat(this.state.minloan).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    </div>
                                    <div className='col' style={{ textAlign: "end" }}>
                                        <p>Max ₹ {parseFloat(this.state.maxloan).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    </div>
                                </div>
                                {/* {this.validator.message('Loan Amount', this.state.loanamtrequested, 'required|min:1|max:6', { className: 'text-danger' })} */}
                                {this.state.validationErrorAmt && <p className="text-danger">{this.state.validationErrorAmt}</p>}
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <p className="label" style={{ color: "rgba(5,54,82,1)", fontWeight: "600", marginBottom: "5px", fontSize: "14px" }}>{t('Enter Loan Tenure *')}</p>
                                <div class="input-group mb-3" style={{ border: "1px solid rgb(0, 121, 190)", borderRadius: "5px", height: "38px" }}>
                                    <input id="rpay" type="number"
                                        onChange={this.noofrepayments} class="form-control"
                                        // placeholder={` ${this.state.minterm}`} 
                                        placeholder=' Enter tenure'
                                        aria-label="Username" aria-describedby="basic-addon1" />
                                </div>
                                <p style={{ fontSize: "12px" }}><BsInfoCircle />You Can Apply For A Loan Tenure Between</p>
                                <RangeStepInput id="sliderM" className="input" style={{ backgroundColor: "rgb(0, 121, 190)", marginTop: "-12px" }}
                                    min={this.state.minterm} max={this.state.maxterm} step={1}
                                    onChange={this.onTenure.bind(this)} value={this.state.noofrepayments}
                                />
                                <div className='row' style={{ fontSize: "14px" }}>
                                    <div className='col'>
                                        <p>Min {this.state.minterm}&nbsp;{this.state.reptext}</p>
                                    </div>
                                    <div className='col' style={{ textAlign: "end" }}>
                                        <p>Max {this.state.maxterm}&nbsp;{this.state.reptext}</p>
                                    </div>
                                </div>
                                {/* {this.validator.message('tenure', this.state.noofrepayments, 'required|min:1|max:2', { className: 'text-danger' })} */}
                                {this.state.validationError && <p className="text-danger">{this.state.validationError}</p>}
                            </div>
                        </div>
                        <div className="row" style={{ padding: "0px 47px" }}>
                            <div className="col-md-6" >
                                <div className="mt-4" style={{}}>
                                    {/* <h6 className="label">Repayment Frequency : </h6><p id="repayment"></p> */}
                                    <p className="label" style={{ color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}>{t('Your Repayment Frequency')}: {this.state.reptext} </p>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex mt-4" >
                                <input type="checkbox" className="" style={{ marginTop: "-14px" }} id="chkPassport" value={this.state.documentsuploaded} />&nbsp;
                                <p className={isStmtReq == "0" ? "disabled-text" : "label"} id='upldText' style={{ color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}> {t('Upload Your Bank Statements')} &nbsp;
                                </p>
                                {/* <p className="label" id='upldText' style={{ color: "rgba(5,54,82,1)", fontWeight: "600" }}> {t('UPLOAD YOUR BANK STATEMENTS')} &nbsp;
                            </p> */}
                            </div>
                            <div className='col'></div>

                            <div className='col pl-1' id='uploadDoc' style={{ marginLeft: "10px", marginBottom: "10px" }}>
                                <button className='btn btn-sm text-white' id='uploadBtn' onClick={this.uploadDocument} style={{ backgroundColor: "rgb(0, 121, 191)", marginTop: "-20px", display: "none" }}>
                                    {this.state.docuStatus == "1" ? <span id='uploadAct'>Uploaded</span> : <span >Upload</span>}
                                </button>
                                &nbsp;
                                {this.state.docuStatus == "1" ? <FaCheckCircle style={{ color: "green", marginLeft: "10px", marginTop: "-20px" }} /> : ""}
                            </div>
                        </div>

                        <div className="row mt-0" style={{ padding: "0px 47px" }}>
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <p className="label" style={{ marginBottom: "8px", color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}>{t('Facilitator ID(Optional)')}</p>
                                <div class="input-group mb-3" style={{ border: "1px solid rgb(0, 121, 190)", borderRadius: "5px", height: "38px" }}>
                                    <input id="rValue" type="text"
                                        onChange={this.facilitatorid} class="form-control" placeholder={t(' Facilitator ID ')} aria-label="Username" aria-describedby="basic-addon1" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6" id="dvPassport">
                                <p className="label" style={{ color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}>{t('Account Aggregator ID')}</p>
                                <div class="input-group mb-3" style={{ border: "1px solid rgb(0, 121, 190)", borderRadius: "5px", height: "38px", marginTop: "-10px" }}>
                                    <input id="rValue" type="email"
                                        onChange={this.aaid} class="form-control" placeholder={t(' Enter Account aggregator ID')} aria-label="Username" aria-describedby="basic-addon1" />
                                </div>
                            </div>
                        </div>
                        {/* <div className="row" style={{ marginTop: "9px" }}>
                            <div className="col-6" style={{ marginLeft: '45px', marginTop: '-10px' }}>
                                <div className="">
                                    <p className="label" style={{ marginBottom: "8px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{t('CIBIL Score(Optional)')}</p>
                                    <div class="input-group mb-3" style={{ width: "88.6%", border: "1px solid rgb(0, 121, 190)", borderRadius: "5px", height: "38px" }}>
                                        <input id="rValue" type="text"
                                            class="form-control" onChange={this.cibil} placeholder={t(' CIBIL Score')} aria-label="Username" aria-describedby="basic-addon1" />
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        {/* JLG Members */}
                        <div className='row' style={{ padding: "0px 47px" }}>
                            <div className='col-lg-6 col-md-6 col-sm-6'>
                                <p className="label" style={{ marginBottom: "8px", color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}>
                                    {t('Do you want to apply for a loan through JLG?')}
                                    &nbsp;
                                    <input type="checkbox" name="terms" id="grpCheckbox" style={{ position: "absolute", top: "5px" }} onChange={this.checkGrpCheckBox} />
                                </p>

                                <select className='form-select' onChange={this.groupSelection} id='jlgDrpdown' style={{ display: "none", border: "1px solid rgb(0, 121, 190)", }}>
                                    <option defaultValue>Select Group</option>
                                    {dropdownItems.map((item, index) => (
                                        <option value={item.groupid}>
                                            {item.groupname}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-lg-6 col-md-6" style={{ fontSize: "14px" }}>
                                <div className='row'>
                                    {isCollReq === "1" &&
                                        <div className='col-lg-6 col-md-6 col-sm-6'>
                                            <p className="label" style={{ color: "rgba(5,54,82,1)", fontWeight: "600" }}>Upload Supplier Invoice</p>
                                            <div class="mb-3" style={{ marginTop: '-9px' }}>
                                                <button className='btn btn-sm text-white' onClick={this.getCollateral} style={{ backgroundColor: "rgb(0, 121, 191)" }}>
                                                    {this.state.collateralndFormSaved == "1" ? <span>Uploaded</span> : <span >Upload</span>}
                                                </button>
                                                &nbsp;
                                                {this.state.collateralndFormSaved == "1" ? <FaCheckCircle style={{ color: "green", marginLeft: "10px" }} /> : ""}
                                            </div>
                                        </div>
                                    }
                                    {this.state.isJLGLoan === "0" &&
                                        <div className='col-lg-6 col-md-6 col-sm-6'>
                                            <p className="label" style={{ color: "rgba(5,54,82,1)", fontWeight: "600" }}>Add References</p>
                                            <div class="mb-3" style={{ marginTop: '-9px' }}>
                                                <button className='btn btn-sm text-white' onClick={this.openRefModal} style={{ backgroundColor: "rgb(0, 121, 191)", paddingLeft: "10px", paddingRight: "10px" }}>
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>

                        </div>

                        {/* office hierarchy */}
                        <div className="row" id='isDisbSupplierReq' style={{ padding: "0px 47px", display: "none" }}>
                            <div className="form-group col-md-6" id="list3">
                                <p htmlFor="Name" style={{ marginBottom: "6px", color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px", fontSize: "14px" }}>{t('Select Supplier *')}</p>
                                {this.state.commonSupplierName ?
                                    <input id="rValue" type="text" style={{ border: "1px solid rgb(0, 121, 190)" }}
                                        class="form-control" aria-label="Username" aria-describedby="basic-addon1" value={this.state.commonSupplierName} readOnly />
                                    :
                                    <select id="" className="form-select"
                                        onChange={this.selectedSupplier}
                                        style={{ border: "1px solid rgb(0, 121, 190)" }}
                                    >
                                        <option defaultValue>Select</option>
                                        {
                                            this.state.supplierLists && this.state.supplierLists.length > 0 &&
                                            this.state.supplierLists.map((ele, index) => {
                                                return (
                                                    <option key={index} style={{ color: "GrayText" }} value={ele.supplierid}>{ele.suppliername} </option>
                                                )
                                            })
                                        }
                                    </select>
                                }
                            </div>
                            <div className="form-group col-md-6">
                                <p style={{ marginTop: "25px", fontSize: "14px", color: "orange", fontWeight: "600" }}>{t(`Note: Loan amount will be disbursed directly to the supplier account.`)}</p>
                            </div>
                        </div>
                        <div className="row" style={{ padding: "0px 47px", marginTop: "-13px" }}>
                            <div className="form-group col-md-6" id="list1">
                                <p htmlFor="Name" style={{ marginBottom: "6px", color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}>{t('Select District')}</p>
                                <select id="" className="form-select"
                                    onClick={this.officeDistList} onChange={this.officeDistList1}
                                    style={{ border: "1px solid rgb(0, 121, 190)" }}
                                >
                                    <option defaultValue>Select</option>
                                    {
                                        this.state.officeDistListFirst.map((ele, index) => {
                                            return (
                                                <option key={index} style={{ color: "GrayText" }} value={ele.districtcode}>{ele.districtname} </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-md-6" id="list2" style={{ display: "none" }}>
                                <p htmlFor="Name" style={{ marginBottom: "6px", color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}>{t('Select Office')}</p>
                                <select id="" className="form-select"
                                    onChange={this.officeDistList2}
                                    style={{ border: "1px solid rgb(0, 121, 190)" }}
                                >
                                    <option defaultValue>Select</option>
                                    {
                                        this.state.officeDistListSecond.map((ele, index) => {
                                            return (
                                                <option key={index} style={{ color: "GrayText" }} value={ele.officeid}>{ele.officename} </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        {/*Additional Fields*/}
                        {/* <div className="row" style={{ marginTop: "9px", paddingLeft: "50px", marginRight: "50px" }}>
                            {this.state.formFieldLists != "" ?
                                <p className="label" style={{ marginBottom: "8px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>Additional Fields</p>
                                : ""}

                            {this.state.formFieldLists != "" ?
                                <>
                                    {this.state.formFieldLists.map((element, index) => this.renderFormElement(element, index))}
                                </>
                                : ""}
                        </div> */}
                        <hr class="col-11" style={{ borderTop: "2px dotted rgb(0, 121, 190)", marginLeft: "30px", marginTop: "-5px", }} />
                        <div className="row" style={{ padding: "0px 47px 10px 47px", marginTop: "-13px", marginTop: "-7px" }}>
                            <div className='col' style={{ textAlign: "end" }}>
                                <button type="submit" className="btn br-5 ml-2 text-white" id='submitBtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={() => this.consentLRQmodal(1)}><FaThumbsUp />&nbsp;Submit</button>&nbsp;
                                <button type="submit" className="btn mr-2 text-white" style={{ backgroundColor: "#0079bf" }} onClick={this.cancelRequest}><BsArrowRepeat />&nbsp;Cancel</button>
                            </div>
                        </div>
                        {/* <div className=" mr-5 mb-2" style={{ justifyContent: 'end', display: 'flex' }}>
                            <button type="submit" className="btn br-5 ml-2 text-white" id='submitBtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={() => this.consentLRQmodal(1)}><FaThumbsUp />&nbsp;Submit</button>&nbsp;
                            <button type="submit" className="btn mr-2 text-white" style={{ backgroundColor: "#0079bf" }} onClick={this.cancelRequest}><BsArrowRepeat />&nbsp;Cancel</button>
                        </div> */}
                    </div>
                    {/* Upload Bank Statement */}
                    <button type="button" id="bankStmtModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3" style={{ display: "none" }}>
                        Launch modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content" style={{ fontFamily: "Poppins,sans-serif", fontSize: "14px" }}>
                                <div class="modal-header">
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500", fontSize: "16px" }}>&nbsp;<img src={batch} width="25px" />&nbsp;Please upload the bank statement of the last three/six months.</p>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    {/* New Design UploadStmt */}
                                    <p class="text-center">
                                        <label for="attachment">
                                            <a class="btn btn-primary text-light" role="button" aria-disabled="false">+ Add</a>
                                        </label>
                                        <input type="file" name="file[]" accept=".pdf" id="attachment" onChange={this.checkNoofFiles.bind(this)}
                                            style={{ visibility: "hidden", position: "absolute" }} multiple />
                                        {/* <input type="file" name="upload" accept="application/pdf" onChange={this.handleFileChange} /> */}
                                    </p>
                                    <p id="files-area">
                                        <span id="filesList">
                                            <span id="files-names"></span>
                                        </span>
                                    </p>
                                    {/* Completed */}

                                    {/* <form className="form pt-3" action="/action_page.php" >
                                        <input type="file" id="filesData" onChange={this.checkNoofFiles.bind(this)} accept='.pdf' className="border text-dark ml-2 pr-5" multiple />
                                        <div className="card col-8" id="text" style={{ cursor: "default", display: "none" }}></div>
                                    </form> */}
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-sm text-white" data-dismiss="modal"
                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} aria-hidden="true"
                                        disabled={!this.state.selectedFile} onClick={this.documentsuploaded}>Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Consent Modal */}
                    <button id='consentModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                    </button>
                    <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ marginLeft: "100px" }}>
                                <div className="modal-body" id='consentBody'>
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Consent</p>
                                            <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgba(5,54,82,1)" }} />
                                            <span id=''>
                                                <div className='mb-2'>
                                                    <div className='col' style={{ marginLeft: "10px" }}>
                                                        {this.state.consentData ? <><input type="checkbox" className="form-check-input" id="" onChange={this.changeConsentType} style={{ position: "absolute", left: "10px" }} />
                                                            <p className="form-check-label" for="exampleCheck1" style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>{this.state.consentData}</p></> : ""}
                                                    </div>
                                                </div>
                                            </span>

                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" id='checkConsentBtn' data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)", display: "" }} onClick={this.setuserConsent}>Agree</button>
                                            &nbsp;
                                            {/* <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "#0079bf" }}>Cancel</button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Collateral UI */}
                    <button type="button" id="collateralModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2222" style={{ display: "none" }}>
                        Launch demo modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter2222" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content" id='uploadInvoiceFirst'>
                                <div class="modal-body" style={{ cursor: "default" }}>
                                    <div className='row'>
                                        <div className='col-10'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Please Provide The Proforma Invoice</p>
                                            <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
                                        </div>
                                        <div className="col-2">
                                            <FaTimesCircle type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ color: "rgb(5, 54, 82)", fontSize: "18px" }} onClick={this.closeCircle} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "#0079bf", fontWeight: "500" }}>Step &nbsp;<img src={step1} width="20px" style={{ marginLeft: "1px", marginTop: "-3px" }} /></p>
                                        </div>
                                    </div>
                                    {this.state.collateralDocList.map((collateral, index) => {
                                        return (
                                            <div className="row mb-3" key={index} style={{}}>
                                                <div className="col">
                                                    <p className="u1" style={{ color: "#00264d", fontWeight: "bold", fontSize: "14px", }}>
                                                        Document Name:&nbsp;<span style={{ fontWeight: "500" }}>{collateral.docname}</span>
                                                        {collateral.ismandatory == "1" ? <span style={{ color: "red" }}> *
                                                            <span style={{ fontWeight: "500", color: "#00264d" }}>{`(${collateral.docformat})`}
                                                            </span>
                                                        </span> : null}
                                                    </p>
                                                    <div style={{ marginTop: "-10px", color: "#00264d" }}>
                                                        <input type="file" id={"collFile" + index} name={index} accept='pdf,jpeg'
                                                            className="border" onChange={this.checkCollateral.bind(this, collateral.colldocrefid, index)} />&nbsp;
                                                        <span>Size: {collateral.docsize}mb</span>
                                                        <input type='text' id={index} style={{ display: "none" }} value="" />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div class="modal-footer">
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button className='btn btn-sm text-white' id='getFormDetailsNextBtn' style={{ backgroundColor: "rgb(136, 189, 72)", paddingLeft: "10px", paddingRight: "10px" }} onClick={this.formEnablePage}>Next</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-content" id='uploadDynamicForm' style={{ display: "none" }}>
                                <div class="modal-body" style={{ cursor: "default" }}>
                                    <div className='row'>
                                        <div className='col-10'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Please Fill The Additional Information.</p>
                                            <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
                                        </div>
                                        <div className="col-2">
                                            <FaTimesCircle type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ color: "rgb(5, 54, 82)", fontSize: "18px" }} onClick={this.closeCircle} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "#0079bf", fontWeight: "500" }}>Step &nbsp;<img src={step2} width="20px" style={{ marginLeft: "1px", marginTop: "-3px" }} /></p>
                                        </div>
                                    </div>
                                    <div className="row" style={{ fontSize: "14px" }}>
                                        {this.state.formFieldLists != "" ?
                                            <p className="label" style={{ marginBottom: "8px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>Additional Fields</p>
                                            : ""}

                                        {this.state.formFieldLists != "" ?
                                            <>
                                                {this.state.formFieldLists.map((element, index) => this.renderFormElement(element, index))}
                                            </>
                                            : ""}
                                    </div>
                                    <div class="modal-footer">
                                        <div className='row'>
                                            <div className='col' style={{ textAlign: "end" }}>
                                                <button className='btn btn-sm text-white' id='finalSubmitBtn' style={{ backgroundColor: "rgb(136, 189, 72)", paddingLeft: "10px", paddingRight: "10px" }} onClick={this.saveInvoiceandForm}>Save</button>
                                                &nbsp;
                                                <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onClick={this.cancelInvoice}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Modal */}
                    <button id='raiseLoanAlertModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter10">
                    </button>
                    <div className="modal fade" id="exampleModalCenter10" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                Please Complete KYC Verification to raise loan request.
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }}>Ok</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Approval Loan Modal */}
                    <button id='approveLoan' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter11">
                    </button>
                    <div className="modal fade" id="exampleModalCenter11" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" id='theModalContent' style={{ marginLeft: "" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col-sm-5 col-lg-12 col-md-4'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Enter OTP</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row' style={{ marginTop: "-10px" }}>
                                                <div style={{ display: "" }} className="col">
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "14px" }}>Mobile OTP</p>
                                                    <input className='form-control' type='number' placeholder='Enter OTP' id='loanAcceptInput' onChange={this.mobileOTP}
                                                        onInput={(e) => {
                                                            e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                        }}
                                                        autoComplete='off' style={{ marginTop: "-10px" }} />
                                                </div>
                                            </div>

                                            <div className='row mt-2'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <p id="countdown" style={{ color: "grey" }}></p>
                                                    <p id='countdown2' style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }} onClick={this.regenerateOTP}></p>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' id='loanAcceptInputButtons' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" id='otpSubmitBtn'
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.loanRequestFinal}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loan Request details */}
                    <button id='loanRequestModal' style={{ display: "none" }} type="button" class="btn btn-info" data-toggle="modal" data-target=".bd-example-modal-lg1">
                        Borrower Details
                    </button>
                    <div class="modal fade bd-example-modal-lg1" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p className='font-weight-bold' style={{ color: "rgba(5,54,82,1)", fontWeight: "600" }}><FaRegFileAlt style={{ fontSize: "15px" }} />Loan Request Details</p>
                                            <hr style={{ width: "70px" }} />
                                        </div>
                                    </div>
                                    <div className='row p-2'>
                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                            <div className='row'>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Borrower ID</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                    <p className="mb-0">{sessionStorage.getItem('userID')}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Product Type</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                    <p className="mb-0">{this.state.productName}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Loan Purpose</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                    <p className="mb-0">{this.state.loanPurpose}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                            <div className='row'>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Amount Requested</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                    <p className="mb-0">₹ {parseFloat(this.state.loanamtrequested).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Statements Uploaded</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col'>
                                                    <p className="mb-0">{documentsuploaded == "1" ? "Yes" : <span>{documentsuploaded == "0" ? "No" : null}</span>}</p>
                                                </div>
                                            </div>
                                            {this.state.supplierName &&
                                                <div className='row'>
                                                    <div className='col-sm-5 col-md-5 col-lg-5'>
                                                        <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Supplier Name</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold">:</p>
                                                    </div>
                                                    <div className='col'>
                                                        <p className="mb-0">{this.state.supplierName}</p>
                                                    </div>
                                                </div>
                                            }
                                            {this.state.cibilscore ?
                                                <div className='row'>
                                                    <div className='col-sm-7 col-md-7 col-lg-7'>
                                                        <p className="mb-0 font-weight-bold">Cibil Score</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold">:</p>
                                                    </div>
                                                    <div className='col'>
                                                        <p className="mb-0">{this.state.cibilscore}</p>
                                                    </div>
                                                </div> : null}

                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" data-dismiss="modal"
                                        onClick={this.loanRequest} style={{ backgroundColor: "rgb(136, 189, 72)" }}>Proceed</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reference Members */}
                    <button id='refModal' style={{ display: "none" }} type="button" class="btn btn-info" data-toggle="modal" data-target=".bd-example-modal-lg188">
                        Add References
                    </button>
                    <div class="modal fade bd-example-modal-lg188" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content" style={{ cursor: "default" }}>
                                <div class="modal-header">
                                    <p class="modal-title" style={{ color: "rgba(5,54,82,1)", fontWeight: "600" }}><FaRegUser style={{ marginTop: "-6px" }} />&nbsp;Add References</p>
                                    <button type="button" class="close" data-dismiss="modal" onClick={this.closeRefModal} aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className='card' style={{ cursor: "default", padding: "5px", marginTop: "-20px" }}>
                                        <div className='row'>
                                            <div className="col-lg-4 mb-2" style={{ fontSize: "14px" }}>
                                                <p className="label" style={{ marginBottom: "1px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>Reference Name *</p>
                                                <input className="form-control"
                                                    style={{ border: "1px solid rgb(0, 121, 190)", backgroundColor: "whitesmoke" }}
                                                    type="text"
                                                    name="refName"
                                                    value={this.state.refName}
                                                    onChange={this.handleInputChange}
                                                    placeholder='Enter Name'
                                                />
                                            </div>
                                            <div className="col-4 mb-2" style={{ fontSize: "14px" }}>
                                                <p className="label" style={{ marginBottom: "1px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>Reference Mobile No. *</p>
                                                <input className="form-control"
                                                    style={{ border: "1px solid rgb(0, 121, 190)", backgroundColor: "whitesmoke" }}
                                                    type="number"
                                                    name="refMobileno"
                                                    value={this.state.refMobileno}
                                                    onChange={this.handleInputChange}
                                                    placeholder='Enter Mobile Number'
                                                />
                                                {errors.refMobileno && <span className='error' style={{ color: "red", fontSize: "12px" }}><BsInfoCircle />{errors.refMobileno}</span>}
                                            </div>
                                            <div className="col-lg-4 mb-2" style={{ fontSize: "14px" }}>
                                                <p className="label" style={{ marginBottom: "1px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{`Email ID(Optional)`}</p>
                                                <input className="form-control"
                                                    style={{ border: "1px solid rgb(0, 121, 190)", backgroundColor: "whitesmoke" }}
                                                    type="text"
                                                    name="refEmail"
                                                    value={this.state.refEmail}
                                                    onChange={this.handleInputChange}
                                                    placeholder='Enter Email ID'
                                                />
                                                {errors.refEmail && <span className='error' style={{ color: "red", fontSize: "12px" }}><BsInfoCircle />{errors.refEmail}</span>}
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col mb-2" style={{ fontSize: "14px", textAlign: "end" }}>
                                                <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                    disabled={this.state.refMembers.length >= maxReferences}
                                                    onClick={this.addMembers}><FaUserPlus />&nbsp;Add</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontWeight: "500", fontSize: "14px" }}>
                                            <p>Note: Minimum one reference and maximum two references can be added.</p>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col'>
                                            {this.state.refMembers.length === 0 ? (
                                                <></>
                                            ) : (
                                                <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                    <Table responsive>
                                                        <Thead>
                                                            <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Reference Name</Th>
                                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Reference Mobile No.</Th>
                                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Email ID</Th>
                                                                <Th></Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {this.state.refMembers.map((lists, index) => (
                                                                <Tr key={index} style={{
                                                                    marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                }}>
                                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.refname}</Td>
                                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.refmobile}</Td>
                                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.refemail ? lists.refemail : "-"}</Td>
                                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "end", }}><FaRegTrashAlt style={{ color: "red" }} onClick={() => this.delNewMember(index)} /></Td>
                                                                </Tr>
                                                            ))}
                                                        </Tbody>
                                                    </Table>
                                                    &nbsp;
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)", paddingLeft: "10px", paddingRight: "10px" }}
                                                disabled={
                                                    (this.state.refMembers.length <= 0)
                                                }
                                                onClick={this.saveRefDetails}>Submit</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Common Alert */}
                    <button id='commonModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter21">
                    </button>
                    <div className="modal fade" id="exampleModalCenter21" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle22" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            {this.state.cancelFlag === true ?
                                <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                    <div class="modal-body">
                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>Do you want to cancel the loan request?</p>
                                        <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                    </div>
                                    <div class="modal-footer" style={{ marginTop: "-28px" }}>
                                        <button type="button" class="btn text-white btn-sm"
                                            style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.confirmCancelRequest}>Yes</button>
                                        <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                            style={{ backgroundColor: "#0079BF" }}>No</button>
                                    </div>
                                </div>
                                :
                                <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                    <div class="modal-body">
                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>{this.state.resMsg}</p>
                                        <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                    </div>
                                    {/* <div className="modal-body">
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
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.reloadPage}>Okay</button>
                                        </div>
                                    </div>
                                </div> */}
                                    <div class="modal-footer" style={{ marginTop: "-28px" }}>
                                        <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                            style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.reloadPage}>Okay</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withTranslation()(LoanRequest)
