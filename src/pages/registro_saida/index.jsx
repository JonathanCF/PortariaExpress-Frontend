import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";

import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { useState } from "react";
import { toast } from "react-toastify";
import Router from "next/router";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { FiUser } from "react-icons/fi";

export default function Registro({ empresaList }) {
  let today = new Date();

  let date = today.toLocaleDateString();
  let hora_saida =
    today.getHours() +
    ":" +
    (today.getMinutes() < 10
      ? "0" + today.getMinutes()
      : today.getMinutes() + "");

  const [response, setResponse] = useState({});
  const [responseID, setResponseID] = useState({});
  const [transporteID, setTransporteID] = useState([]);
  const [empresaID, setEmpresaID] = useState([] || "");

  const [search, setSearch] = useState([] || "");

  const [buscaName, setBuscaName] = useState("");

  const [empresa, setEmpresa] = useState(empresaList);

  const [observacao, setObservacao] = useState("");

  async function handleRegister(event) {
    event.preventDefault();

    const apiClient = setupAPIClient();
    const response = apiClient
      .post("/registro", {
        cadastro_id: responseID.id,
        data_registro: date,
        hora_saida: hora_saida,
        observacao: observacao
      })
      .then((response) => {
        Router.push("/dashboard");
        toast.success("Registrado!!");
        console.log(response)
      })
      .catch((error) => {
        toast.error(error.response.data.err);
        console.log(error);
      });

    setBuscaName("");
    setResponseID("");
    setTransporteID("");
    setEmpresaID("");
    setResponse("");
  }

  async function handleBuscarName(event) {
    event.preventDefault();

    if (buscaName === "") {
      toast.warning("Informe um valor para busca");
      return;
    }

    const apiClient = setupAPIClient();

    try {
      const response = await apiClient.get("/search", {
        params: {
          search: buscaName,
        },
      });
      if (response.data === null || response.data.length <= 0) {
        toast.error("Não encontrado!!");
        return;
      }

      setSearch(response.data);
      setResponse(response.data[0]);
      setEmpresa(response.data[0].empresa);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleBuscaID(id) {
    const apiClient = setupAPIClient();

    try {
      const responseID = await apiClient.get("/listaid", {
        params: {
          id: id,
        },
      });

      console.log(responseID.data);
      setTransporteID(responseID.data.transporte[0]);
      setEmpresaID(responseID.data.empresa);
      setResponseID(responseID.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Registrar Saída</title>
      </Head>
      <Header />
      <div className={styles.container}>
        <main>
          <div>
            <input
              type="search"
              placeholder="Digite um valor para busca"
              className={styles.input}
              style={{ width: 284 }}
              value={buscaName || ""}
              onChange={(event) =>
                setBuscaName(event.target.value.toUpperCase())
              }
            />
            <button className={styles.buttonBuscar} onClick={handleBuscarName}>
              Buscar
            </button>
          </div>

          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.title}>
              <h1>Registrar Saída</h1>

              <input
                type="text"
                hidden
                placeholder="hora entrada:"
                className={styles.input}
                defaultValue={hora_saida || ""}
                style={{ width: 120, textAlign: "center" }}
              />

              <input
                type="text"
                placeholder="data:"
                className={styles.input}
                defaultValue={date || ""}
                style={{ width: 120, textAlign: "center" }}
              />
            </div>
            <input
              type="text"
              placeholder="Nome:"
              className={styles.input}
              disabled
              value={responseID.nome || ""}
              onChange={(event) => setName(event.target.value)}
            />
            <div>
              <input
                type="text"
                placeholder="Digite a matricula* "
                className={styles.input}
                value={responseID.matricula || ""}
                disabled
                onChange={(event) => setMatricula(event.target.value)}
              />

              <input
                type="text"
                placeholder="Digite o CPF "
                className={styles.input}
                style={{ marginLeft: 8 }}
                disabled
                value={responseID.cpf || ""}
                onChange={(event) => setCPF(event.target.value)}
              />

              <input
                type="text"
                placeholder="Digite a placa "
                className={styles.input}
                style={{ marginLeft: 8 }}
                disabled
                value={transporteID.placa || ""}
                onChange={(event) => setTransporteID(event.target.value)}
              />
            </div>
            <input
              type="text"
              placeholder="Empresa:"
              className={styles.input}
              disabled
              value={empresaID.empresa || ""}
              onChange={(event) => setEmpresaID(event.target.value)}
            />

            <input
              type="text"
              placeholder="Tipo transporte:"
              className={styles.input}
              disabled
              value={transporteID.tipo_tranporte || ""}
              onChange={(event) =>
                settipo_transp(event.target.value.toUpperCase())
              }
            />

            <textarea
              className={styles.input}
              placeholder="Observação:"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Registrar
            </button>
          </form>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={styles.tabelaMenu}></TableCell>
                  <TableCell className={styles.tabelaMenu}>Nome</TableCell>
                  <TableCell className={styles.tabelaMenu} align="center">
                    Empresa
                  </TableCell>
                  <TableCell className={styles.tabelaMenu} align="center">
                    Tipo Transporte
                  </TableCell>
                  <TableCell className={styles.tabelaMenu} align="center">
                    Placa
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {search.map((row) => (
                  <TableRow key={row.id} className={styles.tableLinha}>
                    <TableCell align="center">
                      <button
                        onClick={() => handleBuscaID(row.id)}
                        className={styles.buttonTable}
                      >
                        <FiUser color="black" size={24} />
                      </button>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.nome}
                    </TableCell>

                    <TableCell align="center">{row.empresa.empresa}</TableCell>

                    <TableCell align="center">
                      {row.transporte[0].tipo_tranporte}
                    </TableCell>

                    <TableCell align="center">
                      {row.transporte[0].placa}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/listacadastro");

  return {
    props: {
      empresaList: response.data,
    },
  };
});
