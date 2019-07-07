<script>
    import Divider from '../components/Divider.svelte';
    import { current_page } from '../router.js';

    function goToCreate(event) {
        $current_page = "tree";
        // $current_page = "create";
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
			<div class="text-center">Create and store your own family tree. Forever.</div>
		</div>
	</div>
	<div class="row">
		<div class="col d-flex justify-content-center mt-3">
		  <!-- <button type="button" class="btn bg-accent" data-toggle="modal" data-target="#create-family-tree">Create Family Tree</button> -->
		  <button type="button" class="btn bg-accent" on:click={goToCreate}>Create Family Tree</button>
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