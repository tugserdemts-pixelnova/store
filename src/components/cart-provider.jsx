"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("forma-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch { window.localStorage.removeItem("forma-cart"); }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem("forma-cart", JSON.stringify(items));
  }, [items, loaded]);

  const value = useMemo(() => ({
    items,
    addItem(product) {
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        return existing
          ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
          : [...current, { id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, quantity: 1 }];
      });
      setIsOpen(true);
    },
    changeQuantity(id, amount) {
      setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0));
    },
    removeItem(id) { setItems((current) => current.filter((item) => item.id !== id)); },
    openCart() { setIsOpen(true); },
  }), [items]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className={`cart-overlay ${isOpen ? "cart-overlay-open" : ""}`} onClick={() => setIsOpen(false)} aria-hidden={!isOpen} />
      <aside className={`cart-drawer ${isOpen ? "cart-drawer-open" : ""}`} aria-label="Shopping bag" aria-hidden={!isOpen}>
        <div className="cart-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> Your collection</span><h2>Your bag <span>({count})</span></h2></div><button className="cart-close" onClick={() => setIsOpen(false)} aria-label="Close bag"><X size={19} /></button></div>
        {items.length ? <>
          <div className="cart-items">{items.map((item) => <article className="cart-item" key={item.id}>
            <div className="cart-item-image"><img src={item.thumbnail} alt="" /></div>
            <div className="cart-item-copy"><p>{item.title}</p><span>${item.price.toFixed(2)}</span><div className="quantity-control"><button onClick={() => value.changeQuantity(item.id, -1)} aria-label={`Remove one ${item.title}`}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => value.changeQuantity(item.id, 1)} aria-label={`Add one ${item.title}`}><Plus size={13} /></button><button className="remove-item" onClick={() => value.removeItem(item.id)} aria-label={`Remove ${item.title}`}><Trash2 size={13} /></button></div></div>
            <strong>${(item.price * item.quantity).toFixed(2)}</strong>
          </article>)}</div>
          <div className="cart-summary"><p><span>Subtotal</span><strong>${total.toFixed(2)}</strong></p><small>Checkout is coming soon. Your bag is saved on this device.</small><button onClick={() => setIsOpen(false)}>Keep browsing <span>→</span></button></div>
        </> : <div className="cart-empty"><ShoppingBag size={24} strokeWidth={1.3} /><h3>Your bag is taking a little break.</h3><p>Find something useful, beautiful, or a little unexpected.</p><button onClick={() => setIsOpen(false)}>Explore the collection</button></div>}
      </aside>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

export function CartButton({ label = "Bag" }) {
  const { items, openCart } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return <button className="bag-link" onClick={openCart} aria-label={`Open bag, ${count} items`}><ShoppingBag size={17} strokeWidth={1.7} /><span>{label}</span><span className="bag-count">{count}</span></button>;
}
