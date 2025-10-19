import jwt from "jsonwebtoken";

const SECRET = process.env.PARCEL_SECRET || "supersecret"; 


export function makeVerifyUrl(parcelId, locId) {
  const token = jwt.sign(
    { parcelId, locId },
    SECRET,
    { expiresIn: "7d" } // token valid for 7 days
  );
  return { url: `${process.env.BASE_URL}/api/parcels/verify?token=${token}` };
}


export function decodeVerifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
