import { auth, db } from "../../../lib/firebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  type User 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export interface RegisterUserData {
  nomeCompleto: string;
  emailInstitucional: string;
  senha: string;
  matricula: string;
  perfil: string;
}

export interface LoginUserData {
  email: string;
  senha: string;
}

export const registerUser = async (
  userData: RegisterUserData
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    userData.emailInstitucional,
    userData.senha
  );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    username: userData.nomeCompleto,
    email: userData.emailInstitucional,
    matricula: userData.matricula,
    perfil: userData.perfil,
    createdAt: serverTimestamp(),
  });

  return user;
};

export const loginUser = async (
  userData: LoginUserData
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    userData.email,
    userData.senha
  );
  
  return userCredential.user;
};