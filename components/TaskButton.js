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
                className="btn text-light"
                onClick={() => setOpen(true)}
                style={{marginRight: 5, marginBottom: 5, height: 70, fontSize: 14, maxWidth: '50%'}}
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
