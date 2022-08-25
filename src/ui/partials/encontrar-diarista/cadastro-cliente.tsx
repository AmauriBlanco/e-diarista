import { Button, Container, Divider, Typography } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { UserDataForm } from 'ui/components/inputs/UserForm/UserForm';
import { PictureForm } from 'ui/components/inputs/UserForm/forms/PictureForm';
import NewContactForm from 'ui/components/inputs/UserForm/forms/NewContactForm';
import { LoginForm } from 'ui/components/inputs/UserForm/forms/LoginForm';
import { LoginButtonContainer } from './cadastro-cliente.styled';

//import { Component } from './_cadastro-cliente.styled';

const CadastroCliente: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div>
      <Typography sx={{ fontWeight: 'bold', pb: 2 }}>Dados pessoais</Typography>
      <UserDataForm cadastro={true} />
      <Divider sx={{ mb: 5 }} />

      <Typography sx={{ fontWeight: 'bold', pb: 2 }}>
        Hora da self! Envie uma self segurando o documento
      </Typography>
      <PictureForm />
      <Typography sx={{ pb: 5, pt: 1 }} variant={'body2'}>
        Essa foto não será vista por ninguem
      </Typography>
      <Divider sx={{ mb: 5 }} />
      <Typography sx={{ fontWeight: 'bold', pb: 2 }}>
        Dados de acesso
      </Typography>
      <NewContactForm />
      <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="primary"
          type="button"
          onClick={onBack}
        >
          Voltar para detalhes da diária
        </Button>
        <Button variant="contained" color="secondary" type="submit">
          Ir para pagamento
        </Button>
      </Container>
    </div>
  );
};

export const LoginCliente: React.FC<{ onBack: () => void }> = ({onBack}) => {
  return (
    <div>
      <LoginForm />
      <LoginButtonContainer>
        <Button
          variant="outlined"
          color="primary"
          type="button"
          onClick={onBack}
        >
          Voltar para detalhes da diária
        </Button>
        <Button variant="contained" color="secondary" type="submit">
          Ir para pagamento
        </Button>
      </LoginButtonContainer>
    </div>
  );
};

export default CadastroCliente;
