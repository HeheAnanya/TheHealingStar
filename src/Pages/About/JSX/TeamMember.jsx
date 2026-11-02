import React from "react";

const TeamMember = ({ name, role, bio, image, initials }) => {
  return (
    <article className="about-team-member">
      <div className="about-team-member__portrait">
        {image ? (
          <img src={image} alt={name} loading="lazy" />
        ) : (
          <span className="about-team-member__initials" aria-label={name}>
            {initials || name?.slice(0, 1)}
          </span>
        )}
      </div>
      <div className="about-team-member__copy">
        <h3>{name}</h3>
        <p className="about-team-member__role">{role}</p>
        <p className="about-team-member__bio">{bio}</p>
      </div>
    </article>
  );
};

export default TeamMember;
