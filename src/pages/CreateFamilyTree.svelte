<script>
    import { current_page } from '../router.js';
    import { onMount } from 'svelte';
    import { create_profile, get_transaction_status, selected_profile, fetch_self_identity, public_address } from '../arweave.js'

    let month_list = [
        {value: 1, label: 'January'},
        {value: 2, label: 'February'},
        {value: 3, label: 'March'},
        {value: 4, label: 'April'},
        {value: 5, label: 'May'},
        {value: 6, label: 'June'},
        {value: 7, label: 'July'},
        {value: 8, label: 'August'},
        {value: 9, label: 'September'},
        {value: 10, label: 'October'},
        {value: 11, label: 'November'},
        {value: 12, label: 'December'},
    ];
    let current_year = new Date().getFullYear();

    function goToIndex(event) {
        $current_page = "index";
    }

    let form;
	onMount(() => {
        form.addEventListener("submit", 
        function(event) {
            event.preventDefault();
            if (form.checkValidity()) submitCreateFamilyTree();
        });
    });
    
    let is_loading = false;
    let is_done = false;
    
    async function submitCreateFamilyTree() {
        is_loading = true;
        let form_data = new FormData(form);
        let form_data_map = {};
        form_data.forEach((value, key) => {form_data_map[key] = value});
        let transaction_id = await create_profile(form_data_map, true);

        let $j = jQuery.noConflict();
        $j('#success-dialog').modal('show');
        checkStatus(transaction_id);
    }

    async function checkStatus(tx_id) {
        setTimeout(async function() {
			let response = await get_transaction_status(tx_id);
            if (response.status == 200) {
                const profile = await fetch_self_identity(public_address);
                $selected_profile = profile;
                $current_page = "tree";
            } else {
                checkStatus(tx_id);
            }
        }, 5000);
	}

    let close_modal_button;
	function closeModal(event) {
        close_modal_button.click();
        is_done = false;
	}
</script>

<style>

</style>

<div class="container">
	<div class="row">
		<div class="col mt-3 mb-3">
			<button type="button" class="btn bg-green" on:click={goToIndex}>
                <i class="fa fa-angle-double-left" aria-hidden="true"></i> Back
            </button>
		</div>
	</div>
	<div class="row">
        <div class="col mb-2">
            <h3 class="font-weight-bold">Create Your Profile</h3>
        </div>
	</div>
	<div class="row">
        {#if is_loading}
            <div class="col modal-height">
                <div class="text-center mt-5">
                    <i class="fa fa-spinner fa-pulse fa-4x fa-fw dark-accent mt-4"></i>
                </div>
            </div>
        {/if}
		<div class="col {is_loading ? 'hide' : 'show'}">
            <form bind:this={form}>
                <div class="form-row">
                    <div class="form-group col-md-6 col-lg-4">
                        <label for="firstNamesInput">First Names</label>
                        <input type="text" name="first_name" class="form-control" id="firstNamesInput" placeholder="First Names" required>
                    </div>
                    <div class="form-group col-md-6 col-lg-4">
                        <label for="lastNamesInput">Last Names</label>
                        <input type="text" name="last_name" class="form-control" id="lastNamesInput" placeholder="Last Names">
                    </div>
                </div>
                <div class="form-group">
                    <label for="genderRadio">Gender</label>
                    <div class="row">
                        <div class="col">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="gender" id="genderRadioMale" value="male" required>
                                <label class="form-check-label" for="genderRadioMale">Male</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="gender" id="genderRadioFemale" value="female">
                                <label class="form-check-label" for="genderRadioFemale">Female</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                <div class="form-group">
                    <label for="birthplaceInput">Birthplace</label>
                    <div class="row">
                        <div class="col-md-12 col-lg-6">
                            <input type="text" name="birthplace" class="form-control" id="birthplaceInput" placeholder="Birthplace city / area" required>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="birthDateInput">Birthdate</label>
                    <div class="row">
                        <div class="col-md-4 col-sm-6 col-xs-12">
                            <select name="birth_month" id="birthMonthInput" class="form-control" required>
                                <option selected value="">Choose birth month</option>
                                {#each month_list as month}
                                    <option value="{month.value}">{month.label}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-4 col-xs-12">
                            <input name="birth_year" type="number" min="0" max="{current_year}" required class="form-control" id="birthYearInput" placeholder="Birth year">
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn bg-accent">Submit</button>
            </form>
		</div>
	</div>
</div>


<div class="modal fade" id="success-dialog" tabindex="-1" role="dialog" aria-labelledby="SuccessDialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Create Family Tree</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" bind:this={close_modal_button} >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
            <div class="col modal-height">
                <div class="text-center mt-5">
                    <div class="mt-4" style="hvertical-align: middle; text-align: center">
                        <i class="fa fa-check-circle fa-5x dark-accent mt-4 mb-3" aria-hidden="true"></i>
                        <br>
                        <h5>Success!</h5>
                        <p>Each save will take a few minutes. Learn more about how we store your data permanently on <a 
                            href="https://www.arweave.org/"
                            target="_blank">Arweave</a>.</p>
                    </div>
                    <div class="mt-3" style="text-align: center;">
                        <button type="button" class="btn bg-accent px-5" on:click={closeModal}>Close</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</div>