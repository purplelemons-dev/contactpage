<script lang="ts">
	import { onMount } from 'svelte';

	$: emojiList = [];

	onMount(async () => {
		emojiList = await fetch('/api/v1/emojis', {
			headers: { accept: 'application/json' }
		}).then((res) => res.json());
	});

	const checkEmoji = async (selectedEmoji: string) => {
		if (selectedEmoji === '') {
			alert('Please select an emoji');
			throw new Error('No emoji selected');
		} else {
			const data: {
				auth: boolean;
			} = await fetch(`/api/v1/auth?emoji=${selectedEmoji}`, {
				headers: { accept: 'application/json' }
			}).then((res) => res.json());

			if (data.auth) {
				
			} else {
				alert('Wrong! Did you try to visit my contact page without my permission?');
			}
		}
	};
</script>

<title>Josh Smith - Contact</title>

<main>
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
	<div class="info" hidden></div>
</main>

<style>
	div.emoji-selector {
	}

	button.emoji {
	}

	div.info {
	}
</style>
