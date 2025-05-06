// pages/_app.js
import "bootstrap/dist/css/bootstrap.min.css";
import { appWithTranslation } from "next-i18next";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
    return (
        <div className="d-flex flex-column min-vh-100 bg-white">

            <main className="flex-fill container-sm pt-3 pb-5">
                <Component {...pageProps} />
            </main>

            <Navbar />
        </div>
    );
}

export default appWithTranslation(MyApp);
