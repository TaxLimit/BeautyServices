import { Link } from "react-router-dom";

function ServiceCard({ service, user, onEdit, onDelete }) {
  const getUserRole = () => {
    return user?.role || "guest";
  };

  const role = getUserRole();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {service.title}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {service.category}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>

        <span>
          <img src={service.imgURL} alt="image" />
        </span>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Duration:</span>
            <span className="ml-2 font-medium">
              {service.durationMinutes} minutes
            </span>
          </div>
          <div>
            <span className="text-gray-500">Price:</span>
            <span className="ml-2 font-medium">${service.price}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link
            to={`/services/${service.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View Details →
          </Link>

          {role === "admin" && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(service)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors duration-150"
                title="Edit Service"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(service.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors duration-150"
                title="Delete Service"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
