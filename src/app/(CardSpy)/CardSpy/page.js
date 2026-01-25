"use client";

import { useState, useEffect } from "react";

export default function CardSpyPage() {
  const [player, setPlayer] = useState("");
  const [clan, setClan] = useState("");
  const [mode, setMode] = useState("ranked"); // "ranked" | "trophy"
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Map UI mode -> backend game_type
  const gameType = mode === "ranked" ? "pathOfLegend" : "PvP";

  // WAKE UP THE API HOSTED ON RENDER FREE TIER
  useEffect(() => {
    console.log("Waking up api");
    fetch("https://cardspy-api.onrender.com/deck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player: "__wakeup__",
        clan: "__wakeup__",
        game_type: "PvP",
      }),
    }).catch(() => {
      // ignored
    });
  }, []);

  async function fetchDeck() {
    setLoading(true);
    setError(null);
    setDeck(null);

    setPlayer(player.trim());
    setClan(clan.trim());

    if (!player || !clan) {
      setError("Missing player or clan");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://cardspy-api.onrender.com/deck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player: player.trim(),
          clan: clan.trim(),
          game_type: gameType,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!data.deck || data.deck.length === 0) {
        setError(
          "Could not find deck. If you typed in everything correctly, YOU MIGHT BE PLAYING A BOT (they are a bot if their clan disappears in battle log and they are xp level 42)"
        );
      }

      setDeck(data.deck);
    } catch (err) {
      setError("Could not fetch deck");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-12">
      <h1 className="text-5xl text-stone-800 text-center font-bold mb-4">CardSpy</h1>

      <p className="text-sm text-gray-600 mb-4">
        Spies on the opponent’s last competitive match deck.
        <br />
        Enter the opponent’s player name and clan name exactly as you see it
        <span className="font-medium"> (case sensitive)</span>.
      </p>

      {/* Icon-only toggle (smaller) */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode("ranked")}
          className={`p-1 rounded-md transition hover:scale-105 hover:opacity-100
            ${mode === "ranked" ? "ring-2 ring-black" : "opacity-50"}
          `}
          aria-label="Ranked (Path of Legends)"
        >
          <img
            src="/ranked.png"
            alt="Ranked"
            className="w-8 h-8 select-none"
            draggable={false}
          />
        </button>

        <button
          type="button"
          onClick={() => setMode("trophy")}
          className={`p-1 rounded-md transition hover:scale-105 hover:opacity-100
            ${mode === "trophy" ? "ring-2 ring-black" : "opacity-50"}
          `}
          aria-label="Trophy Road (PvP)"
        >
          <img
            src="/trophy.png"
            alt="Trophy Road"
            className="w-8 h-8 select-none"
            draggable={false}
          />
        </button>
      </div>

      <div className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Player name"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Clan name"
          value={clan}
          onChange={(e) => setClan(e.target.value)}
        />

        <button
          onClick={fetchDeck}
          disabled={loading}
          className="w-full bg-stone-900 hover:bg-stone-800 text-white py-2 rounded"
        >
          {loading ? "Loading..." : "Find Deck"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {deck && (
        <div className="grid grid-cols-4 mt-6">
          {deck.map((card) => (
            <img
              key={card.name}
              src={card.img}
              alt={card.name}
              className="w-full rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
}
