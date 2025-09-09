import React, { useMemo, useCallback } from "react";
import { Tree, MoveHandler } from 'react-arborist';

import { usePatchGarden } from "@/features/gardens/api/usePatchGarden";
import { ModalFunction } from "@/types";
import { Node } from "./Node";
import { buildFunctionNodeId, entityToNodeId, buildGardenTreeData } from "../types";

interface GardenTreeProps {
  gardens: any[];
  selectedItem: any;
  onItemSelected: (item: any) => void;
  draggedItems: any[];
  setDraggedItems: (items: any[]) => void;
}

export const GardenTree = ({ 
  gardens, 
  selectedItem, 
  onItemSelected, 
  draggedItems, 
  setDraggedItems 
}: GardenTreeProps) => {
  const { mutate: patchGarden } = usePatchGarden();

  // Convert selectedItem entity to the node ID format that react-arborist expects
  const selectedNodeId = useMemo(() => {
    if (!selectedItem) return undefined;
    
    // For functions, we need to find which garden they belong to in the current tree
    if (selectedItem.id && selectedItem.function_name) { // It's a function
      // Find the garden that contains this function
      const containingGarden = gardens?.find(g => 
        g.modal_functions?.some(fn => fn.id === selectedItem.id)
      );
      if (containingGarden) {
        return buildFunctionNodeId(selectedItem, containingGarden.doi);
      }
      return buildFunctionNodeId(selectedItem);
    }
    
    // Use the general entityToNodeId helper for other cases
    return entityToNodeId(selectedItem);
  }, [selectedItem, gardens]);

  const treeData = useMemo(() => {
    return buildGardenTreeData(gardens || []);
  }, [gardens]);

  const handleDrop = useCallback((mh: MoveHandler) => {
    // Use draggedItems from parent state if available (cross-tree drag)
    const nodesToProcess = draggedItems.length > 0 ? draggedItems : mh.dragNodes;

    const fnsToAdd: ModalFunction[] = [];
    nodesToProcess.map((dn) => {
      if (mh.parentNode.data.garden.modal_functions?.some((fn) => fn.id === dn.data.func.id)) {
        // function is already in the garden, do nothing
        return;
      } else {
        fnsToAdd.push(dn.data.func);
      }
    })

    const garden = mh.parentNode.data.garden;
    if (fnsToAdd.length > 0) {
      patchGarden({
        doi: garden.doi,
        garden: {
          modal_function_ids: [...garden.modal_function_ids, ...fnsToAdd.map((fn) => fn.id)],
        },
      }, {
        onError: (error, vars, context) => {
          console.error(error, vars, context);
        },
      });
    }

    // Clear dragged items after processing
    setDraggedItems([]);
  }, [draggedItems, setDraggedItems, patchGarden]);

  return (
    <Tree
      data={treeData}
      openByDefault={false}
      onSelect={(selectedNodes) => {
        if (selectedNodes[0]) {
          const node = selectedNodes[0];
          // Extract the actual entity from the node data
          const entity = node.data.garden || node.data.func;
          if (entity && onItemSelected) {
            onItemSelected(entity);
          }
        }
      }}
      selection={selectedNodeId}
      onMove={handleDrop}
      onActivate={(node) => {
        if (node.data.id.startsWith('function-')) {
          setDraggedItems([node]);
        }
      }}
    >
      {Node}
    </Tree>
  );
};