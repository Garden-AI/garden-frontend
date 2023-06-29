import { useState } from "react";

const DatasetBoxPipeline = ({dataset}: {dataset: any}) => {

    const [like, setLike] = useState(false)
    const likeUnlike = () =>{
        if(like === false){
            setLike(true)
        }else{
            setLike(false)
        }
    }

        return (
            <div className="flex flex-col gap-2 border border-gray rounded-lg px-4">
              <h1 className="font-semibold text-2xl pt-4">
                {dataset.title}
              </h1>
              <a target="blank" href={dataset.url}>
                {dataset.url}
              </a>
              <div>
                <p className="p-1">{dataset.size}</p>
                <p className="p-1">
                  {dataset.number} Files (
                  {dataset.type
                    .map((type: any) => (
                      <span>{type}</span>
                    ))
                    .reduce((prev: any, curr: any) => [prev, ", ", curr])}
                  )
                </p>
              </div>
              <div className="flex pb-4">
                <div className="flex items-center gap-3 border border-gray">
                <button onClick={() => likeUnlike()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={like ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
                </button>
                <p className="px-4 border-l border-gray text-lg">{dataset.pluses}</p>
                </div>
              </div>
            </div>
          );
}

export default DatasetBoxPipeline