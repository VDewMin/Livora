import React, { useEffect, useState } from "react";
import BaseCard from "./Ks_baseCard";
import { Package } from "lucide-react";

const TotalParcelsCard = ({ count }) => {

  return <BaseCard 
  title="Total Parcels" 
  count={count} 
  icon={Package} 
  color="blue" />;
};

export default TotalParcelsCard;
