import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import api from '../api/axios';
import ProductGrid from '../components/product/ProductGrid';
import Pagination from '../components/common/Pagination';
import { getImageUrl } from '../utils/imageUrl';


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
      setProducts(data?.products || []);
      setTotal(data?.total || 0);
      setPages(data?.pages || 1);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data?.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = currentCategory || currentSearch || currentMin || currentMax || currentFeatured;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Link to="/" className="text-[10px] uppercase tracking-widest font-bold text-black/40 hover:text-black transition-colors">Home</Link>
            <span className="text-black/10 text-[10px]">/</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary-600">Collection</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-black">
            {currentFeatured ? 'The Selected' : (currentCategory ? categories.find(c => c.slug === currentCategory)?.name : 'Catalog')}
          </h1>
          {currentSearch && <p className="text-black/40 text-sm mt-3 font-medium">Results for "{currentSearch}"</p>}
        </div>

        <div className="flex items-center gap-4">
           {!loading && <span className="text-[11px] font-bold uppercase tracking-widest text-black/40 mr-2">{total} Pieces found</span>}
           <div className="relative group">
            <select 
              value={currentSort} 
              onChange={(e) => setParam('sort', e.target.value)} 
              className="appearance-none bg-white border border-black/5 rounded-xl pl-5 pr-12 py-3 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary-600 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 group-hover:text-black transition-colors pointer-events-none" />
           </div>
           <button onClick={() => setFiltersOpen(!filtersOpen)} className="lg:hidden flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest">
             <SlidersHorizontal size={14} /> Filters
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Modern Sidebar Filters */}
        <aside className={`${filtersOpen ? 'fixed inset-0 z-[100] bg-white p-8 pt-20 animate-in slide-in-from-bottom duration-500' : 'hidden'} lg:block w-72 flex-shrink-0 transition-all`}>
           {filtersOpen && <button onClick={() => setFiltersOpen(false)} className="lg:hidden absolute top-6 right-6 p-2 bg-black/5 rounded-full"><X size={24} /></button>}
           
           <div className="space-y-12">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black mb-6">Categories</h3>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setParam('category', '')} 
                  className={`text-left text-[13px] font-medium transition-colors ${!currentCategory ? 'text-primary-600' : 'text-black/40 hover:text-black'}`}
                >
                  All Masterpieces
                </button>
                {(categories || []).map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => setParam('category', cat.slug)}
                    className={`text-left text-[13px] font-medium transition-all flex items-center justify-between group ${currentCategory === cat.slug ? 'text-primary-600 pl-2 border-l-2 border-primary-600' : 'text-black/40 hover:text-black hover:pl-2'}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">({cat._count?.products})</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black mb-6">Price Spectrum</h3>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 group">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-black/20 group-focus-within:text-primary-600">Rs.</span>
                   <input type="number" placeholder="Min" value={currentMin} onChange={(e) => setParam('minPrice', e.target.value)} className="w-full pl-8 pr-4 py-3 bg-luxury-gray border border-transparent rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-primary-600 transition-all" />
                </div>
                <div className="relative flex-1 group">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-black/20 group-focus-within:text-primary-600">Rs.</span>
                   <input type="number" placeholder="Max" value={currentMax} onChange={(e) => setParam('maxPrice', e.target.value)} className="w-full pl-8 pr-4 py-3 bg-luxury-gray border border-transparent rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-primary-600 transition-all" />
                </div>
              </div>
            </div>

            <div className="pt-6">
              {hasFilters && (
                <button 
                  onClick={clearFilters} 
                  className="w-full py-4 border border-black/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={14} /> Reset All Filters
                </button>
              )}
            </div>
           </div>
        </aside>

        {/* Catalog Grid */}
        <div className="flex-1">
          <ProductGrid products={products} loading={loading} />
          {!loading && products.length > 0 && (
            <div className="mt-16 pt-12 border-t border-black/5 flex justify-center">
              <Pagination page={currentPage} pages={pages} onChange={(p) => setParam('page', p)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
