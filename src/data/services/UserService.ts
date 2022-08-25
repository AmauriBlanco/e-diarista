import axios from 'axios';
import { ApiLinksInterface } from 'data/@Types/ApiLinksInterface';
import { CadastroUserInterface } from 'data/@Types/FormInterface';
import { UserInterface, UserType } from 'data/@Types/UserInterface';
import { UseFormReturn } from 'react-hook-form';
import { ApiService } from './ApiService';
import { objectService } from './ObjectService';
import { TextFormatService } from './TextFormatService';

export const UserService = {
  async cadastrar(
    user: UserInterface,
    userType: UserType,
    link: ApiLinksInterface
  ): Promise<UserInterface | undefined> {
    ApiService.defaults.headers.common.Authorization = '';

    const telefone = TextFormatService.getNumbersFromText(user.telefone),
      cpf = TextFormatService.getNumbersFromText(user.cpf),
      nascimento = TextFormatService.dateToString(user.nascimento as Date),
      userData = objectService.jsonToFormData({
        ...user,
        tipo_usuario: userType,
        cpf,
        telefone,
        nascimento,
      });
    const response = await ApiService.request<UserInterface>({
      url: link.uri,
      method: link.type,
      data: userData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  HandleNewUserError(
    error: unknown,
    form: UseFormReturn<CadastroUserInterface>
  ) {
    if (axios.isAxiosError(error)) {
      const errorList = error.response?.data as UserInterface | undefined;
      if (errorList) {
        if (errorList.errors.cpf) {
          form.setError('usuario.cpf', {
            type: 'cadastrado',
            message: 'CPF ja cadastrado',
          });
        }
        if (errorList.errors.email) {
          form.setError('usuario.email', {
            type: 'cadastrado',
            message: 'E-mail já cadastrado',
          });
        }
      }
    }
  },
};
