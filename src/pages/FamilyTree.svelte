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

    // let selected_member_id;
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
        // name: "David Aban Shacklestorm",
        // class: "node",
        // textClass: "nodeText",
        // extra: {
        //     "id": '1',
        // }
    };
    data.push(user_profile_data);
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

	onMount(() => {
        dTree.init(data, options);

        fetch_family_members($user_profile.family_id);
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
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <span>Children: </span>
                    <i class="fa fa-plus-square dark-accent clickable" aria-hidden="true"></i>
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