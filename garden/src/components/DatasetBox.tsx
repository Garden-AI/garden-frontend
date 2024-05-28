import React, { useEffect } from "react";

const DatasetBox = (props: { dataset: any; showFoundry: Function }) => {
  useEffect(() => {
    if (props.dataset.repository === "Foundry") {
      props.showFoundry();
    }
  }, [props]);

  return (
    <div className="border-gray mx-16 mb-8 border-2 pb-4">
      <p className="mx-16 pb-2 pt-4 text-xl">
        Find the dataset here:{" "}
        <a target="blank" href={`https://doi.org/${props.dataset.doi}`}>
          {`https://doi.org/${props.dataset.doi}`}
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
