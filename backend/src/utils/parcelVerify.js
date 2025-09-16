import crypto from "crypto";


const BASE  = process.env.APP_BASE_URL; 



// Result example: https://your-api.com/api/parcels/verify?parcelNo=123&sig=abcd1234...
export function makeVerifyUrl(parcelId) {

    const SECRET = process.env.PARCEL_VERIFY_SECRET;

    if (!SECRET) {
  throw new Error("PARCEL_VERIFY_SECRET environment variable is required");
}
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(String(parcelId))
    .digest("hex"); // you can .slice(0, 32) if you want shorter
  return {
    url: `${BASE}/api/parcels/verify?parcelId=${parcelId}&sig=${sig}`,
    sig
  };
}
