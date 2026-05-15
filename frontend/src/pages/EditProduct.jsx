import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../utils/api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inStock: true,
    imageUrl: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const p = response.data;

        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          category: p.category || "",
          inStock: p.inStock ?? true,
          imageUrl: p.imageUrl || "",
        });
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setError("Product not found");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError("Price must be a positive number");
      return;
    }

    try {
      await api.patch(`/products/${id}`, {
        ...form,
        price: Number(form.price),
      });

      setSuccess("Product updated successfully!");
      setTimeout(() => navigate("/products"), 1500);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        navigate("/");
      } else if (status === 404) {
        setError("Product not found");
      } else {
        setError("Something went wrong");
      }
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      setSuccess("Product deleted!");
      setTimeout(() => navigate("/products"), 1500);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        navigate("/");
      } else if (status === 404) {
        setError("Product not found");
      } else {
        setError("Something went wrong");
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form">
      <h2>Edit Product</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <input
        name="name"
        placeholder="Product name"
        value={form.name}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />
      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
      />
      <input
        name="imageUrl"
        placeholder="Image URL (optional)"
        value={form.imageUrl}
        onChange={handleChange}
      />
      <label>
        <input
          name="inStock"
          type="checkbox"
          checked={form.inStock}
          onChange={handleChange}
        />
        In Stock
      </label>

      <button onClick={handleUpdate}>Update Product</button>
      <button onClick={() => navigate("/products")}>Cancel</button>
      <button onClick={() => setShowConfirm(true)} className="danger">
        Delete Product
      </button>

      {/* confirmation dialog */}
      {showConfirm && (
        <div className="confirm">
          <p style={{ marginBottom: "10px" }}>
            Are you sure you want to delete this product?
          </p>
          <button onClick={() => setShowConfirm(false)}>Cancel</button>
          <button onClick={handleDelete} className="danger">
            Confirm Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default EditProduct;
