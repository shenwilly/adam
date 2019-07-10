<script>
    import CreateFamilyMemberDialog from '../components/CreateFamilyMemberDialog.svelte';
    import EditFamilyMemberDialog from '../components/EditFamilyMemberDialog.svelte';
    import { current_page } from '../router.js';
    import { onMount } from 'svelte';
    import { user_profile, fetch_family_members, is_connected } from '../arweave.js';

    export let profile;
    let selected_member = profile;
    let profile_to_edit = profile;
    
    function goToIndex(event) {
        $current_page = "index";
    }
    
    let profile_data;

    function showCreateParent(event) {
        if (!$is_connected) {
            showLoginDialog();
            return;
        }
        profile_data = {
            family_id: selected_member.family_id,
            reference_id: selected_member.id,
            role: "Parent"
        };
        showCreateDialog();
    }
    function showCreateSpouse(event) {
        if (!$is_connected) {
            showLoginDialog();
            return;
        }
        profile_data = {
            family_id: selected_member.family_id,
            reference_id: selected_member.id,
            role: "Spouse"
        };
        showCreateDialog();
    }
    function showCreateChild(event) {
        if (!$is_connected) {
            showLoginDialog();
            return;
        }
        profile_data = {
            family_id: selected_member.family_id,
            reference_id: selected_member.id,
            role: "Child"
        };
        showCreateDialog();
    }

    function showEditProfile(profile) {
        if (!$is_connected) {
            showLoginDialog();
            return;
        }
        profile_to_edit = profile;
        showEditDialog();
    }
    function showEditDialog() {
        let $j = jQuery.noConflict();
        $j('#edit-family-member-dialog').modal('show');
    }
    function showCreateDialog() {
        let $j = jQuery.noConflict();
        $j('#create-family-member-dialog').modal('show');
    }
    function showLoginDialog() {
        let $j = jQuery.noConflict();
        $j('#arweave-wallet-dialog').modal('show');
    }

    let family_members_map = {};
    family_members_map[profile.id] = profile;

    function createFamilyTree(family_members) {
        if (family_members === undefined) return;

        let rootMember;
        let originalMember;
        let parentMembers = [];
        let childMembers = [];
        let spouseMembers = [];
        let parentRelations = [];
        let childRelations = [];
        let spouseRelations = [];
        // let family_members_map = {}
        family_members.forEach(family_member => {
            family_members_map[family_member.id] = family_member;
            if (family_member.role === "parent") {
                parentMembers.push(family_member);
                parentRelations.push({
                    id: family_member.id,
                    reference_id: family_member.reference_id
                });
            } else if (family_member.role === "child") {
                childMembers.push(family_member);
                childRelations.push({
                    id: family_member.id,
                    reference_id: family_member.reference_id
                });
            } else if (family_member.role === "spouse") {
                spouseMembers.push(family_member);
                spouseRelations.push({
                    id: family_member.id,
                    reference_id: family_member.reference_id
                });
            } else {
                originalMember = family_member;
            }
        });
        parentRelations.forEach(parentReference => {
            let index = -1;
            for(var i = 0; i < parentMembers.length; i++) {
                if (parentMembers[i].id == parentReference.reference_id) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                parentMembers.splice(index, 1);
            }
        });

        if (parentMembers.length == 0) {
            rootMember = originalMember;
        } else {
            rootMember = parentMembers[0];
        }
        // console.log(rootMember);
        // console.log(originalMember);
        // console.log(parentRelations);
        // console.log(family_members_map);
        
        let treeData = {};
        treeData = generateTree(rootMember);
        // data = [treeData,];
        function generateTree(profile) {
            console.log(profile);
            let data = {
                name: profile.fullname(),
                // selectedNodeClass: "hello",
                extra: {"id": profile.id},
            }

            for(var i = 0; i < spouseRelations.length; i++) {
                if (spouseRelations[i].reference_id == profile.id) {
                    let spouse = family_members_map[spouseRelations[i].id];
                    let spouseData = generateTree(spouse);
                    data.marriages = [];
                    data.marriages.push({
                        spouse: spouseData,
                    });
                    family_members_map[profile.id].spouse = spouse;
                    family_members_map[spouseRelations[i].id].spouse = profile;
                    break;
                }
            };
        
            let children_ids = [];
            for(var i = 0; i < parentRelations.length; i++) {
                if (parentRelations[i].id == profile.id) {
                    let child_id = parentRelations[i].reference_id;
                    if (!children_ids.includes(child_id)) children_ids.push(child_id);
                }
            };
            for(var i = 0; i < childRelations.length; i++) {
                if (childRelations[i].reference_id == profile.id) {
                    let child_id = childRelations[i].id;
                    if (!children_ids.includes(child_id)) children_ids.push(child_id);
                }
            };
            
            if (data["marriages"] === undefined || data["marriages"].length == 0) {
                data.children = [];
                family_members_map[profile.id].children = [];
                children_ids.forEach((child_id) => {
                    let child = family_members_map[child_id];
                    let child_data = generateTree(child);
                    data.children.push(child_data);
                    family_members_map[profile.id].children.push(child);
                    family_members_map[child_id].parent = profile;
                });
            } else {
                data.marriages[0].children = [];
                family_members_map[profile.id].children = [];
                family_members_map[family_members_map[profile.id].spouse.id].children = [];
                children_ids.forEach((child_id) => {
                    let child = family_members_map[child_id];
                    let child_data = generateTree(child);
                    data.marriages[0].children.push(child_data);
                    family_members_map[profile.id].children.push(child);
                    family_members_map[family_members_map[profile.id].spouse.id].children.push(child);
        
                    family_members_map[child_id].parent = profile;
                });
            }
            return data;
        };
        return treeData;
    }

    let options = {
        target: '#canvas',
        debug: false,
        width: 600,
        height: 300,
        callbacks: {
            nodeClick: function(name, extra) {
                // console.log(extra.id);
                selected_member = family_members_map[extra.id];
            },
            nodeRightClick: function(name, extra) {

            },
            nodeSize: function(nodes, width, textRenderer) {
                width += 40;
                let maxWidth = 0;
                let maxHeight = 0;
                let tmpSvg = document.createElement('svg');
                document.body.appendChild(tmpSvg);

                _.map(nodes, function(n) {
                    let container = document.createElement('div');
                    container.setAttribute('class', n.data.class);
                    container.style.visibility = 'hidden';
                    container.style.maxWidth = width + 'px';

                    let text = textRenderer(n.data.name, n.data.extra, n.data.textClass);
                    container.innerHTML = text;

                    tmpSvg.appendChild(container);
                    let height = container.offsetHeight;
                    tmpSvg.removeChild(container);

                    maxHeight = Math.max(maxHeight, height);
                    n.cHeight = height;
                    if (n.data.hidden) {
                        n.cWidth = 0;
                    } else {
                        n.cWidth = width;
                    }
                });
                document.body.removeChild(tmpSvg);

                return [width, maxHeight];
            },
        },
        margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        nodeWidth: 100,
        styles: {
            node: 'node',
            linage: 'linage',
            marriage: 'marriage',
            text: 'nodeText'
        }
    };

    let is_loading = true;
	onMount(async () => {
        console.log(profile, "<<");
        let family_members_data = await fetch_family_members(profile.family_id);
        console.log(family_members_data, "<<");
        let data = createFamilyTree(family_members_data);
        dTree.init([data,], options);
        is_loading = false;
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
            <span>
                <h3 class="font-weight-bold">Family Tree</h3> {!is_loading ? '(click a family member to see their information)' : ''}
            </span>
        </div>
	</div>
	<div class="row {!is_loading ? 'show' : 'hide'}">
		<div class="col">
            <div id="canvas"></div>
		</div>
	</div>
    {#if is_loading}
        <div class="row mt-5">
            <div class="col">
                <div style="text-align: center">
                    <i class="fa fa-spinner fa-pulse fa-4x fa-fw dark-accent"></i>
                </div>
            </div>
        </div>
    {:else}
        {#if selected_member !== undefined}
            <div class="mt-2">
                <div class="row">
                    <div class="col">
                        <h4 class="font-weight-bold">
                            {selected_member.fullname()} 
                            <i class="fa fa-pencil-square-o dark-accent clickable" aria-hidden="true" 
                            on:click={() => showEditProfile(selected_member)} ></i>
                        </h4> 
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col">
                        <span>Sex: {selected_member.sex()}</span>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col">
                        <span>Birth: {selected_member.birth()}</span>
                    </div>
                </div>
                {#if selected_member.role !== "spouse"}
                <div class="row mb-2">
                    <div class="col">
                        <span>Father: {selected_member.parent ? selected_member.parent.fullname() : '-' }</span>
                        {#if selected_member.parent}
                            <i class="fa fa-pencil-square-o dark-accent clickable" aria-hidden="true"
                            on:click={() => showEditProfile(selected_member.parent)} ></i>
                        {:else}
                            <i class="fa fa-plus-square dark-accent clickable" on:click={showCreateParent} aria-hidden="true"></i>
                        {/if}
                    </div>
                </div>
                {/if}
                <div class="row mb-2">
                    <div class="col">
                        <span>Spouse: {selected_member.spouse ? selected_member.spouse.fullname() : '-' }</span>
                        {#if selected_member.spouse}
                            <i class="fa fa-pencil-square-o dark-accent clickable" aria-hidden="true"
                            on:click={() => showEditProfile(selected_member.spouse)} ></i>
                        {:else}
                            <i class="fa fa-plus-square dark-accent clickable" on:click={showCreateSpouse} aria-hidden="true"></i>
                        {/if}
                    </div>
                </div>
                <div class="row mb-4">
                    <div class="col">
                        <span>Children: </span>
                        <i class="fa fa-plus-square dark-accent clickable" on:click={showCreateChild} aria-hidden="true"></i>
                        {#if selected_member.children}
                        <ul>
                            {#each selected_member.children as child}
                                <li>{child.fullname()}  <i class="fa fa-pencil-square-o dark-accent clickable" aria-hidden="true"
                                on:click={() => showEditProfile(child)} ></i></li>
                            {/each}
                        </ul>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    {/if}
</div>

<CreateFamilyMemberDialog {profile_data}/>
<EditFamilyMemberDialog profile={profile_to_edit}/>