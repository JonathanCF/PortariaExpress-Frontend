import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";

import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import moment from "moment";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Registro() {
  const [data_inicio, setData_inicio] = useState("");
  const [data_fim, setData_fim] = useState("");

  const [response, setResponse] = useState([] || "");

  async function dateValidation() {
    if (data_inicio > data_fim) {
      toast.error("Data inicio maior que data fim");
      return;
    }

    if (data_inicio === "") {
      toast.error("Preencha data inicio");
      return;
    }

    if (data_fim === "") {
      toast.error("Preencha data fim");
      return;
    }
  }

  async function handleFiltroData() {
    dateValidation();
    const apiClient = setupAPIClient();

    try {
      const response = await apiClient.get("/listaentradas", {
        params: {
          data_inicio: moment(data_inicio).format("DD/MM/YYYY"),
          data_fim: moment(data_fim).format("DD/MM/YYYY"),
        },
      });
      if (response.data === null || response.data.length <= 0) {
        toast.error("Não encontrado!!");
        return;
      }

      setResponse(response.data);
    } catch (error) {
      toast.error(error.response.data.err);
      return;
    }
  }

  return (
    <>
      <Head>
        <title>Relatorio Entrada</title>
      </Head>
      <Header />
      <div className={styles.container}>
        <main>
          <div className={styles.title}>
            <h1>Relatório Entrada/Saída</h1>
          </div>

          <div className={styles.labelDates}>
            <label>Data Inicio:</label>
            <input
              type="date"
              className={styles.input}
              style={{ width: 150, textAlign: "center" }}
              value={data_inicio || ""}
              onChange={(event) => setData_inicio(event.target.value)}
            />

            <label>Data Fim:</label>
            <input
              type="date"
              className={styles.input}
              style={{ width: 150, textAlign: "center" }}
              value={data_fim || ""}
              onChange={(event) => setData_fim(event.target.value)}
            />

            <button className={styles.buttonAdd} onClick={handleFiltroData}>
              Buscar
            </button>
          </div>
          {response.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className={styles.tabelaMenu} align="center">
                      Nome
                    </TableCell>
                    <TableCell className={styles.tabelaMenu} align="center">
                      Empresa
                    </TableCell>
                    <TableCell className={styles.tabelaMenu} align="center">
                      Tipo Transporte
                    </TableCell>
                    <TableCell className={styles.tabelaMenu} align="center">
                      Placa
                    </TableCell>
                    <TableCell className={styles.tabelaMenu} align="center">
                      Data Entrada
                    </TableCell>
                    <TableCell className={styles.tabelaMenu} align="center">
                      Tipo
                    </TableCell>
                    <TableCell className={styles.tabelaMenu} align="center">
                      Hora Entrada
                    </TableCell>
                    <TableCell className={styles.tabelaMenu} align="center">
                      Hora Saída
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {response.map((row) => (
                    <TableRow key={row.id} className={styles.tableLinha}>
                      <TableCell component="th" scope="row">
                        {row.cadastros.nome}
                      </TableCell>
                      <TableCell align="center">
                        {row.cadastros.empresa.empresa}
                      </TableCell>
                      <TableCell align="center">
                        {row.cadastros.transporte[0].tipo_tranporte}
                      </TableCell>
                      <TableCell align="center">
                        {row.cadastros.transporte[0].placa}
                      </TableCell>
                      <TableCell align="center">{row.data_registro}</TableCell>
                      {row.hora_entrada < row.hora_saida ? 
                      <TableCell align="center">ENTRADA</TableCell>
                      :
                      <TableCell align="center">SAÍDA</TableCell>
                    }
                      <TableCell align="center">{row.hora_entrada}</TableCell>
                      <TableCell align="center">{row.hora_saida}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p></p>
          )}
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  return {
    props: {},
  };
});
