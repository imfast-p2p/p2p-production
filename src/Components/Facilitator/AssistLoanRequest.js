import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RangeStepInput } from 'react-range-step-input';
import { BASEURL } from '../assets/baseURL';
import FacilitatorSidebar from '../../SidebarFiles/FacilitatorSidebar';
import $ from 'jquery';
import SimpleReactValidator from 'simple-react-validator';
import { confirmAlert } from "react-confirm-alert";
import i18n from "i18next";
import { withTranslation } from 'react-i18next';
import dashboardIcon from '../assets/icon_dashboard.png';
import { FaAngleLeft, FaThumbsUp, FaRegFileAlt, FaRegEdit, FaCheckCircle, FaTimesCircle, FaRegTrashAlt, FaRegUser, FaUserPlus } from "react-icons/fa";
import { BsInfoCircle, BsArrowRepeat } from "react-icons/bs";
// import SwitchToggle from './SwitchToggle'
import Loader from '../Loader/Loader';
import step1 from '../assets/number-one.png';
import step2 from '../assets/number-2.png';
import batch from '../assets/batch.png';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
const dt = new DataTransfer();
var array1 = [];

var formDatas;
var dataList = [];
var jsonForm;
var isCollReq;

var extractedData;
var isStmtReq = "0";
var firstarray = [];
var documentsuploaded = "0";
var isDsbToSuppReq = "0"

class AssistLoanRequest extends Component {
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
            minloan: "500",
            maxloan: "500000",
            minterm: "3",
            maxterm: "36",
            reptext: "",
            loanPurposeDetails: [],
            getattributes: [],

            documentNumber: "",
            otp: "",
            cibilscore: "",

            mobileref: "",

            uploadedFiles: "",
            loanpurposeName: "",

            //Collateral
            collateralDocList: [],
            isCollateralId: "",
            collDataLists: [],

            // Verification of Borrower
            assistBorrID: "",
            assistBorrName: "",
            user: "BOR-",
            isMobileOrEmail: false,

            docuStatus: "",
            collStatus: "",
            kycstatus: "",

            collateralUploaded: false,

            validationError: "",
            validationErrorAmt: "",
            selectedFile: null,

            // jlg members
            dropdownText: 'Select members',
            selectedCount: 0,
            selectedIndexes: [],

            productName: "",
            loanPurpose: "",

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
            jlgID: "",
            selectedFiles: [],

            officeDistList: [],
            officeDistListCalled: false,
            officeDistListFirst: [],
            distcode: '',
            distcodeForList1: '',
            officeDistListSecond: [],
            officeid: '',

            dynamicFormFlag: "0",
            formDetailList: [],
            formFieldLists: [],

            formCategory: "",
            formType: "",

            errorMessages: {},

