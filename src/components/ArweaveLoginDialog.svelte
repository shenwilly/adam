<script>
	import { arweave, login } from '../arweave.js';
	
	let processing_wallet = false;
	let login_success = false;
	let file_input;
	let close_modal_button;
	function handleUpload(event) {
		processing_wallet = true;
		let fr = new FileReader();
		fr.onload = async function (ev) {
			try {
				await login(ev.target.result);
				processing_wallet = false;
				login_success = true;
			} catch (err) {
				alert('Error logging in: ' + err);
			}
		}
		fr.readAsText(file_input.files[0]);
	}

	function closeModal(event) {
		close_modal_button.click();
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
        <button type="button" bind:this={close_modal_button} class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="min-height: 265px">
	  	{#if processing_wallet === false}
			{#if login_success === false}
				<div class="file-input">
					<input class="clickable" type="file" id="file" bind:this={file_input} on:change={handleUpload}>
					<div id="desc">Drop an Arweave wallet keyfile to start</div>
				</div>
				<div class="mt-3">
					<p style="text-align: center;">
						No wallet? Get one <a href="https://tokens.arweave.org/" target="_blank">here</a>!
					</p>
				</div>
			{:else}
				<div style="height: 200px; vertical-align: middle; text-align: center">
					<i class="fa fa-check-circle fa-5x dark-accent mt-4 mb-3" aria-hidden="true"></i>
					<br>
					<h5>Success!</h5>
				</div>
				<div class="mt-3" style="text-align: center;">
					<button type="button" class="btn bg-accent px-5" on:click={closeModal}>Close</button>
				</div>
			{/if}
		{:else}
			<div style="text-align: center" class="mt-5">
				<i class="fa fa-spinner fa-pulse fa-4x fa-fw dark-accent"></i>
			</div>
		{/if}
      </div>
    </div>
  </div>
</div>