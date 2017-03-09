import initStripe from 'stripe';
import {getDotenv} from '../../universal/utils/dotenv';
import {errorObj} from '../utils/utils';
import {usedMethods, usedResources} from 'server/billing/constants';

const tryCatchWrapper = (target) => async(...args) => {
  try {
    return await target(...args);
  } catch (e) {
    throw errorObj({_error: e.message});
  }
};

getDotenv();
const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

// whenever we call stripe, we want to 1) make sure we throw the error and 2) throw our special message for the client
// TODO remove when the mock is complete
if (!stripe.mock) {
  usedResources.forEach((resource) => {
    const stripeResource = stripe[resource];
    usedMethods.forEach((method) => {
      if (stripeResource[method]) {
        stripeResource[method] = tryCatchWrapper(stripeResource[method].bind(stripeResource))
      }
    })
  });
  stripe.invoices.retrieveLines = tryCatchWrapper(stripe.invoices.retrieveLines.bind(stripe.invoices));
  stripe.invoices.retrieveUpcoming = tryCatchWrapper(stripe.invoices.retrieveUpcoming.bind(stripe.invoices));
}
export default stripe;
