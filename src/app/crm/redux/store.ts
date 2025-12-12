import {configureStore} from "@reduxjs/toolkit"
import {setupListeners} from "@reduxjs/toolkit/query"
import { categoryApi } from "./services/categoryApi";
import { stockApi } from "./services/stockApi";
import { colorApi } from "./services/colorApi";
import { sizeApi } from "./services/sizeApi";
import {adminInfoApi} from "./services/adminInfoApi";
import { orderApi } from "./services/orderApi";
// Define your API middleware array
const apiSection = [categoryApi.middleware, stockApi.middleware,colorApi.middleware,sizeApi.middleware,orderApi.middleware,adminInfoApi.middleware];

export const store = configureStore({
    reducer: {
    [adminInfoApi.reducerPath]: adminInfoApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
    [colorApi.reducerPath]: colorApi.reducer,
    [sizeApi.reducerPath]: sizeApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...apiSection), 
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;