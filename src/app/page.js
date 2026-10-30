"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownWideNarrow, ArrowRight, ArrowUpRight, Search, ShoppingBag, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { CartButton, useCart } from "@/components/cart-provider";

const categories = ["All pieces", "beauty", "fragrances", "furniture", "groceries", "home-decoration", "kitchen-accessories", "laptops", "mens-shirts", "mens-shoes", "mens-watches", "mobile-accessories", "motorcycle", "skin-care", "smartphones", "sports-accessories", "sunglasses", "tablets", "tops", "vehicle", "womens-bags", "womens-dresses", "womens-jewellery", "womens-shoes", "womens-watches"];

const titleCase = (text) => text.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("All pieces");
  const [sortByPrice, setSortByPrice] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://dummyjson.com/products?limit=100", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load products");
        return response.json();
      })
      .then((data) => setProducts(data.products ?? []))
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") setError(true);
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  const visibleProducts = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesSearch = !query || `${product.title} ${product.description} ${product.category}`.toLowerCase().includes(query);
      return matchesSearch && (category === "All pieces" || product.category === category);
    });
    return sortByPrice ? [...filtered].sort((a, b) => a.price - b.price) : filtered;
  }, [products, searchValue, category, sortByPrice]);

  return (
    <main className="storefront">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Forma home"><span className="wordmark-mark">f.</span> forma</a>
        <nav className="header-links" aria-label="Main navigation"><a href="#collection">Shop all</a><a href="#about">Our point of view</a></nav>
        <CartButton />
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> Thoughtful things, well made</div>
          <h1>Good things<br />for <em>every day.</em></h1>
          <p>A considered collection for the spaces you live in and the life you make there.</p>
          <a className="hero-cta" href="#collection">Explore the collection <ArrowRight size={16} /></a>
          <div className="hero-note"><Sparkles size={15} /> Curated for the way you live</div>
        </div>
        <div className="hero-art" aria-label="Sculptural home objects in warm tones" role="img">
          <div className="art-sun" /><div className="art-arch" /><div className="art-vase vase-tall" /><div className="art-vase vase-round" /><div className="art-book book-one" /><div className="art-book book-two" />
          <span className="art-caption">Objects for a slower kind of living</span>
          <span className="art-number">01 / 04</span>
        </div>
        <div className="hero-index">EST. 2024 <span>·</span> MADE TO LAST</div>
      </section>

      <section className="collection" id="collection">
        <div className="collection-heading">
          <div><div className="eyebrow"><span className="eyebrow-line" /> The collection</div><h2>Find your <em>favorite.</em></h2></div>
          <p>Useful, beautiful, and a little unexpected.<br />The everyday deserves a bit of wonder.</p>
        </div>
        <div className="collection-toolbar">
          <label className="search-box"><Search size={17} /><input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search the collection" aria-label="Search the collection" /><kbd>⌘ K</kbd></label>
          <button className={`sort-button ${sortByPrice ? "sort-active" : ""}`} onClick={() => setSortByPrice(!sortByPrice)}><ArrowDownWideNarrow size={16} /> {sortByPrice ? "Price: low to high" : "Sort"}</button>
        </div>
        <div className="category-list" aria-label="Filter by category">
          {categories.map((item) => <button key={item} className={`category-chip ${category === item ? "category-selected" : ""}`} onClick={() => setCategory(item)}>{titleCase(item)}</button>)}
        </div>

        <div className="results-line"><span>{isLoading ? "Gathering good things…" : `${visibleProducts.length} considered finds`}</span><span>01 — {String(visibleProducts.length).padStart(2, "0")}</span></div>
        {error ? <div className="empty-state"><h3>We couldn’t load the collection.</h3><p>Check your connection and refresh to try again.</p></div> : isLoading ? <div className="product-grid">{Array.from({ length: 8 }, (_, i) => <div className="product-skeleton" key={i}><div /><span /><span /></div>)}</div> : visibleProducts.length ? (
          <div className="product-grid">
            {visibleProducts.map((product, index) => (
                <article className="product-card" key={product.id}>
                <button className="product-image" aria-label={`View ${product.title}`} onClick={() => router.push(`/product/${product.id}`)}>
                  <img src={product.thumbnail} alt={product.title} loading={index > 7 ? "lazy" : "eager"} />
                  {index < 3 && <span className="product-tag">A good find</span>}
                  <span className="product-arrow"><ArrowUpRight size={17} /></span>
                </button>
                <div className="product-info"><div><p className="product-category">{titleCase(product.category)}</p><h3>{product.title}</h3></div><span className="product-price">${product.price.toFixed(2)}</span></div>
                <p className="product-rating"><span>★</span> {product.rating.toFixed(1)} <i>·</i> {product.availabilityStatus ?? "In stock"}</p>
                <button className="quick-add" onClick={() => addItem(product)}><ShoppingBag size={13} /> Add to bag <span>+</span></button>
              </article>
            ))}
          </div>
        ) : <div className="empty-state"><h3>No finds just yet.</h3><p>Try another search or browse all pieces.</p><button onClick={() => { setSearchValue(""); setCategory("All pieces"); }}>Clear filters</button></div>}
      </section>

      <footer className="site-footer" id="about"><a className="wordmark" href="#top"><span className="wordmark-mark">f.</span> forma</a><p>Make room for the good stuff.</p><span>© 2024 Forma Studio</span></footer>
    </main>
  );
}
