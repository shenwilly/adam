<script>
	import { arweave } from './arweave.js';
	export let open = false;

	// function login (files) {
	// 	var fr = new FileReader()
	// 	fr.onload = function (ev) {
	// 		try {
	// 			wallet = JSON.parse(ev.target.result)

	// 			var public_address;
	// 			arweave.wallets.jwkToAddress(wallet).then((address) => {
	// 				public_address = address;
	// 				update_login_state(true, public_address);
	// 			});
	// 		} catch (err) {
	// 			alert('Error logging in: ' + err)
	// 		}
	// 	}
	// 	fr.readAsText(files[0])
	// }
	let fileInput;
	function handleUpload(event) {
		let fr = new FileReader();
		fr.onload = function (ev) {
			try {
				let wallet = JSON.parse(ev.target.result)
				console.log(wallet);

				let public_address;
				arweave.wallets.jwkToAddress(wallet).then((address) => {
					public_address = address;
					// update_login_state(true, public_address);
					console.log(public_address);
				});
			} catch (err) {
				alert('Error logging in: ' + err)
			}
		}
		console.log(fileInput.files)
		fr.readAsText(fileInput.files[0]);
	}

	function handleClickOutsideDialog(event) {
		if (open === true && event.target.closest('.loginDialog') === null) open = false;
	}
</script>

<style>
	.file-input{
		height: 100px;
		border: 2px dashed #62666f;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		margin: auto;
		padding: 15px;
		/* max-width: 300px; */
	}
	.file-input input[type=file]{
		opacity: 0;
		position: absolute;
		background: none;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}
</style>

<svelte:window on:click={handleClickOutsideDialog}/>
<dialog {open} class="loginDialog br3">
	<div class="file-input">
		<input class="clickable" type="file" id="file" bind:this={fileInput} on:change={handleUpload}>
		<div id="desc">Drop an Arweave wallet keyfile to login</div>
	</div>
	<div class="mt-3">
		<p style="text-align: center;">
			No wallet? Get one <a href="https://tokens.arweave.org/" target="_blank">here</a>!
		</p>
	</div>
</dialog>
