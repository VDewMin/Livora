import React, { useEffect, useState } from "react";
import BaseCard from "./Ks_baseCard";
import { Trash2 } from "lucide-react";

const RemovedParcelsCard = ({ count }) => {

  return <BaseCard 
  title="Removed Parcels" 
  count={count} 
  icon={Trash2} 
  color="red" />;
};

export default RemovedParcelsCard;
