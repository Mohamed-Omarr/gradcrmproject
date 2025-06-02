import {configureStore} from "@reduxjs/toolkit"
import {setupListeners} from "@reduxjs/toolkit/query"
import { categoryApi } from "./services/categoryApi";
import { productApi } from "./services/productApi";
import { wishlistApi } from "./services/wishlistApi";
import { cartApi } from "./services/cartApi";

// Define your API middleware array
const apiSection = [categoryApi.middleware,productApi.middleware ,wishlistApi.middleware,cartApi.middleware];

export const store = configureStore({
    reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...apiSection), 
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;