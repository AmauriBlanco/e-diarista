import React from "react";
import { GetStaticProps } from "next";
import VerificarProfissionais from "ui/partials/encontrar-diarista/verificar-profissionais";
import Contratacao from "ui/partials/encontrar-diarista/contratacao";

//import { Component } from '@styles/pages/encontrar-diarista.styled';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      title: "Encontrar Diarista",
    },
  };
};

const EncontrarDiarista: React.FC = () => {
  // return (
  //   <VerificarProfissionais/>
    
  // );
  return <Contratacao/>
};

export default EncontrarDiarista;
