<script>
	import { current_page } from '../router.js';
    import { is_connected, user_profile, search_family_tree, selected_profile } from '../arweave.js';
    
    function goToFamily(profile) {
		$selected_profile = profile;
		$current_page = "tree";
    }
    
    export let profiles = [];
    export let is_empty;
    export let is_searching;
</script>

<div class="mt-1 mb-5">
    {#if is_searching}
        <div class="row mt-3">
            <div class="col">
                <div style="text-align: center">
                    <i class="fa fa-spinner fa-pulse fa-4x fa-fw dark-accent"></i>
                </div>
            </div>
        </div>
    {:else}
        {#if !is_empty}
            {#if profiles.length > 0}
                {#each profiles as profile}
                    <div class="row">
                        <div class="offset-sm-1 offset-md-2 col-sm-10 col-md-8">
                            <div class="card mt-2">
                                <div class="card-body">
                                    <i class="clickable">
                                        <span class="badge badge-pill badge-green pull-right p-2" on:click={() => goToFamily(profile)}>See Family Tree</span>
                                    </i>
                                    <h5 class="card-title">{profile.fullname()}</h5>
                                    <p class="card-description mb-0">Birth: {profile.birth()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            {:else}
                <div class="row mt-3">
                    <div class="col">
                        <p style="text-align: center">No record found.</p>
                    </div>
                </div>
            {/if}
        {/if}
    {/if}
</div>