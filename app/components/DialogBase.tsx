import {Dialog, DialogBackdrop, DialogPanel, DialogTitle,} from "@headlessui/react";

export default function DialogBase({
  open,
  onClose,
  title,
  children,
  actions,
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white rounded p-6 shadow-xl max-w-sm w-full">
          {title && (
            <DialogTitle className="text-xl font-bold">
              {title}
            </DialogTitle>
          )}

          <div className="mt-2 text-gray-600">
            {children}
          </div>

          <div className="mt-4 flex gap-2 justify-end">
            {actions}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
