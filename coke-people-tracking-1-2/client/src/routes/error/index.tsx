import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error: any = useRouteError();

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center bg-slate-100">
      <h1 className="text-5xl mb-3">Oops!</h1>
      <p className="text-lg mb-3">Sorry, an unexpected error has occurred.</p>
      <p className="text-lg">
        <i className="text-red-700">{error?.statusText || error?.message}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
