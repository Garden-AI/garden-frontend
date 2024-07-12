import { Option } from "@/components/ui/multiple-select";
import { EntrypointListItem } from "./FormSchema";

export const tagOptions: Option[] = [
  {
    value: "materials-science",
    label: "Materials Science",
    group: "Physical Sciences",
  },
  { value: "chemistry", label: "Chemistry", group: "Physical Sciences" },
  { value: "physics", label: "Physics", group: "Physical Sciences" },
  { value: "drug-discovery", label: "Drug Discovery", group: "Life Sciences" },
  { value: "astrophysics", label: "Astrophysics", group: "Physical Sciences" },
  {
    value: "earth-sciences",
    label: "Earth Sciences",
    group: "Physical Sciences",
  },
  { value: "biology", label: "Biology", group: "Life Sciences" },
  { value: "bioinformatics", label: "Bioinformatics", group: "Life Sciences" },
  { value: "neuroscience", label: "Neuroscience", group: "Life Sciences" },
  { value: "engineering", label: "Engineering", group: "Applied Sciences" },
  {
    value: "energy-systems",
    label: "Energy Systems",
    group: "Applied Sciences",
  },
  {
    value: "agricultural-science",
    label: "Agricultural Science",
    group: "Applied Sciences",
  },
  {
    value: "computer-science",
    label: "Computer Science",
    group: "Computer Sciences",
  },
  {
    value: "cybersecurity",
    label: "Cybersecurity",
    group: "Computer Sciences",
  },
  { value: "manufacturing", label: "Manufacturing", group: "Applied Sciences" },
];

export const initialEntrypoints: EntrypointListItem[] = [
  {
    doi: "10.26311/3p8f-se33",
    title: "Bandgap model",
    description:
      "Garden containing random forest models of 33 materials properties to provide predictions, error bars, and domain of applicability guidance",
  },
  {
    doi: "10.26311/mk1a-ve41",
    title:
      "Lithium solid state electrolyte conductivity model. Lithium solid state electrolyte conductivity model",
    description:
      "Garden containing random forest models of 33 materials properties to provide predictions, error bars, and domain of applicability guidance",
  },
  {
    doi: "10.26311/17nn-hj98",
    title: "Metallic glass Rc model (LLM data)",
    description:
      "Garden containing random forest models of 33 materials properties to provide predictions, error bars, and domain of applicability guidance",
  },
];
