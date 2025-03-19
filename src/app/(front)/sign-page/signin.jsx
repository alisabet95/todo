"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schemas with Yup
const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Must be a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const loginSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsLoading(true);
    try {
      if (isRegister) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const result = await res.json();
        if (res.ok) {
          alert("User registered successfully! Please log in.");
          setIsRegister(false);
          resetForm({
            values: { ...initialValues, username: values.username },
          }); // Pre-fill username
        } else {
          alert(result.error || "Registration failed");
        }
      } else {
        const res = await signIn("credentials", {
          username: values.username,
          password: values.password,
          redirect: false,
        });

        if (res?.error) {
          alert(res.error);
        } else {
          router.push("/todo");
        }
      }
    } catch (error) {
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setSubmitting(false); // Reset Formik's submitting state
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const res = await signIn("google", { redirect: false });
      if (res?.error) {
        alert("Google sign-in failed: " + res.error);
      } else {
        router.push("/todo");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl">{isRegister ? "Register" : "Login"}</h1>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsRegister(true)}
          className={`p-2 rounded text-black ${
            isRegister ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          disabled={isLoading}
        >
          Register
        </button>
        <button
          onClick={() => setIsRegister(false)}
          className={`p-2 rounded text-black ${
            !isRegister ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          disabled={isLoading}
        >
          Login
        </button>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={isRegister ? registerSchema : loginSchema}
        onSubmit={handleSubmit}
        validateOnBlur // Validate on blur for better UX
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4 w-1/2">
            <div>
              <Field
                name="username"
                type="text"
                placeholder="Username"
                className="p-2 border rounded text-black w-full"
                disabled={isLoading}
              />
              <ErrorMessage
                name="username"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            {isRegister && (
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="p-2 border rounded text-black w-full"
                  disabled={isLoading}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
            )}

            <div>
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="p-2 border rounded text-black w-full"
                disabled={isLoading}
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-1/3 mx-auto"
              disabled={isLoading || isSubmitting}
            >
              {isLoading ? "Processing..." : isRegister ? "Register" : "Login"}
            </button>
          </Form>
        )}
      </Formik>

      <button
        onClick={handleGoogleSignIn}
        className="bg-red-500 text-white p-2 rounded mt-2"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Sign in with Google"}
      </button>
    </div>
  );
}
