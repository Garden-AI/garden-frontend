import React, { useCallback } from 'react';
import { Garden, ModalFunction, GardenFunction } from '@/types';
import { useMaterialActions } from '@/features/materials/hooks/useMaterialActions';
import { RemoveDialog, EditDialog } from './MaterialDialogs';
import { DatasetCard, PaperCard, RepositoryCard, NotebookCard } from '@/features/materials';

interface MaterialCardWithRemovalProps {
    material: any;
    materialType: 'dataset' | 'paper' | 'repository' | 'notebook';
    findAffectedFunctions: (identifier: string) => GardenFunction[];
    ownsThisGarden: boolean;
    onMaterialUpdated: () => Promise<void>;
    onMaterialRemoved: () => Promise<void>;
    garden: Garden;
}

export const MaterialCardWithRemoval: React.FC<MaterialCardWithRemovalProps> = ({
    material,
    materialType,
    findAffectedFunctions,
    ownsThisGarden,
    onMaterialUpdated,
    onMaterialRemoved,
    garden
}) => {
    const {
        confirmRemove,
        setConfirmRemove,
        affectedFunctions,
        selectiveFunctions,
        isSelectiveRemoval,
        setIsSelectiveRemoval,
        toggleFunction,
        toggleAll,
        prepareFunctionsForRemoval,
        handleSelectiveRemove,
        isSelectiveEditing,
        editAffectedFunctions,
        editSelectiveFunctions,
        toggleEditFunction,
        toggleEditAll,
        applyEditToAllFunctions,
        applySelectiveEdit,
        handleEdit
    } = useMaterialActions({
        material,
        garden,
        findAffectedFunctions,
        onUpdate: onMaterialRemoved,
        materialType
    });

    // Render the appropriate card based on material type
    const renderCard = () => {
        switch (materialType) {
            case 'dataset':
                return (
                    <DatasetCard
                        key={material.doi}
                        dataset={material}
                        isOwner={ownsThisGarden}
                        context={{}}
                        onUpdate={handleEdit}
                        onDelete={() => prepareFunctionsForRemoval()}
                    />
                );
            case 'paper':
                return (
                    <PaperCard
                        key={material.doi || material.title}
                        paper={material}
                        isOwner={ownsThisGarden}
                        context={{}}
                        onUpdate={handleEdit}
                        onDelete={() => prepareFunctionsForRemoval()}
                    />
                );
            case 'repository':
                return (
                    <RepositoryCard
                        key={material.url}
                        repository={material}
                        isOwner={ownsThisGarden}
                        context={{}}
                        onUpdate={handleEdit}
                        onDelete={() => prepareFunctionsForRemoval()}
                    />
                );
            case 'notebook':
                return (
                    <NotebookCard
                        key={material.url}
                        notebook={material}
                        isOwner={ownsThisGarden}
                        context={{}}
                        onUpdate={handleEdit}
                        onDelete={() => prepareFunctionsForRemoval()}
                    />
                );
        }
    };

    return (
        <>
            {renderCard()}
            <RemoveDialog
                isOpen={confirmRemove}
                onClose={() => setConfirmRemove(false)}
                materialType={materialType}
                affectedFunctions={affectedFunctions}
                selectiveFunctions={selectiveFunctions}
                toggleFunction={toggleFunction}
                toggleAll={toggleAll}
                handleRemoveAll={handleSelectiveRemove}
                handleSelectiveRemove={handleSelectiveRemove}
                isSelectiveRemoval={isSelectiveRemoval}
                setIsSelectiveRemoval={setIsSelectiveRemoval}
            />
            <EditDialog
                isOpen={isSelectiveEditing}
                onClose={() => applyEditToAllFunctions()}
                materialType={materialType}
                editAffectedFunctions={editAffectedFunctions}
                editSelectiveFunctions={editSelectiveFunctions}
                toggleEditFunction={toggleEditFunction}
                toggleEditAll={toggleEditAll}
                applyEditToAllFunctions={applyEditToAllFunctions}
                applySelectiveEdit={applySelectiveEdit}
            />
        </>
    );
};

export default MaterialCardWithRemoval; 