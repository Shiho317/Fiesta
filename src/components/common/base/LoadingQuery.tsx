import React from "react";
import LoadingSpinner from "../LoadingSpinner";
import Main from "./Main";

type QueryProp = {
  children: React.ReactNode;
  isLoading: boolean;
  label?: string;
};

const LoadingQuery = (props: QueryProp) => {
  return (
    <>
      {props.isLoading ? (
        <Main className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <LoadingSpinner />
            <p>{props.label}</p>
          </div>
        </Main>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
};

export default LoadingQuery;
