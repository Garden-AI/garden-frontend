import AssociatedMaterialsSection from "./AssociatedMaterialsSection";

const AssociatedMaterials = () => {
  return (
    <div className="space-y-8 py-6">
      <AssociatedMaterialsSection fieldName="repositories" />
      <AssociatedMaterialsSection fieldName="datasets" />
      <AssociatedMaterialsSection fieldName="papers" />
    </div>
  );
};

export default AssociatedMaterials;
