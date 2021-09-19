import React from 'react';
import AuthContext, { ContextState } from './Context';

const useAuth = (): ContextState => React.useContext(AuthContext);

export default useAuth;