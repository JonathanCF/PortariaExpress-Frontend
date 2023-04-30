import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { toast } from "react-toastify";

import { api } from "../services/apiClient";

type AuthContextData = {
  user: UserProps;
  name: NameProps
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
};

type UserProps = {
  id: string;
  nome: string;
};

type NameProps = {
  id: string
  name: string
}

type SignInProps = {
  name: string;
  password: string;
};

type SignUpProps = {
  name: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, "@nextauth.token");
    Router.push("/");
    
  } catch (error) {
    console.log("error ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const [name, setName] = useState<NameProps>();
  const isAuthenticated = !!user;

  useEffect(()=> {

    // Tentar pegar algo no cookie
    const { "@nextauth.token": token } = parseCookies()
      if(token){
        api.get('/me').then(response => {
          const {id, name} = response.data

          setName({
            id,
            name,
          })
          console.log(name)
        })
        .catch(()=>{
          // se der erro deslogamos o user.
          signOut()
        })
      }

  },[])

  async function signIn({ name, password }: SignInProps) {
    try {
      const response = await api.post("/session", {
        name,
        password,
      });

      // console.log(response.data)
      const { id, nome, token } = response.data;

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, //Expirar em 1 mes
        path: "/", //Quais caminhos terao acesso ao cookie
      });

      setUser({
        id,
        nome,
      });

      // Passar para proximas requisiçoes o nosso token

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      toast.success("Logado com sucesso!!")

      //Redirecionar o user para /dashboard
      Router.push("/dashboard");
    } catch (error) {
      toast.error("nome/senha incorretos!!")
    }
  }

  async function signUp({ name, password }: SignUpProps) {
    try {
      const response = await api.post("/users", {
        name,
        password,
      });

      Router.push("/");

      toast.success("Usuario cadastrada com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar!!");
      console.log("Erro ao cadastar", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, name,  isAuthenticated, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}
