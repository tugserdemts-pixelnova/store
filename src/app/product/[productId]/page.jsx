"use client";

import { use, useEffect, useState } from "react";

export default function ProductPage({ params }) {
    const unwrappedParams = use(params);
    const [product, setProduct] = useState(null);

    const productId = unwrappedParams.productId;


    useEffect(() => {
    const fetchSingleProduct = async () => {
        const response = await fetch
        (`https://dummyjson.com/products/${productId}`);
        const data = await response.json();
        setProduct(data);
    };
    fetchSingleProduct();
  }, []);  
  return (
    <div>
      <div>{product?.title}</div>
      <div>{product?.description}</div>
      <div>{product?.category}</div>
    </div>
  )}

   
