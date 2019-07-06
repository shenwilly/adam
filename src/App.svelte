<script>
	import { arweave } from './arweave.js';
	import ArweaveLoginDialog from './ArweaveLoginDialog.svelte';
	arweave.network.getInfo().then(console.log);

	let isLoginDialogOpen;
	function handleClickLogin(event) {
		isLoginDialogOpen = true;
	}
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<ArweaveLoginDialog bind:open={isLoginDialogOpen} />

<div>
	<button on:click|stopPropagation={handleClickLogin}>Login</button>
</div>
