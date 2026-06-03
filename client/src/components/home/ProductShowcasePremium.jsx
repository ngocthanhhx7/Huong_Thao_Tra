import { homeProducts, storyChapters } from '../../data/homeStoryData';
import ProductFormulaCard from './ProductFormulaCard';

const ProductShowcasePremium = () => (
  <section className="products-section story-section relative isolate overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
    <div className="products-bg" aria-hidden="true" />

    <div className="relative z-10 mx-auto max-w-7xl">
      <div className="reveal mb-14 grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-end">
        <div>
          <span className="chapter-kicker chapter-kicker-herbal">
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

      <div className="formula-grid">
        {homeProducts.map((product, index) => (
          <ProductFormulaCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  </section>
);

export default ProductShowcasePremium;
