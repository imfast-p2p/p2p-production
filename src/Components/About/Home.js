import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Chatbot from '../Chatbot/Chatbot';
import Image1 from '../assets/img1.png';
import Image2 from '../assets/img2.png';
import Image6 from '../assets/img6.jpg';
import './Home.css';
import { withTranslation } from 'react-i18next';
//updated
class Home extends Component {
    componentDidMount(){
        if (sessionStorage.getItem("status")) {
            sessionStorage.removeItem('status');
            sessionStorage.clear()
            sessionStorage.clear();
            console.log(sessionStorage)
        }
    }
    render() {
        const { t } = this.props
        return (
            <div className="home container-fluid">
                {/* <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={Image1} className="d-block w-100" alt="..." />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>{t('Peer-to-Peer')}</h5>
                                <p>{t('3 key benefits of world className P2PL system - Speed & Scale,Transparency,Democratization')}</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src={Image2} className="d-block w-100" alt="..." />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>{t('P2PL')}</h5>
                                <p>{t('P2PL lending is a form of direct lending of money to individuals or businesses without an official financial institution participating as an intermediary in the deal.')}</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src={Image6} className="d-block w-100" alt="..." />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>{t('How it works?')}</h5>
                                <p>{t('to P2PL service is a decentralized platform whereby two individuals interact directly with each other, without intermediation by a third party.')}</p>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">{t('Previous')}</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">{t('Next')}</span>
                    </button>
                </div> */}

                <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                    <ol class="carousel-indicators">
                        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                    </ol>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src={Image1} className="d-block w-100" alt="..." />
                            <div class="carousel-caption d-none d-md-block">
                                <h5>{t('Peer-to-Peer')}</h5>
                                <p>{t('3 key benefits of world class P2PL system - Speed & Scale,Transparency,Democratization')}</p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src={Image2} className="d-block w-100" alt="..." />
                            <div class="carousel-caption d-none d-md-block">
                                <h5>{t('P2PL')}</h5>
                                <p>{t('P2PL lending is a form of direct lending of money to individuals or businesses without an official financial institution participating as an intermediary in the deal.')}</p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src={Image6} className="d-block w-100" alt="..." />
                            <div class="carousel-caption d-none d-md-block">
                                <h5>{t('How it works?')}</h5>
                                <p>{t('to P2PL service is a decentralized platform whereby two individuals interact directly with each other, without intermediation by a third party.')}</p>
                            </div>
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>

                <Chatbot />
            </div>

        )
    }
}

export default withTranslation()(Home)
