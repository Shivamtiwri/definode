import React from 'react'
import Image from 'next/image'
const MainCont = () => {
  return (
    <>
    <main id="main">
        <div id="about" className="about position-relative overflow-hidden">
      <div className="container" data-aos="fade-up">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="about-content" data-aos="fade-left" data-aos-delay="100">
              <span className="textpink">About DeFi Node</span>
              <h2>
                What is <span className="textpink2">DeFi Node?</span>
              </h2>
              <p>
                DeFi Node is a next generation decentralized platform that empowers users to earn passive income by participating in node ownership, node selling, and node mining without the complexity or high energy consumption of traditional crypto mining.
              </p>
              <p>
                Unlike conventional mining systems that require expensive hardware, technical knowledge, and massive power usage, DeFi Node offers a sustainable, easy-to-use, and profitable alternative. Our system enables individuals, businesses, and investors to support the blockchain ecosystem while earning consistent, reliable crypto rewards all from the comfort of a simple and intuitive platform.
              </p>
              <div className="row">
                <div className="col-lg-6">
                  <ul>
                    <li><i className="ion-android-checkmark-circle"></i> Passive Income Made Easy</li>
                    <li><i className="ion-android-checkmark-circle"></i> Zero Technical Hassles</li>
                    <li><i className="ion-android-checkmark-circle"></i> Energy-Efficient System</li>
                  </ul>
                </div>
                <div className="col-lg-6">
                  <ul>
                    <li><i className="ion-android-checkmark-circle"></i> Simple Node Ownership</li>
                    <li><i className="ion-android-checkmark-circle"></i> Secure & Decentralized Platform</li>
                    <li><i className="ion-android-checkmark-circle"></i> Support Blockchain Ecosystem</li>
                  </ul>
                </div>
              </div>
              <div>
                <button className="btn btn-pink px-4 py-2 rounded-pill">Start Buying</button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="about-img" data-aos="fade-right" data-aos-delay="100">
              <Image src="/assets/img/blockchain.png" width={'300'} height={300} alt="DeFi Node" />
            </div>
          </div>
        </div>
      </div>
    </div>

      <div id="about" className="crafted1 about position-relative overflow-hidden">
      <div className="container" data-aos="fade-up">
        <div className="container">
          <div className="drevBox">
            <header
              className="section-header position-relative"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <div className="text-center mb-2">
                <span className="text-white d-block mx-auto">Web3 Features</span>
              </div>
              <h3 data-aos="fade-up" className="mb-2">
                <span className="text-white">Crafted for</span>{' '}
                <span className="text-white">Web3 success</span>
              </h3>
            </header>

            <div className="row">
              {/* Feature 1 */}
              <div className="col-md-4">
                <div className="grade3 d_revenue" data-aos="fade-left" data-aos-delay="200">
                  <div className="contt02">
                    <div className="text-center bxicon">
                      <Image width={60} height={60} src="/assets/img/icons/icon1.png" alt="Independent Full Node Ownership" />
                    </div>
                    <h5 data-aos="fade-up">Independent Full Node Ownership</h5>
                    <p className="mb-3" data-aos="fade-up">
                      Own blockchain nodes, earn passive income, and support decentralized network and infrastructure growth.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="col-md-4">
                <div className="grade3 d_revenue" data-aos="fade-up" data-aos-delay="300">
                  <div className="contt02">
                    <div className="text-center bxicon">
                      <Image width={60} height={60} src="/assets/img/icons/icon1.png" alt="Energy Efficient Node Mining" />
                    </div>
                    <h5 data-aos="fade-up">Energy Efficient Node Mining</h5>
                    <p className="mb-3" data-aos="fade-up">
                      Our nodes are energy efficient, cost-effective, and sustainable—no expensive GPUs or electricity needed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="col-md-4">
                <div className="grade3 d_revenue" data-aos="fade-right" data-aos-delay="400">
                  <div className="contt02">
                    <div className="text-center bxicon">
                      <Image width={60} height={60} src="/assets/img/icons/icon1.png" alt="Earn Effortless Passive Income" />
                    </div>
                    <h5 data-aos="fade-up">Earn Effortless Passive Income</h5>
                    <p className="mb-3" data-aos="fade-up">
                      Your live node earns crypto daily automated, decentralized, reliable income while you relax and grow.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="col-md-4">
                <div className="grade3 d_revenue" data-aos="fade-right" data-aos-delay="400">
                  <div className="contt02">
                    <div className="text-center bxicon">
                      <Image width={60} height={60} src="/assets/img/icons/icon1.png" alt="Real Time Performance Dashboard" />
                    </div>
                    <h5 data-aos="fade-up">Real Time Performance Dashboard</h5>
                    <p className="mb-3" data-aos="fade-up">
                      Monitor nodes, track earnings, and view performance with a real-time, powerful, user-friendly dashboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="col-md-4">
                <div className="grade3 d_revenue" data-aos="fade-right" data-aos-delay="400">
                  <div className="contt02">
                    <div className="text-center bxicon">
                     <Image width={60} height={60} src="/assets/img/icons/icon1.png" alt="Secure & Transparent Infrastructure" />
                    </div>
                    <h5 data-aos="fade-up">Secure & Transparent Infrastructure</h5>
                    <p className="mb-3" data-aos="fade-up">
                      Built on smart contracts, DeFi Node ensures secure, verifiable, and tamper-proof transactions and earnings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="col-md-4">
                <div className="grade3 d_revenue" data-aos="fade-right" data-aos-delay="400">
                  <div className="contt02">
                    <div className="text-center bxicon">
                      <Image width={60} height={60} src="/assets/img/icons/icon1.png" alt="Decentralized Global Network" />
                    </div>
                    <h5 data-aos="fade-up">Decentralized Global Network</h5>
                    <p className="mb-3" data-aos="fade-up">
                      Join thousands powering decentralized systems with global uptime, consistency, and resilient distributed architecture.
                    </p>
                  </div>
                </div>
              </div>
            </div>
           </div>
        </div>
      </div>
    </div>

    <section id="about" className="features">
        <div className="container" data-aos="fade-up">
          <div className="row feature-item align-items-center">
            <div
              className="col-lg-5"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <Image
                src="/assets/img/blockchain6.png"
                alt="Blockchain"
                width={500}
                height={500}
                className="img-fluid"
              />
            </div>
            <div
              className="col-lg-6 offset-lg-1 pt-5 pt-lg-0"
              data-aos="fade-left"
              data-aos-delay="150"
            >
              <span className="textpink">Web3 Features</span>
              <header className="section-header" data-aos="fade-up">
                <h3 className="text-left">
                  Build the Future of Finance,{' '}
                  <span className="textpink2">One Node at a Time</span>
                </h3>
              </header>
              <div className="meta_cube">
                <ul data-aos="fade-up">
                  <li>
                    <p className="fw-bold mb-0">
                      Own Decentralized Infrastructure
                    </p>
                    Each node you purchase contributes to a secure,
                    independent, and censorship-free blockchain ecosystem.
                  </li>
                  <li>
                    <p className="fw-bold mb-0">Instant Node Activation</p>
                    Deploy your node in minutes with zero setup—plug into the
                    blockchain and start earning instantly.
                  </li>
                  <li>
                    <p className="fw-bold mb-0">
                      Track Performance in Real-Time
                    </p>
                    Use our smart dashboard to monitor rewards, manage nodes,
                    and view analytics with complete transparency.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section id="about" className="features">
        <div className="container" data-aos="fade-up">
          <div className="row feature-item">
            <div
              className="col-lg-6 pt-5 pt-lg-0"
              data-aos="fade-left"
              data-aos-delay="150"
            >
              <span className="textpink">Web3 Innovation</span>
              <header className="section-header" data-aos="fade-up">
                <h3 className="text-left">
                  Empowering Builders of the{' '}
                  <span className="textpink2">Decentralized Future</span>
                </h3>
              </header>
              <p>
                Join a thriving ecosystem built for developers, innovators, and
                blockchain pioneers.
              </p>
              <div className="meta_cube">
                <ul data-aos="fade-up">
                  <li>
                    <p className="fw-bold mb-0">Developer Tools</p>
                    Everything you need to build, test, and deploy dApps with
                    SDKs, APIs, and seamless node access.
                  </li>
                  <li>
                    <p className="fw-bold mb-0">Multi-Chain Support</p>
                    DeFi Node supports multiple blockchain networks, enabling
                    developers to build across Ethereum, BNB, Polygon, and
                    more.
                  </li>
                  <li>
                    <p className="fw-bold mb-0">Secure Infrastructure</p>
                    Enterprise-grade security and uptime guarantee ensuring
                    your data and decentralized apps remain stable and
                    protected.
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="col-lg-6"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <Image
                src="/assets/img/blockchain5.png"
                alt="Blockchain"
                width={500}
                height={500}
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section id="about" className="features">
        <div className="container" data-aos="fade-up">
          <div className="row feature-item">
            <div
              className="col-lg-6"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <Image
                src="/assets/img/blockchain7.png"
                alt="Blockchain Dashboard"
                width={500}
                height={500}
                className="img-fluid"
              />
            </div>
            <div
              className="col-lg-6 pt-5 pt-lg-0"
              data-aos="fade-left"
              data-aos-delay="150"
            >
              <span className="textpink">Web App</span>
              <header className="section-header" data-aos="fade-up">
                <h3 className="text-left">
                  User-Friendly <span className="textpink2">Dashboard</span>
                </h3>
              </header>
              <h5>Simple. Smart. Seamless.</h5>
              <p>
                Our powerful dashboard is designed with simplicity and clarity
                in mind so you can focus on what matters: earning, tracking, and
                growing.
              </p>
              <p>
                Whether you&apos;re a first-time user or an experienced Web3
                investor, our intuitive interface makes managing your nodes and
                earnings effortless. Every feature is just a click away—no
                technical expertise required.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about"  className=" bg-light section-header features">
      <div className="container" data-aos="fade-up">
        <div className="feature-item">
          <div className="text-center"><span className="textpink">Explore the Key Benefits</span></div>
        <h3 className="h1 mb-lg-5 mb-4 pb-lg-0 pb-md-2 text-center mt-3">Advantages of using <span className="textpink2">DeFi Node</span></h3>
        </div>
            <div className="row feature-item mt-4">
                    <div className="col-md-6">
                      <div className="benefitBox" data-aos="fade-up">
                      <h5 data-aos="fade-up">Real-Time Earnings Tracking</h5>
                      <p className="text-center" data-aos="fade-up">Instantly view your daily, weekly, and monthly rewards with live data updates.</p>
                    </div></div>
                      <div className="col-md-6">
                      <div className="benefitBox" data-aos="fade-up">
                      <h5 data-aos="fade-up">Easy Node Management</h5>
                      <p className="text-center" data-aos="fade-up">Monitor, activate, or deactivate your nodes with just a few clicks no tech expertise required.</p>
                    </div></div>
                     <div className="col-md-6">
                      <div className="benefitBox" data-aos="fade-up">
                      <h5 data-aos="fade-up">Visual Performance Insights</h5>
                      <p className="text-center" data-aos="fade-up">Get clear charts and graphs to track your growth, income trends, and overall performance.</p>
                    </div></div>
                     <div className="col-md-6">
                      <div className="benefitBox" data-aos="fade-up">
                      <h5 data-aos="fade-up">Secure Wallet Integration</h5>
                      <p className="text-center" data-aos="fade-up">Connect your crypto wallet safely to manage withdrawals and track transactions seamlessly.</p>
                    </div></div>
                     <div className="col-md-6">
                      <div className="benefitBox" data-aos="fade-up">
                      <h5 data-aos="fade-up">Accessible Anytime, Anywhere</h5>
                      <p className="text-center" data-aos="fade-up">Enjoy full access on desktop or mobile with a responsive, fast, and intuitive user experience.</p>
                    </div></div>
<div className="col-md-6">
                      <div className="benefitBox" data-aos="fade-up">
                      <h5 data-aos="fade-up">Designed for All Users</h5>
                      <p className="text-center" data-aos="fade-up">The dashboard offers a smooth, simple interface anyone can use confidently beginner or pro.</p>
                    </div></div>

                  </div>
                  </div>
</section>

<section id="about" className="section-header features">
  <div className="container" data-aos="fade-up">
    <div className="row justify-content-center feature-item mt-4">
      <div className="col-lg-12"><div className="buynode">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="text-white">Buy Securely. Sell Instantly. Earn Consistently.</h2>
                  <p className="text-white">Manage your node portfolio like a pro with full transparency and control.</p>
                </div>
                <div className="col-md-4">
                  <a href="#" className="btn btn-lg btn-light">Start Buying</a>
                </div>
              </div>
            </div></div>
    </div>
  </div>
</section>

<section id="about" className="about grade2 call-to-action">
      <div className="container" data-aos="zoom-out">
        <div className="row justify-content-center">
          <div className="col-lg-5 text-center text-lg-left">
           <Image src="/assets/img/appdev.png" width={550} height={1050} className="img-fluid" alt="DeFi Node"/>
          </div>
          <div className="col-lg-5">
            <span className="text-white font-weight-bold">Mobile Application</span>
             <h3 className="text-white cta-title">Download App</h3>
             <h5 className="text-white">Smart Productivity, <br/>Powered by DeFi - <span className="font-weight-bold text-white">Coming Soon!</span></h5>
             <p className="text-white">Our upcoming task management app is designed to revolutionize how individuals and teams manage their daily goals. With a sleek interface, collaborative tools, and seamless cross-device syncing, it&apos;s built for modern productivity.</p>
             <h5 className="font-weight-bold text-white">Be Ready to Boost Your Productivity!</h5>
             <div className="d-flex justify-content-start ">
              <div><Image src="/assets/img/appstore.png" width={100} height={30} style={{ maxWidth: '140px', marginRight: '15px' }} alt="iOS"/></div>
              <div><Image src="/assets/img/playstore.png" width={100} height={30} style={{ maxWidth: '140px' }} alt="Android"/></div>
             </div>
                    
          </div>
          </div>

      </div>
      </section>

    </main>
    </>
  )
}

export default MainCont