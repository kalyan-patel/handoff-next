"use client";

import React, { useRef, useState } from "react";
import { Card, Form, Button, Container, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, sendEmailVerification } from "firebase/auth";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Check for Tufts email
    // if (!emailRef.current.value.endsWith("@tufts.edu")) {
    //   return setError("You must use a Tufts email address");
    // }

    if (nameRef.current.value.length > 12) {
      return setError("Name must be 12 characters or less");
    }

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      // Sign up user
      const userCredential = await signup(
        emailRef.current.value,
        passwordRef.current.value,
        nameRef.current.value
      );

      // Send verification email
      const auth = getAuth();
      await sendEmailVerification(auth.currentUser);

      setSuccess("Sign-up successful! Please check your email for a verification link.");
    } catch (error) {
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "90vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="name" className="mb-2">
                <Form.Label>First name / Username</Form.Label>
                <Form.Control type="text" ref={nameRef} required />
              </Form.Group>
              <Form.Group id="email" className="mb-2">
                <Form.Label>Tufts email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password" className="mb-2">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Form.Group id="password-confirm" className="mb-2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} required />
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-3" type="submit">
                Sign Up
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link href="/login">Log In</Link>
        </div>
      </div>
    </Container>
  );
}




