import { useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { homeAssets } from '../../data/homeAssets';

const ProductFormulaCard = ({ product, index = 0 }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (event) => {
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;

    const card = cardRef.current;
    if (!card) return;

    const box = card.getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2;
    const y = event.clientY - box.top - box.height / 2;
    const rotateX = -(y / (box.height / 2)) * 6;
    const rotateY = (x / (box.width / 2)) * 6;

    card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0)';
  };

  return (
    <article
      ref={cardRef}
      className="formula-card group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ '--accent': product.accent, '--delay': `${index * 80}ms` }}
    >
      <div className="formula-card-shine" aria-hidden="true" />

      <div className="formula-card-visual relative overflow-hidden flex items-center justify-center pt-8 pb-4">
        <span className="formula-badge z-20 absolute top-3 left-3">{product.badge}</span>
        <div className={`formula-orb ${product.tone} absolute inset-0 m-auto w-32 h-32 rounded-full opacity-60 blur-xl`} />
        
        {/* Real product image */}
        <img 
          src={homeAssets.products[product.assetKey]} 
          className="relative w-36 h-36 object-contain z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2" 
          alt={product.name}
          loading="lazy"
        />
      </div>

      <div className="formula-card-body flex-1 flex flex-col p-6">
        <p className="formula-eyebrow text-xs uppercase tracking-widest text-[#568934] font-black mb-1">Công thức wellness</p>
        <h3 className="text-xl font-bold text-[#17351f] mb-2">{product.name}</h3>
        <p className="formula-benefit text-sm text-[#4b604d] leading-relaxed mb-4">{product.benefit}</p>

        <div className="ingredient-row flex flex-wrap gap-1.5 mb-4">
          {product.ingredients.map((ingredient) => (
            <span 
              key={ingredient} 
              className="text-[11px] font-bold text-[#568934] bg-leaf-50 px-2 py-0.5 rounded-full border border-leaf-100/30"
            >
              {ingredient}
            </span>
          ))}
        </div>

        <div className="formula-extra-details mt-auto pt-4 border-t border-leaf-100/30 text-xs text-[#4b604d] flex flex-col gap-2">
          <div>
            <strong className="text-[#17351f] font-bold">Hương vị:</strong> {product.sensoryNote}
          </div>
          <div>
            <strong className="text-[#17351f] font-bold">Thưởng thức:</strong> {product.ritual}
          </div>
          <div className="mt-1 p-2 bg-leaf-50/40 rounded-lg border border-leaf-100/20 text-[#3d523f]">
            <strong className="text-[#568934] font-mono font-bold flex items-center gap-1 mb-0.5">
              🔬 Phân tích sinh học (AI):
            </strong>
            {product.aiReason}
          </div>
        </div>

        <Link 
          to={`/teas?id=${product.id}`} 
          className="wellness-focus formula-link mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary-700 hover:text-primary-600 transition"
        >
          Xem chi tiết công thức
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
    sensoryNote: PropTypes.string.isRequired,
    aiReason: PropTypes.string.isRequired,
    assetKey: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number,
};

export default ProductFormulaCard;
