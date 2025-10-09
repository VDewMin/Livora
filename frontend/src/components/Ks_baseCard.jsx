import React from "react";

const BaseCard = ({ title, count, icon: Icon, color }) => {
  const cardColorClasses = {
    blue: "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-200",
    green: "bg-gradient-to-br from-green-100 to-green-200 border-green-200", 
    orange: "bg-gradient-to-br from-orange-100 to-orange-200 border-orange-200",
    red: "bg-gradient-to-br from-red-100 to-red-200 border-red-200"
  };

  const iconColorClasses = {
    blue: "bg-blue-500 text-blue-50",
    green: "bg-green-500 text-green-50", 
    orange: "bg-orange-500 text-orange-50",
    red: "bg-red-500 text-red-50"
  };

  const textColorClasses = {
    blue: "text-blue-800",
    green: "text-green-800", 
    orange: "text-orange-800",
    red: "text-red-800"
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl p-6 shadow-sm border ${cardColorClasses[color]} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
          <p className={`text-3xl font-bold tracking-tight ${textColorClasses[color]}`}>{count}</p>
        </div>
        
        <div className={`flex-shrink-0 p-3 rounded-xl ${iconColorClasses[color]} shadow-md`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default BaseCard;