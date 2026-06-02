import PropTypes from 'prop-types';

const ReviewCard = ({ review }) => {
    const rating = Math.round(Number(review.rating || 0));

    return (
        <article className="wellness-surface p-6">
            <div className="mb-5 flex items-center gap-4">
                <img src={review.avatar} alt={review.name} className="h-12 w-12 rounded-full border border-leaf-100 object-cover" />
                <div>
                    <h4 className="text-base font-extrabold text-leaf-800">{review.name}</h4>
                    <div className="mt-1 flex items-center" aria-label={`${rating} trên 5 sao`}>
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`mr-0.5 h-4 w-4 ${i < rating ? 'text-amberSoft' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                </div>
            </div>
            <p className="text-sm leading-7 text-gray-600">{review.review}</p>
        </article>
    );
};

ReviewCard.propTypes = {
    review: PropTypes.shape({
        avatar: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        review: PropTypes.string.isRequired,
    }).isRequired,
};

export default ReviewCard;
