import React from 'react'
import { useNavigate } from 'react-router-dom';

 const GardenBox = () =>{ //({ doi }: { doi: string }) => {
    const navigate = useNavigate();
    const fakeData = {
        uuid: "91b35f79-2639-44e4-8323-6cfcav1b9592",
        name: "Crystal Garden",
        doi: "10.3792.1234",
        pipelines: ["10.2345.55555", "10.2345.55556", "10.2345.55557", "10.2345.55558"],
        description: "Models for predicting crystal structure , this is a much longer description to try and see what will happen when there is noticable and a lot of text overflow so here are a few more words just to try and get that overflow to trigger we are almost there just a few more words and we should be all set but here is somthing else that i did ",
        authors: ["KJ Schmidt, Will Engler, Owen Price Skelly, Ben B"],
        tags: ["fun, crystals, garden"]
    };

    return (
        <div className='border border-gray-200 shadow-sm rounded-lg p-5 flex flex-col h-56 justify-between hover:shadow-md hover:cursor-pointer text-display' onClick={() => navigate(`/garden/${fakeData.uuid}`)}>
             <div className='flex flex-col gap-2'>
                 <h2 className='text-xl'>{fakeData.name}</h2>
                 <p className='bg-gradient-to-b from-black to-white bg-clip-text text-transparent max-h-[120px] overflow-y-hidden'>{fakeData.description}</p>
             </div>
             <div className='text-gray-500 flex gap-2'>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                 </svg>
                 <div>
                     { fakeData.tags
                        .map<React.ReactNode>(t => <span>{t}</span>)
                        .reduce((prev, curr) => [prev, ', ', curr])
                    }
                </div>
            </div>
        </div>
    )
}

export default GardenBox