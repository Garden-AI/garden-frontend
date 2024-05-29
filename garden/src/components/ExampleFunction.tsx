import { IpynbRenderer } from "react-ipynb-renderer";
import "../../src/ipynbPreview.css"
import { useState } from "react";

type ExampleFunctionProps = {
    functionText: string;
};

export const ExampleFunction = ({ functionText }: ExampleFunctionProps) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    // break up functionText into lines
    const lines = functionText.split("\n").map((line) => line + "\n");
    const notebookJson = makeMinimalNotebook(lines);

    const copy = async () => {
      await navigator.clipboard.writeText(functionText);
      showTooltip();
    };
  
    const showTooltip = () => {
      if (tooltipVisible === false) {
        setTooltipVisible(true);
        setTimeout(() => {
          setTooltipVisible(false);
        }, 3000);
      }
    };

    return (
        <div className="px-4 no-input-number">
          <div className='flex gap-3 justify-end'>
            <button title='Copy link' onClick={copy}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5 sm:w-6 sm:h-6 text-gray-700 hover:text-gray-500 hover:cursor-pointer'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244'
                />
              </svg>
            </button>
            {tooltipVisible && (
              <p className='z-50 fixed top-[10vh] min-w-[10vw] right-[35vw] sm:right-[45vw] p-2 rounded-lg bg-green text-white text-center'>
                Copied to Clipboard
              </p>
            )}
          </div>
          <IpynbRenderer ipynb={notebookJson} />
        </div>
        
    );
};

function makeMinimalNotebook(code: Array<string>) {
    const notebook = {
        "nbformat": 4,
        "nbformat_minor": 2,
        "metadata": {
          "kernelspec": {
            "name": "python3",
            "display_name": "Python 3",
            "language": "python"
          },
          "language_info": {
            "name": "python",
            "version": "3.x",
            "mimetype": "text/x-python",
            "codemirror_mode": { "name": "ipython", "version": 3 },
            "pygments_lexer": "ipython3",
            "nbconvert_exporter": "python",
            "file_extension": ".py"
          }
        },
        "cells": [
          {
            "cell_type": "code",
            "execution_count": null,
            "metadata": {},
            "outputs": [],
            "source": code
          }
        ]
      };
    return notebook;
}