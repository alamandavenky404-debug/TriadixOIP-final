import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Search,
  Heart,
  ShoppingCart,
  CheckCircle,
  Star,
  Tag,
  ArrowRight,
  Trash2,
  Package
} from 'lucide-react';
import { ShoppingProduct } from '../types/career';
import { MOCK_SHOPPING_PRODUCTS } from '../data/mockData';

export const AiShoppingAssistant: React.FC = () => {
  const [products, setProducts] = useState<ShoppingProduct[]>(MOCK_SHOPPING_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product: ShoppingProduct; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1']);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activePersona, setActivePersona] = useState<'All' | 'Developer Rig' | 'Audiophile' | 'Ergonomics'>('All');
  const [aiSearchTip, setAiSearchTip] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setAiSearchTip(null);
      return;
    }
    // Simulate AI Semantic Search query intent
    setAiSearchTip(`AI Semantic Intent Parsed: Searching for ergonomic hardware optimized for long coding workflows`);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specs.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activePersona === 'Developer Rig') {
      return matchesSearch && (p.category === 'Peripherals' || p.category === 'Monitors');
    }
    if (activePersona === 'Audiophile') {
      return matchesSearch && p.category === 'Audio';
    }
    if (activePersona === 'Ergonomics') {
      return matchesSearch && (p.category === 'Furniture' || p.category === 'Monitors');
    }
    return matchesSearch;
  });

  const addToCart = (product: ShoppingProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    setOrderSuccess(true);
    setCart([]);
    setTimeout(() => {
      setOrderSuccess(false);
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Capstone Header Banner */}
      <div className="rounded-2xl border border-amber-900/50 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-amber-950/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Capstone Project #3 • Live Interactive Prototype</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              AI Smart Shopping & Hardware Assistant
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Next-generation developer e-commerce experience with natural language semantic search, automated personalized recommendations, real-time cart state, and order checkout flows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-600/30 hover:bg-amber-500 transition-all cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
              <span className="ml-1 rounded bg-amber-800 px-1.5 py-0.2 text-[11px] font-mono">
                ${cartTotal.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & AI Persona Filters */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask AI: e.g. 'Silent tactile keyboard and 4K portrait display for coding under $400'..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-amber-600 hover:text-white transition-all border border-slate-700"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Semantic Search</span>
          </button>
        </form>

        {aiSearchTip && (
          <div className="rounded-lg bg-amber-500/10 p-2.5 text-xs text-amber-300 border border-amber-500/20 flex items-center justify-between">
            <span>{aiSearchTip}</span>
            <button onClick={() => setAiSearchTip(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Persona Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400">AI Persona Recs:</span>
          {(['All', 'Developer Rig', 'Audiophile', 'Ergonomics'] as const).map((persona) => (
            <button
              key={persona}
              onClick={() => setActivePersona(persona)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                activePersona === persona
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {persona}
            </button>
          ))}
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((prod) => {
          const isWishlisted = wishlist.includes(prod.id);
          return (
            <div
              key={prod.id}
              className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Image */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden group">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prod.badge && (
                    <span className="absolute top-2 left-2 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-extrabold text-slate-950 shadow">
                      {prod.badge}
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-sm text-slate-300 hover:text-rose-400 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">
                      {prod.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span>{prod.rating}</span>
                      <span className="text-slate-500">({prod.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-1">{prod.name}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {prod.specs.slice(0, 2).map((sp, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-slate-950 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 border border-slate-800"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="p-4 pt-0 border-t border-slate-800/80 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">MSRP</span>
                  <span className="text-base font-extrabold text-white">${prod.price.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => addToCart(prod)}
                  className="flex items-center gap-1 rounded-lg bg-amber-600/20 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-600 hover:text-white transition-all border border-amber-500/30 cursor-pointer"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Drawer / Slideover */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="h-full w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Your Shopping Cart</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {orderSuccess && (
                <div className="rounded-xl bg-emerald-950/40 p-4 text-center space-y-1 text-emerald-300 border border-emerald-800/40 animate-pulse">
                  <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
                  <p className="font-bold text-sm">Order Confirmed!</p>
                  <p className="text-xs text-slate-400">Transaction simulated successfully.</p>
                </div>
              )}

              {cart.length === 0 && !orderSuccess ? (
                <p className="text-xs text-slate-500 py-12 text-center italic">Your cart is currently empty.</p>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="rounded-xl bg-slate-950 p-3 flex items-center justify-between gap-3 border border-slate-800"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                        <p className="text-[11px] text-slate-400">
                          ${item.product.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="space-y-3 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-mono text-sm font-bold text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">AI Placement Discount (100%)</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">-$0.00 (Demo Mode)</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full rounded-xl bg-amber-600 py-3 text-xs font-bold text-white shadow-lg shadow-amber-600/30 hover:bg-amber-500 transition-all cursor-pointer"
                >
                  Simulate Instant Order Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
