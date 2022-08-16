import { Button, Paper } from '@mui/material';
import useContratacao from 'data/hooks/pages/useContratacao.page';
import useIsMobile from 'data/hooks/useIsMobile';
import React, { PropsWithChildren } from 'react';
import { FormProvider } from 'react-hook-form';
import PageTitle from 'ui/components/data-display/PageTitle/PageTitle';
import SideInformation from 'ui/components/data-display/SideInformation/SideInformation';
import SafeEnvironment from 'ui/components/feedback/SafeEnvironment/SafeEnvironment';
import {
  PageFormContainer,
  UserFormContainer,
} from 'ui/components/inputs/UserForm/UserForm';
import BreadCrumb from 'ui/components/navigation/BreadCrumb/BreadCrumb';
import CadastroCliente from './cadastro-cliente';
import DetalheServico from './detalhe-servico';

//import { Component } from './_contratacao.styled';

const Contratacao: React.FC<PropsWithChildren> = () => {
  const {
    step,
    breadcrumbItems,
    serviceForm,
    onServiceFormSubmit,
    servicos,
    hasLogin,
    setHasLogin,
    onClientFormSubmit,
    clientForm,
    setStep
  } = useContratacao();
  const isMobile = useIsMobile();
  return (
    <div>
      {!isMobile && <SafeEnvironment />}
      <BreadCrumb
        items={breadcrumbItems}
        selected={breadcrumbItems[step - 1]}
      />
      {step === 1 && <PageTitle title="Nos conte um pouco sobre o serviço!" />}
      {step === 2 && (
        <PageTitle
          title="Precisamos conhecer um pouco sobre você!"
          subtitle={
            !hasLogin ? (
              <span>
                Caso ja tenha cadastro,{' '}
                <Button onClick={() => setHasLogin(true)}>Clique aqui</Button>
              </span>
            ) : (
              <span>
                Caso não tenha cadastro,{' '}
                <Button onClick={() => setHasLogin(false)}>Clique aqui</Button>
              </span>
            )
          }
        />
      )}
      <UserFormContainer>
        <PageFormContainer>
          <Paper>
            {/* Step 1 */}
            <FormProvider {...serviceForm}>
              <form
                onSubmit={serviceForm.handleSubmit(onServiceFormSubmit)}
                hidden={step !== 1}
              >
                <DetalheServico servicos={servicos} />
              </form>
            </FormProvider>

            {/* Step 2 */}
            <FormProvider {...clientForm}>
              <form
                onSubmit={clientForm.handleSubmit(onClientFormSubmit)}
                hidden={step !== 2 || hasLogin}
              >
                <CadastroCliente onBack={()=> setStep(1)}/>
              </form>
            </FormProvider>
          </Paper>
          {!isMobile && step !== 4 && (
            <SideInformation
              title="Detalhes"
              items={[
                {
                  title: 'Tipo',
                  descricao: [''],
                  icon: 'twf-check-circle',
                },
                {
                  title: 'Tamanho',
                  descricao: [''],
                  icon: 'twf-check-circle',
                },
                {
                  title: 'Data',
                  descricao: [''],
                  icon: 'twf-check-circle',
                },
              ]}
              footer={{
                text: 'R$80,00',
                icon: 'twf-credit-card',
              }}
            />
          )}
        </PageFormContainer>
      </UserFormContainer>
    </div>
  );
};

export default Contratacao;
