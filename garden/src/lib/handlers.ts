import { http, HttpResponse } from "msw";

const entrypoints = [
  {
    doi: "10.1234/garden.2024.001.north",
    doi_is_draft: false,
    title: "North Gate Entrance",
    description:
      "Main entrance to Serenity Botanical Gardens featuring a grand archway",
    year: "2024",
    func_uuid: "a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d",
    container_uuid: "b2c3d4e5-f6a7-5b6c-0d1e-8f9g0h1i2j3k",
    base_image_uri: "https://serenitygardens.com/images/north_gate_base",
    full_image_uri: "https://serenitygardens.com/images/north_gate_full",
    notebook_url: "https://serenitygardens.com/notebooks/north_gate_design",
    short_name: "north_gate",
    function_text:
      "def enter_north_gate():\n    print('Welcome to Serenity Botanical Gardens')\n    return 'Entered through North Gate'",
    authors: ["Emma Green", "Oliver Bloom"],
    tags: ["entrance", "architecture", "welcome area"],
    test_functions: ["test_north_gate_accessibility()"],
    models: [],
    repositories: [],
    papers: [],
    datasets: [],
  },
  {
    doi: "10.1234/garden.2024.001.east",
    doi_is_draft: false,
    title: "East Gate Entrance",
    description: "Secondary entrance near the Butterfly Garden",
    year: "2024",
    func_uuid: "c3d4e5f6-7a8b-9c0d-1e2f-3g4h5i6j7k8l",
    container_uuid: "d4e5f6a7-8b9c-0d1e-2f3g-4h5i6j7k8l9m",
    base_image_uri: "https://serenitygardens.com/images/east_gate_base",
    full_image_uri: "https://serenitygardens.com/images/east_gate_full",
    notebook_url: "https://serenitygardens.com/notebooks/east_gate_design",
    short_name: "east_gate",
    function_text:
      "def enter_east_gate():\n    print('Welcome to the Butterfly Garden section')\n    return 'Entered through East Gate'",
    authors: ["Sophia Rose"],
    tags: ["entrance", "butterfly garden"],
    test_functions: ["test_east_gate_signage()"],
    models: [],
    repositories: [],
    papers: [],
    datasets: [],
  },
  {
    doi: "10.1234/garden.2024.001.greenhouse",
    doi_is_draft: false,
    title: "Greenhouse Entrance",
    description:
      "Entrance to the climate-controlled greenhouse featuring exotic plant species",
    year: "2024",
    func_uuid: "e5f6a7b8-9c0d-1e2f-3g4h-5i6j7k8l9m0n",
    container_uuid: "f6a7b8c9-0d1e-2f3g-4h5i-6j7k8l9m0n1o",
    base_image_uri: "https://serenitygardens.com/images/greenhouse_base",
    full_image_uri: "https://serenitygardens.com/images/greenhouse_full",
    notebook_url: "https://serenitygardens.com/notebooks/greenhouse_design",
    short_name: "greenhouse_entrance",
    function_text:
      "def enter_greenhouse():\n    print('Welcome to our climate-controlled greenhouse')\n    return 'Entered Greenhouse'",
    authors: ["Liam Fern", "Emma Green"],
    tags: ["greenhouse", "exotic plants", "climate control"],
    test_functions: [
      "test_greenhouse_temperature()",
      "test_greenhouse_humidity()",
    ],
    models: [],
    repositories: [],
    papers: [],
    datasets: [],
  },
];

const garden = {
  title: "Serenity Botanical Gardens",
  authors: ["Emma Green", "Oliver Bloom"],
  contributors: ["Sophia Rose", "Liam Fern"],
  doi: "10.1234/garden.2024.001",
  doi_is_draft: false,
  description:
    "A lush urban oasis featuring diverse plant species and sustainable landscaping techniques",
  publisher: "Garden-AI",
  year: "2024",
  language: "en",
  tags: ["urban garden", "sustainability", "biodiversity", "native plants"],
  version: "1.2.0",
  entrypoint_aliases: {
    main_entrance: "north_gate",
    herb_section: "culinary_garden",
    water_feature: "lotus_pond",
  },
  entrypoint_ids: ["north_gate", "east_gate", "greenhouse_entrance"],
  owner_identity_id: "7b9e8f32-6c1d-4a9b-b4e5-8f3a7d9c0e1b",
};

export const handlers = [
  http.get(
    import.meta.env.VITE_BACKEND_URL + "/garden/:doi/:doi2",
    ({ params }) => {
      return HttpResponse.json(garden);
    },
  ),
  http.get(
    `{import.meta.env.VITE_BACKEND_URL}/entrypoint/:doi/:doi2`,
    ({ params }) => {
      const entrypoint = entrypoints.find((ep) => ep.doi === params.doi);

      if (entrypoint) {
        return HttpResponse.json(entrypoint);
      } else {
        return HttpResponse.json(entrypoints[0]);
      }
    },
  ),
];
