import { useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductFormulaCard = ({ product, index = 0 }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (event) => {
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;

    const card = cardRef.current;
    if (!card) return;

    const box = card.getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2;
    const y = event.clientY - box.top - box.height / 2;
    const rotateX = -(y / (box.height / 2)) * 8;
    const rotateY = (x / (box.width / 2)) * 8;

    card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0)';
  };

  return (
    <article
      ref={cardRef}
      className="formula-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ '--accent': product.accent, '--delay': `${index * 80}ms` }}
    >
      <div className="formula-card-shine" aria-hidden="true" />

      <div className="formula-card-visual">
        <span className="formula-badge">{product.badge}</span>
        <div className={`formula-orb ${product.tone}`}>
          <span className="formula-steam" />
          <span className="formula-cup" />
        </div>
      </div>

      <div className="formula-card-body">
        <p className="formula-eyebrow">Công thức wellness</p>
        <h3>{product.name}</h3>
        <p className="formula-benefit">{product.benefit}</p>

        <div className="ingredient-row">
          {product.ingredients.map((ingredient) => (
            <span key={ingredient}>{ingredient}</span>
          ))}
        </div>

        <p className="formula-ritual">{product.ritual}</p>

        <Link to="/teas" className="wellness-focus formula-link">
          Xem chi tiết
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
};

ProductFormulaCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    benefit: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
    badge: PropTypes.string.isRequired,
    ritual: PropTypes.string.isRequired,
    tone: PropTypes.string.isRequired,
    accent: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number,
};

export default ProductFormulaCard;
