import { auth, db } from "../../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const getCurrentUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;


  const userDoc = await getDoc(doc(db, "users", user.uid));
  return userDoc.exists() ? userDoc.data() : null;
};
