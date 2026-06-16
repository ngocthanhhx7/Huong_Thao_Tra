import PropTypes from 'prop-types';

const StoryCityScene = ({
  mouseOffset = { x: 0, y: 0 },
  mood = 'busy',
}) => {
  return (
    <div
      className={`city-world home-cinematic-scene city-world--${mood} relative w-full h-[320px] sm:h-[420px] lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500`}
      data-home-scene
      aria-label="Không gian thảo mộc Trà Hoa Việt"
      style={{
        '--home-scene-mouse-x': `${mouseOffset.x}px`,
        '--home-scene-mouse-y': `${mouseOffset.y}px`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none border-2 border-emerald-500/20 rounded-3xl z-40" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/20 via-transparent to-slate-950/30 z-30" />

      <div className="absolute inset-0 w-full h-full bg-emerald-950">
        <img
          src="/assets/home/pexels-dwanghong-29387145.jpg"
          className="w-full h-full object-cover select-none pointer-events-none"
          alt="Không gian thưởng trà thảo mộc thanh tịnh"
        />
      </div>
    </div>
  );
};

StoryCityScene.propTypes = {
  mouseOffset: PropTypes.shape({ x: PropTypes.number.isRequired, y: PropTypes.number.isRequired }),
  mood: PropTypes.oneOf(['busy', 'healing']),
};

export default StoryCityScene;
