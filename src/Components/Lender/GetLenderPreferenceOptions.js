import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import { FaArrowCircleRight } from "react-icons/fa";
import './LenderP.css';
import { FaAngleLeft, FaMoneyBill } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { Link } from 'react-router-dom';
import dashboardIcon from '../assets/icon_dashboard.png';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from "react-confirm-alert";

var preferenceLocal;
export class GetLenderPreferenceOptions extends Component {
    constructor(props) {
        super(props)
        //updated
        this.state = {
            LPOptions: [],
            attributes: [],
            attributeOptions: [],
            selectedAttribute: "",
            selectedPreference: [],
            attributegroup: [

            ],
            Aoptions: [],

            sPreferences: [],
            selectedPref: "",
        }
        this.getLPOptions = this.getLPOptions.bind(this);
        this.setLPreference = this.setLPreference.bind(this);
        this.getLPreference = this.getLPreference.bind(this);
        this.checkOptions = this.checkOptions.bind(this);
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.getLPOptions();
            $("#selectall").click(function () {
                if (this.checked) {
                    $('.checkboxall').each(function () {
                        $(".checkboxall").prop('checked', true);
                    })
                } else {
                    $('.checkboxall').each(function () {
                        $(".checkboxall").prop('checked', false);
                    })
                }
            });
            $("#card").click(function () {
                $("#checkSub").show();
                $('#checkPref').show();
            });

            // $("#card2").click(function () {
            //     $("#checkSub").hide();
            //     $('#checkPref').hide();
            // });
            preferenceLocal = sessionStorage.getItem("prefNumber");
            console.log(preferenceLocal)
        } else {
            window.location = '/login'
        }

    }

    getLPOptions() {
        fetch(BASEURL + '/lms/getlenderpreferenceoptions', {
            method: 'get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);

                    this.setState({ LPOptions: resdata.msgdata });
                    console.log(this.state.LPOptions)
                    this.getLPreference();
                    // alert(resdata.message)
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
            .catch((error) => {
                console.log(error)
            })
    }
    selectPreference = (e) => {
        this.setState({ selectedPref: e.target.value })
    }
    checkSetPref = () => {
        const allOptions = JSON.parse(JSON.stringify(this.state.LPOptions));

        // JSON.stringify({
        //     attributegroup: allOptions.filter((attributecategory) => {
        //         attributecategory.preferencenumber = this.state.selectedPref;
        //         attributecategory.attributes = attributecategory.attributes.filter((attributetype) => {
        //             attributetype.attributeoptions = attributetype.attributeoptions.filter((option) => {
        //                 return option.checked;
        //             }).map((option) => {
        //                 option.status = "1";
        //                 delete option.checked;
        //                 return option;
        //             });
        //             return attributetype.attributeoptions.length;
        //         }).map((attributetype) => {
        //             delete attributetype.multichoice;
        //             return attributetype;
        //         });
        //         return attributecategory.attributes.length;
        //     })
        // })

        var resultant = JSON.stringify({
            attributegroup: allOptions.filter((attributecategory) => {
                attributecategory.preferencenumber = this.state.selectedPref;
                attributecategory.attributes = attributecategory.attributes.map((attributetype) => {
                    attributetype.attributeoptions = attributetype.attributeoptions.map((option) => {
                        option.status = option.checked ? "1" : "0"; // Set status based on checked property
                        delete option.checked; // Remove the checked property
                        return option;
                    });
                    delete attributetype.multichoice;
                    return attributetype;
                });
                return attributecategory.attributes.length;
            })
        });
        console.log(resultant)
    }
    setLPreference() {
        const allOptions = JSON.parse(JSON.stringify(this.state.LPOptions));

        fetch(BASEURL + '/lms/setlenderpreference', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                attributegroup: allOptions.filter((attributecategory) => {
                    attributecategory.preferencenumber = this.state.selectedPref;
                    attributecategory.attributes = attributecategory.attributes.map((attributetype) => {
                        attributetype.attributeoptions = attributetype.attributeoptions.map((option) => {
                            option.status = option.checked ? "1" : "0";
                            delete option.checked;
                            return option;
                        });
                        delete attributetype.multichoice;
                        return attributetype;
                    });
                    return attributecategory.attributes.length;
                })
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location = "/lenderPreference"
                                },
                            },
                        ],
                    });
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
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getLPreference() {
        fetch(BASEURL + '/lms/getlenderpreference', {
            method: 'get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }

        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    //this.setState({ selectedPreference: resdata.msgdata });
                    // this.setState({ sPreferences:resdata.msgdata[]})
                    var selectedRes = resdata.msgdata;
                    const length = selectedRes.length;
                    console.log(length);

                    selectedRes.forEach(element => {
                        console.log(element);
                        element.map(ele => {
                            console.log(ele);
                            console.log(ele.preferencenumber);
                            if (ele.preferencenumber == preferenceLocal) {
                                console.log(ele.preferencenumber)
                                this.setState({ selectedPreference: element })
                                console.log(this.state.selectedPreference)
                            }
                        })

                    })
                    this.updateSelected();
                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
    }

    getAttributes(attributes) {
        $('#card1').show();
        $('#card2').hide();
        $('#checkSub').hide();
        $('#checkPref').hide();
        $('input[type="radio"]').prop('checked', false);
        // document.getElementById("optionsIcon").innerHTML=">"
        this.setState({ attributeOptions: [] });

        this.setState({ attributes: attributes });
        console.log(this.state.attributes)
    }

    updateSelected() {
        const selectedPreferences = this.state.selectedPreference;

        console.log(selectedPreferences)
        const allAttributes = this.state.LPOptions;
        selectedPreferences.forEach((scategory) => {
            scategory.attributes.forEach((sattributeType) => {
                sattributeType.attributeoptions.forEach((selectedOption) => {
                    console.log(selectedOption + "without checked key")
                    allAttributes.forEach((acategory) => {
                        if (acategory.attributecategory === scategory.attributecategory) {
                            acategory.preferencenumber = scategory.preferencenumber;
                            acategory.attributes.forEach((aattributeType) => {
                                if (aattributeType.attributetype === sattributeType.attributetype) {
                                    aattributeType.attributeoptions.forEach((allOption) => {
                                        console.log(allOption)

                                        if (selectedOption.id === allOption.id) {
                                            allOption.status = selectedOption.status + "";
                                            allOption.checked = allOption.status === "1";
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
        console.log(allAttributes);
        this.setState({ LPOptions: allAttributes });

    }

    getAttributeOptions(attributeoptions, attributetypeid) {

        $('#card2').show();
        $('#checkPref').show();
        $("#checkSub").show();

        this.setState({ attributeOptions: attributeoptions }, () => {
            // Callback function to log the updated state
            console.log(this.state.attributeOptions);
        });
        console.log(this.state.attributeOptions)
    }

    checkOptions(event, index) {
        console.log(event.target.checked);
        console.log(event.target.value);
        // const updatedOptions = [...this.state.attributeOptions];
        // updatedOptions[index].checked = !updatedOptions[index].checked;
        // this.setState({ attributeOptions: updatedOptions });

        const options = this.state.attributeOptions;
        options[index].checked = event.target.checked;
        this.setState({ attributeOptions: options });
        const p_value = this.state.Aoptions;
        if (event.target.checked == true) {
            p_value.push(event.target.value);
        } else {
            const index = p_value.indexOf(event.target.value);
            p_value.splice(index, 1);
        }
        console.log(p_value);
        this.setState({ Aoptions: p_value })
        console.log(this.state.attributeOptions)
    }

    cancelLPref = () => {
        window.location = "/lenderdashboard"
    }

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
        const { t } = this.props;
        const myStyle = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "9px 0px 4px 0px",
            cursor: "pointer",
            fontSize: "12px",
            // height: "25px",
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
        }
        console.log(this.state.attributeOptions)
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-10px", backgroundColor: "#F7FCFF" }}>
                <LenderSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ paddingLeft: "35px", marginBottom: "-20px" }}>
                        <div className="col-1">
                            <button style={{}} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-lg-4' style={{ marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/lenderdashboard">Home</Link> / Lender Preference Options</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-lg-3 col-sm-12'>

                        </div>
                        <div className="col-lg-1 col-sm-2">
                            <button style={myStyle}>
                                <Link to="/lenderdashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row' style={{ paddingLeft: "60px", marginTop: "-10px" }}>
                        <div className='col-lg-5 col-sm-8 col-md-12' id='headinglndpref'>
                            <div className="two__image" style={{ paddingLeft: "20px", marginLeft: "-10px" }}>
                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Lender Preferences Options</p>
                            </div>
                        </div>
                    </div>

                    <div className="row pl-5 pr-5" id="card" style={{ marginTop: "-24px" }}>
                        {this.state.LPOptions.map((LPreference, index) => {
                            return (
                                <div className="col-6" key={index} >
                                    <div className="card" onClick={this.getAttributes.bind(this, LPreference.attributes, LPreference.attributecategory)} style={{ borderRadius: "10px" }}>
                                        <p style={{ textAlign: "center", fontSize: "20px", color: "rgb(40, 116, 166)" }}>
                                            {(index % 2) ? <GiTakeMyMoney /> : <FaMoneyBill />}</p>
                                        <p style={{ textAlign: "center", fontStyle: "Poppins", marginTop: "-10px", color: "rgb(40, 116, 166)", fontSize: "16px", fontWeight: "bold" }}>{LPreference.attributecategory}</p>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                    <div className="row pl-5 pr-5">
                        {/* <div className="card" id="card1" style={{ borderRadius: "10px", display: "none", cursor: "default" }}>
                            <div className="row">
                                {this.state.attributes?.map((LPAttributes, index) => {
                                    return (
                                        <div className="col-4" key={index}>
                                            <div className="card" style={{ borderRadius: "5px", height: "40px", cursor: "default" }}>
                                                <div className='form-check mt-2'>
                                                    <input className='form-check-input' type='radio'
                                                        name="example1" id="exampleRadios1" checked={this.state.checked}
                                                        onClick={this.getAttributeOptions.bind(this, LPAttributes.attributeoptions, LPAttributes.attributetypeid)}
                                                        style={{ marginLeft: "1px", color: "rgba(5,54,82,1)", cursor: "pointer" }} /><span style={{ marginLeft: "15px", color: "rgb(40, 116, 166)", fontWeight: "bold", fontSize: "16px", fontStyle: "Poppins" }}
                                                        >&nbsp;{LPAttributes.attributetype}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div> */}
                        <div className="col-12">
                            <div className="card" id="card1" style={{ borderRadius: "10px", cursor: "default", display: "none", marginTop: "-10px" }}>
                                <div className='scrollbar' style={{ cursor: "default", overflowX: "hidden", height: (this.state.attributes.length > 3 ? "96px" : "50px") }} >
                                    <div className='row pl-2 pr-2'>
                                        {
                                            this.state.attributes?.map((LPAttributes, index) => {
                                                return (
                                                    <div className='col-lg-4 col-md-6 col-sm-12' key={index}>
                                                        <div className='card pl-3' style={{ paddingBottom: "5px", marginTop: "4px", fontSize: "14px", border: "1px solid rgba(0,121,190,1)", marginBottom: "0px", cursor: "default", color: "rgb(40, 116, 166)", fontWeight: "600" }}>
                                                            <div className='form-check mt-2'>
                                                                <input className='form-check-input' type='radio'
                                                                    name="example1" id="exampleRadios1" checked={this.state.checked}
                                                                    onClick={this.getAttributeOptions.bind(this, LPAttributes.attributeoptions, LPAttributes.attributetypeid)}
                                                                />
                                                                <span>{LPAttributes.attributetype}</span>
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
                    <div className="row pl-5 pr-5">
                        <div className="col-12">
                            <div className="card" id="card2" style={{ borderRadius: "10px", cursor: "default", display: "none", marginTop: "-10px" }}>
                                <div className='scrollbar' style={{ cursor: "default", overflowX: "hidden", height: (this.state.attributeOptions.length > 6 ? "137px" : this.state.attributeOptions.length < 6 ? "96px" : "50") }} >
                                    <div className='row pl-2 pr-2'>
                                        {
                                            this.state.attributeOptions.map((LPOptions, index) => {
                                                return (
                                                    <div className='col-lg-4 col-md-6 col-sm-12' key={index}>
                                                        <div className='card' style={{ paddingBottom: "5px", marginTop: "4px", fontSize: "14px", border: "1px solid rgba(0,121,190,1)", marginBottom: "0px", cursor: "default", color: "rgb(40, 116, 166)", fontWeight: "600" }}>
                                                            <div className='form-check mt-2'>
                                                                <input className='checkboxall' id={`checkbox-${index}`} type='checkbox' checked={LPOptions.checked || false}
                                                                    onChange={(e) => { this.checkOptions(e, index) }} value={LPOptions.id}
                                                                />
                                                                <span>{LPOptions.value}</span>
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
                    {/* <div className="row pr-5" style={{ paddingLeft: "80px" }}>
                        <div className="card" id='card2' style={{ borderRadius: "10px", display: "none", cursor: "default" }}>
                            <div className="row ml-3 mr-3">
                                {
                                    this.state.attributeOptions.map((LPOptions, index) => {
                                        return (
                                            <div className="col-3" key={index}>
                                                <div className="card" id='checkboX' style={{ borderRadius: "15px", height: "40px", cursor: "default" }}>
                                                    <div className='form-check mt-2'>
                                                        <input className='checkboxall' id={`checkbox-${index}`} type='checkbox' checked={LPOptions.checked || false} onChange={(e) => { this.checkOptions(e, index) }} value={LPOptions.id}
                                                            style={{ marginLeft: "1px", color: "rgba(5,54,82,1)", cursor: "pointer" }} />
                                                        <span style={{ marginLeft: "15px", color: "rgb(40, 116, 166)", fontWeight: "bold", fontSize: "12px", fontStyle: "Poppins" }}>&nbsp;{LPOptions.value}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}
                            </div>
                        </div>
                    </div> */}
                    <div className="row pr-5" style={{ paddingLeft: "50px", marginTop: "-5px" }}>
                        <p className="col-6" id="checkPref"
                            style={{ fontSize: "16px", color: "rgb(40, 116, 166)", fontWeight: "bold", display: "none" }}
                        >
                            Preference Type *
                            <p className="innerselect">
                                <select
                                    name="preference"
                                    style={{
                                        border: "1px solid rgba(40,116,166,1)",
                                        width: "145px",
                                        fontSize: "14px",
                                        height: "35px",
                                        borderRadius: "5px",
                                        color: "rgb(40, 116, 166)"
                                    }}
                                    onChange={this.selectPreference}
                                >
                                    <option defaultValue>Select Preference</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </p>
                        </p>
                        <div className='col-3'></div>
                        <div className="col-3" id='checkSub' style={{ display: "none", textAlign: "end", marginTop: "15px" }}>
                            <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setLPreference}> Submit</button> &nbsp;
                            <button type="button" className="btn btn-sm text-white" onClick={this.cancelLPref} style={{ float: "right", backgroundColor: "#0079BF" }}> Cancel</button>
                        </div>
                    </div>

                    <div className="row">
                    </div>
                </div>
            </div >


        )
    }
}

export default withTranslation()(GetLenderPreferenceOptions);
