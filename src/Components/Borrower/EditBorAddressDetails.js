import React, { Component } from 'react';
import BorrowerSidebar from '../../SidebarFiles/BorrowerSidebar';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit, FaRegAddressBook, FaRegSave } from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert';
import { talukFlagED } from '../assets/Constant'
import batch from '../assets/batch.png';

//updated
var globalStateList;

var dataList = [];
var extractedData;
var formDatas;
var formID;
var documentAdded = false;
export class EditBorAddressDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            codeid: 8,
            addresstypedesc: "Permanent address",
            status: 0,
            addrtype: '1',
            address1: '',
            address2: '',
            address3: '',
            district: '',
            distid: "",
            city: '',
            state1: '',
            statecode: '',
            pincode: '',
            taluk: '',

            stateList: [],
            districtList: [],

            addressList: "",
            intialState: "",
            intialDistrict: "",
            addressDetails: [],

            talukList: [],
            initialTaluk: "",

            invalidAddress1: false,
            invalidAddress2: false,

            //Taluk Flag
            talukFlag: talukFlagED,

            //POA
            selectDocu: '',
            addOvddocu: '',
            ovdCode: '',
            ovdID: '',
            ovdPagetype: '',
            ovdPagetype: '',
            ovdMasterList: [],
            uploadedOVDLists: [],
            ovdCategoryFlag: false,
            formFieldLists: [],
            formCategory: "",
            formType: "",
            errorMessages: {},
            resMsg: "",

        }

        this.addrtype = this.addrtype.bind(this);
        this.address1 = this.address1.bind(this);
        this.address2 = this.address2.bind(this);
        this.address3 = this.address3.bind(this);
        this.district = this.district.bind(this);
        this.city = this.city.bind(this);
        this.state1 = this.state1.bind(this);
        // this.intialState = this.intialState.bind(this);

        this.statecode = this.statecode.bind(this);
        this.pincode = this.pincode.bind(this);
        this.getStateList = this.getStateList.bind(this);
    }

    addrtype(event) {
        console.log(event.target.value)
        this.setState({ addrtype: event.target.value })
        var addressDetails = this.state.addressDetails;

        addressDetails.forEach(ele => {
            console.log(ele.addresstype)
            console.log(ele);
            console.log(this.state.address1,
                this.state.address2,
                this.state.address3,
                this.state.city,
                this.state.state1,
                this.state.intialState,
                this.state.pincode,
                this.state.district,
                this.state.intialDistrict,
                this.state.taluk,
                this.state.initialTaluk)
            if (event.target.value == ele.addresstype) {
                console.log("called" + ele.address3)
                this.setState({ address1: ele.address1 })
                this.setState({ address2: ele.address2 })
                this.setState({ address3: ele.address3 })
                this.setState({ city: ele.city })
                this.setState({ state1: ele.state })
                this.setState({ intialState: ele.state })
                this.setState({ pincode: ele.pincode })
                this.setState({ district: ele.district })
                this.setState({ taluk: ele.taluk })
                this.setState({ initialTaluk: ele.taluk })
                this.setState({ intialDistrict: ele.district });

                this.getStateList(ele.state)
                this.getDistrictList(ele.district)
            }
            console.log(this.state.address1,
                this.state.address2,
                this.state.address3,
                this.state.city,
                this.state.state1,
                this.state.intialState,
                this.state.pincode,
                this.state.district,
                this.state.intialDistrict,
                this.state.taluk,
                this.state.initialTaluk)


            // else if(event.target.value==addressDetails.addresstype){
            //     this.setState({ address1: ele.address1 })
            //     this.setState({ address2: ele.address2 })
            //     this.setState({ address3: ele.address3 })
            //     this.setState({ city: ele.city })
            //     this.setState({ state1: ele.state })
            //     this.setState({ intialState: ele.state })
            //     this.setState({ pincode: ele.pincode })
            //     this.setState({ district: ele.district })
            //     this.setState({ intialDistrict: ele.district });

            // }
        })
        console.log(addressDetails)
    }
    address1(event) {
        this.setState({ address1: event.target.value })
        var branchInput = /^[A-Za-z0-9#/ ]*$/;
        var eventInput = event.target.value;
        if (branchInput.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidAddress1: false })
            this.setState({ address1: event.target.value })
        } else {
            this.setState({ invalidAddress1: true })
        }
    }
    address2(event) {
        this.setState({ address2: event.target.value })
        var branchInput = /^[A-Za-z0-9#/ ]*$/;
        var eventInput = event.target.value;
        if (branchInput.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidAddress2: false })
            this.setState({ address2: event.target.value })
        } else {
            this.setState({ invalidAddress2: true })
        }
    }
    address3(event) {
        this.setState({ address3: event.target.value })
    }
    district(event) {
        this.setState({ district: event.target.value, intialDistrict: "Select Districts" })
        ////console.log(event.target.value);
        if (event.target.value === "Select District") {
            this.setState({ district: "No Districts" });
            var defaultList = [];
            defaultList.push("No Districts");
            this.setState({ districtList: defaultList, district: "No Districts", });
        } else {
            // this.setState({ district: "" });
            if (this.state.talukFlag !== "p2p") {
                this.state.districtList
                    .filter((e) => e.distid == event.target.value)
                    .map(() => {
                        this.getTalukList(event.target.value);
                    })
            }
        }
    }
    city(event) {
        this.setState({ city: event.target.value })
    }
    state1(event) {
        this.setState({ state1: event.target.value, intialState: "Select State" })
        ////console.log(event.target.value);
        if (event.target.value === "Select State") {
            this.getDistrictList("");
            var defaultList = [];
            defaultList.push("No Districts");
            this.setState({ districtList: [], intialDistrict: "0", district: "" });
        } else {
            this.setState({ district: "" });
            this.state.stateList
                .filter((e) => e.statecode == event.target.value)
                .map(() => {
                    this.getDistrictList(event.target.value);
                })
        }

    }
    statecode(event) {
        this.setState({ statecode: event.target.value })
    }
    pincode(event) {
        this.setState({ pincode: event.target.value })
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.getStateList()
            this.getAddressDetails()
            ////console.log(this.state.stateList);
            ////console.log(this.state.districtList)
        } else {
            window.location = '/login'
        }
    }
    getAddressDetails(event) {
        // alert("called");
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
                    console.log(resdata.msgdata)
                    resdata.msgdata.forEach(ele => {
                        if (1 == ele.addresstype) {
                            console.log("called" + ele.address3)
                            this.setState({ address1: ele.address1 })
                            this.setState({ address2: ele.address2 })
                            this.setState({ address3: ele.address3 })
                            this.setState({ city: ele.city })
                            this.setState({ state1: ele.state })
                            this.setState({ intialState: ele.state })
                            this.setState({ pincode: ele.pincode })
                            this.setState({ district: ele.district })
                            this.setState({ initialTaluk: ele.taluk })
                            this.setState({ taluk: ele.taluk })
                            this.setState({ intialDistrict: ele.district });
                            this.getStateList(resdata.msgdata[0].state);
                            this.getDistrictList(resdata.msgdata[0].statecode);
                            var responseAddress = resdata.msgdata;
                            this.setState({ addressDetails: responseAddress })
                        }
                    })
                }
                // else {
                //     alert("Issue: " + resdata.message);
                // }
            })
    }
    getStateList = (data) => {
        fetch(BASEURL + '/usrmgmt/getstatelist', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({ stateList: resdata.msgdata })
                    globalStateList = resdata.msgdata;
                    console.log(globalStateList)
                    console.log(data)
                    var DefaultStateCode;
                    globalStateList.forEach(element => {
                        if (element.statename === data) {
                            DefaultStateCode = element.statecode;
                            console.log(element.statecode)
                        }
                    });
                    console.log(DefaultStateCode)
                    if (DefaultStateCode && DefaultStateCode.length === 2) {
                        console.log(DefaultStateCode)
                        this.getDistrictList(DefaultStateCode);
                    }
                    this.state.stateList.map((statelist) => {
                        return statelist.statename;
                    })
                }
            })
    }
    getDistrictList = (StateCode) => {
        fetch(BASEURL + '/usrmgmt/getdistrictlist?statecode=' + StateCode, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({ districtList: resdata.msgdata.distlist })
                }
            })
    }
    getTalukList = (districtCode) => {
        fetch(BASEURL + '/usrmgmt/gettaluklist?districtid=' + districtCode, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({ talukList: resdata.msgdata.taluklist })
                }
                else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
    }
    talukName = (event) => {
        // this.setState({ taluk: event.target.value });
        this.setState({ taluk: event.target.value, initialTaluk: "Select Taluk" })
        if (event.target.value === "Select Taluk") {
            this.setState({ taluk: "No Taluk" });
            var defaultList = [];
            defaultList.push("No Taluk");
            this.setState({ talukList: defaultList, taluk: "No Taluk", });
        }
    }
    setAddressDetails = (event) => {
        if (this.state.address1 == "" || this.state.address2 == "" || this.state.address3 == "" || this.state.district == "" || this.state.state1 == "" || this.state.pincode == "" || this.state.city == "") {
            confirmAlert({
                message: "Please Fill all the Fields",
                buttons: [{
                    label: "Okay",
                    onClick: () => {
                    }
                }],
                closeOnClickOutside: false,
            })
        } else {
            var data = {
                addrtype: parseInt(this.state.addrtype),
                address1: this.state.address1,
                address2: this.state.address2,
                address3: this.state.address3,
                // district: districtVal,
                // state: this.state.state1,
                // statecode: stateVal,
                pincode: parseInt(this.state.pincode),
                city: this.state.city
            }
            var stateVal;
            var districtVal;
            if (this.state.state1.length != 2) {
                //console.log(this.state.stateList, this.state.districtList)
                this.state.stateList.forEach(ele => {
                    if (ele.statename === this.state.state1) {
                        // stateVal = ele.statecode;
                        data.statecode = ele.statecode;
                        data.state = ele.statename;
                    }
                })
                this.state.districtList.forEach(ele1 => {

                    if (ele1.distname === this.state.district) {
                        // districtVal = ele1.distid;
                        data.district = ele1.distname;
                    }
                })
                if (this.state.talukFlag !== "p2p") {
                    if (this.state.talukList.length === 0) {
                        data.taluk = this.state.initialTaluk
                    } else {
                        this.state.talukList.forEach(ele2 => {
                            if (ele2.talukname == this.state.taluk) {
                                data.taluk = ele2.talukname;
                            }
                        })
                    }
                }
            } else {
                // stateVal=this.state.state1;
                // districtVal=this.state.district;
                this.state.stateList.forEach(ele => {
                    if (ele.statecode === this.state.state1) {
                        // stateVal = ele.statename;
                        data.state = ele.statename;
                        data.statecode = ele.statecode;
                    }
                })
                this.state.districtList.forEach(ele1 => {
                    if (ele1.distid === this.state.district) {
                        // districtVal = this.state.district;
                        data.district = ele1.distname;
                    }
                })
                if (this.state.talukFlag !== "p2p") {
                    this.state.talukList.forEach(ele2 => {
                        if (ele2.talukname == this.state.taluk) {
                            data.taluk = ele2.talukname;
                        }
                    })
                    if (this.state.talukList.length === 0) {
                        data.taluk = this.state.initialTaluk
                    } else {
                        this.state.talukList.forEach(ele2 => {
                            if (ele2.talukname == this.state.taluk) {
                                data.taluk = ele2.talukname;
                            }
                        })
                    }
                }
            }
            ////console.log(data)
            fetch(BASEURL + '/usrmgmt/setaddressdetails', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify(data)
                // addrtype: parseInt(this.state.addrtype),
                // address1: this.state.address1,
                // address2: this.state.address2,
                // address3: this.state.address3,
                // district: districtVal,
                // state: this.state.state1,
                // statecode: stateVal,
                // pincode: parseInt(this.state.pincode),
                // city: this.state.city

            }).then((Response) => Response.json())
                .then((resdata) => {
                    if (resdata.status === 'Success') {
                        //alert(resdata.message);
                        //console.log(resdata);

                        confirmAlert({
                            message: resdata.message,
                            buttons: [{
                                label: "Okay",
                                onClick: () => {
                                    this.setUserStatusflag();
                                }
                            }],
                            closeOnClickOutside: false,
                        })
                    } else {
                        //alert(resdata.message);
                        confirmAlert({
                            message: resdata.message,
                            buttons: [{
                                label: "Okay",
                                onClick: () => {

                                }
                            }],
                        })
                    }
                })
        }
    }
    setUserStatusflag = (event) => {
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
                    console.log(resdata.msgdata.isAddressVerified)
                    this.props.parentCallback(resdata.msgdata.isAddressVerified);
                    window.location.reload();
                }
                else {
                    alert(resdata.message);
                }
            })
    }
    canceladdressDetails = () => {
        window.location.reload();
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
                category: this.state.ovdCategoryFlag === true ? "POA" : "POI",
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
                    });

                    $("#uploadOvdDocID").hide();
                    $("#submitOvdID").show()
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
                                        value={option.label}
                                        //checked={option.selected}
                                        // checked={option.selected}
                                        onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field) }}
                                    />
                                    <p style={{ fontWeight: "500" }}>{option.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "select":
                return (
                    <div key={element.datatype} className="col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label}</p>
                        <select name={element.name} className="form-select"
                            onChange={(e) => { this.dynFormData(e, index, element.label, element.datatype, element.regex, element.field) }}
                        >
                            {element.values.map((option) => (
                                <option key={option.value} value={option.value} selected={option.selected}>
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
                    <div key={element.datatype} className="form-group col-6 mb-2">
                        <p className="label" style={{ marginBottom: "5px", color: "rgba(5,54,82,1)", fontWeight: "600" }}>{element.label}</p>
                        <input
                            type="date" className="form-control"
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
                dataList[index] = e.target.value;
                console.log(dataList);

                const valueList = [];
                console.log(dataList);
                valueList.push()
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

                $("#submitBtn").prop('disabled', false);
            }
        }
        const errorMessages = { ...this.state.errorMessages, [label]: errorMessage };

        this.state.formFieldLists[index].value = value;

        this.setState({
            formFieldLists: [...this.state.formFieldLists],
            errorMessages,
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
                majorid: formID,
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
                    $("#exampleModalCenter2").modal('hide');

                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                    this.setAddressDetails();

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
    //ovd
    collectPOA = () => {
        if (this.state.address1 == "" || this.state.address2 == "" || this.state.address3 == "" || this.state.district == "" || this.state.state1 == "" || this.state.pincode == "" || this.state.city == "") {
            alert("Please Fill all the Fields")
        } else {
            this.getovdMasterlist()
            $("#OvdModal2").click()
        }
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
    ovdPageType = (e) => {
        this.setState({ ovdPagetype: e.target.value })
    }
    uploadOvdDocu = () => {
        const ovdformData = new FormData()
        var ovdfileField = document.querySelector("input[type='file']");
        console.log(ovdfileField)

        var bodyData = JSON.stringify({
            ovdcode: this.state.selectDocu,
            mobileno: sessionStorage.getItem("B_mobile"),
            pagetype: this.state.ovdPagetype
        })
        ovdformData.append("ovdImage", ovdfileField.files[0]);
        ovdformData.append("ovdInfo", bodyData);

        const formData = new FormData();
        var qrfileField = document.getElementById("attachment");

        var bodyData = JSON.stringify({
            ovdcode: this.state.selectDocu,
            mobileno: sessionStorage.getItem("B_mobile"),
            pagetype: this.state.ovdPagetype
        })
        formData.append("ovdimage", qrfileField.files[0]);
        formData.append("ovdinfo", bodyData);
        fetch(BASEURL + '/usrmgmt/uploadovd', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: formData
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        }).then((resdata) => {
            console.log(resdata);
            if (resdata.status === 'Success') {
                console.log(resdata.msgdata);
                alert(resdata.message)
                var OVdParsedData = resdata.msgdata.ovdparseddata;
                console.log(OVdParsedData);
                this.getFormDetails()
                $("#uploadOvdDocID").hide();
                $("#submitOvdID").show()
                // this.setState({ovduserName:OVdParsedData})
                // this.setState({ovdDOB:OVdParsedData})
                // this.setState({ovdGender:OVdParsedData})
                // this.setState({ovdAddress:OVdParsedData})
                // this.setState({ovdIDno:OVdParsedData})
            } else {
                alert(resdata.message)
            }
        })
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
                //                 this.getUploadedOvds()
                //                 $("#uploadOvdDocID").show();
                //                 $("#submitOvdID").hide()
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
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        var sDocu = this.state.selectDocu;
        var upldDocu = documentAdded;
        var pgType = this.state.ovdPagetype;
        if (sDocu == "" || upldDocu == "" || pgType == "") {
            $('.uploadOvdDocuSbtn').prop('disabled', true)
        } else {
            $('.uploadOvdDocuSbtn').prop('disabled', false)
        }
        return (
            <div>
                <div className="row">
                    <div className='col-9' style={{ fontFamily: "Poppins", fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                        <FaMapMarkerAlt style={{ marginTop: "-6px" }} />&nbsp;<span>Address Info</span>
                        <hr style={{ marginTop: "1px" }} />
                    </div>
                    <div className='col-3' style={{ textAlign: "end" }}>
                        <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(136, 189, 72)", marginTop: "-8px" }}
                            onClick={this.setAddressDetails} ><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Submit</span></button>
                        &nbsp;
                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", marginTop: "-8px" }}
                            onClick={this.canceladdressDetails}  ><span>Cancel</span></button>
                    </div>
                </div>
                {/* <div className='row'>
            <div className='float-left'>
                {this.state.getattributes == "" ? <p className="text-primary">Personal details are empty, Please add Personal details selecting Edit Button.</p> : null}
                
            </div>
            </div> */}
                <div className="form-row ">
                    <p htmlFor="address" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}> Address Type </p>
                    <span className="mr-5"></span>
                    <div className="d-flex" onChange={this.addrtype}>
                        <div className="form-check">
                            <p className="form-check-label mr-5" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                <input type="radio" className="form-check-input" name="optradio" value="1" defaultChecked />Permanent
                            </p>
                        </div>
                        <span className="mr-5"></span>
                        <div className="form-check">
                            <p className="form-check-label mr-5" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                                <input type="radio" className="form-check-input" name="optradio" value="2" />Present
                            </p>
                        </div>
                    </div>
                </div>

                <div className='row' style={{ marginBottom: "17px" }}>
                    <div className='col-sm-2 col-md-3 col-lg-3'>
                        <p htmlFor="inputAddress1" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Address Line 1</p>
                        <input type="text" onChange={this.address1} className="form-control"
                            id="inputAddress" placeholder="Enter House No, Building Name" value={this.state.address1}
                            style={{ height: "38px" }} />
                        {(this.state.invalidAddress1) ? <span className='text-danger'>Invalid Address</span> : ''}
                    </div>
                    <div className='col-sm-2 col-md-3 col-lg-3'>
                        <p htmlFor="inputAddress2" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Address Line 2</p>
                        <input type="text" onChange={this.address2} className="form-control"
                            id="inputAddress2" placeholder="Enter Lane, Street" value={this.state.address2}
                            style={{ height: "38px" }} />
                        {(this.state.invalidAddress2) ? <span className='text-danger'>Invalid Address</span> : ''}
                    </div>
                    <div className='col-sm-2 col-md-3 col-lg-3'>
                        <p htmlFor="inputAddress2" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Landmark</p>
                        <input type="text" onChange={this.address3} className="form-control"
                            id="inputAddress3" placeholder="Enter nearby place" value={this.state.address3}
                            style={{ height: "38px" }} />
                    </div>
                    <div className='col-sm-2 col-md-3 col-lg-3'>
                        <p htmlFor="inputCity" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>City</p>
                        <input type="text" onChange={this.city} className="form-control"
                            id="inputCity" placeholder="Enter City" value={this.state.city}
                            style={{ height: "38px" }} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm-2 col-md-3 col-lg-3'>
                        <p htmlFor="inputState" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>State</p>
                        <select id="inputState" className="form-select" onChange={this.state1}>
                            {this.state.state1 ? <option>{this.state.intialState}</option> : <option defaultValue>Select State</option>}

                            {this.state.stateList.map((states, index) => (
                                <option key={index} value={states.statecode} style={{ color: "GrayText" }}>{states.statename} </option>
                            ))
                            }
                        </select>
                    </div>
                    <div className='col-sm-2 col-md-3 col-lg-3'>
                        <p htmlFor="inputDist" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>District</p>
                        <select id="inputDistrict" className="form-select" onChange={this.district}>
                            {this.state.district ? <option>{this.state.intialDistrict}</option> : <option defaultValue>Select District</option>}

                            {this.state.districtList.map((districts, index) => {
                                return (
                                    <option key={index} value={districts.distid} style={{ color: "GrayText" }}>{districts.distname}</option>
                                )
                            })
                            }
                        </select>
                    </div>
                    {this.state.talukFlag !== "p2p" ?
                        <div className='col-sm-2 col-md-3 col-lg-3'>
                            <p htmlFor="inputDist" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Taluk</p>
                            <select id="inputTaluk" className="form-select" style={{ color: "RGBA(5,54,82,1)" }} onChange={this.talukName}>
                                {this.state.taluk ? <option>{this.state.initialTaluk}</option> : <option defaultValue>Select Taluk</option>}

                                {this.state.talukList.map((taluk, index) => {
                                    return (
                                        <option key={index} value={taluk.talukname} style={{ color: "GrayText" }}>{taluk.talukname}</option>
                                    )
                                })
                                }
                            </select>
                        </div>
                        :
                        ""
                    }
                    <div className='col-sm-2 col-md-3 col-lg-3'>
                        <p htmlFor="inputZip" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>PIN Code</p>
                        <input type="text" onChange={this.pincode} className="form-control"
                            id="inputZip" placeholder="Enter Pincode" value={this.state.pincode}
                            style={{ height: "38px" }} />
                    </div>
                </div>

                {/* OVD UI */}
                <button type="button" id="OvdModal2" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter21" style={{ display: "none" }}>
                    Additional modal
                </button>
                <div class="modal fade" data-backdrop="static" id="exampleModalCenter21" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content" id='uploadOvdDocID'>
                            <div class="modal-body">
                                <div className='row'>
                                    <div className='col'>
                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Please Provide The Required Documents</p>
                                        <hr style={{ width: "200px" }} />
                                    </div>
                                </div>
                                <div className="row">
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
                                <div className='row mb-2'>
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
                            <div class="modal-body">
                                {/*Additional Fields*/}
                                <div className='row'>
                                    <div className='col'>
                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Submit Proof Of Address</p>
                                        <hr style={{ width: "200px" }} />
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
                                    <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                        <button className='btn btn-sm text-white submitOvdDocuSbtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setFormTxndata}>Submit</button>
                                        &nbsp;
                                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} onClick={this.cancelSubmitOVD}>Cancel</button>
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

export default EditBorAddressDetails