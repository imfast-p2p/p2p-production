import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaRegSave, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit, FaFolderPlus, FaCalendar } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';
import Multiselect from 'multiselect-react-dropdown';

import openIt from '../../assets/AdminImg/openit.png'
import us from '../../assets/AdminImg/pro.png';
import editRole from '../../assets/editRole.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import pic3 from '../../assets/AdminImg/picture.png';

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import * as FaIcons from "react-icons/fa"
import Select from 'react-select';


var permArray = [];
var body2;

export class CreateOffice extends Component {

    constructor(props) {
        super(props)

        this.state = {
            district: " ",
            state1: " ",
            stateList: [],
            districtList: [],
            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",

            offset2: 0,
            currentPage2: 0,
            pageCount2: "",
            produList: [],
            orgtableData2: [],

            officeHieList: [],
            officeList: [],

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
            officelevel: '',
            officeListCalled: false,
            officeHieList: [],
            defaultOffice: '',
            parenthier: '',
            offname: '',
            parentid: '',
            selectedOfficelevel: '',
            districtcode: '',
            districtname: '',
            officeHieCalled: false,
            statecode: '',

            createOffHie: [],
            createStaffHie: [],
            createOffLevel: "",
            createStaffLevel: "",
            createOffType: "",
            createStaffType: "",
            createOfficeHierarchy: [],
            officeLevelHie1: '1',
            officelevel1: '',
            staffLevelHie1: '1',

            selectedOptions: [],
            staffHieCalled: false,
            staffHieList: [],
            mapofficelevel: '',
            selectedstaff: [],
            officestaffmap: {},
            officestaffmap1: [],
            mapofftype: '',
            officestaffmapdisp: [],
            stafftypearr: [],
            isHierarchyexists: true,
            isStaffHierarchyexists: true,
            initialOfficeHieList: [],
            addoffHierBtn: true,
            addStaffhierBtn: true,
            addoffstaffMapBtn: true,
            submitOffHierBtn: true,
            submitStaffHierBtn: true,
            submitMapBtn: true,
        }
        this.district = this.district.bind(this);
        this.state1 = this.state1.bind(this);
        this.state2 = this.state2.bind(this);
        this.officeName = this.officeName.bind(this);
        this.selectRef = React.createRef();
        this.selectRef1 = React.createRef();
        this.selectRef2 = React.createRef();
        this.selectRef3 = React.createRef();
        this.selectRef4 = React.createRef();

    }
    componentDidMount() {

    }
    officeName(e) {
        const officename = e.target.value
        this.setState({ offname: officename })
    }
    handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        const value = isChecked ? 1 : 0;

