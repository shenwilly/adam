<script>
	import Index from './pages/Index.svelte';
	import CreateFamilyTree from './pages/CreateFamilyTree.svelte';
	import FamilyTree from './pages/FamilyTree.svelte';
	import SiteHeader from './components/SiteHeader.svelte';
	import ArweaveLoginDialog from './components/ArweaveLoginDialog.svelte';
	import CreateFamilyTreeDialog from './components/CreateFamilyTreeDialog.svelte';
	import { arweave, is_connected } from './arweave.js';
	import { current_page } from './router.js';
	
	import { fade, fly } from 'svelte/transition';
	arweave.network.getInfo().then(console.log);
</script>

<style>

</style>

<SiteHeader/>

<div class="container">
	{#if $current_page == "index"}
		<div>
			<Index/>
		</div>
	{:else if $current_page =="create"}
		<div>
			<CreateFamilyTree/>
		</div>
	{:else if $current_page == "tree"}
		<div>
			<FamilyTree/>
		</div>
	{/if}
</div>

<ArweaveLoginDialog />
<CreateFamilyTreeDialog />