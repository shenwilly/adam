<script>
	import { arweave } from './arweave.js';
	import ArweaveLoginDialog from './ArweaveLoginDialog.svelte';
	arweave.network.getInfo().then(console.log);

	function goToHome(event) {
		console.log("home");
	}
</script>

<style>
	.app-title {
		font-family: 'DM Serif Display', serif;
	}
	
	.divider {
	display: flex;
	}
	.divider:before, .divider:after {
	content: "";
	flex: 1;
	}
	.line {
	align-items: center;
	margin: 1em -1em;
	}
	.line:before, .line:after {
	height: 1px;
	margin: 0 1em;
	}
	.razor:before, .razor:after {
	box-shadow: 0 0.5px 0 black;
	}
	.double-razor:before, .double-razor:after {
	height: 3px;
	box-shadow: 0 -0.5px 0 black, 0 0.5px 0 black;
	border-width: 0;
	}
	::-webkit-input-placeholder {
   text-align: center;
	}

	:-moz-placeholder { /* Firefox 18- */
	text-align: center;  
	}

	::-moz-placeholder {  /* Firefox 19+ */
	text-align: center;  
	}

	:-ms-input-placeholder {  
	text-align: center; 
	}

</style>

<ArweaveLoginDialog />

<!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#arweave-wallet-dialog">
  Unlock Wallet
</button> -->

<div class="container">
	<div class="row">
		<div class="col mt-3 mb-3">
			<div class="display-1 text-center app-title">
				<span class="clickable" on:click={goToHome}>
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
		  <button type="button" class="btn bg-accent">Create Family Tree</button>
		</div>
	</div>
	<div class="row">
		<div class="col mt-3 mb-3">
			<div class="text-center">
				<div class="divider line double-razor font-weight-bold">
					or
				</div>
			</div>
		</div>
	</div>
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