        this.setState({
            defaultOffice: value
        });
    };
    state1() {
        this.getStateList();
    }
    state2(event) {
        const stateCode = event.target.value;
        this.setState({ state1: stateCode },
            () => {
                console.log("State Code:", stateCode);
            });
        const selectedState = this.state.stateList.find(e => e.statecode === stateCode);

        if (selectedState) {
            this.getDistrictList(stateCode);
        }
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
    district(event) {
        const selectedValue = event.target.value
        const [districtCode, districtName] = selectedValue.split(',');
        this.setState({
            districtcode: districtCode,
            districtname: districtName
        }, () => {
            console.log(this.state.districtcode, this.state.districtname)
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
    getStaffHier = () => {
        return new Promise((resolve, reject) => {
            fetch(BASEURL + '/usrmgmt/getofficehierarchy?type=2', {
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
                    if (resdata.status === 'Success') {
                        resolve(resdata.msgdata);
                        this.setState({ isStaffHierarchyexists: true })
                    } else {
                        reject(new Error("Issue: " + resdata.message));
                        this.setState({ isStaffHierarchyexists: false })
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    StaffHier1 = () => {
        console.log("inside staff hier")
        if (!this.state.staffHieCalled) {
            this.getStaffHier()
                .then(responseData => {
                    console.log("Response data:", responseData);
                    this.setState({
                        staffHieList: responseData,
                        staffHieCalled: true,

                    });
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    }

    OffHier1 = () => {
        if (!this.state.officeHieCalled) {
            this.getOffHier()
                .then(responseData => {
                    console.log("Response data:", responseData);
                    this.setState({
                        initialOfficeHieList: responseData,
                        officeHieList: responseData,
                        officeHieCalled: true,

                    });
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    }
    getOffHier = () => {
        return new Promise((resolve, reject) => {
            fetch(BASEURL + '/usrmgmt/getofficehierarchy?type=1', {
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
                    if (resdata.status === 'Success') {
                        this.setState({ isHierarchyexists: true })
                        resolve(resdata.msgdata);
                    } else {
                        reject(new Error("Issue: " + resdata.message));
                        this.setState({ isHierarchyexists: false })
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    officehie = (e) => {
        const selectedOfficeLevel = e.target.value;
        document.getElementById('list1').style.display = 'none';
        document.getElementById('list2').style.display = 'none';

        this.setState({
            officeid: '',
            officeLevel: '',
        });
        // Update the selected office level in the state
        this.setState({
            selectedOfficelevel: selectedOfficeLevel
        }, () => {
            // Check if the selected office level is the highest among the office hierarchy levels
            const maxOfficeLevel = Math.max(...this.state.officeHieList.map(item => parseInt(item.level)));

            if (!isNaN(maxOfficeLevel)) { // Check if maxOfficeLevel is a valid number
                console.log("Max Office Level:", maxOfficeLevel);
                console.log("Selected Office Level:", selectedOfficeLevel);

                if (selectedOfficeLevel < maxOfficeLevel) {
                    console.log("inside")
                    document.getElementById('list1').style.display = 'block';

                    $(this.selectRef.current).val('');
                } else {
                    console.log("Selected office level is the highest.");
                    document.getElementById('list1').style.display = 'none';
                }
            } else {
                console.log("Error: Invalid office hierarchy levels.");
            }
        });
    }
    officeList = () => {
        if (!this.state.officeListCalled) {
            this.getOfficeList()
                .then(responseData => {
                    console.log("Response data:", responseData);
                    this.setState({
                        officeListFirst: responseData,
                        officeListCalled: true
                    });
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    }
    officeList1 = (e) => {
        const selectedValue = e.target.value;
        const [officeId, officeLevel, parentId] = selectedValue.split(',');

        this.setState({
            officeid: officeId,
            officeLevel: officeLevel,
            secondSelect: officeId !== '',
            officeidForList1: officeId,
            parentid: officeId,
            parenthier: '/' + officeId
        });
        document.getElementById('list2').style.display = 'none';
        document.getElementById('list3').style.display = 'none';

        this.setState({
            officeListSecond: [],
            officeListThird: [],
        });

        if (officeId !== '') {

            console.log(this.state.selectedOfficelevel)
            console.log(officeLevel)
            if (parseInt(this.state.selectedOfficelevel) === parseInt(officeLevel) - 1) {
                console.log("new creation office level and selcted office level are same")
            }
            else {
                document.getElementById('list2').style.display = 'block';
                console.log("not same")
                this.getOfficeList(officeId)
                    .then(responseData => {
                        console.log("Response data:", responseData);
                        // Filter out the data with the given office ID
                        const filteredData = responseData.filter(item => item.officeid !== officeId);
                        // Update the state with the filtered data
                        this.setState({ officeListSecond: filteredData });
                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });
            }

        }
        console.log('executed');
    }
    officeList2 = (e) => {
        const selectedValue = e.target.value;
        const [officeId, officeLevel, parentId, parenthierarchy] = selectedValue.split(',');
        console.log(parenthierarchy)
        this.setState({
            officeid: officeId,
            officeLevel: officeLevel,
            thirdSelect: officeId !== '',
            parentid: officeId,
            parenthier: parenthierarchy + '/' + officeId
        });

        document.getElementById('list3').style.display = 'none';
        this.setState({
            officeListThird: [],
        });

        if (officeId === this.state.officeidForList1) {
            console.log("Selected office ID in officeList2 is the same as in officeList1");
            const matchingOffice = this.state.officeListSecond.find(element => element.officeid === officeId);

            if (matchingOffice) {
                console.log(matchingOffice.officeid, matchingOffice.officelevel);
                // Update the state with the selected office details
                this.setState({
                    officeId: matchingOffice.officeid,
                    officeLevel: matchingOffice.officelevel,
                }, () => {
                    // this.getStaffList(this.state.officeId, this.state.officeLevel);
                });
            } else {
                console.log("Selected office not found in the list.");
            }
        } else {

            console.log("Selected office ID in officeList2 is different from officeList1");
            console.log(this.state.selectedOfficelevel)
            console.log(officeLevel)
            if (parseInt(this.state.selectedOfficelevel) === parseInt(officeLevel) - 1) {
                console.log("new creation office level and selcted office level are same")
            }
            else {
                console.log("not same")
                document.getElementById('list3').style.display = 'block';

                this.getOfficeList(officeId)
                    .then(responseData => {
                        console.log("Response data:", responseData);
                        // Filter out the data with the given office ID
                        const filteredData = responseData.filter(item => item.officeid !== officeId);
                        // Update the state with the filtered data
                        this.setState({ officeListThird: filteredData });
                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });
            }
        }

        console.log(this.state.officeid);

        console.log('executed');
    }
    officeList3 = (e) => {
        const selectedValue = e.target.value;
        console.log("Selected value:", selectedValue);
        // Filter the office list to find the matching office
        const matchingOffice = this.state.officeListThird.find(element => element.officeid === selectedValue);

        if (matchingOffice) {
            console.log(matchingOffice.officeid, matchingOffice.officelevel, matchingOffice.parenthierarchy, matchingOffice.parentid);
            // Update the state with the selected office details
            this.setState({
                officeId: matchingOffice.officeid,
                officeLevel: matchingOffice.officelevel,
                parenthierarchy: matchingOffice.parenthierarchy,
                parentid: matchingOffice.parentid
            }, () => {
                // this.getStaffList(this.state.officeId, this.state.officeLevel);
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
                        resolve(resdata.msgdata);
                    } else {
                        reject(new Error("Issue: " + resdata.message));
                    }
                })
                .catch((error) => {
                    console.log('Error fetching office list:', error);
                    reject(error);
                });
        });
    }

    createOffice = () => {
        var body = {
            officelevel: this.state.selectedOfficelevel,
            officename: this.state.offname,
            parenthierarchy: this.state.parenthier,
            parentid: this.state.parentid,
            districtcode: this.state.districtcode,
            districtname: this.state.districtname,
            statecode: this.state.state1,
        }

        if (this.state.defaultOffice) {
            body.isdefault = this.state.defaultOffice;
        }
        var body1 = JSON.stringify(body);
        console.log(body1)
        fetch(BASEURL + '/usrmgmt/createoffice', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: body1
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
                                    window.location = "/createOffice"
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

                                },
                            },
                        ],
                    });
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    officeLevelFunc = (e) => {
        const officeLevel = e.target.value
        this.setState({ createOffLevel: officeLevel })
    }
    officeTypeFunc = (e) => {
        const officeType = e.target.value
        this.setState({
            createOffType: officeType,
        })
        if (e.target.value !== "") {
            this.setState({
                addoffHierBtn: false
            })
        }
        else {
            this.setState({
                addoffHierBtn: true
            })
        }
    }

    staffLevelFunc = (e) => {
        const staffLevel = e.target.value
        this.setState({ createStaffLevel: staffLevel })
    }

    staffTypeFunc = (e) => {
        const staffType = e.target.value
        this.setState({
            createStaffType: staffType,
        })
        if (e.target.value !== "") {
            this.setState({
                addStaffhierBtn: false
            })
        }
        else {
            this.setState({
                addStaffhierBtn: true
            })
        }
    }

    addAnotheroffice = () => {
        $(this.selectRef1.current).val('');
        console.log(" add another office")
        const { officeLevelHie1, createOffType, createOfficeHierarchy } = this.state;

        const newOffice = {
            officelevel: officeLevelHie1,
            officetype: createOffType
        };
        const newOfficeLevelHie1 = (parseInt(officeLevelHie1) + 1).toString();
        this.setState({
            createOfficeHierarchy: [...createOfficeHierarchy, newOffice],
            officeLevelHie1: newOfficeLevelHie1, // Increment office level
            createOffType: '', // Clear the office type input
            addoffHierBtn: true,
            submitOffHierBtn: false
        }, () => {
            console.log(this.state.createOfficeHierarchy);
        });
    }
    addAnotherstaff = () => {
        $(this.selectRef2.current).val('');
        console.log(" add another staff")
        const { staffLevelHie1, createStaffType, createStaffHie } = this.state;

        const newOffice = {
            stafflevel: staffLevelHie1,
            stafftype: createStaffType
        };
        const newStaffLevelHie1 = (parseInt(staffLevelHie1) + 1).toString();
        this.setState({
            createStaffHie: [...createStaffHie, newOffice],
            staffLevelHie1: newStaffLevelHie1, // Increment office level
            createStaffType: '', // Clear the office type input
            addStaffhierBtn: true,
            submitStaffHierBtn: false
        }, () => {
            console.log(this.state.createStaffHie);
        });
    }
    addOfficeHirarchy = () => {
        var body = JSON.stringify(this.state.createOfficeHierarchy)
        console.log(body)
        fetch(BASEURL + '/usrmgmt/setofficehierarchy', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: body
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
                                    // window.location = "/createOffice"
                                    this.resetOffHier()

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
                                    this.resetOffHier()
                                },
                            },
                        ],
                    });
                }
            }).catch((error) => {
                console.log(error)
            })

    };

    addStaffHierarchy = () => {
        var body = JSON.stringify(this.state.createStaffHie)
        console.log(body)

        fetch(BASEURL + '/usrmgmt/setstaffhierarchy', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: body
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
                                    // window.location = "/createOffice"
                                    this.resetStaffHier()
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
                                    this.resetStaffHier()
                                },
                            },
                        ],
                    });
                }
            }).catch((error) => {
                console.log(error)
            })

    }
    mapofficehie = (e) => {
        const selectedValue = e.target.value;
        const [mapofficehie1, mapofftype1] = selectedValue.split(',');
        // const mapofficehie1 = e.target.value
        this.setState({
            mapofficelevel: mapofficehie1,
            mapofftype: mapofftype1
        },
            () => {
                console.log(this.state.mapofficelevel, this.state.mapofftype)
            })
    }
    handleSelectChange = (selected) => {

        const selectedValues = selected.map(option => option.value);
        const selectedLevels = selectedValues.map(value => value.split('-')[1]); // Assuming value is in format "stafftype-level"
        const selectedStaffTypes = selectedValues.map(value => value.split('-')[0]); // Assuming value is in format "stafftype-level"
        if (this.state.officeHieList.length < 1) {
            this.setState({
                addoffstaffMapBtn: true
            })
        }
        else {
            this.setState({
                addoffstaffMapBtn: false
            })
        }

        this.setState({
            selectedOptions: selected,
            selectedstaff: selectedLevels,
            stafftypearr: selectedStaffTypes,
            // addoffstaffMapBtn:false
        }, () => {
            console.log("Selected Staff Types:", this.state.selectedstaff);
            console.log("Selected Levels:", this.state.selectedLevels);
            console.log("Selected Staff:", this.state.stafftypearr);
        });
    };
    addanothermapping = () => {
        $(this.selectRef3.current).val('');
        $(this.selectRef4.current).find('input').val('');
        if (this.state.officeHieList.length < 1) {
            this.setState({
                addoffstaffMapBtn: true
            })
        }

        const newlist = {
            officelevel: this.state.mapofficelevel,
            stafflevel: this.state.selectedstaff
        };
        const filtererdlist = this.state.officeHieList.filter(ele => ele.level !== this.state.mapofficelevel)
        console.log(filtererdlist);
        this.setState({
            officeHieList: filtererdlist,
            addoffstaffMapBtn: true,
            submitMapBtn: false
        })
        const newlist2 = {
            officetype: this.state.mapofftype,
            stafftype: this.state.stafftypearr
        }

        this.setState(prevState => ({
            officestaffmap1: [...prevState.officestaffmap1, newlist],
            officestaffmapdisp: [...prevState.officestaffmapdisp, newlist2]
        }), () => {
            console.log("Updated officestaffmap1:", this.state.officestaffmap1);
            console.log("Updated officestaffmapdiplay:", this.state.officestaffmapdisp)
        });

        this.setState({
            officestaffmap: newlist,
            // staffHieList: [],
            selectedOptions: []
        }, () => {
            console.log("Updated officestaffmap:", this.state.officestaffmap);
        });
    }

    addoffstaffmap = () => {
        console.log(this.state.officestaffmap1)
        var body = JSON.stringify(this.state.officestaffmap1)
        console.log(body)
        fetch(BASEURL + '/usrmgmt/setofficestaffmapping', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: body
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
                                    // window.location = "/createOffice"
                                    this.resetOffStaffmap()
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
                                    // this.resetOffStaffmap()
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
    }
    resetOffStaffmap = () => {
        this.setState({
            officestaffmapdisp: [],
            officestaffmap1: [],
            officeHieList: this.state.initialOfficeHieList

        })
    }
    resetOffHier = () => {
        this.setState({
            createOfficeHierarchy: [],
            officeLevelHie1: '1'

        })
    }
    resetStaffHier = () => {
        this.setState({
            createStaffHie: [],
            staffLevelHie1: '1'
        })
    }

    render() {
        const { selectedOptions } = this.state
        const options = this.state.staffHieList.map((list) => ({
            value: `${list.stafftype}-${list.level}`,
            label: `${list.stafftype} (Level ${list.level})`,
        }));
        console.log(permArray)
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
        return (
            <div className="container-dashboard d-flex flex-row">
                <AdminSidebar />
                <div className="pl-3 pr-3 main-content" style={{ width: "100%" }}>
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "40px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / Create Office </p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="ProductDefRes3">
                            <button style={myStyle}>
                                <Link to="/landing" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop:"-10px" }} />
                    {/* New Design */}
                    <div className='container-fluid row' style={{ paddingLeft: "86px", marginTop: "-20px" }}>
                        <div className='card' style={{ cursor: "default", overflow: "visible" }}>
                            <div className='row pt-2 pl-2 pr-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item">
                                            <a data-toggle="pill" id="myNavLink" href="#createMasters" className="nav-link active"
                                                style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}>
                                                <FaCalendar style={{ color: "rgb(40, 116, 166)" }} /> &nbsp;{t('Create Office')}
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a data-toggle="pill" id="myNavLink" href="#createMastersHierarchy" className="nav-link"
                                                style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}>
                                                <FaIcons.FaSitemap style={{ color: "rgb(40, 116, 166)" }} /> &nbsp;{t('Create Hierarchy')}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="tab-content h-100">

                                <div class="tab-pane fade show active" id="createMasters" role="tabpanel" style={{ marginBottom: "20px" }}>
                                    <div className='row' style={{ marginTop: "-20px" }}>
                                        <div class="col-md-4 mb-3">
                                            <ul class="nav nav-pills flex-column" id="myTab1" role="tablist" style={{ textAlign: "center", fontSize: "16px", fontFamily: "Poppins,sans-serif" }}>
                                                <li class="nav-item">
                                                    <a class="nav-link active" id="prodType-tab" data-toggle="tab"
                                                        href="#profile" role="tab" aria-controls="profile" aria-selected="false" value="3">Create Office</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="col-md-8" style={{ marginTop: "5px" }}>
                                            <div class="tab-content" id="myTabContent" style={{ marginLeft: "-20px" }}>
                                                <div class="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="prodType-tab">
                                                    <div className="card" style={{ cursor: "default" }}>
                                                        <div className="card-header border-1 bg-white">
                                                            <div className="form-row" >
                                                                <div className="form-group col-md-4">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif",fontSize:"14px", fontWeight: "bold" }}>{t('Enter Office Name *')}</p>
                                                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px",fontSize:"14px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                                        id="inputAddress" placeholder={t('Enter Office Name')} onChange={this.officeName}
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-4">
                                                                    <p htmlFor="Name" style={{ color: "#222C70",fontSize:"14px", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('State *')}</p>
                                                                    <select id="inputState" style={{ height: "37px",fontSize:"14px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onClick={this.state1} onChange={this.state2} >
                                                                        <option defaultValue>Select State</option>
                                                                        {this.state.stateList.map((states, index) => (
                                                                            <option key={index} value={states.statecode} style={{ color: "GrayText" }}>{states.statename} </option>
                                                                        ))
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div className="form-group col-md-4">
                                                                    <p htmlFor="Name" style={{ color: "#222C70",fontSize:"14px", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('District *')}</p>
                                                                    <select id="inputState" style={{ height: "37px",fontSize:"14px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.district}>
                                                                        <option defaultValue>Select District</option>
                                                                        {this.state.districtList.map((districts, index) => {
                                                                            return (
                                                                                <option key={index} value={`${districts.distid},${districts.distname}`} style={{ color: "GrayText" }}>{districts.distname}</option>
                                                                            )
                                                                        })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <div className="form-row" >
                                                                <div className="form-group col-md-4">

                                                                    <p htmlFor="Name" style={{ color: "#222C70",fontSize:"14px", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Select Office Level *')}</p>
                                                                    <select id="inputState" style={{ height: "37px",fontSize:"14px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select"
                                                                        onClick={this.OffHier1}
                                                                        onChange={this.officehie}
                                                                    >
                                                                        <option defaultValue>Select</option>
                                                                        {this.state.officeHieList.map((list, index) => (
                                                                            <option key={index} value={list.level} style={{ color: "GrayText" }}>{list.officetype} </option>
                                                                        ))
                                                                        }

                                                                    </select>

                                                                </div>

                                                                <div className="form-group col-md-4" id="list1" style={{ display: "none" }}>
                                                                    <p htmlFor="Name" style={{ color: "#222C70",fontSize:"14px", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Select Zone *')}</p>
                                                                    <select id="" ref={this.selectRef} style={{ height: "37px",fontSize:"14px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onClick={this.officeList} onChange={this.officeList1} >
                                                                        <option defaultValue>Select</option>
                                                                        {this.state.officeListFirst.map((ele, index) => (
                                                                            <option key={index} style={{ color: "GrayText" }} value={`${ele.officeid},${ele.officelevel},${ele.parentid}`}>{ele.officename}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                <div className="form-group col-md-4" id="list2" style={{ display: "none" }}>
                                                                    <p htmlFor="Name" style={{ color: "#222C70",fontSize:"14px", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Select Region *')}</p>
                                                                    <select id="" style={{ height: "37px",fontSize:"14px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.officeList2} >
                                                                        <option defaultValue>Select</option>
                                                                        {this.state.officeListSecond.map((ele, index) => (
                                                                            <option key={index} style={{ color: "GrayText" }} value={`${ele.officeid},${ele.officelevel},${ele.parentid},${ele.parenthierarchy}`}>{ele.officename}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <div className="form-row" >
                                                                <div className="form-group col-md-4" id="list3" style={{ display: "none" }}>
                                                                    <p htmlFor="Name" style={{ color: "#222C70",fontSize:"14px", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Select Branch *')}</p>
                                                                    <select id="" style={{ height: "37px",fontSize:"14px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.officeList3}
                                                                    >
                                                                        <option defaultValue>Select</option>
                                                                        {this.state.officeListThird.map((ele, index) => (
                                                                            <option key={index} style={{ color: "GrayText" }} value={ele.officeid}>{ele.officename}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="form-group col-md-4">
                                                                    <div style={{ display: 'flex' }}>
                                                                        <input type="checkbox" id="defaultCheckbox" style={{ marginTop: "-6px" }} onChange={this.handleCheckboxChange} />
                                                                        <label htmlFor="defaultCheckbox" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", marginLeft: '5px', fontSize:"14px", }}>{t('Make as default office')}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {this.state.isHierarchyexists === false ? <p style={{ color: "rgb(34, 44, 112)", textAlign: "center", marginTop: "-20px", fontSize: "small" }}>Note : Hierarchy does not exists. To create an office, please create the hierarchy first.</p> : ""}
                                                            </div>
                                                            <hr />


                                                            <div className="form-row" style={{ textAlign: "center" }}>
                                                                <div className="form-group col">
                                                                    <button type="button" className="btn mr-2 text-white" style={{ backgroundColor: "rgb(136, 189, 72)",fontSize:"14px", }}
                                                                        onClick={this.createOffice}>Submit</button>
                                                                    <button type="button" className="btn text-white" style={{ backgroundColor: "#0079BF",fontSize:"14px", }}
                                                                    >{t('Cancel')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="tab-pane fade show" id="createMastersHierarchy" role="tabpanel" style={{ marginBottom: "20px" }}>
                                    <div className='row' style={{ marginTop: "-20px" }}>
                                        <div class="col-md-4 mb-3">
                                            <ul class="nav nav-pills flex-column" id="myTab1" role="tablist" style={{ textAlign: "center", fontSize: "16px", fontFamily: "Poppins,sans-serif" }}>
                                                <li class="nav-item" >
                                                    <a class="nav-link active" id="loanPurposeGp-tab" data-toggle="tab"
                                                        href="#profile2" role="tab" aria-controls="profile" aria-selected="false" value="3"><FaIcons.FaLandmark /> &nbsp;Create Office Hierarchy</a>
                                                </li>


                                                <li class="nav-item" style={{ marginTop: "-30px" }} onClick={this.getLoanPurposeGroup}>
                                                    <a class="nav-link" id="loanPurpose-tab" data-toggle="tab"
                                                        href="#profile3" role="tab" aria-controls="profile" aria-selected="false" value="3"><FaIcons.FaUsers /> &nbsp;Create Staff Hierarchy</a>
                                                </li>

                                                <li class="nav-item" style={{ marginTop: "-30px" }}>

                                                    <a class="nav-link" id="memberGroup-tab" data-toggle="tab"
                                                        href="#profile4" role="tab" aria-controls="profile" aria-selected="false" value="3"><FaIcons.FaPeopleArrows /> &nbsp;Office Staff Mapping</a>
                                                </li>

                                            </ul>
                                        </div>
                                        <div class="col-md-8" style={{ marginTop: "5px" }}>
                                            <div class="tab-content" id="myTabContent" style={{ marginLeft: "-20px" }}>

                                                <div class="tab-pane fade show active" id="profile2" role="tabpanel" aria-labelledby="loanPurposeGp-tab">
                                                    <div className="card" style={{ cursor: "default" }}>
                                                        <div className="card-header border-1 bg-white">
                                                            <p style={{ color: "#222C70", fontFamily: "Poppins, sans-serif", fontSize: "13px" }}>
                                                                Please note: Once created, the office hierarchy cannot be edited or deleted. Ensure all details are accurate before proceeding.
                                                            </p>
                                                            <div className="form-row" >
                                                                <div className="form-group col-md-5">
                                                                    <p htmlFor="Name" style={{ color: "#222C70",fontSize:"14px", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Office Level *')}</p>
                                                                    <input type="number" className="form-control" autoComplete="off" style={{ height: "37px",fontSize:"14px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                                        id="inputAddress" placeholder={t('Enter Office Level')}
                                                                        value={this.state.officeLevelHie1} readOnly

                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-5">
                                                                    <p htmlFor="Name" style={{ color: "#222C70",fontSize:"14px", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{('Office Type *')}</p>
                                                                    <input ref={this.selectRef1} type="text" className="form-control" autoComplete="off" style={{ height: "37px",fontSize:"14px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                                        id="inputAddress" placeholder={t('Enter Office Type')} onChange={this.officeTypeFunc}
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-2">
                                                                    <div style={{ marginTop: "25px" }} >
                                                                        <button type="button" id='' disabled={this.state.addoffHierBtn} onClick={this.addAnotheroffice} class="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)",fontSize:"14px", padding: "6px" }} >+Add</button>
                                                                    </div>


                                                                </div>

                                                            </div>

                                                            <hr style={{ marginTop: "-10px", backgroundColor: "#222C70" }} />
                                                            <div className='row'>
                                                                {this.state.createOfficeHierarchy.map((list, index) => {
                                                                    return (
                                                                        <div className='card' key={index} style={{ margin: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '220px' }}>
                                                                            <p style={{ marginBottom: "initial", fontWeight: "600", color: "#222C70", fontFamily: "Poppins,sans-serif" }}>{t('Level')} {list.officelevel}</p>
                                                                            <p style={{ fontWeight: "600", color: "#222C70", fontFamily: "Poppins,sans-serif" }}>{t('Office Type :')} <span style={{ fontWeight: "400" }}>{list.officetype}</span></p>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            <div className="form-row" style={{ textAlign: "center" }}>
                                                                <div className="form-group col">
                                                                    <button type="button" className="btn mr-2 text-white" disabled={this.state.submitOffHierBtn} style={{ backgroundColor: "rgb(136, 189, 72)",fontSize:"14px", }}
                                                                        onClick={this.addOfficeHirarchy}>Submit</button>
                                                                    <button type="button" className="btn text-white" style={{ backgroundColor: "#0079BF",fontSize:"14px", }} onClick={this.resetOffHier}
                                                                    >{t('Cancel')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane fade show" id="profile3" role="tabpanel" aria-labelledby="loanPurpose-tab">
                                                    <div className="card" style={{ cursor: "default" }}>
                                                        <div className="card-header border-1 bg-white">
                                                            <p style={{ color: "#222C70", fontFamily: "Poppins, sans-serif", fontSize: "13px" }}>
                                                                Please note: Once created, the staff hierarchy cannot be edited or deleted. Ensure all details are accurate before proceeding.
                                                            </p>
                                                            <div className="form-row" >
                                                                <div className="form-group col-md-5">
                                                                    <p htmlFor="Name" style={{ color: "#222C70",fontSize:"14px", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Staff Level *')}</p>
                                                                    <input type="number" className="form-control" autoComplete="off" style={{ height: "37px",fontSize:"14px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                                        id="inputAddress" placeholder={t('Enter Staff Level')} readOnly
                                                                        value={this.state.staffLevelHie1}
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-5">
                                                                    <p htmlFor="Name" style={{ color: "#222C70",fontSize:"14px", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Staff Type *')}</p>
                                                                    <input type="text" ref={this.selectRef2} className="form-control" autoComplete="off" style={{ height: "37px",fontSize:"14px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                                        id="inputAddress" placeholder={t('Enter Staff Type')} onChange={this.staffTypeFunc}
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-2">
                                                                    <div style={{ marginTop: "25px" }} >
                                                                        <button type="button" id='' disabled={this.state.addStaffhierBtn} class="btn text-white btn-sm" onClick={this.addAnotherstaff} style={{ backgroundColor: "rgb(136, 189, 72)",fontSize:"14px", padding: "6px" }} >+Add</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <hr style={{ marginTop: "-10px", backgroundColor: "#222C70" }} />
                                                            <div className='row'>
                                                                {this.state.createStaffHie.map((list, index) => {
                                                                    return (
                                                                        <div className='card' key={index} style={{ margin: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '220px' }}>
                                                                            <p style={{ marginBottom: "initial", fontWeight: "600", color: "#222C70", fontFamily: "Poppins,sans-serif" }}>{t('Level')} {list.stafflevel}</p>
                                                                            <p style={{ fontWeight: "600", color: "#222C70", fontFamily: "Poppins,sans-serif" }}>{t('Staff Type :')} <span style={{ fontWeight: "400" }}>{list.stafftype}</span></p>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            <div className="form-row" style={{ textAlign: "center" }}>
                                                                <div className="form-group col">
                                                                    <button type="button" className="btn mr-2 text-white" disabled={this.state.submitStaffHierBtn} style={{ backgroundColor: "rgb(136, 189, 72)",fontSize:"14px", }}
                                                                        onClick={this.addStaffHierarchy}>Submit</button>
                                                                    <button type="button" className="btn text-white" style={{ backgroundColor: "#0079BF",fontSize:"14px", }} onClick={this.resetStaffHier}
                                                                    >{t('Cancel')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane fade show" id="profile4" role="tabpanel" aria-labelledby="memberGroup-tab">
                                                    <div className="card" style={{ cursor: "default", overflow: "visible" }}>
                                                        <div className="card-header border-1 bg-white">
                                                        <p style={{ color: "#222C70", fontFamily: "Poppins, sans-serif", fontSize:"13px" }}>
                                                                Please note: Once created, the mapping cannot be edited or deleted. Ensure all details are accurate before proceeding.
                                                            </p>
                                                            <div className="form-row" >
                                                                <div className="form-group col-lg-5 col-sm-12 col-md-5">
                                                                    <p htmlFor="Name" style={{ color: "#222C70",fontSize:"14px", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Office Level *')}</p>

                                                                    <select id="inputState" style={{ height: "37px",fontSize:"14px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select"
                                                                        onClick={this.OffHier1}
                                                                        onChange={this.mapofficehie}
                                                                        ref={this.selectRef3}
                                                                    >
                                                                        <option defaultValue>Select</option>
                                                                        {this.state.officeHieList.map((list, index) => (
                                                                            <option key={index} value={`${list.level},${list.officetype}`} style={{ color: "GrayText" }}>{list.officetype} </option>
                                                                        ))
                                                                        }

                                                                    </select>
                                                                </div>
                                                                <div className="form-group col-lg-5 col-sm-12 col-md-5">
                                                                    <p htmlFor="Name" style={{ color: "#222C70",fontSize:"14px", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "0px" }}>{t('Staff Level *')}</p>
                                                                    <Select
                                                                        isMulti
                                                                        value={selectedOptions}
                                                                        onFocus={this.StaffHier1}
                                                                        onChange={this.handleSelectChange}
                                                                        options={options}
                                                                        style={{ marginTop: "-16px", maxHeight: "200px", overflowY: "auto", fontSize:"14px",}}
                                                                        ref={this.selectRef4}

                                                                    />

                                                                </div>
                                                                <div className="form-group col-md-2">
                                                                    <div style={{ marginTop: "25px" }} >
                                                                        <button type="button" id='' disabled={this.state.addoffstaffMapBtn} onClick={this.addanothermapping} class="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)",fontSize:"14px", padding: "6px" }} >+Add</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {(this.state.isHierarchyexists === false || this.state.isStaffHierarchyexists === false) ? <p style={{ color: "rgb(34,44,112)", textAlign: "center", fontSize: "small" }}>Note : Please create office and staff hierarchy first.</p> : ""}
                                                            <hr style={{ marginTop: "-10px", backgroundColor: "#222C70" }} />
                                                            {this.state.officestaffmapdisp && this.state.officestaffmapdisp.length > 0 &&
                                                                <div className='row'>
                                                                    <div className='scrollbar1' id="auditScroll" style={{ marginTop: "-10px", marginLeft: "-40px" }}>
                                                                        <div style={{
                                                                            whiteSpace: "nowrap"
                                                                        }} id='secondAuditScroll'>
                                                                            <div className='row font-weight-normal'
                                                                                style={{
                                                                                    marginLeft: "25px",
                                                                                    fontWeight: "800",
                                                                                    fontSize: "15px",
                                                                                    color: "rgba(5,54,82,1)",
                                                                                    width: "95%"
                                                                                }}>
                                                                                <div className='col-lg-2 col-md-5 col-sm-8'>
                                                                                    <p style={{ fontWeight: "600" }}>{t('Office Type')}</p>
                                                                                </div>
                                                                                <div className='col-lg-3 col-md-5 col-sm-8'>
                                                                                    <p style={{ fontWeight: "600" }}>{t('Staff Type')}</p>
                                                                                </div>
                                                                            </div>

                                                                            <hr className="col-11" style={{ marginLeft: "40px", width: "88.6%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                                                            {/* Lists */}
                                                                            <div className="scrollbar1" style={{
                                                                                height: "100px",
                                                                                overflowY: 'auto',
                                                                                marginTop: "-16px"
                                                                            }}>
                                                                                {this.state.officestaffmapdisp.map((lists, index) => {
                                                                                    return (
                                                                                        <div className='col' key={index}>
                                                                                            <div className='card border-0' style={{ marginBottom: "-15.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                                                <div className="row item-list align-items-center">

                                                                                                    <div className="col-lg-2 col-md-5 col-sm-8">
                                                                                                        <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.officetype}</p>
                                                                                                    </div >
                                                                                                    {lists.stafftype && lists.stafftype.length > 0 && (
                                                                                                        <div className="col-lg-3 col-md-5 col-sm-8">
                                                                                                            <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>
                                                                                                                {lists.stafftype.join(', ')}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    )}

                                                                                                </div >
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                            &nbsp;

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }

                                                            <div className="form-row" style={{ textAlign: "center" }}>
                                                                <div className="form-group col">
                                                                    <button type="button" className="btn mr-2 text-white" disabled={this.state.submitMapBtn} style={{ backgroundColor: "rgb(136, 189, 72)",fontSize:"14px", }}
                                                                        onClick={this.addoffstaffmap}>Submit</button>
                                                                    <button type="button" className="btn text-white" style={{ backgroundColor: "#0079BF",fontSize:"14px", }} onClick={this.resetOffStaffmap}
                                                                    >{t('Cancel')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
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

export default withTranslation()(CreateOffice)