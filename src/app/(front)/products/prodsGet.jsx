"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AddPost from "./prodsPost";
import EditProductModal from "./editProduct"; // Import the modal

export default function Prods() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProductId, setEditProductId] = useState(null); // Track which product is being edited
  const [ses, setSes] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setData(res.data.pros);
      setSes(res.data.session);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete("/api/products", { data: { id } });

      if (res.status !== 200) {
        throw new Error(res.data.error || "Failed to delete");
      }

      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAddProduct = (newProduct) => {
    setData((prev) => [...prev, newProduct]);
  };

  const handleEdit = (id) => {
    setEditProductId(id); // Set the ID of the product being edited
  };

  const handleUpdateProduct = (updatedProduct) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === updatedProduct.id ? updatedProduct : item
      )
    );
    setEditProductId(null); // Clear the editProductId
  };

  if (loading) {
    return <h2 className="text-center text-2xl">Loading...</h2>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-4">
        <h2 className="text-3xl font-bold text-center">
          Products {ses && ses.user.username}
        </h2>
      </header>
      <main>
        <AddPost onAddProduct={handleAddProduct} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((el) => (
            <div
              key={el.id}
              className="flex flex-col items-center justify-center p-4 border rounded shadow-md"
            >
              <span className="text-xl font-semibold mb-2">{el.title}</span>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDelete(el.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(el.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => router.push(`/products/${el.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Go to ID
                </button>
              </div>
            </div>
          ))}
        </div>
        {editProductId && (
          <EditProductModal
            productId={editProductId}
            onUpdateProduct={handleUpdateProduct}
            onClose={() => setEditProductId(null)}
          />
        )}
      </main>
    </div>
  );
}
