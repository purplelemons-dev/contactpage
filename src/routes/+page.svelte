<script lang="ts">
	import { onMount } from "svelte";

	import { vCard } from "$lib/vcard";

	$: emojiList = [];
	let infoData: {
		name: string;
		email: string;
		workEmail: string;
		phone: string;
		timezone: string;
		languages: string[];
		url: string;
		gender: string;
		publickey: string;
	};

	onMount(async () => {
		emojiList = await fetch("/api/v1/emojis", {
			headers: { accept: "application/json" }
		}).then(async (res) => {
			if (res.ok) {
				return res.json();
			} else if (res.status === 429) {
				const ip = await fetch("https://api.ipify.org").then((res) => res.text());
				alert(`You (${ip}) are being rate limited`);
				return [];
			} else {
				throw new Error("Failed to fetch emojis, but we aren't being rate-limited");
			}
		});
	});

	const checkEmoji = async (selectedEmoji: string) => {
		if (selectedEmoji === "") {
			alert("Please select an emoji");
			throw new Error("No emoji selected");
		} else {
			const data: {
				matches: boolean;
				uuid: string;
			} = await fetch(`/api/v1/auth`, {
				headers: { accept: "application/json", "content-type": "application/json" },
				method: "POST",
				body: JSON.stringify({ selectedEmoji })
			}).then((res) => res.json());

			if (data.matches) {
				const info: HTMLDivElement | null = document.querySelector(".info");
				const emojiSelector: HTMLDivElement | null = document.querySelector(".emoji-selector");
				if (info && emojiSelector) {
					info.hidden = false;
					emojiSelector.hidden = true;
					// do fetch to /api/v1/info/{uuid}
					infoData = await fetch(`/api/v1/info/${data.uuid}`, {
						headers: { accept: "application/json" }
					}).then((res) => res.json());

					const VFC = vCard.create(vCard.Version.FOUR);
					VFC.addFormattedname(infoData.name);
					VFC.addEmail(infoData.email, vCard.Type.MAIN);
					VFC.addEmail(infoData.workEmail, vCard.Type.WORK);
					VFC.addPhone(infoData.phone, vCard.Type.CELL);
					VFC.addTimezone(infoData.timezone);
					for (const lang of infoData.languages) {
						VFC.addLanguage(lang);
					}
					VFC.addUrl(infoData.url);
					VFC.addGender(infoData.gender);
					VFC.addPubkey(infoData.publickey);

					vCard.export(VFC, infoData.name.replaceAll(" ", ""), true);
				}
			} else {
				alert("Wrong! Did you try to visit my contact page without my permission?");
				window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
			}
		}
	};
</script>

<title>Josh Smith - Contact</title>

<div class="emoji-selector">
	{#each emojiList as emoji}
		<button
			class="emoji"
			on:click={() => {
				checkEmoji(emoji);
			}}>{emoji}</button
		>
	{/each}
</div>
<div class="info" hidden>
	{#if infoData}
		<table>
			{#each Object.entries(infoData) as [key, value]}
				<tr>
					<td>{key}</td>
					<td>{value}</td>
				</tr>
			{/each}
		</table>
	{/if}
</div>

<style>
	div.emoji-selector {
	}

	button.emoji {
		font-size: 2rem;
		margin: 0.5rem;
	}

	div.info {
	}
</style>
