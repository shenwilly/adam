<script>
	import { arweave, is_connected } from './arweave.js';
	import ArweaveLoginDialog from './components/ArweaveLoginDialog.svelte';
	import CreateFamilyTreeDialog from './components/CreateFamilyTreeDialog.svelte';
	import Divider from './components/Divider.svelte';
	arweave.network.getInfo().then(console.log);

	function goToHome(event) {
		console.log("home");
	}
</script>

<style>
	.app-title {
		font-family: 'DM Serif Display', serif;
	}

	.white-border {
		border: 1px white solid; 
		border-radius: 7px;
		padding: 3px 5px;
	}
	
	::-webkit-input-placeholder,
	:-moz-placeholder,
	::-moz-placeholder,
	:-ms-input-placeholder  {
   		text-align: center;
	}
</style>

<ArweaveLoginDialog />
<CreateFamilyTreeDialog />

<div class="container">
	{#if $is_connected === false}
		<div class="row bg-dark-accent white py-1" style="border-radius: 0 0 10px 10px;">
			<div class="col py-1 d-none d-sm-block">
				<div class="text-center">Arweave wallet not connected. 
					<span class="ml-1 white-border clickable font-weight-bold" data-toggle="modal" data-target="#arweave-wallet-dialog">
						Click here to connect wallet
					</span>
				</div>
			</div>
			<div class="col py-1 d-xs-block d-sm-none">
				<div class="text-center">Arweave wallet not connected.
				<br>
				<span class="white-border mt-1 mb-1 clickable font-weight-bold"  data-toggle="modal" data-target="#arweave-wallet-dialog">
					Click here to connect wallet
				</span>
				</div>
			</div>
		</div>
	{:else}
		<div class="row bg-dark-accent white py-1 d-flex flex-row" style="border-radius: 0 0 10px 10px;">
			<div class="px-2">
				<i class="fa fa-circle accent" aria-hidden="true"></i>
				Connected
			</div>
			<div class="px-2 ml-auto">
				<i class="fa fa-bell clickable" aria-hidden="true"></i>
				<span class="white-border clickable ml-2">My Family Tree</span>
			</div>
		</div>
	{/if}

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
			<div class="text-center">Create and store your own family tree. Forever.</div>
		</div>
	</div>
	<div class="row">
		<div class="col d-flex justify-content-center mt-3">
		  <button type="button" class="btn bg-accent" data-toggle="modal" data-target="#create-family-tree">Create Family Tree</button>
		</div>
	</div>
	<Divider />
	<div class="row">
		<div class="col">
			<div class="text-center">Discover your ancestry.</div>
		</div>
	</div>
	<div class="row">
		<div class="offset-sm-1 offset-md-2 col-sm-10 col-md-8 mt-3">
		  <input type="text" class="form-control" placeholder="Type a person's name or birth location here">
		</div>
	</div>
</div>