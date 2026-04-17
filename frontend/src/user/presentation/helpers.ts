import type {SlideType} from "../PresentaionType.ts";

export function createId() {
  return String(Date.now());
}

export function createEmptySlide(): SlideType {
  return {
    id: createId(),
    elements: [],
  };
}

export function getSaveStatusText(isBusy: boolean, hasUnsavedChanges: boolean): string {
  if (isBusy) return 'Saving...';
  if (hasUnsavedChanges) return 'Unsaved changes';
  return 'All changes saved';
}