import React from 'react'

const AboutPage = () => {
  return (
    <>
      <div className='grid grid-cols-3'>
        <div className='h-screen flex flex-col col-span-1 items-end justify-center p-8 gap-5 bg-green-800 text-white text-right'>
          <h1 className='text-3xl font-serif'>Garden AI</h1>
          <p className='text-gray-300'>A FAIR Framework for Publishing and<br></br>Applying AI Models</p>
        </div>
        <div className='flex flex-col col-span-2 col-start-2 p-16 gap-5 text-gray-700'>
          <p>The AI Model Garden project is under active development. Learn more from our <a href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=2209892&HistoricalAwards=false">NSF Award Abstract</a> and <a href="https://cs.uchicago.edu/news/uchicago-argonne-researchers-will-cultivate-ai-model-gardens-with-3-5m-nsf-grant/">this news article</a> from the University of Chicago Department of Computer Science.</p>
          <p>This website will soon be the web portal for discovering and reusing Model Gardens. For now you can check on our progress in <a href="https://github.com/Garden-AI/">our GitHub repositories</a> and download the Garden CLI from <a href="https://pypi.org/project/garden-ai/">PyPI</a>.</p>
          <p>The Garden team is grateful for the support of the NSF's Office of Advanced Cyberinfrastructure.</p>

          <br></br>

          <h2 className='text-xl'>Relevant Links</h2>
          <ul className='list-disc pl-10'>
            <li><a href='https://github.com/Garden-AI/' target="_blank" rel="noopener noreferrer">Github</a></li>
            <li><a href='https://pypi.org/project/garden-ai/' target="_blank" rel="noopener noreferrer">PyPI</a></li>
          </ul>
        </div>
      </div>
    </>  
  )
}

export default AboutPage