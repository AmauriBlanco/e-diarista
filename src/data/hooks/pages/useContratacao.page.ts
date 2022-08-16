import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CadastroClientFormDataInterface, NovaDiariaFormDataInterface } from 'data/@Types/FormInterface';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormSchemaService } from 'data/services/FormSchemaService';
import { ServicoInterface } from 'data/@Types/ServicoInterface';
import { number } from 'yup';

export default function useContratacao() {
  const [step, setStep] = useState(2),
    [hasLogin, setHasLogin] = useState(false),
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
    servicos: ServicoInterface[] = [
      {
        id: 0,
        nome: 'Limpeza comun',
        icone: 'twf-cleaning-1',
        horas_banheiro: 1,
        horas_cozinha: 1,
        horas_outros: 1,
        horas_quarto: 1,
        horas_quintal: 1,
        horas_sala: 1,
        porcentagem_comissao: 10,
        qtd_horas: 2,
        valor_banheiro: 20,
        valor_cozinha: 20,
        valor_outros: 20,
        valor_quarto: 20,
        valor_quintal: 20,
        valor_sala: 20,
      },
    ];

  function onServiceFormSubmit(data: NovaDiariaFormDataInterface) {
    console.log(data);
  }
    function onClientFormSubmit(data: CadastroClientFormDataInterface) {
      console.log(data);
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
  };
}