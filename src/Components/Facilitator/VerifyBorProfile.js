import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import FacilitatorSidebar from '../../SidebarFiles/FacilitatorSidebar';
import { FaAngleLeft, FaThumbsUp, FaRegFileAlt, FaRegEye, FaPlus, FaCheckCircle } from "react-icons/fa";
import { BsArrowRepeat } from "react-icons/bs";
import { withTranslation } from 'react-i18next';
import dashboardIcon from '../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import borProfile from '../assets/borProfile.png';
import batch from '../assets/batch.png';
import { confirmAlert } from "react-confirm-alert";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
var dataList = [];
var listOptions = [];

var formDatas;
var dataList2 = [];
var jsonForm;

var extractedData;
var formID;
class VerifyBorProfile extends Component {
    //updated
    constructor(props) {
        super(props)
        this.state = {
            borProfDetails: [],
            verifyAttribute: [],
            attributetypeid: "",
            attributevalue: "",
            loanreqno: "",
            remark: [],
            attributes: [],
            isChecked: false,

            paddress1: "",
            paddress2: "",
            landmark: "",
            pdistrict: '',
            pcity: '',
            pstate1: '',
            ppincode: '',

            address1: '',
            address2: '',
            address3: '',
            district: '',
            city: '',
            state: '',
            pincode: '',
            taluk: '',

            //dynamic form
            formDetailList: [],
            formDetailList: [],
            formFieldLists: [],
            formCategory: "",
            formType: "",

            errorMessages: {},
            isTextDisabled: true,
            validationError: "",
            validationErrorAmt: "",
            selectedFile: null,

            allAttributesChecked: [],
            verifeedflag: false,
            //references
            referenceLists: [

            ]
        }
        this.getBorProfileInfo = this.getBorProfileInfo.bind(this);
        this.verifyBorProfile = this.verifyBorProfile.bind(this);
        this.checkOptions = this.checkOptions.bind(this);
        this.remark = this.remark.bind(this);
    }
    componentDidMount() {
        this.getBorProfileInfo();
        this.getAddressDetails();
        this.getReferenceDetails()
        $("#digisubmit4").prop('disabled', true)
        $('#submitForm').prop('disabled', true)
        $('#viewBorDetails').click(function () {
            $('#Modal').click();
        })
        $("#selectall").click(function () {
            if (this.checked) {
                $('.checkall').each(function () {
                    $(".checkall").prop('checked', true);
                })
            } else {
                $('.checkall').each(function () {
                    $(".checkall").prop('checked', false);
                })
            }
        });
        // $("#selectall").click(function () {
        //     if (this.checked) {
        //         $('.checkall').each(function () {
        //             $(".checkall").prop('checked', true);
        //         })
        //         var listCheck=document.getElementsByClassName("checkall");
        //         listCheck.forEach(element=>{
        //             console.log(element)
        //         })
        //     } else {
        //         $('.checkall').each(function () {
        //             $(".checkall").prop('checked', false);
        //         })
        //     }
        // });
        // $("#selectall").click(function () {
        //     if (this.checked) {
        //         var element = document.getElementsByClassName("checkall");
        //         console.log(element)
        //         for (var i = 0; i < element.length; i++) {
        //             if (element[i].type == "checkbox")
        //                 element[i].checked = true;
        //             var list = element[i].checked = true;
        //             console.log(list)
        //             listOptions = list;
        //             console.log(listOptions);

        //             var options = this.state.borProfDetails;
        //             options[i].attributes[i].checked = listOptions;
        //             this.setState({ borProfDetails: options });
        //         }
        //     } else {
        //         $('.checkall').each(function () {
        //             $(".checkall").prop('checked', false);
        //         })
        //     }
        // });

        this.getFormDetails()
        $("#submitFormBtn").prop('disabled', true);
    }
    selectAll = (e) => {
        var arraElement = document.getElementsByName("checkall");

        console.log(arraElement)
        var options = this.state.borProfDetails;
        var option;
        arraElement.forEach(element => {
            console.log(element)
            option = element.checked;
            console.log(option)
        });
        options.map((attriValues) => {
            attriValues.checked = option;
            console.log(options)
        })

        console.log(options)
        const allChecked = options.every(option => option.checked);

        // Update allAttributesChecked state
        this.setState({ allAttributesChecked: allChecked });

        // Enable or disable the button based on allChecked
        if (allChecked) {
            $("#digisubmit4").prop('disabled', false);
        } else {
            $("#digisubmit4").prop('disabled', true);
        }
        // var element = document.getElementsByClassName("checkall");

        // for (var i = 0; i < element.length; i++) {
        //     if (element[i].type == "checkbox")
        //         element[i].checked = e.checked;
        //     console.log(element)
        //     var list = [];
        //     console.log(typeof list)
        //     list = element[i].checked = true;
        //     console.log(list)
        //     // listOptions = list;
        //     // console.log(listOptions);

        //     var options = this.state.borProfDetails;
        //     options[i].attributes[i].checked = list;
        //     this.setState({ borProfDetails: options });
        //     console.log(this.state.borProfDetails)
        //     console.log(options)
        // }

    }
    // Borrower Address Details
    getAddressDetails = (event) => {
        fetch(BASEURL + '/usrmgmt/getaddressdetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                memmid: parseInt(sessionStorage.getItem('Memmid'))
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
                                this.setState({ paddress1: element.address1 })
                                this.setState({ paddress2: element.address2 })
                                this.setState({ landmark: element.address3 })
                                this.setState({ pdistrict: element.district })
                                this.setState({ pcity: element.city })
                                this.setState({ pstate1: element.state })
                                this.setState({ ppincode: element.pincode })
                                this.setState({ ptaluk: element.taluk })
                                // setting "" in case of permanent address is not present
                                this.setState({ address1: "" })
                                this.setState({ address2: "" })
                                this.setState({ address3: "" })
                                this.setState({ district: "" })
                                this.setState({ city: "" })
                                this.setState({ state: "" })
                                this.setState({ pincode: "" })
                            } else if (element.addresstype == 2) {
                                // setting "" in case of present address is not present

                                this.setState({ paddress1: "" })
                                this.setState({ paddress2: "" })
                                this.setState({ landmark: "" })
                                this.setState({ pdistrict: "" })
                                this.setState({ pcity: "" })
                                this.setState({ pstate1: "" })
                                this.setState({ ppincode: "" })

                                // this.setState({ addressDetails1: resdata.msgdata[1] })
                                this.setState({ address1: element.address1 })
                                this.setState({ address2: element.address2 })
                                this.setState({ address3: element.address3 })
                                this.setState({ district: element.district })
                                this.setState({ city: element.city })
                                this.setState({ state: element.state })
                                this.setState({ pincode: element.pincode })
                                this.setState({ taluk: element.taluk })
                            }
                        } else {
                            if (element.addresstype == 1) {
                                // this.setState({ addressDetails: resdata.msgdata[0] })
                                this.setState({ paddress1: element.address1 })
                                this.setState({ paddress2: element.address2 })
                                this.setState({ landmark: element.address3 })
                                this.setState({ pdistrict: element.district })
                                this.setState({ pcity: element.city })
                                this.setState({ pstate1: element.state })
                                this.setState({ ppincode: element.pincode })
                                this.setState({ ptaluk: element.taluk })

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
                                this.setState({ address1: element.address1 })
                                this.setState({ address2: element.address2 })
                                this.setState({ address3: element.address3 })
                                this.setState({ district: element.district })
                                this.setState({ city: element.city })
                                this.setState({ state: element.state })
                                this.setState({ pincode: element.pincode })
                                this.setState({ taluk: element.taluk })
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
            }).catch((error) => {
                console.log(error)
            })
    }
    getBorProfileInfo() {
        fetch(BASEURL + '/lsp/getborrowerprofileattributes?loanrequestnumber=' + sessionStorage.getItem("loanReqno"), {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    const borProf = resdata.msgdata.attributes.map((attributeValues) => {
                        if (attributeValues.verified == "1") {
                            attributeValues.checked = true;
                        }
                        else {
                            attributeValues.checked = false;
                        }
                        return attributeValues;
                    })
                    console.log(borProf)
                    this.setState({ borProfDetails: borProf });
                    this.setState({ loanreqno: resdata.msgdata.loanreqno });
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
    verifyBorProfile() {
        const options = this.state.borProfDetails;
        const loanreqno = sessionStorage.getItem('loanReqno');
        const remark = this.state.remark;
        const remarkList = [];
        console.log(dataList);
        remarkList.push()
        const attributes = options.map((attribute, index) => {
            var remarks;
            if (typeof dataList[index] === 'undefined') {
                remarks = ""; // does not exist
            }
            else {
                remarks = dataList[index];  // does exist
            }
            return {
                attributetypeid: attribute.attributetypeid,
                attributevalue: attribute.checked ? "1" : "0",	//0-not verified,1-verified
                loanreqno: loanreqno,
                remark: remarks 	//255 length
            }
        });
        console.log(attributes)
        fetch(BASEURL + '/lsp/verifyborprofile', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify(attributes)
        }).then((Response) => {
            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    //alert(resdata.message);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    // this.setFormTxndata();
                                    window.location = "/facilitatorDashboard"
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });

                }
                else {
                    alert("Issue: " + resdata.message);
                }
            }).catch((error) => {
                console.log(error)
            })
    }
    toggleChecked = () => {
        const { isChecked } = this.state;
        this.setState({ isChecked: !isChecked });
    };
    remark(event, index, subIndex) {
        console.log(event.target.value);
        console.log(index)
        console.log(subIndex);
        dataList[index] = event.target.value;
        console.log(dataList)
    }
    checkOptions(event, index, subIndex, attribute) {
        console.log(event.target.checked);
        console.log(event.target.value);

        const options = this.state.borProfDetails;
        options[index].checked = event.target.checked;
        this.setState({ borProfDetails: options });
        // const p_value = this.state.verifyAttribute;
        // if (event.target.checked == true) {
        //     p_value.push(event.target.value);
        // } else {
        //     const index = p_value.indexOf(event.target.value);
        //     p_value.splice(index, 1);
        // }
        // console.log(p_value);
        // this.setState({ verifyAttribute: p_value })

        console.log(options)
        // Check if all items are checked
        const allChecked = options.every(option => option.checked);

        // Update allAttributesChecked state
        this.setState({ allAttributesChecked: allChecked });

        // Enable or disable the button based on allChecked
        if (allChecked) {
            $("#digisubmit4").prop('disabled', false);
        } else {
            $("#digisubmit4").prop('disabled', true);
        }
    }
    cancelVprofile = () => {
        window.location = "/facilitatorDashboard"
    }
    //Form Details
    getFormDetails = () => {
        fetch(BASEURL + '/lsp/getformdetails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                category: "FAC",
                type: "FAC_VERF_FORM"
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
                        console.log(this.state.formFieldLists)
                    })
                } else {

                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
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
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field) }}
                        />
                        <p style={{ color: "rgba(5,54,82,1)" }}>Minimum length is {element.minlength}</p>
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
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field) }}
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
        console.log('executed 2')
        const { name, value } = e.target;
        const Regex = regex;

        console.log(value)
        let errorMessage = "";
        if (Regex) {
            const pattern = new RegExp(Regex);
            if (!pattern.test(value)) {
                console.log(`Invalid input for ${field}.`);
                errorMessage = `Invalid input for ${field}.`;
            } else {
                dataList2[index] = e.target.value;
                console.log(dataList2);

                const valueList = [];
                console.log(dataList2);
                valueList.push()
                extractedData = this.state.formFieldLists.map((item, index) => {
                    var Values;
                    if (typeof dataList2[index] == "undefined") {
                        Values = "";
                        console.log("executed1");
                    } else {
                        Values = dataList2[index];
                        console.log("executed2");
                    }

                    return {
                        field: item.field,
                        value: Values
                    };
                });
                console.log(extractedData)
            }
        } else {
            dataList2[index] = e.target.value;
            console.log(dataList2);

            const valueList = [];
            console.log(dataList2);
            valueList.push()
            extractedData = this.state.formFieldLists.map((item, index) => {
                var Values;
                if (typeof dataList2[index] == "undefined") {
                    Values = "";
                    console.log("executed1");
                } else {
                    Values = dataList2[index];
                    console.log("executed2");
                }

                return {
                    field: item.field,
                    value: Values
                };
            });
            console.log(extractedData)
        }
        const errorMessages = { ...this.state.errorMessages, [label]: errorMessage };

        this.state.formFieldLists[index].value = value;

        this.setState({
            formFieldLists: [...this.state.formFieldLists],
            errorMessages,
        });
        // Assuming formFieldLists is an array of form fields
        const allFieldsFilled = this.state.formFieldLists.every(field => {
            if (field.value !== undefined && field.value.trim() !== "") {
                return true; // Field is filled
            } else {
                return false; // Field is not filled
            }
        });

        // Set the disabled state based on the condition
        if (allFieldsFilled) {
            $("#submitFormBtn").prop('disabled', false); // Enable the button
        } else {
            $("#submitFormBtn").prop('disabled', true); // Disable the button
        }
    }
    additionalInputs = () => {
        $("#additionalModal").click();
    }
    setFormTxndata = () => {
        console.log(formID)
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
                majorid: sessionStorage.getItem('loanReqno'),
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
                                    this.verifyBorProfile()
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
            })
    }
    enableButton = () => {
        $('#submitForm').prop('disabled', false)
        this.setState({ verifeedflag: true })
    }
    getReferenceDetails = () => {
        fetch(BASEURL + '/lsp/getreferencesforloanrequest?loanrequestnumber=' + sessionStorage.getItem("loanReqno"), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    this.setState({ referenceLists: resdata.msgdata.referenceinfo }, () => {
                    })
                }
                else {

                }
            })
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const { t } = this.props
        const myStyle = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "9px 2px 4px 14px",
            cursor: "pointer",
            fontSize: "12px",
            // height: "25px",
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            marginLeft: "14px"
        }
        return (
            < div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#f4f7fc" }
            }>
                <FacilitatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1">
                            <button style={{ marginLeft: "30px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        &nbsp;
                        <div className='col-6'>
                            <p className='mt-2'><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/facilitatorDashboard">Home</Link> / <Link to="/borrowerProfileVerification">Verification</Link> / Verify Borrower Profile Info</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/borrowerProfileVerification"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "1px", color: "rgb(5, 54, 82)" }} />

                    <button id='Modal' style={{ marginLeft: "67%", display: "none" }} type="button" class="btn btn-info" data-toggle="modal" data-target=".bd-example-modal-lg">
                        Borrower Address Details
                    </button>
                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className='row' style={{ fontFamily: "Poppins,sans-serif" }}>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", fontSize: "15px" }}><img src={batch} width="25px" />Borrower Address Details</p>
                                            <hr style={{ width: "200px" }} />

                                            <p className="font-weight-bold" style={{ color: "rgba(5,54,82,1)", fontSize: "14px", marginTop: "-10px" }}>Permanent Address</p>
                                            <div className='card' style={{ marginTop: "-10px" }}>
                                                <div className='' style={{ border: "1px solid rgb(0, 121, 191)", borderRadius: "5px", cursor: "default" }}>
                                                    <div className='row p-2'>
                                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Address Line 1</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.paddress1}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Address Line 2</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.paddress2}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Landmark</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.landmark}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">City</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.pcity}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">State</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.pstate1}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">District</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.pdistrict}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">PIN Code</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.ppincode}</p>
                                                                </div>
                                                            </div>
                                                            {/* <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Taluk</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.ptaluk}</p>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="font-weight-bold" style={{ color: "rgba(5,54,82,1)", fontSize: "14px", marginTop: "-10px" }}>References</p>
                                            {/* Updated */}
                                            <div className='card border-0' style={{ cursor: "default", marginTop: "-10px" }}>
                                                <div style={{ border: "1px solid rgb(0, 121, 191)", borderRadius: "5px" }}>
                                                    {this.state.referenceLists == "" ?
                                                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                            <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                                <p>No references available.</p>
                                                            </div>
                                                        </div> :
                                                        <>
                                                            <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                                <Table responsive>
                                                                    <Thead>
                                                                        <Tr style={{ fontSize: "14px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                            <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Reference Name')}</Th>
                                                                            <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Reference Mobile No.')}</Th>
                                                                            <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Email ID')}</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {this.state.referenceLists.map((lists, index) => (
                                                                            <Tr key={index} style={{
                                                                                marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                            }}>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.refname}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.refmobile}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.refemail ? lists.refemail : "-"}</Td>
                                                                            </Tr>
                                                                        ))}
                                                                    </Tbody>
                                                                </Table>
                                                            </div>
                                                        </>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white" data-dismiss="modal" style={{ backgroundColor: "rgb(0, 121, 191)" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* New Design */}
                    <div className='row'>
                        <div className='col' style={{ fontSize: "14px" }}>
                            <div className='card border-0 mb-2' style={{ cursor: "default", color: "rgb(5, 54, 82)", marginBottom: "-10px", transition: 'none', width: "91.5%", marginLeft: "49px" }}>
                                <div className="row item-list align-items-center pl-2 pr-2 pt-2" >
                                    <div className='col-1'>
                                        <img src={borProfile} width="40px" style={{ marginLeft: "0px" }} />
                                    </div>
                                    <div className='col'>
                                        <div className='row'>
                                            <div className='col' style={{ paddingTop: "7px" }}>
                                                <p className="font-weight-bold">Borrower Name</p>
                                            </div>
                                            <div className='col' style={{ paddingTop: "7px" }}>
                                                <p className=""><span className='font-weight-bold'>:</span>&nbsp;&nbsp;{sessionStorage.getItem('borName')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='row'>
                                            <div className='col' style={{ paddingTop: "7px" }}>
                                                <p className="font-weight-bold">Loan Request Number</p>
                                            </div>
                                            <div className='col-5' style={{ paddingTop: "7px" }}>
                                                <p className=""><span className='font-weight-bold'>:</span>&nbsp;&nbsp;{sessionStorage.getItem('loanReqno')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-2'>
                                        <button className='btn btn-sm text-white' id='viewBorDetails' style={{ backgroundColor: "rgb(0, 121, 191)", marginLeft: "-30px" }}><FaRegEye />&nbsp;View Address Details</button>
                                    </div>
                                </div>
                                <div className='row' style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                                    <div className='col'>
                                        <hr style={{ color: "rgb(0, 121, 191)" }} />
                                    </div>
                                </div>
                                <div className='row' style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                                    <div className='col-2'>
                                        <div className='form-check' style={{ marginLeft: "-20px", fontWeight: "600" }}>
                                            <input type="checkbox" id="selectall" name='checkAll' className="css-checkbox "
                                                onChange={this.selectAll}
                                            />&nbsp;<span>Verify All</span>
                                        </div>
                                    </div>
                                    <div className='col-10'>
                                        <p style={{ marginLeft: "-71px", fontWeight: "600" }}>Verifying List</p>
                                    </div>
                                </div>
                                <div className=''>
                                    {
                                        this.state.borProfDetails.map((attribute, index) => {
                                            return (
                                                <div key={index} className="row mb-3" style={{ fontSize: "14px", paddingLeft: "10px", paddingRight: "10px", marginTop: "-10px" }}>
                                                    <div className="col-1">
                                                        <div className="card item-list" style={{ cursor: "default", width: "80px", height: "80px", marginBottom: '1px', marginTop: '1px' }}>
                                                            <div className="row item-list">
                                                                <div className='col' style={{ textAlign: "center", paddingTop: "23px", paddingLeft: "43px" }}>
                                                                    <div className='form-check'>
                                                                        <input className="form-check-input checkall" name='checkall' type="checkbox" checked={attribute.checked} onChange={(e) => { this.checkOptions(e, index, attribute) }}
                                                                            style={{ fontSize: "14px", border: "3px solid rgb(0, 121, 191)" }} />
                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className='col-11'>
                                                        <div className="card item-list" style={{ cursor: "default", marginBottom: '1px', marginTop: '1px', padding: "10px 10px 0px 10px", color: "rgb(5, 54, 82)" }}>
                                                            <div className='row mb-2'>
                                                                <div className='col-sm-3 col-md-3 col-lg-3'>
                                                                    <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0" style={{ marginLeft: "-30px" }}>{attribute.attributevalue}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div class="col form-group">
                                                                    <div className='row'>
                                                                        <div className='col-1'>
                                                                            <p className="mb-0 font-weight-bold" style={{ width: "100px" }}>Remarks</p>
                                                                        </div>
                                                                        <div className='col-11'>
                                                                            <textarea class="form-control" onChange={(e) => { this.remark(e, index, attribute) }} placeholder="Enter Remarks, if any" rows={1} cols={30}></textarea>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                {/* Collect Form */}
                                <div className='row' style={{ fontSize: "14px" }}>
                                    <div className='col' style={{ marginLeft: "5px", textAlign: "center" }}>
                                        <p style={{ color: "rgb(5, 54, 82)", fontSize: "16px" }}>Note: Please provide your assessment feedback by clicking "Verifier Feedback".</p>
                                        <button type="button" className="btn" id="digisubmit4"
                                            style={{
                                                backgroundColor: "rgba(0,121,190,1)", color: "white", borderRadius: "10px",
                                                opacity: this.state.buttonDisabled ? 0.5 : 1,
                                                cursor: this.state.buttonDisabled ? 'not-allowed' : 'pointer'
                                            }}
                                            onClick={this.additionalInputs}>
                                            {this.state.verifeedflag === true ?
                                                <FaCheckCircle style={{ marginTop: "-4px", color: "white" }} />
                                                : <FaPlus style={{ marginTop: "-4px" }} />
                                            }&nbsp;Verifier Feedback</button>
                                        {/* &nbsp; {!this.state.allFieldsFilled === true && <FaCheckCircle style={{ color: "green" }} />} */}
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="row justify-content-md-end mb-2" style={{ paddingRight: "10px", marginTop: "-10px" }}>
                                    <div className="col-md-auto mt-3">
                                        <button onClick={this.setFormTxndata} id='submitForm' className="btn text-white" style={{ backgroundColor: "rgb(136, 189, 72)" }}><FaThumbsUp />&nbsp;Submit</button>&nbsp;
                                        <button onClick={this.cancelVprofile} className="btn text-white" style={{ backgroundColor: "#0079BF" }}><BsArrowRepeat />&nbsp;Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Additional UI */}
                    <button id='additionalModal' style={{ display: "none", marginLeft: "67%" }} type="button" class="btn btn-info" data-toggle="modal" data-target=".bd-example-modal-lg2">
                        Additional modal
                    </button>
                    <div class="modal fade bd-example-modal-lg2" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div class="modal-body">
                                    {/*Additional Fields*/}
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Verifier Feedback</p>
                                            <hr style={{ width: "200px" }} />
                                        </div>
                                    </div>
                                    <div className="row" style={{ marginTop: "-20px", fontSize: "14px" }}>
                                        {this.state.formFieldLists != "" ?
                                            <>
                                                {this.state.formFieldLists.map((element, index) => this.renderFormElement(element, index)
                                                )}
                                            </>

                                            : ""}
                                    </div>
                                </div>
                                <div class="modal-footer" style={{ marginTop: "-50px" }}>
                                    <div className='row'>
                                        <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                            <button className='btn btn-sm text-white' data-dismiss="modal" id='submitFormBtn'
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.enableButton}>Save</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} >Cancel</button>
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

export default withTranslation()(VerifyBorProfile);
