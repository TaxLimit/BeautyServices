import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ServiceDetailsPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newDate, setNewDate] = useState("");
  const [rsvpLoading, setRsvpLoading] = useState({});

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      const endpoint = user
        ? `/api/v1/services/${id}`
        : `/api/v1/services/public/${id}`;
      const config = user
        ? {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        : {};

      const serviceResponse = await axios.get(
        `http://localhost:3002${endpoint}`,
        config
      );
      if (serviceResponse.data && serviceResponse.data.title) {
        setService(serviceResponse.data);
      } else if (serviceResponse.data && serviceResponse.data.service) {
        setService(serviceResponse.data.service);
      } else if (serviceResponse.data && serviceResponse.data.data) {
        setService(serviceResponse.data.data);
      } else if (serviceResponse.data && serviceResponse.data.data?.service) {
        setService(serviceResponse.data.data.service);
      } else {
        setService(null);
      }

      try {
        const datesEndpoint = user
          ? `/api/v1/services/${id}/dates`
          : `/api/v1/services/public/${id}/dates`;
        const datesConfig = user
          ? {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          : {};

        const datesResponse = await axios.get(
          `http://localhost:3002${datesEndpoint}`,
          datesConfig
        );

        if (Array.isArray(datesResponse.data)) {
          setDates(datesResponse.data);
        } else if (Array.isArray(datesResponse.data.dates)) {
          setDates(datesResponse.data.dates);
        } else if (Array.isArray(datesResponse.data.data)) {
          setDates(datesResponse.data.data);
        } else if (Array.isArray(datesResponse.data.data?.dates)) {
          setDates(datesResponse.data.data.dates);
        } else {
          setDates([]);
        }
      } catch (datesError) {
        console.error("Error fetching dates:", datesError);
        setDates([]);
      }
    } catch (error) {
      console.error("Error fetching service details:", error);
      setError("Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (dateId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setRsvpLoading((prev) => ({ ...prev, [dateId]: true }));

    try {
      await axios.post(
        `http://localhost:3002/api/v1/rsvps/date/${dateId}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const datesResponse = await axios.get(
        `http://localhost:3002/api/v1/services/${id}/dates`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (Array.isArray(datesResponse.data)) {
        setDates(datesResponse.data);
      } else if (Array.isArray(datesResponse.data.dates)) {
        setDates(datesResponse.data.dates);
      } else if (Array.isArray(datesResponse.data.data)) {
        setDates(datesResponse.data.data);
      } else if (Array.isArray(datesResponse.data.data?.dates)) {
        setDates(datesResponse.data.data.dates);
      } else {
        setDates([]);
      }

      alert("RSVP successful!");
    } catch (error) {
      console.error("Error creating RSVP:", error);
      alert("Failed to RSVP. Please try again.");
    } finally {
      setRsvpLoading((prev) => ({ ...prev, [dateId]: false }));
    }
  };

  const handleAddDate = async (e) => {
    e.preventDefault();
    console.log("Add Date clicked", newDate);
    console.log("User object:", user);
    console.log("User role:", user?.role);
    console.log("Service ID:", id);

    if (!newDate) {
      console.log("No date selected, returning early");
      return;
    }

    const today = new Date();
    const selected = new Date(newDate);
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    if (selected < today) {
      console.log("Date is in the past, showing alert");
      alert("Cannot add a date before today.");
      return;
    }

    try {
      console.log("About to send POST request", newDate);
      console.log(
        "Request URL:",
        `http://localhost:3002/api/v1/services/${id}/dates`
      );
      console.log("Request body:", { date: newDate });
      console.log("Request headers:", {
        Authorization: `Bearer ${user.token}`,
      });

      const response = await axios.post(
        `http://localhost:3002/api/v1/services/${id}/dates`,
        { date: newDate },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      console.log("POST request successful:", response.data);

      setNewDate("");
      fetchServiceDetails();
    } catch (error) {
      console.error("POST error:", error);
      console.error("Error response:", error.response);

      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Failed to add date";
      alert(msg);
    }
  };

  const handleDeleteDate = async (dateId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this date? This will also cancel all RSVPs for this date."
      )
    ) {
      try {
        await axios.delete(
          `http://localhost:3002/api/v1/services/${id}/dates/${dateId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        fetchServiceDetails();
        alert("Date deleted successfully!");
      } catch (error) {
        console.error("Error deleting date:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to delete date";
        alert(errorMessage);
      }
    }
  };

  const getUserRole = () => {
    return user?.role || "guest";
  };

  const role = getUserRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">Loading service details...</div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg">
          {error || "Service not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {service.title}
            </h1>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {service.category}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${service.price}
            </div>
            <div className="text-sm text-gray-500">
              {service.durationMinutes} minutes
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          {service.description}
        </p>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Available Dates
          </h2>

          {dates.length === 0 ? (
            <p className="text-gray-500">
              No dates available for this service.
            </p>
          ) : (
            <div className="space-y-3">
              {dates.map((date) => (
                <div
                  key={date.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {new Date(date.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    {date.rsvpCount > 0 && (
                      <div className="text-sm text-gray-500">
                        {date.rsvpCount} RSVP{date.rsvpCount !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {role === "admin" && (
                      <button
                        onClick={() => handleDeleteDate(date.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Delete
                      </button>
                    )}

                    {user && role !== "admin" && (
                      <button
                        onClick={() => handleRSVP(date.id)}
                        disabled={rsvpLoading[date.id]}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                      >
                        {rsvpLoading[date.id] ? "RSVPing..." : "RSVP"}
                      </button>
                    )}

                    {!user && (
                      <button
                        onClick={() => navigate("/login")}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Login to RSVP
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin: Add new date */}
        {role === "admin" && (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Date
            </h3>
            <form onSubmit={handleAddDate} className="flex gap-4">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min={new Date().toISOString().split("T")[0]}
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add Date
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceDetailsPage;
