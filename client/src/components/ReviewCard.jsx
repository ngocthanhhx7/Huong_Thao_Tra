import PropTypes from 'prop-types';

const ReviewCard = ({ review }) => {
    return (
        <div className="bg-white p-8 rounded-3xl outline outline-1 outline-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div className="flex items-center mb-6">
                <div className="relative">
                    <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full mr-4 object-cover border border-gray-100 shadow-sm" />
                    <div className="absolute -bottom-1 right-3 bg-white rounded-full p-0.5 shadow-sm">
                        <span className="flex w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
                    <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 mr-0.5 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                </div>
            </div>
            <p className="text-gray-600 leading-relaxed relative z-10">
                <span className="text-4xl text-gray-200 absolute -top-4 -left-2 -z-10 font-serif opacity-50">&quot;</span>
                {review.review}
            </p>
        </div>
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