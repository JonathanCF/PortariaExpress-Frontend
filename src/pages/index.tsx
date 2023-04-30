import { FormEvent, use, useContext, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import logoImg from "../../public/logo_Portaria-teste.png";
import styles from "../../src/styles/home.module.scss";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/Button";
import { toast } from "react-toastify";

import Link from "next/link";

import { AuthContext } from "../context/AuthContext";

import { canSSRGuest } from "../utils/canSSRGuest";

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (name === "" || password === "") {
      toast.warning("Favor preencha todos os campos!!");
      return;
    }

    setLoading(true);

    let data = {
      name,
      password,
    };

    await signIn(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>PortariaWeb - Faça seu login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Sujeito Pizzaria" />

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
            />
            <Input
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <Button type="submit" loading={loading}>
              Acessar
            </Button>
          </form>
          <Link href="/signup">
            <p className={styles.text}>Não possui uma conta? Cadastre-se</p>
          </Link>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
