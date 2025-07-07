import { useState, useEffect } from "react";
import axios from "axios";
import ServiceCard from "../components/ServiceCard";

function HomePage({ user }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    durationMinutes: "",
    price: "",
    category: "HairCare",
    imgURL: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const endpoint = user ? "/api/v1/services" : "/api/v1/services/public";
      const config = user
        ? {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        : {};

      const response = await axios.get(
        `http://localhost:3002${endpoint}`,
        config
      );
      if (Array.isArray(response.data)) {
        setServices(response.data);
      } else if (Array.isArray(response.data.services)) {
        setServices(response.data.services);
      } else if (Array.isArray(response.data.data?.services)) {
        setServices(response.data.data.services);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(
          `http://localhost:3002/api/v1/services/${serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service");
      }
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setEditForm({
      title: service.title,
      description: service.description,
      durationMinutes: service.durationMinutes,
      price: service.price,
      category: service.category,
    });
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await axios.put(
        `http://localhost:3002/api/v1/services/${editingService.id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setEditingService(null);
      setEditLoading(false);
      fetchServices();
      alert("Service updated successfully!");
    } catch (error) {
      setEditLoading(false);
      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          "Failed to update service"
      );
    }
  };

  const handleEditCancel = () => {
    setEditingService(null);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(services.map((service) => service.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 w-full max-w-md relative transform transition-all duration-300 scale-100 opacity-100 animate-modal-pop">
            <button
              onClick={handleEditCancel}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold bg-white rounded-full border border-gray-200 shadow-sm w-9 h-9 flex items-center justify-center transition-colors duration-150"
              aria-label="Close"
              type="button"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Edit Service
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="durationMinutes"
                    value={editForm.durationMinutes}
                    onChange={handleEditFormChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditFormChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="HairCare">Hair Care</option>
                  <option value="FacialTreatments">Facial Treatments</option>
                  <option value="Waxing">Waxing</option>
                  <option value="Massages">Massages</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="imgURL"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  img (URL)
                </label>
                <input
                  type="string"
                  id="imgURL"
                  name="imgURL"
                  value={ServiceCard.imgURL}
                  onChange={handleEditFormChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Amazing Services
        </h1>
        <p className="text-gray-600">
          Book your next adventure with our curated selection of services
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Services
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Category
            </label>
            <select
              id="category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Showing {filteredServices.length} of {services.length} services
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No services found</div>
          <p className="text-gray-400 mt-2">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
