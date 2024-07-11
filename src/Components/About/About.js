import React, { Component } from 'react';
import "./About.css";
import Card from "react-bootstrap/Card";
import { CardGroup, Button } from 'react-bootstrap';
import Image from '../assets/home-about.png';
import Brand from '../assets/brands.png';
import Branding from '../assets/branding.png';
import Commerce from '../assets/commerce.png';
import developer from '../assets/developer.png';
import Social from '../assets/social.png';
import Web from '../assets/web.png';
import { withTranslation } from 'react-i18next';


class About extends Component {
    render() {
        //updated
        const { t } = this.props
        return (
            <div className="main-content  container-fluid mb-2">
                <div className="row">
                    <div class="About container-fluid">
                        <div className="header mt-5">
                            <h1 className="header-title">{t('About Us')}</h1>
                            <h2 className="header-title ml-1"><u>{t('iMFAST')}</u></h2>
                            <h5 className="header-sub-title pb-3">{t('Smart Transaction Systems')}</h5>

                            <h5 className="header-sub-title">{t('Biometric Authentication')}</h5>
                            <h5 className="header-sub-title">{t('Smart Card Identity')}</h5>
                            <h5 className="header-sub-title">{t('Mobile Communication')}</h5>
                            <h5 className="header-sub-title">{t('Local Voice Guidance & Printing')}</h5>
                            <h5 className="header-sub-title pb-5">{t('GPS Integration')}</h5>
                        </div>
                    </div>
                </div>
                <div className="text-about card">
                    <div className="row">
                        <h4 clasName="text-about">{t('Information')}</h4>
                    </div>
                    <div className="row">
                        <p className="text-about">{t('P1')}</p>
                    </div>
                    <div className="row">
                        <p className="text-about">{t('P2')}</p>
                    </div>
                    <div className="row">
                        <p className="text-about">{t('P3')}</p>
                    </div>
                    <div className="row">
                        <p className="text-about">{t('P4')}</p>
                    </div>
                    <div className="row">
                        <p className="text-about">{t('t(P5')}</p>
                    </div>
                </div>
                <div className="The Faircent Experience">
                    <div className="row">

                        <CardGroup>
                            <Card className="data-demo1" style={{ alignItems: 'center', backgroundColor: 'black' }}>
                                {/* <div class="wrapper">
                                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" class="image--cover" />
                                </div> */}
                                <Card.Body>

                                    <Card.Text>
                                        <h4 className="header-text">{t('B1')}</h4>
                                        <br />
                                        <p className="inner-text">{t('B1-t')}</p>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className="data-demo2" style={{ alignItems: 'center', backgroundColor: '#00acc1' }}>
                                {/* <div class="wrapper">
                                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" class="image--cover" />
                                </div> */}
                                <Card.Body>

                                    <Card.Text>
                                        <h4 className="header-text">{t('B2')}</h4>
                                        <br />
                                        <p className="inner-text">{t('B2-t')}</p>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className="data-demo3" style={{ alignItems: 'center', backgroundColor: '#00838f' }}>
                                {/* <div class="wrapper">
                                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" class="image--cover" />
                                </div> */}
                                <Card.Body>

                                    <Card.Text>
                                        <h4 className="header-text">{t('B3')}</h4>
                                        <br />
                                        <p className="inner-text">{t('B3-t')}</p>
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                        </CardGroup>
                    </div>
                    <div className="row">
                        <CardGroup>
                            <Card className="data-logic" style={{ alignItems: 'center', backgroundColor: 'white' }}>
                                <div class="wrapper">
                                    <img src={Image} alt="" class="image--cover" />
                                </div>
                                <Card.Body>

                                    <Card.Text>
                                        <h4 className="header-sub">{t('Company')}</h4>
                                        <br />
                                        <p className="inner-sub">{t('Company-t')} </p>
                                        <div className="button-demo">
                                            <Button variant="outline-secondary">{t('Read More')}</Button>{' '}
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                        </CardGroup>
                    </div>
                    <div className="row">
                        <CardGroup>
                            <div class="card">
                                <div class="card-horizontal">
                                    <div class="img-square-wrapper">
                                        <img class="image-text" src="https://www.business.com/images/content/5fa/0b51f7b43747c5e8b4567/1500-0-" alt="Card image cap" />
                                    </div>
                                    <div class="card-body" style={{ backgroundColor: '#00acc1', width: 'fit-content' }}>
                                        <h4 class="card-title inside">{t('Doing the right thing at the right time.')}</h4>
                                        <br />
                                        <p class="card-text inside">{t('Doing-t')}</p>
                                        {/* <div className="button-demo">
                                            <Button variant="outline-secondary">Read More</Button>{' '}
                                        </div> */}
                                    </div>
                                </div>
                            </div>

                        </CardGroup>
                    </div>
                    <div className="row">
                        <CardGroup>
                            <Card style={{ alignItems: 'center' }}>
                                <div class="wrapper">
                                    <img src={Brand} alt="" style={{ width: '100%', height: '100%' }} class="image--cover" />
                                </div>
                                <Card.Body>
                                    <Card.Title>{t('Branding')}</Card.Title>
                                    <Card.Text>
                                        {t('Branding-t')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Card style={{ alignItems: 'center' }}>
                                <div class="wrapper">
                                    <img src={Branding} style={{ width: '100%', height: '100%' }} alt="" class="image--cover" />
                                </div>
                                <Card.Body>
                                    <Card.Title>{t('deploying')}</Card.Title>
                                    <Card.Text>
                                        {t('deploying-t')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Card style={{ alignItems: 'center' }}>
                                <div class="wrapper">
                                    <img src={developer} style={{ width: '100%', height: '100%' }} alt="" class="image--cover" />
                                </div>
                                <Card.Body>
                                    <Card.Title>{t('Developement')}</Card.Title>
                                    <Card.Text>
                                        {t('Developement-t')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                        </CardGroup>
                    </div>
                    <div className="row">
                        <CardGroup>
                            <Card style={{ alignItems: 'center' }}>
                                <div class="wrapper">
                                    <img src={Web} style={{ width: '100%', height: '100%' }} alt="" class="image--cover" />
                                </div>
                                <Card.Body>
                                    <Card.Title>{t('Web Design')}</Card.Title>
                                    <Card.Text>
                                        {t('Web Design-t')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Card style={{ alignItems: 'center' }}>
                                <div class="wrapper">
                                    <img src={Social} style={{ width: '100%', height: '100%' }} alt="" class="image--cover" />
                                </div>
                                <Card.Body>
                                    <Card.Title>{t('Social Media')}</Card.Title>
                                    <Card.Text>
                                        {t('Social Media-t')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Card style={{ alignItems: 'center' }}>
                                <div class="wrapper">
                                    <img src={Commerce} style={{ width: '100%', height: '100%' }} alt="" class="image--cover" />
                                </div>
                                <Card.Body>
                                    <Card.Title>{t('Ecommerce')}</Card.Title>
                                    <Card.Text>
                                        {t('Ecommerce-t')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                        </CardGroup>
                    </div>
                    <div className="row">
                        <CardGroup>
                            <Card className="data-demo1" style={{ alignItems: 'center', backgroundColor: '#00acc1' }}>
                                {/* <div class="wrapper">
                                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" class="image--cover" />
                                </div> */}
                                <Card.Body>

                                    <Card.Text>
                                        <div className="row">
                                            <div className="col-sm-10 col-md-10 col-lg-10">
                                                <h4 style={{ color: 'white' }}>{t('Get to Know todays!')}</h4>
                                                <br />
                                                <p style={{ color: 'white' }}>
                                                    {t('Get to Know todays!-t')}
                                                </p>
                                            </div>
                                            <div className="col-sm-2 col-md-2 col-lg-2">
                                                <Button style={{ marginTop: '33px' }} variant="light">{t('Read More')}</Button>
                                            </div>
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>


                        </CardGroup>
                    </div>
                </div>
            </div>

        )
    }
}

export default withTranslation()(About)
