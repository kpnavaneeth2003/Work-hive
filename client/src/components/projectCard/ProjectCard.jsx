import React from "react";
import "./ProjectCard.scss";

function ProjectCard({ card }) {
  return (
    <div className="projectCard">
      <img className="cover" src={card.img} alt={card.cat} />

      <div className="info">
        <img className="avatar" src={card.pp} alt={card.username} />

        <div className="texts">
          <h2>{card.cat}</h2>
          <span>{card.username}</span>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;