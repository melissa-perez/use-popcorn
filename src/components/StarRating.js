import Star from './Star';
import { useState } from 'react';
import PropTypes from "prop-types";

StarRating.propTypes = {
  maxRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  defaultReting: PropTypes.number,
  messages: PropTypes.array,
  className: PropTypes.string,
  onSetRating: PropTypes.func
};
export default function StarRating({ defaultRating = 3, maxRating = 5, color = "yellow", size = 48, className = "", messages = [], onSetRating }) { // did not add messages as prop
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const textStyle = {
    lineHeight: '1',
    margin: '0',
    color,
    fontSize: `${size}dp`
  };


  function handleRating(review) {

    setRating(rating === review ? 0 : review);
  }
  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onRate={() => handleRating(i + 1)}
            onHover={() => setHoverRating(i + 1)}
            onHoverOut={() => setHoverRating(0)}
            full={(hoverRating || rating) >= i + 1}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>{hoverRating || rating || ''}</p>
    </div>
  );
}
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const starContainerStyle = {
  display: 'flex',
};


