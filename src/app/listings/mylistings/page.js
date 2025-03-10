"use client";

import Listings from '../../components/Listings';
import { useAuth } from "../../contexts/AuthContext";

export default function MyListings() {
  const { currentUser } = useAuth();

  return (
    <>
      <Listings userEmail={currentUser.email} />
    </>
  )
}
