import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inStock: true,
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
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
      await api.post("/products", {
        ...form,
        price: Number(form.price),
      });

      setSuccess("Product created successfully!");
      setError("");

      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        inStock: true,
        imageUrl: "",
      });

      setTimeout(() => navigate("/products"), 1500);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form">
      <h2>Add New Product</h2>
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
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create Product"}
      </button>
      <button onClick={() => navigate("/products")}>Cancel</button>
    </div>
  );
}

export default AddProduct;
