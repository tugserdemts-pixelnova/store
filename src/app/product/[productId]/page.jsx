"use client";

import { use, useEffect, useState } from "react";
import { ArrowLeft, ShoppingBag, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { CartButton, useCart } from "@/components/cart-provider";

export default function ProductPage({ params }) {
  const { productId } = use(params);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://dummyjson.com/products/${productId}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load product");
        return response.json();
      })
      .then(setProduct)
      .catch((fetchError) => { if (fetchError.name !== "AbortError") setError(true); });
    return () => controller.abort();
  }, [productId]);

  if (!product && !error) return <main className="detail-loading"><div className="detail-loading-image" /><span>Finding the details…</span></main>;
  if (error || !product) return <main className="detail-loading"><h1>We couldn’t find that piece.</h1><button className="back-link" onClick={() => router.push("/")}><ArrowLeft size={16} /> Back to the collection</button></main>;

  return (
    <main className="storefront product-detail-page">
      <header className="site-header"><a className="wordmark" href="/"><span className="wordmark-mark">f.</span> forma</a><CartButton /></header>
      <button className="back-link" onClick={() => router.push("/")}><ArrowLeft size={15} /> Back to the collection</button>
      <section className="product-detail">
        <div className="detail-image"><img src={product.images?.[0] || product.thumbnail} alt={product.title} /><span className="detail-image-count">01 / {String(product.images?.length ?? 1).padStart(2, "0")}</span></div>
        <div className="detail-copy">
          <p className="product-category">{product.category.replaceAll("-", " ")}</p>
          <h1>{product.title}</h1>
          <div className="detail-rating"><Star size={13} fill="currentColor" /> {product.rating.toFixed(1)} <span>·</span> {product.reviews?.length ? `${product.reviews.length} reviews` : "A customer favorite"}</div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-price">${product.price.toFixed(2)} <span>USD</span></div>
          <button className="add-to-bag" onClick={() => addItem(product)}><ShoppingBag size={16} /> Add to bag <span>${product.price.toFixed(2)}</span></button>
          <p className="detail-note">Thoughtfully selected. Ready to make itself at home.</p>
          <div className="detail-specs"><div><span>Availability</span><b>{product.availabilityStatus ?? "In stock"}</b></div><div><span>Shipping</span><b>{product.shippingInformation ?? "Ships in 2–5 business days"}</b></div><div><span>Returns</span><b>{product.returnPolicy ?? "30 day returns"}</b></div></div>
        </div>
      </section>
      <footer className="site-footer"><a className="wordmark" href="/"><span className="wordmark-mark">f.</span> forma</a><p>Make room for the good stuff.</p><span>© 2024 Forma Studio</span></footer>
    </main>
  );
}
