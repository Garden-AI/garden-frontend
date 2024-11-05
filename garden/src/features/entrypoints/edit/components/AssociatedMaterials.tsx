import AssociatedMaterialsSection from "./AssociatedMaterialsSection";

export default function AssociatedMaterials() {
  return (
    <div className="space-y-8 py-6">
      <AssociatedMaterialsSection fieldName="repositories" resourceType="repository" />
      <AssociatedMaterialsSection fieldName="datasets" resourceType="dataset" />
      <AssociatedMaterialsSection fieldName="papers" resourceType="paper" />
    </div>
  );
}
