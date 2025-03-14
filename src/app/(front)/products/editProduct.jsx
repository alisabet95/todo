// components/EditProductModal.js
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, ErrorMessage, Field } from "formik";

export default function EditProductModal({
  productId,
  onUpdateProduct,
  onClose,
}) {
  const [initialValues, setInitialValues] = useState({ title: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${productId}`);
        setInitialValues(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const ValidatedYup = Yup.object({
    title: Yup.string()
      .min(2, "Too short")
      .max(50, "Too Long")
      .required("type!"),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await axios.put(`/api/products/${productId}`, values);
      onUpdateProduct(res.data);
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2>Edit Product</h2>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={ValidatedYup}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div>
                <label htmlFor="title">Title:</label>
                <Field type="text" id="title" name="title" />
                <ErrorMessage
                  name="title"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-2 bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
