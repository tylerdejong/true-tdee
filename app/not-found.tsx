import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="container not-found">
      <span className="section-kicker">TrueTDEE</span>
      <h1>Page not found</h1>
      <p>The calculator you are looking for is not available.</p>
      <Link className="hero-link" href="/true-tdee-calculator">
        Go to the True TDEE Calculator
      </Link>
    </main>
  );
}
