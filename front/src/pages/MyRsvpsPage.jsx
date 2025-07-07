import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyRsvpsPage({ user }) {
  const navigate = useNavigate();
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyRsvps();
  }, [user]);

  const fetchMyRsvps = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3002/api/v1/rsvps/my-rsvps",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      if (Array.isArray(response.data)) {
        setRsvps(response.data);
      } else if (Array.isArray(response.data.rsvps)) {
        setRsvps(response.data.rsvps);
      } else if (Array.isArray(response.data.data)) {
        setRsvps(response.data.data);
      } else if (Array.isArray(response.data.data?.rsvps)) {
        setRsvps(response.data.data.rsvps);
      } else {
        setRsvps([]);
      }
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      setError("Failed to load your RSVPs");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">Loading your RSVPs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My RSVPs</h1>
        <p className="text-gray-600">Manage your service bookings</p>
      </div>

      {rsvps.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            You haven't made any RSVPs yet
          </div>
          <p className="text-gray-400 mt-2">
            Browse our services to get started
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Browse Services
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {rsvps.map((rsvp) => (
            <div key={rsvp.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {rsvp.service?.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {rsvp.service?.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(rsvp.serviceDate?.date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Price:</span> $
                    {rsvp.serviceDate?.service?.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Duration:</span>{" "}
                    {rsvp.serviceDate?.service?.durationMinutes} minutes
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      rsvp.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : rsvp.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {rsvp.status || "Confirmed"}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() =>
                      navigate(`/services/${rsvp.serviceDate?.service?.id}`)
                    }
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View Service Details →
                  </button>

                  <div className="flex space-x-2">
                    {rsvp.status !== "cancelled" && (
                      <button
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Are you sure you want to cancel this RSVP?"
                            )
                          ) {
                            try {
                              await axios.patch(
                                `http://localhost:3002/api/v1/rsvps/${rsvp.id}`,
                                { status: "cancelled" },
                                {
                                  headers: {
                                    Authorization: `Bearer ${user.token}`,
                                  },
                                }
                              );
                              fetchMyRsvps(); // Refresh the list
                              alert("RSVP cancelled successfully!");
                            } catch (error) {
                              console.error("Error cancelling RSVP:", error);
                              alert("Failed to cancel RSVP");
                            }
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRsvpsPage;
