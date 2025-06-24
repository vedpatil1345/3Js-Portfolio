import React from "react";
import { techskills } from "../data";

// Get highlight color based on skill name (moved outside component)
function getHighlightColor(name) {
  if (name.includes("Python") || name.includes("Django") || name.includes("Flask")) {
    return "#306998"; // Python blue
  } else if (name.includes("JavaScript") || name.includes("React") || name.includes("Node")) {
    return "#f0db4f"; // JavaScript yellow
  } else if (name.includes("Java")) {
    return "#5382a1"; // Java blue
  } else if (name.includes("SQL") || name.includes("MySQL") || name.includes("MongoDB")) {
    return "#00758f"; // Database blue
  } else if (name.includes("TensorFlow") || name.includes("PyTorch")) {
    return "#ff6f00"; // ML/AI orange
  }
  return "#fa2720"; // default red
}

// Calculate all skill positions (moved outside component)
function calculateSkillPositions(skills) {
  const count = skills.length;
  const radius = 100; // Radius of the circle in pixels
  
  return skills.map((skill, index) => {
    const angle = (index / count) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    return {
      ...skill,
      position: { x, y },
      angle: angle * (180 / Math.PI),
      highlightColor: getHighlightColor(skill.name)
    };
  });
}

// Pre-calculate the skills array with positions
const preCalculatedSkills = calculateSkillPositions(techskills);

const TechSkillsCircle = ({ currentHoveredIndex = null, onSkillHover = () => {} }) => {
  // If needed, we could use useMemo here if techskills might change during render cycles
  const skills = preCalculatedSkills;

  return (
    <div className="animate-spin-slow w-full h-full relative  rounded-lg flex items-center justify-center">
      <div className="relative w-40 h-40">
        {skills.map((skill, index) => {
          const isHovered = currentHoveredIndex === index;
          
          return (
            <div
              key={`skill-${index}-${skill.name}`}
              className="absolute transition-all duration-300 cursor-pointer"
              style={{
                transform: `translate(-50%, -50%) translate(${skill.position.x}px, ${skill.position.y}px)`,
                left: "50%",
                top: "50%"
              }}
              onMouseEnter={() => onSkillHover(index)}
              onMouseLeave={() => onSkillHover(null)}
            >
              <div 
                className={`animate-spin flex items-center justify-center ${isHovered ? 'scale-105' : 'scale-100'} transition-transform duration-300 p-2 rounded-full`}
                style={{
                  boxShadow: isHovered ? `0 0 10px ${skill.highlightColor}` : "none"
                }}
              >
                <img 
                  src={skill.icon} 
                  alt={skill.name} 
                  className="w-8 h-8 object-contain"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 3px ${skill.highlightColor})` : "none"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(TechSkillsCircle);