import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, tea, onAddToCart }) => {
    // Support both tea (raw from backend) and product (mapped structure from Home)
    const item = tea || product || {};
    const id = item._id || item.id;
    const name = item.name || '';
    const image = item.image || '';
    const isAIMixture = item.isAIMixture;
    const caffeineLevel = item.caffeineLevel || item.category || 'Tháº£o má»™c';
    const reviews = item.numReviews !== undefined ? item.numReviews : (item.reviews || 0);
    const rating = Number(item.rating || 0);
    const price = item.price || 0;
    const description = item.description || '';

    return (
        <article className="bg-white border border-gray-100/70 rounded-[32px] p-3 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(27,67,50,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col group h-full">
            {/* Image section with organic inner rounding */}
            <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-gradient-to-br from-emerald-50/20 to-amber-50/10 shrink-0">
                <Link to={`/teas/${id}`} className="block w-full h-full">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover transform group-hover:scale-105 transition duration-500 ease-out"
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center p-4">
                            <span className="text-3xl">ðŸµ</span>
                            <span className="text-xs font-bold text-emerald-800/60">Äang cáº­p nháº­t áº£nh</span>
                        </div>
                    )}
                </Link>
                
                {isAIMixture && (
                    <span className="absolute top-3.5 right-3.5 bg-emerald-600/90 backdrop-blur-sm text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10 flex items-center gap-1">
                        âœ¨ AI CÃ´ng Thá»©c
                    </span>
                )}
            </div>

            {/* Content section */}
            <div className="flex flex-col flex-grow p-3 pt-4">
                {/* Category / Caffeine Badge */}
                <div className="mb-2 flex items-center justify-between">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
                        {caffeineLevel.replace('Caffeine:', '').trim()}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0">
                        <span>â˜…</span>
                        <span>{rating.toFixed(1)}</span>
                    </div>
                </div>

                {/* Name */}
                <h3 className="mb-1 text-base sm:text-lg font-extrabold leading-snug text-emerald-950 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    <Link to={`/teas/${id}`}>
                        {name}
                    </Link>
                </h3>

                {/* Reviews count in small, clean gray */}
                <p className="text-[11px] text-gray-400 font-medium mb-3">({reviews} Ä‘Ã¡nh giÃ¡)</p>

                {/* Description */}
                <p className="mb-5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-gray-500 flex-grow font-medium">
                    {description || 'CÃ´ng thá»©c trÃ  tháº£o má»™c Ä‘ang Ä‘Æ°á»£c Trà Hoa Việt cáº­p nháº­t thÃ´ng tin chi tiáº¿t.'}
                </p>

                {/* Footer with Price on its own line and grid of buttons */}
                <div className="mt-auto pt-4 border-t border-gray-100/80 flex flex-col gap-3">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-semibold text-gray-400">GiÃ¡ bÃ¡n</span>
                        <span className="font-black text-xl sm:text-2xl text-emerald-700 tracking-tight">
                            {Number(price).toLocaleString('vi-VN')}Ä‘
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            to={`/teas/${id}`}
                            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-2.5 rounded-2xl text-xs font-bold text-center flex items-center justify-center transition-all duration-200 hover:shadow-sm"
                        >
                            Chi tiáº¿t
                        </Link>
                        <button
                            type="button"
                            onClick={() => onAddToCart && onAddToCart(id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(16,185,129,0.12)] active:scale-95 transition-all duration-200"
                        >
                            <span>ðŸ›’</span> Mua
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        category: PropTypes.string,
        description: PropTypes.string,
        rating: PropTypes.number,
        reviews: PropTypes.number,
        price: PropTypes.number,
        image: PropTypes.string,
        isAIMixture: PropTypes.bool,
    }),
    tea: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        caffeineLevel: PropTypes.string,
        description: PropTypes.string,
        rating: PropTypes.number,
        numReviews: PropTypes.number,
        price: PropTypes.number,
        image: PropTypes.string,
        isAIMixture: PropTypes.bool,
    }),
    onAddToCart: PropTypes.func,
};

export default ProductCard;

