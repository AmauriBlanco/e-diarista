export const ValidationService = {
  cep(cep = ''): boolean {
    return cep.replace(/\D/g, '').length === 8;
  },
  telefone(telefone = ''): boolean {
    return telefone.replace(/\D/g, '').length === 11;
  },
  cpf(cpf = '') {
    cpf = cpf.replace(/[\s.-]*/gim, '');
    if (
      !cpf ||
      cpf.length != 11 ||
      cpf == '00000000000' ||
      cpf == '11111111111' ||
      cpf == '22222222222' ||
      cpf == '33333333333' ||
      cpf == '44444444444' ||
      cpf == '55555555555' ||
      cpf == '66666666666' ||
      cpf == '77777777777' ||
      cpf == '88888888888' ||
      cpf == '99999999999'
    ) {
      return false;
    }
    var soma = 0;
    var resto;
    for (var i = 1; i <= 9; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (var i = 1; i <= 10; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(cpf.substring(10, 11))) return false;
    return true;
  },
  horarioDeAgendamento(data: string, hora: string): boolean {
    const agora = Date.now(),
      dataHora = new Date(data + 'T' + hora).getTime(),
      diferenca = (dataHora - agora) / 1000 / 60 / 60,
      minHora = 48;

    return diferenca > minHora;
  },
  hora(horario = ''): boolean {
    return /^([01][0-9]|[0-3]):([0-5][0-9])$/.test(horario);
  },
};
