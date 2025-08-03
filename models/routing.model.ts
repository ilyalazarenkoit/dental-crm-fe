export enum contactsRoute {
  contacts = 'contacts',
}

export enum ordersRoute {
  orders = 'orders',
}

export enum productRoute {
  product = 'product',
}

export enum distributionRoute {
  leads = 'leads',
  deals = 'deals',
}

export enum dealsRoute {
  offers = 'offers',
}

// export enum homeRoute {
//   dashboard = 'dashboard',
//   tasks = 'tasks',
//   approvals = 'approvals',
//   evaluations = 'evaluations',
// }

export enum accountingRoute {
  invoices = 'invoices',
}

export enum invoicesRoute {
  new = 'new',
  createCreditNote = 'create-credit-note',
}

export type RoutingState = {
  distribution: distributionRoute;
  accounting: accountingRoute;
  // home: homeRoute;
};
