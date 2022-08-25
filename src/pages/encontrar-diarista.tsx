import React from 'react';
import { GetStaticProps } from 'next';
import VerificarProfissionais from 'ui/partials/encontrar-diarista/verificar-profissionais';
import Contratacao from 'ui/partials/encontrar-diarista/contratacao';
import useEncontrarDiarista from 'data/hooks/pages/useEncontrarDiarista.page';

//import { Component } from '@styles/pages/encontrar-diarista.styled';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      title: 'Encontrar Diarista',
    },
  };
};

const EncontrarDiarista: React.FC = () => {
  const { podeContratar, setPodeContratar } = useEncontrarDiarista();
  return (
    <div>{!podeContratar ? <VerificarProfissionais onContratacaoProfissional={() => setPodeContratar(true)}/> : <Contratacao />}</div>
  );
};

export default EncontrarDiarista;
