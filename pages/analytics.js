import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

export default function Analytics() {
    const { t } = useTranslation("common");
    const { locale } = useRouter();
    const [data, setData] = useState({ grouped: {}, totals: {} });

    /* -- fetch --------------------------------------- */
    const fetchData = async () => {
        const { data: comps, error } = await supabase
            .from("completions")
            .select("task_id, user, completed_at, tasks(name_it, name_de)")
            .order("completed_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        /* -- transform --------------------------------- */
        const grouped = {};
        const totals  = {};

        comps.forEach((c) => {
            const taskName = locale === "it" ? c.tasks.name_it : c.tasks.name_de;
            const dayKey = new Date(c.completed_at).toLocaleDateString(locale, {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });

            /* elenco per giorno */
            grouped[dayKey] ??= [];
            grouped[dayKey].push({
                name: taskName,
                user: t(c.user),
                time: new Date(c.completed_at).toLocaleTimeString(locale, {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            });

            /* contatori totali */
            totals[taskName] ??= { riccardo: 0, stefan: 0, beide: 0 };
            totals[taskName][c.user]++;
        });

        setData({ grouped, totals });
    };

    useEffect(() => {
        fetchData();
    }, [locale]);

    return (
        <div className="container-sm py-4 pb-5 min-vh-100">
            <h1 className="h4 mb-4 text-center">{t("analytics_title")}</h1>

            {/* blocchi per giorno */}
            {Object.entries(data.grouped).map(([day, entries]) => (
                <Card key={day} className="mb-4">
                    <Card.Header className="fw-semibold">{day}</Card.Header>
                    <Table borderless size="sm" className="mb-0">
                        <tbody>
                        {entries.map((e, i) => (
                            <tr key={i}>
                                <td className="ps-3">{e.name}</td>
                                <td>{e.user}</td>
                                <td className="text-end pe-3">{e.time}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card>
            ))}

            <h2 className="h6 mt-4 mb-2">{t("totals")}</h2>
            {Object.entries(data.totals).map(([task, counts]) => (
                <p key={task} className="mb-2">
                    <strong>{task}</strong>{" "}
                    <Badge bg="primary" className="me-1">
                        {t("riccardo")}: {counts.riccardo}
                    </Badge>
                    <Badge bg="secondary" className="me-1">
                        {t("stefan")}: {counts.stefan}
                    </Badge>
                    <Badge bg="success">
                        {t("beide")}: {counts.beide}
                    </Badge>
                </p>
            ))}
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
