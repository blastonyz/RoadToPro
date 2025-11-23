"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Wallet = {
  address: string;
  network?: string | null;
  currency?: string | null;
  isDefault?: boolean | null;
};

export function WalletSummary({ viewDetails = true }: { viewDetails?: boolean }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loadingWallets, setLoadingWallets] = useState(true);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [estimatedUsdt, setEstimatedUsdt] = useState<number>(0);

  async function fetchCoingeckoPrices(): Promise<Record<string, number>> {
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=polkadot,moonbeam,ethereum,tether&vs_currencies=usd";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("price_fetch_failed");
    const data = (await res.json()) as Record<string, { usd: number }>;
    return {
      polkadot: data?.polkadot?.usd ?? 0,
      moonbeam: data?.moonbeam?.usd ?? 0,
      ethereum: data?.ethereum?.usd ?? 0,
      tether: data?.tether?.usd ?? 1,
    };
  }

  async function getEvmNativeBalance(rpcUrl: string, address: string): Promise<bigint> {
    const body = {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [address, "latest"],
    };
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("evm_balance_failed");
    const json = await res.json();
    const hex = json?.result as string;
    return BigInt(hex ?? "0x0");
  }

  async function getPolkadotBalance(address: string): Promise<bigint> {
    try {
      const resp = await fetch(`https://api.dotscan.com/api/v1/account/${address}`, {
        headers: { Accept: "application/json" },
      });
      if (!resp.ok) throw new Error("dotscan_failed");
      const data = await resp.json();
      const free = BigInt(data?.data?.balance?.free ?? 0);
      return free;
    } catch {
      return BigInt(0);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await api.auth.listWallets();
        if (mounted) setWallets(Array.isArray(list) ? list : []);
      } catch {
        if (mounted) setWallets([]);
      } finally {
        if (mounted) setLoadingWallets(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (wallets.length === 0) {
        setEstimatedUsdt(0);
        return;
      }
      setLoadingBalances(true);
      try {
        const prices = await fetchCoingeckoPrices();
        const totals = await Promise.all(
          wallets.map(async (w) => {
            const net = (w.network || "").toLowerCase();
            try {
              if (net.includes("moonbeam")) {
                const isDev = process.env.NODE_ENV !== "production";
                const wei = await getEvmNativeBalance(
                  isDev ? "https://spicy-rpc.chiliz.com/" : "https://spicy-rpc.chiliz.com/",
                  w.address
                );
                const glmr = Number(wei) / 1e18;
                let usd = 0;
                if (isDev) {
                  const devAmount = glmr;
                  usd = devAmount * 100;
                } else {
                  usd = glmr * (prices.moonbeam ?? 0);
                }
                return usd;
              }
              if (net.includes("ethereum") || (w.address.startsWith("0x") && !net)) {
                const wei = await getEvmNativeBalance("https://cloudflare-eth.com", w.address);
                const eth = Number(wei) / 1e18;
                const usd = eth * (prices.ethereum ?? 0);
                return usd;
              }
              if (net.includes("polkadot") || (!w.address.startsWith("0x") && !net)) {
                const plancks = await getPolkadotBalance(w.address);
                const dot = Number(plancks) / 1e10;
                const usd = dot * (prices.polkadot ?? 0);
                return usd;
              }
              return 0;
            } catch {
              return 0;
            }
          })
        );
        if (!mounted) return;
        const totalUsd = totals.reduce((a, b) => a + b, 0);
        const usdtPerUsd = (prices.tether ?? 1) > 0 ? 1 / (prices.tether ?? 1) : 1;
        setEstimatedUsdt(totalUsd * usdtPerUsd);
      } catch {
        if (!mounted) return;
        setEstimatedUsdt(0);
      } finally {
        if (mounted) setLoadingBalances(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [wallets]);

  return (
    <div className="bg-black text-white p-6 rounded-2xl">
      <p className="text-gray-400 text-sm uppercase tracking-wider mb-3">Tu Wallet</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm">Total estimado</p>
          <p className="text-3xl font-bold">
            {loadingBalances ? "Calculando..." : `${estimatedUsdt.toFixed(2)} USDT`}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Wallets conectadas</p>
          <p className="text-2xl font-bold">{loadingWallets ? "-" : wallets.length}</p>
        </div>
      </div>
      
      {viewDetails && (
        <Link href="/dashboard/wallet" className="cursor-pointer inline-flex items-center justify-center gap-2 w-full mt-4 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
          Ver detalles
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}


