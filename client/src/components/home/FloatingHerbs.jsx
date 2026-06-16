import PropTypes from 'prop-types';

const FloatingHerbs = ({ count = 6 }) => {
  const herbs = ['<C', '<?', '<1', '<<', '<@'];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {[...Array(count)].map((_, i) => {
        const herb = herbs[i % herbs.length];
        const randomLeft = 5 + (i * 17) % 90;
        const randomDelay = i * 0.7;
        const randomDuration = 6 + (i * 2) % 8;
        
        return (
          <span 
            key={i}
            className="absolute text-2xl opacity-60 animate-bounce select-none"
            style={{
              left: `${randomLeft}%`,
              top: `${15 + (i * 13) % 70}%`,
              animationDelay: `${randomDelay}s`,
              animationDuration: `${randomDuration}s`,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.06))',
            }}
          >
            {herb}
          </span>
        );
      })}
    </div>
  );
};

FloatingHerbs.propTypes = {
  count: PropTypes.number,
};

export default FloatingHerbs;
