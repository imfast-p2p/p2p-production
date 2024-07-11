import React, { Component,createRef } from "react";
import { BASEURL } from '../../assets/baseURL';
import $ from 'jquery';
import FacilitatorSidebar from '../../../SidebarFiles/FacilitatorSidebar';
import { FaAngleDoubleDown, FaAngleLeft, FaTimesCircle, FaCamera, } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import { withTranslation } from 'react-i18next';
import { Card, Container, Row, Col } from 'react-bootstrap';

import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { BsInfoCircle } from "react-icons/bs";
import Webcam from 'react-webcam';
import Cropper from 'react-easy-crop';

$(document).ready(function () {
    var _URL = window.URL || window.webkitURL;
    $("#zipfilesData").change(function (e) {
        var file = this.files[0], img;
        if (Math.round(file.size / (1024 * 1024)) > 1) { // make it in MB so divide by 1024*1024
            alert('Please select image size less than 1 MB');
            window.location.reload();
            return false;

        }

    });
});

const isMobile = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};
export class OnboardAadharQR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileno: "",
            utype: "3",
            kycmode: "4",
            reId: "",
            file: "",

            invalidMnum: false,
            enableWebcam: false,
            capturedImage: null,
            crop: { x: 0, y: 0 },
            zoom: 1,
            croppedAreaPixels: null,
            croppedImage: null,
        }
        this.webcamRef = createRef();
    }
    componentDidMount() {
        $('#AQkycSubmitBtn').prop('disabled', true)
    }
    handleChange2 = (e) => {
        $("#QRCard").show();
        console.log(e.target.files);
        this.setState({ file: URL.createObjectURL(e.target.files[0]) })
    }
    utype = (event) => {
        if (event.target.value == "Lender") {
            this.setState({ utype: "2" })
            console.log(event.target.value);
        } else if (event.target.value == "Borrower") {
            this.setState({ utype: "3" })
            console.log(event.target.value);
        }
    }
    mobilenumber = (event) => {
        var mobileValid = /^[6-9][0-9]{9}$/;
        var eventmInput = event.target.value;
        if (mobileValid.test(eventmInput)) {
            console.log("passed")
            this.setState({ invalidMnum: false })
            $('#AQkycSubmitBtn').prop('disabled', false)
            this.setState({ mobileno: event.target.value })
        } else {
            this.setState({ invalidMnum: true })
            $('#AQkycSubmitBtn').prop('disabled', true)
        }

    }

    uploadAadharQR = async () => {
        var qrformData = new FormData()
        var qrfileField = document.querySelector("input[id='zipfilesData']");

        var bodyData = JSON.stringify({
            mobileno: this.state.mobileno,
            utype: this.state.utype,
            kycmode: this.state.kycmode
        })
        if (this.state.croppedImage) {
            // Convert base64 to Blob
            var response = await fetch(this.state.croppedImage);
            var blob = await response.blob();
            qrformData.append("file", blob, "croppedImage.jpg");
            console.log("Cropped Image:", blob);
        } else if (qrfileField && qrfileField.files[0]) {
            qrformData.append("file", qrfileField.files[0]);
        } else {
            // Handle the case where no image is available
            console.error('No image available for upload');
            return;
        }

        qrformData.append("info", bodyData);

        fetch(BASEURL + '/verification/offlinekyc/kycverification', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                // 'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: qrformData
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    this.setState({ reId: resdata.msgdata.referenceid })
                    sessionStorage.setItem("onboardRefID", resdata.msgdata.referenceid);
                    //alert(resdata.message);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    let data1 = {
                                        mobile: this.state.mobileno,
                                        usertype: this.state.utype
                                    }
                                    this.props.history.push({
                                        pathname: '/onboardRegister',
                                        frompath: 'onboardAadharQR',
                                        state: {
                                            aadhaarQR: data1
                                        }
                                    })
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                    // window.location = '/manualRegistration';

                } else {
                    confirmAlert({
                        message: resdata.message + " " + "Please try with other methods.",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                    //alert(resdata.message + " " + "Please try with other methods.");
                }
            }).catch(error => console.log(error)
            );

    }
    cancelUpload = () => {
        window.location.reload();
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    capture = () => {
        const imageSrc = this.webcamRef.current.getScreenshot();
        this.setState({ capturedImage: imageSrc });
    };

    onCropChange = (crop) => {
        this.setState({ crop });
    };

    onZoomChange = (zoom) => {
        this.setState({ zoom });
    };

    onCropComplete = (croppedArea, croppedAreaPixels) => {
        this.setState({ croppedAreaPixels });
    };

    getCroppedImg = (imageSrc, pixelCrop) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;

                ctx.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height
                );

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas is empty'));
                        return;
                    }
                    blob.name = 'cropped.jpg';
                    const croppedImageUrl = URL.createObjectURL(blob);
                    resolve(croppedImageUrl);
                }, 'image/jpeg');
            };
            image.onerror = (error) => reject(error);
        });
    };

    showCroppedImage = async () => {
        const { capturedImage, croppedAreaPixels } = this.state;
        try {
            const croppedImage = await this.getCroppedImg(capturedImage, croppedAreaPixels);
            this.setState({ croppedImage });
        } catch (e) {
            console.error(e);
        }
    };
    captureImage = () => {
        $("#captureImageModal1").click();
        this.setState({ enableWebcam: true });
    }
    saveThecroppedImage = () => {
        $("#exampleModalCenter31").modal('hide')
    }

    render() {
        const { t } = this.props
        const videoConstraints = {
            facingMode: isMobile() ? { exact: "environment" } : "user"
        };
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
        const { showLoader } = this.state;
        const { enableWebcam, capturedImage, crop, zoom, croppedImage } = this.state;
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#f4f7fc" }}>
                <FacilitatorSidebar />
                <div className="main-content1" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/facilitatorDashboard">Home</Link> / <Link to="/customer">Customer Onboarding</Link> / Aadhar QR</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/customerOnboarding"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "-3px" }} />
                    <Container fluid className="d-flex justify-content-center">
                        <Row>
                            <Col>
                                <Card className="" style={{ width: "100%", cursor: "default", boxShadow: "5px 10px 14px #888888" }}>
                                    <div className="credentials" style={{ padding: "10px 20px" }}>
                                        <div className='row' style={{}}>
                                            <div className='col-6' id='headingCust'>
                                                <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Aadhar QR</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Please check once before changing any instances/enhancements */}
                                        <div className="heading2"
                                            style={{
                                                textAlign: "center",
                                                paddingTop: "10px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                            <label style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}>
                                                Registering as
                                            </label>{" "}
                                            &nbsp;
                                            <select className="form-select" onChange={this.utype} style={{
                                                border: "1px solid rgb(0, 121, 191)",
                                                borderRadius: "5px",
                                                backgroundColor: "whitesmoke",
                                                width: "250px",
                                                marginTop: "-10px",
                                                fontFamily: "Poppins,sans-serif"
                                            }}>
                                                <option defaultValue="" style={{ color: "#00264d", textAlign: "center" }} >
                                                    --Select--
                                                </option>
                                                <option value="Lender">Lender</option>
                                                <option value="Borrower">Borrower</option>
                                            </select>
                                        </div>

                                        <div className="row" style={{ padding: "5px 20px" }}>
                                            <div className="col-12">
                                                <label
                                                    className="u1"
                                                    style={{
                                                        color: "#00264d",
                                                        fontFamily: "Poppins,sans-serif",
                                                        fontWeight: "500",
                                                        fontSize: "14px",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    Upload Aadhaar QR Image *
                                                </label>
                                                <input type="file" id="zipfilesData" accept="image/png, image/jpeg"
                                                    className="border text-dark" onChange={this.handleChange} />
                                                <div style={{ textAlign: "-webkit-center" }}>
                                                    <div className="card" id="QRCard" style={{ display: "none", cursor: "default", width: "18rem" }}>
                                                        <img src={this.state.file} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row" style={{ padding: "5px 20px" }}>
                                            <div className="col-12" style={{ textAlign: "center" }}>
                                                <label
                                                    className="u1"
                                                    style={{
                                                        color: "#00264d",
                                                        fontFamily: "Poppins,sans-serif",
                                                        fontWeight: "500",
                                                        fontSize: "14px",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    OR
                                                </label>
                                            </div>
                                        </div>
                                        <div className="row" style={{ padding: "5px 20px" }}>
                                            <div className="col-12" style={{ textAlign: "center" }}>
                                                <button className="btn text-white" style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.captureImage}><FaCamera /> Capture Aadhar QR Image</button>
                                            </div>
                                        </div>

                                        <div className="row" style={{ padding: "0px 20px" }}>
                                            <div className="col-12">
                                                <label
                                                    className="u2"
                                                    style={{
                                                        color: "#00264d",
                                                        fontFamily: "Poppins,sans-serif",
                                                        fontWeight: "500",
                                                        fontSize: "14px",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    Mobile Number *
                                                </label>
                                                <input
                                                    type='number'
                                                    className='form-control'
                                                    id="mobile"
                                                    onChange={this.mobilenumber}
                                                    minLength={10}
                                                    maxLength={10}
                                                    style={{
                                                        borderRadius: "5px",
                                                        backgroundColor: "whitesmoke",
                                                        marginTop: "-10px",
                                                        border: "1px solid rgb(0, 121, 191)",
                                                        color: "#00264d",
                                                    }}
                                                    placeholder="Enter Mobile Number"
                                                />
                                                {(this.state.invalidMnum) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Mobile Number</span> : ''}
                                            </div>
                                        </div>

                                        <div className='row' style={{ padding: "5px 20px" }}>
                                            <div className='col' style={{ textAlign: "end" }}>
                                                <button className=" btn btn-sm text-white" id="AQkycSubmitBtn" onClick={this.uploadAadharQR}
                                                    style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button>
                                                &nbsp;
                                                <button className=" btn btn-sm text-white" onClick={this.cancelUpload}
                                                    style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <button type="button" id="captureImageModal1" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter31" style={{ display: "none" }}>
                    image
                </button>
                <div class="modal fade" data-backdrop="static" id="exampleModalCenter31" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content" id='uploadInvoiceFirst'>
                            <div class="modal-body" style={{ cursor: "default" }}>
                                <div className='row'>
                                    <div className='col-10'>
                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Capture The Aadhar QR Image</p>
                                        <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
                                    </div>
                                    <div className="col-2">
                                        <FaTimesCircle type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ color: "rgb(5, 54, 82)", fontSize: "18px" }} onClick={this.closeCircle} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div>
                                        <p style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>Webcam Capture and Crop</p>
                                        {enableWebcam && (
                                            <div>
                                                {!capturedImage ? (
                                                    <>
                                                        <Webcam
                                                            audio={false}
                                                            ref={this.webcamRef}
                                                            screenshotFormat="image/jpeg"
                                                            width="100%"
                                                            videoConstraints={videoConstraints}
                                                        />
                                                        <button className="btn text-white" style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.capture}>Capture Photo</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div style={{ position: 'relative', width: '100%', height: 400 }}>
                                                            <Cropper
                                                                image={capturedImage}
                                                                crop={crop}
                                                                zoom={zoom}
                                                                aspect={4 / 3}
                                                                onCropChange={this.onCropChange}
                                                                onZoomChange={this.onZoomChange}
                                                                onCropComplete={this.onCropComplete}
                                                            />
                                                        </div>
                                                        <button className="btn text-white" style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.showCroppedImage}>Crop Photo</button>
                                                    </>
                                                )}
                                                {croppedImage && (
                                                    <div>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Cropped Image</p>
                                                        <img src={croppedImage} alt="Cropped" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(136, 189, 72)", paddingLeft: "10px", paddingRight: "10px" }} onClick={this.saveThecroppedImage}>Save</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default withTranslation()(OnboardAadharQR);