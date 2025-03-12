// Fetching component
"use client";
import { useState, useEffect } from "react";

export default function Fetching({ ids }) {
  const [product, setProduct] = useState(null);

  async function getData() {
    const res = await fetch(`/api/products/${ids}`);
    const data = await res.json();
    setProduct(data);
  }

  useEffect(() => {
    getData();
  }, []);

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h2>{product.title}</h2>
    </div>
  );
}
