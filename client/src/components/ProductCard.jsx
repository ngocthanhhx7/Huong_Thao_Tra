import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-10px_rgba(0,180,100,0.15)] transition-all duration-300 hover:-translate-y-1.5 group flex flex-col h-full">
            <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                <img src={product.image || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs font-extrabold text-primary-600 tracking-widest uppercase mb-2">{product.category}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed flex-grow">{product.description}</p>
                
                <div className="flex flex-col gap-4 mt-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < product.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                            ))}
                        </div>
                        <span className="text-xs font-medium text-gray-400">({product.reviews} đánh giá)</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="font-extrabold text-gray-900 text-xl">{product.price.toLocaleString()}đ</span>
                        <button className="bg-gray-100 text-gray-800 hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-500 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-primary-500/30 active:scale-95 transition-all duration-200 flex items-center gap-2">
                            <span>🛒</span> Thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        image: PropTypes.string,
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        reviews: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
    }).isRequired,
};

export default ProductCard;