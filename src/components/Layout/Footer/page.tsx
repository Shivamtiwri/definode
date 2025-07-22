import React from 'react'
import Image from 'next/image'
const FooterMain = () => {
  return (
    <>
  <footer id="footer">
  <div className="footer-top">
    <div className="container">
      <div className="row">
        <div className="col-lg-7">
          <div className="row">
            <div className="col-sm-6">
              <div className="footer-info">
                <div>
                  <Image src="/assets/img/logo2.png" className="img-fluid" alt="Logo" width={200} height={60} />
                </div>
                <br />
                <p>
                  DeFi Node is a next-generation decentralized platform that allows users to earn
                  passive income through node ownership, node sales, and node mining—without the
                  complexity or high energy costs of traditional crypto mining.
                </p>
                <br />
                <div className="social-links">
                  <a href="#" className="twitter"><i className="fa fa-paper-plane"></i></a>
                  <a href="#" className="facebook"><i className="fa fa-facebook"></i></a>
                  <a href="#" className="instagram"><i className="fa fa-instagram"></i></a>
                  <a href="#" className="youtube"><i className="fa fa-youtube"></i></a>
                </div>
              </div>
            </div>

            <div className="col-sm-5 offset-md-1">
              <div className="footer-links">
                <h4>Useful Links</h4>
                <ul>
                  <li><a href="#">Home</a></li>
                  <li><a href="#">About us</a></li>
                  <li><a href="#">Services</a></li>
                  <li><a href="#">Terms of service</a></li>
                  <li><a href="#">Privacy policy</a></li>
                </ul>
              </div>

              <div className="footer-links">
                <h4>Contact Us</h4>
                <p>
                  <strong>Address:</strong> Parksworth House,<br />30 City Road, London, England,<br />EC1Y 2AY<br />
                  <strong>Email:</strong> info@definode.io
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 offset-md-1">
          <div className="form">
            <h4>Send us a message</h4>
            <p>Please fill out the quick form and we will be in touch with lightning speed.</p>
            <form action="forms/contact.php" method="post" role="form" className="php-email-form">
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Your Name" />
              </div>
              <div className="form-group">
                <input type="email" className="form-control" placeholder="Your Email" />
              </div>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Mobile No" />
              </div>
              <div className="form-group">
                <textarea className="form-control"  placeholder="Message"></textarea>
              </div>

              <div className="text-center">
                <button type="submit" title="Send Message">Send Message</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div className="footer-bottom py-3">
    <div className="container">
      <div className="copyright">
        &copy;2025 <strong>DEFI NODE</strong>.
      </div>
    </div>
  </div>
</footer>
<a href="#" className="back-to-top">
  <i className="fa fa-chevron-up"></i>
</a>
    </>
  )
}

export default FooterMain