import React, { useEffect, useState } from "react";
import BaseCard from "./Ks_baseCard";
import { CheckCircle } from "lucide-react";

const CollectedParcelsCard = ({ count }) => {
  
  return <BaseCard 
  title="Collected Parcels" 
  count={count} 
  icon={CheckCircle} 
  color="green" />;
};

export default CollectedParcelsCard;
