import React, { Component } from 'react';
import BorrowerSidebar from '../../SidebarFiles/BorrowerSidebar';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit, FaRegAddressBook, FaRegSave } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";

//updated
export class EditBorPersonalDetails extends Component {

    constructor(props) {
        super(props)

        this.state = {
            attributes: [],
            grpInfo: [],

            Profession: "",
            Account: "",
            YearsInResidence: "",
            YearsOfEarning: "",
            IncomeRangeGroup: "",
            ResidenceType: "",
            MaritalStatus: "",
            Relation: "",
            viewRelation: "",
            Dependents: "",
            Education: "",
            RelationName: "",
            LandHolding: "",
            Age: "",

            getattributes: [],

            AccountList: [],
            DependentsList: [],
            ProfessionList: [],
            IncomeRangeGroupList: [],
            MaritalStatusList: [],
            ResidenceTypeList: [],
            RelationNameList: [],
            RelationList: [],
            LandHoldingList: [],
            AgeList: [],
            YearsInResidenceList: [],
            YearsOfEarningList: [],
            EducationList: [],

            primaryProfession: "",
            secondaryProfession: "",
            primaryProfessionList: [],
            secondaryProfessionList: [],

            primaryProfValid: false,
            secondaProfValid: false
        }
        this.setPersonalDetails = this.setPersonalDetails.bind(this);
        this.getGroupInfo = this.getGroupInfo.bind(this);

        this.Profession = this.Profession.bind(this);
        this.Account = this.Account.bind(this);
        this.YearsInResidence = this.YearsInResidence.bind(this);
        this.YearsOfEarning = this.YearsOfEarning.bind(this);
        this.IncomeRangeGroup = this.IncomeRangeGroup.bind(this);
        this.ResidenceType = this.ResidenceType.bind(this);
        this.MaritalStatus = this.MaritalStatus.bind(this);
        this.Relation = this.Relation.bind(this);
        this.Dependents = this.Dependents.bind(this);
        this.Education = this.Education.bind(this);
        this.RelationName = this.RelationName.bind(this);
        this.LandHolding = this.LandHolding.bind(this);
        this.Age = this.Age.bind(this);
        this.getPersonalDetails = this.getPersonalDetails.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.getGroupInfo();
            this.getPersonalDetails()
        } else {
            window.location = '/login'
        }
    }
    primaryProfession = (e) => {
        const newPrimaryProfession = e.target.value;
        if (newPrimaryProfession === this.state.secondaryProfession) {
            console.log("Primary and secondary professions should not match.");
            this.setState({ primaryProfValid: true });
        } else {
            this.setState({ primaryProfValid: false });
            this.setState({ primaryProfession: newPrimaryProfession });
        }

        // this.state.primaryProfessionList
        const filteredSecondaryProfessionList = this.state.secondaryProfessionList.filter(
            list => list.attributevalue !== newPrimaryProfession
        );

        this.setState({
            primaryProfession: newPrimaryProfession,
            secondaryProfessionList: filteredSecondaryProfessionList,
            // secondaryProfession: '' // Reset the secondary profession selection
        });
    }

    secondaryProfession = (e) => {
        const newSecondaryProfession = e.target.value;
        if (newSecondaryProfession === this.state.primaryProfession) {
            console.log("Primary and secondary professions should not match.");
            this.setState({ secondaProfValid: true });
        } else {
            this.setState({ secondaProfValid: false });
            this.setState({ secondaryProfession: newSecondaryProfession });
        }

        // this.state.secondaryProfessionList
        const filteredPrimaryProfessionList = this.state.primaryProfessionList.filter(
            list => list.attributevalue !== newSecondaryProfession
        );

        this.setState({
            secondaryProfession: newSecondaryProfession,
            filteredPrimaryProfessionList: filteredPrimaryProfessionList,
            // primaryProfession: '' // Reset the primary profession selection
        });
    }
    Profession(event) {
        this.setState({ Profession: event.target.value })

    }
    Account(event) {
        this.setState({ Account: event.target.value })
    }
    YearsInResidence(event) {
        this.setState({ YearsInResidence: event.target.value })
    }
    YearsOfEarning(event) {
        this.setState({ YearsOfEarning: event.target.value })
    }
    IncomeRangeGroup(event) {
        this.setState({ IncomeRangeGroup: event.target.value })
    }
    ResidenceType(event) {
        this.setState({ ResidenceType: event.target.value })
    }
    MaritalStatus(event) {
        this.setState({ MaritalStatus: event.target.value })
    }
    Relation(event) {
        // Relation: event.target.value.slice(0, -3),
        this.setState({
            Relation: event.target.value,
            viewRelation: event.target.value
        })
        console.log(this.state.viewRelation)
    }
    Dependents(event) {
        this.setState({ Dependents: event.target.value })
    }
    Education(event) {
        this.setState({ Education: event.target.value })
    }
    RelationName(event) {
        this.setState({ RelationName: event.target.value })
    }
    LandHolding(event) {
        this.setState({ LandHolding: event.target.value })
    }
    Age(event) {
        this.setState({ Age: event.target.value })
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
                    sessionStorage.setItem("name", this.state.pname);
                    console.log(resdata.msgdata.attributes)

                    var responsePersonalDetails = resdata.msgdata.attributes;

                    const length = responsePersonalDetails.length;
                    console.log('length:' + length)

                    responsePersonalDetails.forEach(element => {
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
                        } else if (element.attributetype == "Income Range Group") {
                            this.setState({ IncomeRangeGroup: element.attributevalue })
                            console.log('IncomeRangeGroup: ' + this.state.IncomeRangeGroup)
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
                            console.log('LandHolding: ' + this.state.LandHolding)
                        } else if (element.attributetype == "Age") {
                            this.setState({ Age: element.attributevalue })
                            console.log('Age: ' + this.state.Age)
                        } else if (element.attributetype == "Years In Residence") {
                            this.setState({ YearsInResidence: element.attributevalue })
                            console.log('YearsInResidence: ' + this.state.YearsInResidence)
                        } else if (element.attributetype == "Years Of Earning") {
                            this.setState({ YearsOfEarning: element.attributevalue })
                            console.log('YearsOfEarning: ' + this.state.YearsOfEarning)
                        } else if (element.attributetype == "Education") {
                            this.setState({ Education: element.attributevalue })
                            console.log('Education: ' + this.state.Education)
                        } else if (element.attributetype == "Primary Profession") {
                            this.setState({ primaryProfession: element.attributevalue })
                            console.log('Primary Profession: ' + this.state.primaryProfession)
                        } else if (element.attributetype == "Secondary Profession") {
                            this.setState({ secondaryProfession: element.attributevalue })
                            console.log('Secondary Profession: ' + this.state.secondaryProfession)
                        }
                    })

                }
                else {
                    alert("Issue: " + resdata.message);
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
                groupnames: ["BORROWER"]

            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({ grpInfo: resdata.data.BORROWER })
                    var GroupInfo = resdata.data.BORROWER;
                    console.log(GroupInfo)

                    GroupInfo.forEach(element => {
                        console.log('element:' + element)
                        if (element.attributename == "Account") {
                            this.setState({ AccountList: element.attributeoptions })
                            console.log(element.attributeoptions)
                            console.log('Account: ' + this.state.AccountList)
                        } else if (element.attributename == "Dependents") {
                            this.setState({ DependentsList: element.attributeoptions })
                            console.log('Dependents: ' + this.state.DependentsList)
                        } else if (element.attributename == "Profession") {
                            this.setState({ ProfessionList: element.attributeoptions })
                            console.log('Profession: ' + this.state.ProfessionList)
                        } else if (element.attributename == "Income Range Group") {
                            this.setState({ IncomeRangeGroupList: element.attributeoptions })
                            console.log('IncomeRangeGroup: ' + this.state.IncomeRangeGroupList)
                        } else if (element.attributename == "Marital Status") {
                            this.setState({ MaritalStatusList: element.attributeoptions })
                            console.log('Marital Status: ' + this.state.MaritalStatusList)
                        } else if (element.attributename == "Residence Type") {
                            this.setState({ ResidenceTypeList: element.attributeoptions })
                            console.log('Residence Type: ' + this.state.ResidenceTypeList)
                        } else if (element.attributename == "Relation Reference Name") {
                            this.setState({ RelationNameList: element.attributeoptions })
                            console.log('Relation Name:' + this.state.RelationNameList)
                        } else if (element.attributename == "Relationship") {
                            this.setState({ RelationList: element.attributeoptions })
                            console.log('Relation: ' + this.state.RelationList)
                        } else if (element.attributename == "Land Holding") {
                            this.setState({ LandHoldingList: element.attributeoptions })
                            console.log('LandHolding: ' + this.state.LandHoldingList)
                        } else if (element.attributename == "Age") {
                            this.setState({ AgeList: element.attributeoptions })
                            console.log('Age: ' + this.state.AgeList)
                        } else if (element.attributename == "Years In Residence") {
                            this.setState({ YearsInResidenceList: element.attributeoptions })
                            console.log('YearsInResidence: ' + this.state.YearsInResidenceList)
                        } else if (element.attributename == "Years Of Earning") {
                            this.setState({ YearsOfEarningList: element.attributeoptions })
                            console.log('YearsOfEarning: ' + this.state.YearsOfEarningList)
                        } else if (element.attributename == "Education") {
                            this.setState({ EducationList: element.attributeoptions })
                            console.log('Education: ' + this.state.EducationList)
                        } else if (element.attributename == "Primary Profession") {
                            this.setState({ primaryProfessionList: element.attributeoptions })
                            console.log('Primary Profession: ' + this.state.primaryProfessionList)
                        } else if (element.attributename == "Secondary Profession") {
                            this.setState({ secondaryProfessionList: element.attributeoptions })
                            console.log('Secondary Profession: ' + this.state.secondaryProfessionList)
                        }
                    })
                }
                else {
                    alert(resdata.message);
                }
            })
    }

    setPersonalDetails(event) {
        if (this.state.Account == "" || this.state.primaryProfession == "" || this.state.ResidenceType == "" ||
            this.state.Education == "" || this.state.IncomeRangeGroup == "" ||
            this.state.MaritalStatus == "" || this.state.Relation == "" ||
            this.state.RelationName == "" || this.state.LandHolding == "" ||
            this.state.Age == "" || this.state.Dependents == "" || this.state.YearsInResidence == "" || this.state.YearsOfEarning == "") {
            confirmAlert({
                message: "Please fill all the fields",
                buttons: [{
                    label: "Okay",
                    onClick: () => {
                        // window.location.reload()
                    }
                }]
            });
        } else {
            fetch(BASEURL + '/usrmgmt/setpersonaldetails', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    attributes: [
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
                    ]
                })
            }).then((Response) => Response.json())
                .then((resdata) => {
                    if (resdata.status === 'Success') {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        window.location = '/borrowerDetails';
                                    },
                                },
                            ],
                        });
                        //alert("Personal details  updated Successfully");

                        console.log(resdata);
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
                        //alert("Issue: " + resdata.message);
                    }
                })
        }

    }
    cancelpersonalDetails = () => {
        window.location.reload();
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
                    <div className='col-9' style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(5,54,82,1)", fontSize: "14px" }}>
                        <FaRegUser style={{ marginTop: "-6px" }} />&nbsp;<span>Personal Info</span>
                        <hr style={{ marginTop: "1px" }} />
                    </div>
                    <div className='col-3' style={{ textAlign: "end" }}>
                        <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(136, 189, 72)", marginTop: "-8px" }}
                            onClick={this.setPersonalDetails}  ><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Submit</span></button>
                        &nbsp;
                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", marginTop: "-8px" }}
                            onClick={this.cancelpersonalDetails}  ><span>Cancel</span></button>
                    </div>
                </div>

                <div className='row mb-1'>
                    {/* <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Profession</p>

                        <select className="form-select" style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} onChange={this.Profession}>
                            {this.state.Profession ? <option>{this.state.Profession}</option> : <option defaultValue>----Please Select----</option>}
                            {this.state.ProfessionList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div> */}
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Primary Profession</p>
                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.primaryProfession} value={this.state.primaryProfession || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.primaryProfessionList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }} value={list.attributevalue}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                        {(this.state.primaryProfValid) ? <span className='text-danger'>Primary and secondary professions should not match.</span> : ''}
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Secondary Profession</p>
                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.secondaryProfession} value={this.state.secondaryProfession || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.secondaryProfessionList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }} value={list.attributevalue}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                        {(this.state.secondaProfValid) ? <span className='text-danger'>Primary and secondary professions should not match.</span> : ''}
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Residence Type</p>

                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.ResidenceType} value={this.state.ResidenceType || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.ResidenceTypeList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }} value={list.attributevalue}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Education</p>

                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.Education} value={this.state.Education || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.EducationList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }} value={list.attributevalue}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <div className='row mb-1'>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Income Range Group</p>

                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.IncomeRangeGroup} value={this.state.IncomeRangeGroup || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.IncomeRangeGroupList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }} value={list.attributevalue}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Marital Status</p>

                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.MaritalStatus} value={this.state.MaritalStatus || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.MaritalStatusList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }} value={list.attributevalue}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Account type</p>

                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.Account} value={this.state.Account || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.AccountList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }} value={list.attributevalue}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Relationship</p>
                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.Relation} value={this.state.Relation || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.RelationList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }}>
                                        {/* {list.attributevalue == list.attributevalue + " " + "Of" ? list.attributevalue : list.attributevalue + " " + "Of"} */}
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <div className='row mb-1'>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Relation Reference Name</p>
                        {this.state.RelationNameList.map((list, index) => {
                            return (
                                <input type="text" onChange={this.RelationName} className="form-control"
                                    style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }} placeholder='Enter Relation Name' value={this.state.RelationName} />
                            )
                        })}
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Land Holding</p>
                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.LandHolding} value={this.state.LandHolding || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.LandHoldingList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }} value={list.attributevalue}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Age</p>
                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.Age} value={this.state.Age || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.AgeList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }} value={list.attributevalue}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Dependents</p>
                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.Dependents} value={this.state.Dependents || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.DependentsList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }} value={list.attributevalue}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                </div>
                <div className='row'>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Years In Residence</p>
                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.YearsInResidence} value={this.state.YearsInResidence || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.YearsInResidenceList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }} value={list.attributevalue}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Years Of Earning</p>

                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.YearsOfEarning} value={this.state.YearsOfEarning || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.YearsOfEarningList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }} value={list.attributevalue}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>

                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>

                    </div>

                </div>
            </div>
        )
    }
}

export default EditBorPersonalDetails

