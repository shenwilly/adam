<script>
    import CreateFamilyMemberDialog from '../components/CreateFamilyMemberDialog.svelte';
    import { current_page } from '../router.js';
    import { onMount } from 'svelte';
    import { user_profile, fetch_family_members } from '../arweave.js';

    console.log($user_profile);
    
    function goToIndex(event) {
        $current_page = "index";
    }
    
    let profile_data;
    function showCreateParent(event) {
        console.log(selected_member.family_id);
        profile_data = {
            family_id: selected_member.family_id,
            reference_id: selected_member.id,
            role: "Parent"
        };
        showCreateDialog();
    }
    function showCreateSpouse(event) {
        profile_data = {
            family_id: selected_member.family_id,
            reference_id: selected_member.id,
            role: "Spouse"
        };
        showCreateDialog();
    }
    function showCreateChild(event) {
        profile_data = {
            family_id: selected_member.family_id,
            reference_id: selected_member.id,
            role: "Child"
        };
        showCreateDialog();
    }
    function showCreateDialog() {
        let $j = jQuery.noConflict();
        $j('#create-family-member-dialog').modal('show');
    }

    let selected_member;
    let family_members_map = {};
    family_members_map[$user_profile.id] = $user_profile;

    let data = [];
    let user_profile_data = {
        name: $user_profile.fullname(),
        class: "node",
        textClass: "nodeText",
        extra: {
            "id": $user_profile.id,
        }
    };
    data.push(user_profile_data);

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
        rootMember = parentMembers[0];
        // console.log(rootMember);
        // console.log(originalMember);
        // console.log(parentRelations);
        // console.log(family_members_map);
        
        let treeData = {};
        treeData = generateTree(rootMember);
        // data = [treeData,];
        function generateTree(profile) {
            let data = {
                name: profile.fullname(),
                class: "node",
                textClass: "nodeText",
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
                children_ids.forEach((child_id) => {
                    let child = family_members_map[child_id];
                    let child_data = generateTree(child);
                    data.children.push(child_data);
                });
            } else {
                data.marriages[0].children = [];
                children_ids.forEach((child_id) => {
                    let child = family_members_map[child_id];
                    let child_data = generateTree(child);
                    data.marriages[0].children.push(child_data);
                });
            }
            return data;
        };
        return treeData;
    }
    // let data = [{
    //     name: "Father",
    //     class: "node",
    //     textClass: "nodeText",
    //     marriages: [{
    //         spouse: {
    //             name: "Mother",
    //         },
    //         children: [{
    //             name: "Child",
    //             class: "node",
    //             textClass: "nodeText",
    //             children: [
    //                 {
    //                     name: "Grandchild",
    //                 }
    //             ],
    //         }]
    //     },
    //     ],
    //     extra: {
    //         "id": 1,
    //     }
    // }];

    let options = {
        target: '#canvas',
        debug: false,
        width: 600,
        height: 300,
        callbacks: {
            nodeClick: function(name, extra) {
                console.log(extra.id);
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

	onMount(async () => {
        let family_members_data = await fetch_family_members($user_profile.family_id);
        let data = createFamilyTree(family_members_data);
        console.log("??", data);
        dTree.init([data,], options);
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
                <h3 class="font-weight-bold">Family Tree</h3> (click a family member to see their information)
            </span>
        </div>
	</div>
	<div class="row">
		<div class="col">
            <div id="canvas"></div>
		</div>
	</div>
    {#if selected_member !== undefined}
        <div class="mt-2">
            <div class="row">
                <div class="col">
                    <h4 class="font-weight-bold">
                        {selected_member.fullname()} 
                        <i class="fa fa-pencil-square-o dark-accent clickable" aria-hidden="true" data-toggle="modal" data-target="#create-family-member-dialog"></i>
                    </h4> 
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p>Sex: {selected_member.sex()}</p>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p>Birth: {selected_member.birth()}</p>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <span>Father: -</span>
                    <i class="fa fa-plus-square dark-accent clickable" on:click={showCreateParent} aria-hidden="true"></i>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p>Spouse: Annisa Cohen</p>
                    <!-- <span>Spouse: </span> -->
                    <i class="fa fa-pencil-square-o dark-accent clickable" aria-hidden="true"></i>
                    <i class="fa fa-plus-square dark-accent clickable" on:click={showCreateSpouse} aria-hidden="true"></i>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <span>Children: </span>
                    <i class="fa fa-plus-square dark-accent clickable" on:click={showCreateChild} aria-hidden="true"></i>
                    <ul>
                        <li>Anna Bethany  <i class="fa fa-pencil-square-o dark-accent clickable" aria-hidden="true"></i></li>
                        <li>Aban Bethany  <i class="fa fa-pencil-square-o dark-accent clickable" aria-hidden="true"></i></li>
                    </ul>

                </div>
            </div>
        </div>
    {/if}
</div>

<CreateFamilyMemberDialog {profile_data}/>