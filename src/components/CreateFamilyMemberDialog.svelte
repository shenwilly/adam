<script>
    import { create_profile } from '../arweave.js';
    import { onMount } from 'svelte';

    export let profile_data;
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

    let form;
	onMount(() => {
        form.addEventListener("submit", 
        function(event) {
            
            event.preventDefault();
            if (form.checkValidity()) submitCreateFamilyMember();
        });
    });
    
    let is_loading = false;
    let is_done = false;
    async function submitCreateFamilyMember() {
        is_loading = true;
        console.log("creating");
        let form_data = new FormData(form);
        let form_data_map = {};
        form_data.forEach((value, key) => {form_data_map[key] = value});

        if (profile_data !== undefined) {
            form_data_map["reference_id"] = profile_data.reference_id;
            form_data_map["family_id"] = profile_data.family_id;
            form_data_map["role"] = profile_data.role.toLowerCase();
            await create_profile(form_data_map, false);
            is_loading = false;
            is_done = true;
        }
    }
    
    let close_modal_button;
	function closeModal(event) {
        close_modal_button.click();
        is_done = false;
	}
</script>

<style>
    .modal-height {
        height: 370px;
    }

</style>

<div class="modal fade" id="create-family-member-dialog" tabindex="-1" role="dialog" aria-labelledby="CreateFamilyMemberDialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add {profile_data !== undefined ? profile_data.role : 'Family Member' }</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" bind:this={close_modal_button} >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
            {#if is_loading}
                <div class="col modal-height">
                    <div class="text-center mt-5">
                        <i class="fa fa-spinner fa-pulse fa-4x fa-fw dark-accent mt-4"></i>
                    </div>
                </div>
            {/if}
            {#if is_done}
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
            {:else}
                <div class="col {is_loading ? 'hide' : 'show'}">
                    <form bind:this={form}>
                        <div class="form-row">
                            <div class="form-group col-md-6 col-lg-4">
                                <label for="firstNamesInput">First Names</label>
                                <input type="text" name="first_name" class="form-control" id="firstNamesInputCreate" placeholder="First Names" required>
                            </div>
                            <div class="form-group col-md-6 col-lg-4">
                                <label for="lastNamesInput">Last Names</label>
                                <input type="text" name="last_name" class="form-control" id="lastNamesInputCreate" placeholder="Last Names">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="genderRadio">Gender</label>
                            <div class="row">
                                <div class="col">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="gender" id="genderRadioMaleCreate" value="male" required>
                                        <label class="form-check-label" for="genderRadioMaleCreate">Male</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="gender" id="genderRadioFemaleCreate" value="female">
                                        <label class="form-check-label" for="genderRadioFemaleCreate">Female</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                        <div class="form-group">
                            <label for="birthplaceInput">Birthplace</label>
                            <div class="row">
                                <div class="col-md-12 col-lg-6">
                                    <input type="text" name="birthplace" class="form-control" id="birthplaceInputCreate" placeholder="Birthplace city / area" required>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="birthDateInput">Birthdate</label>
                            <div class="row">
                                <div class="col-md-4 col-sm-6 col-xs-12">
                                    <select name="birth_month" id="birthMonthInputCreate" class="form-control" required>
                                        <option selected value="">Choose birth month</option>
                                        {#each month_list as month}
                                            <option value="{month.value}">{month.label}</option>
                                        {/each}
                                    </select>
                                </div>
                                <div class="col-md-3 col-sm-4 col-xs-12">
                                    <input name="birth_year" type="number" min="0" max="{current_year}" required class="form-control" id="birthYearInputCreate" placeholder="Birth year">
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn bg-accent">Submit</button>
                    </form>
                </div>
            {/if}
        </div>
      </div>
    </div>
  </div>
</div>