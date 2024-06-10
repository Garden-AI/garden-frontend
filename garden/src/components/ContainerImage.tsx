const ContainerImage = ({ container }: { container: any }) => {
  const copy = async (text: any) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="border-1 flex flex-col justify-between rounded-xl border border-gray-300">
      <div className="flex items-center gap-4 px-2 pb-4 pt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="gray"
          className="h-12 w-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
          />
        </svg>

        <h1 className="text-2xl">{container.title}</h1>
      </div>
      <div className="px-2 py-2">
        <div className="grid grid-cols-2">
          <p className="pb-4">ID: {container.id}</p>
          <p>Filesize: {container.fileSize}</p>
          <p className="pb-4">Status: {container.status}</p>
          <p>Created: {container.created}</p>
        </div>
        <div className="flex items-center justify-between">
          <button className="flex gap-2" title="Copy Link" onClick={() => copy(container.url)}>
            Copy Link
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="gray"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
              />
            </svg>
          </button>

          <a
            href={container.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border bg-gray-100 px-2 py-1 text-black hover:bg-gray-300"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContainerImage;
