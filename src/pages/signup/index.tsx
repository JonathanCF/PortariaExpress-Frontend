import {useState, FormEvent, useContext} from 'react'
import Head from "next/head";
import Image from "next/image";
import logoImg from "../../../public/logo_Portaria-teste.png";
import styles from "../../../src/styles/home.module.scss";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/Button";
import { toast } from 'react-toastify'

import { AuthContext } from '../../context/AuthContext'

import Link from "next/link";

export default function SignUp() {
  const { signUp } = useContext(AuthContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignUp(event: FormEvent){
    event.preventDefault();

    if(name === '' || password === ''){
      toast.error('Preencha todos os campos!!')
      return
    }

    setLoading(true)

    let data = {
      name,
      password
    }

    await signUp(data)

    setLoading(false)

  }

  return (
    <>
      <Head>
        <title>PortariaWeb - Cadastro Usuário</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Sujeito Pizzaria" />
        <div className={styles.login}>
          <h1>Cadastro de Usuário</h1>
          <form onSubmit={handleSignUp}>
            <Input 
            placeholder="Digite nome do usuário"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
            <Input 
            placeholder="Digite a senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" loading={loading}>
              Cadastrar
            </Button>
          </form>
			 <Link href="/">
          	<p className={styles.text}>Voltar para o menu inicial</p>
			 </Link>
        </div>
      </div>
    </>
  );
}
