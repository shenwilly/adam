<script>
    import { current_page } from '../router.js';
    import { onMount } from 'svelte';

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

    function submitCreateFamilyTree() {
        console.log("createing")
    }

    let form;
	onMount(() => {
        form.addEventListener("submit", 
        function(event) {
            event.preventDefault();

            // write stuff
            if (form.checkValidity()) submitCreateFamilyTree();

        });
	});
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
            <h3 class="font-weight-bold">Create Family Tree</h3>
        </div>
	</div>
	<div class="row">
		<div class="col">
            <form bind:this={form}>
                <div class="form-row">
                    <div class="form-group col-md-6 col-lg-4">
                        <label for="firstNamesInput">First Names</label>
                        <input type="text" class="form-control" id="firstNamesInput" placeholder="First Names" required>
                    </div>
                    <div class="form-group col-md-6 col-lg-4">
                        <label for="lastNamesInput">Last Names</label>
                        <input type="text" class="form-control" id="lastNamesInput" placeholder="Last Names">
                    </div>
                </div>
                <div class="form-group">
                    <label for="genderRadio">Gender</label>
                    <div class="row">
                        <div class="col">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="genderRadioMale" value="male" required>
                                <label class="form-check-label" for="genderRadioMale">Male</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="genderRadioFemale" value="female">
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
                            <input type="text" class="form-control" id="birthplaceInput" placeholder="Birthplace city / area" required>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="birthDateInput">Birthdate</label>
                    <div class="row">
                        <div class="col-md-4 col-sm-6 col-xs-12">
                            <select id="birthMonthInput" class="form-control" required>
                                <option selected value="">Choose birth month</option>
                                {#each month_list as month}
                                    <option value="{month.value}">{month.label}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="col-md-2 col-sm-4 col-xs-12">
                            <input type="number" min="0" max="{current_year}" required class="form-control" id="birthYearInput" placeholder="Birth year">
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn bg-accent">Submit</button>
            </form>
		</div>
	</div>
</div>