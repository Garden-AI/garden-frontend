import React, { useState, useCallback, useMemo } from "react";
import { Tree, NodeRendererProps, NodeApi, MoveHandler } from 'react-arborist';

import { ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { useGetGardens } from '@/features/gardens/api/useGetGardens';
import { usePatchGarden } from "@/features/gardens/api/usePatchGarden";
import { useGlobusAuth } from '@globus/react-auth-context';
import { ModalFunction } from "@/types";

export const ComponentPlayground = () => {
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [draggedItems, setDraggedItems] = useState([]);

  const auth = useGlobusAuth();
  const { data: myGardens } = useGetGardens({ owner_uuid: auth.authorization?.user?.sub });
  const { data: publishedGardens } = useGetGardens({ draft: false });

  const handleSetDraggedItems = useCallback((items) => {
    setDraggedItems(items);
  }, []);

  return (
    <div>
      <p>Selected Item: {selectedItem?.data.name}</p>
      <p>Dragged Items: {draggedItems.length} items</p>
      <div className="flex">
        <div className="border p-2 m-2">
          <h3>My Gardens</h3>
          <GardenTree
            gardens={myGardens}
            selectedItem={selectedItem}
            onItemSelected={setSelectedItem}
            draggedItems={draggedItems}
            setDraggedItems={handleSetDraggedItems}
          />
        </div>
        <div className="border p-2 m-2">
          <h3>Published Gardens</h3>
          <GardenTree
            gardens={publishedGardens}
            selectedItem={selectedItem}
            onItemSelected={setSelectedItem}
            draggedItems={draggedItems}
            setDraggedItems={handleSetDraggedItems}
          />
        </div>
      </div>
    </div>
  );
}

const GardenTree = ({ gardens, selectedItem, onItemSelected, draggedItems, setDraggedItems }) => {
  const { mutate: patchGarden } = usePatchGarden();

  const treeData = useMemo(() => {
    return gardens?.map((g) => {
      return {
        id: `garden-${g.doi}`,
        name: g.title,
        garden: g,
        children: g.modal_functions?.map((fn) => {
          return {
            id: `function-${fn.id}-garden-${g.doi}`,
            name: fn.title,
            func: fn,
          };
        })
      };
    });
  }, [gardens]);

  const handleDrop = (mh: MoveHandler) => {
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
  }


  return (
    <Tree
      data={treeData}
      openByDefault={false}
      onSelect={(selectedNodes) => onItemSelected(selectedNodes[0])}
      selection={selectedItem}
      onMove={handleDrop}
      onActivate={(node) => {
        if (node.data.id.startsWith('function-')) {
          setDraggedItems([node]);
        }
      }}
    >
      {Node}
    </Tree >
  );
}

const Node = ({ node, style, dragHandle }: NodeRendererProps<NodeApi>) => {

  const handleSelect = () => {
    node.isSelected ? node.deselect() : node.select();
  }

  const handleExpand = () => {
    node.toggle();
  }

  const NodeKind = (() => {
    return node.data.id.startsWith("garden") ? GardenNode
      : node.data.id.startsWith("function") ? FunctionNode
        : node.data.id.startsWith("deployment") ? DeploymentNode
          // Shouldn't happen, but here for completeness
          : UknownNode
  })();

  return (
    <div style={style} ref={dragHandle} className="gap-2">
      <NodeKind
        node={node}
        onSelect={handleSelect}
        onExpand={handleExpand}
      />
    </div>
  )
}

const selectedStyle = "border-red-400 border-2"

const GardenNode = ({ node, onSelect, onExpand }) => {
  const Chevron = node.isOpen ? ChevronDown : ChevronRight;
  node.isDropTarget = true;

  return (
    <div
      className={`flex items-center justify-start truncate rounded-md ${node.isSelected ? selectedStyle : ""} ${node.willReceiveDrop ? 'bg-blue-100 border-blue-300 border-2' : ''}`}
      onClick={onSelect}
    >
      <Chevron className="rounded-sm hover:bg-brightgreen" size={16} onClick={onExpand} />
      <p className={`ml-2 ${node.isSelected ? "font-bold" : ""}`}>{node.data.name}</p>
    </div>
  );
}

const FunctionNode = ({ node }) => {
  node.isDraggable = true;
  node.isDropTarget = false;

  return (
    <div className="flex">
      <p className={`${node.isSelected ? `font-bold ${selectedStyle}` : ""}`}>- {node.data.name}</p>
    </div>
  )
}

const DeploymentNode = ({ node }) => {
  return (
    <p>{node.data.name}</p>
  )
}

const UknownNode = ({ node }) => {
  return (
    <p>{node.data.name}</p>
  )
}
