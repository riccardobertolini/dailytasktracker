import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import TaskButton from "../components/TaskButton";
import FlagSwitcher from "../components/FlagSwitcher";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Home() {
    const { t } = useTranslation("common");
    const [tasks, setTasks] = useState([]);

    /* fetch */
    const fetchTasks = async () => {
        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .order("created_at", { ascending: true });

        error ? console.error(error) : null;
        setTasks(data || []);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
    <div className="min-vh-100 container-sm py-4">

        <header className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h4 m-0">{t("home_title")}</h1>
            <FlagSwitcher />
        </header>

        {tasks.length === 0 ? (
            <p className="text-center text-muted">{t("no_tasks")}</p>
        ) : (
            tasks.map((task) => (
                <TaskButton key={task.id} task={task} onDone={fetchTasks} />
            ))
        )}
    </div>
);
}

/* i18n static props */
export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
}
