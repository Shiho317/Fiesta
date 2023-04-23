import React from "react";
import LoadingSpinner from "../LoadingSpinner";

type QueryProp = {
  children: React.ReactNode;
  isLoading: boolean;
  label?: string;
};

const LoadingQuery = (props: QueryProp) => {
  return (
    <>
      {props.isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <LoadingSpinner />
            <p>{props.label}</p>
          </div>
        </div>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
};

export default LoadingQuery;
