import { useEffect } from "react";

const DatasetBoxPipeline = (props: { dataset: any; showFoundry: Function }) => {

  useEffect(() => {
    if (props.dataset.url.toString().includes("foundry")) {
      props.showFoundry();
    }
  },[props])

  return (
    <div className="flex flex-col gap-2 border border-gray rounded-lg px-4">
      <h1 className="font-semibold text-2xl pt-4">{props.dataset.title}</h1>
      <a target="blank" className="break-words text-blue hover:underline" href={props.dataset.url}>
        {props.dataset.url}
      </a>
      <div className="pb-4">
        {props.dataset.doi ? <p className="py-1">DOI: {props.dataset.doi}</p> : <></>}
        {props.dataset.type ? (
          <p className="p-1">
            File Type:{" "}
            {props.dataset.type}
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default DatasetBoxPipeline;
