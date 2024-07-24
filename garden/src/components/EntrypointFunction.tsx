import { Entrypoint } from "@/api/types";
import { ExampleFunction } from "./ExampleFunction";
import CopyButton from "./CopyButton";

function EntrypointFunction({
  gardenDOI,
  entrypoint,
}: {
  gardenDOI: string;
  entrypoint: Entrypoint;
}) {
  return (
    <div className="mb-12 flex flex-col gap-8 py-12">
      <h2 className="text-center text-2xl sm:text-3xl">Run this entrypoint</h2>
      <div className="justify-center pt-2 sm:flex">
        <div className="relative">
          <ExampleFunction
            functionText={exampleFunctionText(gardenDOI, entrypoint)}
          />
        </div>
      </div>
      <div className="mt-0 flex justify-center pt-0">
        <p>
          To run this entrypoint, you need to be a part of{" "}
          <a
            className="text-green underline"
            target="_blank"
            href=" https://app.globus.org/groups/53952f8a-d592-11ee-9957-193531752178/about"
          >
            this Globus group
          </a>
        </p>
      </div>
    </div>
  );
}

const exampleFunctionText = (
  gardenDOI: string,
  entrypoint: Entrypoint,
): string => {
  const prefixText = `from garden_ai import GardenClient
client = GardenClient()
garden = client.get_published_garden("${gardenDOI}")
\n`;

  // Ideally we have a test function and we can display that.
  if (entrypoint.test_functions && entrypoint.test_functions.length > 0) {
    let functionText = entrypoint.test_functions[0];
    // The test function writer called it by its short name,
    // but the consumer will call it by garden.short_name
    if (entrypoint.short_name) {
      functionText = functionText.replaceAll(
        entrypoint.short_name,
        `garden.${entrypoint.short_name}`,
      );
    }
    const fullFunction = prefixText + functionText;

    // Remove the @entrypoint_test decorator if it's in this snippet
    const lines = fullFunction.split("\n");
    const filteredLines = lines.filter(
      (line) => !line.trim().startsWith("@entrypoint_test"),
    );
    return filteredLines.join("\n");
  }
  // If we don't have a test function,
  // we can use a generic template that shows how to call the entrypoint.
  let fallbackFunction = prefixText + `input = ['Data Here']\n`;
  if (entrypoint.short_name) {
    fallbackFunction += `return garden.${entrypoint.short_name}(input)`;
  } else {
    fallbackFunction += `my_entrypoint = next(e for e in garden.entrypoints if e.doi == ${entrypoint.doi})
return my_entrypoint(input)`;
  }

  return fallbackFunction;
};

export default EntrypointFunction;
