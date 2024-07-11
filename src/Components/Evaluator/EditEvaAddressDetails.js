import React, { Component } from 'react';
import EvaluatorSidebar from '../../SidebarFiles/EvaluatorSidebar';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaRegSave } from "react-icons/fa";
import {talukFlagED} from '../assets/Constant'

//updated
var globalStateList;
export class EditEvaAddressDetails extends Component {

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
            //talukFlag: "p2p"
            talukFlag: talukFlagED,
        }

        this.addrtype = this.addrtype.bind(this);
        this.address1 = this.address1.bind(this);
        this.address2 = this.address2.bind(this);
        this.address3 = this.address3.bind(this);
        this.district = this.district.bind(this);
        this.city = this.city.bind(this);
        this.state1 = this.state1.bind(this);
        this.statecode = this.statecode.bind(this);
        this.pincode = this.pincode.bind(this);
        this.setAddressDetails = this.setAddressDetails.bind(this);
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
                console.log("called " + ele.address3)
                this.setState({ address1: ele.address1 })
                this.setState({ address2: ele.address2 })
                this.setState({ address3: ele.address3 })
                this.setState({ city: ele.city })
                this.setState({ state1: ele.state })
                this.setState({ intialState: ele.state })
                this.setState({ pincode: ele.pincode })
                this.setState({ district: ele.district })
                this.setState({ intialDistrict: ele.district });
                this.setState({ taluk: ele.taluk })
                this.setState({ initialTaluk: ele.taluk })

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
        })
        console.log(addressDetails)
    }
    address1(event) {
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
        this.getStateList();
        this.getAddressDetails();
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
                            this.setState({ intialDistrict: ele.district });
                            this.setState({ initialTaluk: ele.taluk })
                            this.setState({ taluk: ele.taluk })
                            this.getStateList(resdata.msgdata[0].state);
                            this.getDistrictList(resdata.msgdata[0].statecode);
                            var responseAddress = resdata.msgdata;
                            this.setState({ addressDetails: responseAddress })
                            console.log(this.state.addressDetails)
                        }
                    })

                }
                // else {
                //     alert("Issue: " + resdata.message);
                // }
            })
    }

    getStateList(data) {
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
                    var DefaultStateCode;
                    globalStateList.forEach(element => {
                        if (element.statename === data) {
                            DefaultStateCode = element.statecode;
                        }
                    });
                    this.getDistrictList(DefaultStateCode);
                    this.state.stateList.map((statelist) => {
                        return statelist.statename;
                    })
                }
                // else {
                //     alert("Issue: " + resdata.message);
                // }
            })
    }

    getDistrictList(StateCode) {
        //this.setState({ state1: statecod })
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
                    console.log(resdata);
                    this.setState({ districtList: resdata.msgdata.distlist })
                }
                // else {
                //     alert("Issue: " + resdata.message);
                // }
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

    setAddressDetails(event) {
        if (this.state.address1 == "" || this.state.address2 == "" || this.state.address3 == "" || this.state.district == "" || this.state.state1 == "" || this.state.pincode == "" || this.state.city == "") {
            alert("Please Fill all the Fields")
        } else {
            var data = {
                addrtype: parseInt(this.state.addrtype),
                address1: this.state.address1,
                address2: this.state.address2,
                address3: this.state.address3,
                pincode: parseInt(this.state.pincode),
                city: this.state.city
            }
            if (this.state.state1.length != 2) {
                this.state.stateList.forEach(ele => {
                    if (ele.statename === this.state.state1) {
                        data.statecode = ele.statecode;
                        data.state = ele.statename;
                    }
                })
                this.state.districtList.forEach(ele1 => {

                    if (ele1.distname === this.state.district) {
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
            fetch(BASEURL + '/usrmgmt/setaddressdetails', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify(data)
            }).then((Response) => Response.json())
                .then((resdata) => {
                    if (resdata.status === 'Success') {
                        alert(resdata.message);
                        console.log(resdata);
                        this.setUserStatusflag();
                    }
                    else {
                        alert("Issue: " + resdata.message);
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
        window.location.reload()
    }

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className='col-9' style={{ fontFamily: "Poppins", fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                        <FaMapMarkerAlt style={{ marginTop: "-6px" }} />&nbsp;<span>Address Info</span>
                        <hr style={{ marginTop: "1px" }} />
                    </div>
                    <div className='col-3' style={{ textAlign: "end" }}>
                        <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(136, 189, 72)", marginTop: "-8px" }}
                            onClick={this.setAddressDetails}><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Submit</span></button>
                        &nbsp;
                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", marginTop: "-8px" }}
                            onClick={this.canceladdressDetails}  ><span>Cancel</span></button>
                    </div>
                </div>
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
                            id="inputAddress" placeholder="Enter House No, Building Name"
                            value={this.state.address1}
                            style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }} />
                        {(this.state.invalidAddress1) ? <span className='text-danger'>Invalid Address</span> : ''}
                    </div>
                    <div className='col-sm-2 col-md-3 col-lg-3'>
                        <p htmlFor="inputAddress2" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Address Line 2</p>
                        <input type="text" onChange={this.address2} className="form-control"
                            id="inputAddress2" placeholder="Enter Lane, Street" value={this.state.address2}
                            style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }} />
                        {(this.state.invalidAddress2) ? <span className='text-danger'>Invalid Address</span> : ''}
                    </div>
                    <div className='col-sm-2 col-md-3 col-lg-3'>
                        <p htmlFor="inputAddress2" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Landmark</p>
                        <input type="text" onChange={this.address3} className="form-control"
                            id="inputAddress3" placeholder="Enter nearby place" value={this.state.address3}
                            style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }} />
                    </div>
                    <div className='col-sm-2 col-md-3 col-lg-3'>
                        <p htmlFor="inputCity" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>City</p>
                        <input type="text" onChange={this.city} className="form-control"
                            id="inputCity" placeholder="Enter City" value={this.state.city}
                            style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }} />
                    </div>
                </div>
                <div className='row'>

                    <div className='col-sm-2 col-md-3 col-lg-3'>
                        <p htmlFor="inputState" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>State</p>
                        <select id="inputState" className="form-select" style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} onClick={this.state1}>
                            {this.state.state1 ? <option>{this.state.intialState}</option> : <option defaultValue>Select State</option>}

                            {this.state.stateList.map((states, index) => (
                                <option key={index} value={states.statecode} style={{ color: "GrayText" }}>{states.statename} </option>
                            ))
                            }
                        </select>
                    </div>
                    <div className='col-sm-2 col-md-3 col-lg-3'>
                        <p htmlFor="inputDist" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>District</p>
                        <select id="inputDistrict" className="form-select" style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} onChange={this.district}>
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
                            <select id="inputTaluk" className="form-select" style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} onChange={this.talukName}>
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
                            style={{ height: "38px", marginTop: "-5px", color: "RGBA(5,54,82,1)" }} />
                    </div>
                </div>
            </div>
        )
    }
}

export default EditEvaAddressDetails