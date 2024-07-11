import React, { Component } from 'react';
import './Contact.css';
import { Form, FormGroup, Button } from 'react-bootstrap';
import image from '../assets/Contact1.jpg';
import * as BiIcons from "react-icons/bi";
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Footer from '../Others/Footer';
//updated

class Contact extends Component {
    backFromContact = () => {
        console.log('button clicked');
        if (sessionStorage.getItem('userType') == 2) {
            window.location = "/lenderdashboard";
        } else if (sessionStorage.getItem('userType') == 3) {
            window.location = "/borrowerdashboard";
        } else if (sessionStorage.getItem('userType') == 4) {
            window.location = "/facilitatorDashboard";
        } else if (sessionStorage.getItem('userType') == 5) {
            window.location = "/evaluatorDashboard";
        } else if (sessionStorage.getItem('userType') == 1) {
            window.location = "/sysUserDashboard";
        } else if (sessionStorage.getItem('userType') == 0) {
            window.location = "/landing";
        }else{
            window.location = "/";
        }
    };

    render() {
        const { t } = this.props
        return (
            <div className="navItem contact container-fluid">
                
                <button style={{width:"100px"}} onClick={this.backFromContact}  title="Navigate to previous page"> Back </button>
                <div className="row">
                    <div class="Contact container-fluid">
                        <h1 className="Header-contact">{t('We Are Here To Help')}</h1>

                    </div>
                </div>
                <div className="row" style={{ backgroundColor: 'white' }}>
                    <div className="Contact-text container-fluid">
                        <div className="row">
                            <div className="col-md-4 col-lg-4 col-sm-4">
                                <h4>{t('OF1')}</h4>
                                <p>{t('AD1')}<br />
                                    Telephone :&nbsp;+91 80 46632400 / +91 22250073 / +91 22257027<br />
                                    Fax: +91-80-28565800<br />
                                    Email: info@imfast.in</p>
                            </div>
                            <div className="col-md-4 col-lg-4 col-sm-4">
                                <h4>{t('OF2')}</h4>
                                <p>{t('AD2')}<br />
                                    Tel: +91-80 22250073, 22257027<br />
                                    Fax: +91-80-22203928<br />
                                    Email: info@imfast.in</p>
                            </div>
                            <div className="col-md-4 col-lg-4 col-sm-4">
                                <h4>{t('OF3')}</h4>
                                <p>{t('AD3')}<br />
                                    Telephone :&nbsp;+91 80 46632400 / +91 22250073 / +91 22257027<br />
                                    Fax: +91-80-28565800<br />
                                    Email: info@imfast.in</p>
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-md-6 col-lg-6 col-sm-6">
                                <img class="card-img" height="100%" src={image} alt="Card image" />
                            </div>
                            <div className="col-md-6 col-lg-6 col-sm-6">
                                <h4>{t('Enquiry Form')} </h4>
                                <br />
                                <Form>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">

                                        <Form.Control type="email" placeholder="Enter Name" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">

                                        <Form.Control type="email" placeholder={t('Enter Email Id')} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">

                                        <Form.Control type="number" placeholder={t('Enter Phone Number')} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">

                                        <Form.Control placeholder={t('Write Your Message Here')} as="textarea" rows={3} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" label="I'm not a robot" />
                                    </Form.Group>
                                    <Button variant="secondary" type="submit">
                                        {t('Submit')}
                                    </Button>
                                </Form>
                            </div>
                        </div>
                        <br />
                        {/* <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <h4 className="mb-5">{t('Marketing and Support centres')}</h4>
                                <div className="row">
                                    <div className="col-md-4 col-sm-6">
                                        <h5>{t('Bangalore')}</h5>
                                        <p>{t('F Block,')}<br />
                                            {t('60 Feet Main Road, Sahakar Nagar,')}<br />
                                            {t('Bangalore - 560092')}<br />
                                            Tel: +91-80-23624594</p>
                                    </div>
                                    <div className="col-md-4 col-sm-6">
                                        <h5>{t('New Delhi')}</h5>
                                        <p>{t('DTJ 220-221,')}<br />
                                            {t('2nd floor, DLF Tower B,')}<br />
                                            {t('Jasola, New Delhi - 110025')}<br />
                                            Tel: +91-1147671310(15)</p>
                                    </div>
                                    <div className="col-md-4 col-sm-6">
                                        <h5>{t('Mumbai')}</h5>
                                        <p>{t('MIDC Plot No. 107,')}<br />
                                            {t('Millennium Business Park, Building No. 3,')}<br />
                                            {t('Sector 3, MIDC Mahape,')}<br />
                                            {t('Navi Mumbai - 400701')}<br />
                                            Tel: +91-22-27781152 (53)</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <br /> */}
                        <Footer></Footer>
                        {/* <div class="row fixed-row-bottom">
                            <div className="row">
                                <div className="col-md-3 col-lg-3 col-sm-3"></div>
                                <div className="col-md-6 col-lg-6 col-sm-6">
                                    <img src="https://www.integramicro.com/images/cmmi.png" width="100%" height="50%" />
                                </div>
                                <div className="col-md-3 col-lg-3 col-sm-3"></div>
                            </div>
                            <div className="row">
                                <div className="col-md-4 col-lg-4 col-sm-4">
                                    <h5 className="header-about">{t('Group Companies')}</h5>
                                    <h5 className="header-about">{t('Integra Micro Software Services (P) Ltd.')}</h5>
                                    <br />
                                    <p className="footer">{t('Mobile Apps, Enterprise Solution, Mobile Finance, BPM & K2, Integrated Tsting, Consulting & Outsourcing.')}</p>
                                    <h5 className="header-about">{t('Jakkur Technoparks Private Limited.')}</h5>
                                    <p className="footer">{t('Provider of insurance services')}</p>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-4">
                                    <h5 className="header-about">{t('Partner Company')}</h5>
                                    <h5 className="header-about">{t('i25 Rural Commerce Services')}</h5>
                                    <br />
                                    <p className="footer">{t('i25 Rural Mobile Commerce Services (i25 RMCS) provides last mile operations in urben, semi-urban and rural areas.')}</p>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-4">
                                    <h5 className="header-about">{t('Integra Micro Systems (P)Ltd.')}</h5>
                                    <br />
                                    <p className="footer">{t('Integra is a leader provider of innovative hi-tecnology products and solution in the')}</p>
                                    <p className="footer">{t('Government BFSI and telecom space, with a focus on India and Africa.')}</p>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 col-lg-6 col-sm-6" style={{ display: 'flex' }}>
                                        <h5 className="header-about mt-3">{t('Follow Us')}</h5>
                                        <a href="#" class="fa fa-facebook"></a>
                                        <a href="#" class="fa fa-twitter"></a>
                                        <a href="#" class="fa fa-google"></a>
                                    </div>
                                    <div className="col-md-6 col-lg-6 col-sm-6">
                                        <Button style={{ float: 'right' }} variant="info">{t('Want to become Partner?')}</Button>{' '}
                                    </div>
                                </div>
                                <hr style={{ color: 'white' }} />
                                <div className="row">
                                    <div className="col-md-12 col-lg-12 col-sm-12">
                                        <p className="info">@2021 Integra Micro Systm (P) Ltd</p>
                                        <p className="info">All product names,logos, and brands are the property of their respective owners.</p>
                                        <p className="info">All company, product and services names in this website are for identification purposes only.</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                    </div>
              </div>
                <div className="position-fixed bottom-0 end-0 mr-3">
                    <Link to="/supportDesk">
                        <a className="nav-link" href="#">
                            <button className="btn btn-primary"><span className="mr-2"><BiIcons.BiSupport className="icon" /></span>Support</button>
                        </a>
                    </Link>
                </div>
            </div >
        )
    }
}

export default withTranslation()(Contact)
