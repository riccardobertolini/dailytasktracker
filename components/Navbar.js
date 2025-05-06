// components/Navbar.js
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Home, Clock, BarChart2, PieChart } from "lucide-react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default function BottomBar() {
    const { t } = useTranslation("common");
    const { pathname } = useRouter();

    const tabs = [
        { href: "/",         icon: Home,      label: t("nav_home")      },
        { href: "/tasks",    icon: Clock,     label: t("nav_tasks")     },
        { href: "/analytics",href: "/analytics", icon: BarChart2, label: t("nav_analytics") },
        { href: "/stats",    icon: PieChart,  label: t("nav_stats")     },
    ];

    return (
        <Navbar
            bg="white"
            className="border-top shadow-sm fixed-bottom"
            style={{ height: "65px", backdropFilter: "blur(6px)" }}
        >
            <Nav className="mx-auto w-100 d-flex justify-content-around">
                {tabs.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href;
                    return (
                        <Link key={href} href={href} passHref legacyBehavior>
                            <Nav.Link
                                className={
                                    "d-flex flex-column align-items-center gap-1 small" +
                                    (active ? " text-primary fw-semibold active" : " text-muted")
                                }
                            >
                                <Icon size={22} strokeWidth={2.2} />
                                {label}
                            </Nav.Link>
                        </Link>
                    );
                })}
            </Nav>
        </Navbar>
    );
}
