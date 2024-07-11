import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as HiIcons from "react-icons/hi";
import * as VscIcons from "react-icons/vsc";
import * as CgIcons from "react-icons/cg";
import * as BiIcons from "react-icons/bi";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import { withTranslation } from 'react-i18next';
import { BASEURL } from '../Components/assets/baseURL';
import profile2 from '../Components/assets/img1.png';
import { FaCamera, FaFileUpload } from "react-icons/fa";
import $ from 'jquery';
import './Sidebar.css'
import Tooltip from "@material-ui/core/Tooltip";

import Home from '../Components/assets/img/Home.svg';
import RaiseLoanReq from '../Components/assets/img/RaiseLoanRequest.svg';
import ViewallLoans from '../Components/assets/img/ViewAllLoans2.svg';
import viewLoanReq from '../Components/assets/img/ViewLoanRequest.svg';
import BorTxn from '../Components/assets/img/BorrowerTransactions.svg';
import { confirmAlert } from 'react-confirm-alert';
import batch from '../Components/assets/batch.png';

//updated
class BorrowerSidebar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: true,
            pname: "",
            // pemail: "",
            // pnumber:"",
            UploadedID: "",
            uploadedImage: "",
            aadharImage: "",
            capturedImage: "",
            defaultImage: "",
            aadharID: "",
            image: true,
            photo: "",
            orderToDisplay: 1,
            isImageFound: false,
            VKYCLivImg: "",

            vKycLive: false,
            ID: false,
            uploaded: false,
            disableCamUpld: false,
            //apicall
            dataLoaded: "false",
            fileError: false,
        }
    }
    componentDidMount() {
        this.setState({ dataLoaded: sessionStorage.getItem('dataLoaded') }, () => {
            console.log(this.state.dataLoaded, typeof (this.state.dataLoaded), typeof (sessionStorage.getItem('dataLoaded')))
            if (this.state.dataLoaded !== "true") {
                this.getPersonalDetails();
                this.getphotoDetails();
                this.setState({ dataLoaded: "true" }, () => {
                    sessionStorage.setItem('dataLoaded', "true");
                });
            }

            var imageFlag = sessionStorage.getItem('imageFlag');
            var boolValue = (imageFlag === "true");
            console.log(boolValue);
            if (imageFlag === "true") {
                //Change
                console.log("executed1")
                var kycFlag = sessionStorage.getItem("lndKycFlag")
                if (kycFlag === "true") {
                    console.log("executed2")
                    this.getphotoDetails();
                }
            }
            const storedName = sessionStorage.getItem('userName');
            if (storedName) {
                // If user name is stored, set it in the component state
                this.setState({
                    pname: storedName,
                    image: boolValue
                });
            }
            // Checking if the image is stored and displaying
            const storedImage = sessionStorage.getItem('aadharImage');
            if (storedImage) {
                const txt = storedImage
                const base64 = btoa(txt)
                console.log(base64)
                this.setState({
                    aadharImage: base64,
                }, () => { });
            }
            console.log(sessionStorage.getItem('ImageCam'))

            //Camera icon conditions
            if (sessionStorage.getItem('ImageCam') === "true") {
                $("#Picon2").show();
            } else if (sessionStorage.getItem('ImageCam') === "false") {
                $("#Picon2").hide();
            } else {
                $("#Picon2").show();
            }
        });
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
                memmid: parseInt(sessionStorage.getItem('memmID'))
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    //storing the name on first call
                    sessionStorage.setItem('userName', resdata.msgdata.name);
                    this.setState({ pname: resdata.msgdata.name })

                }
                // else {
                //     alert("Issue: " + resdata.message);
                // }
            })
    }
    // checking the file size and then uploading
    uploadPhoto = () => {
        var fileField = document.querySelector("input[type='file']");
        var fileSize = fileField.files[0].size / 1024 / 1024; // Size in MB
        console.log(fileSize)
        if (fileSize <= 3) {
            this.setState({ fileError: false })
            var imgData = new FormData();
            var body = JSON.stringify({
                image_type_cv_id: 1
            });

            imgData.append("file", fileField.files[0]);
            imgData.append("fileInfo", body);

            fetch(BASEURL + '/usrmgmt/uploadphoto', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: imgData
            })
                .then(response => response.json())
                .then((resdata) => {
                    console.log(resdata);
                    if (resdata.status == 'Success') {
                        $('#exampleModalCenter30').modal('hide');
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        this.getphotoDetails();
                                        sessionStorage.setItem('photoapiflag', "true")
                                        window.dispatchEvent(new Event('storage'));
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
                })
                .catch(error => console.log(error));
        } else {
            this.setState({ fileError: true })
            // $('#uploadImgmodal').hide()
            // $('#exampleModalCenter30').modal('hide');
            // alert("File size exceeds 3MB. Please upload a smaller file.");
        }
    }
    //Setting some flags
    getphotoDetails = () => {
        fetch(BASEURL + '/usrmgmt/getphotodetails?memmid=' + sessionStorage.getItem('memmID'), {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);

                    var responseImage = resdata.msgdata;
                    const length = responseImage.length;
                    console.log(length);
                    console.log(responseImage)
                    var ids = {};
                    for (var i = 0; i < responseImage.length; i++) {
                        console.log(responseImage.imagesource)

                    }
                    console.log(ids);
                    var data = "";
                    responseImage.forEach(element => {
                        console.log(element);
                        if (element.imagesource != "null") {
                            data = data + element.imagesource + ",";
                        }
                        console.log(data)

                    })
                    var typeOfImage = data.split(",");
                    console.log(typeOfImage);
                    // const str = 'UPLD';
                    if (typeOfImage.includes("VKYCLIV")) {
                        responseImage.forEach(element => {
                            if (element.imagesource === "VKYCLIV") {
                                this.setState({ VKYCLivImg: element.id });
                                this.getImageBasedOnId(element.id, element.imagesource);
                                this.setState({ disableCamUpld: true });
                                $("#Picon2").hide()
                                sessionStorage.setItem("ImageCam", "false")
                            }
                        })
                    } else if (typeOfImage.includes("UPLD")) {
                        responseImage.forEach(element => {
                            if (element.imagesource != "" && element.imagesource == !"ID" && element.imagesource == !"VKYCLIV" && element.imagesource != "null" || element.imagesource === "UPLD") {
                                this.setState({ UploadedID: element.id })
                                this.getImageBasedOnId(element.id, element.imagesource);
                                this.setState({ isImageFound: true });
                                $("#Picon2").show()
                                sessionStorage.setItem("ImageCam", "true")
                                console.log(this.state.UploadedID)
                            }
                        })
                        // Will only return when the `str` is included in the `substrings`
                    }
                    else if (typeOfImage.includes("ID")) {
                        responseImage.forEach(element => {
                            if (!this.state.isImageFound && element.imagesource === "ID" && element.imagesource != "" && element.imagesource != "null") {
                                this.setState({ aadharID: element.id });
                                this.getImageBasedOnId(element.id, element.imagesource);
                                this.setState({ disableCamUpld: true });
                                $("#Picon2").hide()
                                sessionStorage.setItem("ImageCam", "false")
                            }
                        })
                    }


                    console.log("Aadhar Image: " + this.state.aadharImage);
                    console.log("Uploaded Image: " + this.state.uploadedImage);
                    console.log("Default Image: " + this.state.defaultImage);

                }
                else {
                    console.log("inside getphotodetails else")
                    this.setState({ image: false })
                    sessionStorage.setItem("ImageCam", "true")
                    sessionStorage.setItem("imageFlag", "false")
                    console.log(sessionStorage.getItem('ImageCam'))
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
                        // confirmAlert({
                        //     message: resdata.message,
                        //     buttons: [
                        //         {
                        //             label: "OK",
                        //             onClick: () => {
                        //             },
                        //         },
                        //     ],
                        // });
                    }
                }
            })
    }
    //setting some flags and store image
    getImageBasedOnId = (id, imagesource) => {
        console.log("i am inside ")
        fetch(BASEURL + '/usrmgmt/getphotodetails?id=' + id, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status.toLowerCase() === ('success')) {
                    if (imagesource == "UPLD" && imagesource != "null" && imagesource != "") {
                        this.setState({ aadharImage: resdata.msgdata.image });
                        // localStorage.setItem('aadharImage', resdata.msgdata.image);
                        sessionStorage.setItem("ImageCam", "true")
                        const base64toTxt = resdata.msgdata.image;
                        const textData = atob(base64toTxt);
                        console.log(textData.length, base64toTxt.length)
                        sessionStorage.setItem('aadharImage', textData);
                    } else if (imagesource === "ID" && imagesource != "" && imagesource != "null") {
                        this.setState({ aadharImage: resdata.msgdata.image });
                        // localStorage.setItem('aadharImage', resdata.msgdata.image);
                        sessionStorage.setItem("ImageCam", "false")
                        const base64toTxt = resdata.msgdata.image;
                        const textData = atob(base64toTxt);
                        console.log(textData.length, base64toTxt.length)
                        sessionStorage.setItem('aadharImage', textData);

                    } else if (imagesource === "VKYCLIV") {
                        this.setState({ aadharImage: resdata.msgdata.image });
                        // localStorage.setItem('aadharImage', resdata.msgdata.image);
                        sessionStorage.setItem("ImageCam", "false")
                        const base64toTxt = resdata.msgdata.image;
                        const textData = atob(base64toTxt);
                        console.log(textData.length, base64toTxt.length)
                        sessionStorage.setItem('aadharImage', textData);

                    }
                    else if (imagesource == "UPLD") {
                        this.setState({ aadharImage: resdata.msgdata.image });
                        // localStorage.setItem('aadharImage', resdata.msgdata.image);
                        sessionStorage.setItem("ImageCam", "true")
                        const base64toTxt = resdata.msgdata.image;
                        const textData = atob(base64toTxt);
                        console.log(textData.length, base64toTxt.length)
                        sessionStorage.setItem('aadharImage', textData);

                    }
                    sessionStorage.setItem("imageFlag", "true")
                }
                else {
                    console.log("inside image else")
                    this.setState({ image: false });
                    console.log(this.state.image)
                    sessionStorage.setItem("ImageCam", "true")
                    sessionStorage.setItem("imageFlag", "false")
                }
            }).catch = (e) => {
                alert(e);
            }

    }
    borProfile = () => {
        $(".borDocs").show()
    }
    render() {
        const { t } = this.props
        return (
            <>
                <nav className="sidenav navbar navbar-vertical p-2 fixed-left  navbar-expand-xs navbar-light d-block"
                    style={{ backgroundColor: "#F7FCFF" }} id="sidebar-wrapper">
                    <div className="navbar-inner" style={{ display: "block ruby", width: "max-content" }}>
                        <div className="menu navbar-collapseOnSelect" expand="lg" id="sidenav-collapse-main">
                            <ul className="navbar-nav">
                                {/* Image */}
                                <li className="" id="PImage">
                                    <div className="d-flex justify-content-center">
                                        {this.state.image ?
                                            <img src={`data:image/png;base64,${this.state.aadharImage}`} style={{ width: "85px", height: "85px", overflow: "hidden", borderRadius: "50%" }} className="rounded-circle " id="profileImage" />
                                            :
                                            <img src={profile2} style={{ width: "85px", height: "85px", overflow: "hidden", borderRadius: "50%" }} className="rounded-circle " id="profileImage" />}
                                        {/* <img src={`data:images/jpg ${this.state.aadharImage}`} style={{width:"85px", height:"85px",overflow:"hidden", borderRadius:"50%"}} className="rounded-circle " id="profileImage"/>     */}
                                    </div>
                                    &nbsp;
                                    <a id="Picon2" onClick={() => $("#uploadImgmodal").click()}>
                                        <FaCamera style={{ color: "cyan", width: "15px", height: "15px", marginLeft: "105px", marginTop: "-35px", cursor: "pointer" }} />
                                    </a>
                                </li>
                                {/* Upload Image */}
                                <li className="nav-item" id="Pinfo" style={{ width: "170px" }}>
                                    <Tooltip title={this.state.pname} >
                                        <p className="d-flex justify-content-center font-weight-bold text-dark" style={{ color: "white", marginTop: "-10px" }}>
                                            {sessionStorage.getItem('isEntity') === "1" ?
                                                <FaIcons.FaUsers style={{ marginTop: "1px", width: "12px" }} /> :
                                                <FaIcons.FaUserAlt style={{ marginTop: "4px", width: "12px" }} />
                                            }
                                            &nbsp;<span style={{ fontSize: "12px", wordWrap: "break-word", width: "71px" }}>{this.state.pname.substring(0, 6) + "..."}</span></p>
                                    </Tooltip>

                                    {/* <p className="d-flex justify-content-center text-dark"  style={{color:"white",wordBreak:"break-all",fontSize:"13px", marginTop:"-10px"}}><MdIcons.MdEmail style={{marginTop:"4px"}}/>{this.state.pemail}</p> */}
                                    {/* <p className="d-flex justify-content-center text-dark" style={{color:"white",fontSize:"14px",marginTop:"-10px"}}><FaIcons.FaMobileAlt className="icon" style={{marginTop:"4px"}}/>{this.state.pnumber}</p> */}
                                    {sessionStorage.getItem('SisVkycVerified') == 0 ? <p class="d-flex justify-content-center border" style={{ color: "black", fontSize: "13px", marginTop: "-10px", marginLeft: "15px", width: "130px", borderRadius: "20px" }}><FaIcons.FaTimesCircle style={{ marginTop: "4px" }} />&nbsp;KYC Not Verified</p>
                                        : <span>{sessionStorage.getItem('SisVkycVerified') == 1 || sessionStorage.getItem('SisVkycVerified') == 9 ? <p class="d-flex justify-content-center border" style={{ color: "green", fontSize: "13px", marginTop: "-10px", marginLeft: "26px", width: "100px", borderRadius: "20px" }}><FaIcons.FaCheckCircle style={{ marginTop: "4px" }} />KYC verified</p> :
                                            <p class="d-flex justify-content-center border" style={{ color: "black", fontSize: "13px", marginTop: "-10px", marginLeft: "15px", width: "130px", borderRadius: "20px" }}><FaIcons.FaTimesCircle style={{ marginTop: "4px" }} />&nbsp;KYC Not Verified</p>}</span>

                                    }

                                    <button type="button" class="btn btn-sm" style={{ borderRadius: "30px", width: "140px", marginLeft: "10px", marginTop: "-10px", backgroundColor: "#0079BF" }}>
                                        <Link to="/borrowerDetails" style={{ textDecoration: "none", color: "white", justifyContent: "center" }}>
                                            View Profile
                                        </Link>
                                    </button>
                                </li>
                                <div className='mb-3'></div>
                                <li className="" id='nav-items'>
                                    <Link to="/borrowerdashboard" style={{ textDecoration: "none" }}>
                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                            <img src={Home} style={{ paddingLeft: "12px" }} />
                                            <p className="text text-dark pl-3" >{t('Dashboard')}</p>
                                        </a>
                                    </Link>
                                </li>
                                {/* <li className="" id='nav-items'>
                                <Link to="/borrowerDetails" style={{ textDecoration: "none" }}>
                                    <a className="nav-link" href="#" style={{ height: "35px" }}>
                                        <CgIcons.CgProfile className="icon text-dark" style={{ marginLeft: "2px" }} />
                                        <p className="text text-dark pl-3">{t('Profile')}</p>
                                    </a>
                                </Link>
                            </li> */}
                                <li className="borProfile" id='nav-items' style={{ cursor: "pointer" }}>
                                    <Link to="/borrowerDetails" style={{ textDecoration: "none" }}>
                                        <a className="nav-link" style={{ height: "35px" }}>
                                            <CgIcons.CgProfile className="icon text-dark" style={{ marginLeft: "2px" }} />
                                            <p className="text text-dark" style={{ paddingLeft: "17px", width: "186px" }}>{t('Profile')}</p>
                                        </a>
                                    </Link>
                                </li>
                                {/* <li style={{ paddingLeft: "20px", display: "none" }} id='nav-items' className="borDocs">
                                <Link to="/borrowerDetails" style={{ textDecoration: "none" }}>
                                    <a className="nav-link" style={{ height: "35px" }}>
                                        <CgIcons.CgProfile style={{ color: "#222c70", marginLeft: "2px" }} />
                                        <p className="text text-dark pl-3" style={{ marginTop: "-5px" }}>{t('User Details')}</p>
                                    </a>
                                </Link>
                            </li>
                            <li style={{ paddingLeft: "20px", display: "none" }} id='nav-items' className="borDocs">
                                <Link to="/borDocuments" style={{ textDecoration: "none" }}>
                                    <a className="nav-link" style={{ height: "35px" }}>
                                        <FaIcons.FaFilePdf style={{ color: "#222c70", marginLeft: "2px" }} />&nbsp;
                                        <p className="text text-dark pl-3" style={{ marginTop: "-5px" }}>{t('Documents')}</p>
                                    </a>
                                </Link>
                            </li> */}


                                <li className="" id='nav-items'>
                                    <Link to="/loanRequest" style={{ textDecoration: "none" }}>
                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                            <img src={RaiseLoanReq} style={{ paddingLeft: "8px" }} />
                                            <p className="text text-dark" style={{ paddingLeft: "13px" }}>{t('Raise Loan Request')}</p>
                                        </a>
                                    </Link>
                                </li>
                                <li className="" id='nav-items'>
                                    <Link to="/viewAllLoanRequests" style={{ textDecoration: "none" }}>
                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                            <img src={viewLoanReq} style={{ paddingLeft: "15px" }} />
                                            <p className="text text-dark pl-3">{t('ViewLoanRequests')}</p>
                                        </a>
                                    </Link>
                                </li>
                                <li className="" id='nav-items'>
                                    <Link to="/ViewAllLoans" style={{ textDecoration: "none" }}>
                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                            <img src={ViewallLoans} style={{ paddingLeft: "10px" }} />
                                            <p className="text text-dark pl-3" style={{ width: "max-content" }}>{t('ViewAllLoans')}</p>
                                        </a>
                                    </Link>
                                </li>
                                <li className="" id='nav-items'>
                                    <Link to="/borrowerTransactions" style={{ textDecoration: "none" }}>
                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                            <img src={BorTxn} style={{ paddingLeft: "8px" }} />
                                            <p className="text text-dark pl-3">Borrower Transactions</p>
                                        </a>
                                    </Link>
                                </li>
                                <li className="" id='nav-items'>
                                    <Link to="/support" style={{ textDecoration: "none" }}>
                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                            <FaIcons.FaUsers style={{ color: "#222C70" }} />
                                            {/* <img src={BorTxn} style={{ paddingLeft: "8px" }} /> */}
                                            <p className="text text-dark pl-3" style={{ marginLeft: "8px", marginTop: "-5px" }}>Support</p>
                                        </a>
                                    </Link>
                                </li>
                                {/* <li className="nav-item">
                                <Link to="/support">
                                    <a className="nav-link" href="#">
                                        <BiIcons.BiSupport className="icon" />
                                        <p className="text pr-5">Support</p>
                                    </a>
                                </Link>
                            </li> */}
                            </ul>
                        </div>
                    </div>
                </nav>
                {/* Upload photo modal */}
                <button type="button" id="uploadImgmodal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter30" style={{ display: "none" }}>
                    Upload Image modal
                </button>
                <div class="modal fade" data-backdrop="static" id="exampleModalCenter30" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-body" style={{ cursor: "default" }}>
                                <div className='row'>
                                    <div className='col'>
                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Upload Your Photo</p>
                                        <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
                                    </div>
                                    {/* close modal */}
                                    <div className='col'>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        {/* <p style={{ color: "#0079bf", fontWeight: "500" }}>Step &nbsp;<img src={step1} width="20px" style={{ marginLeft: "1px", marginTop: "-3px" }} /></p> */}
                                    </div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col'>
                                        <p style={{ color: "rgb(5, 54, 82)" }}>Your file size should not be greater than 3 MB.</p>

                                        <div style={{ border: "1.5px solid black", borderRadius: "5px", paddingTop: "10px", height: "fit-content", marginBottom: "10px" }}>
                                            <p class="text-center">
                                                <label for="attachment1011">
                                                    <a type="button" role="button" className="btn btn-sm text-white" aria-disabled="false"
                                                        style={{ backgroundColor: "#222C70" }}><span style={{ fontFamily: "Poppins,sans-serif" }}><FaFileUpload />&nbsp;Choose Your File</span></a>
                                                </label>
                                                <input type="file" name="file[]" accept=".pdf,image/*" id="attachment1011"
                                                    onChange={this.uploadPhoto}
                                                    style={{ visibility: "hidden", position: "absolute" }} multiple />
                                            </p>

                                        </div>
                                        {this.state.fileError &&
                                            <p style={{ color: "red" }}>File size exceeds 3MB. Please upload a smaller file.</p>}
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withTranslation()(BorrowerSidebar)

