import React, { Component, createRef } from "react";
import { BASEURL } from '../assets/baseURL';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from "react-confirm-alert";
import Loader from '../Loader/Loader';
import { FaFolderPlus, FaTimesCircle, FaCamera, FaAngleLeft } from "react-icons/fa";
import { Card, Container, Row, Col } from 'react-bootstrap';
import { BsInfoCircle } from "react-icons/bs";
import Webcam from 'react-webcam';
import Cropper from 'react-easy-crop';
import { Link } from 'react-router-dom';

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
export class AadharQR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileno: "",
            utype: "",
            kycmode: "4",
            reId: "",
            file: "",

            invalidMnum: false,
            showLoader: false,
            options: ['Lender', 'Borrower', 'Facilitator', 'Evaluator'],

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
    handleChange = (e) => {
        $("#QRCard").show();
        console.log(e.target.files);
        this.setState({ file: URL.createObjectURL(e.target.files[0]) })
    }
    utype = (event) => {
        if (event.target.value == "Lender") {
            this.setState({ utype: "2" })
        } else if (event.target.value == "Borrower") {
            this.setState({ utype: "3" })
        } else if (event.target.value == "Facilitator") {
            this.setState({ utype: "4" })
        } else if (event.target.value == "Evaluator") {
            this.setState({ utype: "5" })
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
        var qrformData = new FormData();
        var qrfileField = document.querySelector("input[type='file']");

        var bodyData = JSON.stringify({
            mobileno: this.state.mobileno,
            utype: this.state.utype,
            kycmode: this.state.kycmode,
        });

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
                    sessionStorage.setItem("referenceID", resdata.msgdata.referenceid);
                    //alert(resdata.message);
                    // window.location = '/manualRegistration';
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
                                        pathname: '/manualRegistration',
                                        frompath: 'aadhaarQR',
                                        state: {
                                            aadhaarQR: data1
                                        }
                                    })
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });

                } else {
                    // alert(resdata.message + " " + "Please try with other methods.");
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
                }
            }).catch(error => console.log(error)
            );

    }
    cancelUpload = () => {
        window.location.reload();
    }
    routeToRegistration = () => {
        $("#registrationPage").click()
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
        $("#captureImageModal").click();
        this.setState({ enableWebcam: true });
    }
    saveThecroppedImage = () => {
        $("#exampleModalCenter3").modal('hide')
    }
    render() {
        var userType;
        if (this.state.utype == 2) {
            userType = "Lender"
        } else if (this.state.utype == 3) {
            userType = "Borrower"
        } else if (this.state.utype == 4) {
            userType = "Facilitator"
        } else if (this.state.utype == 5) {
            userType = "Evaluator"
        }
        const uniqueOptions = [...new Set(this.state.options)];
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
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            marginLeft: "14px"
        }
        const { showLoader } = this.state;
        const { enableWebcam, capturedImage, crop, zoom, croppedImage } = this.state;
        return (
            <div className="row">
                {
                    showLoader && <Loader />
                }
                <Container fluid className="d-flex justify-content-center">
                    <Row>
                        <Col>
                            <Card className="" style={{ marginLeft: "8px", paddingBottom: "10px", cursor: "default" }}>
                                <div style={{ textAlign: "initial", marginLeft: "5px" }}>
                                    {/* Route to Registration */}
                                    <Link to="/registration"><button id='registrationPage' style={myStyle}>Back
                                    </button></Link>

                                </div>
                                <div
                                    style={{
                                        display: "flex", flexDirection: "row",
                                        alignItems: "center",
                                        marginTop: "-10px",
                                        paddingLeft: "20px",
                                        paddingRight: "20px",
                                    }}
                                >
                                    <div
                                        style={{
                                            flex: 1,
                                            height: "3px",
                                            backgroundColor: "#004d99",
                                        }}
                                    />
                                    <div>
                                        <h4 className="heading1" style={{
                                            color: "#00264d",
                                            fontSize: "15px",
                                            fontFamily: "Poppins,sans-serif",
                                            fontWeight: "600"
                                        }}>
                                            Aadhaar QR
                                        </h4>
                                    </div>
                                    <div
                                        style={{
                                            flex: 1,
                                            height: "3px",
                                            backgroundColor: "#004d99",
                                        }}
                                    />
                                </div>
                                <div
                                    className="heading2"
                                    style={{
                                        textAlign: "center",
                                        paddingTop: "10px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <label style={{
                                        color: "#00264d",
                                        fontFamily: "Poppins,sans-serif",
                                        fontWeight: "500",
                                        fontSize: "14px",
                                        fontWeight: "600"
                                    }}>
                                        Register As
                                    </label>{" "}
                                    &nbsp;
                                    <select
                                        ref={this.selectRef}
                                        className="form-select"
                                        onChange={this.utype}
                                        value={this.state.utype}
                                        style={{
                                            border: "1px solid rgb(0, 121, 191)",
                                            borderRadius: "5px",
                                            backgroundColor: "whitesmoke",
                                            width: "250px",
                                            marginTop: "-10px",
                                            fontFamily: "Poppins,sans-serif"
                                        }}
                                    >
                                        {this.state.utype ? (
                                            userType && (
                                                <option key={userType} value={userType} style={{ color: "#00264d" }}>
                                                    {userType}
                                                </option>
                                            )
                                        ) : (
                                            <option defaultValue="" style={{ color: "#00264d", textAlign: "center" }} >
                                                --Select--
                                            </option>
                                        )}
                                        {uniqueOptions.map(option => (
                                            option !== userType && (
                                                <option key={option} value={option} style={{ color: "#00264d" }}>
                                                    {option}
                                                </option>
                                            )
                                        ))}
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
                                        <button className=" btn justify-center text-white" id="AQkycSubmitBtn" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.uploadAadharQR}>Sign Up</button>
                                        &nbsp;
                                        <button className=" btn justify-center text-white" style={{ backgroundColor: "#0079BF" }} onClick={this.cancelUpload}>Cancel</button>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                <button type="button" id="captureImageModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3" style={{ display: "none" }}>
                    image
                </button>
                <div class="modal fade" data-backdrop="static" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
        )
    }
}
export default AadharQR;
