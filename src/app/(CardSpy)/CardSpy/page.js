"use client";

import { useState, useEffect } from "react";

export default function CardSpyPage() {
	const [player, setPlayer] = useState("");
	const [clan, setClan] = useState("");
	const [deck, setDeck] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// WAKE UP THE API HOSTED ON RENDER FREE TIER
	useEffect(() => {
		console.log("Waking up api")
		fetch("https://cardspy-api.onrender.com/deck", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				player: "__wakeup__",
				clan: "__wakeup__",
			}),
		}).catch(() => {
			// ignored
		});
	}, []);

	async function fetchDeck() {
		setLoading(true);
		setError(null);
		setDeck(null);

		try {
			const res = await fetch("https://cardspy-api.onrender.com/deck", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					player,
					clan,
				}),
			});

			if (!res.ok) {
				throw new Error(`HTTP ${res.status}`);
			}

			const data = await res.json();

			if (!data.deck || data.deck.length === 0) {
				setError("Could not find deck. If you typed in everything correctly, YOU MIGHT BE PLAYING A BOT (they are a bot if their clan disappears in battle log and they are xp level 42)")
			}

			setDeck(data.deck);

		} catch (err) {
			setError("Could not fetch deck");
		} finally {
			setLoading(false);
		}
	}

	return (
	<div className="max-w-xl mx-auto p-6">
		<h1 className="text-4xl font-bold mb-2">CardSpy</h1>

		<p className="text-sm text-gray-600 mb-6">
		Spies on the opponent’s last competitive match deck.
		<br />
		Enter the opponent’s player name and clan name exactly as you see it
		<span className="font-medium"> (case sensitive)</span>.
		</p>

		<div className="space-y-3">
		<input
			className="w-full border rounded px-3 py-2"
			placeholder="Player name"
			value={player}
			onChange={e => setPlayer(e.target.value)}
		/>

		<input
			className="w-full border rounded px-3 py-2"
			placeholder="Clan name"
			value={clan}
			onChange={e => setClan(e.target.value)}
		/>

		<button
			onClick={fetchDeck}
			disabled={loading}
			className="w-full bg-black text-white py-2 rounded"
		>
			{loading ? "Loading..." : "Find Deck"}
		</button>
		</div>

		{error && (
		<p className="text-red-500 mt-4">{error}</p>
		)}

		{deck && (
		<div className="grid grid-cols-4 gap-2 mt-6">
			{deck.map(card => (
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