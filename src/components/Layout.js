import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="logo"><Link href="/">DataMarket</Link></div>

        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/datasets">Browse Datasets</Link></li>
        </ul>

        <button className="connect-wallet">Connect Wallet</button>
      </nav>

      <main>{children}</main>
    </div>
  );
}
