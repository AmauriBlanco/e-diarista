import { ApiLinksInterface } from './ApiLinksInterface';

export interface UserInterface {
  errors?: any;
  error?: any;
  id?: number;
  password_confirmation?: string;
  new_password?: string;
  tipo_usuario: UserType;
  password?: string;
  last_login?: Date;
  nome_completo: string;
  cpf: string;
  nascimento: string | Date;
  email: string;
  foto_usuario?: string;
  foto_documento?: string;
  telefone?: string;
  reputacao?: number;
  chave_pix: string;
  token?: {
    access: string;
    refresh: string;
  };
  links?: ApiLinksInterface[];
}

export interface UserShortInformationInterface {
  nome_completo: string;
  foto_usuario?: string;
  reputacao?: number;
  cidade: string;
}

export interface BuscaCepResponde {
  diaristas: UserShortInformationInterface[];
  quantidade_diaristas: number;
}

export enum UserType {
  Cliente = 1,
  Diarista = 2,
}
