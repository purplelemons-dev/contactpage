<script lang="ts">
	import { onMount } from "svelte";

	let auth_token: string | null = null;
	let url: string | null = null;

	onMount(() => {
		auth_token = localStorage.getItem("auth_token");
		url = window.location.pathname;
	});

	let authTokenSet = auth_token !== null;

	const saveToken = async () => {
		if (auth_token) {
			localStorage.setItem("auth_token", auth_token);
			authTokenSet = true;
		}
	};

	const emoji = async () => {
		if (url && auth_token) {
			return await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ auth_token })
			})
				.then(async (res) => {
					if (res.ok) {
						return (await res.json()) as { currentEmoji: string };
					}
					throw new Error("Failed to fetch");
				})
				.catch((err) => {
					console.error(err);
					auth_token = null;
					localStorage.removeItem("auth_token");
					authTokenSet = false;
					return { currentEmoji: null, err };
				});
		}
	};

	// TODO: add a way to revoke or modify ip rate limit time
</script>

<title>Login</title>

{#if !authTokenSet}
	<input
		type="password"
		name="auth-token"
		bind:value={auth_token}
		on:keypress={(e) => {
			if (e.key === "Enter") {
				saveToken();
			}
		}}
		id="auth-token"
	/>
	<button on:click={saveToken}>Submit</button>
{:else}
	<div class="topbar">
		<button
			on:click={() => {
				auth_token = null;
				localStorage.removeItem("auth_token");
				authTokenSet = false;
				location.reload();
			}}
		>
			signout
		</button>
	</div>
	<div class="dashboard">
		<h1>
			{#await emoji()}
				<p>loading...</p>
			{:then data}
				{data?.currentEmoji}
			{:catch error}
				<p>{error}</p>
			{/await}
		</h1>
	</div>
{/if}

<style>
	:host {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		font-size: 1rem;
	}
	button {
		font-size: 1rem;
		size: 1rem;
	}
</style>
