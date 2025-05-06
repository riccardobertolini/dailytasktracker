// pages/tasks.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Plus, Trash2 } from "lucide-react";
import TaskModal from "../components/TaskModal";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

export default function Tasks() {
    const { t } = useTranslation("common");
    const { locale } = useRouter();

    /* state */
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ it: "", de: "" });
    const [saving, setSaving] = useState(false);

    /* fetch */
    const fetchTasks = async () => {
        const { data, error } = await supabase
            .from("tasks")
            .select("id, name_it, name_de")
            .order("created_at");
        error ? console.error(error) : null;
        setTasks(data || []);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    /* add */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.it.trim() || !form.de.trim()) return;
        setSaving(true);
        const { error } = await supabase.from("tasks").insert({
            name_it: form.it.trim(),
            name_de: form.de.trim(),
        });
        error && console.error(error);
        setSaving(false);
        setShowForm(false);
        setForm({ it: "", de: "" });
        fetchTasks();
    };

    /* delete */
    const deleteTask = async (id) => {
        await supabase.from("tasks").delete().eq("id", id);
        fetchTasks();
    };

    /* helpers */
    const label = (t) => (locale === "it" ? t.name_it : t.name_de);

    return (
        <div className="container-sm py-4 pb-5 min-vh-100 position-relative">
            <h1 className="h4 text-center mb-4">{t("tasks_title")}</h1>

            {tasks.length === 0 ? (
                <p className="text-center text-muted">{t("no_tasks")}</p>
            ) : (
                <ListGroup className="mb-5">
                    {tasks.map((task) => (
                        <ListGroup.Item
                            key={task.id}
                            className="d-flex justify-content-between align-items-center"
                        >
                            {label(task)}
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => deleteTask(task.id)}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            <Button
                variant="primary"
                className="position-fixed end-0 m-4 rounded-circle p-0 d-flex align-items-center justify-content-center shadow"
                style={{ width: "56px", height: "56px", bottom: 60, right: 10 }}
                onClick={() => setShowForm(true)}
            >
                <Plus size={28} />
            </Button>

            <Modal show={showForm} onHide={() => setShowForm(false)} centered>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t("add_task")}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome (Italiano)</Form.Label>
                            <Form.Control
                                value={form.it}
                                onChange={(e) => setForm({ ...form, it: e.target.value })}
                                placeholder="..."
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Name (Schwiiz‑Dütsch)</Form.Label>
                            <Form.Control
                                value={form.de}
                                onChange={(e) => setForm({ ...form, de: e.target.value })}
                                placeholder="..."
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowForm(false)}>
                            {t("cancel")}
                        </Button>
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? <Spinner size="sm" /> : t("add_task")}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
}
