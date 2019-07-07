<script>
    import { current_page } from '../router.js';

    function goToIndex(event) {
        $current_page = "index";
    }
</script>

<style>

</style>

<div class="container">
	<div class="row">
		<div class="col mt-3 mb-3">
			<button type="button" class="btn bg-green" on:click={goToIndex}>
                <i class="fa fa-angle-double-left" aria-hidden="true"></i>Back
            </button>
		</div>
	</div>
</div>