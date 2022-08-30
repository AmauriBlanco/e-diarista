import React from 'react';
import { GetStaticProps } from 'next';
import MinhasDiarias from 'ui/partials/diarias/minhas-diarias';
import { DiariaProvider } from 'data/contexts/DiariaContext';
import { useRouter } from 'next/router';
import DetalheDiaria from 'ui/partials/diarias/detalhe-diaria';

//import { Component } from '@styles/pages/diarias.styled';

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            title: 'Diárias',
        },
    };
};

const Diarias: React.FC = () => {
  const router = useRouter()
  if(router.query.id) {
    return (
      <DiariaProvider>
        <DetalheDiaria id={router.query.id as string}/>
      </DiariaProvider>
    );
  }
    return (
      <DiariaProvider>
        <MinhasDiarias></MinhasDiarias>
      </DiariaProvider>
    );
};

export default Diarias;