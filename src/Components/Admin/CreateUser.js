import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import SimpleReactValidator from 'simple-react-validator';
import AdminSidebar from './AdminSidebar';
import $ from 'jquery';
import './CreateUser.css';
import { withTranslation } from 'react-i18next';
import { VscTypeHierarchySub } from 'react-icons/vsc';
import { FaAngleLeft, FaEject } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import { confirmAlert } from "react-confirm-alert";
import batch from '../assets/batch.png';
import Select from 'react-select';
import { BsInfoCircle } from "react-icons/bs";

var today;
var roleIDs = [];
class CreateUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pannumber: '',
            userid: " ",
            usergroup: 6,
            roleid: 1,
            emptypeid: 0,
            empstatusid: 0,
            companyid: 0,
            firstname: " ",
            middlename: " ",
            lastname: " ",
            gender: " ",
            dob: "",
            mobilenumber: " ",
            email: " ",
            maritalstatus: 1,
            residenceaddress: " ",
            district: " ",
            state1: " ",
            pincode: "",
            city: "",

            stateList: [],
            districtList: [],
            roleList: [],
            groupRolesList: [],
            additionaldata: {
                "key1": "xxxxxxxxxx",
                "key2": "yyyyyyyy",
                "key3": 1010
            },

            sysEmpTypes: [],
            sysEmpstatus: [],
            sompanyName: [],
            dobValid: false,

            officeList: [],
            staffList: [],
            officeid: '',
            officeLevel: '',
            officeId: '',
            secondSelect: false,
            thirdSelect: false,
            fourthSelect: false,
            officeListFirst: [],
            officeListSecond: [],
            officeListThird: [],
            officeidForList1: '',
            stafflevel: '',
            officelevel: '',
            officeListCalled: false,
            officeHieList: [],
            selectedOptions: [],

            invalidMnum: false,
            invalidFirstName: false,
            invalidLastName: false,
            invalidEmail: false,
            invalidCity: false,
            invalidPan: false
        }
        this.firstname = this.firstname.bind(this);
        this.middlename = this.middlename.bind(this);
        this.lastname = this.lastname.bind(this);
        this.gender = this.gender.bind(this);
        this.dob = this.dob.bind(this);
        this.mobilenumber = this.mobilenumber.bind(this);
        this.email = this.email.bind(this);
        this.maritalstatus = this.maritalstatus.bind(this);
        this.residenceaddress = this.residenceaddress.bind(this);
        this.district = this.district.bind(this);
        this.state1 = this.state1.bind(this);
        this.statecode = this.statecode.bind(this);
        this.pincode = this.pincode.bind(this);
        this.createUser = this.createUser.bind(this);
        this.pannumber = this.pannumber.bind(this);
        this.validator = new SimpleReactValidator();
        this.allRoles = this.allRoles.bind(this);
        this.groupName = this.groupName.bind(this);
        this.selectRef = React.createRef();
    }
    componentDidMount() {
        this.allRoles()
        this.getStateList();
        this.getCompanyname()
        this.getSysEmpType()
        this.getSysEmpStatus()
        $("#createUserBtn").prop('disabled', true)
        // this.getOfficeList()
        // .then(responseData => {
        //     // Handle successful response
        //     console.log("Response data:", responseData);
        //     this.setState({ officeListFirst: responseData })
        // })
        //     .catch(error => {
        //         // Handle error
        //         console.error("Error:", error);
        //     });


    }

    groupName = (event) => {
        // this.setState({ roleid: event.target.value })
        // this.state.roleList
        //     .filter((e) => e.roleid == event.target.value)
        //     .map((grp, index) => {
        //         this.setState({ usergroup: grp.usergroupid })
        //     })
        console.log(event.target.value);
        this.setState({ usergroup: event.target.value }, () => {
            console.log(this.state.usergroup)
        })
        console.log(this.state.usergroup)
        this.groupRoles(event.target.value)
    }
    groupRoles = (groupID) => {
        console.log(groupID)
        fetch(BASEURL + '/usrmgmt/usergetallroles?groupId=' + groupID, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'Success' || 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ groupRolesList: resdata.msgdata })
                }
                else {
                    confirmAlert({
                        message: resdata.msgdata,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    // window.location.reload();
                                },
                            },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    roleNames = (selected) => {
        // console.log(event.target.value)
        // this.setState({ roleid: event.target.value }, () => {
        //     console.log(this.state.roleid)
        // })
        // console.log(this.state.roleid)
        const selectedValues = selected.map(option => option.value);
        console.log(selectedValues)
        const integerArray = selectedValues.map(str => parseInt(str, 10));
        console.log(integerArray);
        roleIDs = integerArray;
        this.setState({
            selectedOptions: selected,
        }, () => {
            console.log("Selected:", this.state.selectedOptions);
        });
    }
    pannumber(event) {
        var regex = /[A-Za-z]{3}[Pp]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]{1}$/;
        var eventInput = event.target.value;
        const {
            invalidMnum,
            invalidFirstName,
            invalidLastName,
            invalidEmail,
            invalidCity,
            invalidPan
        } = this.state;
        if (regex.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidPan: false })
            this.setState({ pannumber: event.target.value.toUpperCase().trim() })
            $("#createUserBtn").prop('disabled', false)
        } else {
            this.setState({ invalidPan: true })
            $("#createUserBtn").prop('disabled', true)
        }
    }

    firstname(event) {
        var username = event.target.value;
        var isValid = true;
        this.setState({ firstname: username });
        for (var i = 0; i < username.length; i++) {
            var charCode = username.charCodeAt(i);

            if (!(charCode >= 65 && charCode <= 90) && // A-Z
                !(charCode >= 97 && charCode <= 122) && // a-z
                !(charCode >= 48 && charCode <= 57) && // 0-9
                charCode !== 32) { // space
                isValid = false;
                break;
            }
        }
        if (isValid) {
            this.setState({
                firstname: username,
                invalidFirstName: false
            });
        } else {
            this.setState({
                invalidFirstName: true
            });
        }
    }
    middlename(event) {
        this.setState({ middlename: event.target.value })
    }
    lastname(event) {
        var username = event.target.value;
        var isValid = true;
        this.setState({ lastname: username });
        for (var i = 0; i < username.length; i++) {
            var charCode = username.charCodeAt(i);

            if (!(charCode >= 65 && charCode <= 90) && // A-Z
                !(charCode >= 97 && charCode <= 122) && // a-z
                !(charCode >= 48 && charCode <= 57) && // 0-9
                charCode !== 32) { // space
                isValid = false;
                break;
            }
        }
        if (isValid) {
            this.setState({
                lastname: username,
                invalidLastName: false
            });
        } else {
            this.setState({
                invalidLastName: true
            });
        }
    }
    gender(event) {
        this.setState({ gender: event.target.value })
    }
    dob = (event) => {
        console.log(event.target.value)
        const enteredDateOfBirth = event.target.value;
        const today = new Date();
        const enteredDate = new Date(enteredDateOfBirth);

        // Calculate age
        const age = today.getFullYear() - enteredDate.getFullYear();
        const monthDiff = today.getMonth() - enteredDate.getMonth();

        // If the birth month has not occurred yet this year, or if the birth month is in the future
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < enteredDate.getDate())) {
            var originalDate = enteredDateOfBirth;
            var [year, month, day] = originalDate.split("-");
            var formattedDate = `${day}-${month}-${year}`;
            console.log(formattedDate);
            this.setState({ dob: formattedDate, age: age - 1 });
        } else {
            var originalDate = enteredDateOfBirth;
            var [year, month, day] = originalDate.split("-");
            var formattedDate = `${day}-${month}-${year}`;
            console.log(formattedDate);
            this.setState({ dob: formattedDate, age });
        }

        // Check if the age is greater than or equal to 18
        if (age < 18) {
            this.setState({ dobValid: true })
            console.log("You must be 18 years or older.");
        } else {
            this.setState({ dobValid: false })
            console.log("Executed success.")
        }
        const inputDate = event.target.value;
        const fullyear = new Date(inputDate).getFullYear();

        // Check if the year has 4 digits
        if (fullyear.toString().length > 4) {
            // If the year is invalid, clear the input and show an error message (optional)
            confirmAlert({
                message: "Please enter a valid date with a 4-digit year.",
                buttons: [
                    {
                        label: "OK",
                        onClick: () => {
                            $(this.selectRef.current).val('');
                        },
                    },
                ],
                closeOnClickOutside: false,
            });
        } else {
            // If the year is valid, update the state with the new date
        }
    }
    mobilenumber(event) {
        this.setState({ mobilenumber: event.target.value })
        var eventInput = event.target.value;
        var mobileValid = /^[6-9]\d{9}$/;
        if (mobileValid.test(eventInput)) {
            console.log("passed");
            this.setState({
                invalidMnum: false,
                mobilenumber: eventInput
            });
            $("#createUserBtn").prop('disabled', false)
        } else {
            this.setState({ invalidMnum: true });
            $("#createUserBtn").prop('disabled', true);
        }
    }
    email(event) {
        this.setState({ email: event.target.value })
        var emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var eventInput = event.target.value;
        if (emailCheck.test(eventInput)) {
            console.log("passed");
            this.setState({
                invalidEmail: false,
                email: event.target.value
            })
        } else {
            console.log('failed');
            this.setState({ invalidEmail: true })
        }
    }
    maritalstatus(event) {
        this.setState({ maritalstatus: event.target.value })
    }
    residenceaddress(event) {
        this.setState({ residenceaddress: event.target.value })
    }
    district(event) {
        this.setState({ district: event.target.value })
    }
    state1(event) {
        this.setState({ state1: event.target.value })

        this.state.stateList
            .filter((e) => e.statecode == event.target.value)
            .map(() => {
                this.getDistrictList(event.target.value);
            })
    }
    statecode(event) {
        this.setState({ statecode: event.target.value })
    }
    pincode(event) {
        this.setState({ pincode: event.target.value })
    }
    city = (event) => {
        var username = event.target.value;
        var isValid = true;
        this.setState({ city: username });
        for (var i = 0; i < username.length; i++) {
            var charCode = username.charCodeAt(i);

            if (!(charCode >= 65 && charCode <= 90) && // A-Z
                !(charCode >= 97 && charCode <= 122) && // a-z
                !(charCode >= 48 && charCode <= 57) && // 0-9
                charCode !== 32) { // space
                isValid = false;
                break;
            }
        }
        if (isValid) {
            this.setState({
                city: username,
                invalidCity: false
            });
        } else {
            this.setState({
                invalidCity: true
            });
        }
    }
    companyname = (event) => {
        this.setState({ companyid: event.target.value })
        console.log(this.state.companyid)
    }
    sysEmpType = (event) => {
        this.setState({ emptypeid: event.target.value })
        console.log(this.state.emptypeid)
    }
    sysEmpStatus = (event) => {
        this.setState({ empstatusid: event.target.value })
        console.log(this.state.empstatusid)
    }
    getCompanyname = () => {
        fetch(BASEURL + '/usrmgmt/getallcompanies', {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                console.log(resdata.status);
                if (resdata.message == 'Success') {
                    console.log(resdata);
                    this.setState({ sompanyName: resdata.msgdata })
                    console.log(this.state.sompanyName)
                }
                else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getSysEmpType = () => {
        fetch(BASEURL + '/usrmgmt/getallsystememptypes', {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.message == 'Success') {
                    console.log(resdata);
                    this.setState({ sysEmpTypes: resdata.msgdata })
                }
                else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getSysEmpStatus = () => {
        fetch(BASEURL + '/usrmgmt/getallsystemempstatuses', {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.message == 'Success') {
                    console.log(resdata);
                    this.setState({ sysEmpstatus: resdata.msgdata })
                }
                else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    allGroups(id, groupName) {
        console.log(id);
        console.log(groupName);
        sessionStorage.setItem("id", id);
        sessionStorage.setItem("roleName", groupName);
    }
    allRoles() {
        fetch(BASEURL + '/usrmgmt/usergetallroles', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    console.log(resdata);

                    const uniqueGroups = resdata.msgdata.filter((item, index, self) =>
                        index === self.findIndex((t) => (
                            t.usergroupid === item.usergroupid && t.usergroupname === item.usergroupname
                        ))
                    );

                    console.log(uniqueGroups);
                    this.setState({ roleList: uniqueGroups })
                }
                else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getStateList(event) {
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
                    console.log(resdata);
                    this.setState({ stateList: resdata.msgdata })
                    this.state.stateList.map((statelist) => {
                        return statelist.statename;
                    })
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
                                        // window.location.reload();
                                    },
                                },
                            ],
                        });
                    }
                }
            })
    }
    getDistrictList(statecod) {
        this.setState({ state1: statecod })
        fetch(BASEURL + '/usrmgmt/getdistrictlist?statecode=' + statecod, {
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
    createUser() {
        if (this.state.dobValid == true) {
            confirmAlert({
                message: "Customer must be equal to or older than 18 years",
                buttons: [
                    {
                        label: "OK",
                        onClick: () => {
                            // window.location.reload();
                        },
                    },
                ],
            });
        }
        var roleIDArray = roleIDs;
        console.log(roleIDArray)
        fetch(BASEURL + '/usrmgmt/registersystemuser', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                userid: this.state.firstname,
                usergroup: parseInt(this.state.usergroup),
                roleid: roleIDArray,
                emptypeid: parseInt(this.state.emptypeid),
                empstatusid: parseInt(this.state.empstatusid),
                companyid: parseInt(this.state.companyid),
                firstname: this.state.firstname,
                middlename: this.state.middlename,
                lastname: this.state.lastname,
                gender: this.state.gender,
                dob: this.state.dob,
                mobilenumber: this.state.mobilenumber,
                email: this.state.email,
                maritalstatus: parseInt(this.state.maritalstatus),
                residenceaddress: this.state.residenceaddress,
                district: this.state.districtList.find((dist) => dist.distid === this.state.district).distname,
                state: this.state.stateList.find((state) => state.statecode === this.state.state1).statename,
                city: this.state.city,
                pincode: parseInt(this.state.pincode),
                pan: this.state.pannumber,

                officeid: this.state.officeid,
                officelevel: this.state.officelevel,
                stafflevel: this.state.stafflevel

            })
        })
            .then(response => {
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    window.location = "/userManagement"
                                },
                            },
                        ],
                    });
                } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    // window.location.reload();
                                },
                            },
                        ],
                    });
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    handleChange() {
        $('.text').toggle();
        $("#Pinfo").toggle();
    }
    cancelCreate = () => {
        window.location.reload();
    }

    test = (i) => {
        this.setState.roleid = this.state.roleList[i].roleid;
        console.log(this.state.roleid)
    }
    officeList = () => {
        // Check if the API has already been called
        if (!this.state.officeListCalled) {
            this.getOfficeList()
                .then(responseData => {
                    console.log("Response data:", responseData);
                    this.setState({
                        officeListFirst: responseData,
                        officeListCalled: true // Set the flag to true after calling the API
                    });
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    }

    officeList1 = (e) => {
        const officeId = e.target.value;
        this.setState({
            officeid: officeId,
            secondSelect: officeId !== '',
            officeidForList1: officeId
        });
        document.getElementById('list2').style.display = 'none';
        document.getElementById('list3').style.display = 'none';
        document.getElementById('list4').style.display = 'none';

        this.setState({
            officeListSecond: [],
            officeListThird: [],
        });

        if (officeId !== '') {
            document.getElementById('list2').style.display = 'block';
            this.getOfficeList(officeId)
                .then(responseData => {
                    console.log("Response data:", responseData);
                    this.setState({ officeListSecond: responseData })
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }

        console.log('executed');
    }


    officeList2 = (e) => {
        const officeId = e.target.value;
        this.setState({
            officeid: officeId,
            thirdSelect: officeId !== ''
        });

        document.getElementById('list3').style.display = 'none';
        document.getElementById('list4').style.display = 'none';

        this.setState({
            officeListThird: [],
        });

        if (officeId === this.state.officeidForList1) {
            console.log("Selected office ID in officeList2 is the same as in officeList1");
            document.getElementById('list4').style.display = 'block';
            const matchingOffice = this.state.officeListSecond.find(element => element.officeid === officeId);

            if (matchingOffice) {
                console.log(matchingOffice.officeid, matchingOffice.officelevel);

                // Update the state with the selected office details
                this.setState({
                    officeId: matchingOffice.officeid,
                    officeLevel: matchingOffice.officelevel,
                }, () => {
                    this.getStaffList(this.state.officeId, this.state.officeLevel);
                });
            } else {
                console.log("Selected office not found in the list.");
            }
        } else {
            console.log("Selected office ID in officeList2 is different from officeList1");
            document.getElementById('list3').style.display = 'block';
            this.getOfficeList(officeId)
                .then(responseData => {
                    // Handle successful response
                    console.log("Response data:", responseData);
                    this.setState({ officeListThird: responseData })
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }

        console.log(this.state.officeid);

        console.log('executed');
    }

    officeList3 = (e) => {
        const selectedValue = e.target.value;
        console.log("Selected value:", selectedValue);
        document.getElementById('list4').style.display = 'block';

        // Filter the office list to find the matching office
        const matchingOffice = this.state.officeListThird.find(element => element.officeid === selectedValue);

        if (matchingOffice) {
            console.log(matchingOffice.officeid, matchingOffice.officelevel);
            // Update the state with the selected office details
            this.setState({
                officeId: matchingOffice.officeid,
                officeLevel: matchingOffice.officelevel,
            }, () => {
                this.getStaffList(this.state.officeId, this.state.officeLevel);
            });
        } else {
            console.log("Selected office not found in the list.");
        }
    }

    getOfficeList = (officeId) => {
        return new Promise((resolve, reject) => {
            let officeID = "officeid=" + officeId;
            let params;

            if (officeId !== undefined) {
                params = officeID;
            }
            console.log('Executing getOfficeList');
            console.log(params);
            fetch(BASEURL + '/usrmgmt/getofficelist?' + `${officeId !== undefined ? params : ''}`, {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
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
                        console.log('Inside office list');
                        this.setState({ officeList: resdata.msgdata });
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

    getStaffList = (officeId, officeLevel) => {
        console.log(officeId, officeLevel)
        const body = JSON.stringify({
            officelevel: officeLevel,
            officeid: officeId,
        });

        fetch(BASEURL + '/usrmgmt/getstaffhierarchy', {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: body
        })
            .then((response) => {
                return response.json();
            })
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ staffList: resdata.msgdata });
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error);
                alert("Error: " + error.message);
            });
    }
    staffList1 = (e) => {
        const staffLevel = e.target.value;
        const { officeid, officelevel } = this.state.staffList; // Destructuring officeid and officelevel from staffList

        console.log("Selected staff level:", staffLevel);
        console.log("Office ID:", officeid);
        console.log("Office Level:", officelevel);

        this.setState({
            officeid: officeid,
            officelevel: officelevel,
            stafflevel: staffLevel
        }, () => {
            console.log(this.state.stafflevel, this.state.officeid, this.state.officelevel)
        });

    }
    getOffHier = () => {
        fetch(BASEURL + '/usrmgmt/getofficehierarchy?type=1', {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ officeHieList: resdata.msgdata });
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error);
                alert("Error: " + error.message);
            });
    }
    officehie = () => {
        $("#OfficeHierarchyModal").click()
        this.getOffHier()
    }
    render() {
        const { t } = this.props
        const { officeList, secondSelect, thirdSelect, selectedOptions } = this.state;
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
        const options = this.state.groupRolesList.map((roles, index) => ({
            value: `${roles.roleid}`,
            label: `${roles.roledesc}`,
        }));
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
                <AdminSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/userManagement">User Management</Link> / Create System User</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/userManagement"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className="card" style={{ cursor: "default", width: "92%", marginLeft: "45px", marginTop: "-10px", overflow: "visible" }}>
                        <div className="card-header border-1 bg-white">
                            <div className='row' style={{ paddingLeft: "3px" }}>
                                <div className='col-4' id='headingRef'>
                                    <div className="two__image" style={{ paddingLeft: "10px" }}>
                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Create System User</p>
                                    </div>
                                </div>
                                <div className='col' style={{ textAlign: "end" }}>
                                    <p style={{ fontSize: "16px", color: "#0079BF", cursor: "pointer", fontWeight: "bold" }} onClick={this.officehie}><FaEject />&nbsp;Office Hierarchy</p>
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('First Name *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('Enter First Name')} onChange={this.firstname}
                                    />
                                    {(this.state.invalidFirstName) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Please enter a valid name.</span> : ''}
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Middle Name')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('Enter Middle Name')} onChange={this.middlename}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Last Name *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('Enter Last Name')} onChange={this.lastname}
                                    />
                                    {(this.state.invalidLastName) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Please enter a valid name.</span> : ''}
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Date Of Birth *')}</p>
                                    <input type="date" ref={this.selectRef} className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('DD-MM-YYYY')} onChange={this.dob}
                                    />
                                    {(this.state.dobValid) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Please enter a valid date of birth.</span> : ''}
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Email ID *')}</p>
                                    <input type="email" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('Enter Email ID')} onChange={this.email} />
                                    {(this.state.invalidEmail) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Please enter a valid email ID.</span> : ''}
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Contact Number *')}</p>
                                    <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('Enter Mobile Number')} onChange={this.mobilenumber}
                                    />
                                    {(this.state.invalidMnum) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Please enter a valid contact number.</span> : ''}
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Gender *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.gender} >
                                        <option defaultValue>Select Gender</option>
                                        <option value="M">{t('male')}</option>
                                        <option value="F">{t('female')}</option>
                                        <option value="O">{t('Others')}</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Marital Status *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.maritalstatus}>
                                        <option defaultValue>Select</option>
                                        <option value="1">{t('Married')}</option>
                                        <option value="0">{t('Single')}</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Address *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputCity" placeholder={t('Enter Address')} onChange={this.residenceaddress}
                                    />
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('State *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onClick={this.state1} >
                                        <option defaultValue>Select State</option>
                                        {this.state.stateList.map((states, index) => (
                                            <option key={index} value={states.statecode} style={{ color: "GrayText" }}>{states.statename} </option>
                                        ))
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('District *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.district}>
                                        <option defaultValue>Select District</option>
                                        {this.state.districtList.map((districts, index) => {
                                            return (
                                                <option key={index} value={districts.distid} style={{ color: "GrayText" }}>{districts.distname}</option>
                                            )
                                        })
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('City *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputZip" placeholder={t('Enter City')} onChange={this.city}
                                    />
                                    {(this.state.invalidCity) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Please enter a valid city.</span> : ''}
                                </div>

                            </div>

                            <div className="form-row" style={{ marginTop: "-10px", marginBottom: `${this.state.invalidPan ? `10px` : ''}` }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('PIN Code *')}</p>
                                    <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputZip" placeholder={t('Enter PIN Code')} onChange={this.pincode}
                                        onInput={(e) => {
                                            e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                        }}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('PAN *')}</p>
                                    <input type="text" className="form-control pannumber" minLength={10}
                                        maxLength={10} autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px", textTransform: "uppercase" }}
                                        id="inputZip" placeholder={t('Enter PAN')} onChange={this.pannumber}
                                    />
                                    {(this.state.invalidPan) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid PAN</span> : ''}
                                </div>
                                <div className="col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Group Name *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.groupName}>
                                        <option defaultValue>Select Group Name</option>
                                        {
                                            this.state.roleList.map((role, index) => (
                                                <option id='optionVal' key={index} value={role.usergroupid}>{role.usergroupdesc}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", marginBottom: "0px", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Role Names *')}</p>
                                    {/* <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.roleNames} >
                                        <option defaultValue>Select Role Name</option>
                                        {
                                            this.state.groupRolesList.map((roles, index) => (
                                                <option key={index} value={roles.roleid}>{roles.roledesc}</option>
                                            ))
                                        }
                                    </select> */}
                                    <Select
                                        isMulti
                                        value={selectedOptions}
                                        // onFocus={this.StaffHier1}
                                        onChange={this.roleNames}
                                        options={options}
                                        style={{ marginTop: "-16px" }}
                                    // ref={this.selectRef}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Company Name *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.companyname} >
                                        <option defaultValue>Company name</option>
                                        {
                                            this.state.sompanyName.map((attributeoptions, index) => {
                                                return (
                                                    <option key={index} style={{ color: "GrayText" }} value={attributeoptions.companyId}>{attributeoptions.companyName} </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('System Employee Types *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.sysEmpType}>
                                        <option defaultValue>System Employee Types</option>

                                        {
                                            this.state.sysEmpTypes.map((attributeoptions, index) => {
                                                return (
                                                    <option key={index} style={{ color: "GrayText" }} value={attributeoptions.typeId}>{attributeoptions.employmentTypeName} </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('System Employee Status *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.sysEmpStatus}>
                                        <option defaultValue>System Employee Status</option>
                                        {
                                            this.state.sysEmpstatus.map((attributeoptions, index) => {
                                                return (
                                                    <option key={index} style={{ color: "GrayText" }} value={attributeoptions.typeId}>{attributeoptions.employmentStatusName} </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                {/* Hierarchy section office list */}
                                <div className="form-group col-md-4" id="list1">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Select Zone *')}</p>
                                    <select id="" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onClick={this.officeList} onChange={this.officeList1}>
                                        <option defaultValue>Select</option>
                                        {this.state.officeListFirst.map((ele, index) => (
                                            <option key={index} style={{ color: "GrayText" }} value={ele.officeid}>{ele.officename}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group col-md-4" id="list2" style={{ display: "none" }}>
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Select Region *')}</p>
                                    <select id="" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.officeList2}
                                        disabled={!secondSelect}>
                                        <option defaultValue>Select</option>
                                        {this.state.officeListSecond.map((ele, index) => (
                                            <option key={index} style={{ color: "GrayText" }} value={ele.officeid}>{ele.officename}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4" id="list3" style={{ display: "none" }}>
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Select Branch *')}</p>
                                    <select id="" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.officeList3}
                                        disabled={!thirdSelect}>
                                        <option defaultValue>Select</option>
                                        {this.state.officeListThird.map((ele, index) => (
                                            <option key={index} style={{ color: "GrayText" }} value={ele.officeid}>{ele.officename}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* staff list */}
                                <div className="form-group col-md-4" id="list4" style={{ display: "none" }}>
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Select Staff Level *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.staffList1}>
                                        <option defaultValue>Select</option>
                                        {this.state.staffList.staffhierachy && this.state.staffList.staffhierachy.map((ele, index) => (
                                            <option key={index} style={{ color: "GrayText" }} value={ele.stafflevel}>{ele.hierarchyname}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <hr style={{ marginTop: "-2px" }} />

                            <div className="form-row" style={{ textAlign: "center" }}>
                                <div className="form-group col">
                                    <button type="button" id='createUserBtn' className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                        onClick={this.createUser}  >Create</button>
                                    <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                        onClick={this.cancelCreate}>{t('Cancel')}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="button" id="OfficeHierarchyModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal123" style={{ display: "none" }}>
                        Office Hierarchy Modal
                    </button>
                    <div class="modal fade" id="exampleModal123" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog  modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Office Hierarchy</p>
                                            <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                            <div className='row'>
                                                <div className='col'>
                                                    <table className='table table-bordered' style={{ fontSize: "14px" }}>
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>Level</th>
                                                                <th scope="col" style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>Created By</th>
                                                                <th scope="col" style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>Created On</th>
                                                                <th scope="col" style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>Office Type</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.officeHieList.map((list, index) => {
                                                                return (
                                                                    <>
                                                                        <tr>
                                                                            <td scope='row' style={{ color: "rgba(5,54,82,1)" }}>{list.level}</td>
                                                                            <td scope='row' style={{ color: "rgba(5,54,82,1)" }}>{list.createdby}</td>
                                                                            <td scope='row' style={{ color: "rgba(5,54,82,1)" }}>{list.createdon}</td>
                                                                            <td scope='row' style={{ color: "rgba(5,54,82,1)" }}>{list.officetype}</td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                            })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" id='disagree' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }}>Close</button>
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

export default withTranslation()(CreateUser)