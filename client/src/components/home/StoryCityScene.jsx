import PropTypes from 'prop-types';
import { cityBuildings } from '../../data/homeStoryData';

const StoryCityScene = ({ mouseOffset = { x: 0, y: 0 }, mood = 'busy', growth = 0 }) => {
  const parallaxStyle = {
    transform: `rotateX(58deg) rotateZ(-38deg) translate3d(${mouseOffset.x * 22}px, ${mouseOffset.y * 22}px, 0)`,
  };

  return (
    <div
      className={`city-world city-world--${mood}`}
      style={{ '--growth': growth }}
      aria-label="Thành phố tương lai đang chuyển từ quá tải sang cân bằng nhờ thảo mộc và AI"
    >
      <div className="city-back-aura" aria-hidden="true" />
      <div className="city-skyline city-skyline-back" aria-hidden="true" />
      <div className="city-skyline city-skyline-mid" aria-hidden="true" />
      <div className="city-depth-hills" aria-hidden="true" />

      <div className="city-holo-panel city-holo-panel--top">
        <span>AI đang quét nhịp sống</span>
        <strong>{mood === 'busy' ? 'Tín hiệu căng thẳng cao' : 'Gợi ý trà phù hợp'}</strong>
        <small>{mood === 'busy' ? 'Cần làm dịu hệ thần kinh' : 'Smart Wellness / 96%'}</small>
      </div>

      <div className="city-grid" style={parallaxStyle}>
        <span className="city-district district-a" />
        <span className="city-district district-b" />
        <span className="city-district district-c" />
        <span className="road-3d road-3d-main" />
        <span className="road-3d road-3d-cross" />
        <span className="road-3d road-3d-soft" />
        <span className="road-glow road-glow-a" />
        <span className="road-glow road-glow-b" />
        <span className="herbal-road herbal-road-a" />
        <span className="herbal-road herbal-road-b" />
        <span className="herbal-road herbal-road-c" />

        {cityBuildings.map((building) => (
          <div
            key={building.id}
            className={`building-3d building-3d--${building.tone}`}
            style={{
              left: building.left,
              top: building.top,
              '--h': `${building.height}px`,
              '--w': `${building.width}px`,
              '--d': `${building.depth}px`,
              '--layer': building.layer,
              transform: `translateZ(calc(var(--layer) * 18px)) translate3d(${mouseOffset.x * building.layer * 3.5}px, ${mouseOffset.y * building.layer * 3.5}px, 0)`,
            }}
          >
            <span className="building-face building-front" />
            <span className="building-face building-side" />
            <span className="building-face building-top" />
            <span className="building-windows" />
            <span className="roof-garden">
              <i />
              <i />
              <i />
            </span>
          </div>
        ))}

        <span className="city-person city-person-a" />
        <span className="city-person city-person-b" />
        <span className="city-person city-person-c" />
        <span className="micro-car micro-car-a" />
        <span className="micro-car micro-car-b" />
        <span className="micro-car micro-car-c" />
      </div>

      <div className="product-pack-focal" aria-hidden="true">
        <span className="product-pack-shadow" />
        <span className="product-pack-box">
          <i className="pack-leaf-mark" />
          <b>Trà Hoa Việt</b>
          <small>An thần</small>
        </span>
        <span className="product-pack-sachet sachet-a" />
        <span className="product-pack-sachet sachet-b" />
      </div>

      <div className="tea-focal" aria-hidden="true">
        <span className="tea-steam tea-steam-a" />
        <span className="tea-steam tea-steam-b" />
        <span className="tea-steam tea-steam-c" />
        <span className="tea-cup">
          <i className="tea-cup-body" />
          <i className="tea-cup-handle" />
          <i className="tea-cup-saucer" />
        </span>
      </div>

      <div className="city-holo-panel city-holo-panel--bottom">
        <span>Gợi ý bởi AI</span>
        <strong>Trà Ngủ Ngon</strong>
        <small>Hoa cúc / Tâm sen / Bạc hà</small>
      </div>

      <span className="botanical-leaf leaf-a" aria-hidden="true" />
      <span className="botanical-leaf leaf-b" aria-hidden="true" />
      <span className="botanical-leaf leaf-c" aria-hidden="true" />
      <span className="botanical-leaf leaf-d" aria-hidden="true" />
    </div>
  );
};

StoryCityScene.propTypes = {
  mouseOffset: PropTypes.shape({ x: PropTypes.number.isRequired, y: PropTypes.number.isRequired }),
  mood: PropTypes.oneOf(['busy', 'healing']),
  growth: PropTypes.number,
};

export default StoryCityScene;
