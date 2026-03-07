import React from "react";
import "./Home.scss";
import Featured from "../../components/featured/Featured";
import TrustedBy from "../../components/trustedBy/TrustedBy";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/catCard/CatCard";
import ProjectCard from "../../components/projectCard/ProjectCard";
import { cards, projects } from "../../data";

function Home() {
  return (
    <div className="home">
      <Featured />
      <TrustedBy />

      <Slide slidesToShow={5} arrowsScroll={5}>
        {cards.map((card) => (
          <CatCard key={card.id} card={card} />
        ))}
      </Slide>

      <div className="features">
        <div className="container">
          <div className="item">
            <h1>Why customers choose Workhive for home services</h1>

            <div className="title">
              <img src="/img/check.png" alt="Check" />
              Trusted professionals for every budget
            </div>
            <p>
              Compare services across different price points and choose the
              right expert for your needs without the confusion of hourly
              pricing.
            </p>

            <div className="title">
              <img src="/img/check.png" alt="Check" />
              Fast, convenient booking
            </div>
            <p>
              Find the right service provider quickly and get work started
              without long back-and-forth communication.
            </p>

            <div className="title">
              <img src="/img/check.png" alt="Check" />
              Reliable support whenever you need it
            </div>
            <p>
              From booking questions to service issues, get help throughout
              your experience on the platform.
            </p>
          </div>

          <div className="item">
            <video src="/img/video.mp4" controls />
          </div>
        </div>
      </div>

      <div className="features dark">
        <div className="container">
          <div className="item">
            <h1>
              <i>For businesses</i>
            </h1>
            <h1>A smarter way to manage service requests</h1>

            <p>
              Workhive helps business owners connect with customers, manage
              service demand, and grow with a more organized workflow.
            </p>

            <div className="title">
              <img src="/img/check.png" alt="Check" />
              Connect your business with more local customers
            </div>

            <div className="title">
              <img src="/img/check.png" alt="Check" />
              Get matched with the right service requests
            </div>

            <div className="title">
              <img src="/img/check.png" alt="Check" />
              Improve coordination and productivity in one place
            </div>

            <button>Explore Businesses</button>
          </div>

          
        </div>
      </div>

      

      <Slide slidesToShow={4} arrowsScroll={4}>
        {projects.map((card) => (
          <ProjectCard key={card.id} card={card} />
        ))}
      </Slide>
    </div>
  );
}

export default Home;