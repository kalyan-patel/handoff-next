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

    if (!currentUser) {
      setError("You must be logged in to submit feedback!");
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

  if (!show) return null;

  // For only showing to users
  // if (!show || !currentUser) return null;

  return (
    <div className="max-w-lg, z-50, p-10 md:px-20">
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="m-0 font-medium text-xl">Feedback/suggestions for the site:</h5>
        {/* <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setShow(false)}
        >
          Close
        </Button> */}
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
          className="mt-2"
          disabled={submitted}
        >
          Submit Feedback
        </Button>
      </Form>
    </div>
  );
}