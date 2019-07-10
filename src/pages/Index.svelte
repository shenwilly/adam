<script>
    import Divider from '../components/Divider.svelte';
    import ProfileList from '../components/ProfileList.svelte';
	import { current_page } from '../router.js';
	import { is_connected, user_profile, search_family_tree, selected_profile } from '../arweave.js';

    function goToCreate(event) {
        $current_page = "create";
	}
    function goToManage(event) {
		$selected_profile = $user_profile;
		$current_page = "tree";
	}

	let search_query = '';
	let is_searching = false;
	let is_empty = true;
	let profiles;
	async function handleSearch(event) {
		if (event.key === "Enter") {
			if (search_query.length === 0) {
				profiles = [];
				is_empty = true;
				return;
			}

			is_empty = false;
			is_searching = true;
			profiles = await search_family_tree(search_query.toLowerCase());
			is_searching = false;
		}
	}
</script>

<style>
	.app-title {
		font-family: 'DM Serif Display', serif;
	}
	
	::-webkit-input-placeholder,
	:-moz-placeholder,
	::-moz-placeholder,
	:-ms-input-placeholder  {
   		text-align: center;
	}
</style>

<div class="container">
	<div class="row">
		<div class="col mt-3 mb-3">
			<div class="display-1 text-center app-title">
				<!-- <span class="clickable" on:click={goToHome}> -->
				<span>
					<i class="fa fa-envira fa-flip-horizontal" style="color: #75a478" aria-hidden="true"></i>Adam
				</span>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col">
			<div class="text-center">Create and store your own family tree. <strong>Forever.</strong></div>
		</div>
	</div>
	<div class="row">
		<div class="col d-flex justify-content-center mt-3">
		  <!-- <button type="button" class="btn bg-accent" data-toggle="modal" data-target="#create-family-tree">Create Family Tree</button> -->
		  {#if $is_connected === true && $user_profile !== undefined}
		  	<button type="button" class="btn bg-accent" on:click={goToManage}>Manage Family Tree</button>
		  {:else}
		  	{#if $is_connected === false}
		  		<button type="button" class="btn bg-accent" data-toggle="modal" data-target="#arweave-wallet-dialog">Create Family Tree</button>
			{:else}
		  		<button type="button" class="btn bg-accent" on:click={goToCreate}>Create Family Tree</button>
			{/if}
		  {/if}
		</div>
	</div>
	<Divider />
	<div class="row">
		<div class="col">
			<div class="text-center">Discover and trace your ancestry.</div>
		</div>
	</div>
	<div class="row">
		<div class="offset-sm-1 offset-md-2 col-sm-10 col-md-8 mt-3">
		  <input type="text" class="form-control" placeholder="Type a person's name or birth location here" 
		  	bind:value={search_query}
			on:keyup={handleSearch}>
		</div>
	</div>
	<ProfileList {profiles} {is_searching} {is_empty}/>
</div>