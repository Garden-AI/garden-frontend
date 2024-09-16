import AssociatedMaterialsSection from "./AssociatedMaterialsSection";

export default function AssociatedMaterials() {
  return (
    <div className="space-y-8 py-6">
      <h2 className="text-3xl font-semibold">Associated Materials</h2>
      <AssociatedMaterialsSection
        fieldName="repositories"
        resourceType="repository"
      />
      <AssociatedMaterialsSection fieldName="datasets" resourceType="dataset" />
      <AssociatedMaterialsSection fieldName="papers" resourceType="paper" />
    </div>
  );
}
