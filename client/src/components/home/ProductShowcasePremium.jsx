import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { homeProducts, storyChapters } from '../../data/homeStoryData';
import { homeAssets } from '../../data/homeAssets';


const mapTeaToHomeProduct = (tea, mockFallback) => {
  if (!tea) return mockFallback;
  const ingredients = tea.ingredients || [];
  const ingredientNames = ingredients.map(ing => typeof ing === 'object' ? ing.name : ing) || [];
  return {
    id: tea._id || tea.id,
    name: tea.name,
    shortName: tea.name.replace('Trà ', ''),
    badge: tea.benefits?.[0] || 'Trà cao cấp',
    problem: tea.mixGoal || tea.description,
    benefit: tea.benefits?.join(', ') || tea.description,
    ingredients: ingredientNames.length > 0 ? ingredientNames : ['Thảo mộc tuyển chọn'],
    ingredientsList: ingredients.map(ing => typeof ing === 'object' ? { id: ing._id, name: ing.name, image: ing.image } : { name: ing }),
    sensoryNote: tea.description || 'Hương thơm tinh khiết, hậu ngọt tự nhiên từ thảo dược.',
    ritual: 'Thưởng thức ấm nóng vào thời điểm thích hợp trong ngày, ngâm 5-10 phút.',
    aiReason: tea.mixGoal || 'Sản phẩm được đề xuất dựa trên nhu cầu sinh học tối ưu của cơ thể.',
    matchScore: tea.rating ? Math.round(tea.rating * 20) : 95,
    accent: '#568934',
    image: tea.image,
    tone: 'formula-calm',
    isReal: true,
  };
};

