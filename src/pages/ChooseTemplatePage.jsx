import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TEMPLATE_LIST } from "./templates/templateRegistry";

export default function ChooseTemplatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  function handleSelect(templateKey) {
    navigate(`/leads/${id}/edit?template=${templateKey}`);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8">
        Choose a Website Template
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEMPLATE_LIST.map((tpl) => (
          <div
            key={tpl.key}
            className="bg-white rounded-xl shadow-lg border hover:border-teal-500 transition cursor-pointer"
            onClick={() => handleSelect(tpl.key)}
          >
            <img
              src={tpl.preview}
              alt={tpl.name}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">{tpl.name}</h3>
              <button className="mt-3 w-full bg-teal-600 text-white py-2 rounded-lg">
                Use this template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
