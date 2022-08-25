import { useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CadastroClientFormDataInterface,
  CredenciaisInterface,
  LoginFormDataInterface,
  NovaDiariaFormDataInterface,
  PagamentoFormDataInterface,
} from 'data/@Types/FormInterface';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormSchemaService } from 'data/services/FormSchemaService';
import { ServicoInterface } from 'data/@Types/ServicoInterface';
import { DiariaInterface } from 'data/@Types/DiariaInterface';
import { ValidationService } from 'data/services/ValidationService';
import { DateService } from 'data/services/DateService';
import { houseParts } from 'ui/partials/encontrar-diarista/detalhe-servico';
import { ExternalServiceContext } from 'data/contexts/ExternalServiceContext';
import {
  ApiService,
  ApiServiceHeteoas,
  linksResolver,
} from 'data/services/ApiService';
import { link } from 'fs';
import useApiHeteoas from '../useApi.hook';
import { UserContext } from 'data/contexts/UserContext';
import { UserInterface, UserType } from 'data/@Types/UserInterface';
import { TextFormatService } from 'data/services/TextFormatService';
import { LoginService } from 'data/services/LoginService';
import { UserService } from 'data/services/UserService';
import { ApiLinksInterface } from 'data/@Types/ApiLinksInterface';
import { CardInterface } from 'pagarme';
import { PaymentService } from 'data/services/PaymentService';

