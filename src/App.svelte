<script>
	import Index from './pages/Index.svelte';
	import CreateFamilyTree from './pages/CreateFamilyTree.svelte';
	import FamilyTree from './pages/FamilyTree.svelte';
	import SiteHeader from './components/SiteHeader.svelte';
	import ArweaveLoginDialog from './components/ArweaveLoginDialog.svelte';
	import { arweave, is_connected, selected_profile } from './arweave.js';
	import { current_page } from './router.js';

	import { fade, fly } from 'svelte/transition';
	// arweave.network.getInfo().then(console.log);
</script>

<style>
</style>

<SiteHeader/>

<div class="container">
	<div class="{$current_page == "index" ? 'show' : 'hide'}">
		<Index/>
	</div>
	<div class="{$current_page == "create" ? 'show' : 'hide'}">
		<CreateFamilyTree/>
	</div>
	{#if $current_page == "tree"}
	<div>
		<FamilyTree profile={$selected_profile}/>
	</div>
	{/if}
</div>

<ArweaveLoginDialog />