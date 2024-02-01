import type { PageServerLoad, Actions } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { useLocaleKey } from "$lib/utils";
import {
  LOGIN_MUTATION,
  CUSTOMER_QUERY,
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_UPDATE_MUTATION,
} from "$lib/server/data";
import { setError, superValidate } from "sveltekit-superforms/server";
import type {
  Customer,
  CustomerAccessTokenCreatePayload,
  CustomerCreatePayload,
  CustomerUpdateInput,
  CustomerUpdatePayload,
} from "$lib/types";
import {
  loginSchema,
  registerSchema,
  AccountEditSchema,
} from "$lib/validations";
import { urlHasLocale } from "$lib/utils";

const getCustomer = async (locals: App.Locals) => {
  const { storefront, session, locale } = locals;
  const { customerAccessToken } = session.data;

  const { data } = await storefront.query<{
    customer: Customer;
  }>({
    query: CUSTOMER_QUERY,
    variables: {
      customerAccessToken: customerAccessToken,
      country: locale?.country || undefined,
      language: locale?.language || undefined,
    },
  });

  return data?.customer;
};

const doLogin = async (locals: App.Locals, email: string, password: string) => {
  const { storefront } = locals;

  const { data } = await storefront.mutate<{
    customerAccessTokenCreate: CustomerAccessTokenCreatePayload;
  }>({
    mutation: LOGIN_MUTATION,
    variables: {
      input: { email, password },
    },
  });
  if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    return data.customerAccessTokenCreate.customerAccessToken.accessToken;
  }

  throw error(
    400,
    JSON.stringify(data?.customerAccessTokenCreate?.customerUserErrors),
  );
};

export const load: PageServerLoad = async ({ locals, setHeaders, url }) => {
  const { session } = locals;
  const { customerAccessToken } = session.data;

  const customer = customerAccessToken ? await getCustomer(locals) : undefined;

  // Redirect if not authenticated
  if (!customerAccessToken || !customer) {
    throw redirect(302, `${url}/login`);
  }

  // Don't cache this page
  setHeaders({ "Cache-Control": "no-store" });

  // Return as props
  return {
    customer,
    seo: {
      title: "Account",
    },
  };
};

export const actions: Actions = {
  login: async ({ locals, request }) => {
    const { session } = locals;
    const form = await superValidate(request, loginSchema);

    try {
      // validate form
      if (!form.valid) return fail(400, { form });
      const { email, password } = form.data;

      // perform login
      const customerAccessToken = await doLogin(locals, email, password);
      await session.set({ customerAccessToken: customerAccessToken });
    } catch (err) {
      if (err instanceof Error)
        setError(
          form,
          "password",
          "Something went wrong, please try again later.",
        );
      else setError(form, "password", "Invalid email or password.");
    }

    // return form
    return { form };
  },
  register: async ({ locals, request }) => {
    const { storefront, session } = locals;
    const form = await superValidate(request, registerSchema);

    try {
      // validate form
      if (!form.valid) return fail(400, { form });
      const { email, password } = form.data;

      // perform registration
      const { data } = await storefront.mutate<{
        customerCreate: CustomerCreatePayload;
      }>({
        mutation: CUSTOMER_CREATE_MUTATION,
        variables: {
          input: { email, password },
        },
      });
      if (!data?.customerCreate?.customer?.id)
        throw error(
          400,
          JSON.stringify(data?.customerCreate?.customerUserErrors),
        );

      // Login new customer
      const customerAccessToken = await doLogin(locals, email, password);
      await session.set({ customerAccessToken: customerAccessToken });

      throw redirect(302, useLocaleKey(locals.locale) + "/account");
    } catch (err) {
      if (err instanceof Error)
        setError(
          form,
          "password",
          "Something went wrong, please try again later.",
        );
      else
        setError(
          form,
          "password",
          "Sorry. We could not create an account with this email. User might already exist, try to login instead.",
        );
    }

    return { form };
  },
  logout: async ({ locals }) => {
    const { session } = locals;
    await session.set({ customerAccessToken: null });
    const redirectPath = useLocaleKey(locals.locale)
      ? `/${useLocaleKey(locals.locale)}`
      : "";
    throw redirect(302, redirectPath);
  },
  edit: async ({ locals, request }) => {
    const { storefront, session, locale } = locals;
    const { customerAccessToken } = session.data;

    const form = await superValidate(request, AccountEditSchema);

    try {
      // validate session
      if (!customerAccessToken)
        throw error(400, "You must be logged in to edit your account");

      // validate form
      if (!form.valid) return fail(400, { form });

      // construct new customer
      const customer: CustomerUpdateInput = {
        firstName: form.data.firstName,
        lastName: form.data.lastName,
        email: form.data.email,
        phone: form.data.phone,
        password: form.data.newPassword || form.data.currentPassword,
      };

      // perform update
      const { data } = await storefront.mutate<{
        customerUpdate: CustomerUpdatePayload;
      }>({
        mutation: CUSTOMER_UPDATE_MUTATION,
        variables: {
          customerAccessToken,
          customer,
        },
      });
      console.log("data", data);

      // update form with api errors
      if (!data?.customerUpdate?.customer?.id) {
        data?.customerUpdate?.customerUserErrors?.forEach((error) => {
          setError(form, "confirmPassword", error.message);
        });
      }

      // update session
      if (data?.customerUpdate.customerAccessToken?.accessToken) {
        await session.set({
          customerAccessToken:
            data?.customerUpdate.customerAccessToken?.accessToken,
        });
        throw redirect(302, `/${useLocaleKey(locale) ?? ""}/account`);
      }

      return { form };
    } catch (err) {
      if (err instanceof Error)
        setError(
          form,
          "currentPassword",
          "Something went wrong, please try again later.",
        );
      else setError(form, "email", "Invalid email or password.");
    }
  },
  recover: async ({ locals, request }) => {}, // TODO
};
