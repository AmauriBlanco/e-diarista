import {
  ExternalServiceReducerInterface,
  initialState,
  useExternalServicesReducer,
} from 'data/reduces/externalServiceReducer';
import React, { createContext, PropsWithChildren } from 'react';

const initialValue: ExternalServiceReducerInterface = {
  externalServiceDispatch: () => {},
  externalServiceState: initialState,
};

export const ExternalServiceContext = createContext(initialValue);

export const ExternalServiceProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const provider = useExternalServicesReducer();

  return (
    <ExternalServiceContext.Provider value={provider}>
      {children}
    </ExternalServiceContext.Provider>
  );
};
