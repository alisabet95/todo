"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ButtonD from "./(front)/(material)/button";
import { signIn } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schemas with Yup
const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
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
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function HomeAu({ name }) {
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
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const res = await signIn("google", { redirect: false });
      if (res?.error) {
        alert("Google sign-in failed: " + res.error);
      } else {
        router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header>
        {" "}
        <h1>Hello {name === "unknown" ? "Google User" : name}</h1>
      </header>
      <main>
        {" "}
        <h2 style={styles.title}>{isRegister ? "Register" : "Login"}</h2>
        <div style={styles.toggleContainer}>
          <button
            onClick={() => setIsRegister(true)}
            style={{
              ...styles.toggleButton,
              backgroundColor: isRegister ? "#3b82f6" : "#e5e7eb",
              color: isRegister ? "white" : "black",
            }}
            disabled={isLoading}
          >
            Register
          </button>
          <button
            onClick={() => setIsRegister(false)}
            style={{
              ...styles.toggleButton,
              backgroundColor: !isRegister ? "#3b82f6" : "#e5e7eb",
              color: !isRegister ? "white" : "black",
            }}
            disabled={isLoading}
          >
            Login
          </button>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={isRegister ? registerSchema : loginSchema}
          onSubmit={handleSubmit}
          validateOnBlur
        >
          {({ isSubmitting }) => (
            <Form style={styles.form}>
              <div style={styles.inputContainer}>
                <Field
                  name="username"
                  type="text"
                  placeholder="Username"
                  style={styles.input}
                  disabled={isLoading}
                />
                <ErrorMessage
                  name="username"
                  component="p"
                  style={styles.errorMessage}
                />
              </div>

              {isRegister && (
                <div style={styles.inputContainer}>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    style={styles.input}
                    disabled={isLoading}
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    style={styles.errorMessage}
                  />
                </div>
              )}

              <div style={styles.inputContainer}>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  style={styles.input}
                  disabled={isLoading}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  style={styles.errorMessage}
                />
              </div>

              <button
                type="submit"
                style={styles.submitButton}
                disabled={isLoading || isSubmitting}
              >
                {isLoading
                  ? "Processing..."
                  : isRegister
                  ? "Register"
                  : "Login"}
              </button>

              <button
                onClick={handleGoogleSignIn}
                style={styles.googleButton}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Sign in with Google"}
              </button>
            </Form>
          )}
        </Formik>
        <ButtonD onClick={() => router.push("/sign-page")} ph="Go sign in" />{" "}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f0f0",
    padding: "5px",
    marginTop: "0",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "16px",
  },
  toggleContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  },
  toggleButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: "14px",
    marginTop: "4px",
  },
  submitButton: {
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
  },
  googleButton: {
    padding: "12px 24px",
    backgroundColor: "#ef4444",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
  },
};
