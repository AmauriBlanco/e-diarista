import { ApiLinksInterface } from 'data/@Types/ApiLinksInterface';
import { ApiService } from 'data/services/ApiService';
import produce from 'immer';
import React, { useReducer, useEffect } from 'react';

export const initialState = {
  externalService: [] as ApiLinksInterface[],
};
export type initialStateType = typeof initialState;

export type ExternalServiceActionType = {
  type: string;
  payload?: unknown;
};

const reducer = (
  state: initialStateType,
  action: ExternalServiceActionType
): initialStateType => {
  const nextState = produce(state, (draftState) => {
    switch (action.type) {
      case 'UPDATE':
        draftState.externalService = action.payload as ApiLinksInterface[];
        break;
    }
  });
  return nextState;
};

export interface ExternalServiceReducerInterface {
  externalServiceState: initialStateType;
  externalServiceDispatch: React.Dispatch<ExternalServiceActionType>;
}

export function useExternalServicesReducer(): ExternalServiceReducerInterface {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    ApiService.get<{ links: ApiLinksInterface[] }>('/api').then(({ data }) => {
      dispatch({
        type: 'UPDATE',
        payload: data.links,
      });
    });
  }, []);

  return {
    externalServiceState: state,
    externalServiceDispatch: dispatch,
  };
}
