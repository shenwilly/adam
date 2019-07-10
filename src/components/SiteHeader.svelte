<script>
	import { writable } from 'svelte/store';
	import { Notification } from '../models/notification.js';
	import { arweave, is_connected, notifications, notifications_counter, get_transaction_status } from '../arweave.js';

	let showNotifications = false;
	function toggleNotifications(event) {
		showNotifications = !showNotifications;
		if (showNotifications == false) {
			$notifications.forEach(notification => {
				notification.see();
			});
			$notifications_counter = 0;
		}
	}
	// console.log($notifications);
	checkStatus();

	async function checkStatus() {
		// console.log($notifications);
        setTimeout(async function() {
			await $notifications.forEach(async (notification) => {
				if (notification.status == "done") return;
				let response = await get_transaction_status(notification.id);
				if (response.status == 200) {
					notification.seen = false;
					notification.status = "done";
					$notifications_counter += 1;
				}
			});
			checkStatus();
        }, 5000);
	}
</script>

<style>
	.notification-card {
		margin: 3px;
	}

	.notification-box {
		padding-top: 37px;
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

	.card-body {
		color: black;
		padding: 0;
	}

	.unseen {
		background-color: #d7ffd9;
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
			<div class="px-2 mt-1">
				<i class="fa fa-circle accent" aria-hidden="true"></i>
				Connected
			</div>
			<div class="white-border px-2 ml-auto clickable mr-2" on:click={toggleNotifications}>
				Notifications 
				{#if $notifications_counter === 0}
				<span class="badge badge-light">0</span> 
				{:else}
				<span class="badge badge-danger">{$notifications_counter}</span> 
				{/if}
				<i class="fa fa-bell" aria-hidden="true"></i>
				<!-- <span class="white-border clickable ml-2">My Family Tree</span> -->
			</div>
		</div>
	{/if}
	{#if showNotifications === true}
	<div class="notification-box bg-dark-accent">
		{#each $notifications as notification }
		<div class="card notification-card">
			<div class="card-body {notification.seen ? 'seen' : 'unseen'}">
				<p style="float: right" class="text-muted">{notification.timestamp()}</p>
				{#if notification.status == "pending"}
					<i class="fa fa-spinner fa-pulse fa-2x fa-fw dark-accent ml-2 mt-4"></i>
				{:else}
					<i class="fa fa-check fa-2x dark-accent ml-2 mt-4"></i>
				{/if}
				<p class="pb-4" style="display: inline-block" >{notification.description}</p>
			</div>
		</div>
		{/each}
	</div>
	{/if}
</div>