const ProductShowcasePremium = ({ homeSettings = null }) => {
  const products = useMemo(() => {
    if (!homeSettings || !homeSettings.showcaseTeas || homeSettings.showcaseTeas.length === 0) {
      return homeProducts;
    }
    return homeSettings.showcaseTeas.map((tea, idx) => mapTeaToHomeProduct(tea, homeProducts[idx]));
  }, [homeSettings]);

  const defaultFeatured = useMemo(() => {
    if (!homeSettings || !homeSettings.featuredTea) {
      return homeProducts[0];
    }
    return mapTeaToHomeProduct(homeSettings.featuredTea, homeProducts[0]);
  }, [homeSettings]);

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setSelectedId(null);
  }, [defaultFeatured]);

  const featuredProduct = useMemo(() => {
    if (selectedId) {
      const found = products.find((p) => p.id === selectedId);
      if (found) return found;
    }
    return defaultFeatured;
  }, [selectedId, defaultFeatured, products]);

  return (
    <section className="products-section story-section relative isolate overflow-hidden px-4 py-28 sm:px-6 lg:px-8 bg-[#f4f8f0]">
      <div className="products-bg absolute inset-0 opacity-40 bg-[radial-gradient(#add489_1px,transparent_1px)] [background-size:16px_16px]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="reveal mb-14 grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-end">
          <div>
            <span className="reveal chapter-kicker chapter-kicker-herbal">
              {storyChapters.products.label}
            </span>
            <h2 className="mt-6 font-display-h1 text-4xl leading-[1.08] text-[#17351f] md:text-6xl">
              {storyChapters.products.heading}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[#4b604d]">
            {storyChapters.products.body}
          </p>
        </div>

        {/* Dynamic Interactive Stage */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
          
          {/* Main Featured Stage */}
          <div className="formula-featured-stage bg-white rounded-3xl p-8 border border-leaf-100/40 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="formula-card-shine absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-tr from-transparent via-[#add489] to-transparent group-hover:animate-shine" />
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              
              {/* Grand Visual Area */}
              <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden border border-leaf-100/20 bg-leaf-50/20">
                {/* Main Product Package */}
                <img 
                  src={featuredProduct.image || homeAssets.products[featuredProduct.assetKey] || homeAssets.heroPack} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt={featuredProduct.name} 
                />
              </div>

              {/* Text & Recommendation Details */}
              <div className="flex flex-col justify-center">
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start mb-4">
                  {featuredProduct.badge}
                </span>
                
                <h3 className="font-display-h1 text-3xl text-[#17351f] mb-3">{featuredProduct.name}</h3>
                
                <p className="text-base text-[#4b604d] leading-relaxed mb-4 font-semibold">
                  {featuredProduct.benefit}
                </p>

                <div className="ingredient-row flex flex-wrap gap-2 mb-6">
                  {(featuredProduct.ingredientsList || featuredProduct.ingredients || []).map((ing, idx) => {
                    const name = typeof ing === 'object' ? ing.name : ing;
                    const id = typeof ing === 'object' ? ing.id : null;
                    const img = typeof ing === 'object' ? ing.image : null;

                    const content = (
                      <span 
                        className="text-xs font-bold text-[#568934] bg-leaf-50 px-3 py-1 rounded-full border border-leaf-100/30 flex items-center gap-1.5 hover:bg-leaf-100 transition duration-200"
                      >
                        {img ? (
                          <img src={img} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                        ) : (
                          <svg className="h-3.5 w-3.5 text-emerald-600 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M17 8C8 10 5.9 16.1 5.1 18.2C5 18.5 4.7 18.7 4.4 18.7C4.1 18.7 3.8 18.5 3.7 18.2C3.2 16.6 2 11.2 6.7 6.7C10.7 2.7 17.5 1.5 20.3 1.1C20.7 1 21.1 1.4 21 1.8C20.5 4.3 19.3 6.9 17 8Z" />
                          </svg>
                        )}
                        {name}
                      </span>
                    );

                    if (id) {
                      return (
                        <Link key={id} to={`/ingredients/${id}`}>
                          {content}
                        </Link>
                      );
                    }
                    return <span key={idx}>{content}</span>;
                  })}
                </div>

                <div className="space-y-3 p-4 bg-leaf-50/60 rounded-2xl border border-leaf-100/30 mb-6 text-sm text-[#4b604d]">
                  <div>
                    <strong className="text-[#17351f] block mb-0.5 font-bold">🌸 Hương vị & Cảm quan:</strong>
                    {featuredProduct.sensoryNote}
                  </div>
                  <div>
                    <strong className="text-[#17351f] block mb-0.5 font-bold">🍵 Nghi thức thưởng trà:</strong>
                    {featuredProduct.ritual}
                  </div>
                  <div className="mt-2 pt-3 border-t border-leaf-100/30 text-xs">
                    <strong className="text-[#568934] font-mono block mb-1 font-bold">🔬 Cơ chế tác động (AI khuyên dùng):</strong>
                    <p className="leading-relaxed italic bg-white/60 p-2 rounded-lg border border-leaf-100/20">
                      {featuredProduct.aiReason}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link 
                    to={featuredProduct.isReal ? `/teas/${featuredProduct.id}` : `/teas?id=${featuredProduct.id}`} 
                    className="wellness-focus text-center flex-1 md:flex-none rounded-xl bg-gradient-to-r from-primary-700 to-primary-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:from-primary-600 hover:to-primary-500 transition active:scale-95"
                  >
                    Mua sản phẩm ngay
                  </Link>
                  <Link 
                    to="/ai-mix" 
                    className="wellness-focus text-center flex-1 md:flex-none rounded-xl border border-leaf-200 bg-white px-6 py-3 text-sm font-bold text-primary-700 hover:bg-leaf-50 transition"
                  >
                    Tự phối thảo mộc
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Supporting Selector Cards */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#568934] font-black mb-1 px-1">
              Chọn công thức trà khác để khám phá
            </h4>
            
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedId(product.id)}
                  className={`wellness-focus formula-selector-card p-4 rounded-2xl border text-left flex items-center gap-4 transition-all duration-300 ${
                    featuredProduct.id === product.id
                      ? 'border-primary-600 bg-white shadow-lg ring-1 ring-primary-600'
                      : 'border-leaf-100 bg-white/70 hover:bg-white hover:border-leaf-300'
                  }`}
                >
                  <div className="w-14 h-14 bg-leaf-50 rounded-xl flex items-center justify-center p-1 overflow-hidden border border-leaf-100/20">
                    <img src={product.image || homeAssets.products[product.assetKey] || homeAssets.heroPack} className="w-full h-full object-contain" alt={product.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-[#17351f] truncate text-base">{product.name}</h5>
                    <p className="text-xs text-[#5c705d] truncate mt-0.5">{product.benefit}</p>
                    <div className="flex gap-1.5 mt-2 overflow-hidden">
                      {product.ingredients.slice(0, 2).map((ing) => (
                        <span key={ing} className="text-[10px] bg-leaf-50 text-[#568934] font-semibold px-1.5 py-0.5 rounded border border-leaf-100/10">
                          {ing}
                        </span>
                      ))}
                      {product.ingredients.length > 2 && (
                        <span className="text-[10px] text-gray-400 font-semibold px-1 py-0.5">+{product.ingredients.length - 2}</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xl ${featuredProduct.id === product.id ? 'text-primary-600 font-bold' : 'text-gray-300'}`}>
                    {featuredProduct.id === product.id ? '●' : '○'}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

ProductShowcasePremium.propTypes = {
  homeSettings: PropTypes.shape({
    featuredTea: PropTypes.object,
    showcaseTeas: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default ProductShowcasePremium;

