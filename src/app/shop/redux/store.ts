import {configureStore} from "@reduxjs/toolkit"
import {setupListeners} from "@reduxjs/toolkit/query"
import { customerInfoApi } from "./services/customerInfoApi";
import { categoryApi } from "./services/categoryApi";
import { productApi } from "./services/productApi";
import { wishlistApi } from "./services/wishlistApi";
import { cartApi } from "./services/cartApi";
import { rateApi } from "./services/rateApi";
import { addressApi } from "./services/addressApi";
import {cardApi} from "./services/cardApi";
import { orderApi } from "./services/orderApi";
import orderReducer from "./features/order_summary_feature/orderSlice"

// Define your API middleware array
const apiSection = [customerInfoApi.middleware ,categoryApi.middleware,productApi.middleware ,wishlistApi.middleware,cartApi.middleware ,rateApi.middleware ,addressApi.middleware,cardApi.middleware,orderApi.middleware];

export const store = configureStore({
    reducer: {
    order: orderReducer,
    [customerInfoApi.reducerPath]: customerInfoApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [rateApi.reducerPath]: rateApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [cardApi.reducerPath]: cardApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...apiSection), 
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;