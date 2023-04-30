import { Header } from "../../../components/Header";
import Head from "next/head";
import styles from "./styles.module.scss";
import { setupAPIClient } from "../../../services/api";
import { useState } from "react";
import Link from "next/link";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

import { canSSRAuth } from "../../../utils/canSSRAuth";

export default function Empresa({ empresaList }) {
  const [empresa, setEmpresa] = useState(empresaList);
  const [search, setSearch] = useState("");

  async function SearchEmpresa(e) {
    e.preventDefault();

    if (!search) {
      console.log("error");
      return;
    }

    const apiClient = setupAPIClient();

    const response = await apiClient.get("/search_empresa",{
      params:{
        search: search
      } 
    });

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
          <h1>Empresas Cadastradas</h1>
          {/* <div>
            <input
              type="search"
              placeholder="Digite um valor para busca"
              className={styles.input}
              style={{ width: 284 }}
              value={search || ""}
              onChange={(event) => setSearch(event.target.value.toUpperCase())}
            />
            <button className={styles.buttonAdd}>
              Cadastrar
            </button>
          </div> */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    className={styles.tabelaMenu}
                    align="center"
                  ></TableCell>
                  <TableCell className={styles.tabelaMenu} align="center">
                    CNPJ
                  </TableCell>
                  <TableCell className={styles.tabelaMenu} align="center">
                    EMPRESA
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {empresa.map((row) => (
                  <TableRow key={row.id} className={styles.tableLinha}>
                    <TableCell align="center">
                      <Link href={`/empresa/lista_empresa/${row.id}`}>
                        <FiEdit3 size={26} />
                      </Link>

                      <FiTrash2 size={26} />
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      {row.cnpj}
                    </TableCell>

                    <TableCell align="center">{row.empresa}</TableCell>
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
  const apliClient = setupAPIClient(ctx);

  const response = await apliClient.get("/listaempresa");
  console.log(response.data);

  return {
    props: {
      empresaList: response.data,
    },
  };
});
