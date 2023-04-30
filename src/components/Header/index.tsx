import { useContext, useEffect } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { BiDownArrowAlt } from "react-icons/bi";

import { AuthContext } from "../../context/AuthContext";

export function Header() {
  const { name, signOut } = useContext(AuthContext);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard">
          <img
            src="/logo_Portaria-teste.png"
            alt="logo"
            width={190}
            height={60}
          />
        </Link>
        <nav className={styles.menuNav}>
          <div className={styles.dropdown}>
            <p style={{ margin: -8 }}>
              Empresa <BiDownArrowAlt color="white" size={14} />
            </p>
            <div className={styles.dropdownContent}>
              <Link href="/empresa">
                <p>Cadastrar empresa</p>
              </Link>
              <Link href="/empresa/lista_empresa">
                <p>Listar empresa</p>
              </Link>
            </div>
          </div>

          <Link href="/cadastro">
            <p>Cadastro</p>
          </Link>
          <div className={styles.dropdown}>
            <p style={{ margin: -8 }}>
              Registro <BiDownArrowAlt color="white" size={14} />
            </p>
            <div className={styles.dropdownContent}>
              <Link href="/registro_entrada">
                <p>Registro Entrada</p>
              </Link>
              <Link href="/registro_saida">
                <p>Registro Saída</p>
              </Link>
            </div>
          </div>
          <Link href="/relatorio">
            <p>Relatório Entrada/Saída</p>
          </Link>

          <button onClick={signOut}>
            <FiLogOut className={styles.logOut} size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}
