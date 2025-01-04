"use client";

import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext'

export default function FeedbackBox() {
  const [show, setShow] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError("Feedback cannot be empty!");
      return;
    }
    setError("");
    setSubmitted(true);

    try {
      // Making the POST request to the API
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: feedback,
          userEmail: currentUser.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback.");
      }

      const data = await response.json();

      setFeedback("");
      setSubmitted(true);
      console.log("Feedback submitted:", data);
    } catch (err) {
      setError("There was an error submitting your feedback. Please try again.");
      setSubmitted(false);
      console.error(err);
    }
  };

  if (!show || !currentUser) return null;

  return (
    <div
      style={{
        width: "100%",
        zIndex: 1000,
        backgroundColor: "#f8f9fa",
        padding: "10px 20px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="m-0">Feedback/suggestions for the site:</h5>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setShow(false)}
        >
          Close
        </Button>
      </div>
      <Form onSubmit={handleSubmit} className="mt-3">
        {error && <Alert variant="danger">{error}</Alert>}
        {submitted && <Alert variant="success">Thank you for your feedback!</Alert>}
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={2}
            value={feedback}
            placeholder="Share your thoughts..."
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="mt-2 bg-blue-400"
          disabled={submitted}
        >
          Submit Feedback
        </Button>
      </Form>
    </div>
  );
}