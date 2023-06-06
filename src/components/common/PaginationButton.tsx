import React from "react";

type PaginationButtonProp = {
  start: number;
  take: number;
  total: number;
  end: number;
  skip: React.Dispatch<React.SetStateAction<number>>;
};

const PaginationButton = (props: PaginationButtonProp) => {
  const nextPage = () => {
    const skipNum = props.start + props.take - 1;
    props.skip(skipNum);
  };
  const prevPage = () => {
    const backNum = props.start - props.take - 1;
    props.skip(backNum);
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-300 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-500 dark:text-white">
          {props.start}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-500 dark:text-white">
          {props.end > props.total ? props.total : props.end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-500 dark:text-white">
          {props.total}
        </span>
      </span>
      <div className="xs:mt-0 mt-2 inline-flex">
        <button
          className={`rounded-l px-4 py-2 text-sm font-medium text-white hover:bg-gray-300 ${
            props.start === 1 ? "bg-gray-300" : "bg-gray-400"
          } `}
          disabled={props.start === 1 ? true : false}
          onClick={prevPage}
        >
          Prev
        </button>
        <button
          className={`rounded-r border-0 border-l border-gray-700  px-4 py-2 text-sm font-medium text-white hover:bg-gray-300 ${
            props.end >= props.total ? "bg-gray-300" : "bg-gray-400"
          }`}
          disabled={props.end >= props.total ? true : false}
          onClick={nextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationButton;
