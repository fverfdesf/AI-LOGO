import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slice/userSlice'
import { logoApi } from './api/logoApi'
import { userApi } from './api/userApi'
export const makeStore = () => {
  return configureStore({
    reducer: {userReducer, [logoApi.reducerPath]: logoApi.reducer, [userApi.reducerPath]: userApi.reducer},
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([logoApi.middleware, userApi.middleware])
  })
}


export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']