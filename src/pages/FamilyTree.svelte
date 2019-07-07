<script>
    import { current_page } from '../router.js';
    import { onMount } from 'svelte';
    
    function goToIndex(event) {
        $current_page = "index";
    }

	onMount(() => {
        let data = [{
            name: "Father",
            class: "node",
            textClass: "nodeText",
            children: [{
                name: "Child",
                class: "node",
                textClass: "nodeText",
                children: [
                    {
                        name: "Grandchild",
                    }
                ],
            }],
            marriages: [{
                spouse: {
                    name: "Mother",
                },
                children: [{
                    name: "Child",
                    class: "node",
                    textClass: "nodeText",
                    children: [
                        {
                            name: "Grandchild",
                        }
                    ],
                }]
            },{
                spouse: {
                    name: "Mother",
                },
                children: [{
                    name: "Child",
                    class: "node",
                    textClass: "nodeText",
                    children: [
                        {
                            name: "Grandchild",
                        }
                    ],
                }]
            }],
            extra: {
                "id": 1,
            }
        }];

        let options = {
            target: '#canvas',
            debug: false,
            width: 600,
            height: 300,
            callbacks: {
                nodeClick: function(name, extra) {
                    console.log('Click: ' + name);
                    console.log(extra.id);
                },
                nodeRightClick: function(name, extra) {

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
        dTree.init(data, options);

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
            <h3 class="font-weight-bold">Family Tree</h3>
        </div>
	</div>
	<div class="row">
		<div class="col">
            <div id="canvas"></div>
		</div>
	</div>
</div>