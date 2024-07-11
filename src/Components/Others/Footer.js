import React, { Component } from 'react'
// import '@wordpress/block-library/build-style/style.css';
// import '@fortawesome/fontawesome-free/css/all.css';
import * as FaIcons from "react-icons/fa";
import './Footer.css'
import { BASEURL } from '../assets/baseURL';
import { BASEURLDLP } from '../assets/baseURL';

export class Footer extends Component {
  render() {
    return (
      <div>
        <div className="absolute">
          <div className="footer">
            <div className="footer-body">
              <div className="row">
                <div className="bg-dark">
                  <footer id="tp-colophon" className="tp-site-footer footer-style1">
                    {" "}
                    <div id="tp-main-footer">
                      <div className="tp-container">
                        <div className="tp-main-footer">



                          <div className="tp-footer tp-footer1">
                            <aside id="block-3" className="widget widget_block">
                              <h2 className="wp-block-heading">
                                <span style={{ textDecoration: "underline" }}>Policies</span>
                              </h2>
                            </aside>
                            <aside id="block-10" className="widget widget_block">
                              <ul>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/rbi-guidelines-disclaimer/`}

                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/rbi-guidelines-disclaimer/"
                                  >
                                    Terms of Use
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/grievances-redressal`}
                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/grievances-redressal"
                                  >
                                    Grievance Redressal
                                  </a>
                                </li>
                                <li>
                                  <a href={`${BASEURLDLP}/privacy-security-policy/`}>
                                    Privacy &amp; Security Policy
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/fair-practices-code`}
                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/fair-practices-code"
                                  >
                                    Fair Practices Code
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/credit-appraisal-and-risk-profiling/`}
                                    data-type="link"
                                    data-id="dlp.imfast.in/credit-appraisal-and-risk-profiling/"
                                  >
                                    Credit Appraisal and Risk Profiling
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/rbi-disclaimer`}
                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/rbi-disclaimer"
                                  >
                                    RBI Disclaimer
                                  </a>
                                </li>
                                <li>
                                  <a href={`${BASEURLDLP}/participants-eligibility-criteria/`}>
                                    Participant Terms and Conditions
                                  </a>
                                </li>
                              </ul>
                            </aside>
                          </div>

                          <div className="tp-footer tp-footer2">
                            <aside id="block-72" className="widget widget_block">
                              <h2 className="wp-block-heading">
                                <span style={{ textDecoration: "underline" }}>Borrowers</span>
                              </h2>
                            </aside>
                            <aside id="block-16" className="widget widget_block">
                              <ul>
                                <li>
                                  <a href={`${BASEURLDLP}/borrower-p2p-loan/`}>
                                    P2P Loan &amp; Eligibility
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/p2p-lender-documentation-eligibility-2/`}
                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/p2p-lender-documentation-eligibility-2/"
                                  >
                                    Type of P2P Loans
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/borrower-charges-fees`}
                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/borrower-charges-fees"
                                  >
                                    Platform Charges and Fees
                                  </a>
                                </li>
                                <li>P2P Loan Interest Rates</li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/borrower-declaration-on-registration/`}
                                    data-type="link"
                                    data-id="https://dlp.imfast.in/borrower-declaration-on-registration/"
                                  >
                                    Borrower declaration
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/sample-loan-agreement/`}
                                    data-type="link"
                                    data-id="https://dlp.imfast.in/sample-loan-agreement/"
                                  >
                                    Loan Agreement
                                  </a>
                                </li>
                              </ul>
                            </aside>
                            <aside id="block-18" className="widget widget_block">
                              <h2 className="wp-block-heading">
                                <span style={{ textDecoration: "underline" }}>Lenders</span>
                              </h2>
                            </aside>
                            <aside id="block-20" className="widget widget_block">
                              <ul>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/investor-p2p-investment/`}
                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/investor-p2p-investment/"
                                  >
                                    P2P Investment &amp; Eligibility
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/investor-how-to-invest/`}
                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/investor-how-to-invest/"
                                  >
                                    How To Start Investing
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/lender-declaration-on-registration/`}
                                    data-type="link"
                                    data-id="https://dlp.imfast.in/lender-declaration-on-registration/"
                                  >
                                    Lender declaration
                                  </a>
                                </li>
                                <li>
                                  <a href={`${BASEURLDLP}/investor-charges-fees/`}>
                                    Fees &amp; Returns
                                  </a>
                                </li>
                              </ul>
                            </aside>
                          </div>

                          <div className="tp-footer tp-footer3">
                            <aside id="block-38" className="widget widget_block">
                              <div className="wp-block-buttons is-content-justification-left is-layout-flex wp-container-core-buttons-layout-1 wp-block-buttons-is-layout-flex"
                                style={{ marginLeft: "25px" }}>
                                <div className="wp-block-button is-style-outline">
                                  <a
                                    className="wp-block-button__link wp-element-button"
                                    href="https://if-p2p.com/login"
                                  >
                                    Sign Up / Sign In
                                  </a>
                                </div>
                              </div>
                            </aside>
                            <aside id="block-13" className="widget widget_block">
                              <ul>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/about_us/`}
                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/about_us/"
                                  >
                                    About iMFAST
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/about_us/`}
                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/about_us/"
                                  >
                                    Our Team
                                  </a>
                                </li>
                                <li>
                                  <a href={`${BASEURLDLP}/`}>How it works?</a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/contact-us/`}
                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/contact-us/"
                                  >
                                    Contact Us
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/blog/`}
                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/blog/"
                                  >
                                    Blogs
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`${BASEURLDLP}/faqs/`}
                                    data-type="URL"
                                    data-id="https://dlp.imfast.in/faqs/"
                                  >
                                    FAQ's
                                  </a>
                                </li>
                              </ul>
                            </aside>
                            <aside
                              id="total_plus_social_icons-1"
                              className="widget widget_total_plus_social_icons"
                              style={{ marginLeft: "30px" }}
                            >
                              <h5 className="widget-title">Follow Us On</h5>{" "}
                              <div className="tp-social-icons style2 icon-small icon-left si-no-effect">
                                <a
                                  style={{
                                    backgroundColor: "#ffffff",
                                    color: "#000000",
                                    borderColor: "#000000"
                                  }}
                                  className="tp-social-button"
                                  href="#"
                                  title="Facebook"
                                  target="_blank"
                                >
                                  <FaIcons.FaFacebook />
                                </a>
                                <a
                                  style={{
                                    backgroundColor: "#ffffff",
                                    color: "#000000",
                                    borderColor: "#000000"
                                  }}
                                  className="tp-social-button"
                                  href=""
                                  title="Twitter"
                                  target="_blank"
                                >
                                  <FaIcons.FaTwitter />
                                </a>
                                <a
                                  style={{
                                    backgroundColor: "#ffffff",
                                    color: "#000000",
                                    borderColor: "#000000"
                                  }}
                                  className="tp-social-button"
                                  href=""
                                  title="Linkedin"
                                  target="_blank"
                                >
                                  <FaIcons.FaLinkedin />
                                </a>
                                <a
                                  style={{
                                    backgroundColor: "#ffffff",
                                    color: "#000000",
                                    borderColor: "#000000"
                                  }}
                                  className="tp-social-button"
                                  href="#"
                                  title="Youtube"
                                  target="_blank"
                                >
                                  <FaIcons.FaYoutube />
                                </a>
                              </div>
                            </aside>
                          </div>

                          <div className="tp-footer tp-footer4">
                            <aside id="block-69" className="widget widget_block">
                              <div className="wp-block-group is-vertical is-layout-flex wp-container-core-group-layout-1 wp-block-group-is-layout-flex">
                                <p>Company Name : iMFAST Finfotech Private Limited</p>
                                <p>
                                  Registered Office Address : No. 5 3F, Katha No. 10/5,
                                  Yashodhanagar, Bellary Road, Bangalore – 560064
                                </p>
                                <p>Corporate Identity Number : U72200KA2020PTC131606</p>
                                <p>
                                  Telephone :&nbsp;+91 80 46632400 / +91 22250073 / +91 22257027
                                </p>
                                <p>Fax : +91 80 22203928</p>
                                <p>
                                  E-Mail :&nbsp;
                                  <a
                                    rel="noreferrer noopener"
                                    href="mailto:info@imfast.co.in"
                                    target="_blank"
                                  >
                                    info@imfast.co.i
                                  </a>
                                  n
                                </p>
                                <p>
                                  Website:&nbsp;
                                  <a
                                    rel="noreferrer noopener"
                                    href="http://www.imfast.co.in/"
                                    target="_blank"
                                  >
                                    www.imfast.co.in
                                  </a>
                                </p>
                                <p>
                                  In case of any queries or grievances please contact : _______
                                </p>
                              </div>
                            </aside>
                          </div>


                        </div>
                      </div>
                    </div>
                    <div id="tp-bottom-footer">
                      <div className="tp-container">
                        <div className="tp-site-info tp-bottom-footer">
                          Reserve Bank of India does not accept any responsibility for the
                          correctness of any of the statements or representations made or opinions
                          expressed by the NBFC-P2P, and does not provide any assurance for
                          repayment of the loans lent on it.
                          <br />
                          <br />
                          Copyright © 2024 iMFAST ALL RIGHTS RESERVED.
                          <br />{" "}
                        </div>
                        {/* #site-info */}
                      </div>
                    </div>
                  </footer>

                </div>
              </div>
            </div>
          </div >
        </div >
      </div >
    )
  }
}

export default Footer