export default function useContratacao() {
  const [step, setStep] = useState(1),
    [hasLogin, setHasLogin] = useState(false),
    [loginError, setLoginErro] = useState(''),
    breadcrumbItems = ['Detalhes da diária', 'Identificação', 'Pagamento'],
    serviceForm = useForm<NovaDiariaFormDataInterface>({
      resolver: yupResolver(
        FormSchemaService.address().concat(FormSchemaService.detalheServico())
      ),
    }),
    clientForm = useForm<CadastroClientFormDataInterface>({
      resolver: yupResolver(
        FormSchemaService.userData().concat(FormSchemaService.newContact())
      ),
    }),
    loginForm = useForm<LoginFormDataInterface<CredenciaisInterface>>({
      resolver: yupResolver(FormSchemaService.login()),
    }),
    paymentForm = useForm<PagamentoFormDataInterface>({
      resolver: yupResolver(FormSchemaService.payment()),
    }),
    { externalServiceState } = useContext(ExternalServiceContext),
    servicos = useApiHeteoas<ServicoInterface[]>(
      externalServiceState.externalService,
      'listar_servicos'
    ).data,
    dadosFaxina = serviceForm.watch('faxina'),
    tipoLimpeza = useMemo<ServicoInterface>(() => {
      if (servicos && dadosFaxina?.servico) {
        const selectedServico = servicos.find(
          (servico) => servico.id === dadosFaxina.servico
        );
        if (selectedServico) {
          return selectedServico;
        }
      }
      return {} as ServicoInterface;
    }, [servicos, dadosFaxina?.servico]),
    { totalTime, tamanhoCasa, totalPrice } = useMemo(() => {
      return {
        totalTime: calcularTempoServico(dadosFaxina, tipoLimpeza),
        tamanhoCasa: listarComodos(dadosFaxina),
        totalPrice: calcularPreco(dadosFaxina, tipoLimpeza),
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      tipoLimpeza,
      dadosFaxina,
      dadosFaxina?.quantidade_cozinhas,
      dadosFaxina?.quantidade_banheiros,
      dadosFaxina?.quantidade_outros,
      dadosFaxina?.quantidade_quartos,
      dadosFaxina?.quantidade_quintais,
      dadosFaxina?.quantidade_salas,
    ]),
    cepFaxina = serviceForm.watch('endereco.cep'),
    [podemosAtender, setPodemosAtender] = useState(false),
    { userState, userDispatch } = useContext(UserContext),
    [novaDiaria, setNovaDiaria] = useState({} as DiariaInterface);

  useEffect(() => {
    const cep = (cepFaxina ?? '').replace(/\D/g, '');
    if (ValidationService.cep(cepFaxina ?? '')) {
      ApiServiceHeteoas(
        externalServiceState.externalService,
        'verificar_disponibilidade_atendimento',
        (request) => {
          request<{ disponibilidade: boolean }>({ params: { cep } })
            .then(({ data }) => {
              setPodemosAtender(data.disponibilidade);
            })
            .catch((_err) => {
              setPodemosAtender(false);
            });
        }
      );
    } else {
      setPodemosAtender(false);
    }
  }, [cepFaxina, externalServiceState.externalService]);

  useEffect(() => {
    if (
      dadosFaxina &&
      ValidationService.hora(dadosFaxina.hora_inicio) &&
      totalTime >= 0
    ) {
      serviceForm.setValue('faxina.hora_inicio', dadosFaxina?.hora_inicio, {
        shouldValidate: true,
      });
      serviceForm.setValue(
        'faxina.data_atendimento',
        dadosFaxina?.data_atendimento,
        {
          shouldValidate: true,
        }
      );
      serviceForm.setValue(
        'faxina.hora_termino',
        DateService.addHours(dadosFaxina?.hora_inicio as string, totalTime),
        {
          shouldValidate: true,
        }
      );
    } else {
      serviceForm.setValue('faxina.hora_termino', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    totalTime,
    dadosFaxina?.hora_inicio,
    dadosFaxina?.data_atendimento,
    dadosFaxina?.hora_termino,
  ]);

  function onServiceFormSubmit(data: NovaDiariaFormDataInterface) {
    if (userState.user.nome_completo) {
      criarDiaria(userState.user);
    } else {
      setStep(2);
    }
  }

  async function onClientFormSubmit(data: CadastroClientFormDataInterface) {
    console.log(data);
    const newUserLink = linksResolver(
      externalServiceState.externalService,
      'cadastrar_usuario'
    );
    if (newUserLink) {
      try {
        await cadastrarUsuario(data, newUserLink);
      } catch (error) {
        UserService.HandleNewUserError(error, clientForm);
      }
    }
  }

  async function cadastrarUsuario(
    data: CadastroClientFormDataInterface,
    link: ApiLinksInterface
  ) {
    const newUser = await UserService.cadastrar(
      data.usuario,
      UserType.Cliente,
      link
    );
    if (newUser) {
      const loginSuccess = await login(
        { email: data.usuario.email, password: data.usuario.password ?? '' },
        newUser
      );
      if (loginSuccess) {
        criarDiaria(newUser);
      }
    }
  }

  async function onLoginFormSubmit(
    data: LoginFormDataInterface<CredenciaisInterface>
  ) {
    const loginSuccess = await login(data.login);
    if (loginSuccess) {
      const user = await LoginService.getUser();
      if (user) {
        criarDiaria(user);
        setStep(3);
      }
    }
  }

  async function login(
    credentials: CredenciaisInterface,
    user?: UserInterface
  ): Promise<boolean> {
    const loginSuccess = await LoginService.login(credentials);

    if (loginSuccess) {
      if (!user) {
        user = await LoginService.getUser();
      }
      userDispatch({ type: 'SET_USER', payload: user });
    } else {
      setLoginErro('E-mail e/ou Senha inválidos');
    }
    return loginSuccess;
  }

  async function onPaymenteFormSubmit(data: PagamentoFormDataInterface) {
    const cartao = {
      card_number: data.pagamento.numero_cartao.replaceAll('', ''),
      card_holder_name: data.pagamento.nome_cartao,
      card_cvv: data.pagamento.codigo,
      card_expiration_date: data.pagamento.validade,
    } as CardInterface;

    const hash = await PaymentService.getHash(cartao);
    console.log('qualquer inicio');
   ApiServiceHeteoas(novaDiaria.links, 'pagar_diaria', async (request) => {
     try {
       await request({
         data: {
           card_hash: hash,
         },
       });
       setStep(4);
     } catch (error) {
       paymentForm.setError('pagamento_recusado', {
         type: 'manual',
         message: 'Pagamento recusado',
       });
     }
   });
    console.log('qualquer fim');
  }

  function calcularTempoServico(
    dadosFaxina: DiariaInterface,
    tipoLimpeza: ServicoInterface
  ): number {
    let total = 0;
    if (dadosFaxina && tipoLimpeza) {
      total += tipoLimpeza.horas_banheiro * dadosFaxina.quantidade_banheiros;
      total += tipoLimpeza.horas_cozinha * dadosFaxina.quantidade_cozinhas;
      total += tipoLimpeza.horas_outros * dadosFaxina.quantidade_outros;
      total += tipoLimpeza.horas_quarto * dadosFaxina.quantidade_quartos;
      total += tipoLimpeza.horas_quintal * dadosFaxina.quantidade_quintais;
      total += tipoLimpeza.horas_sala * dadosFaxina.quantidade_salas;
    }
    return total;
  }

  function calcularPreco(
    dadosFaxina: DiariaInterface,
    tipoLimpeza: ServicoInterface
  ): number {
    let total = 0;
    if (dadosFaxina && tipoLimpeza) {
      total += tipoLimpeza.valor_banheiro * dadosFaxina.quantidade_banheiros;
      total += tipoLimpeza.valor_cozinha * dadosFaxina.quantidade_cozinhas;
      total += tipoLimpeza.valor_outros * dadosFaxina.quantidade_outros;
      total += tipoLimpeza.valor_quarto * dadosFaxina.quantidade_quartos;
      total += tipoLimpeza.valor_quintal * dadosFaxina.quantidade_quintais;
      total += tipoLimpeza.valor_sala * dadosFaxina.quantidade_salas;
    }
    return Math.max(total, tipoLimpeza.valor_minimo);
  }

  function listarComodos(dadosFaxina: DiariaInterface): string[] {
    const comodos: string[] = [];
    if (dadosFaxina) {
      houseParts.forEach((housePart) => {
        const total = dadosFaxina[
          housePart.name as keyof DiariaInterface
        ] as number;
        if (total > 0) {
          const nome = total > 1 ? housePart.plural : housePart.singular;
          comodos.push(`${total} ${nome}`);
        }
      });
    }
    return comodos;
  }

  async function criarDiaria(user: UserInterface) {
    if (user.nome_completo) {
      const { endereco, faxina } = serviceForm.getValues();
      ApiServiceHeteoas(user.links, 'cadastrar_diaria', async (request) => {
        const { data: novaDiaria } = await request<DiariaInterface>({
          data: {
            ...faxina,
            ...endereco,
            cep: TextFormatService.getNumbersFromText(endereco.cep),
            preco: totalPrice,
            tempo_atendimento: totalTime,
            data_atendimento:
              TextFormatService.reverseDate(faxina.data_atendimento as string) +
              'T' +
              faxina.hora_inicio,
          },
        });
        if (novaDiaria) {
          setStep(3);
          setNovaDiaria(novaDiaria);
        }
      });
    }
  }

  return {
    step,
    breadcrumbItems,
    serviceForm,
    onServiceFormSubmit,
    servicos,
    hasLogin,
    setHasLogin,
    clientForm,
    onClientFormSubmit,
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
  };
}
