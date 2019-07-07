<script>
	import { arweave, is_connected } from '../arweave.js';
</script>

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
</div>