import {
  accountingRoute,
  distributionRoute,
  // homeRoute,
  RoutingState,
} from "@models/routing.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const initialState: RoutingState = {
  distribution: distributionRoute.leads,
  accounting: accountingRoute.invoices,
  // home: homeRoute.dashboard,
};

const routingPersistConfig = {
  key: "routing",
  storage,
};

export const routingSlice = createSlice({
  name: "routing",
  initialState,
  reducers: {
    setDistributionRoute: (state, action: PayloadAction<distributionRoute>) => {
      state.distribution = action.payload;
    },
    setAccountingRoute: (state, action: PayloadAction<accountingRoute>) => {
      state.accounting = action.payload;
    },
  },
});

export const {
  setDistributionRoute,
  setAccountingRoute,
  // setHomeRoute,
} = routingSlice.actions;

export default persistReducer(routingPersistConfig, routingSlice.reducer);
