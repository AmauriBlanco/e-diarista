export interface UserShortInformationInterface {
    nome_completo: string,
    foto_usuario?: string,
    reputacao?: number,
    cidade: string,
}

export interface BuscaCepResponde {
  diaristas: UserShortInformationInterface[];
  quantidade_diaristas: number;
}