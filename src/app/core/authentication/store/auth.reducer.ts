import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: any | null;
  error: any | null;
  loading: boolean;
  roles: any[];
  subroles: any[];
}

export const initialState: AuthState = {
  user: null,
  error: null,
  loading: false,
  roles: [],
  subroles: [],
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    roles: user.roles || [],
    subroles: user.subroles || [],
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.logout, () => initialState)
);
