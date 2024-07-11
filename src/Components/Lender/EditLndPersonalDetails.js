import React, { Component } from 'react';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit, FaRegAddressBook, FaRegSave } from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert';

//updated
export class EditLndPersonalDetails extends Component {

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
            Age: "",
            nomineeRelation: "",
            nomineeGuardianRelation: "",

            //Lists
            ProfessionList: [],
            IncomeRangeList: [],
            AccountList: [],
            EducationList: [],
            MaritalStatusList: [],
            ResidenceTypeList: [],
            RelationList: [],
            RelationNameList: [],
            nomineeRelationList: [],
            nomineeGuardianRelationList: [],

            //IDs
            nomRelationID: "",
            nomGudRelationID: "",

            professionID: "",
            incomerangeID: "",
            educationID: "",
            residencetypeID: "",
            accountID: "",
            maritalstatusID: "",
            relationID: "",
            relationNameID: "",
        }
        this.setPersonalDetails = this.setPersonalDetails.bind(this);
        this.getGroupInfo = this.getGroupInfo.bind(this);

        this.Profession = this.Profession.bind(this);
        this.Account = this.Account.bind(this);
        this.IncomeRangeGroup = this.IncomeRangeGroup.bind(this);
        this.ResidenceType = this.ResidenceType.bind(this);
        this.MaritalStatus = this.MaritalStatus.bind(this);
        this.Relation = this.Relation.bind(this);

        this.Education = this.Education.bind(this);
        this.RelationName = this.RelationName.bind(this);

    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.getGroupInfo();
            this.getPersonalDetails();
        } else {
            window.location = '/login'
        }

    }

    Profession = (event) => {
        this.setState({ Profession: event.target.value })
        this.state.ProfessionList
            .filter((e) => e.attributevalue == event.target.value)
            .map((prdt, index) => {
                this.setState({ professionID: prdt.attributeid })
            })
        console.log(this.state.professionID)
    }
    Account = (event) => {
        this.setState({ Account: event.target.value })
        this.state.AccountList
            .filter((e) => e.attributevalue == event.target.value)
            .map((prdt, index) => {
                this.setState({ accountID: prdt.attributeid })
            })
        console.log(this.state.accountID)
    }

    IncomeRangeGroup = (event) => {
        this.setState({ IncomeRangeGroup: event.target.value })
        this.state.IncomeRangeList
            .filter((e) => e.attributevalue == event.target.value)
            .map((prdt, index) => {
                this.setState({ incomerangeID: prdt.attributeid })
            })
        console.log(this.state.incomerangeID)
    }
    ResidenceType = (event) => {
        this.setState({ ResidenceType: event.target.value })
        this.state.ResidenceTypeList
            .filter((e) => e.attributevalue == event.target.value)
            .map((prdt, index) => {
                this.setState({ residencetypeID: prdt.attributeid })
            })
        console.log(this.state.residencetypeID)
    }
    MaritalStatus = (event) => {
        this.setState({ MaritalStatus: event.target.value })
        this.state.MaritalStatusList
            .filter((e) => e.attributevalue == event.target.value)
            .map((prdt, index) => {
                this.setState({ maritalstatusID: prdt.attributeid })
            })
        console.log(this.state.maritalstatusID)
    }
    Relation = (event) => {
        // Relation: event.target.value.slice(0, -3),
        this.setState({
            Relation: event.target.value,
            viewRelation: event.target.value
        })
        this.state.RelationList
            .filter((e) => e.attributevalue == event.target.value)
            .map((prdt, index) => {
                this.setState({ relationID: prdt.attributeid })
            })
        console.log(this.state.relationID)
    }

    Education = (event) => {
        this.setState({ Education: event.target.value })
        this.state.EducationList
            .filter((e) => e.attributevalue == event.target.value)
            .map((prdt, index) => {
                this.setState({ educationID: prdt.attributeid })
            })
        console.log(this.state.educationID)
    }
    RelationName = (event) => {
        this.setState({ RelationName: event.target.value })
        this.state.RelationNameList
            .filter((e) => e.attributevalue == event.target.value)
            .map((prdt, index) => {
                this.setState({ relationNameID: prdt.attributeid })
            })
        console.log(this.state.relationNameID)
    }

    NomineeRelation = (event) => {
        this.setState({ nomineeRelation: event.target.value })
        this.state.nomineeRelationList
            .filter((e) => e.attributevalue == event.target.value)
            .map((prdt, index) => {
                this.setState({ nomRelationID: prdt.attributeid })
            })
        console.log(this.state.nomRelationID)
    }
    NomineeGuardianRelation = (event) => {
        this.setState({ nomineeGuardianRelation: event.target.value })
        this.state.nomineeGuardianRelationList
            .filter((e) => e.attributevalue == event.target.value)
            .map((prdt, index) => {
                this.setState({ nomGudRelationID: prdt.attributeid })
            })
        console.log(this.state.nomGudRelationID)
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
                        if (element.attributename == "Profession") {
                            this.setState({ ProfessionList: element.attributeoptions })
                            console.log(element.attributeoptions)
                            console.log('Profession: ' + this.state.ProfessionList)
                        } else if (element.attributename == "Income Range Group") {
                            this.setState({ IncomeRangeList: element.attributeoptions })
                            console.log('IncomeRangeList: ' + this.state.IncomeRangeList)
                        } else if (element.attributename == "Account") {
                            this.setState({ AccountList: element.attributeoptions })
                            console.log('AccountList: ' + this.state.AccountList)
                        } else if (element.attributename == "Education") {
                            this.setState({ EducationList: element.attributeoptions })
                            console.log('EducationList: ' + this.state.EducationList)
                        } else if (element.attributename == "Marital Status") {
                            this.setState({ MaritalStatusList: element.attributeoptions })
                            console.log('MaritalStatusList: ' + this.state.MaritalStatusList)
                        } else if (element.attributename == "Residence Type") {
                            this.setState({ ResidenceTypeList: element.attributeoptions })
                            console.log('ResidenceTypeList: ' + this.state.ResidenceTypeList)
                        } else if (element.attributename == "Relationship") {
                            this.setState({ RelationList: element.attributeoptions })
                            console.log('RelationList: ' + this.state.RelationList)
                        } else if (element.attributename == "Relation Reference Name") {
                            this.setState({ RelationNameList: element.attributeoptions })
                            console.log('RelationNameList: ' + this.state.RelationNameList)
                        } else if (element.attributename == "Nominee Relation") {
                            this.setState({ nomineeRelationList: element.attributeoptions })
                            console.log('NomineeRelation: ' + this.state.nomineeRelationList)

                        } else if (element.attributename == "Nominee Gaurdian Relation") {
                            this.setState({ nomineeGuardianRelationList: element.attributeoptions })
                            console.log('NomineeGuardianList: ' + this.state.nomineeGuardianRelationList)
                        }
                    })

                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    setPersonalDetails(event) {
        console.log(this.state.Profession,
            this.state.IncomeRangeGroup,
            this.state.Education,
            this.state.ResidenceType,
            this.state.Account,
            this.state.MaritalStatus,
            this.state.Relation,
            this.state.RelationName)
        if (
            this.state.Profession === "" ||
            this.state.IncomeRangeGroup === "" ||
            this.state.Education === "" ||
            this.state.ResidenceType === "" ||
            this.state.Account === "" ||
            this.state.MaritalStatus === "" ||
            this.state.Relation === "" ||
            this.state.RelationName === ""
        ) {
            confirmAlert({
                message: "Please fill all the fields",
                buttons: [{
                    label: "Okay",
                    onClick: () => {
                        // window.location.reload()
                    }
                }]
            });
            return;
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
                        { "attributetype": "Profession", "attributetypeid": "LNT01", "attributeid": "A", "attributevalue": this.state.Profession },
                        { "attributetype": "Income Range Group", "attributetypeid": "LNT02", "attributeid": "A", "attributevalue": this.state.IncomeRangeGroup },
                        { "attributetype": "Education", "attributetypeid": "LNT03", "attributeid": "A", "attributevalue": this.state.Education },
                        { "attributetype": "Residence Type", "attributetypeid": "LNT04", "attributeid": "A", "attributevalue": this.state.ResidenceType },
                        { "attributetype": "Account", "attributetypeid": "LNT05", "attributeid": "A", "attributevalue": this.state.Account },
                        { "attributetype": "Marital Status", "attributetypeid": "LNT06", "attributeid": "B", "attributevalue": this.state.MaritalStatus },
                        { "attributetype": "Relationship", "attributetypeid": "LNT07", "attributeid": "B", "attributevalue": this.state.Relation },
                        { "attributetype": "Relation Reference Name", "attributetypeid": "LNT08", "attributeid": "A", "attributevalue": this.state.RelationName }
                    ]
                })
            }).then((Response) => Response.json())
                .then((resdata) => {
                    if (resdata.status === 'Success') {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [{
                                label: "Okay",
                                onClick: () => {
                                    window.location = "/lenderDetails"
                                }
                            }]
                        });
                        console.log(resdata);
                    } else {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [{
                                label: "Okay",
                                onClick: () => {
                                }
                            }]
                        });
                    }
                })
        }
    }
    getPersonalDetails = (event) => {
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
                        if (element.attributetype == "Profession") {
                            this.setState({ Profession: element.attributevalue })
                            console.log('Profession: ' + this.state.Profession)

                            this.setState({ professionID: element.attributeid })
                        } else if (element.attributetype == "Income Range Group") {
                            this.setState({ IncomeRangeGroup: element.attributevalue })
                            console.log('Income Range Group: ' + this.state.IncomeRangeGroup)

                            this.setState({ incomerangeID: element.attributeid })
                        } else if (element.attributetype == "Account") {
                            this.setState({ Account: element.attributevalue })
                            console.log('Account: ' + this.state.Account)

                            this.setState({ accountID: element.attributeid })
                        } else if (element.attributetype == "Education") {
                            this.setState({ Education: element.attributevalue })
                            console.log('Education: ' + this.state.Education)

                            this.setState({ educationID: element.attributeid })
                        } else if (element.attributetype == "Marital Status") {
                            this.setState({ MaritalStatus: element.attributevalue })
                            console.log('Marital Status: ' + this.state.MaritalStatus)

                            this.setState({ maritalstatusID: element.attributeid })
                        } else if (element.attributetype == "Residence Type") {
                            this.setState({ ResidenceType: element.attributevalue })
                            console.log('Residence Type: ' + this.state.ResidenceType)

                            this.setState({ residencetypeID: element.attributeid })
                        } else if (element.attributetype == "Relationship") {
                            this.setState({ Relation: element.attributevalue })
                            console.log('Relation: ' + this.state.Relation)

                            this.setState({ relationID: element.attributeid })
                        } else if (element.attributetype == "Relation Reference Name") {
                            this.setState({ RelationName: element.attributevalue })
                            console.log('Relation Name:' + this.state.RelationName)

                            this.setState({ relationNameID: element.attributeid })
                        } else if (element.attributetype == "Nominee Relation") {
                            this.setState({ nomineeRelation: element.attributevalue })
                            console.log('Nominee Relation:' + this.state.nomineeRelation)

                            this.setState({ nomRelationID: element.attributeid })
                        } else if (element.attributetype == "Nominee Gaurdian Relation") {
                            this.setState({ nomineeGuardianRelation: element.attributevalue })
                            console.log('Nominee Gaurdian Relation:' + this.state.nomineeGuardianRelation)

                            this.setState({ nomGudRelationID: element.attributeid })
                        }
                    })

                }
                else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    cancelPersonalDetails = () => {
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
                            onClick={this.setPersonalDetails} ><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Submit</span></button>
                        &nbsp;
                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", marginTop: "-8px" }}
                            onClick={this.cancelPersonalDetails}  ><span>Cancel</span></button>
                    </div>
                </div>
                {/* <div className='row'>
                    <div className='float-left'>
                        {this.state.getattributes == "" ? <p className="text-primary">Personal details are empty, Please add Personal details.</p> : null}
                    </div>
                </div> */}

                <div className='row' style={{ marginBottom: "17px", fontSize: "14px" }}>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="user" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Profession</p>
                        {/* {this.state.grpInfo.map((borrower, index) => {
                            return (
                                <div key={index} >
                                    {borrower.attributename == "Profession" ?
                                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.Profession}>
                                            {this.state.Profession ? <option>{this.state.Profession}</option> : <option defaultValue>----Please Select----</option>}
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
                        } */}

                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.Profession} value={this.state.Profession || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.ProfessionList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>

                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Residence Type</p>

                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.ResidenceType} value={this.state.ResidenceType || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.ResidenceTypeList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }}>
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
                                    <option key={index} style={{ color: "GrayText" }}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Income Range Group</p>

                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.IncomeRangeGroup} value={this.state.IncomeRangeGroup || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.IncomeRangeList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <div className='row' style={{ marginBottom: "17px", fontSize: "14px" }}>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Marital Status</p>

                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.MaritalStatus} value={this.state.MaritalStatus || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.MaritalStatusList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }}>
                                        {list.attributevalue}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Account</p>

                        <select className="form-select" style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)" }} onChange={this.Account} value={this.state.Account || ''}>
                            <option value="" disabled>----Please Select----</option>
                            {this.state.AccountList.map((list, index) => {
                                return (
                                    <option key={index} style={{ color: "GrayText" }}>
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
                    <div className='col-sm-3 col-md-3 col-lg-3'>
                        <p htmlFor="pan" className="label" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Relation Reference Name</p>
                        {/* {this.state.grpInfo.map((borrower, index) => {
                            return (
                                <div key={index} >
                                    {borrower.attributename == "Relation Name" ?
                                        <input type="text" onChange={this.RelationName} className="form-control"
                                            style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }} placeholder='Enter Relation Name' value={this.state.RelationName} />

                                        : null}
                                </div>
                            )
                        })
                        } */}
                        <input type="text" onChange={this.RelationName} className="form-control"
                            style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }} placeholder='Enter Relation Name' value={this.state.RelationName} />
                    </div>
                </div>
            </div>
        )
    }
}

export default EditLndPersonalDetails