import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Analytics() {
    const { t } = useTranslation('common');
    const [byDay, setByDay] = useState({});

    const fetchData = async () => {
        let { data: comps } = await supabase
            .from('completions')
            .select('*, tasks(name)')
            .order('completed_at', { ascending: false });

        const grouped = {};
        const totals = {};

        comps?.forEach(c => {
            const day = new Date(c.completed_at).toLocaleDateString('it-IT', {
                day:'2-digit', month:'long', year:'numeric'
            });
            grouped[day] = grouped[day] || [];
            grouped[day].push({
                name: c.tasks.name,
                user: t(c.user),
                time: new Date(c.completed_at).toLocaleTimeString('it-IT', {hour:'2-digit',minute:'2-digit'})
            });

            const key = c.tasks.name;
            totals[key] = totals[key] || { riccardo:0, stefan:0, beide:0 };
            totals[key][c.user]++;
        });

        setByDay({ grouped, totals });
    };

    useEffect(() => { fetchData() }, []);

    return (
        <div className="min-h-screen p-4 max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t('analytics_title')}</h1>
            {Object.entries(byDay.grouped || {}).map(([day, entries])=>(
                <div key={day} className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">{day}</h2>
                    <ul className="space-y-1">
                        {entries.map((e,i)=>(
                            <li key={i} className="flex justify-between">
                                <span>• {e.name} - {e.user}</span>
                                <span>{e.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <div className="border-t pt-4">
                {Object.entries(byDay.totals || {}).map(([task, counts])=>(
                    <p key={task} className="mb-2">
                        <strong>{task}</strong> – {t('riccardo')}: {counts.riccardo}, {t('stefan')}: {counts.stefan}, {t('beide')}: {counts.beide}
                    </p>
                ))}
            </div>
        </div>
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common']))
        }
    };
}
