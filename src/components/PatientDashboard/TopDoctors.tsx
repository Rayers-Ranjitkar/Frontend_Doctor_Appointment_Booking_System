import { useNavigate } from "react-router";
import { doctors } from "@/utils/mockData";
import { Star } from "lucide-react";

const TopDoctors = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2
          className="text-gray-900"
          style={{ fontSize: "1.05rem", fontWeight: 700 }}
        >
          Top Doctors
        </h2>
        <button
          onClick={() => navigate("/patient/search")}
          className="text-blue-600 hover:text-blue-800"
          style={{ fontSize: "0.82rem", fontWeight: 600 }}
        >
          See All
        </button>
      </div>
      <div className="divide-y divide-gray-50">
        {doctors.slice(0, 4).map((doc) => (
          <div
            key={doc.id}
            className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <img
              src={doc.image}
              alt={doc.name}
              className="w-11 h-11 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-gray-900 truncate"
                style={{ fontWeight: 600, fontSize: "0.85rem" }}
              >
                {doc.name}
              </p>
              <p
                className="text-gray-500 truncate"
                style={{ fontSize: "0.75rem" }}
              >
                {doc.specialty}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 mb-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                  {doc.rating}
                </span>
              </div>
              <button
                onClick={() => navigate(`/patient/book/${doc.id}`)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                style={{ fontSize: "0.75rem" }}
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDoctors;

