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
                className="btn btn-lg text-light"
                onClick={() => setOpen(true)}
                style={{marginRight: 20, marginBottom: 20, height: 80}}
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
