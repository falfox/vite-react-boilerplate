import clsx from "clsx";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { postLogin } from "../api/auth";
import { isAxiosError } from "../api/axios";
import { useRedirectIfLoggedIn } from "../hooks/redirectIfLoggedIn";
import { AuthStores } from "../stores/auth";

interface FormData {
  [key: string]: any;
  email: string;
  password: string;
}
function LoginPage() {
  const history = useHistory();
  const [error, setError] = useState("");
  const { setToken } = AuthStores.useStoreActions((actions) => actions);

  useRedirectIfLoggedIn();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setError("");
      const { token } = await postLogin({
        ...data,
      });
      setToken(token);
      history.push("/sender");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (isAxiosError(error)) {
          const data = error.response?.data as {
            errors: {
              [key: string]: string[] | string;
            };
            message: string;
          };

          setError(data.message);

          // for (const [key, messages] of Object.entries(data.errors)) {
          //   if (Array.isArray(messages)) {
          //     setError(key, {
          //       message: messages[0],
          //       type: "validate",
          //       shouldFocus: false,
          //     })
          //   } else {
          //     setError(key, {
          //       type: "validate",
          //       message: messages,
          //       shouldFocus: false,
          //     })
          //   }
          // }
        }
      }
    }
  }

  return (
    <main className="flex flex-col justify-center max-w-sm min-h-screen mx-auto">
      <form
        className="flex flex-col px-6 py-5 space-y-5 border border-gray-600 rounded-md shadow"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold">Sign in to your account</h2>
        <div className="flex flex-col space-y-3">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                id="email"
                className="block w-full text-sm bg-gray-900 border-gray-700 form-input"
                placeholder="johndoe@gmail.com"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="py-1 text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                id="password"
                className="block w-full text-sm bg-gray-900 border-gray-700 form-input"
                placeholder="********"
                autoComplete="off"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <span className="py-1 text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
        <button
          type="submit"
          className={clsx(
            "inline-flex items-center justify-center px-2 py-3 text-sm font-bold leading-5 tracking-wider text-white uppercase rounded-md shadow-sm",
            {
              "bg-gray-500": isSubmitting,
              "bg-blue-700": !isSubmitting,
            }
          )}
          disabled={isSubmitting}
        >
          Sign In
        </button>
        <div>
          <div className="text-center">
            <a
              href="https://smssender.chatwa.id/signup"
              className="text-sm font-medium text-blue-500"
              target="_blank"
            >
              or Register Here
            </a>
          </div>
        </div>
      </form>
    </main>
  );
}

export default LoginPage;
