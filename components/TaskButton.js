// components/TaskButton.js
import { useState } from "react";
import { useRouter } from "next/router";
import TaskModal from "./TaskModal";
import Button from "react-bootstrap/Button";

export default function TaskButton({ task, onDone }) {
    const [open, setOpen] = useState(false);
    const { locale } = useRouter();
    const label = locale === "it" ? task.name_it : task.name_de;

    return (
        <>
            <Button
                variant="outline-success"
                className="w-100 py-3 mb-3 rounded-pill fs-6"
                onClick={() => setOpen(true)}
            >
                {label}
            </Button>

            {open && (
                <TaskModal
                    task={task}
                    onClose={() => setOpen(false)}
                    onComplete={onDone}
                />
            )}
        </>
    );
}