            supplierLists: [],
            selectedSupplier: "",
            supplierName: "",
            collateralndFormSaved: "",
            commonSupplierName: "",
        }
        this.borrowerid = this.borrowerid.bind(this);
        this.productid = this.productid.bind(this);
        this.loanamtrequested = this.loanamtrequested.bind(this);
        this.loanpurpose = this.loanpurpose.bind(this);
        this.noofrepayments = this.noofrepayments.bind(this);
        this.repaymentfrequency = this.repaymentfrequency.bind(this);
        this.documentsuploaded = this.documentsuploaded.bind(this);
        this.aaid = this.aaid.bind(this);
        this.assistLoanReq = this.assistLoanReq.bind(this);
        this.value = this.value.bind(this);
        this.getLoanPurpose = this.getLoanPurpose.bind(this);
        this.validator = new SimpleReactValidator();

        this.formRefs = [];
    }

    componentDidMount() {
        console.log(sessionStorage.getItem('token'));
        console.log(sessionStorage.getItem('userID'));

        this.loanPurposeGroupDetails();
        //this.getProductList();
        $("#Launch").click()
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
        // $("#grpCheckbox").prop('disabled', true);
        $('#fileData').bind('change', function () {
            $("#text").show();
            var files = this.files;
            var i = 0;
            for (; i < files.length; i++) {
                var filename = files[i].name + "<br />";
                $("#text").append(filename);
            }
        });
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
        this.setState({ borrowerid: event.target.value.trim() })
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

                    $("#loanCategory2").hide();
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
        $("#loanCategory2").hide();
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
                    $("#loanCategory2").hide()
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

                    $("#loanCategory2").show()
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
                        $("#loanCategory2").hide()
                        $("#hiddenField").hide();
                        this.setState({ finalProductList: [] });
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // productid(event) {
    //     this.setState({ productid: event.target.value })
    //     console.log(event.target.value)
    //     this.state.productList
    //         .filter((e) => e.prodid == event.target.value)
    //         .map((prdt, index) => {
    //             this.setState({ repaymentfrequency: prdt.repaymentfrequency })
    //             this.setState({ minloan: prdt.minloanamount })
    //             this.setState({ maxloan: prdt.maxloanamount })
    //             this.setState({ minterm: prdt.minnoofrepayments })
    //             this.setState({ maxterm: prdt.maxnoofrepayments })
    //             this.setState({ reptext: prdt.repaymentfrequencydesc })
    //             this.setState({ productName: prdt.prodname })
    //             this.getLoanPurpose(event.target.value);
    //         })
    //     console.log("repayment " + this.state.repaymentfrequency)
    //     console.log("Min Loan " + this.state.minloan)
    //     console.log("Max Loan " + this.state.maxloan)
    // }
    productid = (event, isstmtrequired, prodid, disbursetosupplier, collateralrequired) => {
        $("#hiddenField").show();
        console.log(isstmtrequired, disbursetosupplier, collateralrequired);
        var disbToSupp = disbursetosupplier;
        var isCollateralReq = collateralrequired;
        isDsbToSuppReq = disbToSupp;

        var stmtVar = isstmtrequired;
        isStmtReq = stmtVar;
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
            this.setState({ formFieldLists: "" })
            isCollReq = "0";
        }
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
    cibilscore = (event) => {
        this.setState({ cibilscore: event.target.value })
    }
    loanamtrequested(event) {
        this.setState({ loanamtrequested: event.target.value })
    }
    loanpurpose(event) {
        this.setState({ loanpurpose: event.target.value })
        this.setState({ loanpurposeName: event.target.name })
        console.log(event.target.name)
        console.log(event.target.value)

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
        this.setState({ noofrepayments: event.target.value })
    }
    repaymentfrequency(event) {
        this.setState({ repaymentfrequency: event.target.value })
    }
    documentsuploaded(event) {
        // if ($('#chkPassport').is(':checked')) {
        //     this.setState({ documentsuploaded: "1" })
        //     console.log("1", this.state.documentsuploaded)
        // } else {
        //     this.setState({ documentsuploaded: "0" })
        //     console.log("0", this.state.documentsuploaded)
        // }
        this.setState({ docuStatus: "1" })
        this.setState({ documentsuploaded: "1" });
        documentsuploaded = "1";
        console.log(documentsuploaded);
    }

    aaid(event) {
        this.setState({ aaid: event.target.value })
    }

    value(event) {
        this.setState({ value: event.target.value })
    }
    mobileOTP = (event) => {
        this.setState({ otp: event.target.value })
    }
    raiseLoanModal = () => {
        $("#loanRequestModal").click();
    }

    // getProductList() {
    //     fetch(BASEURL + '/lsp/getloanproductlist', {
    //         headers: {
    //             'Authorization': "Bearer " + sessionStorage.getItem('token'),
    //         }
    //     }).then((Response) => {
    //         return Response.json();
    //     })
    //         .then((resdata) => {
    //             if (resdata.status == 'SUCCESS') {
    //                 console.log(resdata);
    //                 this.setState({
    //                     productList: resdata.msgdata
    //                 })
    //                 console.log(this.state.productList)

    //                 this.setState({
    //                     productList: this.state.productList.map((pdata) => {
    //                         console.log(pdata)
    //                         // this.getLoanPurpose(pdata.prodid);
    //                         return pdata;
    //                     })
    //                 })
    //                 // this.setState({ productid: resdata.msgdata[0] });
    //                 // console.log(this.state.productList)
    //             } else {
    //                 if (resdata.code === '0102') {
    //                     confirmAlert({
    //                         message: resdata.message + ", please login again to continue.",
    //                         buttons: [
    //                             {
    //                                 label: "OK",
    //                                 onClick: () => {
    //                                     window.location = '/login';
    //                                     sessionStorage.removeItem('status')
    //                                     sessionStorage.clear();
    //                                     sessionStorage.clear();
    //                                 },
    //                             },
    //                         ],
    //                         closeOnClickOutside: false,
    //                     });
    //                 } else {
    //                     confirmAlert({
    //                         message: resdata.message,
    //                         buttons: [
    //                             {
    //                                 label: "OK",
    //                                 onClick: () => {
    //                                 },
    //                             },
    //                         ],
    //                     });
    //                 }
    //                 //alert("Issue: " + resdata.message);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }

    verifyBorrProfile = () => {
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
                        assistBorrName: resdata.msgdata.borrowername,
                        kycstatus: resdata.msgdata.kycstatus
                    })
                    $("#verifyBPModal").click()
                } else {
                    alert(resdata.message);
                    document.getElementById('verifyBor').value = '';
                    this.setState({ borrowerid: "" })
                }
            })
            .catch(error => console.log(error)
            );

    }
    checkNoofFiles(e) {
        var file1 = e.target.files[0];
        var allowedExtensions = /(\.pdf)$/i;

        if (allowedExtensions.exec(file1.name)) {
            this.setState({ selectedFile: file1 });
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
                        //window.location = '/customer';
                        console.log("routed to loan request")
                        if (isCollReq == "1") {
                            this.setFormTxndata();
                        } else {
                            window.location = '/customer';
                            console.log("routed to loan request")
                        }
                    }
                }
            } catch (error) {
                console.log(error);
                // Handle upload error
            }
        }
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
        //             if (this.state.collateralUploaded == true) {
        //                 this.uploadCallCollateral();
        //                 console.log("collateral Uploaded")
        //             } else {
        //                 window.location = '/customer'
        //                 console.log("routed to loan request")
        //             }
        //         } else {
        //             alert(resdata.message); //undefined
        //         }
        //     })
        //     .catch(error => console.log(error)
        //     );
    }
    uploadDocument = () => {
        $("#bankStmtModal").click();
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
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({ collateralDocList: resdata.msgdata })
                    $("#collateralModal").click();
                } else {
                    //alert("Issue: " + resdata.message);
                    //$("#collateralModal").click();
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
        this.setState({ collStatus: "1" })
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

    clearForm = () => {
        this.formRefs.forEach(ref => {
            if (ref) ref.value = '';
        });
    };
    renderFormElement = (element, index) => {
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
                            ref={el => this.formRefs[index] = el}
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
                            ref={el => this.formRefs[index] = el}
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
                            ref={el => this.formRefs[index] = el}
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
                            ref={el => this.formRefs[index] = el}
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
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <textarea
                            className="form-control"
                            name={element.name}
                            rows={element.rows}
                            ref={el => this.formRefs[index] = el}
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
                    <div key={element.datatype} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label} *</p>
                        <input
                            type="date"
                            name={element.name}
                            ref={el => this.formRefs[index] = el}
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
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location = '/customer'
                                }
                            }
                        ],
                        closeOnClickOutside: false,
                    })
                    console.log(resdata.msgdata.loanreqno)
                } else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }

            })
    }
    assistLoanReq(loanpur) {
        //this.setState({ loanpurpose: loanpur })
        if (this.validator.allValid()) {

        } else {
            this.validator.showMessages();
            // rerender to show messages for the first time
            // you can use the autoForceUpdate option to do this automatically`
            this.forceUpdate();
            return;
        }
        console.log(this.state.jlgID)
        let commonData = {
            borrowerid: this.state.assistBorrID,
            productid: this.state.productid,
            loanamtrequested: parseInt(this.state.loanamtrequested),
            loanpurpose: parseInt(this.state.loanpurpose),
            noofrepayments: parseInt(this.state.noofrepayments),
            repaymentfrequency: parseInt(this.state.repaymentfrequency),
            aaid: this.state.aaid
        };
        if (isStmtReq == "1" && this.state.cibilscore != "") {
            commonData.documentsuploaded = parseInt(documentsuploaded);
            commonData.cibilscore = this.state.cibilscore;
            if (this.state.jlgID && this.state.jlgID.trim() !== "") {
                commonData.jlgid = this.state.jlgID;
            }
        } else if (isStmtReq == "0" && this.state.cibilscore != "") {
            commonData.documentsuploaded = parseInt(documentsuploaded);
            commonData.cibilscore = this.state.cibilscore;
            if (this.state.jlgID && this.state.jlgID.trim() !== "") {
                commonData.jlgid = this.state.jlgID;
            }
        } else if (isStmtReq == "1" && this.state.cibilscore == "") {
            commonData.documentsuploaded = parseInt(documentsuploaded);
            if (this.state.jlgID && this.state.jlgID.trim() !== "") {
                console.log(this.state.jlgID)
                commonData.jlgid = this.state.jlgID;
            }
        } else if (isStmtReq == "0" && this.state.cibilscore == "") {
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
        // var jsonBody = this.state.cibilscore === "" ? noCibil : withCibil;

        fetch(BASEURL + '/lsp/borrwerloanreq', {
            method: 'POST',
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
                    console.log(resdata.msgdata.mobileref)
                    sessionStorage.setItem("MobileRef", resdata.msgdata.mobileref)

                    this.setState({
                        mobileref: resdata.msgdata.mobileref,
                        encryptData: resdata.msgdata.encryptdata,
                    })
                    $(".bd-example-modal-lg").hide()
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
                    $(".bd-example-modal-lg").hide()
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    $("#loanRequestModal").click();
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }

            })
    }
    regenerateOTP = (loanpur) => {
        //this.setState({ loanpurpose: loanpur })
        fetch(BASEURL + '/usrmgmt/regenerateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                operationtype: 13,
                mobileref: this.state.mobileref,
                emailref: this.state.mobileref,
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
                    this.setState({ mobileref: resdata.msgdata.mobileref })

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
    approveLoanReq = () => {
        console.log(this.state.mobileref)
        fetch(BASEURL + '/lsp/borrwerloanreq', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                borrowerid: this.state.assistBorrID,
                encryptdata: this.state.encryptData,
                mobileotp: parseInt(this.state.otp),
                mobileref: this.state.mobileref,
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    sessionStorage.setItem('loanReqNo', resdata.msgdata.loanreqno);
                    console.log(sessionStorage.getItem('loanReqNo'))
                    if (this.state.documentsuploaded == "1") {
                        console.log(resdata.msgdata)
                        // alert(resdata.message + ". " + "Loan request number is " + resdata.msgdata.loanreqno + ".");
                        confirmAlert({
                            message: resdata.message + ". " + "Loan request number is " + resdata.msgdata.loanreqno + ".",
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        this.uploadFile();
                                    },
                                },
                            ],
                            closeOnClickOutside: false,
                        });
                        // confirmAlert({
                        //     message: "Loan request number is " + resdata.msgdata.loanreqno + ".",
                        //     buttons: [
                        //         {
                        //             label: "OK",
                        //             onClick: () => {
                        //                 console.log("Im clicked")
                        //                 this.uploadFile();
                        //             },
                        //         },
                        //     ],
                        //     closeOnClickOutside: false,
                        // });
                        // alert(resdata.message)
                        // alert("Loan request number is " + resdata.msgdata.loanreqno + ".")

                    } else {
                        // confirmAlert({
                        //     message: resdata.message,
                        //     buttons: [
                        //         {
                        //             label: "OK",
                        //             onClick: () => {
                        //             },
                        //         },
                        //     ],
                        //     closeOnClickOutside: false,
                        // });
                        alert("You need to upload statement Later!");
                        // window.location.reload();
                    }

                } else {
                    // confirmAlert({
                    //     message: resdata.message,
                    //     buttons: [
                    //         {
                    //             label: "OK",
                    //             onClick: () => {
                    //                 window.location.reload()
                    //             },
                    //         },
                    //     ],
                    //     closeOnClickOutside: false,
                    // });
                    alert(resdata.message);

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
                    // confirmAlert({
                    //     message: resdata.message,
                    //     buttons: [
                    //         {
                    //             label: "OK",
                    //             onClick: () => {
                    //             },
                    //         },
                    //     ],
                    //     closeOnClickOutside: false,
                    // });
                }
            })

    }
    onChange(e) {
        this.setState({ value: e.target.value });
        var x = document.getElementById("rValue");
        var y = document.getElementById("slider2");
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
    enableSubmit = () => {
        $("#submitBtn").prop('disabled', false);
        $("#grpCheckbox").prop('disabled', false);

        $(".beforeVerID").hide();
        $("#afterVerName").show();
    }

    cancelRequest = () => {
        alert("New Loan Request Cancelled");
        window.location = "/facilitatorDashboard"
    }
    // JLG Logics
    checkGrpCheckBox = (e) => {
        console.log(e.target.checked);
        var check = e.target.checked;
        if (check == true) {
            this.getGrouplist();
            $("#jlgDrpdown").show();
            console.log("True")
        } else if (check == false) {
            $("#jlgDrpdown").hide();
            console.error('False');
        }
    }
    getGrouplist = () => {
        fetch(BASEURL + "/usrmgmt/jlg/getgrouplist?mobileno=" + this.state.borrowerid, {
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
                    $("#grpCheckbox").prop('disabled', false);
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

                        document.getElementById('verifyBor').value = '';
                        this.setState({ borrowerid: "" })
                        $(".beforeVerID").show();
                        $("#afterVerName").hide();
                        $("#grpCheckbox").prop('disabled', true);
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    groupSelection = (event) => {
        console.log(event.target.value);
        this.setState({ jlgID: event.target.value });
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
        $("#exampleModalCenter2").modal('hide');
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
        // var dropdownItems = ['Member 1', 'Member 2', 'Member 3'];
        var dropdownItems = this.state.groupList;
        const { dropdownText, showPopover, productList, finalProductList, errors, maxReferences } = this.state;
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F4F7FC" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <FacilitatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1">
                            <button style={{ marginLeft: "30px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px", color: "#222C70" }} />
                                <Link to="/facilitatorDashboard">Home</Link> / Customer Loan Request</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/facilitatorDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row' style={{ marginTop: "-10px" }}>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgb(5, 54, 82)" }}>{t('Customer Loan Request')}</p>
                        </div>
                    </div>
                    {/* Verification Modal */}
                    <button id='verifyBPModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenterB">
                    </button>
                    <div className="modal fade" id="exampleModalCenterB" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "360px", marginLeft: "100px" }}>
                                <div className="modal-header">
                                    <p class="modal-title font-weight-bold" id="exampleModalLongTitle" style={{ color: "#00264d", fontSize: "15px" }}>Borrower Details</p>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className='row p-2'>
                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                            <div className='row'>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Borrower ID</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0" style={{ width: "max-content" }}>{this.state.assistBorrID}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Borrower Name</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0">{this.state.assistBorrName}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">KYC Status</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0" style={{ width: "max-content" }}>{(this.state.kycstatus == "1" || this.state.kycstatus == "9") ? "Verified" : <span>{this.state.kycstatus == "0" ? "Not Verified" : null}</span>}</p>
                                                </div>
                                            </div>
                                            {/* <div className='row'>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Status</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0">{this.state.statusid}</p>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-sm text-white" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.enableSubmit}>Submit</button>
                                    <button type="button" class="btn btn-sm text-white" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Approval Loan Modal */}
                    <button id='approveLoan' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                    </button>
                    <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" id='theModalContent' style={{ marginLeft: "" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col-sm-5 col-lg-12 col-md-4'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Enter OTP</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row' style={{ marginTop: "-10px" }}>
                                                <div style={{ display: "" }} className="col">
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "14px" }}>
                                                        Borrower ID: <span style={{ fontWeight: "normal" }}>{this.state.assistBorrID}</span>
                                                    </p>
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
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.approveLoanReq}>Approve</button>
                                            {/* &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* New Loan Request UI */}
                    {/* <div className="row">
                        <div className="col-11" style={{ color: "#222C70" }}>
                            <p className="ml-5" style={{ fontWeight: "500" }}>Select Your Loan Category</p>
                            <div className='card ml-5'>
                                <div className="scrollbar" style={{ cursor: "default", overflowX: "hidden", height: "150px" }} >
                                    <div className='row pl-2 pr-2'>

                                        {this.state.productList.map((product, index) => {
                                            return (
                                                <div className='col-4' key={index}>
                                                    <div className='card pl-3' style={{ height: "50px", border: "1px solid rgba(0,121,190,1)", marginBottom: "1px", cursor: "default" }}>
                                                        <div className='form-check mt-2'>
                                                            <input className='form-check-input' type='radio'
                                                                name="exampleRadios1" id="exampleRadios1"
                                                                onChange={this.productid} key={index} value={product.prodid}
                                                                style={{ color: "GrayText" }} />{product.prodname}
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
                    </div> */}
                    {/* Loan Purpose UI */}
                    {/* <div className="row">
                        {this.state.loanPurposeDetails.map((puposeDetails, index) => {
                            return (
                                <div className="col-11" key={index} style={{ color: "#222C70" }}>
                                    <p className="ml-5" style={{ fontWeight: "500" }}>Select Your Loan Purpose</p>
                                    <div className="card ml-5" style={{ cursor: "default" }}>
                                        <div className='scrollbar' style={{ cursor: "default", overflowX: "hidden", height: "150px" }} >
                                            <div className='row pl-2 pr-2'>
                                                {
                                                    puposeDetails.details.map((sub, subindex) => {
                                                        return (
                                                            <div className='col-4' key={subindex}>
                                                                <div className='card pl-3' style={{ height: "50px", border: "1px solid rgba(0,121,190,1)", marginBottom: "1px", cursor: "default" }}>
                                                                    <div className='form-check mt-2'>
                                                                        <input className='form-check-input' type='radio'
                                                                            name={sub.loanpurpose} id="exampleRadios2"
                                                                            onChange={this.loanpurpose} key={subindex} value={sub.loanpurposeid} style={{ color: "GrayText" }} defaultValue />{sub.loanpurpose}
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
                            )
                        })
                        }

                    </div> */}

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
                    <div className="row" id='loanCategory2' style={{ display: "none" }}>
                        <div className="col-11">
                            <div className='row' style={{ marginRight: "-63px" }}>
                                <div className='col'>
                                    <p className="ml-5" style={{ color: "rgb(5, 54, 82)", fontWeight: "600", fontSize: "14px" }}>Select Loan Product *</p>
                                </div>
                                <div className='col'>
                                    <div className='col' style={{ textAlign: "end" }}>
                                        <p className='assignWkflw' style={{ cursor: "pointer", fontWeight: "500", fontSize: "14px" }}>
                                            <span onClick={this.checkLoanEligibility}><FaRegEdit />&nbsp;Check Loan Eligibility</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className='card ml-5' style={{ marginTop: '-10px', position: 'relative' }} onClick={() => this.handlePopoverToggle(null)}>
                                <div className='scrollbar' style={{ cursor: 'default', overflowX: 'hidden', height: (finalProductList.length > 3 || showPopover ? "200px" : "50px") }}>
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
                                                            style={{ color: 'rgba(5,54,82,1)', fontSize: "14px" }}
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
                        <div className="row" style={{ color: "#222C70" }}>
                            <div className="col-md-6">
                                <div className="mt-4 ml-5">
                                    <p htmlFor="loanAmount" className="label" style={{ color: "rgba(5,54,82,1)", fontWeight: "600", marginBottom: "5px", fontSize: "14px" }}>{t('Enter Loan Amount *')}</p>
                                    <div class="input-group mb-3" style={{ width: "94%", border: "1px solid rgb(0, 121, 190) ", borderRadius: "5px" }}>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1" style={{ backgroundColor: "white", zIndex: "2", border: "1px solid rgb(0, 121, 190)" }}>₹</span>
                                        </div>
                                        <input id="rValue" type="number"
                                            onChange={this.loanamtrequested} class="form-control" placeholder={t(' Enter amount')} aria-label="Username" aria-describedby="basic-addon1" />
                                    </div>
                                    <p style={{ fontSize: "12px" }}><BsInfoCircle />You Can Apply For An Amount Between</p>

                                    <RangeStepInput id="slider2" className="input" style={{ width: "439px", backgroundColor: "rgb(0, 121, 190)", marginTop: "-12px" }}
                                        min={this.state.minloan} max={this.state.maxloan} step={100}
                                        onChange={this.onChange.bind(this)} value={this.state.loanamtrequested}
                                    />
                                    <p className=""><span style={{ fontSize: "14px" }}>Min ₹ {parseFloat(this.state.minloan).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span><span style={{ marginLeft: "226px", fontSize: "14px" }}>Max ₹{parseFloat(this.state.maxloan).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                    {this.validator.message('Loan Amount', this.state.loanamtrequested, 'required|min:1|max:6', { className: 'text-danger' })}

                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mt-4">
                                    <p className="label" style={{ fontWeight: "500", fontSize: "14px" }}>{t('Enter Loan Tenure *')}</p>
                                    <div class="input-group mb-3" style={{ width: "88%", border: "1px solid rgb(0, 121, 190)", borderRadius: "5px", height: "38px", marginTop: "-10px" }}>
                                        <input id="rpay" type="number"
                                            onChange={this.noofrepayments} class="form-control" placeholder={t('Enter Days/Months')} aria-label="Username" aria-describedby="basic-addon1" />
                                    </div>
                                    <p style={{ fontSize: "12px" }}><BsInfoCircle />You Can Apply For A Loan Tenure Between</p>
                                    <RangeStepInput id="sliderM" className="input" style={{ width: "452px", backgroundColor: "rgb(0, 121, 190)", marginTop: "-12px" }}
                                        min={this.state.minterm} max={this.state.maxterm} step={1}
                                        onChange={this.onTenure.bind(this)} value={this.state.noofrepayments}
                                    />
                                    <div className='row' style={{ width: "94%" }}>
                                        <div className='col' style={{ fontSize: "14px" }}>
                                            <p>
                                                <span >Min {this.state.minterm} </span>{this.state.reptext}
                                            </p>
                                        </div>
                                        <div className='col' style={{ textAlign: "end", fontSize: "14px" }}>
                                            <p>
                                                <span >Max {this.state.maxterm}</span> {this.state.reptext}
                                            </p>
                                        </div>
                                    </div>
                                    {this.validator.message('tenure', this.state.noofrepayments, 'required|min:1|max:2', { className: 'text-danger' })}

                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ color: "#222C70" }}>
                            <div className="col-md-6" >
                                <div className="mt-4" style={{ marginLeft: '45px' }}>
                                    {/* <h6 className="label">Repayment Frequency : </h6><p id="repayment"></p> */}
                                    <p className="label" style={{ color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}>{t('Repayment Frequency')}: {this.state.reptext} </p>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex mt-4" >

                                <input type="checkbox" className="" style={{ marginTop: "-14px" }} id="chkPassport" value={this.state.documentsuploaded} />&nbsp;
                                <p className={isStmtReq == "0" ? "disabled-text" : "label"} id='upldText' style={{ color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}> {t('Upload Bank Statements')} &nbsp;
                                </p>
                            </div>
                            <div className='col'></div>

                            <div className='col pl-1' id='uploadDoc' style={{ marginLeft: "10px", marginBottom: "10px" }}>
                                <button className='btn btn-sm text-white' id='uploadBtn' onClick={this.uploadDocument} style={{ backgroundColor: "rgb(0, 121, 191)", display: "none", marginTop: "-13px" }}>
                                    {this.state.docuStatus == "1" ? <span id='uploadAct'>Uploaded</span> : <span >Upload</span>}
                                </button>
                                &nbsp;
                                {this.state.docuStatus == "1" ? <FaCheckCircle style={{ color: "green", marginLeft: "10px", marginTop: "-20px" }} /> : ""}
                            </div>
                            {/* <div className='col pl-1'>
                            <form className="form pt-3" action="/action_page.php" id='uploadDoc'>
                                <input type="file" id="fileData" accept='.pdf' onChange={this.checkNoofFiles.bind(this)} className="border text-dark ml-2 pr-5" multiple />
                                <div className="card col-8" id="text" style={{ cursor: "default", display: "none" }}></div>
                            </form>
                        </div> */}
                        </div>

                        <div className="row mt-0" style={{ color: "#222C70" }}>
                            <div className="col-5 beforeVerID" style={{ marginLeft: '45px', marginTop: '-10px' }}>
                                <div className="">
                                    <p className="label" style={{ fontWeight: "500", marginBottom: "4px", fontSize: "14px" }}>{t('Borrower ID *')}</p>
                                    <div class="input-group mb-3" style={{ width: "88%", border: "1px solid rgb(0, 121, 190)", borderRadius: "5px", height: "38px" }}>
                                        <input id="verifyBor" type="text" onPaste={this.onEmailMobileLogin}
                                            autoComplete='off'
                                            onKeyPress={this.onEmailMobileLogin}
                                            onChange={this.borrowerid} class="form-control" placeholder={t('Borrower ID ')} aria-label="Username" aria-describedby="basic-addon1" value={this.state.borrowerid} />
                                    </div>
                                </div>
                            </div>
                            <div className='col-1 beforeVerID'>
                                <button className='btn text-white' onClick={this.verifyBorrProfile} style={{
                                    backgroundColor: "rgb(0, 121, 191)",
                                    marginLeft: "-65px", marginTop: "18px",
                                    fontSize: "14px"
                                }}>Verify</button>
                            </div>
                            <div className="col-6" id='afterVerName' style={{ marginLeft: '45px', marginTop: '-10px', display: "none" }}>
                                <div className="">
                                    <p className="label" style={{ fontWeight: "500", marginBottom: "4px", fontSize: "14px" }}>{t('Borrower ID')}</p>
                                    <div class="input-group mb-3" style={{ width: "88%", border: "1px solid rgb(0, 121, 190)", borderRadius: "5px", height: "38px" }}>
                                        <input id="rValue" type="text"
                                            class="form-control" placeholder={t('Borrower ID ')} aria-label="Username" aria-describedby="basic-addon1" value={this.state.assistBorrName} readOnly />
                                    </div>
                                </div>
                            </div>

                            <div className="col-6" style={{ marginTop: '-10px', marginLeft: "-50px" }}>
                                <div id="dvPassport" style={{ display: "" }}>
                                    <p className="label" style={{ fontWeight: "500", marginBottom: "4px", fontSize: "14px" }}>{t('Account Aggregator ID')}</p>
                                    <div class="input-group mb-3" style={{ width: "88%", border: "1px solid rgb(0, 121, 190)", borderRadius: "5px", height: "38px" }}>
                                        <input id="rValue" type="email"
                                            onChange={this.aaid} class="form-control" placeholder={t('Enter Account aggregator ID')} aria-label="Username" aria-describedby="basic-addon1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* JLG Members */}
                        <div className='row' style={{ paddingLeft: "45px", paddingRight: "50px" }}>
                            <div className='col-6' style={{ paddingRight: "27px" }}>
                                <p className="label" style={{ marginBottom: "8px", color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}>
                                    {t('Do you want to apply for a loan through JLG?')}
                                    &nbsp;
                                    <input type="checkbox" name="terms" id="grpCheckbox" style={{ position: "absolute", top: "5px" }} onChange={this.checkGrpCheckBox} />
                                </p>
                                <select id="jlgDrpdown" className="form-select"
                                    onChange={this.groupSelection} style={{ display: "none", width: "97.5%", border: "1px solid rgb(0, 121, 190)", }}
                                >
                                    <option defaultValue>Select</option>
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
                                </div>
                            </div>

                        </div>
                        {/* office hierarchy */}
                        <div className="form-row" id='isDisbSupplierReq' style={{ paddingLeft: "45px", paddingRight: "50px", display: "none" }}>
                            <div className="form-group col-md-6" id="list3">
                                <p htmlFor="Name" style={{ marginBottom: "8px", color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}>{t('Select Supplier *')}</p>
                                <div class="input-group mb-3" style={{ width: "93%", border: "1px solid rgb(0, 121, 190)", borderRadius: "5px", marginTop: "-5px" }}>
                                    {this.state.commonSupplierName ?
                                        <input id="rValue" type="text"
                                            class="form-control" aria-label="Username" aria-describedby="basic-addon1" value={this.state.commonSupplierName} readOnly />
                                        :
                                        <select id="inputState" className="form-select"
                                            onChange={this.selectedSupplier}
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
                            </div>
                            <div className="form-group col-md-6">
                                <p style={{ marginTop: "25px", fontSize: "14px", marginLeft: "17px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{t(`Note: Loan amount will be disbursed directly to the supplier account.`)}</p>
                            </div>
                        </div>
                        <div className="form-row" style={{ paddingLeft: "45px", paddingRight: "50px", marginTop: "-13px" }}>
                            <div className="form-group col-md-6" id="list1">
                                <p htmlFor="Name" style={{ marginBottom: "8px", color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "14px" }}>{t('Select District')}</p>
                                <div class="input-group mb-3" style={{ width: "93%", border: "1px solid rgb(0, 121, 190)", borderRadius: "5px", marginTop: "-5px" }}>
                                    <select id="inputState" className="form-select"
                                        onClick={this.officeDistList} onChange={this.officeDistList1}
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
                            </div>
                            <div className="form-group col-md-6" id="list2" style={{ display: "none" }}>
                                <p htmlFor="Name" style={{ marginBottom: "8px", color: "rgba(5,54,82,1)", fontWeight: "600", marginLeft: "12px" }}>{t('Select Office')}</p>
                                <div class="input-group mb-3" style={{ width: "95%", border: "1px solid rgb(0, 121, 190)", borderRadius: "5px", marginTop: "-5px", marginLeft: "11px" }}>
                                    <select id="inputState" className="form-select"
                                        onChange={this.officeDistList2}
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
                        </div>
                        <hr class="col-11" style={{ borderTop: "2px dotted rgb(0, 121, 190)", marginLeft: "30px" }} />
                        <div className=" mr-5" style={{ justifyContent: 'end', display: 'flex' }}>
                            <button type="submit" id='submitBtn' onClick={this.raiseLoanModal} className="btn text-white  br-5 ml-2" style={{ backgroundColor: "rgb(136, 189, 72)" }}><FaThumbsUp />&nbsp;Submit</button>&nbsp;
                            <button type="submit" className="btn text-white mr-2" onClick={this.cancelRequest} style={{ backgroundColor: "#0079BF" }}><BsArrowRepeat />&nbsp;Cancel</button>
                        </div>
                    </div>

                    {/* Upload Bank Statement */}
                    <button type="button" id="bankStmtModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3" style={{ display: "none" }}>
                        Launch modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content" style={{ fontFamily: "Poppins,sans-serif", fontSize: "14px" }}>
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLongTitle" style={{ color: "#00264d" }}>Please upload the bank statement of the last three/six months.</h5>
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
                                    </p>
                                    <p id="files-area">
                                        <span id="filesList">
                                            <span id="files-names"></span>
                                        </span>
                                    </p>

                                </div>
                                <div class="modal-footer">
                                    {/* <button type="button" class="btn btn-sm text-white" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} aria-hidden="true">Submit</button> */}
                                    <button type="button" class="btn btn-sm text-white" data-dismiss="modal"
                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} aria-hidden="true"
                                        disabled={!this.state.selectedFile} onClick={this.documentsuploaded}>Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Collateral UI */}
                    <button type="button" id="collateralModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2" style={{ display: "none" }}>
                        Launch demo modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
                                            <div className="row mb-3" key={index}>
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
                                        {this.state.formFieldLists && this.state.formFieldLists !== "" ? (
                                            <p className="label" style={{ marginBottom: "8px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>
                                                Additional Fields
                                            </p>
                                        ) : null}
                                        {this.state.formFieldLists && this.state.formFieldLists !== "" ? (
                                            <>
                                                {this.state.formFieldLists.map((element, index) => this.renderFormElement(element, index))}
                                            </>
                                        ) : null}
                                    </div>
                                    <div class="modal-footer">
                                        <div className='row'>
                                            <div className='col' style={{ textAlign: "end" }}>
                                                <button className='btn btn-sm text-white' id='finalSubmitBtn' style={{ backgroundColor: "rgb(136, 189, 72)", paddingLeft: "10px", paddingRight: "10px" }} onClick={this.saveInvoiceandForm}>Submit</button>
                                                &nbsp;
                                                <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onClick={this.cancelInvoice}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="row" style={{ color: "#222C70" }}>
                        <div className="col" style={{ marginLeft: '45px', marginTop: '-10px' }}>
                            <div className="">
                                <p className="label" style={{ fontWeight: "500" }}>{t('CIBIL Score(Optional)')}</p>
                                <div class="input-group mb-3" style={{ width: "93%", border: "1px solid rgb(0, 121, 190)", borderRadius: "5px", height: "38px" }}>
                                    <input id="rValue" type="text"
                                        class="form-control" onChange={this.cibilscore} placeholder={t('CIBIL Score')} aria-label="Username" aria-describedby="basic-addon1" />
                                </div>
                            </div>
                        </div>
                        <div className='col'>

                        </div>
                        <div className="col" style={{ marginTop: '-10px' }}>
                            <div className="">
                                <p className="label">{t('Document Support')}</p>
                                <div class="input-group mb-3">
                                    <input type="file" id="fileDatas" accept='.pdf' className="border text-dark ml-2 pr-5" />
                                    <div className="card col-8" id="text" style={{ cursor: "default", display: "none" }}></div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <button id='loanRequestModal' style={{ display: "none" }} type="button" class="btn btn-info" data-toggle="modal" data-target=".bd-example-modal-lg">
                        Borrower Details
                    </button>
                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p className="font-weight-bold" style={{ color: "rgba(5,54,82,1)" }}><FaRegFileAlt style={{ fontSize: "15px" }} />Loan Request Details</p>
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
                                                    <p className="mb-0">{this.state.assistBorrID}</p>
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
                                            {/* <div className='row'>
                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                    <p className="mb-0 font-weight-bold">Number of Repayments</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col'>
                                                    <p className="mb-0">{this.state.noofrepayments}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                    <p className="mb-0 font-weight-bold">Repayment Frequency</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col'>
                                                    <p className="mb-0">{this.state.repaymentfrequency}{this.state.reptext}</p>
                                                </div>
                                            </div> */}
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
                                                    <p className="mb-0 font-weight-bold" style={{ width: "150px" }}>Documents Uploaded</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col'>
                                                    <p className="mb-0">{this.state.documentsuploaded == "1" ? "Yes" : <span>{this.state.documentsuploaded == "0" ? "No" : null}</span>}</p>
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
                                        onClick={() => this.assistLoanReq(1)} style={{ backgroundColor: "rgb(136, 189, 72)", paddingLeft: "15px", paddingRight: "15px" }}>Yes</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
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

            </div>
        )
    }
}

export default withTranslation()(AssistLoanRequest)
