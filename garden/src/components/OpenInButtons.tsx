const OpenInButtons = () => {
  return (
    <>
      <a
        href="https://wholetale.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="my-2 items-center justify-between rounded-lg border border-green p-5 shadow-sm hover:no-underline hover:shadow-md"
      >
        <span className="text-center text-xl text-green">Open in Whole Tale</span>
      </a>
      <a
        href="https://huggingface.co/"
        target="_blank"
        rel="noopener noreferrer"
        className="my-2 items-center justify-between rounded-lg border border-green p-5 shadow-sm hover:no-underline hover:shadow-md"
      >
        <span className="text-center text-xl text-green">Open in HuggingFace</span>
      </a>
      <a
        href="https://colab.research.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="my-2 items-center justify-between rounded-lg border border-green p-5 shadow-sm hover:no-underline hover:shadow-md"
      >
        <span className="text-center text-xl text-green">Open in Google Colab</span>
      </a>
    </>
  );
};

export default OpenInButtons;
