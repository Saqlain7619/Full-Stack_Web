import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import api from '../api/axios';
import ProductGrid from '../components/product/ProductGrid';
import Pagination from '../components/common/Pagination';

const sortOptions = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'createdAt';
  const currentMin = searchParams.get('minPrice') || '';
  const currentMax = searchParams.get('maxPrice') || '';
  const currentFeatured = searchParams.get('featured') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 12 };
      if (currentCategory) params.category = currentCategory;
      if (currentSearch) params.search = currentSearch;
      if (currentMin) params.minPrice = currentMin;
      if (currentMax) params.maxPrice = currentMax;
      if (currentFeatured) params.featured = currentFeatured;
      if (currentSort === 'price_desc') { params.sort = 'price'; params.order = 'desc'; }
      else if (currentSort !== 'createdAt') { params.sort = currentSort; }
      const { data } = await api.get('/products', { params });
      setProducts(data.products); setTotal(data.total); setPages(data.pages);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { api.get('/categories').then(({ data }) => setCategories(data.categories)); }, []);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = currentCategory || currentSearch || currentMin || currentMax || currentFeatured;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900">
            {currentSearch ? `Results for "${currentSearch}"` : currentCategory ? categories.find(c => c.slug === currentCategory)?.name || 'Products' : currentFeatured ? 'Featured Products' : 'All Products'}
          </h1>
          {!loading && <p className="text-gray-500 text-sm mt-1">{total} products found</p>}
        </div>
        <div className="flex items-center gap-3">
          {hasFilters && <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"><X size={14} />Clear filters</button>}
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 btn-secondary py-2 px-4 text-sm lg:hidden">
            <SlidersHorizontal size={15} />Filters
          </button>
          <div className="relative">
            <select value={currentSort} onChange={(e) => setParam('sort', e.target.value)} className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white cursor-pointer">
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
          <div className="card p-5 space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                <button onClick={() => setParam('category', '')} className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!currentCategory ? 'bg-primary-50 text-primary-700 font-semibold' : 'hover:bg-gray-50'}`}>
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setParam('category', cat.slug)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${currentCategory === cat.slug ? 'bg-primary-50 text-primary-700 font-semibold' : 'hover:bg-gray-50'}`}>
                    <span>{cat.name}</span>
                    <span className="text-xs text-gray-400">{cat._count?.products}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={currentMin} onChange={(e) => setParam('minPrice', e.target.value)} className="input-field py-2 text-sm" min="0" />
                <span className="text-gray-400 text-sm">—</span>
                <input type="number" placeholder="Max" value={currentMax} onChange={(e) => setParam('maxPrice', e.target.value)} className="input-field py-2 text-sm" min="0" />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Special</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={currentFeatured === 'true'} onChange={(e) => setParam('featured', e.target.checked ? 'true' : '')} className="rounded text-primary-600" />
                <span className="text-sm">Featured products only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} loading={loading} />
          <Pagination page={currentPage} pages={pages} onChange={(p) => setParam('page', p)} />
        </div>
      </div>
    </div>
  );
}
