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
	<div class="container">
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
	</div>
{:else}
	<div class="container">
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
			<div class="emoji-container">
				<h1>{data.currentEmoji}</h1>
			</div>
			<h3>{data.status}</h3>
			<div class="table-container">
				<table>
					<tr>
						<th>Time</th>
						<th>IP</th>
						<th>
							<div class="success">S</div>
							/
							<div class="failure">F</div>
						</th>
						<th>Total #</th>
						<th>Type</th>
					</tr>
					{#each Object.entries(data.loginIPs) as [ip, login]}
						<tr>
							<td>{new Date(login.time).toLocaleString()}</td>
							<td>{ip}</td>
							<td>
								<div class="success">{login.success}</div>
								/
								<div class="failure">{login.count - login.success}</div>
							</td>
							<td>{login.count}</td>
							<td>{login.type}</td>
						</tr>
					{/each}
				</table>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		min-height: 100vh;
		width: 100%;
	}

	.container {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-height: 100vh;
		padding: 1rem;
		box-sizing: border-box;
	}

	.topbar {
		width: 100%;
		padding: 0.5rem;
		box-sizing: border-box;
	}

	.dashboard {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding: 1rem;
		gap: 1rem;
		box-sizing: border-box;
	}

	.emoji-container {
		width: 100%;
		text-align: center;
		padding: 1rem;
		box-sizing: border-box;
	}

	.emoji-container h1 {
		margin: 0;
		font-size: clamp(2rem, 10vw, 6rem);
	}

	.table-container {
		width: 100%;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 1rem;
	}

	th,
	td {
		padding: 0.5rem;
		text-align: left;
	}

	.success {
		color: greenyellow;
		display: inline;
	}

	.failure {
		color: red;
		display: inline;
	}

	button {
		font-size: 1rem;
		padding: 0.5rem 1rem;
	}

	@media (max-width: 768px) {
		.container {
			padding: 0.5rem;
		}

		table {
			font-size: 0.875rem;
		}

		th,
		td {
			padding: 0.25rem;
		}
	}
</style>
