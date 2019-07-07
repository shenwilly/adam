<script>
	import { arweave, is_connected, public_address } from '../arweave.js';
	
	let fileInput;
	let closeModalButton;
	function handleUpload(event) {
		let fr = new FileReader();
		fr.onload = function (ev) {
			try {
				let wallet = JSON.parse(ev.target.result)
				console.log(wallet);

				arweave.wallets.jwkToAddress(wallet).then((address) => {
					is_connected.set(true);
					public_address.set(address);
					closeModalButton.click();
				});
			} catch (err) {
				alert('Error logging in: ' + err)
			}
		}
		console.log(fileInput.files)
		fr.readAsText(fileInput.files[0]);
	}
</script>

<style>
	.file-input{
		height: 200px;
		border: 2px dashed #62666f;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		margin: auto;
		padding: 15px;
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

<div class="modal fade" id="arweave-wallet-dialog" tabindex="-1" role="dialog" >
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Unlock Wallet</h5>
        <button type="button" bind:this={closeModalButton} class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="file-input">
			<input class="clickable" type="file" id="file" bind:this={fileInput} on:change={handleUpload}>
			<div id="desc">Drop an Arweave wallet keyfile to login</div>
		</div>
		<div class="mt-3">
			<p style="text-align: center;">
				No wallet? Get one <a href="https://tokens.arweave.org/" target="_blank">here</a>!
			</p>
		</div>
      </div>
    </div>
  </div>
</div>