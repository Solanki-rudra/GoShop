import { Button } from "antd";

export const CustomModal = ({ isOpen, title, children, onConfirm, onCancel }: { isOpen: boolean, title: string, children: React.ReactNode, onConfirm: () => void, onCancel: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-600/50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div className="mb-6">{children}</div>
                <div className="flex justify-end gap-3">
                    <Button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</Button>
                    <Button danger onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">Confirm</Button>
                </div>
            </div>
        </div>
    );
};