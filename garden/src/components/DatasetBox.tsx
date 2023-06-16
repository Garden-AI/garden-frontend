import React from "react";

const DatasetBox = (props: { dataset: any; showFoundry: Function }) => {
  if (props.dataset.repository === "Foundry") {
    props.showFoundry();
  }
  return (
    <div className="mb-8 pb-4 mx-16 border border-2 border-gray">
      <p className="mx-16 pt-4 pb-2 text-xl">
        Find the dataset here:{" "}
        <a target="blank" href={props.dataset.url}>
          {props.dataset.url}
        </a>
      </p>
      <p className="mx-16 px-4 text-lg">-DOI: {props.dataset.doi}</p>
      {props.dataset.repository === "Foundry" ? (
        <p className="mx-16 px-4 text-lg">*This dataset uses Foundry</p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DatasetBox;
