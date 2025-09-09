import { useRef, useState, RefObject } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

export function usePanelExpansion(panelRefs: Record<string, RefObject<ImperativePanelHandle>>) {
  const [lastExpanded, setLastExpanded] = useState<RefObject<ImperativePanelHandle> | null>(null);

  const handlePanelExpand = (selected: RefObject<ImperativePanelHandle>) => {
    if (selected === lastExpanded) {
      // evenly resize the panels, return to default
      Object.values(panelRefs).forEach(p => 
        p.current?.resize(100 / Object.keys(panelRefs).length)
      );
      setLastExpanded(null);
      return;
    }
    
    // expand the selected panel, shrink the others
    Object.values(panelRefs).forEach(p => {
      if (p === selected) {
        p.current?.resize(80);
        setLastExpanded(p);
      } else {
        p.current?.resize(10);
      }
    });
  };

  return {
    handlePanelExpand,
    lastExpanded
  };
}

export function createPanelRefs<T extends string>(panelNames: readonly T[]) {
  const refs: Record<T, RefObject<ImperativePanelHandle>> = {} as any;
  panelNames.forEach(name => {
    refs[name] = useRef<ImperativePanelHandle>(null);
  });
  return refs;
}