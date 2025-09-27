import React, { useEffect, useState } from "react";
import BaseCard from "./Ks_baseCard";
import { Clock } from "lucide-react";

const PendingParcelsCard = ({ count }) => {

  return <BaseCard 
  title="Pending Parcels" 
  count={count} 
  icon={Clock} 
  color="orange" />;
};

export default PendingParcelsCard;
