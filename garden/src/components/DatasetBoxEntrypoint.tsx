import { useEffect } from "react";

const DatasetBoxEntrypoint = (props: { dataset: any; showFoundry: Function }) => {

  useEffect(() => {
    if (props.dataset.url.toString().includes("foundry")) {
      props.showFoundry();
    }
  },[props])

  return (
    <div className="flex flex-col gap-2 border border-gray rounded-lg px-4">
      <h1 className="font-semibold text-2xl pt-4 break-words">{props.dataset.title}</h1>
      <a target="blank" className="break-words text-green underline" href={props.dataset.url}>
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

export default DatasetBoxEntrypoint;
