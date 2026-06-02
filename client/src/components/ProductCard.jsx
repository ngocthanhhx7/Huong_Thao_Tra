import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
    const rating = Math.round(Number(product.rating || 0));

    return (
        <article className="wellness-surface group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(39,67,42,0.09)]">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-leaf-50">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-leaf-50 to-cream px-6 text-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary-100 bg-white text-primary-700">
                            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14l-1.2 10.1A2 2 0 0 1 15.8 20H8.2a2 2 0 0 1-2-1.9L5 8Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 8V6a4 4 0 0 1 8 0v2M9 13h6" />
                            </svg>
                        </span>
                        <span className="text-sm font-bold text-leaf-800">Hương trà đang cập nhật</span>
                    </div>
                )}
            </div>

            <div className="flex flex-grow flex-col p-5">
                <div className="mb-2 text-xs font-extrabold uppercase text-primary-700">{product.category}</div>
                <h3 className="mb-2 text-lg font-extrabold leading-tight text-leaf-800 transition-colors group-hover:text-primary-700">{product.name}</h3>
                <p className="mb-5 line-clamp-2 flex-grow text-sm leading-relaxed text-gray-600">{product.description}</p>

                <div className="mt-auto flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center" aria-label={`${rating} trên 5 sao`}>
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`h-4 w-4 ${i < rating ? 'text-amberSoft' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-xs font-semibold text-gray-500">({product.reviews} đánh giá)</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-leaf-100 pt-4">
                        <span className="text-xl font-extrabold text-leaf-800">{Number(product.price || 0).toLocaleString('vi-VN')}đ</span>
                        <button type="button" className="wellness-focus inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-primary-600 active:scale-[0.98]">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 8.5H8L6 6Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6 5 3H2M9 20h.01M18 20h.01" />
                            </svg>
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
        </article>
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
