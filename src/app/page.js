"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      let response 

      if (searchValue === '') {
        response = await fetch("https://dummyjson.com/products")
      } else {
        response = await fetch(`https://dummyjson.com/products/search?q=${searchValue}`)
      }
      
      const data = await response.json();
      setProducts(data.products);
      setIsLoading(false);
    }
    fetchProducts();
  }, [searchValue]);

  const handleSearchInput = (event) => {
    setSearchValue(event.target.value);
  }

  if (isLoading) {
    return "Loading please wait....";
  }
  const handleRedirect = (productId) => {
    router.push(`/product/${productId}`);                             
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold ">Products</h1>
      <div className="w-full flex flex-wrap max-w-3xl gap-2"></div>
      <Input value={searchValue} onChange={handleSearchInput}/> 
      {products.map((product) => (
        <Card key={product.id} className="w-64  cursor-pointer" onClick={() => handleRedirect(product.id)}>
          <CardHeader>
            <CardTitle>{product.title}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <img src={product.thumbnail} alt={product.title}/>
          </CardContent>
          <Button onClick={() => handleRedirect(product.id)}>View Product</Button>
        </Card>
      ))}
    </div>
  )};
