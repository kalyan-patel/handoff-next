import ProtectedRoute from "../components/ProtectedRoute";

export default function ChatLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}