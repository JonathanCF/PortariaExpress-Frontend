import { useState } from "react";
import { Header } from "../../components/Header";
import Head from "next/head";
import styles from "./styles.module.scss";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import Router from "next/router";

import { cnpjMask } from "../../utils/Mascara/cnpjMask";

import { canSSRAuth } from "../../utils/canSSRAuth";

export default function Empresa() {
  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");

  async function handleRegister(event) {
    event.preventDefault();
    if (empresa === "") {
      toast.warning("Informe a Empresa");
      return;
    }

    const apiClient = setupAPIClient();
    const response = await apiClient
      .post("/empresa", {
        empresa: empresa.toUpperCase(),
        cnpj: cnpj,
      })
      .then((response) => {
        toast.success("Empresa cadastrada!!");
        Router.push("/cadastro");
      })
      .catch((error) => {
        toast.error(error.response.data.err);
        console.log(error);
        return;
      });

    setEmpresa("");
    setCnpj("");
  }

  return (
    <>
      <Head>
        <title>Cadastro Empresa</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Cadastrar Empresa</h1>
          <form className={styles.form} onSubmit={handleRegister}>
            <div>
              <input
                type="text"
                placeholder="Digite o CNPJ da empresa"
                value={cnpjMask(cnpj)}
                onChange={(event) => setCnpj(event.target.value)}
                className={styles.input}
                style={{ marginRight: 20, width: 250, textAlign: "center" }}
              />
              <input
                type="text"
                placeholder="Digite o nome da empresa"
                value={empresa}
                onChange={(event) =>
                  setEmpresa(event.target.value.toUpperCase())
                }
                className={styles.input}
                style={{ width: 385 }}
              />
            </div>
            <button type="submit" className={styles.buttonAdd}>
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
