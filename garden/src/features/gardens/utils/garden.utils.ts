import { Option } from "@/components/ui/multiple-select";

// Converts file to string for backend processing
export const fileToString = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file: result is null"));
      }
    };

    reader.onerror = (error: ProgressEvent<FileReader>) => {
      reject(new Error(`Failed to read: ${error.target?.error?.message}`));
    };

    return reader.readAsText(file);
  });
};

// Preset options for the tags in the garden creation form
export const tagOptions: Option[] = [
  {
    value: "Materials Science",
    label: "Materials Science",
    group: "Physical Sciences",
  },
  { value: "Chemistry", label: "Chemistry", group: "Physical Sciences" },
  { value: "Physics", label: "Physics", group: "Physical Sciences" },
  { value: "Drug Discovery", label: "Drug Discovery", group: "Life Sciences" },
  { value: "Astrophysics", label: "Astrophysics", group: "Physical Sciences" },
  {
    value: "Earth Sciences",
    label: "Earth Sciences",
    group: "Physical Sciences",
  },
  { value: "Biology", label: "Biology", group: "Life Sciences" },
  { value: "Bioinformatics", label: "Bioinformatics", group: "Life Sciences" },
  { value: "Neuroscience", label: "Neuroscience", group: "Life Sciences" },
  { value: "Engineering", label: "Engineering", group: "Applied Sciences" },
  {
    value: "Energy Systems",
    label: "Energy Systems",
    group: "Applied Sciences",
  },
  {
    value: "Agricultural Science",
    label: "Agricultural Science",
    group: "Applied Sciences",
  },
  {
    value: "Computer Science",
    label: "Computer Science",
    group: "Computer Sciences",
  },
  {
    value: "Cybersecurity",
    label: "Cybersecurity",
    group: "Computer Sciences",
  },
  { value: "Manufacturing", label: "Manufacturing", group: "Applied Sciences" },
];
