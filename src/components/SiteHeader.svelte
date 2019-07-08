<script>
	import { arweave, is_connected } from '../arweave.js';

	let showNotifications = false;
	function toggleNotifications(event) {
		showNotifications = !showNotifications;
	}
</script>

<style>
	.notification-card {
		margin: 3px;
	}

	.notification-box {
		padding-top: 30px;
		/* border: 1px solid #a5d6a7;  */
		border-radius: 3px;
		width: 30vw;
		position: absolute;
		right: 0; 
		top: 0; 
		z-index: -100;
	}

	@media (max-width: 991.98px) {
		.notification-box {
			width: 40vw;
		}
		
	}
	@media (max-width: 767.98px) {
		.notification-box {
			width: 55vw;
		}
	}
	@media (max-width: 575.98px) {
		.notification-box {
			width: 100vw;
		}
	}

</style>

<div class="container" style="position: relative; z-index: 200">
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
				<i class="fa fa-bell clickable mx-2" aria-hidden="true" on:click={toggleNotifications}></i>
				<!-- <span class="white-border clickable ml-2">My Family Tree</span> -->
			</div>
		</div>
	{/if}
	{#if showNotifications === true}
	<div class="notification-box bg-dark-accent">
		<div class="card notification-card">
			<div class="card-body">
				This is some text within a card body.
			</div>
		</div>

		<div class="card notification-card">
			<div class="card-body">
				This is some text within a card body.
			</div>
		</div>
		<div class="card notification-card">
			<div class="card-body">
				This is some text within a card body.
			</div>
		</div>
	</div>
	{/if}
</div>