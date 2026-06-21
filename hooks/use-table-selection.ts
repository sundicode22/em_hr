"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export function useTableSelection(rowIds: string[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelected((prev) => {
      const next = new Set([...prev].filter((id) => rowIds.includes(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [rowIds]);

  const allSelected = useMemo(
    () => rowIds.length > 0 && rowIds.every((id) => selected.has(id)),
    [rowIds, selected],
  );

  const someSelected = useMemo(
    () => rowIds.some((id) => selected.has(id)) && !allSelected,
    [rowIds, selected, allSelected],
  );

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (rowIds.every((id) => prev.has(id))) {
        return new Set();
      }
      return new Set(rowIds);
    });
  }, [rowIds]);

  const toggleRow = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isSelected = useCallback((id: string) => selected.has(id), [selected]);

  return {
    selected,
    allSelected,
    someSelected,
    toggleAll,
    toggleRow,
    isSelected,
    selectedCount: selected.size,
  };
}
