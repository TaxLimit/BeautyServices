import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminPanelPage({ user }) {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    durationMinutes: "",
    price: "",
    category: "HairCare",
    imgURL: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchServices();
  }, [user]);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3002/api/v1/services",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
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

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3002/api/v1/services", newService, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setNewService({
        title: "",
        description: "",
        durationMinutes: "",
        price: "",
        category: "HairCare",
        imgURL: "",
      });
      setShowCreateForm(false);
      fetchServices();
      alert("Service created successfully!");
    } catch (error) {
      console.error("Error creating service:", error);
      alert("Failed to create service");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(
          `http://localhost:3002/api/v1/services/${serviceId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        fetchServices();
        alert("Service deleted successfully!");
      } catch (error) {
        console.error("Error deleting service:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to delete service";
        alert(errorMessage);
      }
    }
  };

  const handleInputChange = (e) => {
    setNewService({
      ...newService,
      [e.target.name]: e.target.value,
    });
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage services and view statistics</p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {showCreateForm ? "Cancel" : "Create New Service"}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Create New Service
          </h2>
          <form onSubmit={handleCreateService} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newService.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={newService.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="HairCare">Hair Care</option>
                  <option value="FacialTreatments">Facial Treatments</option>
                  <option value="Waxing">Waxing</option>
                  <option value="Massages">Massages</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newService.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="durationMinutes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="durationMinutes"
                  name="durationMinutes"
                  value={newService.durationMinutes}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newService.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  value={newService.imgURL}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                Create Service
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Services
          </h2>
        </div>

        <div className="divide-y">
          {services.map((service) => (
            <div key={service.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{service.description}</p>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>Duration: {service.durationMinutes} minutes</span>
                    <span>Price: ${service.price}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {service.category}
                    </span>
                    <span>{service.imgURL}</span>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => navigate(`/services/${service.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No services found. Create your first service to get started.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanelPage;
