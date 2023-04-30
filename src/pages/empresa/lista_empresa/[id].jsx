import { Header } from "../../../components/Header";
import Head from "next/head";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import { cnpjMask } from "../../../utils/Mascara/cnpjMask";
import { useState } from "react";
import { toast } from "react-toastify";

import { canSSRAuth } from "../../../utils/canSSRAuth";
import { setupAPIClient } from "../../../services/api";

export default function Empresa({ list }) {
  const router = useRouter();
  const { id } = router.query;

  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");

  const [listEmpresa, setListEmpresa] = useState(list);

  async function handleUpdateEmpesa(event, id) {
    event.preventDefault();

    const apiClient = setupAPIClient();

    const response = await apiClient.put(
      `/update/empresa/?id=${listEmpresa.id}`,
      {
        cnpj: cnpj || listEmpresa.cnpj,
        empresa: empresa || listEmpresa.empresa,
      }
    );
    toast.success('Editado com sucesso!');
    console.log(response);
  }

  return (
    <>
      <Head>
        <title>Lista Empresa</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Dados da Empresa</h1>
          <form className={styles.form} onSubmit={handleUpdateEmpesa}>
            <div>
              <input
                type="text"
                placeholder="Digite o CNPJ da empresa"
                value={cnpjMask(cnpj) || listEmpresa.cnpj}
                onChange={(event) => setCnpj(event.target.value)}
                className={styles.input}
                style={{ marginRight: 20, width: 250, textAlign: "center" }}
              />
              <input
                type="text"
                placeholder="Digite o nome da empresa"
                value={empresa || listEmpresa.empresa}
                onChange={(event) =>
                  setEmpresa(event.target.value.toUpperCase())
                }
                className={styles.input}
                style={{ width: 385 }}
              />
            </div>
            <button type="submit" className={styles.buttonAdd}>
              Editar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apliClient = setupAPIClient(ctx);

  const response = await apliClient.get(`/empresa/id?id=${ctx.params.id}`);
  console.log(response.data);

  return {
    props: {
      list: response.data,
    },
  };
});
