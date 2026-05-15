import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";

function Products() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const decoded = decodeToken(token);

    if (!decoded) {
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    fetchProducts(token);
  }, []);

  const fetchProducts = async (token) => {
    setLoading(true);

    try {
      const response = await api.get("/products");

      setProducts(response.data);
    } catch (err) {
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError("Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="nav">
        <h2>Products</h2>
        <div>
          <button onClick={() => navigate("/products/new")}>
            + New Product
          </button>
          <button className="danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {products.map((product) => (
          <div className="card" key={product._id}>
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} width="200" />
            )}
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <p>{product.category}</p>
            <p className={product.inStock ? "success" : "error"}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </p>
            <button onClick={() => navigate(`/products/edit/${product._id}`)}>
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
