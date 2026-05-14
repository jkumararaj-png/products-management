import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Products from "./pages/Products";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}

export default App;
