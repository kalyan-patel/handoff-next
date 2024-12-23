import ProtectedRoute from "../components/ProtectedRoute";

export default function ListingsLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}