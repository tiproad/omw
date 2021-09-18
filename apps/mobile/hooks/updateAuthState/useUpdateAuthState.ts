import React from 'react';
import UpdateAuthStateContext, { ContextState } from './Context';

const useUpdateAuthState = (): ContextState => React.useContext(UpdateAuthStateContext);

export default useUpdateAuthState;
