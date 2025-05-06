import { useRouter } from "next/router";

export default function FlagSwitcher() {
    const { locale, pathname, query } = useRouter();
    const router = useRouter();

    const nextLocale = locale === "it" ? "de" : "it";
    const flag      = locale === "it" ? "🇨🇭" : "🇮🇹";

    const switchLocale = () =>
        router.push({ pathname, query }, undefined, { locale: nextLocale });

    return (
        <button
            onClick={switchLocale}
            className="btn btn-link fs-3 p-0 lh-1 text-decoration-none"
            aria-label="Switch language"
        >
            {flag}
        </button>
    );
}
