import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";

const EntrypointCreateInstructions = () => {
  return (
    <div className="text-sm text-gray-500">
      Not seeing the Entrypoint you're looking for? You can create a new one by following{" "}
      <Dialog>
        <DialogTrigger className="font-bold text-primary transition hover:text-primary/80">
          {" "}
          these instructions.
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-x-auto overflow-y-scroll p-12 font-display xl:max-w-screen-xl">
          <DialogTitle className="text-3xl font-bold">Creating a new Entrypoint</DialogTitle>

          <DialogDescription className="mb-6 text-base text-gray-700">
            Entrypoints are Python functions that serve as an access point to a saved notebook
            session and can be executed remotely via any Garden it's published to. To add an
            entrypoint, first ensure you have the
            <a href="https://garden.ai/docs/cli" className="text-primary">
              {" "}
              Garden CLI
            </a>{" "}
            installed on your machine, and you are logged in. You can run
            <code className="rounded bg-gray-100 p-1">garden-ai whoami</code> to check if you are
            logged in.
          </DialogDescription>

          <div className="space-y-12">
            <div>
              <h2 className="mb-4 text-xl font-semibold">Start a Notebook</h2>
              <div className="rounded-lg bg-gray-100 p-4">
                <pre>
                  <code className="">
                    garden-ai notebook start {"<PATH TO YOUR NOTEBOOK>"} --base-image=
                    {"<BASE IMAGE>"}
                  </code>
                </pre>
              </div>
              <div className="">
                <p className="mt-2">
                  This command starts a Jupyter notebook in an isolated Docker environment.
                </p>
                <p className="mt-2">
                  The <code>--base-image</code> flag specifies the base image to use for the
                  notebook- you can run{" "}
                  <code className="rounded bg-gray-100 p-1">
                    garden-ai notebook list-premade-images
                  </code>{" "}
                  to see the available base images.
                </p>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Write your Entrypoint Function</h2>
              <p className="mb-2">
                In the notebook, define one or more entrypoint functions. This function will run on
                the remote server when someone invokes your model.
              </p>

              <p className="mb-4">
                To specify an entrypoint function, use the garden-entrypoint decorator:
              </p>
              <SyntaxHighlighter>
                {`from garden_ai import EntrypointMetadata, garden_entrypoint 

@garden_entrypoint(
    metadata=EntrypointMetadata(
        title="My Entrypoint",
        description="This is an example entrypoint",
        tags=["example", "entrypoint"],
        authors=["Shane", "Leek"],
    )
)
def my_entrypoint_function():
  # Your code here
  return`}
              </SyntaxHighlighter>

              <p className="mt-2 text-sm text-gray-500">
                For more information on the garden-entrypoint decorator, including more information
                about the EntrypointMetadata fields, check out the{" "}
                <a
                  href="https://garden-ai.readthedocs.io/en/latest/Entrypoints/#garden_ai.EntrypointMetadata"
                  className="text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Entrypoint Metadata API Reference
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Publish your Entrypoint</h2>
              <div className="">
                <p className="mb-4">
                  Use the following command to publish your notebook and associated entrypoints:
                </p>
                <div className="rounded-lg bg-gray-100 p-4">
                  <pre>
                    <code className="text-sm">
                      garden-ai notebook publish {"<PATH TO YOUR NOTEBOOK>"}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="mb-2 text-xl font-semibold">Success!</h3>
              <p className="mb-2">
                You can now add your new Entrypoint to your Garden by selecting it from the list of
                available Entrypoints.
              </p>

              <p className="mb-4">
                For a more comprehensive guide on creating and managing Entrypoints, see the{" "}
                <a
                  href="https://garden-ai.readthedocs.io/en/latest/user_guide/tutorial/"
                  className="text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  online tutorial
                </a>
                .
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default EntrypointCreateInstructions;
