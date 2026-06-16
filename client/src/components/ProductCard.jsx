import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, tea, onAddToCart }) => {
    // Support both tea (raw from backend) and product (mapped structure from Home)
    const item = tea || product || {};
    const id = item._id || item.id;
    const name = item.name || '';
    const image = item.image || '';
    const isAIMixture = item.isAIMixture;
    const caffeineLevel = item.caffeineLevel || item.category || 'Thảo mộc';
    const reviews = item.numReviews !== undefined ? item.numReviews : (item.reviews || 0);
    const rating = Number(item.rating || 0);
    const price = item.price || 0;
    const description = item.description || '';

    return (
        <article className="luxury-card luxury-card-hover p-3 flex flex-col group h-full animate-soft-rise">
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
                            <span className="text-3xl">🍵</span>
                            <span className="text-xs font-bold text-emerald-800/60">Đang cập nhật ảnh</span>
                        </div>
                    )}
                </Link>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/18 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {isAIMixture && (
                    <span className="absolute top-3.5 right-3.5 bg-emerald-600/90 backdrop-blur-sm text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10 flex items-center gap-1">
                        ✨ AI Công Thức
                    </span>
                )}
            </div>

            {/* Content section */}
            <div className="flex flex-col flex-grow p-3 pt-4">
                {/* Category / Caffeine Badge */}
                <div className="mb-2 flex items-center justify-between">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider border border-emerald-100">
                        {caffeineLevel.replace('Caffeine:', '').trim()}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0">
                        <span>★</span>
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
                <p className="text-[11px] text-gray-400 font-medium mb-3">({reviews} đánh giá)</p>

                {/* Description */}
                <p className="mb-5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-gray-500 flex-grow font-medium">
                    {description || 'Công thức trà thảo mộc đang được Trà Hoa Việt cập nhật thông tin chi tiết.'}
                </p>

                {/* Footer with Price on its own line and grid of buttons */}
                <div className="mt-auto pt-4 border-t border-gray-100/80 flex flex-col gap-3">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-semibold text-gray-400">Giá bán</span>
                        <span className="font-black text-xl sm:text-2xl text-emerald-700 tracking-tight">
                            {Number(price).toLocaleString('vi-VN')}đ
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            to={`/teas/${id}`}
                            className="luxury-btn luxury-btn-soft py-2.5 min-h-0 rounded-2xl text-xs"
                        >
                            Chi tiết
                        </Link>
                        <button
                            type="button"
                            onClick={() => onAddToCart && onAddToCart(id)}
                            className="luxury-btn luxury-btn-primary py-2.5 min-h-0 rounded-2xl text-xs"
                        >
                            <span>🛒</span> Mua
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
