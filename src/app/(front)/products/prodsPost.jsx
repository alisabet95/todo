"use client";
import { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, ErrorMessage, Field } from "formik";
import ButtonD from "../(material)/button";

export default function AddPost({ onAddProduct }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const ValidatedYup = Yup.object({
    title: Yup.string()
      .min(2, "Too short")
      .max(50, "Too Long")
      .required("type!"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post("/api/products", values);
      if (res.status !== 201) {
        throw new Error(res.data.error || "Failed to create product");
      }
      setSuccess("Product created successfully");
      resetForm();
      onAddProduct(res.data); // Call the callback function to update the product list
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <h2>Add new product</h2>
      <Formik
        initialValues={{ title: "" }}
        validationSchema={ValidatedYup}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div>
              <label style={{ color: "black" }} htmlFor="title">
                Title:{" "}
              </label>
              <Field type="text" id="title" name="title" />
              <ErrorMessage
                name="title"
                component="div"
                style={{ color: "red" }}
              />
            </div>
            <div className="text-center">
              <button className="text-center align-center" type="submit">
                Add Title
              </button>{" "}
            </div>
          </Form>
        )}
      </Formik>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", textAlign: "center" }}>{success}</p>
      )}
    </>
  );
}
