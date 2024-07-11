import React, { Component } from 'react';
import './FAQ.css';
import { Button } from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import imageIcon from '../assets/FAQIcon.gif';
import About2 from "../assets/about1.jpg";
import { withTranslation } from 'react-i18next';
//updated
class FAQ extends Component {
    render() {
        const { t } = this.props
        return (
            <div className="navItem faq container-fluid">
                <div className="row">
                    <div class="FAQ container-fluid">
                        <h1 className="Title-Faq">{t('Frequently Asked Questions')}</h1>
                        {/* <img src={imageIcon} width= '50px' height="50px" /> */}
                    </div>
                </div>
                <div className="text-questions container">
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <Card border="primary">
                                <Card.Body>
                                    <Card.Title>{t('Q1')}</Card.Title>
                                    <Card.Text>
                                        {t('A1')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <Card border="secondary">
                                <Card.Body>
                                    <Card.Title>{t('Q2')}</Card.Title>
                                    <Card.Text>
                                        {t('A2')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <Card border="success">
                                <Card.Body>
                                    <Card.Title>{t('Q3')}</Card.Title>
                                    <Card.Text>
                                        {t('A3')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <Card border="danger">
                                <Card.Body>
                                    <Card.Title>{t('Q4')}</Card.Title>
                                    <Card.Text>
                                        {t('A4')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <Card border="warning">
                                <Card.Body>
                                    <Card.Title>{t('Q5')}</Card.Title>
                                    <Card.Text>
                                        {t('A5')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <Card border="info">
                                <Card.Body>
                                    <Card.Title>{t('Q6')}</Card.Title>
                                    <Card.Text>
                                        {t('A6')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <Card border="dark">
                                <Card.Body>
                                    <Card.Title>{t('Q7')}</Card.Title>
                                    <Card.Text>
                                        {t('A7')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <Card border="primary">
                                <Card.Body>
                                    <Card.Title>{t('Q8')}</Card.Title>
                                    <Card.Text>
                                        {t('A8')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <Card border="secondary">
                                <Card.Body>
                                    <Card.Title>{t('Q9')}</Card.Title>
                                    <Card.Text>
                                        {t('A9')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <Card border="success">
                                <Card.Body>
                                    <Card.Title>{t('Q10')}</Card.Title>
                                    <Card.Text>
                                        {t('A10')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <Card border="danger">
                                <Card.Body>
                                    <Card.Title>{t('Q11')}</Card.Title>
                                    <Card.Text>
                                        {t('A11')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <Card border="warning">
                                <Card.Body>
                                    <Card.Title>{t('Q12')}</Card.Title>
                                    <Card.Text>
                                        {t('A12')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <div className="row">
                        <h4 className="About-text-header">{t('What is ILP-P2P')}</h4>
                        <div className="row internal">
                            <Card border="warning">
                                <Card.Body>
                                    <Card.Text>
                                        {t('W1')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="row internal">
                            <Card border="secondary">
                                <Card.Body>
                                    <Card.Text>
                                        {t('W2')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="row internal">
                            <Card border="success" >
                                <Card.Body>
                                    <Card.Text>
                                        {t('W3')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="row internal">
                            <Card border="info">
                                <Card.Body>
                                    <Card.Text>
                                        {t('W4')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="row internal">
                            <Card border="light">
                                <Card.Body>
                                    <div className="row ">
                                        <div className="col-md-6 col-lg-6 col-sm-6">
                                            <Card.Img variant="top" src={About2} />
                                        </div>
                                        <div className="col-md-6 col-lg-6 col-sm-6">
                                            <Card.Body className="p-0">
                                                <Card.Title>{t('Such lending works in a simple way:')}</Card.Title>
                                                <Card.Text>
                                                    <p class="card-text">{t('Such-P1')}</p>
                                                    <p class="card-text">{t('Such-P2')}</p>
                                                    <p class="card-text collapse" id="collapseExample">{t('Such-P3')}</p>
                                                    <p class="card-text collapse" id="collapseExample">{t('Such-P4')}</p>
                                                    <p class="card-text collapse" id="collapseExample">{t('Such-P5')}</p>
                                                    <a href="#" data-toggle="collapse" data-target="#collapseExample" class="btn btn-primary">{t('Read More')}</a>
                                                </Card.Text>
                                            </Card.Body>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
                <br />
            </div>
        )
    }
}

export default withTranslation()(FAQ)
