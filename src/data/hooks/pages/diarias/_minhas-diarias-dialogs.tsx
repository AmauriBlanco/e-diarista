import { Divider, Rating, Snackbar, Typography } from '@mui/material';
import { DiariaInterface } from 'data/@Types/DiariaInterface';
import { UserType } from 'data/@Types/UserInterface';
import { UserContext } from 'data/contexts/UserContext';
import useIsMobile from 'data/hooks/useIsMobile';
import { DateService } from 'data/services/DateService';
import { TextFormatService } from 'data/services/TextFormatService';
import { useContext, useState } from 'react';
import JobInformation from 'ui/components/data-display/JobInformation/JobInformation';
import UserInformation from 'ui/components/data-display/UserInformation/UserInformation';
import Dialog from 'ui/components/feedback/Dialog/Dialog';
import { RatingBox } from 'ui/partials/diarias/minhas-diarias.styled';
import TextField from 'ui/components/inputs/TextField/TextField';

interface DialogProps {
  diaria: DiariaInterface;
  onConfirm: (diaria: DiariaInterface) => void;
  onCancel: () => void;
}

const JobBox: React.FC<{ diaria: DiariaInterface }> = ({ diaria }) => {
  return (
    <JobInformation>
      <>
        <div>
          Data:{' '}
          <strong>
            {TextFormatService.reverseDate(diaria.data_atendimento as string)}{' '}
            às {DateService.getTimeFromDate(diaria.data_atendimento as string)}
          </strong>
        </div>
        <div>Endereço: {TextFormatService.getAddress(diaria)}</div>
        <div>
          <strong>Valor: {TextFormatService.currency(diaria.preco)}</strong>
        </div>
      </>
    </JobInformation>
  );
};

interface RatingDialogProps extends Omit<DialogProps, 'onConfirm'> {
  onConfirm: (
    diaria: DiariaInterface,
    avaliacao: { descricao: string; nota: number }
  ) => void;
}

export const RatingDialog: React.FC<RatingDialogProps> = (props) => {
  const isMobile = useIsMobile(),
    diarista = props.diaria.diarista,
    {
      userState: { user },
    } = useContext(UserContext),
    usuarioAvaliado =
      user.tipo_usuario === UserType.Cliente
        ? props.diaria.diarista
        : props.diaria.cliente,
    [nota, setNota] = useState(3),
    [descricao, setDescricao] = useState(''),
    [erroMessage, setErrorMessage] = useState('');

  function tentarAvaliar() {
    if (descricao.length > 3) {
      props.onConfirm(props.diaria, { descricao, nota });
    } else {
      setErrorMessage('Escreva um deposimento');
    }
  }
  return (
    <Dialog
      isOpen={true}
      onClose={props.onCancel}
      onConfirm={tentarAvaliar}
      title={'Avaliar uma dirária'}
      subtitle={'Avalie uma diásria abaixo'}
    >
      <JobBox diaria={props.diaria} />
      <UserInformation
        name={usuarioAvaliado?.nome_completo ?? ''}
        rating={usuarioAvaliado?.reputacao ?? 1}
        description={
          'Telefone: ' +
          TextFormatService.formatPhoneNumber(usuarioAvaliado?.telefone ?? '')
        }
        picture={usuarioAvaliado?.foto_usuario ?? ''}
      />
      <Divider sx={{ my: 4 }} />
      <Typography>Deixe a sua avaliação</Typography>
      <RatingBox>
        <strong>Nota: </strong>
        <Rating
          value={nota}
          onChange={(_event, value) => setNota(value ?? 1)}
          size={isMobile ? 'large' : 'small'}
        />
        <strong>Depoimento: </strong>
        <TextField
          label={'Digite aqui seu depoimento'}
          fullWidth
          multiline
          rows={3}
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
        />
      </RatingBox>
      <Snackbar
        open={erroMessage.length > 0}
        message={erroMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage('')}
      />
    </Dialog>
  );
};

export const ConfirmDialog: React.FC<DialogProps> = (props) => {
  const diarista = props.diaria.diarista;
  return (
    <Dialog
      isOpen={true}
      onClose={props.onCancel}
      onConfirm={() => props.onConfirm(props.diaria)}
      title={'COnfirmar presença da diarista'}
      subtitle={'Você confirma a presença da diarista na diária abaixo?'}
    >
      <JobBox diaria={props.diaria} />
      <UserInformation
        name={diarista?.nome_completo ?? ''}
        rating={diarista?.reputacao ?? 1}
        description={
          'Telefone: ' +
          TextFormatService.formatPhoneNumber(diarista?.telefone ?? '')
        }
        picture={diarista?.foto_usuario ?? ''}
      />
      <Typography sx={{ py: 2 }} variant={'subtitle2'} color={'textSecundary'}>
        Ao COnfirma a prensença do(a) diarista, você está definindo que o
        serviço foi realizado em sua residência e autoriza a plataforma a fazer
        o repasse do valor para o profissional. Caso você tenha algum propblema,
        pode entrar em contato com a nossa equipe pelo e-mail
        sac@e-diaristas.com.br
      </Typography>
    </Dialog>
  );
};

interface CancelDialogProps extends Omit<DialogProps, 'onConfirm'> {
  onConfirm: (diaria: DiariaInterface, motivo: string) => void;
}

export const CancelDialog: React.FC<CancelDialogProps> = (props) => {
  const [motivo, setMotivo] = useState(''),
    [erroMessage, setErrorMessage] = useState(''),
    {
      userState: { user },
    } = useContext(UserContext);

  function tentarCancelar() {
    if (motivo.length > 3) {
      props.onConfirm(props.diaria, motivo);
    } else {
      setErrorMessage('Digite o motivo do cancelamento');
    }
  }

  function getAviso(): string {
    if (user.id) {
      if (user.tipo_usuario === UserType.Diarista) {
        return 'Ao cancelar uma diária, você pode ser penalizado(a) com a diminuição da sua reputação. Quanto menor a sua reputação, menos chance de ser selecionada para as próximas oportunidades. O cancelamento de diárias deve ser feito somente em situações de exceção.';
      } else {
        const dataAtendimento = new Date(props.diaria.data_atendimento);
        if (DateService.getDifferenceHours(dataAtendimento) < 24) {
          return 'Ao cancelar a diária, devido a proximidade com horário de agendamento do serviço, o sistema cobrará uma multa de 50% sobre o valor da diária. O cancelamento de diárias deve ser feito somente em situação de exceção';
        }
        return 'Ao cancelar uma diária, o(a) profissional que já havia agendado um dia na agenda acaba sendo prejudicado(a). O cancelamento de diária deve ser feito somente em situação de exceção.';
      }
    }
    return '';
  }

  return (
    <Dialog
      isOpen={true}
      onClose={props.onCancel}
      onConfirm={tentarCancelar}
      title={'Cancelar diária?'}
      subtitle={'Tem certeza que deseja cancelar a diária abaixo?'}
    >
      <JobBox diaria={props.diaria} />
      <TextField
        label={'Digite o motivo do cancelamento'}
        fullWidth
        multiline
        rows={3}
        value={motivo}
        onChange={(event) => setMotivo(event.target.value)}
      />
      <Typography sx={{ py: 2 }} variant={'subtitle2'} color={'textSecondary'}>
       { getAviso()}
      </Typography>
      <Snackbar
        open={erroMessage.length > 0}
        message={erroMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage('')}
      />
    </Dialog>
  );
};
