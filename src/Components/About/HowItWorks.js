import React, { Component } from 'react';
import './HowItWorks.css';
import { Card, Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import carouselImg1 from '../assets/carousel-img1.jpg';
import carouselImg2 from '../assets/carosel-img2.jpg';
import carouselImg3 from '../assets/carosel-img3.jpg';
import carouselImg4 from '../assets/carosel-img4.jpg';
import carouselImg5 from '../assets/carousel-img5.jpg';
import carouselImg6 from '../assets/carousel-img6.jpg';
import carouselImg7 from '../assets/carousel-img7.jpeg';
import { CardGroup } from 'react-bootstrap';//updated
import Review from '../assets/review.jpg';
import { withTranslation } from 'react-i18next';

// Demo styles, see 'Styles' section below for some notes on use.
//import 'react-accessible-accordion/dist/fancy-example.css';

class HowItWorks extends Component {
    render() {
        const { t } = this.props
        return (
            <div className="main-content  container-fluid mb-2">
                <div className="row">
                    <div class="HowItWords container-fluid">
                        <div className="header mt-10">
                            <h1 className="text-light">{t('How It Works')}</h1>
                        </div>
                    </div>
                </div>
                <div className="HIW-text">
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12 pl-0 pr-0">
                            <div id="accordion">
                                <div class="card">
                                    <div class="card-header" id="headingOne">
                                        <h5 class="mb-0">
                                            <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                {t('HQ1')}
                                            </button>
                                        </h5>
                                    </div>

                                    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                                        <div class="card-body">
                                            <p>{t('HQP1')}</p>
                                            <p>{t('HQP2')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="card-header" id="headingTwo">
                                        <h5 class="mb-0">
                                            <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                {t('HQ2')}
                                            </button>
                                        </h5>
                                    </div>
                                    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                        <div class="card-body">
                                            <p>{t('HQP3')}</p>
                                            <p>{t('HQP4')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="card-header" id="headingThree">
                                        <h5 class="mb-0">
                                            <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                {t('HQ3')}
                                            </button>
                                        </h5>
                                    </div>
                                    <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                                        <div class="card-body">
                                            <p>{t('HQP5')}</p>
                                            <p>{t('HQP6')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="card-header" id="headingFour">
                                        <h5 class="mb-0">
                                            <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                {t('HQ4')}
                                            </button>
                                        </h5>
                                    </div>
                                    <div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                                        <div class="card-body">
                                            <p>{t('HQP7')}</p>
                                            <p>{t('HQP8')}</p>
                                            <p>{t('HQP9')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="card-header" id="headingFive">
                                        <h5 class="mb-0">
                                            <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                                {t('HQ5')}
                                            </button>
                                        </h5>
                                    </div>
                                    <div id="collapseFive" class="collapse" aria-labelledby="headingFive" data-parent="#accordion">
                                        <div class="card-body">
                                            <p>{t('HQP10')}</p>
                                            <p>{t('HQP11')}</p>
                                            <p>{t('HQP12')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="The Faircent Experience">
                    <div className="row">
                        <h5 className="header-faircent">{t('The Faircent Experience')}</h5>

                        <CardGroup>
                            <Card style={{ alignItems: 'center' }}>
                                <div class="wrapper">
                                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" class="image--cover" />
                                </div>
                                <Card.Body>
                                    <Card.Title>{t('N1')}</Card.Title>
                                    <Card.Text>
                                        {t('NP1')}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">{t('Last updated 3 mins ago')}</small>
                                </Card.Footer>
                            </Card>
                            <Card style={{ alignItems: 'center' }}>
                                <div class="wrapper">
                                    <img src="https://i2.cdn.turner.com/cnnnext/dam/assets/140926165711-john-sutter-profile-image-large-169.jpg" alt="" class="image--cover" />
                                </div>
                                <Card.Body>
                                    <Card.Title>{t('N2')}</Card.Title>
                                    <Card.Text>
                                        {t('NP2')}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">{t('Last updated 3 mins ago')}</small>
                                </Card.Footer>
                            </Card>
                            <Card style={{ alignItems: 'center' }}>
                                <div class="wrapper">
                                    <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" class="image--cover" />
                                </div>
                                <Card.Body>
                                    <Card.Title>{t('N3')}</Card.Title>
                                    <Card.Text>
                                        {t('NP3')}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">{t('Last updated 3 mins ago')}</small>
                                </Card.Footer>
                            </Card>

                        </CardGroup>
                    </div>
                    <div className="row">
                        <CardGroup>
                            <Card style={{ alignItems: 'center' }}>
                                <div class="wrapper">
                                    <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" class="image--cover" />
                                </div>
                                <Card.Body>
                                    <Card.Title>{t('N4')}</Card.Title>
                                    <Card.Text>
                                        {t('NP4')}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">{t('Last updated 3 mins ago')}</small>
                                </Card.Footer>
                            </Card>
                            <Card style={{ alignItems: 'center' }}>
                                <div class="wrapper">
                                    <img src="https://images.pexels.com/photos/3021595/pexels-photo-3021595.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" class="image--cover" />
                                </div>
                                <Card.Body>
                                    <Card.Title>{t('N5')}</Card.Title>
                                    <Card.Text>
                                        {t('NP5')}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">{t('Last updated 3 mins ago')}</small>
                                </Card.Footer>
                            </Card>
                            <Card style={{ alignItems: 'center' }}>
                                <div class="wrapper">
                                    <img src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" class="image--cover" />
                                </div>
                                <Card.Body>
                                    <Card.Title>{t('N6')}</Card.Title>
                                    <Card.Text>
                                        {t('NP6')}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">{t('Last updated 3 mins ago')}</small>
                                </Card.Footer>
                            </Card>

                        </CardGroup>
                    </div>
                </div>
                <br />
                <div className="frequest-ask-question">
                    <div className="row">
                        <Carousel>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={carouselImg1}
                                    alt="First slide"
                                />
                                <Carousel.Caption>
                                    <h3>{t('Step 1 – Lender creates a profile')}</h3>
                                    <p>{t('A lender could create a profile with the information including:')}</p>
                                    <ul class="card-text collapse" id="collapseExample">
                                        <li>{t('Personal Information (Name, Address, and ID number)')}</li>
                                        <li>{t('Bank Account Information')}</li>
                                        <li>{t('Type of Investment a lender wants to make. For example, a lender might wish to lend money to the borrowers requesting a loan for the business purposes.')}</li>
                                        <li>{t('Criteria for different types of borrower, i.e., setting up the rate of interests according to the worthiness of a borrower.')}</li>
                                    </ul>
                                    <p>{t('The profile is submitted to the marketplace where lenders and borrowers could find each other.')}</p>
                                    <a href="#" data-toggle="collapse" data-target="#collapseExample" class="btn btn-primary">{t('RM')}</a>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={carouselImg2}
                                    alt="Second slide"
                                />

                                <Carousel.Caption>
                                    <h3>{t('Step 2 – Lender waits for the loan requests')}</h3>
                                    <p>{t('Once the account is successfully created, lender waits for the loan requests from the borrower. As soon as any request is received, the lender schedules an interview with the borrower.')}</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={carouselImg3}
                                    alt="Third slide"
                                />

                                <Carousel.Caption>
                                    <h3>{t('Step 3 – Borrower creates an account')}</h3>
                                    <p>{t('A borrower setups an account with the following information:')}</p>
                                    <ul>
                                        <li>{t('Personal Information including name, address, and government-approved ID')}</li>
                                        <li>{t('Collateral- Crypto-coins, legal documents, and a guarantor.')}</li>
                                    </ul>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={carouselImg4}
                                    alt="Third slide"
                                />

                                <Carousel.Caption>
                                    <h3>{t('Step 4 – Borrower sends a request for the loan')}</h3>
                                    <p>{t('After creating the account successfully, a borrower can send the loan request to all lenders around the world. Smart contracts allow borrowers to send loan requests to the lenders who are interested in the type of investment a borrower wants to make.')}</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={carouselImg5}
                                    alt="Third slide"
                                />

                                <Carousel.Caption>
                                    <h3>{t('Step 5 – Lender interviews the borrower')}</h3>
                                    <p>{t('After receiving the loan request, a lender interviews borrower and asks the following questions:')}</p>
                                    <ul class="card-text collapse" id="collapseExample">
                                        <li>{t('Why do you want to take the loan?')}</li>
                                        <li>{t('What is your monthly earning?')}</li>
                                        <li>{t('What is your repayment rate?')}</li>
                                        <li>{t('How many times have you applied for the credit in history?')}</li>
                                    </ul>
                                    <p>{t('A lender can either approve or reject the loan application based on the above questions.')}</p>
                                    <a href="#" data-toggle="collapse" data-target="#collapseExample" class="btn btn-primary">Read More</a>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={carouselImg6}
                                    alt="Third slide"
                                />

                                <Carousel.Caption>
                                    <h3>{t('Step 6 – Smart Contract fixes the rate of interest')}</h3>
                                    <p>{t('If the lender approves the loan request, the smart contract decides the fixed rate of interest for different types of borrowers by checking their creditworthiness.')}<br />
                                    </p><p class="card-text collapse" id="collapseExample">{t('The borrowers can be categorized as high-risk, medium-risk or low-risk borrowers based on their repayment rates.')}
                                        <br />
                                        {t('For example, lenders can set the low rate of interest for a low-risk borrower having good repayment rate.')}<br />
                                        {t('Using ')}
                                        <b>{t('ILP-P2P Blockchain')}</b> {t(' Platform, the rate of interests remain fixed all over the world.')}</p>
                                    <a href="#" data-toggle="collapse" data-target="#collapseExample" class="btn btn-primary">{t('')}Read More</a>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={carouselImg7}
                                    alt="Third slide"
                                />

                                <Carousel.Caption>
                                    <h3>{t('Step 7 – Auto-payments using Smart Contracts')}</h3>
                                    <p>{t('Borrowers can make the payments using smart contracts embedded with a crypto-wallet. If a borrower does not pay installments timely, the smart contract adds late fees to the actual amount and upgrades it on the ledger.')}<br />
                                        {t('So, if a borrower abides by the terms of the loan, the smart contract would automatically deduct penalties.')}<br /></p>
                                    <p class="card-text collapse" id="collapseExample">{t('P2P lenders using blockchain can help reduce delays, make quick approvals, eliminate the need for middlemen, and bring transparency.')} <br />
                                        {t('Blockchain-based ILP-P2P platforms allow investors to approve loans against residential properties, but the value of properties don’t remain stable always.')}<br />
                                        {t('Moreover, the collateral provided by the borrower is not verified by a legal authority while lending money through the P2P platform. But the credibility can never be changed as smart contracts enable auto-payment and enforce compliances.')}
                                    </p>
                                    <a href="#" data-toggle="collapse" data-target="#collapseExample" class="btn btn-primary">{t('RM')}</a>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
            </div>

        )
    }
}

export default withTranslation()(HowItWorks)
