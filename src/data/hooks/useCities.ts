import { CidadeInterface } from 'data/@Types/EnderecoInterface';
import { LocationService } from 'data/services/LocationService';
import { useEffect, useState } from 'react';

export default function useCities(estado: string): CidadeInterface[] {
  const [listaCidades, setListaCidades] = useState<CidadeInterface[]>([]);
  useEffect(() => {
    if (estado) {
      setListaCidades([]);
      LocationService.cidades(estado).then((listaCidades) => {
        listaCidades && setListaCidades(listaCidades);
      });
    }
  }, [estado]);
  return listaCidades;
}
