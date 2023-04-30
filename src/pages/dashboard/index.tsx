import { canSSRAuth } from "../../utils/canSSRAuth";
import styles from "./styles.module.scss";
import Head from "next/head";
import { Header } from "../../components/Header";
import { useState, useEffect } from "react";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { TbDoorExit } from "react-icons/tb";
import { TbDoorEnter } from "react-icons/tb";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "#1D1D2E",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Dashboard({ entradaList }) {
  const [listaEntrada, setListaEntrada] = useState(entradaList);

  async function loadSaida(id) {
    const today = new Date();
    let hora_saida =
      today.getHours() +
      ":" +
      (today.getMinutes() < 10
        ? "0" + today.getMinutes()
        : today.getMinutes() + "");

    const apiClient = setupAPIClient();
    await apiClient.put(`/update?id=${id}`, {
      status: true,
      hora_saida: hora_saida,
    });

    toast.success("Saída Registrada");
    const response = await apiClient.get("/listarregistros");

    setListaEntrada(response.data);
  }

  async function loadEntrada(id) {
    const today = new Date();
    let hora_entrada =
      today.getHours() +
      ":" +
      (today.getMinutes() < 10
        ? "0" + today.getMinutes()
        : today.getMinutes() + "");

    const apiClient = setupAPIClient();
    await apiClient.put(`/update?id=${id}`, {
      status: true,
      hora_entrada: hora_entrada,
    });

    toast.success("Entrada Registrada");
    const response = await apiClient.get("/listarregistros");

    setListaEntrada(response.data);
  }

  return (
    <>
      <Head>
        <title>Painel Portaria</title>
      </Head>
      <div>
        <Header />
      </div>
      <main>
        <div className={styles.container}>
          <div className={styles.title}>
            <h1>Relátorio de Entrada</h1>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={styles.tabelaMenu}></TableCell>
                  <TableCell className={styles.tabelaMenu}>
                    <p> NOME </p>
                  </TableCell>
                  <TableCell align="center" className={styles.tabelaMenu}>
                    <p> DATA ENTRADA</p>
                  </TableCell>
                  <TableCell align="center" className={styles.tabelaMenu}>
                    <p>HORA ENTRADA</p>
                  </TableCell>
                  <TableCell align="center" className={styles.tabelaMenu}>
                    <p>HORA SAÍDA</p>
                  </TableCell>
                  <TableCell align="center" className={styles.tabelaMenu}>
                    <p>EMPRESA</p>
                  </TableCell>
                  <TableCell align="center" className={styles.tabelaMenu}>
                    <p>VEÍCULO</p>
                  </TableCell>
                  <TableCell align="center" className={styles.tabelaMenu}>
                    <p>PLACA</p>
                  </TableCell>
                  <TableCell align="center" className={styles.tabelaMenu}>
                    <p>OBSERVAÇÃO</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listaEntrada.map((row) => (
                  <TableRow key={row.id} className={styles.tableLinha}>
                    {row.hora_entrada === null ? (
                      <TableCell align="center">
                        <button className={styles.buttonTable}>
                          <TbDoorExit
                            color="black"
                            size={30}
                            onClick={() => {
                              if (window.confirm("Confirma entrada?")) {
                                loadEntrada(row.id);
                              }
                            }}
                          />
                        </button>
                      </TableCell>
                    ) : (
                      <TableCell align="center">
                        <button className={styles.buttonTable}>
                          <TbDoorEnter 
                            color="red"
                            size={30}
                            onClick={() => {
                              if (window.confirm("Confirma saída?")) {
                                loadSaida(row.id);
                              }
                            }}
                          />
                        </button>
                      </TableCell>
                    )}

                    <TableCell component="th" scope="row">
                      {row.cadastros.nome}
                    </TableCell>

                    <TableCell align="center">{row.data_registro}</TableCell>

                    <TableCell align="center">{row.hora_entrada}</TableCell>

                    <TableCell align="center">{row.hora_saida}</TableCell>

                    <TableCell align="center">
                      {row.cadastros.empresa.empresa}
                    </TableCell>

                    <TableCell align="center">
                      {row.cadastros.transporte[0].tipo_tranporte}
                    </TableCell>

                    <TableCell align="center">
                      {row.cadastros.transporte[0].placa}
                    </TableCell>
                    <TableCell align="center">{row.observacao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/listarregistros");

  return {
    props: {
      entradaList: response.data,
    },
  };
});
