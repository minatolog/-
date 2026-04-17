import type { PresentationType } from "../PresentaionType.ts";

type NewPresentationDialogProps = {
  onClose: () => void;
  onCreated: (_newPresentation: PresentationType) => void | Promise<void>;
  onError: (_message: string) => void;
};

export default function NewPresentationDialog({
  onClose,
  onCreated,
  onError,
}: NewPresentationDialogProps) {
  void onClose;
  void onCreated;
  void onError;

  return (
    <div>
      New Presentation Dialog
    </div>
  )
}
