import React, { Component } from 'react';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit, FaRegAddressBook, FaRegSave } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";

//updated
export class EditLndNomineeDetails extends Component {

    constructor(props) {
        super(props)

        this.state = {
            nomname: '',
            nomrelation: '',
            nomguardian: '',
            nomguardrelation: '',
            nomsharepercent: '100',
            nomdob: '',

            nomineeAgeFlag: false,
            nomineeRelationList: [],
            nomineeGuardianRelationList: [],
            nomRelationID: "",
            nomGudRelationID: "",
            dateError: false,
            ovdMasterList: [],
            docidnum: "",
            phno: "",
            selectDocu: '',
            isdocidFlag: false,
            selectDocudesc: '',
            getNomList: []
        }

        this.nomname = this.nomname.bind(this);
        this.nomrelation = this.nomrelation.bind(this);
        this.nomguardian = this.nomguardian.bind(this);
        this.nomguardrelation = this.nomguardrelation.bind(this);
        this.nomsharepercent = this.nomsharepercent.bind(this);
        this.nomdob = this.nomdob.bind(this);
        this.registerNominee = this.registerNominee.bind(this);
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.getNomineeDetails();
            this.getGroupInfo();
            this.getovdMasterlist();
        } else {
            window.location = '/login'
        }
    }

    nomname(event) {
        this.setState({ nomname: event.target.value })
    }
    nomrelation(event) {
        this.setState({ nomrelation: event.target.value })
        console.log(event.target.value)
        this.state.nomineeRelationList
            .filter((e) => e.attributevalue == event.target.value)
            .map((prdt, index) => {
                this.setState({ nomrelation: prdt.attributeid })
            })
        console.log(this.state.nomrelation)
    }
    nomguardrelation(event) {
        this.setState({ nomguardrelation: event.target.value })
        console.log(event.target.value)
        this.state.nomineeGuardianRelationList
            .filter((e) => e.attributevalue == event.target.value)
            .map((prdt, index) => {
                this.setState({ nomguardrelation: prdt.attributeid })
            })
        console.log(this.state.nomguardrelation)
    }
    nomguardian(event) {
        this.setState({ nomguardian: event.target.value })
    }
    docidnum = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z0-9]*$/;

        if (regex.test(value)) {
            this.setState({ docidnum: value, isdocidFlag: false });
        } else {
            this.setState({ isdocidFlag: true });
        }
    };
    phno = (e) => {
        this.setState({ phno: e.target.value })
    }
    selectOvdDocument = (e) => {
        this.setState({ selectDocu: e.target.value })
        console.log(e.target.value)

    }
    nomsharepercent(event) {
        this.setState({ nomsharepercent: event.target.value })
    }
    nomdob(event) {
        this.setState({ nomdob: event.target.value })
        console.log(this.state.nomdob)

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var frday;

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        var todayString = yyyy + '-' + mm + '-' + dd;

        var selectedDate = event.target.value;
        console.log("selected date " + selectedDate)

        console.log("today date " + todayString)

        if (selectedDate > todayString) {
            console.log("Nominee DOB is in the future");
            this.setState({ dateError: true });
        } else {
            console.log("Nominee DOB is valid");
            this.setState({ dateError: false });

            var birthDate = new Date(selectedDate);
            var age = yyyy - birthDate.getFullYear();
            var m = mm - birthDate.getMonth();
            if (m < 0 || (m === 0 && dd < birthDate.getDate())) {
                age--;
            }

            if (age < 18) {
                console.log("age is less than 18 years old")
                $("#nomineeGuardian").show()
                $("#nomineeGuardianRelation").show()
                this.setState({ nomineeAgeFlag: false })
            } else if (age >= 18) {
                console.log("Passed Age")
                $("#nomineeGuardian").hide()
                $("#nomineeGuardianRelation").hide()
                this.setState({ nomineeAgeFlag: true })
            }
        }

        // var nowyear = today.getFullYear();
        // var b = event.target.value;

        // var birth = new Date(b);
        // var birthyear = birth.getFullYear();
        // var age = nowyear - birthyear;
        // console.log(age);
        // if (age < 18) {
        //     console.log("age is less than 18 years old")
        //     $("#nomineeGuardian").show()
        //     $("#nomineeGuardianRelation").show()
        //     this.setState({ nomineeAgeFlag: false })
        // } else if (age >= 18) {
        //     console.log("Passed Age")
        //     $("#nomineeGuardian").hide()
        //     $("#nomineeGuardianRelation").hide()
        //     this.setState({ nomineeAgeFlag: true })
        // }

    }


    getNomineeDetails = (event) => {
        fetch(BASEURL + '/usrmgmt/getnomineedetails', {
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

                    var array = resdata.msgdata
                    console.log(array);
                    var latestElement = array[array.length - 1]
                    console.log(latestElement)
                    this.setState({ getNomList: array })

                    this.setState({ nomname: latestElement.nomname })
                    this.setState({ nomguardian: latestElement.nomguardian })
                    this.setState({ nomdob: latestElement.nomdob })
                    this.setState({ nomrelation: latestElement.nomrelation })
                    this.setState({ nomguardrelation: latestElement.nomguardianrelation })
                    this.setState({ nomsharepercent: latestElement.nomsharepercent })
                    this.setState({ selectDocu: latestElement.idtype })
                    this.setState({ selectDocudesc: latestElement.idtypedesc })
                    this.setState({ docidnum: latestElement.idnumber })
                    this.setState({ phno: latestElement.phonenumber })


                    console.log(this.state.nomdob)
                    var today = new Date();
                    var nowyear = today.getFullYear();
                    var b = this.state.nomdob;

                    var birth = new Date(b);
                    var birthyear = birth.getFullYear();
                    var age = nowyear - birthyear;
                    console.log(age);
                    if (age < 18) {
                        console.log("age is less than 18 years old")
                        $("#nomineeGuardian").show()
                        $("#nomineeGuardianRelation").show()
                        this.setState({ nomineeAgeFlag: false })
                    } else if (age >= 18) {
                        console.log("Passed Age")
                        $("#nomineeGuardian").hide()
                        $("#nomineeGuardianRelation").hide()
                        this.setState({ nomineeAgeFlag: true })
                    }

                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
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
                groupnames: ["LENDER"]

            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({ grpInfo: resdata.data.LENDER })
                    var GroupInfo = resdata.data.LENDER;
                    console.log(GroupInfo)

                    GroupInfo.forEach(element => {
                        console.log(element);
                        if (element.attributename == "Nominee Relationship") {
                            this.setState({ nomineeRelationList: element.attributeoptions })
                            console.log('NomineeRelation: ' + this.state.nomineeRelationList)

                        } else if (element.attributename == "Nominee Gaurdian Relationship") {
                            this.setState({ nomineeGuardianRelationList: element.attributeoptions })
                            console.log('NomineeGuardianList: ' + this.state.nomineeGuardianRelationList)
                        }
                    })

                } else {
                    alert("Issue: " + resdata.message);
                }
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
    registerNominee(event) {
        if (this.state.dateError === true) {
            confirmAlert({
                message: "Selected date is in the future.",
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
            var withNomineeAgeFlag = JSON.stringify({
                nomname: this.state.nomname,
                nomrelation: this.state.nomrelation,
                nomguardian: this.state.nomguardian,
                nomguardrelation: this.state.nomguardrelation,
                nomsharepercent: parseInt("100"),
                nomdob: this.state.nomdob,
                idtype: this.state.selectDocu,
                idnumber: this.state.docidnum,
                phonenumber: this.state.phno
            })
            var withoutNomineeAgeFlag = JSON.stringify({
                nomname: this.state.nomname,
                nomrelation: this.state.nomrelation,
                nomsharepercent: parseInt("100"),
                nomdob: this.state.nomdob,
                idtype: this.state.selectDocu,
                idnumber: this.state.docidnum,
                phonenumber: this.state.phno
            })
            var finalBody = this.state.nomineeAgeFlag ? withoutNomineeAgeFlag : withNomineeAgeFlag
            console.log(finalBody);
            fetch(BASEURL + '/usrmgmt/setnomineedetails', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: finalBody
            }).then((Response) => Response.json())
                .then((resdata) => {
                    if (resdata.status === 'Success') {
                        console.log(resdata);
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        window.location = "/lenderdashboard"
                                    }
                                }
                            ],
                            closeOnClickOutside: false,
                        })
                        // window.location = "/thankyou";
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
                        // alert("Issue: " + resdata.message);
                        // window.location='/'
                    }
                })
        }
    }
    cancelnomineeDetails = () => {
        window.location.reload();
    }
    getNomguardRelation = () => {
        const { nomguardrelation, nomineeGuardianRelationList } = this.state;
        const matchedItem = nomineeGuardianRelationList.find(item => item.attributeid === nomguardrelation);
        return matchedItem ? matchedItem.attributevalue : "";
    }
    getNomList1 = () => {
        const { selectDocu, getNomList } = this.state;
        console.log(selectDocu)
        const matchedItem = getNomList.find(item => item.idtype === selectDocu);
        console.log(matchedItem);
        return matchedItem ? matchedItem.idtype : "";
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const getNomguuardRelation = this.getNomguardRelation();
        const getNommList2 = this.getNomList1();
        var NomineeRelation = this.state.nomrelation
        var getNomrelation = "";
        if (NomineeRelation == "A") {
            getNomrelation = "Father"
        } else if (NomineeRelation == "B") {
            getNomrelation = "Mother"
        } else if (NomineeRelation == "C") {
            getNomrelation = "Son"
        } else if (NomineeRelation == "D") {
            getNomrelation = "Daughter"
        } else if (NomineeRelation == "E") {
            getNomrelation = "Husband"
        } else if (NomineeRelation == "F") {
            getNomrelation = "Wife"
        }
        console.log(getNomrelation)
        return (
            <div>
                <div className="row">
                    <div className='col-9' style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                        <FaRegAddressBook style={{ marginTop: "-6px" }} />&nbsp;<span>Nominee Info</span>
                        <hr style={{ marginTop: "1px" }} />
                    </div>
                    <div className='col-3' style={{ textAlign: "end" }}>
                        <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(136, 189, 72)", marginTop: "-8px" }}
                            onClick={this.registerNominee}><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Submit</span></button>
                        &nbsp;
                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", marginTop: "-8px" }}
                            onClick={this.cancelnomineeDetails}  ><span>Cancel</span></button>
                    </div>
                </div>

                <div className='row' style={{ marginBottom: "17px", marginTop: "-10px" }}>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="inputEmail4" style={{ fontWeight: "bold", fontSize: "14px", color: "RGBA(5,54,82,1)" }}>Nominee Name</p>
                        <input type="text" onChange={this.nomname} className="form-control"
                            style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }}
                            placeholder="Enter Nominee Name" value={this.state.nomname} />
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="inputEmail4" style={{ fontWeight: "bold", fontSize: "14px", color: "RGBA(5,54,82,1)" }}>Nominee Relationship</p>
                        <select className='form-select' onChange={this.nomrelation} value={getNomrelation || ''} style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }}>
                            {/* {this.state.nomrelation ? <option>{getNomrelation}</option> : <option defaultValue>----Please Select----</option>} */}
                            <option value="" disabled>----Please Select----</option>
                            {this.state.nomineeRelationList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                        {/* value={this.state.nomrelation} */}
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="inputEmail4" style={{ fontWeight: "bold", fontSize: "14px", color: "RGBA(5,54,82,1)" }}>Nominee DOB</p>
                        <input type="date" onChange={this.nomdob} className="form-control"
                            style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }}
                            placeholder="Enter Nominee DOB" value={this.state.nomdob.split(' ')[0]} />
                        {(this.state.dateError) ? <span className='text-danger'>Please enter a valid date of birth.</span> : ''}

                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="inputEmail4" style={{ fontWeight: "bold", fontSize: "14px", color: "RGBA(5,54,82,1)" }}>Document Type</p>
                        <select className='form-select' onChange={this.selectOvdDocument} value={this.state.selectDocu || ''} style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }}>
                            <option value="" disabled>----Please Select----</option>
                            {/* {this.state.selectDocu ? <option>{this.state.selectDocu}</option> : <option defaultValue>----Please Select----</option>} */}
                            {/* <option defaultValue>Select</option> */}
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
                <div className='row' style={{ marginTop: "-10px" }}>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="inputEmail4" style={{ fontWeight: "bold", fontSize: "14px", color: "RGBA(5,54,82,1)" }}>Document Number</p>
                        <input type="text" onChange={this.docidnum} className="form-control"
                            style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }}
                            placeholder="Enter Document ID Number" value={this.state.docidnum} />

                        {(this.state.isdocidFlag) ? <span className='text-danger' style={{ fontSize: "small" }}>Invalid Document ID Number</span> : ''}
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="inputEmail4" style={{ fontWeight: "bold", fontSize: "14px", color: "RGBA(5,54,82,1)" }}>Mobile Number</p>
                        <input type="text" onChange={this.phno} maxLength={10} className="form-control"
                            style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }}
                            placeholder="Enter Mobile Number" value={this.state.phno} />
                    </div>

                    <div className='col-sm-3 col-md-3 col-lg-3' id='nomineeGuardian' style={{ display: "none" }}>
                        <p htmlFor="inputEmail4" style={{ fontWeight: "bold", fontSize: "14px", color: "RGBA(5,54,82,1)" }}>Nominee Guardian</p>
                        <input type="text" onChange={this.nomguardian} className="form-control"
                            style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }}
                            placeholder="Enter Nominee Guardian" value={this.state.nomguardian} />
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3' id='nomineeGuardianRelation' style={{ display: "none" }}>
                        <p htmlFor="inputEmail4" style={{ fontWeight: "bold", fontSize: "14px", color: "RGBA(5,54,82,1)", width: "max-content" }}>Nominee Guardian Relationship</p>
                        <select
                            className='form-select'
                            onChange={this.nomguardrelation}
                            value={this.state.nomguardrelation || ''}
                            style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }}
                        >
                            <option value="" disabled>----Please Select----</option>
                            {this.state.nomineeGuardianRelationList.map((list, index) => (
                                <option key={index} value={list.attributeid} style={{ color: "GrayText" }}>
                                    {list.attributevalue}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='row'>
                    {/* <div className='col-sm-4 col-md-4 col-lg-4'>
                        <p htmlFor="inputEmail4" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Nominee Share Percent</p>
                        <input type="text" onChange={this.nomsharepercent} className="form-control" style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }}
                            placeholder="Enter Nominee Share Percent" value={this.state.nomsharepercent} />
                    </div> */}

                </div>
            </div>
        )
    }
}

export default EditLndNomineeDetails