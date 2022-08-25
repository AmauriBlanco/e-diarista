import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import useContratacao from 'data/hooks/pages/useContratacao.page';
import useIsMobile from 'data/hooks/useIsMobile';
import { BrowserService } from 'data/services/BrowserService';
import { TextFormatService } from 'data/services/TextFormatService';
import React, { PropsWithChildren, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import DataList from 'ui/components/data-display/DataList/DataList';
import PageTitle from 'ui/components/data-display/PageTitle/PageTitle';
import SideInformation from 'ui/components/data-display/SideInformation/SideInformation';
import SafeEnvironment from 'ui/components/feedback/SafeEnvironment/SafeEnvironment';
import {
  PageFormContainer,
  UserFormContainer,
} from 'ui/components/inputs/UserForm/UserForm';
import BreadCrumb from 'ui/components/navigation/BreadCrumb/BreadCrumb';
import Link from 'ui/components/navigation/Link/Link';
import CadastroCliente, { LoginCliente } from './cadastro-cliente';
import DetalheServico from './detalhe-servico';
import InformacoesPagamento from './informacoes-pagamento';

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
    setStep,
    loginForm,
    onLoginFormSubmit,
    loginError,
    onPaymenteFormSubmit,
    paymentForm,
    tamanhoCasa,
    tipoLimpeza,
    totalPrice,
    podemosAtender,
  } = useContratacao();
  const isMobile = useIsMobile(),
    dataAtendimento = serviceForm.watch('faxina.data_atendimento');

  useEffect(() => {
    BrowserService.scrollToTop();
  }, [step]);

  if (!servicos || servicos.length < 1) {
    return (
      <Container sx={{ textAlign: 'center', my: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <div>
      {!isMobile && <SafeEnvironment />}
      <BreadCrumb
        items={breadcrumbItems}
        selected={breadcrumbItems[step - 1]}
      />

      {isMobile && [2, 3].includes(step) && (
        <DataList
          header={
            <Typography color={'primary'} sx={{ fontWeight: 'thin' }}>
              O valor toal do serviço é:{' '}
              {TextFormatService.currency(totalPrice)}
            </Typography>
          }
          body={
            <>
              {tipoLimpeza?.nome}
              <br />
              Tamanho: {tamanhoCasa.join(',')}
              <br />
              Data: {dataAtendimento}
            </>
          }
        />
      )}

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

      {step === 3 && (
        <PageTitle
          title="Informa os dados do cartão para pagamento"
          subtitle={
            'Será feita uma reserva, mas o valor só será descontado quando você confirmar a presença do/da diarista'
          }
        />
      )}
      <UserFormContainer>
        <PageFormContainer fullWidth={step === 4}>
          <Paper sx={{ p: 4 }}>
            {/* Step 1 */}
            <FormProvider {...serviceForm}>
              <form
                onSubmit={serviceForm.handleSubmit(onServiceFormSubmit)}
                hidden={step !== 1}
              >
                <DetalheServico
                  servicos={servicos}
                  podemosAtender={podemosAtender}
                  comodos={tamanhoCasa.length}
                />
              </form>
            </FormProvider>

            {/* Step 2 */}
            <FormProvider {...clientForm}>
              <form
                onSubmit={clientForm.handleSubmit(onClientFormSubmit)}
                hidden={step !== 2 || hasLogin}
              >
                <CadastroCliente onBack={() => setStep(1)} />
              </form>
            </FormProvider>

            {step == 2 && hasLogin && (
              <FormProvider {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginFormSubmit)}>
                  {loginError && (
                    <Typography color={'error'} align={'center'} sx={{ mb: 2 }}>
                      {loginError}
                    </Typography>
                  )}

                  <LoginCliente onBack={() => setStep(1)} />
                </form>
              </FormProvider>
            )}

            {/* step 3 */}
            {step == 3 && (
              <FormProvider {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(onPaymenteFormSubmit)}>
                  <InformacoesPagamento />
                </form>
              </FormProvider>
            )}

            {step === 4 && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '82px' }} color={'secondary'}>
                  <i className="twf-check-circle" />
                </Typography>
                <Typography
                  sx={{ fontSize: '22px', pb: 3 }}
                  color={'secondary'}
                >
                  Pagamento realizado com sucesso!
                </Typography>
                <Typography
                  sx={{ mb: 3, maxWidth: '410px', mx: 'auto' }}
                  color={'textSecondary'}
                >
                  Sua diária foi paga com sucesso! Já estamos procurando o(a)
                  melhor profissional para atender sua residência. Caso
                  nenhum(a) profissional seja encontrado(a), devolvemos seu
                  dinheiro automaticamente 24 horas antes da data agendada. Você
                  também pode cancelar a sua diária sem nenhuma multa até 24
                  horas antes da hora do agendamento.
                </Typography>
                <Link
                  href="/diarias"
                  Component={Button}
                  mui={{ color: 'secondary', variant: 'contained' }}
                >
                  Ir para minhas diárias
                </Link>
              </Box>
            )}
          </Paper>
          {!isMobile && step !== 4 && (
            <SideInformation
              title="Detalhes"
              items={[
                {
                  title: 'Tipo',
                  descricao: [tipoLimpeza?.nome],
                  icon: 'twf-check-circle',
                },
                {
                  title: 'Tamanho',
                  descricao: tamanhoCasa,
                  icon: 'twf-check-circle',
                },
                {
                  title: 'Data',
                  descricao: [dataAtendimento as string],
                  icon: 'twf-check-circle',
                },
              ]}
              footer={{
                text: TextFormatService.currency(totalPrice),
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
