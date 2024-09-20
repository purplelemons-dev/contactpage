<script lang="ts">
	import { onMount } from "svelte";

	export let data;

	let auth_token: string = "";

	onMount(async () => {
		const token = document.cookie
			.split("; ")
			.find((row) => row.startsWith("auth_token="))
			?.split("=")[1];
		if (token) {
			auth_token = token;
			authTokenSet = true;
		}
	});

	let authTokenSet = false;

	const saveToken = async () => {
		if (auth_token) {
			const time = new Date();
			// 180 days
			time.setTime(time.getTime() + 180 * 24 * 60 * 60 * 1000);
			const formattedTime = time.toUTCString();
			document.cookie = `auth_token=${auth_token}; Expires=${formattedTime}; path=/`;
			authTokenSet = true;
			location.reload();
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
				authTokenSet = true;
			}
		}}
		id="auth-token"
	/>
	<button on:click={saveToken}>Submit</button>
{:else}
	<div class="topbar">
		<button
			on:click={() => {
				auth_token = "";
				document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
				auth_token = "";
				authTokenSet = false;
				location.reload();
			}}
		>
			signout
		</button>
	</div>
	<div class="dashboard">
		<h1>{data.currentEmoji}</h1>
		<h3>{data.status}</h3>
	</div>
	<div>
		<h4>Logins</h4>
		<table>
			<tr>
				<th>Time</th>
				<th>IP</th>
				<th
					><div style="color: greenyellow;">S</div>
					/
					<div style="color: red;">F</div></th
				>
				<th>Total #</th>
				<th>Type</th>
			</tr>
			{#each Object.entries(data.loginIPs) as [ip, login]}
				<tr>
					<td>{login.time}</td>
					<td>{ip}</td>
					<td
						><div style="color: greenyellow;">{login.success}</div>
						/
						<div style="color: red;">{login.success - login.count}</div></td
					>
					<td>{login.count}</td>
					<td>{login.type}</td>
				</tr>
			{/each}
		</table>
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
