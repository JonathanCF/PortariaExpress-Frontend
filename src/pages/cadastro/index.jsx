import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";

import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { useState } from "react";
import { toast } from "react-toastify";
import Router from "next/router";
import { cpfMask } from "../../utils/Mascara/cpfMask"

import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  backgroundColor: "#1D1D2E",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Cadastro({ empresaList }) {
  const [name, setName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cpf, setCPF] = useState("");
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");

  const [tipo_transp, settipo_transp] = useState("");
  const [empresa, setEmpresa] = useState(empresaList || []);
  const [empresaSelected, setEmpresaSelected] = useState("");

  const [open, setOpen] = React.useState(false);
  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  // Quando você seleciona uma nova categoria na lista
  function handleChangeEmpresa(event) {
    setEmpresaSelected(event.target.value);
  }

  function handleChangeTipoTransporte(event) {
    settipo_transp(event.target.value);
  }

  async function handleRegister(event) {
    event.preventDefault();

    if (name === "" || cpf === "") {
      toast.warning("Preecha os campos Cadastro Pessoa");
      return;
    }

    if (empresaSelected === "") {
      toast.warning("Informe a empresa");
      return;
    }

    const apiClient = setupAPIClient();

    const response = apiClient
      .post("/cadastro", {
        nome: name,
        matricula: matricula,
        cpf: cpf,
        placa: placa,
        tipo_transporte: tipo_transp,
        modelo: modelo,
        empresa_id: empresa[empresaSelected].id,
      })
      .then((response) => {
        toast.success("Cadastro realizado");
        Router.push("/registro");
      })
      .catch((error) => {
        toast.error(error.response.data.err);
        console.log(error);
      });

    setName("");
    setMatricula("");
    setCPF("");
    setPlaca("");
    setModelo("");
    settipo_transp("");
    setEmpresaSelected("");
  }

  return (
    <>
      <Head>
        <title>Cadastro Pessoa</title>
      </Head>
      <Header />
   
      <div className={styles.container}>
        <main>
          <h1 style={{ marginBottom: 15 }}>Cadastro Pessoa</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <select value={empresaSelected} onChange={handleChangeEmpresa}>
              <option label="Informe a empresa"></option>
              {empresa.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.empresa}
                  </option>
                );
              })}
            </select>

            <input
              type="text"
              placeholder="Digite o nome*"
              className={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value.toUpperCase())}
            />
            <div>
              <input
                type="text"
                placeholder="Digite a matrícula "
                className={styles.input}
                
                value={matricula}
                onChange={(event) => setMatricula(event.target.value)}
              />

              <input
                type="text"
                placeholder="Digite o CPF* "
                className={styles.input}
                style={{ marginLeft: 6 }}
                value={cpfMask(cpf)}
                onChange={(event) => setCPF(event.target.value)}
              />

              <button
                className={styles.buttonAddTranporte}
                style={{ marginLeft: 20, width: 200 }}
                onClick={handleOpen}
              >
                Cadastrar Veículo
              </button>
            </div>

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style} className={styles.form}>
                <h1 style={{ marginBottom: 15, color: "white" }}>
                  Cadastro Transporte
                </h1>

                <select
                  value={tipo_transp}
                  onChange={handleChangeTipoTransporte}
                >
                  <option>Tipo de transporte</option>
                  <option>sem veículo</option>
                  <option>App</option>
                  <option>Carro Próprio</option>
                  <option>Carro Prolam</option>
                  <option>Moto</option>
                  <option>Van</option>
                  <option>Caminhão</option>
                </select>
                <div>
                  <input
                    type="text"
                    maxLength={7}
                    placeholder="Digite a placa "
                    className={styles.input}
                    value={placa}
                    onChange={(event) =>
                      setPlaca(event.target.value.toUpperCase())
                    }
                  />

                  <input
                    type="text"
                    placeholder="Digite o modelo veículo "
                    className={styles.input}
                    style={{ width: 435 }}
                    value={modelo}
                    onChange={(event) =>
                      setModelo(event.target.value.toUpperCase())
                    }
                  />
                </div>
                <button className={styles.buttonAdd} onClick={handleClose}>
                  Cadastrar
                </button>
              </Box>
            </Modal>

            <p>* Obrigatório</p>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/listaempresa");
  console.log(response.data);

  return {
    props: {
      empresaList: response.data,
    },
  };
});
