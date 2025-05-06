// components/TaskModal.js
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export default function TaskModal({ task, onClose, onComplete }) {
    const { t } = useTranslation("common");
    const { locale } = useRouter();
    const [user, setUser] = useState("riccardo");
    const [busy, setBusy] = useState(false);

    const name = locale === "it" ? task.name_it : task.name_de;

    const save = async () => {
        setBusy(true);
        await supabase.from("completions").insert({ task_id: task.id, user });
        setBusy(false);
        onComplete();
        onClose();
    };

    return (
        <Modal show onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{name}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="d-flex flex-column gap-2">
                {["riccardo", "stefan", "beide"].map((u) => (
                    <Button
                        key={u}
                        variant={u === user ? "primary" : "outline-secondary"}
                        onClick={() => setUser(u)}
                    >
                        {t(u)}
                    </Button>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="success"
                    className="w-100"
                    onClick={save}
                    disabled={busy}
                >
                    {busy ? <Spinner size="sm" /> : t("completed")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
